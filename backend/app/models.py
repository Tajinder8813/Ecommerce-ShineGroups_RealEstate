from sqlalchemy import Column, Integer, String, Boolean, Float, ForeignKey, DateTime, Text
from app.database import Base
from sqlalchemy.orm import relationship
from datetime import datetime

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    mob_number = Column(String(100), nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(String(20), default="buyer")  # admin, seller, buyer
    is_active = Column(Boolean, default=True)
    hashed_recovery_pin = Column(String(255), nullable=False)
    properties = relationship("Property", back_populates="owner" , cascade="all, delete-orphan")

class Property(Base):
    __tablename__ = "properties"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(String(500))
    price = Column(Float, nullable=False)
    location = Column(String(255))
    category = Column(String(50)) # e.g., "Residential", "Commercial"
    image_url = Column(String(500), nullable=True)
    # the columns for Punjabi measurements
    display_size = Column(Float, nullable=False) # e.g., 2.0
    size_unit = Column(String(20), nullable=False)    # e.g., "kanal"
    size_sqft = Column(Float) # Standardized for search (calculated)

    # This links the property to the user who posted it
    owner_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    
    owner = relationship("User", back_populates="properties")
    inquiries = relationship("Inquiry", back_populates="property", cascade="all, delete-orphan")
 
class Inquiry(Base):
    __tablename__ = "inquiries"

    id = Column(Integer, primary_key=True, index=True)
    buyer_name = Column(String(100), nullable=False)
    buyer_email = Column(String(100), nullable=False)
    buyer_phone = Column(String(20), nullable=False)
    message = Column(String(500), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # 🔗 Relationships linking everything together
    property_id = Column(Integer, ForeignKey("properties.id", ondelete="CASCADE"), nullable=False)
    seller_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)

    # Optional: If you want to use SQLAlchemy relationships
    property = relationship("Property", back_populates="inquiries")

class CustomerLead(Base):
    __tablename__ = "customer_leads"

    id = Column(Integer, primary_key=True, index=True)
    property_id = Column(Integer, ForeignKey("properties.id", ondelete="CASCADE"), nullable=True)
    client_name = Column(String(100), nullable=False)
    client_email = Column(String(100), nullable=False)
    client_phone = Column(String(20), nullable=False)
    message = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

