// Initialize common UI scripts when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Set dynamic copyright year
  const yearElem = document.getElementById('year');
  if (yearElem) {
    yearElem.textContent = new Date().getFullYear();
  }

  // Highlight active nav link based on current pathname
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinksList = document.querySelectorAll('.nav-links a');
  
  navLinksList.forEach(link => {
    const linkPath = link.getAttribute('href');
    if (linkPath === currentPath || (currentPath === '' && linkPath === 'index.html')) {
      link.classList.add('active');
    }
  });

  // Mobile navigation toggle & drawer
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      navToggle.classList.toggle('active', isOpen);
      navToggle.setAttribute('aria-expanded', isOpen);
      navToggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
    });

    // Close when clicking any navigation link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.setAttribute('aria-label', 'Open navigation menu');
      });
    });

    // Close on Escape key press
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.setAttribute('aria-label', 'Open navigation menu');
        navToggle.focus();
      }
    });

    // Close when clicking outside of menu drawer
    document.addEventListener('click', (e) => {
      if (navLinks.classList.contains('open') && !navLinks.contains(e.target) && !navToggle.contains(e.target)) {
        navLinks.classList.remove('open');
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.setAttribute('aria-label', 'Open navigation menu');
      }
    });
  }

  // Gallery Filter Logic
  const filterBtns = document.querySelectorAll('.gallery-filters .filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-grid .gallery-item');
  const galleryStatus = document.getElementById('galleryStatus');

  if (filterBtns.length > 0 && galleryItems.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-pressed', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');

        const filterVal = btn.getAttribute('data-filter');

        let visibleCount = 0;
        galleryItems.forEach(item => {
          const category = item.getAttribute('data-category');
          if (filterVal === 'all' || category === filterVal) {
            visibleCount += 1;
            item.style.display = 'flex';
            setTimeout(() => {
              item.style.opacity = '1';
              item.style.transform = 'translateY(0)';
            }, 10);
          } else {
            item.style.opacity = '0';
            item.style.transform = 'translateY(15px)';
            item.style.display = 'none';
          }
        });
        if (galleryStatus) {
          galleryStatus.textContent = `${visibleCount} ${visibleCount === 1 ? 'highlight' : 'highlights'} shown.`;
        }
      });
    });
  }

  // Lightbox Modal Logic
  const lightbox = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxDesc = document.getElementById('lightboxDesc');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPlaceholder = document.getElementById('lightboxPlaceholder');
  let lightboxTrigger = null;

  if (lightbox && galleryItems.length > 0) {
    const focusableSelector = 'button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])';

    const openLightbox = (item) => {
      lightboxTrigger = item;
      const title = item.querySelector('.gallery-item-title')?.textContent || '';
      const desc = item.querySelector('.gallery-item-desc')?.textContent || '';
      const img = item.querySelector('.gallery-media img');

      if (lightboxTitle) lightboxTitle.textContent = title;
      if (lightboxDesc) lightboxDesc.textContent = desc;

      if (img && lightboxImg) {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt || title;
        lightboxImg.style.display = 'block';
        if (lightboxPlaceholder) lightboxPlaceholder.hidden = true;
      } else if (lightboxImg) {
        lightboxImg.style.display = 'none';
        if (lightboxPlaceholder) lightboxPlaceholder.hidden = false;
      }

      lightbox.hidden = false;
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
      lightboxClose?.focus();
    };

    galleryItems.forEach(item => {
      item.addEventListener('click', () => openLightbox(item));
    });

    const closeLightbox = () => {
      lightbox.classList.remove('active');
      lightbox.hidden = true;
      document.body.style.overflow = '';
      lightboxTrigger?.focus();
    };

    if (lightboxClose) {
      lightboxClose.addEventListener('click', closeLightbox);
    }

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox || e.target.classList.contains('lightbox-content')) {
        closeLightbox();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        closeLightbox();
      }

      if (e.key === 'Tab' && lightbox.classList.contains('active')) {
        const focusable = [...lightbox.querySelectorAll(focusableSelector)];
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });
  }

  // =============================================
  // PHASE 4: Floating CTA â€” show after scrolling
  // =============================================
  const floatingCta = document.getElementById('floatingCta');
  if (floatingCta) {
    const showCta = () => {
      if (window.scrollY > 300) {
        floatingCta.classList.add('visible');
      } else {
        floatingCta.classList.remove('visible');
      }
    };
    window.addEventListener('scroll', showCta, { passive: true });
    // Hide CTA on contact page since user is already there
    if (window.location.pathname.includes('contact.html')) {
      floatingCta.style.display = 'none';
    }
  }

  // =============================================
  // PHASE 3: Scroll-reveal for philosophy banner
  // =============================================
  const revealEls = document.querySelectorAll('.value-pillar, .journey-why');
  if (revealEls.length > 0 && 'IntersectionObserver' in window) {
    revealEls.forEach(el => el.classList.add('js-hidden'));

    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.remove('js-hidden');
          entry.target.classList.add('js-revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    revealEls.forEach(el => revealObserver.observe(el));
  }
});