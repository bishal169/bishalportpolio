/* ===== GLOBAL VARIABLES & DOM ELEMENTS ===== */
const header = document.getElementById("header");
const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll("header nav a");
const hamburger = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mobileMenu");
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const caption = document.getElementById("caption");
const closeBtn = document.getElementById("closeLightbox");
const nextBtn = document.getElementById("nextImg");
const prevBtn = document.getElementById("prevImg");
const images = document.querySelectorAll(".clickable-img");
const contactForm = document.getElementById('quickContactForm');
const sendBtn = document.getElementById('sendBtn');
const formStatus = document.getElementById('formStatus');

let currentIndex = 0;
let startX = 0;

/* ===== HEADER SCROLL EFFECT & NAVIGATION HIGHLIGHTING ===== */
window.addEventListener("scroll", () => {
  // Header background on scroll
  header.classList.toggle("scrolled", window.scrollY > 50);
  
  // Active navigation link highlighting
  let current = "";
  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 150;
    const sectionHeight = section.clientHeight;
    if (pageYOffset >= sectionTop && pageYOffset < sectionTop + sectionHeight) {
      current = section.getAttribute("id");
    }
  });
  
  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === "#" + current) {
      link.classList.add("active");
    }
  });
});

/* ===== MOBILE MENU TOGGLE ===== */
if (hamburger && mobileMenu) {
  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    mobileMenu.classList.toggle("show");
  });

  // Hide mobile menu on link click
  document.querySelectorAll("#mobileMenu a").forEach(link => {
    link.addEventListener("click", () => {
      mobileMenu.classList.remove("show");
      hamburger.classList.remove("active");
    });
  });
}

/* ===== TYPED TEXT EFFECT ===== */
document.addEventListener('DOMContentLoaded', function() {
  const typedElement = document.querySelector('.typed');
  if (typedElement) {
    const words = ['Web Developer', 'Designer', 'Learner', 'Problem Solver'];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    
    function typeEffect() {
      const currentWord = words[wordIndex];
      
      if (isDeleting) {
        typedElement.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
      } else {
        typedElement.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
      }
      
      if (!isDeleting && charIndex === currentWord.length) {
        isDeleting = true;
        setTimeout(typeEffect, 2000);
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        setTimeout(typeEffect, 500);
      } else {
        setTimeout(typeEffect, isDeleting ? 50 : 100);
      }
    }
    
    typeEffect();
  }
});

/* ===== LIGHTBOX FUNCTIONALITY ===== */
function initLightbox() {
  if (!lightbox || !images.length) return;

  // Open lightbox
  images.forEach((img, index) => {
    img.addEventListener("click", () => {
      currentIndex = index;
      openLightbox(img);
    });
  });

  // Close lightbox
  if (closeBtn) {
    closeBtn.onclick = closeLightbox;
  }

  if (lightbox) {
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  // Navigation
  if (nextBtn) {
    nextBtn.onclick = () => {
      currentIndex = (currentIndex + 1) % images.length;
      updateLightboxImage();
    };
  }

  if (prevBtn) {
    prevBtn.onclick = () => {
      currentIndex = (currentIndex - 1 + images.length) % images.length;
      updateLightboxImage();
    };
  }
}

function openLightbox(img) {
  lightbox.style.display = "flex";
  lightboxImg.src = img.src;
  caption.textContent = img.alt || 'Image';
}

function closeLightbox() {
  lightbox.style.display = "none";
}

function updateLightboxImage() {
  if (images[currentIndex]) {
    lightboxImg.src = images[currentIndex].src;
    caption.textContent = images[currentIndex].alt || 'Image';
  }
}

/* ===== LIGHTBOX KEYBOARD CONTROLS ===== */
document.addEventListener("keydown", (e) => {
  if (lightbox && lightbox.style.display === "flex") {
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowRight" && nextBtn) nextBtn.click();
    if (e.key === "ArrowLeft" && prevBtn) prevBtn.click();
  }
});

/* ===== LIGHTBOX TOUCH CONTROLS (MOBILE SWIPE) ===== */
if (lightbox) {
  lightbox.addEventListener("touchstart", e => {
    startX = e.touches[0].clientX;
  });

  lightbox.addEventListener("touchend", e => {
    const endX = e.changedTouches[0].clientX;
    if (startX - endX > 50 && nextBtn) nextBtn.click();
    if (endX - startX > 50 && prevBtn) prevBtn.click();
  });
}

/* ===== SMOOTH SCROLL FOR ANCHOR LINKS ===== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    if (targetId === "#") return;
    
    const target = document.querySelector(targetId);
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

/* ===== CONTACT FORM (EMAILJS) ===== */
function initContactForm() {
  if (!contactForm || !sendBtn || !formStatus) return;

  // Initialize EmailJS
  if (typeof emailjs !== 'undefined') {
    emailjs.init("V8uuWFKIvpy7yDub7");
  } else {
    console.error('EmailJS not loaded');
    return;
  }

  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Show loading state
    sendBtn.disabled = true;
    sendBtn.innerHTML = '<span>Sending...</span> <i class="fas fa-spinner fa-spin"></i>';
    
    // Get form data
    const templateParams = {
      from_name: document.getElementById('name').value,
      from_email: document.getElementById('email').value,
      message: document.getElementById('message').value,
      to_email: 'bishalbasyal007@gmail.com'
    };
    
    // Send email using EmailJS
    emailjs.send('service_zhlcq5r', 'template_oxzvwbq', templateParams)
      .then(function(response) {
        console.log('SUCCESS!', response.status, response.text);
        showFormStatus('success', 'Message sent successfully! I\'ll get back to you soon.');
        contactForm.reset();
      })
      .catch(function(error) {
        console.log('FAILED...', error);
        showFormStatus('error', 'Failed to send message. Please try again or email me directly.');
      })
      .finally(function() {
        // Reset button
        sendBtn.disabled = false;
        sendBtn.innerHTML = '<span>Send Message</span> <i class="fas fa-paper-plane"></i>';
      });
  });
}

function showFormStatus(type, message) {
  if (!formStatus) return;
  
  formStatus.style.display = 'block';
  formStatus.className = `form-status ${type}`;
  
  const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
  formStatus.innerHTML = `<i class="fas ${icon}"></i> ${message}`;
  
  // Hide status after 5 seconds
  setTimeout(() => {
    formStatus.style.display = 'none';
  }, 5000);
}

/* ===== INITIALIZE ALL FUNCTIONS ON DOM LOAD ===== */
document.addEventListener('DOMContentLoaded', function() {
  initLightbox();
  initContactForm();
  
  // Set active navigation link based on current page
  const currentHash = window.location.hash;
  if (currentHash) {
    navLinks.forEach(link => {
      if (link.getAttribute('href') === currentHash) {
        link.classList.add('active');
      }
    });
  }
});