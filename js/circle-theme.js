/**
 * Circle Theme Manager - handles theme color changes based on selected distribution.
 * This is a simplified implementation that updates CSS variables for theming.
 */

// Color mapping for distributions
const distroColors = {
    // Main distributions
    ubuntu: { primary: "#E95420", rgb: "233, 84, 32" },
    debian: { primary: "#A80030", rgb: "168, 0, 48" },
    fedora: { primary: "#51A2DA", rgb: "81, 162, 218" },
    arch: { primary: "#1793D1", rgb: "23, 147, 209" },
    mint: { primary: "#87CF3E", rgb: "135, 207, 62" },
    manjaro: { primary: "#35BF5C", rgb: "53, 191, 92" },
    pop: { primary: "#48B9C7", rgb: "72, 185, 199" },
    zorin: { primary: "#15A6F0", rgb: "21, 166, 240" },
    
    // Less common distributions
    kali: { primary: "#367BF0", rgb: "54, 123, 240" },
    parrot: { primary: "#04BADE", rgb: "4, 186, 222" },
    gentoo: { primary: "#54487A", rgb: "84, 72, 122" },
    slackware: { primary: "#7479BD", rgb: "116, 121, 189" },
    elementary: { primary: "#64BAFF", rgb: "100, 186, 255" },
    rocky: { primary: "#10B981", rgb: "16, 185, 129" },
    
    // Fallback color (warm orange)
    default: { primary: "#EB5E28", rgb: "235, 94, 40" }
};

/**
 * Updates the site's theme colors based on the selected distribution
 * @param {string} distroId - The ID of the selected distribution
 */
function updateCircleColors(distroId) {
    // Get colors for the selected distro, or use default if not found
    const colors = distroColors[distroId] || distroColors.default;
    
    // Update CSS variables
    document.documentElement.style.setProperty('--circle-primary-color', colors.primary);
    document.documentElement.style.setProperty('--circle-primary-color-rgb', colors.rgb);
    
    // Add a subtle background color if needed
    const bgColor = `rgba(${colors.rgb}, 0.03)`;
    document.documentElement.style.setProperty('--bg-tint-color', bgColor);
    
    // Remove any previous theme classes
    document.body.classList.forEach(className => {
        if (className.startsWith('theme-')) {
            document.body.classList.remove(className);
        }
    });
    
    // Add the new theme class
    document.body.classList.add(`theme-${distroId}`);
    
    // Update favicon if function exists (not implemented in this simplified version)
    if (typeof updateFavicon === 'function') {
        updateFavicon(distroId);
    }
    
    console.log(`Theme updated to: ${distroId}`);
}

// Initialize with default theme on load
document.addEventListener('DOMContentLoaded', function() {
    // Check if there's a URL parameter for a specific distribution
    const urlParams = new URLSearchParams(window.location.search);
    const distroParam = urlParams.get('distro') || urlParams.get('distro1');
    
    if (distroParam && distroColors[distroParam]) {
        updateCircleColors(distroParam);
    } else {
        // Use default color scheme if no valid distro is specified
        updateCircleColors('default');
    }
}); 