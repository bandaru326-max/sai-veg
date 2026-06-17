/**
 * Sai Bazaar - Homepage Controller
 * Manages rendering featured products and special combo actions.
 */

document.addEventListener("DOMContentLoaded", () => {
  renderFeaturedProducts();
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

// Render products that are marked as featured
function renderFeaturedProducts() {
  const grid = document.getElementById("featuredProductsGrid");
  if (!grid) return;

  const products = getProducts();
  // Filter for featured items
  const featured = products.filter(p => p.isFeatured).slice(0, 4);

  if (featured.length === 0) {
    grid.innerHTML = `<p style="text-align: center; grid-column: 1/-1; color: var(--text-muted);">No featured products today. Check back soon!</p>`;
    return;
  }

  grid.innerHTML = featured.map(p => {
    const isOutOfStock = p.stock <= 0;
    const discountPct = Math.round(((p.marketPrice - p.price) / p.marketPrice) * 100);
    const hasDiscount = discountPct > 0;
    const discountText = hasDiscount ? `${discountPct}% OFF` : "";

    // Generate stars
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
        
        <div class="product-img-wrapper" onclick="window.location.href='shop.html?product=${p.id}'">
          <img src="${p.image}" alt="Buy Fresh ${p.name} (${p.hindiName}) online" class="product-img" loading="lazy">
        </div>
        
        <div class="product-info">
          <span class="product-category">${p.category}</span>
          <h3 class="product-title" onclick="window.location.href='shop.html?product=${p.id}'">${p.name}</h3>
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
              onclick="handleAddFeaturedToCart('${p.id}')" 
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

// Wrapper function to add featured product to cart and update badge
function handleAddFeaturedToCart(productId) {
  addToCart(productId, 1);
}

// Special Combo pack handles
window.addComboToCart = function(comboId) {
  if (comboId === 'combo-essential') {
    // 2 Potato (veg-1), 2 Onion (veg-2), 1 Tomato (veg-3)
    const pSuccess = addToCart('veg-1', 2);
    const oSuccess = addToCart('veg-2', 2);
    const tSuccess = addToCart('veg-3', 1);
    
    if (pSuccess || oSuccess || tSuccess) {
      showToast("Essential Veggie Combo added to cart!", "success");
    } else {
      showToast("Could not add combo. Check stock levels.", "error");
    }
  } else if (comboId === 'combo-salad') {
    // 1 Carrot (veg-8), 1 Mint (veg-11) or lemon (veg-15)
    // Let's add Carrot, Lemon, Coriander
    const cSuccess = addToCart('veg-8', 1);
    const lSuccess = addToCart('veg-15', 1);
    const dSuccess = addToCart('veg-11', 1);
    
    if (cSuccess || lSuccess || dSuccess) {
      showToast("Green Salad Combo added to cart!", "success");
    } else {
      showToast("Could not add combo. Check stock levels.", "error");
    }
  }
};
