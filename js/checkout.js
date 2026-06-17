/**
 * Sai Bazaar - Checkout Page Controller
 * Handles order reviewing, shipping inputs, cost breakdown, payment mock, and placement logs.
 */

let finalTotal = 0;
let finalSubtotal = 0;
let finalSavings = 0;
let finalDelivery = 0;
let activePaymentMethod = "cod";

document.addEventListener("DOMContentLoaded", () => {
  renderCheckoutPage();
  setupDeliveryForm();
  setupPaymentModal();
  setupMobileNavToggle();
});

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

// Render the cart items and price summaries on Checkout page
function renderCheckoutPage() {
  const list = document.getElementById("checkoutItemsList");
  const mainLayout = document.getElementById("checkoutMainLayout");
  
  if (!list) return;

  const cart = getCart();

  if (cart.length === 0) {
    if (mainLayout) {
      mainLayout.innerHTML = `
        <div style="text-align: center; grid-column: 1/-1; padding: 80px 20px; background: white; border: 1px solid var(--border); border-radius: var(--radius-md);">
          <span style="font-size: 60px; display: block; margin-bottom: 20px;">🛒</span>
          <h2 class="serif-title" style="font-size: 24px; margin-bottom: 8px;">Your Cart is Empty</h2>
          <p style="color: var(--text-muted); margin-bottom: 24px;">Please add vegetables from the catalog to proceed to checkout.</p>
          <a href="shop.html" class="btn btn-primary">Go to Shop Mandi</a>
        </div>
      `;
    }
    return;
  }

  let subtotal = 0;
  let totalMarketVal = 0;

  list.innerHTML = cart.map(item => {
    const prod = getProductById(item.id);
    if (!prod) return "";

    const itemTotal = prod.price * item.quantity;
    const itemMarketTotal = prod.marketPrice * item.quantity;
    
    subtotal += itemTotal;
    totalMarketVal += itemMarketTotal;

    return `
      <div class="cart-item-row">
        <div class="cart-item-info">
          <img src="${prod.image}" alt="${prod.name}" class="cart-item-thumb">
          <div class="cart-item-title">
            <h4>${prod.name}</h4>
            <p>(${prod.hindiName}) &bull; ${prod.unit}</p>
          </div>
        </div>
        
        <div>
          <span style="font-weight: 600;">₹${prod.price}</span>
        </div>
        
        <div>
          <div class="qty-control" style="transform: scale(0.9);">
            <button class="qty-btn" onclick="handleCheckoutQtyUpdate('${prod.id}', ${item.quantity - 1})">-</button>
            <input type="number" value="${item.quantity}" class="qty-input" readonly>
            <button class="qty-btn" onclick="handleCheckoutQtyUpdate('${prod.id}', ${item.quantity + 1})">+</button>
          </div>
        </div>
        
        <div>
          <span style="font-weight: 700; color: var(--primary);">₹${itemTotal}</span>
        </div>
        
        <div>
          <button class="cart-item-remove-btn" onclick="handleCheckoutItemRemove('${prod.id}')" aria-label="Remove Product">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </div>
      </div>
    `;
  }).join("");

  // Calculate pricing values
  finalSubtotal = subtotal;
  finalSavings = totalMarketVal - subtotal;
  // Free delivery above ₹199, else ₹30 delivery fee
  finalDelivery = subtotal >= 199 ? 0 : 30;
  finalTotal = subtotal + finalDelivery;

  // Set text labels
  document.getElementById("subtotalCost").textContent = `₹${finalSubtotal}`;
  document.getElementById("savingsCost").textContent = `₹${finalSavings} (${Math.round((finalSavings / totalMarketVal) * 100) || 0}% OFF)`;
  document.getElementById("deliveryCost").textContent = finalDelivery === 0 ? "FREE" : `₹${finalDelivery}`;
  document.getElementById("totalCost").textContent = `₹${finalTotal}`;
}

// Quantity Handlers
window.handleCheckoutQtyUpdate = function(id, newQty) {
  updateCartQty(id, newQty);
  renderCheckoutPage();
};

window.handleCheckoutItemRemove = function(id) {
  removeFromCart(id);
  renderCheckoutPage();
  showToast("Item removed from checkout.", "error");
};

// Delivery Details Form Validation & Submit
function setupDeliveryForm() {
  const form = document.getElementById("deliveryForm");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      
      const mobile = document.getElementById("custMobile").value.trim();
      if (mobile.length !== 10 || isNaN(mobile)) {
        showToast("Please enter a valid 10-digit mobile number.", "error");
        return;
      }
      
      // Open Payment Modal
      openPaymentModal();
    });
  }
}

// Payment Modal Controller
function openPaymentModal() {
  const modal = document.getElementById("paymentModal");
  const label = document.getElementById("paymentTotalLabel");
  
  if (modal && label) {
    label.textContent = `₹${finalTotal}`;
    modal.style.display = "flex";
  }
}

function setupPaymentModal() {
  const modal = document.getElementById("paymentModal");
  const closeBtn = document.getElementById("paymentCloseBtn");
  
  if (closeBtn && modal) {
    closeBtn.addEventListener("click", () => {
      modal.style.display = "none";
    });
    
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.style.display = "none";
      }
    });
  }

  // Handle switching payment methods
  const methods = document.querySelectorAll(".payment-method-item");
  methods.forEach(m => {
    m.addEventListener("click", () => {
      methods.forEach(item => item.classList.remove("active"));
      m.classList.add("active");
      
      activePaymentMethod = m.dataset.method;
      
      // Hide all detail panels and show active
      const panels = ["cod", "upi", "card", "netbanking"];
      panels.forEach(p => {
        const panelEl = document.getElementById(`panel-${p}`);
        if (panelEl) {
          panelEl.style.display = p === activePaymentMethod ? "block" : "none";
        }
      });
    });
  });

  // Handle Confirm Order
  const confirmBtn = document.getElementById("confirmPaymentBtn");
  if (confirmBtn) {
    confirmBtn.addEventListener("click", () => {
      placeFinalOrder();
    });
  }
}

// Place Order
function placeFinalOrder() {
  // Validate card inputs if card is selected
  if (activePaymentMethod === "card") {
    const cardNum = document.getElementById("cardNum").value.trim();
    const expiry = document.getElementById("cardExpiry").value.trim();
    const cvv = document.getElementById("cardCvv").value.trim();
    
    if (!cardNum || !expiry || !cvv) {
      showToast("Please fill in card detail fields.", "error");
      return;
    }
  }

  const name = document.getElementById("custName").value.trim();
  const mobile = document.getElementById("custMobile").value.trim();
  const address = document.getElementById("custAddress").value.trim();
  const slot = document.getElementById("deliverySlot").value;
  const cart = getCart();

  const orderData = {
    customerName: name,
    mobile: mobile,
    address: address,
    deliverySlot: slot,
    paymentMethod: activePaymentMethod.toUpperCase(),
    items: cart,
    subtotal: finalSubtotal,
    deliveryFee: finalDelivery,
    total: finalTotal,
    savings: finalSavings
  };

  const orderId = placeOrder(orderData);
  
  // Close Payment Modal
  document.getElementById("paymentModal").style.display = "none";

  // Pop Success Overlay
  document.getElementById("successOrderId").textContent = orderId;
  document.getElementById("successAmount").textContent = `₹${finalTotal}`;
  document.getElementById("successSlot").textContent = slot;
  document.getElementById("successMobile").textContent = mobile;
  
  document.getElementById("successOverlay").style.display = "flex";
}
