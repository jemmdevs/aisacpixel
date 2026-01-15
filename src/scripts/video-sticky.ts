/**
 * Video Sticky Simulation
 * Manually controls video position to work with Lenis smooth scroll
 */
import { lenis } from './lenis';

// Element references
const welcomeSection = document.querySelector('.c-welcome') as HTMLElement | null;
const mediaHolder = document.querySelector('.c-welcome .media-holder') as HTMLElement | null;
const mediaWrap = document.querySelector('.c-welcome .media-wrap') as HTMLElement | null;

// Video position state
let videoInitialTop = 0;
let videoStickyPoint = 0;
let videoOriginalWidth = 0;
let videoOriginalLeft = 0;
let isVideoFixed = false;

/**
 * Initialize video position measurements
 */
function initVideoPosition() {
    if (!mediaHolder || !mediaWrap) return;

    // Remove fixed class first to get accurate measurements
    mediaHolder.classList.remove('-fixed');

    // Get the video's position relative to the document
    const rect = mediaHolder.getBoundingClientRect();
    const scrollY = window.scrollY;

    videoInitialTop = rect.top + scrollY;
    videoStickyPoint = rect.top;
    videoOriginalWidth = rect.width;
    videoOriginalLeft = rect.left;
}

/**
 * Update video sticky position and closing effect
 */
export function updateVideoSticky() {
    if (!welcomeSection || !mediaHolder || !mediaWrap || videoStickyPoint <= 0) return;

    const scrollY = lenis.scroll || window.scrollY;

    // Calculate where the video WOULD be without fixing
    const whereVideoWouldBe = videoInitialTop - scrollY;

    // Get original height based on aspect ratio
    const mediaWidth = videoOriginalWidth || mediaHolder.offsetWidth;
    const aspectRatio = window.innerWidth >= 1024 ? 12 / 21 : 9 / 16;
    const originalHeight = mediaWidth * aspectRatio;

    // Store original height
    if (!mediaHolder.dataset.originalHeight) {
        mediaHolder.dataset.originalHeight = originalHeight.toString();
    }
    const storedHeight = parseFloat(mediaHolder.dataset.originalHeight);

    // Should the video be fixed?
    const shouldBeFixed = whereVideoWouldBe < videoStickyPoint;

    if (shouldBeFixed && !isVideoFixed) {
        // Switch to fixed positioning
        isVideoFixed = true;
        mediaHolder.classList.add('-fixed');
        mediaHolder.style.top = `${videoStickyPoint}px`;
        mediaHolder.style.left = `${videoOriginalLeft}px`;
        mediaHolder.style.width = `${videoOriginalWidth}px`;

        // Add placeholder height to parent to maintain layout
        mediaWrap.style.minHeight = `${storedHeight}px`;
    } else if (!shouldBeFixed && isVideoFixed) {
        // Switch back to relative positioning
        isVideoFixed = false;
        mediaHolder.classList.remove('-fixed');
        mediaHolder.style.top = '';
        mediaHolder.style.left = '';
        mediaHolder.style.width = '';
        mediaWrap.style.minHeight = '';
    }

    // Calculate closing progress
    let progress = 0;

    if (shouldBeFixed) {
        const distancePastTrigger = videoStickyPoint - whereVideoWouldBe;
        progress = distancePastTrigger / storedHeight;
    }

    // Clamp progress between 0 and 1
    progress = Math.max(0, Math.min(1, progress));

    // Calculate new height based on progress
    const newHeight = storedHeight * (1 - progress);

    // Apply the height
    mediaHolder.style.maxHeight = `${newHeight}px`;
    mediaHolder.style.setProperty('--progress', progress.toFixed(4));
}

// Initialize on load
initVideoPosition();

// Recalculate on resize
window.addEventListener('resize', () => {
    if (!isVideoFixed) {
        initVideoPosition();
    }
});

// Listen to Lenis scroll events
lenis.on('scroll', updateVideoSticky);

// Initial call
updateVideoSticky();
