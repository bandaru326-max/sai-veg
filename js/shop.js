/**
 * Sai Bazaar - Shop Page Controller
 * Manages product list rendering, search, filters, sorting, product details modal, and cart drawer.
 */

let activeFilters = {
  categories: [],
  maxPrice: 200,
  onlyOffers: false,
  hideOutStock: false,
  searchQuery: ""
};

let currentProductId = null; // Track product in detail modal
let modalQty = 1;

document.addEventListener("DOMContentLoaded", () => {
  setupFilters();
  setupModal();
  setupCartDrawer();
  setupMobileNavToggle();
  
  // Parse query parameters
  parseUrlParams();
  
  // Render catalog
  renderProducts();
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

// Parse URL Parameters (e.g. ?category=root or ?product=veg-1 or ?showCart=true)
function parseUrlParams() {
  const params = new URLSearchParams(window.location.search);
  
  // Category filter parameter
  const cat = params.get("category");
  if (cat) {
    activeFilters.categories = [cat];
    const chks = document.querySelectorAll(".category-filter-chk");
    chks.forEach(chk => {
      if (chk.value === cat) chk.checked = true;
    });
  }
  
  // Product details modal trigger
  const prodId = params.get("product");
  if (prodId) {
    setTimeout(() => {
      openProductModal(prodId);
    }, 150);
  }
  
  // Cart drawer trigger
  const showCart = params.get("showCart");
  if (showCart === "true") {
    setTimeout(() => {
      toggleCartDrawer(true);
    }, 150);
  }
}

// Setup Filters UI & Event Listeners
function setupFilters() {
  // Category checkboxes
  const chks = document.querySelectorAll(".category-filter-chk");
  chks.forEach(chk => {
    chk.addEventListener("change", () => {
      activeFilters.categories = Array.from(chks)
        .filter(c => c.checked)
        .map(c => c.value);
      renderProducts();
    });
  });

  // Price range slider
  const slider = document.getElementById("priceRangeSlider");
  const label = document.getElementById("priceRangeLabel");
  if (slider && label) {
    slider.addEventListener("input", (e) => {
      const val = parseInt(e.target.value);
      activeFilters.maxPrice = val;
      label.textContent = `Max: ₹${val}`;
      renderProducts();
    });
  }

  // Offers checkbox
  const offersChk = document.getElementById("onlyOffersChk");
  if (offersChk) {
    offersChk.addEventListener("change", (e) => {
      activeFilters.onlyOffers = e.target.checked;
      renderProducts();
    });
  }

  // Stock checkbox
  const stockChk = document.getElementById("excludeOutStockChk");
  if (stockChk) {
    stockChk.addEventListener("change", (e) => {
      activeFilters.hideOutStock = e.target.checked;
      renderProducts();
    });
  }

  // Search input
  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      activeFilters.searchQuery = e.target.value.toLowerCase().trim();
      renderProducts();
    });
  }

  // Sort dropdown
  const sortSelect = document.getElementById("sortSelect");
  if (sortSelect) {
    sortSelect.addEventListener("change", () => {
      renderProducts();
    });
  }

  // Reset Filters
  const resetBtn = document.getElementById("resetFiltersBtn");
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      chks.forEach(c => c.checked = false);
      activeFilters.categories = [];
      
      if (slider && label) {
        slider.value = 200;
        activeFilters.maxPrice = 200;
        label.textContent = "Max: ₹200";
      }
      
      if (offersChk) {
        offersChk.checked = false;
        activeFilters.onlyOffers = false;
      }
      
      if (stockChk) {
        stockChk.checked = false;
        activeFilters.hideOutStock = false;
      }
      
      if (searchInput) {
        searchInput.value = "";
        activeFilters.searchQuery = "";
      }
      
      if (sortSelect) {
        sortSelect.value = "default";
      }
      
      renderProducts();
    });
  }
}

// Render Products Grid
function renderProducts() {
  const grid = document.getElementById("shopProductsGrid");
  if (!grid) return;

  let products = getProducts();

  // Apply filters
  products = products.filter(p => {
    // Category filter
    if (activeFilters.categories.length > 0 && !activeFilters.categories.includes(p.category)) {
      return false;
    }
    // Price filter
    if (p.price > activeFilters.maxPrice) {
      return false;
    }
    // Offers filter
    if (activeFilters.onlyOffers && !p.isOffer && (p.marketPrice === p.price)) {
      // If it doesn't have a discount or isn't marked as offer
      return false;
    }
    // Stock filter
    if (activeFilters.hideOutStock && p.stock <= 0) {
      return false;
    }
    // Search filter
    if (activeFilters.searchQuery) {
      const nameMatch = p.name.toLowerCase().includes(activeFilters.searchQuery);
      const hindiMatch = p.hindiName.toLowerCase().includes(activeFilters.searchQuery);
      if (!nameMatch && !hindiMatch) return false;
    }
    return true;
  });

  // Apply Sorting
  const sortVal = document.getElementById("sortSelect")?.value;
  if (sortVal === "price-low") {
    products.sort((a, b) => a.price - b.price);
  } else if (sortVal === "price-high") {
    products.sort((a, b) => b.price - a.price);
  } else if (sortVal === "rating") {
    products.sort((a, b) => b.rating - a.rating);
  }

  if (products.length === 0) {
    grid.innerHTML = `
      <div style="text-align: center; grid-column: 1/-1; padding: 60px 0;">
        <span style="font-size: 50px; display: block; margin-bottom: 20px;">🥦</span>
        <h3 class="serif-title" style="font-size: 20px; margin-bottom: 8px;">No Vegetables Found</h3>
        <p style="color: var(--text-muted);">Try adjusting your search query or reset filters.</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = products.map(p => {
    const isOutOfStock = p.stock <= 0;
    const discountPct = Math.round(((p.marketPrice - p.price) / p.marketPrice) * 100);
    const hasDiscount = discountPct > 0;
    const discountText = hasDiscount ? `${discountPct}% OFF` : "";

    // Generate stars HTML
    const fullStars = Math.floor(p.rating);
    const halfStar = p.rating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;
    let starsHtml = "";
    for (let i = 0; i < fullStars; i++) starsHtml += '<i class="fa-solid fa-star"></i>';
    if (halfStar) starsHtml += '<i class="fa-solid fa-star-half-stroke"></i>';
    for (let i = 0; i < emptyStars; i++) starsHtml += '<i class="fa-regular fa-star"></i>';

    return `
      <article class="product-card" id="card-${p.id}">
        ${hasDiscount && !isOutOfStock ? `<span class="product-discount-badge">${discountText}</span>` : ""}
        ${isOutOfStock ? `<span class="product-out-badge">Out of Stock</span>` : ""}
        
        <div class="product-img-wrapper" onclick="openProductModal('${p.id}')">
          <img src="${p.image}" alt="Buy Fresh ${p.name} (${p.hindiName}) online" class="product-img" loading="lazy">
        </div>
        
        <div class="product-info">
          <span class="product-category">${p.category}</span>
          <h3 class="product-title" onclick="openProductModal('${p.id}')">${p.name}</h3>
          <p class="product-hindi">(${p.hindiName})</p>
          
          <div class="product-rating">
            <span class="rating-stars">${starsHtml}</span>
            <span>(${p.reviews ? p.reviews.length : 0})</span>
          </div>
          
          <div class="product-price-row">
            <span class="price-our">₹${p.price}</span>
            ${hasDiscount ? `<span class="price-market">₹${p.marketPrice}</span>` : ""}
            <span class="price-unit">/ ${p.unit}</span>
          </div>
          
          <div class="product-footer">
            <button 
              onclick="addToCart('${p.id}', 1)" 
              class="btn btn-primary btn-buy" 
              ${isOutOfStock ? "disabled" : ""}>
              <i class="fa-solid fa-basket-shopping"></i> ${isOutOfStock ? "Sold Out" : "Add to Cart"}
            </button>
          </div>
        </div>
      </article>
    `;
  }).join("");
}

// Product Modal Functionality
function setupModal() {
  const modal = document.getElementById("productModal");
  const closeBtn = document.getElementById("modalCloseBtn");
  
  if (closeBtn && modal) {
    closeBtn.addEventListener("click", () => {
      modal.style.display = "none";
    });
    
    // Close modal when clicking background
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.style.display = "none";
      }
    });
  }

  // Quantity selection controls
  const minusBtn = document.getElementById("qtyMinusBtn");
  const plusBtn = document.getElementById("qtyPlusBtn");
  const qtyInput = document.getElementById("qtyVal");

  if (minusBtn && plusBtn && qtyInput) {
    minusBtn.addEventListener("click", () => {
      if (modalQty > 1) {
        modalQty--;
        qtyInput.value = modalQty;
      }
    });

    plusBtn.addEventListener("click", () => {
      const product = getProductById(currentProductId);
      if (product && modalQty < product.stock) {
        modalQty++;
        qtyInput.value = modalQty;
      } else {
        showToast("Maximum available stock reached!", "error");
      }
    });
  }

  // Add to cart from modal
  const modalAddBtn = document.getElementById("modalAddToCartBtn");
  if (modalAddBtn) {
    modalAddBtn.addEventListener("click", () => {
      if (currentProductId) {
        const added = addToCart(currentProductId, modalQty);
        if (added) {
          modal.style.display = "none";
        }
      }
    });
  }

  // Review submission
  const reviewForm = document.getElementById("addReviewForm");
  if (reviewForm) {
    reviewForm.addEventListener("submit", (e) => {
      e.preventDefault();
      
      const author = document.getElementById("reviewAuthor").value.trim();
      const rating = parseInt(document.getElementById("reviewRating").value);
      const comment = document.getElementById("reviewComment").value.trim();
      
      if (currentProductId && author && rating && comment) {
        const added = addProductReview(currentProductId, {
          name: author,
          rating: rating,
          comment: comment
        });
        
        if (added) {
          showToast("Review submitted successfully!");
          reviewForm.reset();
          
          // Re-render product modal content to show new review
          openProductModal(currentProductId);
          // Re-render products grid in case rating changed
          renderProducts();
        }
      }
    });
  }
}

function openProductModal(id) {
  const modal = document.getElementById("productModal");
  if (!modal) return;

  const product = getProductById(id);
  if (!product) return;

  currentProductId = id;
  modalQty = 1;
  document.getElementById("qtyVal").value = 1;

  // Set values
  document.getElementById("modalProductImg").src = product.image;
  document.getElementById("modalProductImg").alt = product.name;
  document.getElementById("modalProductCategory").textContent = product.category;
  document.getElementById("modalProductName").textContent = product.name;
  document.getElementById("modalProductHindi").textContent = `(${product.hindiName})`;
  document.getElementById("modalProductPrice").textContent = `₹${product.price}`;
  document.getElementById("modalProductMarketPrice").textContent = `₹${product.marketPrice}`;
  document.getElementById("modalProductUnit").textContent = `/ ${product.unit}`;
  document.getElementById("modalProductDesc").textContent = product.description;
  
  // Stock label
  const isOutOfStock = product.stock <= 0;
  const stockLabel = document.getElementById("modalStockLabel");
  const addBtn = document.getElementById("modalAddToCartBtn");
  
  if (isOutOfStock) {
    stockLabel.textContent = "Out of Stock";
    stockLabel.style.color = "var(--danger)";
    if (addBtn) {
      addBtn.disabled = true;
      addBtn.innerHTML = `<i class="fa-solid fa-ban"></i> Out of Stock`;
    }
  } else {
    stockLabel.textContent = `In Stock: ${product.stock} ${product.unit.split(" ")[1] || "units"}`;
    stockLabel.style.color = "var(--success)";
    if (addBtn) {
      addBtn.disabled = false;
      addBtn.innerHTML = `<i class="fa-solid fa-cart-plus"></i> Add to Cart`;
    }
  }

  // Render Stars
  const starsContainer = document.getElementById("modalProductStars");
  const fullStars = Math.floor(product.rating);
  const halfStar = product.rating % 1 >= 0.5 ? 1 : 0;
  const emptyStars = 5 - fullStars - halfStar;
  let starsHtml = "";
  for (let i = 0; i < fullStars; i++) starsHtml += '<i class="fa-solid fa-star"></i>';
  if (halfStar) starsHtml += '<i class="fa-solid fa-star-half-stroke"></i>';
  for (let i = 0; i < emptyStars; i++) starsHtml += '<i class="fa-regular fa-star"></i>';
  starsContainer.innerHTML = starsHtml;

  document.getElementById("modalProductReviewCount").textContent = `(${product.reviews ? product.reviews.length : 0} customer reviews)`;

  // Render Reviews List
  const reviewsList = document.getElementById("modalReviewsList");
  if (reviewsList) {
    if (!product.reviews || product.reviews.length === 0) {
      reviewsList.innerHTML = `<p style="color: var(--text-muted); font-size: 13px; font-style: italic;">No reviews yet. Be the first to review!</p>`;
    } else {
      reviewsList.innerHTML = product.reviews.map(r => {
        let rStars = "";
        for (let i = 0; i < r.rating; i++) rStars += "⭐";
        return `
          <div class="modal-review-item">
            <div class="modal-review-header">
              <span>${r.name}</span>
              <span style="font-size: 11px;">${rStars}</span>
            </div>
            <p class="modal-review-comment">"${r.comment}"</p>
            <span style="font-size: 10px; color: var(--text-muted); display:block; text-align:right; margin-top:4px;">${r.date}</span>
          </div>
        `;
      }).join("");
    }
  }

  // Display Modal
  modal.style.display = "flex";
}

// Cart Drawer / Modal Logic
function setupCartDrawer() {
  const toggleBtn = document.getElementById("cartToggleBtn");
  const overlay = document.getElementById("cartOverlay");
  const closeBtn = document.getElementById("cartCloseBtn");
  const continueBtn = document.getElementById("continueShoppingBtn");

  if (toggleBtn && overlay && closeBtn) {
    toggleBtn.addEventListener("click", () => {
      toggleCartDrawer(true);
    });
    
    closeBtn.addEventListener("click", () => {
      toggleCartDrawer(false);
    });
    
    if (continueBtn) {
      continueBtn.addEventListener("click", () => {
        toggleCartDrawer(false);
      });
    }

    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) {
        toggleCartDrawer(false);
      }
    });
  }
}

function toggleCartDrawer(show) {
  const overlay = document.getElementById("cartOverlay");
  if (!overlay) return;

  if (show) {
    renderCartItems();
    overlay.style.display = "flex";
  } else {
    overlay.style.display = "none";
  }
}

// Render Cart Items dynamically in Drawer
function renderCartItems() {
  const list = document.getElementById("cartItemsList");
  const subtotalEl = document.getElementById("cartSubtotal");
  const savingsEl = document.getElementById("cartSavings");
  const checkoutBtn = document.getElementById("checkoutBtn");
  
  if (!list) return;

  const cart = getCart();
  
  if (cart.length === 0) {
    list.innerHTML = `
      <div style="text-align: center; padding: 40px 0;">
        <span style="font-size: 40px; display:block; margin-bottom: 15px;">🛒</span>
        <p style="color: var(--text-muted); font-size: 14px;">Your cart is empty.</p>
      </div>
    `;
    if (subtotalEl) subtotalEl.textContent = "₹0";
    if (savingsEl) savingsEl.textContent = "₹0";
    if (checkoutBtn) checkoutBtn.style.display = "none";
    return;
  }

  if (checkoutBtn) checkoutBtn.style.display = "inline-flex";

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
      <div class="cart-item-row" style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--border); padding-bottom:10px; font-size:13px;">
        <div style="display:flex; align-items:center; gap:12px; max-width:60%;">
          <img src="${prod.image}" alt="${prod.name}" style="width:40px; height:40px; object-fit:cover; border-radius:4px;">
          <div>
            <h4 style="font-size:13px; font-weight:700;">${prod.name} (${prod.hindiName})</h4>
            <p style="color:var(--text-muted); font-size:11px;">₹${prod.price} / ${prod.unit}</p>
          </div>
        </div>
        <div style="display:flex; align-items:center; gap:8px;">
          <div class="qty-control" style="transform: scale(0.85);">
            <button class="qty-btn" onclick="handleDrawerQtyUpdate('${prod.id}', ${item.quantity - 1})">-</button>
            <input type="number" value="${item.quantity}" class="qty-input" readonly style="width:30px; height:28px;">
            <button class="qty-btn" onclick="handleDrawerQtyUpdate('${prod.id}', ${item.quantity + 1})">+</button>
          </div>
          <span style="font-weight:700; min-width:40px; text-align:right;">₹${itemTotal}</span>
          <button onclick="handleDrawerItemRemove('${prod.id}')" style="background:none; border:none; color:var(--danger); cursor:pointer; font-size:14px; padding:0 4px;"><i class="fa-solid fa-trash"></i></button>
        </div>
      </div>
    `;
  }).join("");

  if (subtotalEl) subtotalEl.textContent = `₹${subtotal}`;
  if (savingsEl) {
    const savings = totalMarketVal - subtotal;
    savingsEl.textContent = `₹${savings} (${Math.round((savings / totalMarketVal) * 100) || 0}% Saved)`;
  }
}

// Drawer Action Handlers
window.handleDrawerQtyUpdate = function(id, newQty) {
  updateCartQty(id, newQty);
  renderCartItems();
};

window.handleDrawerItemRemove = function(id) {
  removeFromCart(id);
  renderCartItems();
  showToast("Item removed from cart.", "error");
};
