// Modular header implementation using template
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded - attempting to load header');
    
    // Create the header initially
    loadHeader();
    
    // Function to load the header template and insert it
    function loadHeader() {
        console.log('loadHeader called');
        
        // If header already exists, just ensure it's properly loaded
        if (document.querySelector('.header-card')) {
            console.log('Header already exists');
            return;
        }
        
        console.log('Creating header directly');
        
        // Get the page title from the document title to set the tagline
        let pageTitle = document.title || '';
        let tagline = 'Disks — Find Your Perfect Linux'; // Default tagline
        
        // Check current URL path to determine page type
        const currentPath = window.location.pathname;
        if (currentPath.includes('compare')) {
            tagline = "Compare — Side-by-Side Analysis";
        } else if (currentPath.includes('getting-started')) {
            tagline = "Start — Your Linux Journey Begins";
        } else if (currentPath.includes('faq')) {
            tagline = "Frequently Asked Questions";
        } else if (currentPath.includes('desktop-environments')) {
            tagline = "DEs — Linux Desktop Environments";
        } else if (currentPath.includes('distro-finder')) {
            tagline = "Quiz — Find Your Perfect Match";
        } else if (currentPath.includes('guides')) {
            tagline = "Guides & Tutorials";
        } else if (currentPath.includes('resources')) {
            tagline = "Linux Resources";
        } else {
            // Use title-based logic as fallback
            if (pageTitle.includes('|')) {
                let pagePart = '';
                const parts = pageTitle.split('|').map(part => part.trim());
                
                // Check if it's "FAQ | Disktro" format 
                if (parts[0] === 'FAQ') {
                    pagePart = 'FAQ';
                } else {
                    // Otherwise use the part after the separator
                    pagePart = parts[1];
                }
                
                // Set specific taglines based on page
                if (pagePart.includes('Getting Started')) {
                    tagline = "Start — Your Linux Journey Begins";
                } else if (pagePart.includes('Compare')) {
                    tagline = "Compare — Side-by-Side Analysis";
                } else if (pagePart.includes('Desktop Environments')) {
                    tagline = "DEs — Linux Desktop Environments";
                } else if (pagePart.includes('Distro Finder')) {
                    tagline = "Quiz — Find Your Perfect Match";
                } else if (pagePart.includes('FAQ') || pagePart === 'FAQ') {
                    tagline = "Frequently Asked Questions";
                }
            }
        }
        
        // DIRECT HTML INJECTION - Removed navigation, now only contains the logo and tagline
        const headerHTML = `
        <div class="header-card">
            <div class="card-header">
                <div class="header-brand">
                    <img src="img/disktro-logo.png" alt="Disktro Logo" class="header-logo">
                    <h1 class="title">Dis<span class="accent">[k]</span>tro</h1>
                </div>
                <p class="tagline">${tagline}</p>
            </div>
        </div>`;
        
        // Create a temporary container
        const tempContainer = document.createElement('div');
        tempContainer.innerHTML = headerHTML;
        
        // Get the header element
        const headerCard = tempContainer.firstElementChild;
        
        // Add the header to the appropriate container
        appendHeaderToContainer(headerCard);
    }
    
    // Add header to the appropriate container
    function appendHeaderToContainer(header) {
        // Look for the header container
        let container = document.getElementById('header');
        
        // If not found, look for the container div
        if (!container) {
            container = document.querySelector('.container');
        }
        
        // If we found a container, insert the header at the beginning
        if (container) {
            console.log('Appending header to container:', container);
            // Insert at the beginning of the container
            container.insertBefore(header, container.firstChild);
        } else {
            console.error('No container found for header');
            
            // Last resort - append to body at beginning
            document.body.insertBefore(header, document.body.firstChild);
        }
    }
}); 