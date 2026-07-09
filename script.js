document.addEventListener('DOMContentLoaded', () => {
    
    // Initialize Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    /* ==========================================================================
       MOBILE NAVIGATION (HAMBURGER DRAWER)
       ========================================================================== */
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const mobileDrawer = document.getElementById('mobile-menu-drawer');
    const mobileLinks = document.querySelectorAll('.mobile-link');
    const body = document.body;

    function toggleMobileMenu() {
        const isOpen = hamburgerBtn.classList.contains('active');
        
        if (isOpen) {
            // Close menu
            hamburgerBtn.classList.remove('active');
            mobileDrawer.classList.remove('active');
            hamburgerBtn.setAttribute('aria-expanded', 'false');
            mobileDrawer.setAttribute('aria-hidden', 'true');
            body.style.overflow = '';
        } else {
            // Open menu
            hamburgerBtn.classList.add('active');
            mobileDrawer.classList.add('active');
            hamburgerBtn.setAttribute('aria-expanded', 'true');
            mobileDrawer.setAttribute('aria-hidden', 'false');
            body.style.overflow = 'hidden'; // Prevent background scrolling
        }
    }

    hamburgerBtn.addEventListener('click', toggleMobileMenu);

    // Close mobile drawer when clicking a link
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (hamburgerBtn.classList.contains('active')) {
                toggleMobileMenu();
            }
        });
    });

    // Close menu when resizing beyond mobile viewport
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && hamburgerBtn.classList.contains('active')) {
            toggleMobileMenu();
        }
    });

    /* ==========================================================================
       SCROLL-SPY & HEADER STYLE ON SCROLL
       ========================================================================== */
    const header = document.querySelector('.navbar');
    const sections = document.querySelectorAll('.scroll-spy-section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    function handleScrollEffects() {
        const scrollPosition = window.scrollY;

        // Header shrinking
        if (scrollPosition > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Active link highlighting (Scroll Spy)
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120; // Offset for sticky nav
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        if (currentSectionId) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${currentSectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    }

    window.addEventListener('scroll', handleScrollEffects);
    handleScrollEffects(); // Run on init

    /* ==========================================================================
       REVEAL ON SCROLL & SKILL PROGRESS ANIMATION
       ========================================================================== */
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    const skillProgressBars = document.querySelectorAll('.skill-progress');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target); // Animating once is cleaner
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });

    // Animate skill cards with stagger delay when the skills section is visible
    const skillCards = document.querySelectorAll('.skill-card-new');
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                skillCards.forEach((card, index) => {
                    setTimeout(() => {
                        card.classList.add('visible');
                    }, index * 80); // Stagger cards reveal every 80ms
                });
                skillObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15
    });

    const aboutSection = document.getElementById('about');
    if (aboutSection) {
        skillObserver.observe(aboutSection);
    }

    /* ==========================================================================
       PORTFOLIO CATEGORY FILTERING
       ========================================================================== */
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            // Remove active class from other buttons
            filterButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.setAttribute('aria-selected', 'false');
            });
            
            // Add active to current button
            button.classList.add('active');
            button.setAttribute('aria-selected', 'true');

            const filterValue = button.getAttribute('data-filter');

            projectCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');

                if (filterValue === 'all' || cardCategory === filterValue) {
                    card.classList.remove('hide');
                    card.classList.add('show');
                } else {
                    card.classList.remove('show');
                    card.classList.add('hide');
                }
            });
        });
    });

    /* ==========================================================================
       CONTACT FORM VALIDATION & SUCCESS STATE
       ========================================================================== */
    const contactForm = document.getElementById('portfolio-contact-form');
    const formSuccessOverlay = document.getElementById('form-success');
    const resetFormBtn = document.getElementById('btn-reset-form');
    const submitBtn = contactForm.querySelector('.btn-submit');

    // Simple email validation regex
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function validateField(input) {
        const parent = input.parentElement;
        let isValid = true;

        if (input.required && !input.value.trim()) {
            isValid = false;
        } else if (input.type === 'email' && input.value.trim() && !isValidEmail(input.value)) {
            isValid = false;
        }

        if (!isValid) {
            parent.classList.add('has-error');
        } else {
            parent.classList.remove('has-error');
        }

        return isValid;
    }

    // Real-time validation on input change/blur
    const formInputs = contactForm.querySelectorAll('.form-input');
    formInputs.forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => {
            if (input.parentElement.classList.contains('has-error')) {
                validateField(input);
            }
        });
    });

    // Form Submit Handler
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        let isFormValid = true;
        
        formInputs.forEach(input => {
            const isThisValid = validateField(input);
            if (!isThisValid) {
                isFormValid = false;
            }
        });

        if (isFormValid) {
            // Show loading state
            submitBtn.classList.add('loading');
            submitBtn.setAttribute('disabled', 'true');

            // Simulate server network latency (1.5 seconds)
            setTimeout(() => {
                submitBtn.classList.remove('loading');
                submitBtn.removeAttribute('disabled');
                
                // Show gorgeous glassmorphic success state
                formSuccessOverlay.classList.add('active');
                formSuccessOverlay.setAttribute('aria-hidden', 'false');
                
                // Reset form fields
                contactForm.reset();
                formInputs.forEach(input => {
                    input.parentElement.classList.remove('has-error');
                });
            }, 1500);
        }
    });

    // Reset Form Success Overlay back to fill again
    resetFormBtn.addEventListener('click', () => {
        formSuccessOverlay.classList.remove('active');
        formSuccessOverlay.setAttribute('aria-hidden', 'true');
    });

    /* ==========================================================================
       YUKARI GİT (BACK TO TOP) BUTONU DAVRANIŞI
       ========================================================================== */
    const backToTopBtn = document.getElementById('back-to-top');

    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    /* ==========================================================================
       İNTERAKTİF HAREKETLİ PARÇACIK ARKA PLANI (CANVAS)
       ========================================================================== */
    const canvas = document.getElementById('bg-particles-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let mouse = { x: null, y: null, radius: 150 };

        // Ekran boyutuna göre parçacık sayısı ayarı (mobilde daha az performans tasarrufu)
        function getParticleCount() {
            return window.innerWidth < 768 ? 30 : 70;
        }

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initParticles();
        }

        // Parçacık Sınıfı
        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 1; // 1-3px arası ufak noktalar
                this.speedX = (Math.random() - 0.5) * 0.35; // Çok yavaş süzülme
                this.speedY = (Math.random() - 0.5) * 0.35;
                this.color = Math.random() > 0.5 ? '#00E676' : '#4B9CD3'; // Yeşil ve mavi
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                // Duvarlardan sekme
                if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
                if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;

                // Fare etkileşimi (Hafif çekim/itme kuvveti dengesi)
                if (mouse.x !== null && mouse.y !== null) {
                    let dx = mouse.x - this.x;
                    let dy = mouse.y - this.y;
                    let distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < mouse.radius) {
                        const force = (mouse.radius - distance) / mouse.radius;
                        this.x += (dx / distance) * force * 0.4;
                        this.y += (dy / distance) * force * 0.4;
                    }
                }
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.shadowBlur = 3;
                ctx.shadowColor = this.color; // Hafif siber ışıma efekti
                ctx.fill();
                ctx.shadowBlur = 0; // Gölgeyi sıfırla
            }
        }

        function initParticles() {
            particles = [];
            const count = getParticleCount();
            for (let i = 0; i < count; i++) {
                particles.push(new Particle());
            }
        }

        // Çizgileri Birleştirme (Takımyıldızı Efekti)
        function connectParticles() {
            const maxDistance = 115;
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    let dx = particles[i].x - particles[j].x;
                    let dy = particles[i].y - particles[j].y;
                    let distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < maxDistance) {
                        let opacity = (maxDistance - distance) / maxDistance * 0.12;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        
                        // İki parçacığın renk geçişine göre çizgi rengi
                        ctx.strokeStyle = `rgba(75, 156, 211, ${opacity})`;
                        ctx.lineWidth = 0.7;
                        ctx.stroke();
                    }
                }
            }
        }

        // Animasyon Döngüsü
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            
            connectParticles();
            requestAnimationFrame(animate);
        }

        // Olay Dinleyicileri
        window.addEventListener('resize', resizeCanvas);
        
        window.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });

        window.addEventListener('mouseleave', () => {
            mouse.x = null;
            mouse.y = null;
        });

        // Başlat
        resizeCanvas();
        animate();
    }
});
