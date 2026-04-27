document.addEventListener('DOMContentLoaded', () => {

  const allAccordions = Array.from(document.querySelectorAll('[data-accordion]'));

  document.querySelectorAll('[data-accordion] .about__value-header').forEach(header => {
    header.addEventListener('click', () => {
      const item = header.closest('[data-accordion]');
      const isDesktop = window.innerWidth >= 769;

      if (isDesktop) {
        const idx = allAccordions.indexOf(item);
        const rowStart = Math.floor(idx / 2) * 2;
        const rowItems = allAccordions.slice(rowStart, rowStart + 2);

        const rowIsOpen = rowItems.some(el => el.classList.contains('is-open'));

        allAccordions.forEach(el => el.classList.remove('is-open'));
        if (!rowIsOpen) {
          rowItems.forEach(el => el.classList.add('is-open'));
        }
      } else {
        const isOpen = item.classList.contains('is-open');
        allAccordions.forEach(el => el.classList.remove('is-open'));
        if (!isOpen) item.classList.add('is-open');
      }
    });
  });

  const header = document.getElementById('header');
  const onScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const navBurger    = document.getElementById('navBurger');
  const sidebar      = document.getElementById('sidebar');
  const sidebarClose = document.getElementById('sidebarClose');
  const sidebarOverlay = document.getElementById('sidebarOverlay');

  const openSidebar = () => {
    sidebar.classList.add('is-open');
    sidebarOverlay.classList.add('is-active');
    document.body.style.overflow = 'hidden';
  };
  const closeSidebar = () => {
    sidebar.classList.remove('is-open');
    sidebarOverlay.classList.remove('is-active');
    document.body.style.overflow = '';
  };

  if (navBurger) navBurger.addEventListener('click', openSidebar);
  if (sidebarClose) sidebarClose.addEventListener('click', closeSidebar);
  if (sidebarOverlay) sidebarOverlay.addEventListener('click', closeSidebar);

  document.querySelectorAll('.sidebar__link').forEach(link => {
    link.addEventListener('click', closeSidebar);
  });

  const slides          = document.querySelectorAll('.hero__slide');
  const dots            = document.querySelectorAll('.hero__dot');
  const counterCurrent  = document.getElementById('heroCounterCurrent');
  const counterFill     = document.getElementById('heroCounterFill');
  let currentSlide = 0;
  let carouselInterval;

  const padNum = (n) => String(n).padStart(2, '0');

  const goToSlide = (index) => {
    slides[currentSlide].classList.remove('active');
    if (dots[currentSlide]) dots[currentSlide].classList.remove('active');

    currentSlide = (index + slides.length) % slides.length;

    slides[currentSlide].classList.add('active');
    if (dots[currentSlide]) dots[currentSlide].classList.add('active');

    if (counterCurrent) counterCurrent.textContent = padNum(currentSlide + 1);
    if (counterFill) counterFill.style.width = ((currentSlide + 1) / slides.length * 100) + '%';
  };

  const startCarousel = () => {
    carouselInterval = setInterval(() => {
      goToSlide(currentSlide + 1);
    }, 6000);
  };

  const resetCarousel = () => {
    clearInterval(carouselInterval);
    startCarousel();
  };

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      goToSlide(parseInt(dot.dataset.index));
      resetCarousel();
    });
  });

  if (slides.length) startCarousel();

  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav__link');

  const updateActiveNav = () => {
    const scrollY = window.scrollY + 120;
    sections.forEach(section => {
      if (scrollY >= section.offsetTop && scrollY < section.offsetTop + section.offsetHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + section.id) {
            link.classList.add('active');
          }
        });
      }
    });
  };
  window.addEventListener('scroll', updateActiveNav, { passive: true });

  const revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('is-visible');
          }, i * 80);
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    revealEls.forEach(el => revealObserver.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  if (typeof Swiper !== 'undefined' && document.querySelector('.collections__swiper')) {
    new Swiper('.collections__swiper', {
      slidesPerView: 'auto',
      spaceBetween: 24,
      freeMode: true,
      grabCursor: true,
      loop: false,
      pagination: {
        el: '.collections__pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '.collections__next',
        prevEl: '.collections__prev',
      },
      breakpoints: {
        320:  { spaceBetween: 16 },
        768:  { spaceBetween: 20 },
        1024: { spaceBetween: 24 },
      }
    });
  }

  const galleryItems  = document.querySelectorAll('.gallery__item');
  const lightbox      = document.getElementById('lightbox');
  const lightboxImg   = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev  = document.getElementById('lightboxPrev');
  const lightboxNext  = document.getElementById('lightboxNext');
  const lightboxCtr   = document.getElementById('lightboxCounter');

  const galleryImages = Array.from(galleryItems).map(item => ({
    src: item.querySelector('img').src,
    alt: item.querySelector('img').alt
  }));

  let currentLightboxIndex = 0;

  const openLightbox = (index) => {
    currentLightboxIndex = index;
    lightboxImg.src = galleryImages[index].src;
    lightboxImg.alt = galleryImages[index].alt;
    if (lightboxCtr) lightboxCtr.textContent = `${index + 1} / ${galleryImages.length}`;
    lightbox.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    lightbox.classList.remove('is-open');
    document.body.style.overflow = '';
  };

  const navigateLightbox = (dir) => {
    currentLightboxIndex = (currentLightboxIndex + dir + galleryImages.length) % galleryImages.length;
    lightboxImg.style.opacity = '0';
    setTimeout(() => {
      lightboxImg.src = galleryImages[currentLightboxIndex].src;
      lightboxImg.alt = galleryImages[currentLightboxIndex].alt;
      lightboxImg.style.opacity = '1';
      if (lightboxCtr) lightboxCtr.textContent = `${currentLightboxIndex + 1} / ${galleryImages.length}`;
    }, 200);
  };

  lightboxImg.style.transition = 'opacity .2s ease';

  galleryItems.forEach((item, i) => {
    item.addEventListener('click', () => openLightbox(i));
  });

  if (lightboxClose)  lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxPrev)   lightboxPrev.addEventListener('click', () => navigateLightbox(-1));
  if (lightboxNext)   lightboxNext.addEventListener('click', () => navigateLightbox(1));

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('is-open')) return;
    if (e.key === 'Escape')      closeLightbox();
    if (e.key === 'ArrowLeft')   navigateLightbox(-1);
    if (e.key === 'ArrowRight')  navigateLightbox(1);
  });

  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        backToTop.classList.add('is-visible');
      } else {
        backToTop.classList.remove('is-visible');
      }
    }, { passive: true });

    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 80;
        window.scrollTo({
          top: target.offsetTop - offset,
          behavior: 'smooth'
        });
      }
    });
  });

  const cookieBanner       = document.getElementById('cookieBanner');
  const cookieAccept       = document.getElementById('cookieAccept');
  const cookieSettings     = document.getElementById('cookieSettings');
  const cookieModal        = document.getElementById('cookieModal');
  const cookieModalOverlay = document.getElementById('cookieModalOverlay');
  const cookieModalClose   = document.getElementById('cookieModalClose');
  const cookieSaveSettings = document.getElementById('cookieSaveSettings');
  const cookieAcceptAll    = document.getElementById('cookieAcceptAll');
  const analyticsToggle    = document.getElementById('analyticsToggle');
  const marketingToggle    = document.getElementById('marketingToggle');

  const COOKIE_KEY = 'afnf_cookie_consent';

  const savedConsent = localStorage.getItem(COOKIE_KEY);

  if (!savedConsent && cookieBanner) {
    setTimeout(() => cookieBanner.classList.add('is-visible'), 1200);
  }

  const hideBanner = () => {
    if (cookieBanner) {
      cookieBanner.classList.remove('is-visible');
    }
  };

  const openCookieModal = () => {
    if (cookieModal) cookieModal.classList.add('is-open');
    if (cookieModalOverlay) cookieModalOverlay.classList.add('is-active');
    document.body.style.overflow = 'hidden';
  };

  const closeCookieModal = () => {
    if (cookieModal) cookieModal.classList.remove('is-open');
    if (cookieModalOverlay) cookieModalOverlay.classList.remove('is-active');
    document.body.style.overflow = '';
  };

  const saveConsent = (analytics, marketing) => {
    const consent = {
      necessary: true,
      analytics,
      marketing,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem(COOKIE_KEY, JSON.stringify(consent));
  };

  if (cookieAccept) {
    cookieAccept.addEventListener('click', () => {
      saveConsent(true, true);
      hideBanner();
    });
  }

  if (cookieSettings) {
    cookieSettings.addEventListener('click', () => {
      hideBanner();
      openCookieModal();
    });
  }

  if (cookieModalClose) cookieModalClose.addEventListener('click', closeCookieModal);
  if (cookieModalOverlay) cookieModalOverlay.addEventListener('click', closeCookieModal);

  if (cookieSaveSettings) {
    cookieSaveSettings.addEventListener('click', () => {
      saveConsent(
        analyticsToggle ? analyticsToggle.checked : false,
        marketingToggle ? marketingToggle.checked : false
      );
      closeCookieModal();
    });
  }

  if (cookieAcceptAll) {
    cookieAcceptAll.addEventListener('click', () => {
      if (analyticsToggle) analyticsToggle.checked = true;
      if (marketingToggle) marketingToggle.checked = true;
      saveConsent(true, true);
      closeCookieModal();
    });
  }

  const existingConsent = savedConsent ? JSON.parse(savedConsent) : null;
  if (existingConsent && analyticsToggle) analyticsToggle.checked = existingConsent.analytics;
  if (existingConsent && marketingToggle) marketingToggle.checked = existingConsent.marketing;

});