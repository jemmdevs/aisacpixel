/**
 * Section Observer
 * Handles visibility-based optimizations for sections and videos
 */
import { lenis } from './lenis';

/**
 * Initialize section visibility observer
 * Pauses animations in sections that are not visible
 */
function initSectionObserver() {
    const sectionObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                } else {
                    entry.target.classList.remove('in-view');
                }
            });
        },
        {
            rootMargin: '100px',
            threshold: 0.01,
        }
    );

    // Observe all sections
    document.querySelectorAll('section').forEach((section) => {
        sectionObserver.observe(section);
    });
}

/**
 * Handle tab visibility changes
 * Pauses videos and Lenis when tab is not visible
 */
function initVisibilityHandler() {
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            // Pause all videos
            document.querySelectorAll('video').forEach((video) => {
                if (!video.paused) {
                    video.dataset.wasPlaying = 'true';
                    video.pause();
                }
            });
            // Stop Lenis smooth scroll
            lenis.stop();
        } else {
            // Resume videos that were playing
            document.querySelectorAll('video[data-was-playing="true"]').forEach((el) => {
                const video = el as HTMLVideoElement;
                video.play().catch(() => { });
                delete video.dataset.wasPlaying;
            });
            // Resume Lenis
            lenis.start();
        }
    });
}

// Initialize observers
initSectionObserver();
initVisibilityHandler();
