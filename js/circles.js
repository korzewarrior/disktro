// Performance configuration
const PERFORMANCE = {
    // Adjust max circles dynamically based on device performance
    MAX_CIRCLES: 900, // Increased max circles for better coverage
    // Throttle the mousemove event to improve performance
    THROTTLE_DELAY: 16, // ~60fps
    // Maximum distance for mouse interaction
    MAX_DISTANCE: 100,
    // Maximum distance for click ripple effect
    MAX_RIPPLE_DISTANCE: 300, // Increased from 150 to 300 for more dramatic explosions
    // UI elements ripple effect
    UI_RIPPLE_INTENSITY: 0.4, // How much UI elements move (0.0 to 1.0)
    UI_RIPPLE_DURATION: 600 // Duration in ms
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

// New function to make UI elements react to the ripple
function applyUIRippleEffect(sourceX, sourceY) {
    // Elements that should react to the ripple
    const uiElements = [
        '.header-card',
        '.search-toggle-container',
        '.distro-card',
        '.footer-card',
        '#disktro-card'
    ];
    
    // Wave propagation speed (pixels per millisecond) - increased for faster propagation
    const waveSpeed = 1.5; // Increased from 0.8 to make wave travel faster
    
    // Visual indicator of wave front (for debugging, set to true to see wave)
    const showWaveFront = false;
    
    // Wave expansion radius - to account for the visual size of the explosion
    const waveRadius = 40; // Matches roughly the visual explosion radius at start
    
    // Collect all elements
    const elements = [];
    uiElements.forEach(selector => {
        const found = document.querySelectorAll(selector);
        found.forEach(el => elements.push(el));
    });
    
    // Create wave indicator if enabled
    let waveIndicator;
    if (showWaveFront) {
        waveIndicator = document.createElement('div');
        waveIndicator.style.position = 'fixed';
        waveIndicator.style.left = sourceX + 'px';
        waveIndicator.style.top = sourceY + 'px';
        waveIndicator.style.width = '0';
        waveIndicator.style.height = '0';
        waveIndicator.style.borderRadius = '50%';
        waveIndicator.style.border = '2px solid red';
        waveIndicator.style.transform = 'translate(-50%, -50%)';
        waveIndicator.style.zIndex = '9999';
        waveIndicator.style.pointerEvents = 'none';
        document.body.appendChild(waveIndicator);
    }
    
    // Maximum distance for effect to reach - REDUCED to create more localized effects
    const maxDistance = Math.min(window.innerWidth, window.innerHeight) * 0.4;
    
    // Setup wave propagation calculations for each element
    elements.forEach(element => {
        // Get element position relative to viewport
        const rect = element.getBoundingClientRect();
        const elementCenterX = rect.left + rect.width / 2;
        const elementCenterY = rect.top + rect.height / 2;
        
        // Calculate direction (vector from source to element)
        const dirX = elementCenterX - sourceX;
        const dirY = elementCenterY - sourceY;
        
        // Calculate distance from explosion center to element center
        const distance = Math.sqrt(dirX * dirX + dirY * dirY);
        
        // Skip elements too far away from explosion - using stricter threshold
        if (distance > maxDistance) return;
        
        // Calculate adjusted distance accounting for element size
        // This makes the wave "hit" the closer edge of the element first
        const elementRadius = Math.min(rect.width, rect.height) / 2;
        const adjustedDistance = Math.max(0, distance - elementRadius - waveRadius);
        
        // Calculate time for wave to reach this element (accounting for initial explosion size)
        const waveArrivalTime = adjustedDistance / waveSpeed;
        
        // Animate the wave indicator if enabled
        if (showWaveFront) {
            setTimeout(() => {
                // Highlight the element when wave reaches it
                element.style.outline = '2px solid red';
                setTimeout(() => {
                    element.style.outline = '';
                }, 300);
            }, waveArrivalTime);
        }
        
        // Schedule the animation to start when the wave reaches this element
        setTimeout(() => {
            // Calculate intensity based on distance with more aggressive falloff
            // Using cubic falloff (distance^3) instead of linear falloff
            const normalizedDistance = distance / maxDistance;
            const falloff = Math.max(0, 1 - (normalizedDistance * normalizedDistance * normalizedDistance));
            const intensity = Math.max(0.1, falloff * PERFORMANCE.UI_RIPPLE_INTENSITY * 1.5);
            
            // Skip very low intensity effects to ensure only nearby elements are affected
            if (intensity < 0.15) return;
            
            // Normalize direction vector
            const length = Math.max(0.1, Math.sqrt(dirX * dirX + dirY * dirY));
            const normDirX = dirX / length;
            const normDirY = dirY / length;
            
            // Calculate transform amount (move away from source)
            const moveX = normDirX * intensity * 25; // increased for more noticeable effect
            const moveY = normDirY * intensity * 25;
            
            // Calculate rotation (subtle twist based on position)
            const rotateAmount = (Math.atan2(dirY, dirX) * intensity) * 2.0; // increased for more visible effect
            
            // Calculate scale (subtle pulse)
            const scaleAmount = 1 + (intensity * 0.08); // increased for more visible effect
            
            // Apply the animation through CSS custom properties
            element.style.setProperty('--move-x', `${moveX}px`);
            element.style.setProperty('--move-y', `${moveY}px`);
            element.style.setProperty('--rotate', `${rotateAmount}deg`);
            element.style.setProperty('--scale', scaleAmount);
            
            // Add the animation class
            element.classList.add('ripple-animate');
            
            // Remove animation after it completes
            setTimeout(() => {
                element.classList.remove('ripple-animate');
            }, 600); // Animation duration
        }, waveArrivalTime);
    });
    
    // Animate wave indicator expanding if enabled
    if (showWaveFront) {
        const startTime = performance.now();
        const animateWave = (time) => {
            const elapsed = time - startTime;
            const radius = elapsed * waveSpeed;
            
            waveIndicator.style.width = radius * 2 + 'px';
            waveIndicator.style.height = radius * 2 + 'px';
            
            if (radius < maxDistance) {
                requestAnimationFrame(animateWave);
            } else {
                document.body.removeChild(waveIndicator);
            }
        };
        
        requestAnimationFrame(animateWave);
    }
}

// Update the propagateRipple function to also trigger UI element effects
function propagateRipple(clickedCircle) {
    if (!circlesArray.length) return;
    
    const rgbColor = getThemeColor();
    const clickedRect = clickedCircle.getBoundingClientRect();
    const clickedX = clickedRect.left + clickedRect.width / 2;
    const clickedY = clickedRect.top + clickedRect.height / 2;
    
    // Apply ripple effect to UI elements
    applyUIRippleEffect(clickedX, clickedY);
    
    // Reduce max ripple distance for a more localized effect that matches the UI element ripple
    const localizedRippleDistance = Math.min(window.innerWidth, window.innerHeight) * 0.4;
    
    // Generate an array of animations to run for better batching
    const animationBatch = [];
    
    circlesArray.forEach(circle => {
        const rect = circle.getBoundingClientRect();
        const distance = getDistance(
            clickedX, clickedY,
            rect.left + rect.width / 2,
            rect.top + rect.height / 2
        );
        
        if (distance < localizedRippleDistance) {
            // Calculate delay based on distance - faster propagation
            const delay = distance / 600; // Speed up from 500 to 600
            
            // Calculate intensity with cubic falloff for more localized effect
            const normalizedDistance = distance / localizedRippleDistance;
            const falloff = Math.max(0.1, 1 - (normalizedDistance * normalizedDistance * normalizedDistance));
            
            // Store all animations to apply together
            animationBatch.push({
                circle,
                delay: delay * 1000,
                intensity: falloff
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
            animation.circle.style.backgroundColor = `rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, ${animation.intensity * 0.5})`; // Increased opacity for more visible effect
            
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
