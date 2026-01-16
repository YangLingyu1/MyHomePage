(function() {
    'use strict';

    const ModernEffects = {
        observerOptions: {
            root: null,
            rootMargin: '0px',
            threshold: [0.1, 0.3, 0.5, 0.7, 0.9]
        },

        init: function() {
            this.initScrollReveal();
            this.initParallax();
            this.initNavScroll();
            this.initSmoothScroll();
            this.initHoverEffects();
            this.initPerformanceOptimizations();
        },

        initScrollReveal: function() {
            if (!('IntersectionObserver' in window)) {
                this.fallbackScrollReveal();
                return;
            }

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const delay = entry.target.dataset.delay || 0;
                        setTimeout(() => {
                            entry.target.classList.add('visible');
                        }, delay);
                        
                        observer.unobserve(entry.target);
                    }
                });
            }, this.observerOptions);

            document.querySelectorAll('.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right, .scroll-reveal-scale').forEach(el => {
                observer.observe(el);
            });
        },

        fallbackScrollReveal: function() {
            const elements = document.querySelectorAll('.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right, .scroll-reveal-scale');
            
            const checkScroll = () => {
                elements.forEach(el => {
                    const rect = el.getBoundingClientRect();
                    const isVisible = rect.top < window.innerHeight * 0.85;
                    
                    if (isVisible) {
                        el.classList.add('visible');
                    }
                });
            };

            window.addEventListener('scroll', this.throttle(checkScroll, 100));
            checkScroll();
        },

        initParallax: function() {
            const parallaxElements = document.querySelectorAll('[data-parallax]');
            
            if (parallaxElements.length === 0) return;

            const handleParallax = () => {
                const scrolled = window.pageYOffset;
                
                parallaxElements.forEach(el => {
                    const speed = parseFloat(el.dataset.parallax) || 0.5;
                    const yPos = -(scrolled * speed);
                    
                    el.style.transform = `translate3d(0, ${yPos}px, 0)`;
                });
            };

            window.addEventListener('scroll', this.throttle(handleParallax, 16));
        },

        initNavScroll: function() {
            const nav = document.querySelector('.head');
            if (!nav) return;

            let lastScroll = 0;
            const handleNavScroll = () => {
                const currentScroll = window.pageYOffset;
                
                if (currentScroll > 50) {
                    nav.classList.add('scrolled');
                } else {
                    nav.classList.remove('scrolled');
                }

                lastScroll = currentScroll;
            };

            window.addEventListener('scroll', this.throttle(handleNavScroll, 100));
        },

        initSmoothScroll: function() {
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function(e) {
                    const targetId = this.getAttribute('href');
                    if (targetId === '#') return;
                    
                    const targetElement = document.querySelector(targetId);
                    if (targetElement) {
                        e.preventDefault();
                        targetElement.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                });
            });
        },

        initHoverEffects: function() {
            const cards = document.querySelectorAll('.glass-card, .timeUl li div, .bq li');
            
            cards.forEach(card => {
                card.addEventListener('mousemove', (e) => {
                    const rect = card.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    
                    const centerX = rect.width / 2;
                    const centerY = rect.height / 2;
                    
                    const rotateX = (y - centerY) / 20;
                    const rotateY = (centerX - x) / 20;
                    
                    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
                });

                card.addEventListener('mouseleave', () => {
                    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
                });
            });
        },

        initPerformanceOptimizations: function() {
            if ('requestIdleCallback' in window) {
                requestIdleCallback(() => {
                    this.lazyLoadImages();
                    this.preloadCriticalResources();
                });
            } else {
                setTimeout(() => {
                    this.lazyLoadImages();
                    this.preloadCriticalResources();
                }, 1000);
            }

            if ('IntersectionObserver' in window) {
                this.initLazyLoading();
            }
        },

        initLazyLoading: function() {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                            observer.unobserve(img);
                        }
                    }
                });
            });

            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        },

        lazyLoadImages: function() {
            const images = document.querySelectorAll('img[data-src]');
            images.forEach(img => {
                if (img.getBoundingClientRect().top < window.innerHeight) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
            });
        },

        preloadCriticalResources: function() {
            const criticalResources = [
                'images/pic/head.jpg',
                'images/pic/1.jpg',
                'images/pic/2.jpg'
            ];

            criticalResources.forEach(src => {
                const link = document.createElement('link');
                link.rel = 'prefetch';
                link.href = src;
                document.head.appendChild(link);
            });
        },

        throttle: function(func, limit) {
            let inThrottle;
            return function() {
                const args = arguments;
                const context = this;
                if (!inThrottle) {
                    func.apply(context, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            };
        },

        debounce: function(func, wait) {
            let timeout;
            return function() {
                const context = this;
                const args = arguments;
                clearTimeout(timeout);
                timeout = setTimeout(() => func.apply(context, args), wait);
            };
        },

        addScrollClass: function() {
            const boxes = document.querySelectorAll('.box');
            
            const boxObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('fade-in');
                    }
                });
            }, { threshold: 0.1 });

            boxes.forEach(box => boxObserver.observe(box));
        },

        initMagneticEffect: function() {
            const magneticElements = document.querySelectorAll('.cycle_a, .float_btn li');
            
            magneticElements.forEach(el => {
                el.addEventListener('mousemove', (e) => {
                    const rect = el.getBoundingClientRect();
                    const x = e.clientX - rect.left - rect.width / 2;
                    const y = e.clientY - rect.top - rect.height / 2;
                    
                    el.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
                });

                el.addEventListener('mouseleave', () => {
                    el.style.transform = 'translate(0, 0)';
                });
            });
        },

        initTextReveal: function() {
            const textElements = document.querySelectorAll('#box01_text p, #box02_text p, .box04_content h2');
            
            const textObserver = new IntersectionObserver((entries) => {
                entries.forEach((entry, index) => {
                    if (entry.isIntersecting) {
                        const delay = index * 100;
                        setTimeout(() => {
                            entry.target.style.opacity = '1';
                            entry.target.style.transform = 'translateY(0)';
                        }, delay);
                    }
                });
            }, { threshold: 0.5 });

            textElements.forEach(el => {
                el.style.opacity = '0';
                el.style.transform = 'translateY(20px)';
                el.style.transition = 'all 0.6s ease';
                textObserver.observe(el);
            });
        },

        initProgressBars: function() {
            const progressBars = document.querySelectorAll('.bar');
            
            const progressObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const bar = entry.target;
                        const percent = bar.dataset.percent || 0;
                        bar.style.width = percent + '%';
                    }
                });
            }, { threshold: 0.5 });

            progressBars.forEach(bar => {
                bar.style.width = '0%';
                bar.style.transition = 'width 1.5s ease-out';
                progressObserver.observe(bar);
            });
        },

        initCursorFollower: function() {
            if (window.matchMedia('(hover: none)').matches) return;

            const cursor = document.createElement('div');
            cursor.className = 'custom-cursor';
            cursor.style.cssText = `
                position: fixed;
                width: 20px;
                height: 20px;
                border: 2px solid rgba(91, 155, 200, 0.5);
                border-radius: 50%;
                pointer-events: none;
                z-index: 9999;
                transition: transform 0.1s ease, opacity 0.3s ease;
                mix-blend-mode: difference;
            `;
            document.body.appendChild(cursor);

            let mouseX = 0, mouseY = 0;
            let cursorX = 0, cursorY = 0;

            document.addEventListener('mousemove', (e) => {
                mouseX = e.clientX;
                mouseY = e.clientY;
            });

            const animateCursor = () => {
                cursorX += (mouseX - cursorX) * 0.1;
                cursorY += (mouseY - cursorY) * 0.1;
                
                cursor.style.transform = `translate(${cursorX - 10}px, ${cursorY - 10}px)`;
                
                requestAnimationFrame(animateCursor);
            };

            animateCursor();

            const hoverElements = document.querySelectorAll('a, button, .cycle_a, .float_btn li');
            hoverElements.forEach(el => {
                el.addEventListener('mouseenter', () => {
                    cursor.style.transform = `translate(${cursorX - 15}px, ${cursorY - 15}px) scale(1.5)`;
                    cursor.style.borderColor = 'rgba(255, 105, 180, 0.8)';
                });
                
                el.addEventListener('mouseleave', () => {
                    cursor.style.transform = `translate(${cursorX - 10}px, ${cursorY - 10}px) scale(1)`;
                    cursor.style.borderColor = 'rgba(91, 155, 200, 0.5)';
                });
            });
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => ModernEffects.init());
    } else {
        ModernEffects.init();
    }

    window.ModernEffects = ModernEffects;

})();
