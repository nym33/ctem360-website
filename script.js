/* ==========================================================================
   CTEM360 Landing Page — Interactions & Animations
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileMenu();
  initScrollReveal();
  initStatsCounter();
  initTestimonialCarousel();
  initSmoothScroll();
  initDemoForm();
});

/* ---- Navbar scroll effect ---- */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  const onScroll = () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ---- Mobile menu toggle ---- */
function initMobileMenu() {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    toggle.classList.toggle('active');
    links.classList.toggle('active');
    document.body.style.overflow = links.classList.contains('active') ? 'hidden' : '';
  });

  // Close menu when a link is clicked
  links.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('active');
      links.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
}

/* ---- Scroll reveal with IntersectionObserver ---- */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
  if (!revealElements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px'
  });

  revealElements.forEach(el => observer.observe(el));
}

/* ---- Animated stat counters ---- */
function initStatsCounter() {
  const statNumbers = document.querySelectorAll('.stat-number');
  if (!statNumbers.length) return;

  let hasAnimated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasAnimated) {
        hasAnimated = true;
        statNumbers.forEach(el => animateCounter(el));
        observer.disconnect();
      }
    });
  }, { threshold: 0.3 });

  // Observe the stats section
  const statsSection = document.querySelector('.stats-bar');
  if (statsSection) observer.observe(statsSection);
}

function animateCounter(element) {
  const target = parseInt(element.getAttribute('data-target'), 10);
  const suffix = element.getAttribute('data-suffix') || '';
  const prefix = element.getAttribute('data-prefix') || '';
  const duration = 2000;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Ease-out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(eased * target);

    element.textContent = prefix + current.toLocaleString() + suffix;

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      element.textContent = prefix + target.toLocaleString() + suffix;
    }
  }

  requestAnimationFrame(update);
}

/* ---- Testimonial carousel ---- */
function initTestimonialCarousel() {
  const track = document.querySelector('.testimonial-slides');
  const dots = document.querySelectorAll('.testimonial-dot');
  if (!track || !dots.length) return;

  let current = 0;
  const slideCount = dots.length;
  let interval;

  function goToSlide(index) {
    current = index;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === current);
    });
  }

  function nextSlide() {
    goToSlide((current + 1) % slideCount);
  }

  function startAutoplay() {
    interval = setInterval(nextSlide, 5000);
  }

  function stopAutoplay() {
    clearInterval(interval);
  }

  // Dot click handlers
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      stopAutoplay();
      goToSlide(i);
      startAutoplay();
    });
  });

  // Pause on hover
  const carousel = document.querySelector('.testimonials-carousel');
  if (carousel) {
    carousel.addEventListener('mouseenter', stopAutoplay);
    carousel.addEventListener('mouseleave', startAutoplay);
  }

  startAutoplay();
}

/* ---- Smooth scroll for anchor links ---- */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const targetEl = document.querySelector(targetId);
      if (!targetEl) return;

      const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 0;
      const targetPosition = targetEl.getBoundingClientRect().top + window.scrollY - navbarHeight - 20;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    });
  });
}

/* ---- Demo form AJAX submission ---- */
function initDemoForm() {
  const form = document.querySelector('.demo-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('.btn-submit');
    const originalText = submitBtn.innerHTML;

    // Show loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <svg class="spinner" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <circle cx="12" cy="12" r="10" stroke-dasharray="31.4" stroke-dashoffset="10" stroke-linecap="round"/>
      </svg>
      Sending...
    `;

    try {
      const formData = new FormData(form);

      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (result.success) {
        // Replace form with success card
        form.style.opacity = '0';
        form.style.transform = 'scale(0.95)';

        setTimeout(() => {
          form.innerHTML = `
            <div class="form-success">
              <div class="success-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  <path d="m9 12 2 2 4-4"/>
                </svg>
              </div>
              <h3>Demo Request Submitted!</h3>
              <p>Thank you for your interest in CTEM360. Our team will reach out to you as soon as possible to schedule your personalized demo.</p>
            </div>
          `;
          form.style.opacity = '1';
          form.style.transform = 'scale(1)';
        }, 300);
      } else {
        throw new Error(result.message || 'Submission failed');
      }
    } catch (error) {
      // Show error inline
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;

      let errorMsg = form.querySelector('.form-error');
      if (!errorMsg) {
        errorMsg = document.createElement('p');
        errorMsg.className = 'form-error';
        submitBtn.insertAdjacentElement('afterend', errorMsg);
      }
      errorMsg.textContent = 'Something went wrong. Please try again or email us directly.';

      setTimeout(() => {
        if (errorMsg) errorMsg.remove();
      }, 5000);
    }
  });
}
