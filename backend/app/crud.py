from sqlalchemy.orm import Session
from app import models, schemas, utils

def create_admin_user(db: Session, user: schemas.UserCreate):
    hashed_pass = utils.hash_password(user.password)   
    hashed_pin = utils.hash_password(user.security_pin)  
    db_admin = models.User(
        email=user.email,
        full_name=user.full_name,
        mob_number=user.mob_number,
        hashed_password=hashed_pass, 
        hashed_recovery_pin=hashed_pin,
        role="admin"  
    )
    db.add(db_admin)
    db.commit()
    db.refresh(db_admin)
    return db_admin

def create_user(db: Session, user: schemas.UserCreate):
    hashed_pass = utils.hash_password(user.password)   
    hashed_pin = utils.hash_password(user.security_pin) 
    #check user should not be admin 
    if hasattr(user, 'role') and user.role in ['buyer', 'seller']:
        target_role = user.role
    else:
        target_role = "seller"  
    db_user = models.User(
        email=user.email,
        full_name=user.full_name,
        mob_number=user.mob_number,
        hashed_password=hashed_pass, 
        hashed_recovery_pin=hashed_pin,
        role=target_role
    )    
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user
    
def get_user_by_email(db: Session, email: str):
    #Checks the database for a user with the given email.
    return db.query(models.User).filter(models.User.email == email).first()

# Standard conversion for Jalandhar/Punjab region
def get_sqft_standard(value: float, unit: str):
    conversions = {
        "sqft": 1.0,
        "marla": 272.25, # Standard Marla
        "kanal": 5445.0,  # 20 Marla
        "killa": 43560.0  # 8 Kanal
    }
    return value * conversions.get(unit, 1.0)

def create_property(db: Session, property: schemas.PropertyCreate, owner_id: int):
    # Calculate the standardized size before saving
    sqft_val = get_sqft_standard(property.display_size, property.size_unit)
    property_data = property.model_dump()
    db_property = models.Property(
        title=property_data.get("title"),
        description=property_data.get("description"),
        price=property_data.get("price"),
        location=property_data.get("location"),
        category=property_data.get("category"),
        display_size=property_data.get("display_size"),
        size_unit=property_data.get("size_unit"),
        image_url=property_data.get("image_url"), # Make sure this matches models.py
        size_sqft=sqft_val,
        owner_id=owner_id
    )
    db.add(db_property)
    db.commit()
    db.refresh(db_property)
    return db_property

def get_properties(db: Session, skip: int = 0, limit: int = 100):
    """Fetches all properties - perfect for the main landing page"""
    return db.query(models.Property).offset(skip).limit(limit).all()


def get_property(db: Session, property_id: int):
    return db.query(models.Property).filter(models.Property.id == property_id).first()

def delete_property(db: Session, property_id: int):
    db_property = db.query(models.Property).filter(models.Property.id == property_id).first()
    if db_property:
        db.delete(db_property)
        db.commit()
    return db_property

def update_property(db: Session, property_id: int, property_update: schemas.PropertyCreate):
    db_property = db.query(models.Property).filter(models.Property.id == property_id).first()
    if db_property:
        update_data = property_update.model_dump()
        # Recalculate sqft in case they changed the unit from Marla to Kanal
        update_data["size_sqft"] = get_sqft_standard( update_data["display_size"], update_data["size_unit"])

        for key, value in update_data.items():
            setattr(db_property, key, value)
        db.commit()
        db.refresh(db_property)
    return db_property

def update_user_profile(db: Session, user_id: int,  full_name: str, mob_number: str):
    user = db.query(models.User).filter(models.User.id == user_id).first()

    if not user:
        return None

    user.full_name = full_name
    user.mob_number = mob_number

    db.commit()
    db.refresh(user)

    return user

def change_password( db: Session, user_id: int, new_password: str ):
    user = db.query(models.User).filter(models.User.id == user_id).first()

    if not user:
        return None

    user.hashed_password = utils.hash_password(new_password)

    db.commit()
    db.refresh(user)

    return user


def search_properties(db: Session, 
    location: str = None, 
    category: str = None,
    min_price: float = None, 
    max_price: float = None,
    unit: str = "sqft",      # New parameter
    min_size: float = None,  # New parameter
    max_size: float = None   # New parameter
    ):
    
    query = db.query(models.Property)
    
    if location:
        # "ilike" makes the search case-insensitive (e.g., 'jalandhar' matches 'Jalandhar')
        query = query.filter(models.Property.location.ilike(f"%{location}%"))
    if category:
        query = query.filter(models.Property.category == category)
    if min_price is not None:
        query = query.filter(models.Property.price >= min_price)
        
    if max_price is not None:
        query = query.filter(models.Property.price <= max_price)
    # 2. Punjabi Unit Size Filtering (The New Logic)
    # using the same 'get_sqft_standard' function wrote earlier
    if min_size is not None:
        sqft_min = get_sqft_standard(min_size, unit)
        query = query.filter(models.Property.size_sqft >= sqft_min)
        
    if max_size is not None:
        sqft_max = get_sqft_standard(max_size, unit)
        query = query.filter(models.Property.size_sqft <= sqft_max)
        
    return query.all()





