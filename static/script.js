const API = "http://127.0.0.1:8000"

let currentStoreId = null

function saveToken(token, role, userId) {
    localStorage.setItem("token", token)
    localStorage.setItem("role", role)
    localStorage.setItem("userId", userId)
}

function getToken() {
    return localStorage.getItem("token")
}

function getRole() {
    return localStorage.getItem("role")
}

function getUserId() {
    return localStorage.getItem("userId")
}

function logout() {
    localStorage.clear()
    window.location.href = "login.html"
}

function checkAuth(requiredRole) {
    const token = getToken()
    const role = getRole()

    if (!token) {
        window.location.href = "login.html"
    }

    if (requiredRole && role !== requiredRole && requiredRole !== "user") {
        alert("Unauthorized")
        window.location.href = "login.html"
    }
}

// ============= AUTH =============

async function register() {
    try {
        const res = await fetch(`${API}/register`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                username: username.value,
                email: email.value,
                password: password.value
            })
        })

        if (res.ok) {
            alert("Registered successfully!")
            window.location.href = "login.html"
        } else {
            const data = await res.json()
            alert(data.detail || "Registration failed")
        }
    } catch (err) {
        alert("Error: " + err.message)
    }
}

async function login() {
    try {
        const res = await fetch(`${API}/login`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                username: username.value,
                password: password.value
            })
        })

        const data = await res.json()

        if (res.ok) {
            saveToken(data.access_token, data.role, data.user_id)

            if (data.role === "admin")
                window.location.href = "admin.html"
            else
                window.location.href = "dashboard.html"
        } else {
            alert(data.detail || "Login failed")
        }
    } catch (err) {
        alert("Error: " + err.message)
    }
}

// ============= STORES =============

async function loadStores() {
    const res = await fetch(`${API}/stores`)
    const data = await res.json()

    stores.innerHTML = ""

    if (data.length === 0) {
        stores.innerHTML = "<p class='col-12 text-muted'>No stores yet. Create yours!</p>"
        return
    }

    data.forEach(store => {
        stores.innerHTML += `
        <div class="col-md-4 mb-3">
            <div class="card p-3">
                <h5>🏪 ${store.name}</h5>
                <p class="text-muted">${store.description}</p>
                <small>Owner: ${store.owner_name}</small>
                <button onclick="viewStoreServices('${store.id}')" class="btn btn-primary btn-sm mt-2">
                    View Services
                </button>
            </div>
        </div>
        `
    })
}

async function viewStoreServices(storeId) {
    window.location.href = `store-view.html?store=${storeId}`
}

async function loadMyStore() {
    const res = await fetch(`${API}/my-stores`, {
        headers: {
            "Authorization": "Bearer " + getToken()
        }
    })

    const data = await res.json()

    if (data.length === 0) {
        // No store yet - show create form
        document.getElementById("createStoreSection").style.display = "block"
        document.getElementById("storeInfoSection").style.display = "none"
    } else {
        // Has store - show store management
        currentStoreId = data[0].id
        localStorage.setItem('currentStoreId', currentStoreId) // Save for QR generator
        document.getElementById("createStoreSection").style.display = "none"
        document.getElementById("storeInfoSection").style.display = "block"
        
        document.getElementById("storeTitle").innerText = data[0].name
        document.getElementById("storeDescription").innerText = data[0].description
        
        loadMyServices()
        loadStoreOrders()
    }
}

function generateTableQRs() {
    window.location.href = 'table-qr.html'
}

async function createStore() {
    await fetch(`${API}/stores`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + getToken()
        },
        body: JSON.stringify({
            name: storeName.value,
            description: storeDesc.value
        })
    })

    alert("Store created!")
    location.reload()
}

// ============= SERVICES =============

async function loadAllServices() {
    const res = await fetch(`${API}/services`)
    const data = await res.json()

    services.innerHTML = ""

    if (data.length === 0) {
        services.innerHTML = "<p class='col-12 text-muted'>No services available yet.</p>"
        return
    }

    data.forEach(s => {
        services.innerHTML += `
        <div class="col-md-4 mb-3">
            <div class="card p-3">
                <h5>${s.name}</h5>
                <p>${s.description}</p>
                <p><strong>$${s.price}</strong></p>
                <small class="text-muted">from: ${s.store_name}</small>
                <button onclick="createOrder('${s.id}')" class="btn btn-primary btn-sm mt-2">
                    🛒 Order Now
                </button>
            </div>
        </div>
        `
    })
}

async function loadMyServices() {
    const res = await fetch(`${API}/stores/${currentStoreId}/services`)
    const data = await res.json()

    myServices.innerHTML = ""

    if (data.length === 0) {
        myServices.innerHTML = "<p class='col-12 text-muted'>No services yet. Add your first one!</p>"
        return
    }

    data.forEach(s => {
        myServices.innerHTML += `
        <div class="col-md-4 mb-3">
            <div class="card p-3">
                <h5>${s.name}</h5>
                <p>${s.description}</p>
                <p><strong>$${s.price}</strong></p>
            </div>
        </div>
        `
    })
}

async function addService() {
    await fetch(`${API}/stores/${currentStoreId}/services`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + getToken()
        },
        body: JSON.stringify({
            name: serviceName.value,
            description: serviceDesc.value,
            price: parseInt(servicePrice.value)
        })
    })

    alert("Service added!")
    serviceName.value = ""
    serviceDesc.value = ""
    servicePrice.value = ""
    loadMyServices()
}

// ============= ORDERS =============

async function createOrder(serviceId) {
    await fetch(`${API}/orders`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + getToken()
        },
        body: JSON.stringify({
            service_id: serviceId
        })
    })

    alert("Order placed successfully!")
    loadMyOrders()
}

async function loadMyOrders() {
    const res = await fetch(`${API}/orders`, {
        headers: {
            "Authorization": "Bearer " + getToken()
        }
    })

    const data = await res.json()
    orders.innerHTML = ""

    if (data.length === 0) {
        orders.innerHTML = "<tr><td colspan='6' class='text-center text-muted'>No orders yet</td></tr>"
        return
    }

    data.forEach(o => {
        orders.innerHTML += `
        <tr>
            <td>${o.id.substring(0, 8)}...</td>
            <td>${o.store_name}</td>
            <td>${o.service_name}</td>
            <td>$${o.price}</td>
            <td><span class="badge bg-${o.status === 'Completed' ? 'success' : 'warning'}">${o.status}</span></td>
            <td>${new Date(o.created_at).toLocaleDateString()}</td>
        </tr>
        `
    })
}

async function loadStoreOrders() {
    const res = await fetch(`${API}/store-orders/${currentStoreId}`, {
        headers: {
            "Authorization": "Bearer " + getToken()
        }
    })

    const data = await res.json()
    storeOrders.innerHTML = ""

    if (data.length === 0) {
        storeOrders.innerHTML = "<tr><td colspan='11' class='text-center text-muted'>No orders yet</td></tr>"
        return
    }

    data.forEach(o => {
        const orderTypeIcon = o.order_type === 'dine-in' ? '🍽️' : '🚗'
        const locationInfo = o.order_type === 'dine-in' 
            ? `Table ${o.table_number}` 
            : (o.delivery_address ? o.delivery_address.substring(0, 30) + '...' : 'N/A')
        
        storeOrders.innerHTML += `
        <tr>
            <td>${o.id.substring(0, 8)}...</td>
            <td>${orderTypeIcon} ${o.order_type}</td>
            <td>${locationInfo}</td>
            <td>${o.customer_name}</td>
            <td>${o.customer_phone || 'N/A'}</td>
            <td>${o.service_name}</td>
            <td>${o.quantity}</td>
            <td>$${o.price * o.quantity}</td>
            <td><span class="badge bg-${o.status === 'Completed' ? 'success' : 'warning'}">${o.status}</span></td>
            <td>${o.notes ? '<small>' + o.notes + '</small>' : '-'}</td>
            <td>
                ${o.status !== 'Completed' ? `
                    <button onclick="updateOrderStatus('${o.id}', 'Completed')" class="btn btn-success btn-sm">
                        Complete
                    </button>
                ` : 'Completed ✓'}
            </td>
        </tr>
        `
    })
}

async function updateOrderStatus(orderId, status) {
    await fetch(`${API}/orders/${orderId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + getToken()
        },
        body: JSON.stringify({
            status: status
        })
    })

    alert("Order updated!")
    loadStoreOrders()
}

// ============= ADMIN =============

async function loadAllOrders() {
    const res = await fetch(`${API}/admin/orders`, {
        headers: {
            "Authorization": "Bearer " + getToken()
        }
    })

    const data = await res.json()
    adminOrders.innerHTML = ""

    data.forEach(o => {
        adminOrders.innerHTML += `
        <tr>
            <td>${o.id.substring(0, 8)}...</td>
            <td>${o.customer_name}</td>
            <td>${o.store_name}</td>
            <td>${o.service_name}</td>
            <td>${o.status}</td>
        </tr>
        `
    })
}