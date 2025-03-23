// Distro color definitions - primary and secondary colors for each distro
const distroColors = {
    debian: {
        primary: '#D70A53',
        secondary: '#FFFFFF'
    },
    ubuntu: {
        primary: '#E95420',
        secondary: '#FFFFFF'
    },
    fedora: {
        primary: '#294172',
        secondary: '#3C6EB4'
    },
    arch: {
        primary: '#1793D1',
        secondary: '#4D4D4D'
    },
    mint: {
        primary: '#87CF3E',
        secondary: '#FFFFFF'
    },
    gentoo: {
        primary: '#54487A',
        secondary: '#FFFFFF'
    },
    slackware: {
        primary: '#7479A1',
        secondary: '#FFFFFF'
    },
    pureos: {
        primary: '#8F57B1',
        secondary: '#FFFFFF'
    },
    opensuse: {
        primary: '#73BA25',
        secondary: '#173F4F'
    },
    manjaro: {
        primary: '#35BF5C',
        secondary: '#2D2D2D'
    },
    popos: {
        primary: '#48B9C7',
        secondary: '#574F4A'
    },
    elementary: {
        primary: '#64BAFF',
        secondary: '#4D4D4D'
    },
    zorin: {
        primary: '#15A6F0',
        secondary: '#FFFFFF'
    },
    kali: {
        primary: '#4A66AC',
        secondary: '#000000'
    },
    rocky: {
        primary: '#10B981',
        secondary: '#FFFFFF'
    },
    endeavouros: {
        primary: '#7F3FBF',
        secondary: '#FFFFFF'
    }
};

// Default color is a vibrant purple
const defaultColor = {
    primary: '#8E44AD',
    secondary: '#FFFFFF'
};

// Keep track of the currently selected distro
let selectedDistro = null;

// Constants for localStorage
const STORAGE_KEY = 'disktro_selected_distro';

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

// Function to save selected distro to localStorage
function saveSelectedDistro(distroName) {
    try {
        localStorage.setItem(STORAGE_KEY, distroName || '');
    } catch (e) {
        console.warn('Could not save distro preference to localStorage:', e);
    }
}

// Function to load selected distro from localStorage
function loadSelectedDistro() {
    try {
        return localStorage.getItem(STORAGE_KEY) || null;
    } catch (e) {
        console.warn('Could not load distro preference from localStorage:', e);
        return null;
    }
}

// Function to apply the selected distro's color to the circles
function updateCircleColors(distroName) {
    const colors = distroName ? distroColors[distroName] : defaultColor;
    
    // Get RGB values for primary color
    const rgb = hexToRgb(colors.primary);
    
    // Update the CSS variables for circle colors
    document.documentElement.style.setProperty('--circle-primary-color', colors.primary);
    document.documentElement.style.setProperty('--circle-secondary-color', colors.secondary);
    document.documentElement.style.setProperty('--circle-primary-color-rgb', `${rgb.r}, ${rgb.g}, ${rgb.b}`);
    
    // Update the selected distro
    selectedDistro = distroName;
    
    // Save the selected distro to localStorage for persistence
    saveSelectedDistro(distroName);
    
    // Update version filter styling if the function exists
    if (typeof updateVersionFilterStyle === 'function') {
        updateVersionFilterStyle();
    }
}

// Function to add click event listeners to distro cards
function setupDistroCardListeners() {
    document.querySelectorAll('.distro-card').forEach(card => {
        // Skip cards that don't have an ID or don't follow the [distro]-card pattern
        if (!card.id || !card.id.endsWith('-card')) {
            return;
        }
        
        // Get the potential distro name from the card ID
        const potentialDistro = card.id.replace('-card', '');
        
        // Only add click handlers to cards that correspond to a known distro
        if (distroColors[potentialDistro]) {
            // Remove existing listener first to prevent duplicates
            card.removeEventListener('click', handleDistroCardClick);
            // Add click event listener
            card.addEventListener('click', handleDistroCardClick);
        }
    });
}

// Function to highlight the currently selected distro card
function highlightSelectedCard() {
    // Only attempt to highlight if we have a selected distro
    if (!selectedDistro) return;
    
    // Clear all selected states first
    document.querySelectorAll('.distro-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    // Find the card for the selected distro and highlight it
    const selectedCard = document.getElementById(`${selectedDistro}-card`);
    if (selectedCard) {
        selectedCard.classList.add('selected');
    }
}

// Handler function for distro card clicks
function handleDistroCardClick(e) {
    // Don't trigger selection if clicking on interactive elements
    if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON' || 
        e.target.closest('.hash') || e.target.closest('.raw-link div')) {
        return;
    }
    
    // Remove selected class from all cards
    document.querySelectorAll('.distro-card').forEach(c => {
        c.classList.remove('selected');
    });
    
    // Add selected class to this card
    this.classList.add('selected');
    
    // Get the distro name from the card ID
    const distroName = this.id.replace('-card', '');
    
    // Update circle colors
    updateCircleColors(distroName);
}

// Initialize circle colors with the saved preference or default
document.addEventListener('DOMContentLoaded', function() {
    // Try to load saved distro preference
    const savedDistro = loadSelectedDistro();
    
    if (savedDistro && distroColors[savedDistro]) {
        // Apply the saved distro colors
        updateCircleColors(savedDistro);
    } else {
        // No saved preference or invalid preference, use default
        const defaultRgb = hexToRgb(defaultColor.primary);
        document.documentElement.style.setProperty('--circle-primary-color', defaultColor.primary);
        document.documentElement.style.setProperty('--circle-secondary-color', defaultColor.secondary);
        document.documentElement.style.setProperty('--circle-primary-color-rgb', `${defaultRgb.r}, ${defaultRgb.g}, ${defaultRgb.b}`);
    }
    
    // Add click event listeners to the distro cards after they're loaded
    setTimeout(() => {
        setupDistroCardListeners();
        // Highlight the selected card if we're on the index page
        highlightSelectedCard();
    }, 500); // Give time for cards to load
});

// Reset to default colors when reset button is clicked
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        const resetButton = document.getElementById('reset-button');
        if (resetButton) {
            resetButton.addEventListener('click', function() {
                // Remove selected class from all cards
                document.querySelectorAll('.distro-card').forEach(card => {
                    card.classList.remove('selected');
                });
                
                // Reset to default colors
                updateCircleColors(null);
                
                // Also clear localStorage
                saveSelectedDistro(null);
                
                // Important: Re-setup the card listeners after refreshing the cards
                // This is needed because main.js calls refreshAllCards() which might recreate the cards
                setTimeout(() => {
                    setupDistroCardListeners();
                }, 500); // Give time for cards to refresh
            });
        }
    }, 500); // Give time for reset button to load
}); 