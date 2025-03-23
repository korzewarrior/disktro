// Card navigation script
document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('.content-section');
    let currentIndex = -1;
    
    // Make sections focusable
    sections.forEach(section => {
        section.setAttribute('tabindex', '-1');
    });

    function focusSection(index) {
        // Remove highlight from previous section
        if (currentIndex >= 0 && currentIndex < sections.length) {
            sections[currentIndex].classList.remove('focused');
        }
        
        // Update current index
        currentIndex = index;
        
        // Add highlight and scroll to new section
        if (currentIndex >= 0 && currentIndex < sections.length) {
            const section = sections[currentIndex];
            section.classList.add('focused');
            section.focus({ preventScroll: true }); // Set focus without scrolling
            
            // Scroll the section into view with smooth behavior
            section.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }

    function handleKeyNavigation(e) {
        // Only process if not inside an input or textarea
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            return;
        }
        
        switch (e.key) {
            case 'ArrowDown':
            case 'PageDown':
                e.preventDefault();
                // Move to next section if possible
                if (currentIndex < sections.length - 1) {
                    focusSection(currentIndex + 1);
                }
                break;
            case 'ArrowUp':
            case 'PageUp':
                e.preventDefault();
                // Move to previous section if possible
                if (currentIndex > 0) {
                    focusSection(currentIndex - 1);
                } else if (currentIndex === -1 && sections.length > 0) {
                    // If no card is focused yet, focus the first one on up key
                    focusSection(0);
                }
                break;
            case 'Home':
                e.preventDefault();
                // Move to first section
                if (sections.length > 0) {
                    focusSection(0);
                }
                break;
            case 'End':
                e.preventDefault();
                // Move to last section
                if (sections.length > 0) {
                    focusSection(sections.length - 1);
                }
                break;
        }
    }

    // Add keydown event listener to document
    document.addEventListener('keydown', handleKeyNavigation);

    // Initialize section focus when page loads based on URL hash if present
    window.addEventListener('load', function() {
        // Check if URL has a hash to a specific section
        if (window.location.hash) {
            const targetId = window.location.hash.substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                // Find which section contains this element
                sections.forEach((section, index) => {
                    if (section.contains(targetElement) || section === targetElement) {
                        focusSection(index);
                    }
                });
            }
        }
    });
}); 