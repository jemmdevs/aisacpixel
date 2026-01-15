/**
 * Scroll-based Animations
 * Header transformation, logo states, and navbar hover effects
 */
import { lenis } from './lenis';

// Configuration
const SCROLL_THRESHOLD = 295;

// Element references
const headers = document.querySelectorAll('.header') as NodeListOf<HTMLElement>;
const logoMaxElements = document.querySelectorAll('.logo-max') as NodeListOf<HTMLElement>;
const logoMinElements = document.querySelectorAll('.logo-min') as NodeListOf<HTMLElement>;
const navSections = document.querySelectorAll('.nav-section') as NodeListOf<HTMLElement>;
const navBlendLayer = document.querySelector('.nav-blend-layer') as HTMLElement | null;

// Track scroll state
let isScrolled = false;

/**
 * Update header state based on scroll position
 */
function updateHeaderState(scrollY: number) {
    if (scrollY > SCROLL_THRESHOLD && !isScrolled) {
        isScrolled = true;
        document.documentElement.classList.add('-scrolled');
        headers.forEach((h) => h.classList.add('-hold'));

        // Scrolling DOWN - add -hiding for top-origin animation
        logoMaxElements.forEach((el) => el.classList.add('-hiding'));
        navSections.forEach((el) => el.classList.add('-hiding'));

        // Hide logo-max, show logo-min
        logoMaxElements.forEach((el) => el.classList.add('-hidden'));
        logoMinElements.forEach((el) => el.classList.add('-visible'));

        // Navbar loses container
        navSections.forEach((el) => el.classList.add('-hold'));
    } else if (scrollY <= SCROLL_THRESHOLD && isScrolled) {
        isScrolled = false;
        document.documentElement.classList.remove('-scrolled');
        headers.forEach((h) => h.classList.remove('-hold'));

        // Scrolling UP - remove -hiding for bottom-origin animation
        logoMaxElements.forEach((el) => el.classList.remove('-hiding'));
        navSections.forEach((el) => el.classList.remove('-hiding'));

        // Show logo-max, hide logo-min
        logoMaxElements.forEach((el) => el.classList.remove('-hidden'));
        logoMinElements.forEach((el) => el.classList.remove('-visible'));

        // Navbar gets container back
        navSections.forEach((el) => el.classList.remove('-hold'));
    }
}

/**
 * Initialize navbar hover effects
 */
function initNavbarHoverEffects() {
    navSections.forEach((navSection) => {
        navSection.addEventListener('mouseenter', () => {
            if (navSection.classList.contains('-hold')) {
                navSections.forEach((ns) => ns.classList.add('-hovered'));
                navBlendLayer?.classList.add('-hovered');
            }
        });

        navSection.addEventListener('mouseleave', () => {
            navSections.forEach((ns) => ns.classList.remove('-hovered'));
            navBlendLayer?.classList.remove('-hovered');
        });
    });

    // Also handle hover on the nav-blend-layer itself
    if (navBlendLayer) {
        navBlendLayer.addEventListener('mouseenter', () => {
            const navSection = document.querySelector('.nav-section');
            if (navSection?.classList.contains('-hold')) {
                navSections.forEach((ns) => ns.classList.add('-hovered'));
                navBlendLayer.classList.add('-hovered');
            }
        });

        navBlendLayer.addEventListener('mouseleave', () => {
            navSections.forEach((ns) => ns.classList.remove('-hovered'));
            navBlendLayer.classList.remove('-hovered');
        });
    }
}

// Export update function for use in main scroll handler
export function updateScrollAnimations() {
    const scrollY = lenis.scroll || window.scrollY;
    updateHeaderState(scrollY);
}

// Initialize hover effects
initNavbarHoverEffects();

// Listen to Lenis scroll events
lenis.on('scroll', updateScrollAnimations);

// Initial call
updateScrollAnimations();

// Mark as ready for animations
setTimeout(() => {
    document.documentElement.classList.add('-ready', '-loaded');
}, 100);
