// Performance configuration
const PERFORMANCE = {
    // Adjust max circles dynamically based on device performance
    MAX_CIRCLES: 900, // Increased max circles for better coverage
    // Throttle the mousemove event to improve performance
    THROTTLE_DELAY: 16, // ~60fps
    // Maximum distance for mouse interaction
    MAX_DISTANCE: 100,
    // Maximum distance for click ripple effect
    MAX_RIPPLE_DISTANCE: 300 // Increased from 150 to 300 for more dramatic explosions
};

// Store the circles in an array for faster access
let circlesArray = [];
let isLowPerformanceDevice = false;

// Cache DOM elements
const container = document.querySelector('.circlecontainer');

// Performance detection - run a quick test
function detectPerformance() {
    const start = performance.now();
    let sum = 0;
    for (let i = 0; i < 10000; i++) {
        sum += Math.sqrt(i);
    }
    const duration = performance.now() - start;
    
    // If the device is slow, reduce the number of circles
    if (duration > 50) {
        isLowPerformanceDevice = true;
        return Math.max(50, Math.floor(PERFORMANCE.MAX_CIRCLES / 3));
    } else if (duration > 20) {
        isLowPerformanceDevice = true;
        return Math.max(100, Math.floor(PERFORMANCE.MAX_CIRCLES / 2));
    }
    
    return PERFORMANCE.MAX_CIRCLES;
}

// Get circle size and gap from CSS variables
function getCircleSizeAndGap() {
    const style = getComputedStyle(document.documentElement);
    const size = parseInt(style.getPropertyValue('--circle-size').trim(), 10) || 50;
    const gap = parseInt(style.getPropertyValue('--circle-gap').trim(), 10) || 10;
    return { size, gap };
}

// Initialize the circles with a simple grid approach
function initializeCircles() {
    // Clear any existing circles
    container.innerHTML = '';
    circlesArray = [];
    
    const maxCircles = detectPerformance();
    const { size, gap } = getCircleSizeAndGap();
    const totalSize = size + gap;
    
    // Calculate number of circles needed to fill the viewport with more overflow
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Create extra circles to ensure coverage (add more padding)
    const circlesHorizontal = Math.ceil(viewportWidth / totalSize) + 6; // Increased from +4 to +6
    const circlesVertical = Math.ceil(viewportHeight / totalSize) + 6;  // Increased from +4 to +6
    
    // Calculate total circles
    const totalCirclesNeeded = circlesHorizontal * circlesVertical;
    const totalCircles = Math.min(maxCircles, totalCirclesNeeded);
    
    // Create a document fragment for better performance
    const fragment = document.createDocumentFragment();
    
    for (let i = 0; i < totalCircles; i++) {
        const circle = document.createElement('div');
        circle.classList.add('circle');
        fragment.appendChild(circle);
        circlesArray.push(circle);
    }
    
    container.appendChild(fragment);
    
    console.log(`Initialized ${totalCircles} circles of ${totalCirclesNeeded} needed (viewport: ${viewportWidth}x${viewportHeight}). Low performance mode: ${isLowPerformanceDevice}`);
}

// Helper function to convert hex to RGB
function hexToRgb(hex) {
    // Remove # if present
    hex = hex.replace(/^#/, '');
    
    // Parse hex values
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    
    return { r, g, b };
}

// Cache for the primary color
let cachedPrimaryColor = null;
let cachedRgbColor = null;

// Get the current theme color
function getThemeColor() {
    const primaryColor = getComputedStyle(document.documentElement)
        .getPropertyValue('--circle-primary-color').trim();
    
    // Only convert to RGB if the color has changed
    if (primaryColor !== cachedPrimaryColor) {
        cachedPrimaryColor = primaryColor;
        cachedRgbColor = hexToRgb(primaryColor);
    }
    
    return cachedRgbColor;
}

// Throttle function to limit how often a function can be called
function throttle(callback, delay) {
    let lastCall = 0;
    let requestId = null;
    
    return function() {
        const now = Date.now();
        const context = this;
        const args = arguments;
        
        if (now - lastCall >= delay) {
            lastCall = now;
            if (requestId) {
                cancelAnimationFrame(requestId);
            }
            requestId = requestAnimationFrame(() => callback.apply(context, args));
        }
    };
}

// Calculate distance between two points
function getDistance(x1, y1, x2, y2) {
    const dx = x1 - x2;
    const dy = y1 - y2;
    return Math.sqrt(dx * dx + dy * dy);
}

// Handle mouse movement
const handleMouseMove = throttle((e) => {
    if (!circlesArray.length) return;
    
    const rgbColor = getThemeColor();
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    
    // Use requestAnimationFrame for smoother updates
    requestAnimationFrame(() => {
        circlesArray.forEach(circle => {
            // Only calculate for visible circles (performance optimization)
            const rect = circle.getBoundingClientRect();
            
            // Skip circles that are far from mouse (more than MAX_DISTANCE)
            if (Math.abs(mouseX - rect.left - rect.width / 2) > PERFORMANCE.MAX_DISTANCE * 1.5 ||
                Math.abs(mouseY - rect.top - rect.height / 2) > PERFORMANCE.MAX_DISTANCE * 1.5) {
                // Reset if far away
                circle.style.borderColor = 'rgba(170, 170, 170, 0.1)';
                circle.style.backgroundColor = 'transparent';
                return;
            }
            
            const dx = mouseX - (rect.left + rect.width / 2);
            const dy = mouseY - (rect.top + rect.height / 2);
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // Calculate the intensity based on the distance
            const intensity = Math.min(1, (PERFORMANCE.MAX_DISTANCE - distance) / PERFORMANCE.MAX_DISTANCE);
            
            if (intensity > 0) {
                // Interpolate the colors
                const alphaForBorder = 0.15 + (intensity * (0.4 - 0.15));
                const alphaForBackground = intensity * 0.07;
                
                circle.style.borderColor = `rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, ${alphaForBorder})`;
                circle.style.backgroundColor = `rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, ${alphaForBackground})`;
            } else {
                circle.style.borderColor = 'rgba(170, 170, 170, 0.1)';
                circle.style.backgroundColor = 'transparent';
            }
        });
    });
}, PERFORMANCE.THROTTLE_DELAY);

// Get distance between two elements
function getDistanceBetweenElements(a, b) {
    const aRect = a.getBoundingClientRect();
    const bRect = b.getBoundingClientRect();

    const dx = aRect.left + aRect.width / 2 - (bRect.left + bRect.width / 2);
    const dy = aRect.top + aRect.height / 2 - (bRect.top + bRect.height / 2);
    return Math.sqrt(dx * dx + dy * dy);
}

// Handle ripple effect when a circle is clicked
function propagateRipple(clickedCircle) {
    if (!circlesArray.length) return;
    
    const rgbColor = getThemeColor();
    const clickedRect = clickedCircle.getBoundingClientRect();
    const clickedX = clickedRect.left + clickedRect.width / 2;
    const clickedY = clickedRect.top + clickedRect.height / 2;
    
    // Generate an array of animations to run for better batching
    const animationBatch = [];
    
    circlesArray.forEach(circle => {
        const rect = circle.getBoundingClientRect();
        const distance = getDistance(
            clickedX, clickedY,
            rect.left + rect.width / 2,
            rect.top + rect.height / 2
        );
        
        if (distance < PERFORMANCE.MAX_RIPPLE_DISTANCE) {
            // Calculate delay based on distance - faster propagation
            const delay = distance / 600; // Speed up from 500 to 600
            // Calculate intensity based on distance - stronger effect
            const intensity = Math.max(0.1, 1 - (distance / PERFORMANCE.MAX_RIPPLE_DISTANCE));
            
            // Store all animations to apply together
            animationBatch.push({
                circle,
                delay: delay * 1000,
                intensity
            });
        }
    });
    
    // Execute animations with proper timing
    animationBatch.forEach(animation => {
        setTimeout(() => {
            // If a previous animation is in progress, clear it
            if (animation.circle.dataset.timeoutId) {
                clearTimeout(parseInt(animation.circle.dataset.timeoutId));
            }
            
            animation.circle.classList.add('clicked');
            animation.circle.style.backgroundColor = `rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, ${animation.intensity * 0.4})`; // Increased opacity for more visible effect
            
            const circleTimeout = setTimeout(() => {
                animation.circle.classList.remove('clicked');
                animation.circle.style.backgroundColor = 'transparent';
            }, 500);
            
            animation.circle.dataset.timeoutId = circleTimeout;
        }, animation.delay);
    });
}

// Event listeners
document.addEventListener('mousemove', handleMouseMove);

document.addEventListener('click', (e) => {
    const clickedElement = e.target;

    if (clickedElement.classList.contains('circle')) {
        // If the circle has an existing timeout, clear it
        if (clickedElement.dataset.timeoutId) {
            clearTimeout(parseInt(clickedElement.dataset.timeoutId));
        }

        propagateRipple(clickedElement);
    }
});

// Initialize on DOM content loaded
document.addEventListener('DOMContentLoaded', initializeCircles);

// Reinitialize on window resize, with debounce
let resizeTimeout;
let prevWidth = window.innerWidth;
let prevHeight = window.innerHeight;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    
    // Force an immediate update for better user experience on resize
    if (Math.abs(window.innerWidth - prevWidth) > 50 || 
        Math.abs(window.innerHeight - prevHeight) > 50) {
        clearTimeout(resizeTimeout);
        initializeCircles();
        prevWidth = window.innerWidth;
        prevHeight = window.innerHeight;
    }
    
    // Still use debounce for fine-tuning
    resizeTimeout = setTimeout(() => {
        initializeCircles();
        prevWidth = window.innerWidth;
        prevHeight = window.innerHeight;
    }, 150); // Shorter debounce time
});
