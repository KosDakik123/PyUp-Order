# 🍽️ Restaurant Digital Ordering System

A modern, contactless ordering system for restaurants that eliminates the need for waiters to take orders. Customers scan QR codes at their tables to order directly to the kitchen.

![Python](https://img.shields.io/badge/Python-3.9+-blue.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-green.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

---

## 📖 Table of Contents

- [Features](#features)
- [Demo](#demo)
- [How It Works](#how-it-works)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
  - [Windows](#windows-installation)
  - [macOS](#macos-installation)
  - [Linux](#linux-installation)
- [Quick Start](#quick-start)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Configuration](#configuration)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## ✨ Features

### For Restaurant Owners
- ✅ **Multi-Store Support** - Manage multiple restaurants
- ✅ **Digital Menu Management** - Add/edit items with prices
- ✅ **Table QR Codes** - Generate unique QR code for each table
- ✅ **Real-Time Orders** - See orders instantly as they come in
- ✅ **Order Management** - Track pending and completed orders
- ✅ **Dual Order Types** - Support dine-in and delivery/takeout

### For Customers
- ✅ **No App Required** - Order via web browser
- ✅ **Guest Checkout** - No registration needed
- ✅ **Shopping Cart** - Add multiple items before ordering
- ✅ **Table Service** - Orders automatically tagged with table number
- ✅ **Special Requests** - Add notes to orders
- ✅ **Mobile Optimized** - Perfect for smartphones

### System Features
- ✅ **Contactless** - Reduce physical contact
- ✅ **Multi-Language Ready** - Easy to translate
- ✅ **Responsive Design** - Works on all devices
- ✅ **Secure** - JWT authentication for staff
- ✅ **Fast** - Built with FastAPI for speed

---

## 🎬 Demo

### Customer Flow
1. Customer sits at table 5
2. Scans QR code
3. Browses menu
4. Adds items to cart
5. Places order
6. Kitchen receives order instantly

### Staff Flow
1. Login to management panel
2. See all incoming orders
3. View table number, items, customer info
4. Mark orders complete

---

## 🔧 How It Works

```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│   Customer  │         │  Restaurant  │         │   Kitchen   │
│  at Table   │         │     Web      │         │   Staff     │
└──────┬──────┘         └──────┬───────┘         └──────┬──────┘
       │                       │                        │
       │  1. Scan QR Code      │                        │
       ├──────────────────────>│                        │
       │                       │                        │
       │  2. View Menu         │                        │
       │<──────────────────────┤                        │
       │                       │                        │
       │  3. Place Order       │                        │
       ├──────────────────────>│                        │
       │                       │                        │
       │                       │  4. New Order Alert    │
       │                       ├───────────────────────>│
       │                       │                        │
       │                       │  5. Prepare Food       │
       │                       │<───────────────────────┤
       │                       │                        │
       │  6. Food Delivered    │                        │
       │<──────────────────────┴────────────────────────┘
```

---

## 🛠️ Tech Stack

**Backend:**
- Python 3.9+
- FastAPI - Modern, fast web framework
- SQLAlchemy - SQL toolkit and ORM
- SQLite - Database (development)
- Argon2 - Password hashing
- JWT - Authentication tokens

**Frontend:**
- HTML5
- CSS3 (Bootstrap 5)
- JavaScript (Vanilla)
- QR Code API

---

## 📦 Installation

### Prerequisites

- Python 3.9 or higher
- pip (Python package manager)
- Git

### Windows Installation

1. **Install Python**
   - Download from [python.org](https://www.python.org/downloads/)
   - During installation, check "Add Python to PATH"
   - Verify: Open Command Prompt and type:
     ```cmd
     python --version
     ```

2. **Clone Repository**
   ```cmd
   git clone https://github.com/YOUR_USERNAME/restaurant-ordering-system.git
   cd restaurant-ordering-system
   ```

3. **Create Virtual Environment**
   ```cmd
   python -m venv venv
   venv\Scripts\activate
   ```

4. **Install Dependencies**
   ```cmd
   pip install -r requirements.txt
   ```

5. **Run Application**
   ```cmd
   uvicorn main:app --reload
   ```

6. **Access Application**
   - Open browser: `http://127.0.0.1:8000/static/login.html`

### macOS Installation

1. **Install Python** (if not already installed)
   ```bash
   # Using Homebrew
   brew install python3
   
   # Verify installation
   python3 --version
   ```

2. **Clone Repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/restaurant-ordering-system.git
   cd restaurant-ordering-system
   ```

3. **Create Virtual Environment**
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```

4. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

5. **Run Application**
   ```bash
   uvicorn main:app --reload
   ```

6. **Access Application**
   - Open browser: `http://127.0.0.1:8000/static/login.html`

### Linux Installation

1. **Install Python and pip**
   ```bash
   # Ubuntu/Debian
   sudo apt update
   sudo apt install python3 python3-pip python3-venv
   
   # Fedora
   sudo dnf install python3 python3-pip
   
   # Arch Linux
   sudo pacman -S python python-pip
   
   # Verify installation
   python3 --version
   ```

2. **Clone Repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/restaurant-ordering-system.git
   cd restaurant-ordering-system
   ```

3. **Create Virtual Environment**
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```

4. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

5. **Run Application**
   ```bash
   uvicorn main:app --reload
   ```

6. **Access Application**
   - Open browser: `http://127.0.0.1:8000/static/login.html`

---

## 🚀 Quick Start

### 1. First-Time Setup

After installation:

```bash
# Start the server
uvicorn main:app --reload
```

### 2. Create Your Restaurant

1. Open `http://127.0.0.1:8000/static/register.html`
2. Register an account
3. Login and click "My Store"
4. Create your restaurant

### 3. Add Menu Items

1. In "My Store", add items:
   - Name: "Margherita Pizza"
   - Description: "Classic tomato and mozzarella"
   - Price: 12

### 4. Generate Table QR Codes

1. Click "📱 Generate Table QR Codes"
2. Enter number of tables (e.g., 10)
3. Download and print QR codes
4. Place on tables

### 5. Test Ordering

1. Open menu page: `http://127.0.0.1:8000/static/menu.html?store=YOUR_STORE_ID&table=1`
2. Add items to cart
3. Place order
4. See order in "My Store" panel

---

## 📱 Usage

### For Restaurant Staff

#### Creating Your Store
```
1. Register → Login
2. Click "My Store"
3. Fill in:
   - Store Name: "Joe's Pizza"
   - Description: "Best pizza in town"
4. Click "Create Store"
```

#### Adding Menu Items
```
1. In "My Store" section
2. Click "Add New Service/Product"
3. Enter:
   - Name: Item name
   - Description: Item description
   - Price: Price in dollars
4. Click "Add Service"
```

#### Managing Orders
```
1. Go to "My Store"
2. Scroll to "Orders for My Store"
3. See real-time orders with:
   - Order type (Dine-in/Delivery)
   - Table number
   - Customer info
   - Items ordered
4. Click "Complete" when order is ready
```

### For Customers

#### Dine-In Ordering
```
1. Scan QR code on table
2. Browse menu
3. Add items to cart
4. Click cart icon
5. Verify table number (auto-filled)
6. Enter name and phone
7. Click "Place Order"
```

#### Takeout/Delivery Ordering
```
1. Access restaurant's menu link
2. Browse menu
3. Add items to cart
4. Select "Takeout/Delivery"
5. Enter delivery address
6. Enter name and phone
7. Click "Place Order"
```

---

## 📚 API Documentation

### Authentication Endpoints

#### Register
```http
POST /register
Content-Type: application/json

{
  "username": "john",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login
```http
POST /login
Content-Type: application/json

{
  "username": "john",
  "password": "password123"
}

Response:
{
  "access_token": "eyJ0eXAi...",
  "role": "user",
  "user_id": "uuid-here"
}
```

### Store Endpoints

#### Create Store
```http
POST /stores
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Joe's Pizza",
  "description": "Best pizza in town"
}
```

#### Get All Stores
```http
GET /stores

Response:
[
  {
    "id": "uuid",
    "name": "Joe's Pizza",
    "description": "Best pizza in town",
    "owner_id": "uuid",
    "owner_name": "John"
  }
]
```

### Service (Menu Item) Endpoints

#### Add Service to Store
```http
POST /stores/{store_id}/services
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Margherita Pizza",
  "description": "Classic pizza",
  "price": 12
}
```

#### Get Store Services
```http
GET /stores/{store_id}/services

Response:
[
  {
    "id": "uuid",
    "name": "Margherita Pizza",
    "description": "Classic pizza",
    "price": 12,
    "store_id": "uuid"
  }
]
```

### Order Endpoints

#### Create Order (Guest)
```http
POST /orders
Content-Type: application/json

{
  "service_id": "uuid",
  "order_type": "dine-in",
  "table_number": "5",
  "customer_name": "John Doe",
  "customer_phone": "555-1234",
  "quantity": 2,
  "notes": "Extra cheese please"
}
```

#### Get Store Orders
```http
GET /store-orders/{store_id}
Authorization: Bearer {token}

Response:
[
  {
    "id": "uuid",
    "status": "Pending",
    "customer_name": "John Doe",
    "customer_phone": "555-1234",
    "service_name": "Margherita Pizza",
    "price": 12,
    "quantity": 2,
    "order_type": "dine-in",
    "table_number": "5",
    "notes": "Extra cheese please",
    "created_at": "2025-02-16T10:30:00"
  }
]
```

#### Update Order Status
```http
PUT /orders/{order_id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "status": "Completed"
}
```

---

## 📁 Project Structure

```
restaurant-ordering-system/
├── static/                      # Frontend files
│   ├── login.html              # Staff login page
│   ├── register.html           # Staff registration
│   ├── dashboard.html          # Store owner dashboard
│   ├── my-store.html           # Store management
│   ├── admin.html              # Admin panel
│   ├── menu.html               # Customer ordering page
│   ├── table-qr.html           # QR code generator
│   ├── script.js               # Main JavaScript
│   ├── menu-script.js          # Customer ordering JS
│   └── admin-script.js         # Admin panel JS
├── main.py                      # FastAPI application
├── models.py                    # Database models
├── database.py                  # Database configuration
├── auth.py                      # Authentication utilities
├── requirements.txt             # Python dependencies
├── .gitignore                   # Git ignore rules
├── README.md                    # This file
└── app.db                       # SQLite database (auto-generated)
```

---

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Server Configuration
HOST=0.0.0.0
PORT=8000

# Security
SECRET_KEY=your-secret-key-here-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60

# Database
DATABASE_URL=sqlite:///./app.db

# CORS (for production)
CORS_ORIGINS=https://yourdomain.com
```

### Changing Server Port

```bash
# Run on different port
uvicorn main:app --reload --port 8080
```

### Production Settings

For production deployment, update `main.py`:

```python
# Change CORS settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://yourdomain.com"],  # Your domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## 🚀 Deployment

### Deploying to Production

#### 1. Using Heroku

```bash
# Install Heroku CLI
# https://devcenter.heroku.com/articles/heroku-cli

# Login
heroku login

# Create app
heroku create your-app-name

# Add Procfile
echo "web: uvicorn main:app --host 0.0.0.0 --port \$PORT" > Procfile

# Deploy
git push heroku main

# Open app
heroku open
```

#### 2. Using DigitalOcean

```bash
# Use App Platform
# 1. Connect GitHub repo
# 2. Select Python
# 3. Build command: pip install -r requirements.txt
# 4. Run command: uvicorn main:app --host 0.0.0.0 --port 8080
```

#### 3. Using VPS (Ubuntu)

```bash
# Install dependencies
sudo apt update
sudo apt install python3-pip nginx

# Clone repo
git clone https://github.com/YOUR_USERNAME/restaurant-ordering-system.git
cd restaurant-ordering-system

# Install requirements
pip3 install -r requirements.txt

# Run with systemd
sudo nano /etc/systemd/system/restaurant-app.service
```

Add to service file:
```ini
[Unit]
Description=Restaurant Ordering System
After=network.target

[Service]
User=www-data
WorkingDirectory=/path/to/restaurant-ordering-system
ExecStart=/usr/bin/uvicorn main:app --host 0.0.0.0 --port 8000
Restart=always

[Install]
WantedBy=multi-user.target
```

```bash
# Start service
sudo systemctl start restaurant-app
sudo systemctl enable restaurant-app
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow PEP 8 style guide for Python
- Use meaningful commit messages
- Add comments for complex logic
- Test your changes before submitting

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- FastAPI for the amazing web framework
- Bootstrap for the UI components
- QR Server API for QR code generation

---

## 📞 Support

If you have any questions or issues:

1. Check the [Issues](https://github.com/YOUR_USERNAME/restaurant-ordering-system/issues) page
2. Create a new issue if your problem isn't already listed
3. Contact: your-email@example.com

---

## 🗺️ Roadmap

- [ ] Payment integration (Stripe/PayPal)
- [ ] Multiple language support
- [ ] Email notifications
- [ ] SMS notifications
- [ ] Analytics dashboard
- [ ] Menu categories
- [ ] Item images
- [ ] Ratings and reviews
- [ ] Loyalty program
- [ ] Kitchen display system

---

Made with ❤️ for restaurants everywhere
