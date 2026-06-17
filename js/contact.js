/**
 * Sai Bazaar - Contact Page Controller
 * Validates inquiry forms and logs them to localStorage databases.
 */

document.addEventListener("DOMContentLoaded", () => {
  setupContactForm();
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

// Contact Form Handler
function setupContactForm() {
  const form = document.getElementById("contactForm");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("contactName").value.trim();
    const email = document.getElementById("contactEmail").value.trim();
    const phone = document.getElementById("contactPhone").value.trim();
    const subject = document.getElementById("contactSubject").value;
    const message = document.getElementById("contactMessage").value.trim();

    // Basic Validations
    if (!name || !email || !subject || !message) {
      showToast("Please fill in all required fields.", "error");
      return;
    }

    // Email regex validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showToast("Please enter a valid email address.", "error");
      return;
    }

    // Phone validation (if filled, must be 10 digits)
    if (phone && (phone.length !== 10 || isNaN(phone))) {
      showToast("Mobile number must be exactly 10 digits.", "error");
      return;
    }

    // Save inquiry to localStorage
    const inquiry = {
      name: name,
      email: email,
      phone: phone || "N/A",
      subject: subject,
      message: message
    };

    const success = addInquiry(inquiry);
    
    if (success) {
      showToast("Inquiry submitted successfully! We will contact you soon.");
      form.reset();
    } else {
      showToast("Something went wrong. Please try again.", "error");
    }
  });
}
