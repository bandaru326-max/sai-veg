/**
 * Sai Bazaar - Admin Dashboard Controller
 * Manages stats rendering, product CRUD operations, orders log, and inquiries listing.
 */

document.addEventListener("DOMContentLoaded", () => {
  checkAdminAuthentication();
  setupAddProductForm();
  setupResetButton();
  setupLogoutButton();
  setupMobileNavToggle();
});

function checkAdminAuthentication() {
  const loginPanel = document.getElementById("adminLoginPanel");
  const mainContent = document.getElementById("adminMainContent");
  const logoutBtn = document.getElementById("logoutBtn");

  if (sessionStorage.getItem("sb_admin_logged_in") === "true") {
    if (loginPanel) loginPanel.style.display = "none";
    if (mainContent) mainContent.style.display = "block";
    if (logoutBtn) logoutBtn.style.display = "inline-flex";
    renderDashboard();
  } else {
    if (loginPanel) loginPanel.style.display = "block";
    if (mainContent) mainContent.style.display = "none";
    if (logoutBtn) logoutBtn.style.display = "none";
  }
}

window.handleAdminLogin = function(e) {
  e.preventDefault();
  const pass = document.getElementById("adminPass").value;
  
  if (pass === "sai326") {
    sessionStorage.setItem("sb_admin_logged_in", "true");
    showToast("Dashboard unlocked successfully!");
    
    const adminNavLink = document.getElementById("adminNavLink");
    if (adminNavLink) adminNavLink.style.display = "block";
    
    checkAdminAuthentication();
  } else {
    showToast("Incorrect password. Please try again.", "error");
  }
};

function setupLogoutButton() {
  const btn = document.getElementById("logoutBtn");
  if (!btn) return;
  btn.addEventListener("click", () => {
    sessionStorage.removeItem("sb_admin_logged_in");
    showToast("Logged out successfully.", "error");
    setTimeout(() => {
      window.location.href = "index.html";
    }, 500);
  });
}

// Mobile menu toggle
function setupMobileNavToggle() {
  const toggle = document.getElementById("mobileToggle");
  const navLinks = document.getElementById("navLinks");
  if (toggle && navLinks) {
    toggle.addEventListener("click", () => {
      navLinks.classList.toggle("show");
    });
  }
}

// Master Render Dashboard function
function renderDashboard() {
  renderStats();
  renderProductsTable();
  renderOrdersTable();
  renderInquiriesTable();
}

// Calculate and render stats counters
function renderStats() {
  const products = getProducts();
  const inquiries = getInquiries();
  const orders = JSON.parse(localStorage.getItem("sb_orders") || "[]");
  const outOfStock = products.filter(p => p.stock <= 0).length;

  document.getElementById("statTotalProducts").textContent = products.length;
  document.getElementById("statOutOfStock").textContent = outOfStock;
  document.getElementById("statTotalOrders").textContent = orders.length;
  document.getElementById("statTotalInquiries").textContent = inquiries.length;
}

// Render Products Table
function renderProductsTable() {
  const tbody = document.getElementById("adminProductsTableBody");
  if (!tbody) return;

  const products = getProducts();

  if (products.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align: center; color: var(--text-muted); padding: 30px 0;">No vegetables in database. Click Reset to load defaults!</td></tr>`;
    return;
  }

  tbody.innerHTML = products.map(p => {
    return `
      <tr id="row-${p.id}">
        <td>
          <img src="${p.image}" alt="${p.name}" class="admin-table-thumb">
        </td>
        <td>
          <strong style="display:block; font-size:14px;">${p.name}</strong>
          <span style="font-size:12px; color: var(--text-muted);">(${p.hindiName})</span>
        </td>
        <td style="text-transform: capitalize; font-weight: 500; font-size: 13px;">
          ${p.category}
        </td>
        <td>
          <input type="number" value="${p.price}" class="admin-price-input" id="price-${p.id}" min="1">
          <span style="font-size:11px; display:block; color:var(--text-muted); margin-top:2px;">per ${p.unit.split(" ")[1] || "unit"}</span>
        </td>
        <td>
          <input type="number" value="${p.marketPrice}" class="admin-price-input" id="mprice-${p.id}" min="1">
        </td>
        <td>
          <input type="number" value="${p.stock}" class="admin-price-input" id="stock-${p.id}" min="0" style="width: 65px;">
        </td>
        <td>
          <button 
            type="button" 
            onclick="toggleRowStock('${p.id}')" 
            class="admin-stock-toggle ${p.stock > 0 ? 'badge-instock' : 'badge-outofstock'}">
            ${p.stock > 0 ? 'In Stock' : 'Out of Stock'}
          </button>
        </td>
        <td style="white-space: nowrap;">
          <button onclick="saveRow('${p.id}')" class="btn btn-primary btn-sm" style="padding: 6px 10px; min-width:34px;" title="Save Edits">
            <i class="fa-solid fa-floppy-disk"></i>
          </button>
          <button onclick="deleteRow('${p.id}')" class="btn btn-outline btn-sm" style="padding: 6px 10px; min-width:34px; color:var(--danger); border-color:var(--danger);" title="Delete Product">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </td>
      </tr>
    `;
  }).join("");
}

// Save row edits
window.saveRow = function(id) {
  const priceInput = document.getElementById(`price-${id}`);
  const mpriceInput = document.getElementById(`mprice-${id}`);
  const stockInput = document.getElementById(`stock-${id}`);

  if (!priceInput || !mpriceInput || !stockInput) return;

  const price = parseInt(priceInput.value);
  const marketPrice = parseInt(mpriceInput.value);
  const stock = parseInt(stockInput.value);

  if (isNaN(price) || price <= 0 || isNaN(marketPrice) || marketPrice <= 0 || isNaN(stock) || stock < 0) {
    showToast("Values must be positive integers.", "error");
    return;
  }

  const success = updateProduct(id, { price, marketPrice, stock });
  if (success) {
    showToast("Product updated successfully!");
    renderDashboard();
  } else {
    showToast("Could not save changes.", "error");
  }
};

// Toggle stock badge directly
window.toggleRowStock = function(id) {
  const product = getProductById(id);
  if (!product) return;

  const newStock = product.stock > 0 ? 0 : 80; // Toggle between 0 and a default restock qty
  const success = updateProduct(id, { stock: newStock });
  
  if (success) {
    showToast(newStock > 0 ? "Product marked In Stock." : "Product marked Out of Stock.");
    renderDashboard();
  }
};

// Delete row product
window.deleteRow = function(id) {
  const p = getProductById(id);
  if (!p) return;

  if (confirm(`Are you sure you want to delete ${p.name} (${p.hindiName}) from the catalog?`)) {
    deleteProduct(id);
    showToast(`${p.name} deleted.`, "error");
    renderDashboard();
  }
};

// Setup Form for adding a new product
function setupAddProductForm() {
  const form = document.getElementById("addProductForm");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("newEngName").value.trim();
    const hindiName = document.getElementById("newHindiName").value.trim();
    const category = document.getElementById("newCategory").value;
    const unit = document.getElementById("newUnit").value.trim();
    const price = parseInt(document.getElementById("newPrice").value);
    const marketPrice = parseInt(document.getElementById("newMarketPrice").value);
    const stock = parseInt(document.getElementById("newStock").value);
    const featured = document.getElementById("newFeatured").value === "true";
    const image = document.getElementById("newImg").value.trim();
    const description = document.getElementById("newDesc").value.trim();

    if (price < 1 || marketPrice < 1 || stock < 0) {
      showToast("Prices must be >= ₹1. Stock must be >= 0.", "error");
      return;
    }

    const newProd = addProduct({
      name,
      hindiName,
      category,
      unit,
      price,
      marketPrice,
      stock,
      isFeatured: featured,
      image,
      description
    });

    if (newProd) {
      showToast(`${name} published successfully!`);
      form.reset();
      renderDashboard();
    } else {
      showToast("Error creating product.", "error");
    }
  });
}

// Reset Database Button
function setupResetButton() {
  const btn = document.getElementById("resetDbBtn");
  if (!btn) return;

  btn.addEventListener("click", () => {
    if (confirm("This will overwrite custom vegetable changes and restore default items. Proceed?")) {
      resetDatabase();
      showToast("Database restored to defaults!");
      renderDashboard();
    }
  });
}

// Render Orders Logs
function renderOrdersTable() {
  const tbody = document.getElementById("adminOrdersTableBody");
  if (!tbody) return;

  const orders = JSON.parse(localStorage.getItem("sb_orders") || "[]");

  if (orders.length === 0) {
    tbody.innerHTML = `<tr><td colspan="9" style="text-align: center; color: var(--text-muted); padding: 30px 0;">No client orders logged yet. Check checkout page!</td></tr>`;
    return;
  }

  // Reverse list to show latest orders first
  const reversedOrders = [...orders].reverse();

  tbody.innerHTML = reversedOrders.map(o => {
    return `
      <tr>
        <td><strong>${o.id}</strong><br><span style="font-size:10px; color:var(--text-muted);">${o.date}</span></td>
        <td><strong>${o.customerName}</strong></td>
        <td>${o.mobile}</td>
        <td><div style="max-width: 160px; font-size:11px; max-height:48px; overflow:hidden; text-overflow:ellipsis;" title="${o.address}">${o.address}</div></td>
        <td style="font-size:12px; font-weight:500;">${o.deliverySlot.split(" - ")[0]}</td>
        <td style="font-weight: 700; font-size:12px; color:var(--primary);">${o.paymentMethod}</td>
        <td><strong>₹${o.total}</strong></td>
        <td style="color:var(--success); font-weight:600;">₹${o.savings}</td>
        <td>
          <select onchange="updateOrderStatus('${o.id}', this.value)" class="sort-select" style="font-size: 11px; padding: 4px 8px; border-radius: 4px; font-weight:600; cursor:pointer;">
            <option value="Pending" ${o.status === "Pending" ? "selected" : ""}>Pending</option>
            <option value="Dispatched" ${o.status === "Dispatched" ? "selected" : ""}>Dispatched</option>
            <option value="Delivered" ${o.status === "Delivered" ? "selected" : ""}>Delivered</option>
          </select>
        </td>
      </tr>
    `;
  }).join("");
}

// Update Order status
window.updateOrderStatus = function(orderId, newStatus) {
  const orders = JSON.parse(localStorage.getItem("sb_orders") || "[]");
  const index = orders.findIndex(o => o.id === orderId);
  if (index !== -1) {
    orders[index].status = newStatus;
    localStorage.setItem("sb_orders", JSON.stringify(orders));
    showToast(`Order ${orderId} updated to: ${newStatus}`);
    renderDashboard();
  }
};

// Render Inquiries Logs
function renderInquiriesTable() {
  const tbody = document.getElementById("adminInquiriesTableBody");
  if (!tbody) return;

  const inquiries = getInquiries();

  if (inquiries.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-muted); padding: 30px 0;">No client contact messages received yet.</td></tr>`;
    return;
  }

  // Reverse list to show latest inquiries first
  const reversedInquiries = [...inquiries].reverse();

  tbody.innerHTML = reversedInquiries.map(inq => {
    return `
      <tr>
        <td>${inq.date}</td>
        <td><strong>${inq.name}</strong></td>
        <td><a href="mailto:${inq.email}" style="color:var(--primary); font-weight:500;">${inq.email}</a></td>
        <td>${inq.phone}</td>
        <td><span class="admin-badge" style="padding: 2px 8px; font-size:11px; background:var(--primary-light); color:var(--primary); border:none;">${inq.subject}</span></td>
        <td><div style="max-width: 250px; font-size: 12px; font-style:italic;" title="${inq.message}">${inq.message}</div></td>
      </tr>
    `;
  }).join("");
}
