const API = "http://127.0.0.1:8000"

async function loadAdminDashboard() {
    await loadStats()
    await loadAllOrdersAdmin()
}

async function loadStats() {
    try {
        // Load stores count
        const storesRes = await fetch(`${API}/stores`)
        const stores = await storesRes.json()
        document.getElementById("totalStores").innerText = stores.length

        // Load services count
        const servicesRes = await fetch(`${API}/services`)
        const services = await servicesRes.json()
        document.getElementById("totalServices").innerText = services.length

        // Load orders and calculate stats
        const ordersRes = await fetch(`${API}/admin/orders`, {
            headers: {
                "Authorization": "Bearer " + getToken()
            }
        })
        const orders = await ordersRes.json()
        
        const pendingCount = orders.filter(o => o.status === "Pending").length
        
        document.getElementById("totalOrders").innerText = orders.length
        document.getElementById("pendingOrders").innerText = pendingCount

    } catch (err) {
        console.error("Error loading stats:", err)
    }
}

async function loadAllOrdersAdmin() {
    try {
        const res = await fetch(`${API}/admin/orders`, {
            headers: {
                "Authorization": "Bearer " + getToken()
            }
        })

        const orders = await res.json()

        // Separate orders by status
        const allOrders = orders
        const pendingOrders = orders.filter(o => o.status === "Pending")
        const completedOrders = orders.filter(o => o.status === "Completed")

        // Update counts
        document.getElementById("countAll").innerText = allOrders.length
        document.getElementById("countPending").innerText = pendingOrders.length
        document.getElementById("countCompleted").innerText = completedOrders.length

        // Render tables
        renderOrderTable("allOrdersTable", allOrders, true)
        renderOrderTable("pendingOrdersTable", pendingOrders, true)
        renderOrderTable("completedOrdersTable", completedOrders, false)

    } catch (err) {
        console.error("Error loading orders:", err)
    }
}

function renderOrderTable(tableId, orders, showActions) {
    const tbody = document.getElementById(tableId)
    tbody.innerHTML = ""

    if (orders.length === 0) {
        const colspan = showActions ? 8 : 6
        tbody.innerHTML = `
            <tr>
                <td colspan="${colspan}" class="text-center text-muted py-4">
                    No orders in this category
                </td>
            </tr>
        `
        return
    }

    orders.forEach(order => {
        const statusBadge = order.status === "Completed"
            ? '<span class="badge bg-success">Completed ✓</span>'
            : '<span class="badge bg-warning text-dark">Pending</span>'

        const actionButton = order.status === "Pending"
            ? `<button onclick="completeOrder('${order.id}')" class="btn btn-success btn-sm">
                   Mark Complete
               </button>`
            : '<span class="text-success">Completed ✓</span>'

        let row = `
            <tr>
                <td>${order.id.substring(0, 8)}...</td>
                <td><strong>${order.customer_name}</strong></td>
                <td>${order.store_name}</td>
                <td>${order.service_name}</td>
        `

        if (tableId === "allOrdersTable") {
            row += `
                <td>€${order.price || 'N/A'}</td>
                <td>${statusBadge}</td>
                <td>${new Date(order.created_at || Date.now()).toLocaleDateString()}</td>
            `
        } else {
            row += `
                <td>€${order.price || 'N/A'}</td>
                <td>${new Date(order.created_at || Date.now()).toLocaleDateString()}</td>
            `
        }

        if (showActions) {
            row += `<td>${actionButton}</td>`
        }

        row += `</tr>`
        tbody.innerHTML += row
    })
}

async function completeOrder(orderId) {
    if (!confirm("Mark this order as completed?")) {
        return
    }

    try {
        const res = await fetch(`${API}/orders/${orderId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + getToken()
            },
            body: JSON.stringify({
                status: "Completed"
            })
        })

        if (res.ok) {
            alert("✅ Order marked as completed!")
            loadAdminDashboard() // Reload all data
        } else {
            alert("❌ Failed to update order")
        }
    } catch (err) {
        alert("❌ Error: " + err.message)
    }
}

function getToken() {
    return localStorage.getItem("token")
}