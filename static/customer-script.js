const API = "http://127.0.0.1:8000"

let registerModalInstance = null
let loginModalInstance = null

// Initialize modals when page loads
document.addEventListener('DOMContentLoaded', function() {
    registerModalInstance = new bootstrap.Modal(document.getElementById('registerModal'))
    loginModalInstance = new bootstrap.Modal(document.getElementById('loginModal'))
})

function saveCustomerToken(token, username) {
    localStorage.setItem("customerToken", token)
    localStorage.setItem("customerName", username)
}

function getCustomerToken() {
    return localStorage.getItem("customerToken")
}

function getCustomerName() {
    return localStorage.getItem("customerName")
}

function showRegister() {
    registerModalInstance.show()
}

function showLogin() {
    loginModalInstance.show()
}

function logout() {
    localStorage.clear()
    location.reload()
}

function checkIfLoggedIn() {
    const token = getCustomerToken()
    if (token) {
        document.getElementById("customerSection").style.display = "block"
        document.getElementById("customerName").innerText = getCustomerName()
        loadMyOrders()
    }
}

// ============= REGISTRATION =============

async function registerCustomer() {
    const name = document.getElementById("regName").value
    const email = document.getElementById("regEmail").value
    const phone = document.getElementById("regPhone").value
    const password = document.getElementById("regPassword").value

    if (!name || !email || !password) {
        alert("Please fill in all required fields")
        return
    }

    try {
        const res = await fetch(`${API}/register`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                username: name,
                email: email,
                password: password
            })
        })

        if (res.ok) {
            alert("✅ Registration successful! Please login.")
            registerModalInstance.hide()
            
            // Clear fields
            document.getElementById("regName").value = ""
            document.getElementById("regEmail").value = ""
            document.getElementById("regPhone").value = ""
            document.getElementById("regPassword").value = ""
            
            // Show login modal
            setTimeout(() => showLogin(), 500)
        } else {
            const data = await res.json()
            alert("❌ " + (data.detail || "Registration failed"))
        }
    } catch (err) {
        alert("❌ Error: " + err.message)
    }
}

// ============= LOGIN =============

async function loginCustomer() {
    const username = document.getElementById("loginUsername").value
    const password = document.getElementById("loginPassword").value

    if (!username || !password) {
        alert("Please enter your credentials")
        return
    }

    try {
        const res = await fetch(`${API}/login`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                username: username,
                password: password
            })
        })

        if (res.ok) {
            const data = await res.json()
            
            // Only allow regular users (not admin)
            if (data.role === "admin") {
                alert("❌ Please use the admin panel to login")
                return
            }
            
            saveCustomerToken(data.access_token, username)
            loginModalInstance.hide()
            
            alert("✅ Welcome back!")
            location.reload()
        } else {
            const data = await res.json()
            alert("❌ " + (data.detail || "Login failed"))
        }
    } catch (err) {
        alert("❌ Error: " + err.message)
    }
}

// ============= SERVICES =============

async function loadServices() {
    try {
        const res = await fetch(`${API}/services`)
        const services = await res.json()

        const grid = document.getElementById("servicesGrid")
        grid.innerHTML = ""

        if (services.length === 0) {
            grid.innerHTML = `
                <div class="col-12 text-center text-muted py-5">
                    <h4>No services available yet</h4>
                    <p>Check back soon!</p>
                </div>
            `
            return
        }

        services.forEach(service => {
            grid.innerHTML += `
                <div class="col-md-4 mb-4">
                    <div class="card service-card h-100">
                        <div class="card-body">
                            <h5 class="card-title">${service.name}</h5>
                            <p class="card-text text-muted">${service.description}</p>
                            <h4 class="text-primary">$${service.price}</h4>
                            <small class="text-muted">From: ${service.store_name}</small>
                        </div>
                        <div class="card-footer bg-white border-0">
                            <button onclick="orderService('${service.id}', '${service.name}')" 
                                    class="btn btn-primary w-100">
                                🛒 Order Now
                            </button>
                        </div>
                    </div>
                </div>
            `
        })
    } catch (err) {
        console.error("Error loading services:", err)
    }
}

// ============= ORDERS =============

async function orderService(serviceId, serviceName) {
    const token = getCustomerToken()
    
    if (!token) {
        alert("Please login or register first to place an order")
        showLogin()
        return
    }

    if (!confirm(`Order "${serviceName}"?`)) {
        return
    }

    try {
        const res = await fetch(`${API}/orders`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify({
                service_id: serviceId
            })
        })

        if (res.ok) {
            alert("✅ Order placed successfully!")
            loadMyOrders()
            
            // Scroll to orders section
            document.getElementById("customerSection").scrollIntoView({ behavior: 'smooth' })
        } else {
            const data = await res.json()
            alert("❌ " + (data.detail || "Order failed"))
        }
    } catch (err) {
        alert("❌ Error: " + err.message)
    }
}

async function loadMyOrders() {
    const token = getCustomerToken()
    
    if (!token) return

    try {
        const res = await fetch(`${API}/orders`, {
            headers: {
                "Authorization": "Bearer " + token
            }
        })

        if (res.ok) {
            const orders = await res.json()
            const tbody = document.getElementById("myOrders")
            tbody.innerHTML = ""

            if (orders.length === 0) {
                tbody.innerHTML = `
                    <tr>
                        <td colspan="5" class="text-center text-muted">
                            No orders yet. Browse services above to place your first order!
                        </td>
                    </tr>
                `
                return
            }

            orders.forEach((order, index) => {
                const statusBadge = order.status === "Completed" 
                    ? '<span class="badge bg-success">Completed ✓</span>'
                    : '<span class="badge bg-warning">Pending</span>'

                tbody.innerHTML += `
                    <tr>
                        <td>#${index + 1}</td>
                        <td>${order.service_name}</td>
                        <td>$${order.price}</td>
                        <td>${statusBadge}</td>
                        <td>${new Date(order.created_at).toLocaleDateString()}</td>
                    </tr>
                `
            })
        }
    } catch (err) {
        console.error("Error loading orders:", err)
    }
}