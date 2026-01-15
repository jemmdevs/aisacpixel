/**
 * Lenis Smooth Scroll Initialization
 * Optimized configuration for smooth scrolling experience
 */
import Lenis from 'lenis';

// Initialize Lenis with optimized settings
export const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 2,
    infinite: false,
    autoResize: true,
});

// Optimized animation loop using requestAnimationFrame
function raf(time: number) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}

// Start the animation loop
requestAnimationFrame(raf);

// Expose lenis to window for external access
(window as any).lenis = lenis;

// Add class to html when scroll is ready
document.documentElement.classList.add('lenis-ready');

// Handle anchor links smoothly
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const href = anchor.getAttribute('href');
        if (href) {
            const target = document.querySelector(href) as HTMLElement | null;
            if (target) {
                lenis.scrollTo(target);
            }
        }
    });
});

export default lenis;
