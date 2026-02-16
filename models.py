import uuid
from sqlalchemy import Column, String, Integer, ForeignKey, DateTime, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    username = Column(String, unique=True)
    email = Column(String, unique=True)
    hashed_password = Column(String)
    role = Column(String, default="user")

    # Relationships
    orders = relationship("Order", back_populates="user", foreign_keys="Order.user_id")
    stores = relationship("Store", back_populates="owner")


class Store(Base):
    __tablename__ = "stores"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String)
    description = Column(Text)
    owner_id = Column(String, ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    owner = relationship("User", back_populates="stores")
    services = relationship("Service", back_populates="store")


class Service(Base):
    __tablename__ = "services"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String)
    description = Column(String)
    price = Column(Integer)
    store_id = Column(String, ForeignKey("stores.id"))

    # Relationships
    store = relationship("Store", back_populates="services")
    orders = relationship("Order", back_populates="service")


class Order(Base):
    __tablename__ = "orders"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"))
    service_id = Column(String, ForeignKey("services.id"))
    store_id = Column(String, ForeignKey("stores.id"))
    status = Column(String, default="Pending")
    order_type = Column(String, default="dine-in")  # "dine-in" or "delivery"
    table_number = Column(String, nullable=True)  # For dine-in orders
    delivery_address = Column(Text, nullable=True)  # For delivery orders
    customer_name = Column(String, nullable=True)  # Guest name
    customer_phone = Column(String, nullable=True)  # Guest phone
    notes = Column(Text, nullable=True)  # Special requests
    quantity = Column(Integer, default=1)  # Item quantity
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="orders", foreign_keys=[user_id])
    service = relationship("Service", back_populates="orders")
    store = relationship("Store")