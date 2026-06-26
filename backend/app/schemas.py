from enum import Enum
import re
from pydantic import BaseModel, EmailStr, Field, field_validator
from typing import Optional
from datetime import datetime

# Base class for common fields
class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    role: Optional[str] = "seller"
    mob_number: str

# Data required for registration (Input)
class UserCreate(UserBase):
    password: str = Field(..., min_length=8, description="Password must be at least 8 characters long")
    security_pin: str = Field(..., min_length=4, max_length=4, description="A 4-digit account recovery PIN")
    @field_validator('security_pin')
    @classmethod
    def validate_pin(cls, v: str) -> str:
        if not v.isdigit():
            raise ValueError('Security PIN must contain only numbers.')
        return v

    @field_validator('mob_number')
    @classmethod
    def validate_mobile(cls, v: str) -> str:
        if not re.fullmatch(r'^(\+91)?[6-9]\d{9}$', v):
            raise ValueError(
                'Mobile number must be indian.'
            )
        return v

    @field_validator('password')
    @classmethod
    def password_strength_validator(cls, v: str) -> str:
        if not re.search(r'[A-Z]', v):
            raise ValueError('Password must contain at least one uppercase letter (A-Z).')            
        if not re.search(r'[a-z]', v):
            raise ValueError('Password must contain at least one lowercase letter (a-z).')            
        if not re.search(r'\d', v):
            raise ValueError('Password must contain at least one number (0-9).')            
        if not re.search(r'[@$!%*?&]', v):
            raise ValueError('Password must contain at least one special character (e.g., @, $, !, %, *, ?, &).')            
        return v

# Data we return to the user (Output)
class UserResponse(UserBase):
    id: int
    is_active: bool

    class Config:
        from_attributes = True # This allows Pydantic to read SQLAlchemy models

class UserProfileUpdate(BaseModel):
    full_name: str
    mob_number: str

    @field_validator('mob_number')
    @classmethod
    def validate_mobile(cls, v: str) -> str:
        if not re.fullmatch(r'^(\+91)?[6-9]\d{9}$', v):
            raise ValueError('Invalid Indian mobile number.')
        return v

class ChangePassword(BaseModel):
    current_password: str
    new_password: str = Field(..., min_length=8)

    @field_validator('new_password')
    @classmethod
    def password_strength_validator(cls, v: str):
        if not re.search(r'[A-Z]', v):
            raise ValueError('Password must contain uppercase letter.')
        if not re.search(r'[a-z]', v):
            raise ValueError('Password must contain lowercase letter.')
        if not re.search(r'\d', v):
            raise ValueError('Password must contain number.')
        if not re.search(r'[@$!%*?&]', v):
            raise ValueError('Password must contain special character.')
        return v

class ForgotPassword(BaseModel):
    email: EmailStr
    security_pin: str = Field(..., min_length=4, max_length=4)
    new_password: str = Field(..., min_length=8)

    @field_validator('new_password')
    @classmethod
    def password_strength_validator(cls, v: str):
        if not re.search(r'[A-Z]', v):
            raise ValueError('Password must contain at least one uppercase letter.')
        if not re.search(r'[a-z]', v):
            raise ValueError('Password must contain at least one lowercase letter.')
        if not re.search(r'\d', v):
            raise ValueError('Password must contain at least one number.')
        if not re.search(r'[@$!%*?&]', v):
            raise ValueError('Password must contain at least one special character.')
        return v

# units for property size
class UnitEnum(str, Enum):
    sqft = "sqft"
    marla = "marla"
    kanal = "kanal"
    killa = "killa"

# category for property 
class CategoryEnum(str, Enum):
    residential = "Residential"
    commercial = "Commercial"
    industrial = "Industrial"
    agricultural = "Agricultural"
    plot = "Plot"

#define how a Property looks
class PropertyBase(BaseModel):
    title: str
    description: Optional[str] = None
    price: float
    location: str
    category: CategoryEnum
    display_size: float
    size_unit: UnitEnum
    image_url: Optional[str] = None

class PropertyCreate(PropertyBase):
    pass

class PropertyOut(PropertyBase):
    id: int
    owner_id: int
    size_sqft: float

    class Config:
        from_attributes = True

# Data needed to create a new inquiry from the front-end
class InquiryCreate(BaseModel):
    buyer_name: str
    buyer_email: EmailStr
    buyer_phone: str
    message: Optional[str] = None
    property_id: int
    seller_id: int # can be removed 

# Data returned back to the seller's dashboard
class InquiryOut(BaseModel):
    id: int
    buyer_name: str
    buyer_email: str
    buyer_phone: str
    message: Optional[str]
    property_id: int
    created_at: datetime

    class Config:
        from_attributes = True


# What the client sends from the public facing website
class LeadCreate(BaseModel):
    property_id: Optional[int] = None
    client_name: str
    client_email: EmailStr
    client_phone: str
    message: Optional[str] = None

# What the backend sends back to your Partner Dashboard
class LeadResponse(BaseModel):
    id: int
    property_id: Optional[int]
    property_title: Optional[str] = None  # Populated via relationship/join query
    client_name: str
    client_email: EmailStr
    client_phone: str
    message: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True




