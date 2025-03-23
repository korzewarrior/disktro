// Performance configuration
const PERFORMANCE = {
    // Adjust max circles dynamically based on device performance
    MAX_CIRCLES: 300,
    // Throttle the mousemove event to improve performance
    THROTTLE_DELAY: 16, // ~60fps
    // Maximum distance for mouse interaction
    MAX_DISTANCE: 100,
    // Maximum distance for click ripple effect
    MAX_RIPPLE_DISTANCE: 150
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

// Initialize the circles
function initializeCircles() {
    const maxCircles = detectPerformance();
    
    const circleDiameter = 50 + 10;
    // Calculate the number of circles that would fit the screen
    const circlesHorizontal = Math.ceil(window.innerWidth / circleDiameter);
    const circlesVertical = Math.ceil(window.innerHeight / circleDiameter);
    
    // Limit the total number of circles based on performance
    const densityFactor = isLowPerformanceDevice ? 2 : 1;
    const totalCircles = Math.min(maxCircles, Math.floor((circlesHorizontal * circlesVertical) / densityFactor));
    
    // Create a document fragment for better performance
    const fragment = document.createDocumentFragment();
    
    for (let i = 0; i < totalCircles; i++) {
        const circle = document.createElement('div');
        circle.classList.add('circle');
        fragment.appendChild(circle);
        circlesArray.push(circle);
    }
    
    container.appendChild(fragment);
    
    console.log(`Initialized ${totalCircles} circles. Low performance mode: ${isLowPerformanceDevice}`);
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
            const delay = distance / 500;
            
            // Store all animations to apply together
            animationBatch.push({
                circle,
                delay: delay * 1000
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
            animation.circle.style.backgroundColor = `rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, 0.3)`;
            
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
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        // Clear the current circles
        container.innerHTML = '';
        circlesArray = [];
        
        // Reinitialize with new dimensions
        initializeCircles();
    }, 250); // Debounce for 250ms
});
