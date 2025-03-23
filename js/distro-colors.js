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
    }
};

// Default color is a gold/yellow
const defaultColor = {
    primary: '#D4AF37',
    secondary: '#FFFFFF'
};

// Keep track of the currently selected distro
let selectedDistro = null;

// Function to apply the selected distro's color to the circles
function updateCircleColors(distroName) {
    const colors = distroName ? distroColors[distroName] : defaultColor;
    
    // Update the CSS variables for circle colors
    document.documentElement.style.setProperty('--circle-primary-color', colors.primary);
    document.documentElement.style.setProperty('--circle-secondary-color', colors.secondary);
    
    // Update the selected distro
    selectedDistro = distroName;
}

// Initialize circle colors with the default
document.addEventListener('DOMContentLoaded', function() {
    // Add CSS variables to the root element
    document.documentElement.style.setProperty('--circle-primary-color', defaultColor.primary);
    document.documentElement.style.setProperty('--circle-secondary-color', defaultColor.secondary);
    
    // Add click event listeners to the distro cards after they're loaded
    setTimeout(() => {
        document.querySelectorAll('.distro-card').forEach(card => {
            card.addEventListener('click', function(e) {
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
            });
        });
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
            });
        }
    }, 500); // Give time for reset button to load
}); 