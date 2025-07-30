// Energieaudit KVA Thun - Interactive Features
class EnergyAuditReport {
    constructor() {
        this.init();
    }

    init() {
        this.setupScrollAnimations();
        this.setupExternalLinks();
        this.setupPrintFunctionality();
        this.setupMetricCounters();
        this.setupScrollToTop();
        this.setupResponsiveCharts();
    }

    // Animate elements when they come into view
    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // Observe all animatable elements
        const animatableElements = document.querySelectorAll(
            '.metric-card, .financial-card, .solution-card, .chart-container, .environmental-card, .technical-item'
        );

        animatableElements.forEach(el => {
            el.classList.add('animate-on-scroll');
            observer.observe(el);
        });

        // Add CSS classes for animations
        this.addAnimationStyles();
    }

    // Add animation styles dynamically
    addAnimationStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .animate-on-scroll {
                opacity: 0;
                transform: translateY(30px);
                transition: opacity 0.6s ease-out, transform 0.6s ease-out;
            }
            
            .animate-on-scroll.animate-in {
                opacity: 1;
                transform: translateY(0);
            }
            
            .metric-card.animate-on-scroll:nth-child(1) { transition-delay: 0.1s; }
            .metric-card.animate-on-scroll:nth-child(2) { transition-delay: 0.2s; }
            .metric-card.animate-on-scroll:nth-child(3) { transition-delay: 0.3s; }
            .metric-card.animate-on-scroll:nth-child(4) { transition-delay: 0.4s; }
            
            .solution-card.animate-on-scroll:nth-child(1) { transition-delay: 0.1s; }
            .solution-card.animate-on-scroll:nth-child(2) { transition-delay: 0.2s; }
            .solution-card.animate-on-scroll:nth-child(3) { transition-delay: 0.3s; }
        `;
        document.head.appendChild(style);
    }

    // Ensure external links open in new tabs
    setupExternalLinks() {
        const externalLinks = document.querySelectorAll('a[href^="http"]');
        externalLinks.forEach(link => {
            link.setAttribute('target', '_blank');
            link.setAttribute('rel', 'noopener noreferrer');
            
            // Add external link indicator
            if (!link.querySelector('.external-icon')) {
                const icon = document.createElement('span');
                icon.className = 'external-icon';
                icon.innerHTML = ' ↗';
                icon.style.fontSize = '0.8em';
                icon.style.opacity = '0.7';
                link.appendChild(icon);
            }
        });
    }

    // Add print functionality
    setupPrintFunctionality() {
        // Add print button to hero section
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            const printButton = document.createElement('button');
            printButton.className = 'btn btn--secondary print-btn';
            printButton.innerHTML = '🖨️ Bericht drucken';
            printButton.style.marginTop = 'var(--space-24)';
            printButton.addEventListener('click', this.printReport);
            heroContent.appendChild(printButton);
        }

        // Keyboard shortcut for printing
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
                e.preventDefault();
                this.printReport();
            }
        });
    }

    // Print report with proper formatting
    printReport() {
        // Add print-specific styles
        const printStyles = document.createElement('style');
        printStyles.setAttribute('data-print-styles', 'true');
        printStyles.textContent = `
            @media print {
                .print-btn { display: none !important; }
                .hero-section { 
                    min-height: 40vh !important;
                    background-attachment: scroll !important;
                }
                body { 
                    font-size: 11pt !important;
                    color: black !important;
                    background: white !important;
                }
                .metric-card, .solution-card, .chart-container {
                    break-inside: avoid;
                    margin-bottom: 10pt;
                }
                .chart-image {
                    max-height: 300px;
                    object-fit: contain;
                }
            }
        `;
        document.head.appendChild(printStyles);

        // Trigger print
        setTimeout(() => {
            window.print();
            // Remove print styles after printing
            setTimeout(() => {
                const printStylesElement = document.querySelector('[data-print-styles]');
                if (printStylesElement) {
                    printStylesElement.remove();
                }
            }, 1000);
        }, 100);
    }

    // Animate metric counters
    setupMetricCounters() {
        const metricValues = document.querySelectorAll('.metric-value, .financial-value, .environmental-value');
        
        const animateCounter = (element, target, suffix = '') => {
            const duration = 2000;
            const start = 0;
            const startTime = performance.now();
            
            const updateCounter = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Easing function
                const easeOutCubic = 1 - Math.pow(1 - progress, 3);
                const current = start + (target * easeOutCubic);
                
                if (typeof target === 'number') {
                    element.textContent = Math.floor(current).toLocaleString('de-CH') + suffix;
                } else {
                    element.textContent = target; // For non-numeric values
                }
                
                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                }
            };
            
            requestAnimationFrame(updateCounter);
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.dataset.animated) {
                    entry.target.dataset.animated = 'true';
                    
                    const text = entry.target.textContent;
                    const numericMatch = text.match(/[\d.,]+/);
                    
                    if (numericMatch) {
                        const number = parseFloat(numericMatch[0].replace('.', '').replace(',', '.'));
                        const suffix = text.replace(numericMatch[0], '').trim();
                        
                        if (!isNaN(number)) {
                            animateCounter(entry.target, number, suffix ? ' ' + suffix : '');
                        }
                    }
                }
            });
        }, { threshold: 0.5 });

        metricValues.forEach(el => observer.observe(el));
    }

    // Add scroll to top functionality
    setupScrollToTop() {
        const scrollToTopBtn = document.createElement('button');
        scrollToTopBtn.className = 'scroll-to-top';
        scrollToTopBtn.innerHTML = '↑';
        scrollToTopBtn.setAttribute('aria-label', 'Nach oben scrollen');
        
        // Style the button
        scrollToTopBtn.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: var(--color-primary);
            color: var(--color-btn-primary-text);
            border: none;
            font-size: 18px;
            cursor: pointer;
            box-shadow: var(--shadow-lg);
            opacity: 0;
            visibility: hidden;
            transition: all var(--duration-normal) var(--ease-standard);
            z-index: 1000;
        `;
        
        document.body.appendChild(scrollToTopBtn);

        // Show/hide scroll to top button
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                scrollToTopBtn.style.opacity = '1';
                scrollToTopBtn.style.visibility = 'visible';
            } else {
                scrollToTopBtn.style.opacity = '0';
                scrollToTopBtn.style.visibility = 'hidden';
            }
        });

        // Scroll to top functionality
        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Make charts responsive
    setupResponsiveCharts() {
        const chartImages = document.querySelectorAll('.chart-image');
        
        // Add loading states
        chartImages.forEach(img => {
            img.style.transition = 'opacity 0.3s ease';
            
            if (!img.complete) {
                img.style.opacity = '0.5';
                
                img.addEventListener('load', () => {
                    img.style.opacity = '1';
                });
                
                img.addEventListener('error', () => {
                    img.style.opacity = '1';
                    console.warn('Chart image failed to load:', img.src);
                });
            }
        });

        // Add click to expand functionality for charts
        chartImages.forEach(img => {
            img.style.cursor = 'pointer';
            img.addEventListener('click', () => this.expandChart(img));
        });
    }

    // Expand chart in modal
    expandChart(img) {
        const modal = document.createElement('div');
        modal.className = 'chart-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 2000;
            cursor: pointer;
        `;
        
        const expandedImg = img.cloneNode(true);
        expandedImg.style.cssText = `
            max-width: 90%;
            max-height: 90%;
            object-fit: contain;
            border-radius: var(--radius-lg);
            box-shadow: var(--shadow-lg);
        `;
        
        modal.appendChild(expandedImg);
        document.body.appendChild(modal);
        
        // Close modal on click
        modal.addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        
        // Close modal on escape key
        const closeOnEscape = (e) => {
            if (e.key === 'Escape') {
                document.body.removeChild(modal);
                document.removeEventListener('keydown', closeOnEscape);
            }
        };
        document.addEventListener('keydown', closeOnEscape);
    }

    // Utility method to format numbers with Swiss locale
    static formatSwissNumber(number) {
        return number.toLocaleString('de-CH');
    }

    // Utility method to add thousand separators
    static addThousandSeparators(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "'");
    }
}

// Additional utility functions
const utils = {
    // Smooth scroll to element
    scrollToElement: (elementId) => {
        const element = document.getElementById(elementId);
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    },

    // Copy text to clipboard
    copyToClipboard: (text) => {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text).then(() => {
                console.log('Text copied to clipboard');
            });
        }
    },

    // Generate PDF (requires external library, placeholder for future enhancement)
    generatePDF: () => {
        console.log('PDF generation would require additional libraries like jsPDF');
        // For now, use browser print functionality
        window.print();
    }
};

// Initialize the report when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const report = new EnergyAuditReport();
    
    // Make utils available globally
    window.reportUtils = utils;
    
    // Add any additional event listeners or initializations here
    console.log('KVA Thun Energy Audit Report initialized successfully');
});

// Handle window resize for responsive behavior
window.addEventListener('resize', () => {
    // Debounce resize events
    clearTimeout(window.resizeTimeout);
    window.resizeTimeout = setTimeout(() => {
        // Add any resize-specific logic here
        console.log('Window resized, adjusting layout if needed');
    }, 250);
});

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { EnergyAuditReport, utils };
}