from fastapi import FastAPI, Depends, HTTPException, status, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from sqlalchemy.orm import Session
from jose import JWTError, jwt
from typing import List
import os
from app.database import engine, get_db, Base, SessionLocal
from app import crud, schemas, utils, database, models

# Auto table initialization
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Shine Associates Real Estate API")
# This line tells Swagger where to find the token
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", 
                    "https://ecommerce-shine-groups-real-estate.vercel.app"], 
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"],
)



def seed_admin_user():
    db = SessionLocal()
    try:
        
        admin_email = os.getenv("ADMIN_EMAIL")
        admin_password = os.getenv("ADMIN_PASSWORD")
        admin_pin = os.getenv("ADMIN_SECURITY_PIN")
        # Check if the master admin already exists
        admin_exists = crud.get_user_by_email(db, email=admin_email)

        if not admin_email or not admin_password:
            print("[SEEDING ERROR] ADMIN_EMAIL or ADMIN_PASSWORD not configured.")
            return

        if not admin_exists:
            print("Creating default admin account...")
            admin_data = schemas.UserCreate(
                email=admin_email,
                password=admin_password, # Force change later
                security_pin=admin_pin,
                full_name="System Administrator",
                mob_number="+919876543210"
            )
            # Create the user normally, but explicitly force the role to 'admin' in CRUD logic
            crud.create_admin_user(db=db, user=admin_data) 
    except Exception as e:
        print(f"[SEEDING ERROR] Failed to run database seed: {e}")
    finally:
        db.close()

@app.on_event("startup")
def startup_event():
    seed_admin_user()

# Function to get the current user from the token
def get_current_user(db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        # Decode the token using  Secret Key
        payload = jwt.decode(token, utils.SECRET_KEY, algorithms=[utils.ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
        
    user = crud.get_user_by_email(db, email=email)
    if user is None:
        raise credentials_exception
    return user

#ADMINISTRATIVE SECURITY GUARDRAIL DEP

def get_current_admin(current_user: models.User = Depends(get_current_user)):
    """Validates that the logged-in profile possesses explicit system admin privileges"""
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="Administrative access required. Request denied."
        )
    return current_user


# ADMINISTRATIVE DATA MANAGEMENT ENDPOINTS : Admin Control Panel Area

@app.get("/admin/users", response_model=List[schemas.UserResponse])
def admin_get_all_users(
    db: Session = Depends(get_db), 
    current_admin: models.User = Depends(get_current_admin)
):
    """Fetches all registered user access profiles from the MySQL user table"""
    return db.query(models.User).all()


@app.get("/admin/inquiries", response_model=List[schemas.InquiryOut])
def admin_get_all_inquiries(
    db: Session = Depends(get_db), 
    current_admin: models.User = Depends(get_current_admin)
):
    """Fetches every incoming lead in the database for comprehensive admin oversight"""
    return db.query(models.Inquiry).order_by(models.Inquiry.created_at.desc()).all()


@app.delete("/admin/users/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def admin_delete_user(
    user_id: int, 
    db: Session = Depends(get_db), 
    current_admin: models.User = Depends(get_current_admin)
):
    """Purges a user account profile. Blocks administrative self-deletion cycles."""
    target_user = db.query(models.User).filter(models.User.id == user_id).first()
    if not target_user:
        raise HTTPException(status_code=404, detail="User profile not found.")
    
    if target_user.id == current_admin.id:
        raise HTTPException(status_code=400, detail="Administrative self-deletion is blocked.")
        
    db.delete(target_user)
    db.commit()
    return None


@app.delete("/admin/properties/{property_id}", status_code=status.HTTP_204_NO_CONTENT)
def admin_delete_any_property(
    property_id: int, 
    db: Session = Depends(get_db), 
    current_admin: models.User = Depends(get_current_admin)
):
    """Enables global override allowing administrators to delete any listed asset"""
    target_property = db.query(models.Property).filter(models.Property.id == property_id).first()
    if not target_property:
        raise HTTPException(status_code=404, detail="Property listing record not found.")
        
    db.delete(target_property)
    db.commit()
    return None



@app.get("/users/me", response_model=schemas.UserResponse)
def read_users_me(current_user: models.User = Depends(get_current_user)):
    return current_user


@app.get("/")
def read_root():
    return {"message": "Shine Server is live ! "}


@app.post("/register", response_model=schemas.UserResponse)
def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    # Check if a user with this email already exists in your MySQL table
    existing_user = crud.get_user_by_email(db, email=user.email)
    if existing_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")
    #If it's a completely new email, go ahead and create it safely
    return crud.create_user(db=db, user=user)


@app.post("/token")
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), 
    db: Session = Depends(database.get_db) 
    ):
    # Find user by email (OAuth2PasswordRequestForm uses 'username' field for email)
    user = crud.get_user_by_email(db, email=form_data.username)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )

    #  Verify password
    if not utils.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )

    # Create Token
    access_token = utils.create_access_token(data={"sub": user.email})
    
    return {"access_token": access_token, "token_type": "bearer"}



@app.post("/properties/", response_model=schemas.PropertyOut)
def create_new_property(
    property: schemas.PropertyCreate, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user) # Protected!
):
    return crud.create_property(db=db, property=property, owner_id=current_user.id)


# PUBLIC ROUTE: Returns ALL properties across the entire portal (For the public page)
@app.get("/properties/", response_model=list[schemas.PropertyOut])
def read_properties(db: Session = Depends(get_db)):
    return crud.get_properties(db)

#PRIVATE ROUTE: Returns ONLY properties belonging to the logged-in individual (For the Portal)
@app.get("/properties/me", response_model=list[schemas.PropertyOut])
def read_my_properties(
    db: Session = Depends(get_db), 
    current_user: models.User = Depends(get_current_user)
):
    return db.query(models.Property).filter(models.Property.owner_id == current_user.id).all()

@app.delete("/properties/{property_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_existing_property(
    property_id: int, 
    db: Session = Depends(get_db), 
    current_user: models.User = Depends(get_current_user)
):
    # 1. Find the property
    property = crud.get_property(db, property_id=property_id)
    if property is None:
        raise HTTPException(status_code=404, detail="Property not found")
    
    # 2. Check ownership
    if property.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this property")
    
    crud.delete_property(db, property_id=property_id)
    return None


@app.put("/properties/{property_id}", response_model=schemas.PropertyOut)
def update_existing_property(
    property_id: int, 
    property_update: schemas.PropertyCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)):
    target = crud.get_property(db, property_id=property_id)
    if not target:
        raise HTTPException(status_code=404, detail="Property not found")
    if target.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="You cannot edit this property")
        
    return crud.update_property(db, property_id=property_id, property_update=property_update)


@app.get("/properties/search", response_model=list[schemas.PropertyOut])
def search_properties(
    category: schemas.CategoryEnum = None,            # for Category search
    location: str = None,                             # for Location search
    min_price: float = None,                          # for Price range
    max_price: float = None,                          # for Price range
    unit: schemas.UnitEnum = schemas.UnitEnum.marla,  # This creates the Unit dropdown
    min_size: float = None,                           # This creates the Min box
    max_size: float = None,                           # This creates the Max box
    db: Session = Depends(get_db)
):
    return crud.search_properties(
        db=db,
        location=location,
        category=category,
        min_price=min_price,
        max_price=max_price,
        unit=unit,
        min_size=min_size,
        max_size=max_size
    )
        

@app.get("/properties/{property_id}", response_model=schemas.PropertyOut)
def read_single_property(property_id: int, db: Session = Depends(get_db)):
    # This uses the crud.get_property function you already have!
    db_property = crud.get_property(db, property_id=property_id)
    
    if db_property is None:
        raise HTTPException(status_code=404, detail="Property not found")        
    return db_property

@app.post("/inquiries/", response_model=schemas.InquiryOut, status_code=status.HTTP_201_CREATED)
def create_inquiry(inquiry: schemas.InquiryCreate, db: Session = Depends(get_db)):
    """PUBLIC: Allows a browser visitor to send a lead to a seller"""
    # Verify the property actually exists first
    db_property = db.query(models.Property).filter(models.Property.id == inquiry.property_id).first()
    if not db_property:
        raise HTTPException(status_code=404, detail="Property not found")

    # Automate tracking assignments by identifying the seller implicitly
    new_inquiry = models.Inquiry(buyer_name=inquiry.buyer_name,
        buyer_email=inquiry.buyer_email,
        buyer_phone=inquiry.buyer_phone,
        message=inquiry.message,
        property_id=inquiry.property_id,
        seller_id=db_property.owner_id)
    db.add(new_inquiry)
    db.commit()
    db.refresh(new_inquiry)
    return new_inquiry


@app.get("/inquiries/me", response_model=List[schemas.InquiryOut])
def get_my_inquiries(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    """SECURE: Fetches only the inquiries sent to the logged-in seller's listings"""
    my_leads = db.query(models.Inquiry).filter(models.Inquiry.seller_id == current_user.id).order_by(models.Inquiry.created_at.desc()).all()
    return my_leads

@app.put( "/users/profile", response_model=schemas.UserResponse )
def update_profile( profile_data: schemas.UserProfileUpdate, db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user) ):
    updated_user = crud.update_user_profile( db=db, user_id=current_user.id,
        full_name=profile_data.full_name,  mob_number=profile_data.mob_number )

    if not updated_user:
        raise HTTPException( status_code=404, detail="User not found" )

    return updated_user

@app.put("/users/change-password")
def update_password( password_data: schemas.ChangePassword, db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user) ):

    if not utils.verify_password( password_data.current_password,  current_user.hashed_password ): 
        raise HTTPException( status_code=400, detail="Current password is incorrect"  )

    crud.change_password( db=db, user_id=current_user.id, new_password=password_data.new_password )

    return { "message": "Password updated successfully" }

@app.put("/forgot-password")
def forgot_password( data: schemas.ForgotPassword, db: Session = Depends(get_db) ):
    user = db.query(models.User).filter(models.User.email == data.email).first()    
    if not user:
        raise HTTPException( 
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Account credentials verification profile failure."
        )

    if not utils.verify_password(data.security_pin, user.hashed_recovery_pin):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect Security Recovery PIN. Authorization denied."
        )
    
    user.hashed_password = utils.hash_password( data.new_password )
    db.commit()

    return { "message": "Account validation successful. Your password has been updated." }