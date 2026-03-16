/* ============================================================
   PORTFOLIO JAVASCRIPT
   Features:
     - Sticky / scrolled navbar
     - Mobile hamburger menu
     - Smooth-scroll active nav link highlighting
     - Scroll-reveal animations (lightweight AOS clone)
     - Animated skill bars (triggered on scroll)
     - Contact form handling
     - Back-to-top button
     - Auto year in footer
   ============================================================ */

'use strict';

/* ----------------------------------------------------------------
   UTILITY: wait for DOM
---------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {

  /* ----------------------------------------------------------------
     1. FOOTER YEAR
  ---------------------------------------------------------------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();


  /* ----------------------------------------------------------------
     2. NAVBAR — SCROLL BEHAVIOR
     Adds .scrolled class when user scrolls past 60px
  ---------------------------------------------------------------- */
  const navbar = document.getElementById('navbar');

  function handleNavScroll() {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll(); // run once on load


  /* ----------------------------------------------------------------
     3. MOBILE HAMBURGER MENU
     Toggles .open on both the button and the nav-links list
  ---------------------------------------------------------------- */
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('nav-links');
  const navLinkItems = navLinks.querySelectorAll('.nav-link');

  function closeMenu() {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  }

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', String(isOpen));
  });

  // Close menu when a link is clicked
  navLinkItems.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close menu on ESC key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMenu();
  });


  /* ----------------------------------------------------------------
     4. ACTIVE NAV LINK (highlight on scroll)
     Uses IntersectionObserver to detect which section is visible
  ---------------------------------------------------------------- */
  const sections = document.querySelectorAll('section[id]');

  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Remove .active from all links
        navLinkItems.forEach(link => link.classList.remove('active'));
        // Add .active to the matching link
        const id = entry.target.getAttribute('id');
        const activeLink = navLinks.querySelector(`a[href="#${id}"]`);
        if (activeLink) activeLink.classList.add('active');
      }
    });
  }, {
    rootMargin: '-40% 0px -55% 0px', // trigger when section is ~in the middle
    threshold: 0
  });

  sections.forEach(section => sectionObserver.observe(section));


  /* ----------------------------------------------------------------
     5. SCROLL-REVEAL (lightweight AOS)
     Elements with [data-aos] are revealed when they enter viewport
  ---------------------------------------------------------------- */
  const aosElements = document.querySelectorAll('[data-aos]');

  const aosObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('aos-animate');
        aosObserver.unobserve(entry.target); // animate only once
      }
    });
  }, {
    rootMargin: '0px 0px -80px 0px', // trigger slightly before fully in view
    threshold: 0.05
  });

  aosElements.forEach(el => aosObserver.observe(el));


  /* ----------------------------------------------------------------
     6. ANIMATED SKILL BARS
     Reads data-width on each .skill-fill and sets CSS width
     once the skills section scrolls into view
  ---------------------------------------------------------------- */
  const skillFills   = document.querySelectorAll('.skill-fill');
  const skillSection = document.getElementById('skills');
  let skillsAnimated = false;

  function animateSkillBars() {
    if (skillsAnimated) return;
    skillFills.forEach(fill => {
      const targetWidth = fill.getAttribute('data-width') || '0';
      // A tiny delay lets the CSS transition fire properly
      setTimeout(() => {
        fill.style.width = targetWidth + '%';
      }, 100);
    });
    skillsAnimated = true;
  }

  if (skillSection) {
    const skillObserver = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        animateSkillBars();
        skillObserver.disconnect();
      }
    }, { threshold: 0.2 });

    skillObserver.observe(skillSection);
  }


  /* ----------------------------------------------------------------
     7. BACK TO TOP BUTTON
  ---------------------------------------------------------------- */
  const backToTop = document.getElementById('back-to-top');

  function handleBackToTop() {
    if (window.scrollY > 400) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  }

  window.addEventListener('scroll', handleBackToTop, { passive: true });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });


  /* ----------------------------------------------------------------
     8. CONTACT FORM
     Basic client-side validation + simulated submission
     Replace the sendForm() logic with a real API call (e.g.
     Formspree, EmailJS, or your Django/Flask backend endpoint)
  ---------------------------------------------------------------- */
  const contactForm = document.getElementById('contact-form');
  const formStatus  = document.getElementById('form-status');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      // --- Simple validation ---
      const name    = contactForm.name.value.trim();
      const email   = contactForm.email.value.trim();
      const message = contactForm.message.value.trim();
      const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!name) {
        showStatus('Please enter your name.', 'error');
        contactForm.name.focus();
        return;
      }
      if (!emailRx.test(email)) {
        showStatus('Please enter a valid email address.', 'error');
        contactForm.email.focus();
        return;
      }
      if (message.length < 10) {
        showStatus('Message must be at least 10 characters.', 'error');
        contactForm.message.focus();
        return;
      }

      // --- Simulate async send (replace with real fetch) ---
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending…';

      try {
        await simulateSend({ name, email, message });

        showStatus('✓ Message sent! I\'ll get back to you soon.', 'success');
        contactForm.reset();
      } catch (err) {
        showStatus('Something went wrong. Please try again.', 'error');
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
      }
    });
  }

  /**
   * Show a status message below the form.
   * @param {string} msg   - Text to display
   * @param {'success'|'error'} type
   */
  function showStatus(msg, type) {
    if (!formStatus) return;
    formStatus.textContent = msg;
    formStatus.className = 'form-status ' + type;
    // Auto-clear after 5 seconds
    setTimeout(() => {
      formStatus.textContent = '';
      formStatus.className = 'form-status';
    }, 5000);
  }

  /**
   * Simulate a network request (replace with real fetch to your backend).
   * Example real implementation using Formspree:
   *
   *   const res = await fetch('https://formspree.io/f/YOUR_ID', {
   *     method: 'POST',
   *     headers: { 'Content-Type': 'application/json' },
   *     body: JSON.stringify(data)
   *   });
   *   if (!res.ok) throw new Error('Server error');
   */
  function simulateSend(data) {
    console.log('Form data (would be sent to server):', data);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate 95% success rate for demo
        Math.random() > 0.05 ? resolve() : reject(new Error('Network error'));
      }, 1200);
    });
  }


  /* ----------------------------------------------------------------
     9. SMOOTH SCROLL for anchor links (fallback for older browsers)
     Modern browsers handle this via CSS scroll-behavior: smooth.
     This JS version also handles offset for the fixed navbar.
  ---------------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      const navbarHeight = navbar.offsetHeight;
      const targetTop    = target.getBoundingClientRect().top + window.scrollY - navbarHeight;

      window.scrollTo({ top: targetTop, behavior: 'smooth' });
    });
  });


  /* ----------------------------------------------------------------
     10. TYPING EFFECT (optional — hero tagline)
     Adds a subtle cursor-blink after the tagline renders.
     Remove if you don't want it.
  ---------------------------------------------------------------- */
  const tagline = document.querySelector('.hero-tagline');
  if (tagline) {
    // Wrap text in a span after the animation delay
    const originalText = tagline.textContent;
    tagline.innerHTML = originalText + '<span class="cursor" aria-hidden="true"></span>';

    // Inject cursor style dynamically
    const cursorStyle = document.createElement('style');
    cursorStyle.textContent = `
      .cursor {
        display: inline-block;
        width: 2px;
        height: 1em;
        background: var(--accent-gold);
        margin-left: 3px;
        vertical-align: middle;
        animation: cursorBlink 1.1s step-end infinite;
      }
      @keyframes cursorBlink {
        0%, 100% { opacity: 1; }
        50%       { opacity: 0; }
      }
    `;
    document.head.appendChild(cursorStyle);
  }

}); // end DOMContentLoaded
