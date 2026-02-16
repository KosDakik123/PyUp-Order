from fastapi import FastAPI, Depends, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from jose import jwt, JWTError

import models
from database import engine, SessionLocal
from auth import hash_password, verify_password, create_access_token, SECRET_KEY, ALGORITHM

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/static", StaticFiles(directory="static"), name="static")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        user = db.query(models.User).filter(models.User.id == user_id).first()
        if not user:
            raise HTTPException(status_code=401, detail="Invalid token")
        return user
    except:
        raise HTTPException(status_code=401, detail="Invalid token")


def get_admin(user=Depends(get_current_user)):
    if user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin only")
    return user


# ============= AUTH =============

@app.post("/register")
def register(data: dict, db: Session = Depends(get_db)):
    # Check if username or email already exists
    existing = db.query(models.User).filter(
        (models.User.username == data["username"]) | (models.User.email == data["email"])
    ).first()
    
    if existing:
        raise HTTPException(status_code=400, detail="Username or email already exists")
    
    user = models.User(
        username=data["username"],
        email=data["email"],
        hashed_password=hash_password(data["password"])
    )
    db.add(user)
    db.commit()
    return {"message": "User created"}


@app.post("/login")
def login(data: dict, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.username == data["username"]).first()
    if not user or not verify_password(data["password"], user.hashed_password):
        raise HTTPException(status_code=400, detail="Invalid credentials")

    token = create_access_token(user.id)
    return {"access_token": token, "role": user.role, "user_id": user.id}


# ============= STORES =============

@app.post("/stores")
def create_store(data: dict, db: Session = Depends(get_db), user=Depends(get_current_user)):
    """Any logged-in user can create a store"""
    store = models.Store(
        name=data["name"],
        description=data["description"],
        owner_id=user.id
    )
    db.add(store)
    db.commit()
    db.refresh(store)
    return {"message": "Store created", "store_id": store.id}


@app.get("/stores")
def get_all_stores(db: Session = Depends(get_db)):
    """Get all stores"""
    stores = db.query(models.Store).all()
    return [
        {
            "id": s.id,
            "name": s.name,
            "description": s.description,
            "owner_id": s.owner_id,
            "owner_name": s.owner.username
        }
        for s in stores
    ]


@app.get("/my-stores")
def get_my_stores(db: Session = Depends(get_db), user=Depends(get_current_user)):
    """Get stores owned by current user"""
    stores = db.query(models.Store).filter(models.Store.owner_id == user.id).all()
    return [
        {
            "id": s.id,
            "name": s.name,
            "description": s.description,
            "services_count": len(s.services)
        }
        for s in stores
    ]


# ============= SERVICES =============

@app.post("/stores/{store_id}/services")
def create_service(store_id: str, data: dict, db: Session = Depends(get_db), user=Depends(get_current_user)):
    """Store owner can add services to their store"""
    store = db.query(models.Store).filter(models.Store.id == store_id).first()
    
    if not store:
        raise HTTPException(status_code=404, detail="Store not found")
    
    if store.owner_id != user.id and user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    service = models.Service(
        name=data["name"],
        description=data["description"],
        price=data["price"],
        store_id=store_id
    )
    db.add(service)
    db.commit()
    return {"message": "Service created"}


@app.get("/stores/{store_id}/services")
def get_store_services(store_id: str, db: Session = Depends(get_db)):
    """Get all services from a specific store"""
    services = db.query(models.Service).filter(models.Service.store_id == store_id).all()
    return [
        {
            "id": s.id,
            "name": s.name,
            "description": s.description,
            "price": s.price,
            "store_id": s.store_id
        }
        for s in services
    ]


@app.get("/services")
def get_all_services(db: Session = Depends(get_db)):
    """Get all services from all stores"""
    services = db.query(models.Service).all()
    return [
        {
            "id": s.id,
            "name": s.name,
            "description": s.description,
            "price": s.price,
            "store_name": s.store.name,
            "store_id": s.store_id
        }
        for s in services
    ]


# ============= ORDERS =============

@app.post("/orders")
def create_order(data: dict, db: Session = Depends(get_db)):
    """Create order - supports both logged-in users and guests"""
    service = db.query(models.Service).filter(models.Service.id == data["service_id"]).first()
    
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    
    # Create order (guest or logged-in user)
    order = models.Order(
        user_id=data.get("user_id"),  # Can be None for guests
        service_id=service.id,
        store_id=service.store_id,
        order_type=data.get("order_type", "dine-in"),
        table_number=data.get("table_number"),
        delivery_address=data.get("delivery_address"),
        customer_name=data.get("customer_name"),
        customer_phone=data.get("customer_phone"),
        notes=data.get("notes"),
        quantity=data.get("quantity", 1)
    )
    db.add(order)
    db.commit()
    return {"message": "Order created", "order_id": order.id}


@app.get("/orders")
def get_my_orders(db: Session = Depends(get_db), user=Depends(get_current_user)):
    """Get orders placed by current user"""
    orders = db.query(models.Order).filter(models.Order.user_id == user.id).all()
    return [
        {
            "id": o.id,
            "status": o.status,
            "service_name": o.service.name,
            "store_name": o.store.name,
            "price": o.service.price,
            "created_at": o.created_at
        }
        for o in orders
    ]


@app.get("/store-orders/{store_id}")
def get_store_orders(store_id: str, db: Session = Depends(get_db), user=Depends(get_current_user)):
    """Store owner gets orders for their store"""
    store = db.query(models.Store).filter(models.Store.id == store_id).first()
    
    if not store:
        raise HTTPException(status_code=404, detail="Store not found")
    
    if store.owner_id != user.id and user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    orders = db.query(models.Order).filter(models.Order.store_id == store_id).all()
    return [
        {
            "id": o.id,
            "status": o.status,
            "customer_name": o.customer_name or (o.user.username if o.user else "Guest"),
            "customer_phone": o.customer_phone,
            "service_name": o.service.name,
            "price": o.service.price,
            "quantity": o.quantity,
            "order_type": o.order_type,
            "table_number": o.table_number,
            "delivery_address": o.delivery_address,
            "notes": o.notes,
            "created_at": o.created_at
        }
        for o in orders
    ]


@app.put("/orders/{order_id}")
def update_order(order_id: str, data: dict, db: Session = Depends(get_db), user=Depends(get_current_user)):
    """Store owner or admin can update order status"""
    order = db.query(models.Order).filter(models.Order.id == order_id).first()
    
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    store = db.query(models.Store).filter(models.Store.id == order.store_id).first()
    
    if store.owner_id != user.id and user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    order.status = data["status"]
    db.commit()
    return {"message": "Order updated"}


# ============= ADMIN =============

@app.get("/admin/orders")
def admin_orders(db: Session = Depends(get_db), admin=Depends(get_admin)):
    """Admin sees all orders"""
    orders = db.query(models.Order).all()
    return [
        {
            "id": o.id,
            "status": o.status,
            "customer_name": o.customer_name or (o.user.username if o.user else "Guest"),
            "customer_phone": o.customer_phone,
            "store_name": o.store.name,
            "service_name": o.service.name,
            "price": o.service.price,
            "quantity": o.quantity,
            "order_type": o.order_type,
            "table_number": o.table_number,
            "delivery_address": o.delivery_address,
            "created_at": o.created_at
        }
        for o in orders
    ]