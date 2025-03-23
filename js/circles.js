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
    UI_RIPPLE_DURATION: 600, // Duration in ms
    // Bomb feature configuration
    MAX_BOMBS: 5, // Maximum number of bombs that can be placed
    BOMB_KEY: 'b', // Key to press to place a bomb
    BOMB_HIGHLIGHT_COLOR: 'rgba(255, 50, 50, 0.3)' // Color to highlight bomb circles
};

// Store the circles in an array for faster access
let circlesArray = [];
let isLowPerformanceDevice = false;

// Bomb state tracking
let bombCircles = []; // Array to track which circles have bombs
let hoveredCircle = null; // Currently hovered circle

// Cache DOM elements
const container = document.querySelector('.circlecontainer');

// Create a tooltip element for bomb instructions
const bombTooltip = document.createElement('div');
bombTooltip.style.position = 'fixed';
bombTooltip.style.bottom = '20px';
bombTooltip.style.left = '50%';
bombTooltip.style.transform = 'translateX(-50%)';
bombTooltip.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
bombTooltip.style.color = 'white';
bombTooltip.style.padding = '10px 15px';
bombTooltip.style.borderRadius = '6px';
bombTooltip.style.fontSize = '14px';
bombTooltip.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.3)';
bombTooltip.style.zIndex = '9999';
bombTooltip.style.fontFamily = "'Raleway Medium', sans-serif";
bombTooltip.style.pointerEvents = 'none';
bombTooltip.style.opacity = '0';
bombTooltip.style.transition = 'opacity 0.3s ease';
bombTooltip.textContent = `Hover over a circle and press '${PERFORMANCE.BOMB_KEY}' to place a bomb (${PERFORMANCE.MAX_BOMBS} max)`;
document.body.appendChild(bombTooltip);

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
    
    // Reset bomb circles when regenerating
    bombCircles = [];
    hoveredCircle = null;
    
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
        
        // Add hover listeners for bomb placement
        circle.addEventListener('mouseover', () => {
            hoveredCircle = circle;
        });
        
        circle.addEventListener('mouseout', () => {
            hoveredCircle = null;
        });
        
        fragment.appendChild(circle);
        circlesArray.push(circle);
    }
    
    container.appendChild(fragment);
    
    console.log(`Initialized ${totalCircles} circles of ${totalCirclesNeeded} needed (viewport: ${viewportWidth}x${viewportHeight}). Low performance mode: ${isLowPerformanceDevice}`);
}

// Function to place a bomb on a circle
function placeBomb(circle) {
    // Check if this circle already has a bomb - if so, remove it (toggle functionality)
    if (circle.classList.contains('bomb')) {
        removeBomb(circle);
        return;
    }
    
    // Check if we've reached the max number of bombs
    if (bombCircles.length >= PERFORMANCE.MAX_BOMBS) {
        // Remove the oldest bomb
        const oldestBomb = bombCircles.shift();
        removeBomb(oldestBomb);
    }
    
    // Mark this circle as a bomb
    bombCircles.push(circle);
    circle.classList.add('bomb');
    
    // Visual indicator using theme color
    const rgbColor = getThemeColor();
    circle.style.backgroundColor = `rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, 0.3)`;
    circle.style.borderColor = `rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, 0.8)`;
    circle.style.boxShadow = `0 0 10px rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, 0.5)`;
}

// Helper function to properly remove a bomb and reset styling
function removeBomb(circle) {
    // Remove from bomb list
    bombCircles = bombCircles.filter(c => c !== circle);
    
    // Remove bomb class
    circle.classList.remove('bomb');
    
    // Completely reset all styling
    circle.style.backgroundColor = 'transparent';
    circle.style.borderColor = 'rgba(170, 170, 170, 0.1)';
    circle.style.boxShadow = 'none';
}

// Check if a ripple hits any bomb circles and trigger them
function checkBombDetonation(sourceX, sourceY, maxDistance) {
    if (bombCircles.length === 0) return; // No bombs placed
    
    const bombsToTrigger = [];
    
    // Check each bomb to see if the explosion wave reaches it
    bombCircles.forEach(bombCircle => {
        // Skip if the bomb circle itself was the source of the explosion
        if (bombCircle.classList.contains('clicked')) return;
        
        const rect = bombCircle.getBoundingClientRect();
        const circleCenterX = rect.left + rect.width / 2;
        const circleCenterY = rect.top + rect.height / 2;
        
        const distance = getDistance(sourceX, sourceY, circleCenterX, circleCenterY);
        
        // If the explosion wave reaches this bomb, add it to trigger list
        if (distance <= maxDistance) {
            bombsToTrigger.push({
                circle: bombCircle,
                delay: distance / 700 * 1000 // The delay should match the wave arrival
            });
        }
    });
    
    // Trigger the bombs with appropriate delays
    bombsToTrigger.forEach(bomb => {
        setTimeout(() => {
            // Remove bomb completely using our helper function
            removeBomb(bomb.circle);
            
            // Trigger the explosion
            propagateRipple(bomb.circle);
        }, bomb.delay + 100); // Add a small extra delay for visual effect
    });
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
            // Skip if this is a bomb circle
            if (circle.classList.contains('bomb')) return;
            
            // Only calculate for visible circles (performance optimization)
            const rect = circle.getBoundingClientRect();
            
            // Skip circles that are far from mouse (more than MAX_DISTANCE)
            if (Math.abs(mouseX - rect.left - rect.width / 2) > PERFORMANCE.MAX_DISTANCE * 1.5 ||
                Math.abs(mouseY - rect.top - rect.height / 2) > PERFORMANCE.MAX_DISTANCE * 1.5) {
                // Reset if far away
                circle.style.borderColor = 'rgba(170, 170, 170, 0.1)';
                circle.style.backgroundColor = 'transparent';
                circle.style.boxShadow = 'none';
                circle.style.transform = 'scale(1)';
                return;
            }
            
            const dx = mouseX - (rect.left + rect.width / 2);
            const dy = mouseY - (rect.top + rect.height / 2);
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // Calculate the intensity based on the distance
            const intensity = Math.min(1, (PERFORMANCE.MAX_DISTANCE - distance) / PERFORMANCE.MAX_DISTANCE);
            
            if (intensity > 0) {
                // Interpolate the colors - increase background alpha slightly for more visibility
                const alphaForBorder = 0.15 + (intensity * (0.5 - 0.15)); // Increased max from 0.4 to 0.5
                const alphaForBackground = intensity * 0.12; // Increased from 0.07 to 0.12
                
                // Add subtle glow effect with box-shadow
                const glowIntensity = intensity * 0.8;
                const glowSize = Math.max(2, intensity * 8); // Subtle glow size
                
                // Add subtle scale effect
                const scaleAmount = 1 + (intensity * 0.08); // Max scale of 1.08x
                
                circle.style.borderColor = `rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, ${alphaForBorder})`;
                circle.style.backgroundColor = `rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, ${alphaForBackground})`;
                circle.style.boxShadow = `0 0 ${glowSize}px rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, ${glowIntensity})`;
                circle.style.transform = `scale(${scaleAmount})`;
                circle.style.zIndex = '2'; // Ensure hovering circles appear above others
            } else {
                circle.style.borderColor = 'rgba(170, 170, 170, 0.1)';
                circle.style.backgroundColor = 'transparent';
                circle.style.boxShadow = 'none';
                circle.style.transform = 'scale(1)';
                circle.style.zIndex = '1'; // Reset z-index
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
    const waveSpeed = 1.8; // Increased from 1.5 to make wave travel faster
    
    // Visual indicator of wave front (for debugging, set to true to see wave)
    const showWaveFront = false;
    
    // Wave expansion radius - to account for the visual size of the explosion
    const waveRadius = 25; // Reduced from 40 to match the smaller explosion size
    
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
    
    // Maximum distance for effect to reach - FURTHER REDUCED for shorter propagation
    const maxDistance = Math.min(window.innerWidth, window.innerHeight) * 0.3;
    
    // Check if any bombs should detonate from this explosion
    checkBombDetonation(sourceX, sourceY, maxDistance);
    
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
            // Calculate intensity based on distance with a moderated falloff
            // Using squared falloff (less aggressive than cubic) to increase impact radius
            const normalizedDistance = distance / maxDistance;
            const falloff = Math.max(0, 1 - (normalizedDistance * normalizedDistance));
            const intensity = Math.max(0.15, falloff * PERFORMANCE.UI_RIPPLE_INTENSITY * 1.8);
            
            // Skip very low intensity effects but with a lower threshold
            if (intensity < 0.12) return;
            
            // Normalize direction vector
            const length = Math.max(0.1, Math.sqrt(dirX * dirX + dirY * dirY));
            const normDirX = dirX / length;
            const normDirY = dirY / length;
            
            // Calculate transform amount (move away from source)
            const moveX = normDirX * intensity * 28; // increased for more impact
            const moveY = normDirY * intensity * 28;
            
            // Calculate rotation (subtle twist based on position)
            const rotateAmount = (Math.atan2(dirY, dirX) * intensity) * 2.2; // increased for more visible effect
            
            // Calculate scale (subtle pulse)
            const scaleAmount = 1 + (intensity * 0.09); // increased for more visible effect
            
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
    const localizedRippleDistance = Math.min(window.innerWidth, window.innerHeight) * 0.3;
    
    // Generate an array of animations to run for better batching
    const animationBatch = [];
    
    circlesArray.forEach(circle => {
        // Skip the clicked circle itself
        if (circle === clickedCircle) return;
        
        const rect = circle.getBoundingClientRect();
        const distance = getDistance(
            clickedX, clickedY,
            rect.left + rect.width / 2,
            rect.top + rect.height / 2
        );
        
        if (distance < localizedRippleDistance) {
            // Calculate delay based on distance - faster propagation
            const delay = distance / 700; // Speed up for shorter propagation time
            
            // Calculate intensity with squared falloff (less aggressive than cubic) for more impact
            const normalizedDistance = distance / localizedRippleDistance;
            const falloff = Math.max(0.12, 1 - (normalizedDistance * normalizedDistance));
            
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
            animation.circle.style.backgroundColor = `rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, ${animation.intensity * 0.6})`; // Increased opacity for more visible effect
            
            const circleTimeout = setTimeout(() => {
                animation.circle.classList.remove('clicked');
                // Only reset backgroundColor if it's not a bomb
                if (!animation.circle.classList.contains('bomb')) {
                    animation.circle.style.backgroundColor = 'transparent';
                }
            }, 500);
            
            animation.circle.dataset.timeoutId = circleTimeout;
        }, animation.delay);
    });
    
    // Add the clicked animation to the source circle
    clickedCircle.classList.add('clicked');
    clickedCircle.style.backgroundColor = `rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, 0.6)`;
    
    const circleTimeout = setTimeout(() => {
        clickedCircle.classList.remove('clicked');
        // Only reset background if it's not a bomb
        if (!clickedCircle.classList.contains('bomb')) {
            clickedCircle.style.backgroundColor = 'transparent';
        }
    }, 500);
    
    clickedCircle.dataset.timeoutId = circleTimeout;
}

// Event listeners
document.addEventListener('mousemove', handleMouseMove);

// Add keydown event listener for bomb placement
document.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'k' && hoveredCircle) {
        // Toggle bomb - placeBomb now handles this logic
        placeBomb(hoveredCircle);
    }
});

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
