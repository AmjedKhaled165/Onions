/* ============================================
   Onions Restaurant & Café — JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ---------- Preloader ----------
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.classList.add('hidden');
            document.body.style.overflow = 'auto';
        }, 1800);
    });

    // Fallback: hide preloader after 3s max
    setTimeout(() => {
        preloader.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }, 3000);

    // ---------- Navbar ----------
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 80) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile toggle
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Active link on scroll
    const sections = document.querySelectorAll('section[id]');

    function updateActiveLink() {
        const scrollY = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', updateActiveLink);

    // ---------- Hero Slider ----------
    const slides = document.querySelectorAll('.hero-slide');
    const sliderDots = document.querySelectorAll('.slider-dot');
    const prevBtn = document.getElementById('sliderPrev');
    const nextBtn = document.getElementById('sliderNext');
    let currentSlide = 0;
    let slideInterval;

    function goToSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        sliderDots.forEach(dot => dot.classList.remove('active'));
        
        currentSlide = index;
        if (currentSlide >= slides.length) currentSlide = 0;
        if (currentSlide < 0) currentSlide = slides.length - 1;
        
        slides[currentSlide].classList.add('active');
        sliderDots[currentSlide].classList.add('active');
    }

    function nextSlide() {
        goToSlide(currentSlide + 1);
    }

    function prevSlide() {
        goToSlide(currentSlide - 1);
    }

    function startSliderAutoplay() {
        slideInterval = setInterval(nextSlide, 5000);
    }

    function resetSliderAutoplay() {
        clearInterval(slideInterval);
        startSliderAutoplay();
    }

    nextBtn.addEventListener('click', () => { nextSlide(); resetSliderAutoplay(); });
    prevBtn.addEventListener('click', () => { prevSlide(); resetSliderAutoplay(); });

    sliderDots.forEach((dot, i) => {
        dot.addEventListener('click', () => { goToSlide(i); resetSliderAutoplay(); });
    });

    startSliderAutoplay();

    // ---------- Stats Counter ----------
    const statNumbers = document.querySelectorAll('.stat-number');
    let statsCounted = false;

    function animateCounter(el) {
        const target = parseInt(el.getAttribute('data-target'));
        const duration = 2000;
        const start = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
            const current = Math.floor(eased * target);
            
            el.textContent = current.toLocaleString('ar-EG');

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                el.textContent = target.toLocaleString('ar-EG');
            }
        }

        requestAnimationFrame(update);
    }

    function checkStatsVisibility() {
        if (statsCounted) return;
        const statsBar = document.querySelector('.stats-bar');
        if (!statsBar) return;
        
        const rect = statsBar.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            statsCounted = true;
            statNumbers.forEach(num => animateCounter(num));
        }
    }

    window.addEventListener('scroll', checkStatsVisibility);
    checkStatsVisibility();

    // ---------- Menu Tabs ----------
    const menuTabs = document.querySelectorAll('.menu-tab');
    const menuCards = document.querySelectorAll('.menu-card');

    menuTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const category = tab.getAttribute('data-category');

            // Update active tab
            menuTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Filter cards
            menuCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                if (category === 'all' || cardCategory === category) {
                    card.classList.remove('hidden');
                    card.style.animation = 'fadeInUp 0.5s ease forwards';
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });

    // ---------- Gallery Lightbox ----------
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');
    let currentLightboxIndex = 0;

    const galleryImages = Array.from(galleryItems).map(item => {
        const overlaySpan = item.querySelector('.gallery-overlay span');
        const img = item.querySelector('img');
        return {
            src: img.src,
            caption: overlaySpan ? overlaySpan.textContent : img.alt || ''
        };
    });

    function openLightbox(index) {
        currentLightboxIndex = index;
        lightboxImg.src = galleryImages[index].src;
        lightboxCaption.textContent = galleryImages[index].caption;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        lightboxImg.classList.remove('zoomed');
        document.body.style.overflow = 'auto';
    }

    function lightboxNavPrev() {
        currentLightboxIndex = (currentLightboxIndex - 1 + galleryImages.length) % galleryImages.length;
        lightboxImg.src = galleryImages[currentLightboxIndex].src;
        lightboxCaption.textContent = galleryImages[currentLightboxIndex].caption;
        lightboxImg.classList.remove('zoomed');
    }

    function lightboxNavNext() {
        currentLightboxIndex = (currentLightboxIndex + 1) % galleryImages.length;
        lightboxImg.src = galleryImages[currentLightboxIndex].src;
        lightboxCaption.textContent = galleryImages[currentLightboxIndex].caption;
        lightboxImg.classList.remove('zoomed');
    }

    galleryItems.forEach((item, i) => {
        item.addEventListener('click', () => openLightbox(i));
    });

    lightboxClose.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', lightboxNavPrev);
    lightboxNext.addEventListener('click', lightboxNavNext);

    lightboxImg.addEventListener('click', (e) => {
        e.stopPropagation();
        lightboxImg.classList.toggle('zoomed');
    });

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') lightboxNavNext(); // RTL
        if (e.key === 'ArrowRight') lightboxNavPrev(); // RTL
    });

    // ---------- Reviews Slider ----------
    const reviewsTrack = document.getElementById('reviewsTrack');
    const reviewPrev = document.getElementById('reviewPrev');
    const reviewNext = document.getElementById('reviewNext');
    const reviewsDots = document.getElementById('reviewsDots');
    const reviewCards = document.querySelectorAll('.review-card');
    let currentReviewIndex = 0;

    function getVisibleCards() {
        return window.innerWidth > 900 ? 2 : 1;
    }

    function getMaxReviewIndex() {
        const visible = getVisibleCards();
        return Math.max(0, reviewCards.length - visible);
    }

    function renderReviewDots() {
        if (!reviewsDots) return;
        reviewsDots.innerHTML = '';
        const maxIdx = getMaxReviewIndex();
        for (let i = 0; i <= maxIdx; i++) {
            const dot = document.createElement('span');
            dot.classList.add('reviews-dot');
            if (i === currentReviewIndex) dot.classList.add('active');
            dot.addEventListener('click', () => {
                currentReviewIndex = i;
                updateReviewsSlider();
            });
            reviewsDots.appendChild(dot);
        }
    }

    function updateReviewsSlider() {
        if (!reviewsTrack || reviewCards.length === 0) return;
        const maxIdx = getMaxReviewIndex();
        if (currentReviewIndex > maxIdx) currentReviewIndex = maxIdx;
        if (currentReviewIndex < 0) currentReviewIndex = 0;

        const firstCard = reviewCards[0];
        const gap = 24;
        const cardWidth = firstCard.offsetWidth;
        const step = cardWidth + gap;

        // In RTL: positive translateX shifts track right, bringing leftward items into view
        const offset = currentReviewIndex * step;
        reviewsTrack.style.transform = `translateX(${offset}px)`;

        // Update dots
        const allDots = reviewsDots ? reviewsDots.querySelectorAll('.reviews-dot') : [];
        allDots.forEach((dot, idx) => {
            dot.classList.toggle('active', idx === currentReviewIndex);
        });

        // Update button visual opacity
        if (reviewPrev) {
            reviewPrev.style.opacity = currentReviewIndex === 0 ? '0.4' : '1';
        }
        if (reviewNext) {
            reviewNext.style.opacity = currentReviewIndex >= maxIdx ? '0.4' : '1';
        }
    }

    if (reviewNext) {
        reviewNext.addEventListener('click', () => {
            const maxIdx = getMaxReviewIndex();
            if (currentReviewIndex < maxIdx) {
                currentReviewIndex++;
            } else {
                currentReviewIndex = 0; // loop back to first
            }
            updateReviewsSlider();
        });
    }

    if (reviewPrev) {
        reviewPrev.addEventListener('click', () => {
            const maxIdx = getMaxReviewIndex();
            if (currentReviewIndex > 0) {
                currentReviewIndex--;
            } else {
                currentReviewIndex = maxIdx; // loop to end
            }
            updateReviewsSlider();
        });
    }

    window.addEventListener('resize', () => {
        renderReviewDots();
        updateReviewsSlider();
    });

    // Touch/swipe support for reviews (RTL aware)
    let reviewTouchStartX = 0;
    let reviewTouchEndX = 0;

    if (reviewsTrack) {
        reviewsTrack.addEventListener('touchstart', (e) => {
            reviewTouchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        reviewsTrack.addEventListener('touchend', (e) => {
            reviewTouchEndX = e.changedTouches[0].screenX;
            const diff = reviewTouchStartX - reviewTouchEndX;
            if (Math.abs(diff) > 40) {
                if (diff > 0) {
                    // Swipe left (forward / next in RTL)
                    if (reviewNext) reviewNext.click();
                } else {
                    // Swipe right (backward / prev in RTL)
                    if (reviewPrev) reviewPrev.click();
                }
            }
        }, { passive: true });
    }

    // Initial render
    renderReviewDots();
    updateReviewsSlider();

    // ---------- Scroll Animations ----------
    function initScrollAnimations() {
        const animateElements = document.querySelectorAll(
            '.menu-card, .offer-card, .service-card, .contact-card, .about-feature, .gallery-item'
        );

        animateElements.forEach(el => {
            el.classList.add('animate-on-scroll');
        });

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('animated');
                    }, index * 80);
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        animateElements.forEach(el => observer.observe(el));
    }

    initScrollAnimations();

    // ---------- Back to Top ----------
    const backToTop = document.getElementById('backToTop');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ---------- Smooth Scroll for anchor links ----------
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const navHeight = navbar.offsetHeight;
                const targetPosition = targetElement.offsetTop - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ---------- Parallax effect on hero ----------
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        const heroContent = document.querySelector('.hero-content');
        if (heroContent && scrolled < window.innerHeight) {
            heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
            heroContent.style.opacity = 1 - (scrolled / (window.innerHeight * 0.8));
        }
    });

    // ---------- Rating bars animation ----------
    const ratingBars = document.querySelectorAll('.bar-fill');
    let ratingAnimated = false;

    function animateRatingBars() {
        if (ratingAnimated) return;
        const summary = document.querySelector('.rating-summary');
        if (!summary) return;

        const rect = summary.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            ratingAnimated = true;
            ratingBars.forEach(bar => {
                const width = bar.style.width;
                bar.style.width = '0';
                setTimeout(() => {
                    bar.style.width = width;
                }, 200);
            });
        }
    }

    window.addEventListener('scroll', animateRatingBars);
    animateRatingBars();

});
