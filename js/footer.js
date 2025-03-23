// Modular footer implementation using template
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded - attempting to load footer');
    
    // Create the footer initially
    loadFooter();
    
    // Add event listener to recreate footer when version filter changes
    const versionFilter = document.getElementById('version-filter');
    if (versionFilter) {
        versionFilter.addEventListener('change', function() {
            // Use setTimeout to ensure this runs after refreshAllCards completes
            setTimeout(updateFooterPosition, 500);
        });
    }
    
    // Set active link in header navigation
    setActiveNavLink();
    
    // Function to load the footer template and insert it
    function loadFooter() {
        console.log('loadFooter called');
        
        // If footer already exists, just ensure it's properly positioned
        if (document.getElementById('disktro-card')) {
            console.log('Footer already exists, updating position');
            updateFooterPosition();
            return;
        }
        
        console.log('Creating footer directly to avoid fetch issues');
        
        // DIRECT HTML INJECTION - Skip fetch completely to avoid any network issues
        const footerHTML = `
        <div id="disktro-card" class="distro-card footer-card">
            <div class="card-header" style="position: relative;">
                <a href="index.html" title="Back to Home" style="display: flex; align-items: center; text-decoration: none; color: inherit;">
                    <img src="img/disktro-logo.png" alt="Disktro logo" class="distro-logo">
                    <h2 class="distro-title">DIS<span class="accent">[K]</span>TRO</h2>
                </a>
                <a href="#" id="back-to-top" title="Back to Top" onclick="window.scrollTo({top: 0, behavior: 'smooth'}); return false;" style="position: absolute; right: 15px; top: 50%; transform: translateY(-50%); color: #888; text-decoration: none; font-size: 20px; transition: all 0.25s ease; display: flex; align-items: center; justify-content: center;">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M18 15l-6-6-6 6"/>
                    </svg>
                </a>
            </div>
            <div class="card-content">
                <div class="footer-info">
                    <div class="footer-column">
                        <p>Currently tracking <span id="distro-count">16</span> distributions</p>
                        <p>Powered by the open-source community</p>
                    </div>
                    <div class="footer-column">
                        <p>Made with ❤️ for Linux users everywhere</p>
                        <p>All logos belong to their respective projects</p>
                    </div>
                </div>
                <div class="footer-copyright">
                    © <span id="current-year">${new Date().getFullYear()}</span> DIS[K]TRO — Helping you find your perfect distro
                </div>
            </div>
        </div>`;
        
        // Create a temporary container
        const tempContainer = document.createElement('div');
        tempContainer.innerHTML = footerHTML;
        
        // Get the footer element
        const footerCard = tempContainer.firstElementChild;
        
        // Set dynamic content (distro count, current year)
        setDynamicContent(footerCard);
        
        // Add the footer to the appropriate container
        appendFooterToContainer(footerCard);
        
        // Set up hover effects for back to top button
        setupBackToTopButton();
    }
    
    // Set dynamic content in the footer
    function setDynamicContent(footer) {
        // Set the current year
        const yearElement = footer.querySelector('#current-year');
        if (yearElement) {
            yearElement.textContent = new Date().getFullYear();
        }
        
        // Set the distro count
        const countElement = footer.querySelector('#distro-count');
        if (countElement) {
            // This is defined at the top of main.js - get the count from there
            const distroCount = window.distros ? window.distros.length : 16;
            countElement.textContent = distroCount;
        }
    }
    
    // Add footer to the appropriate container
    function appendFooterToContainer(footer) {
        // Try to find the os-sections container first (for the main page)
        let container = document.querySelector('.os-sections');
        
        // If not found, look for the content-page container (for other pages)
        if (!container) {
            container = document.querySelector('.content-page');
        }
        
        // If still not found, use the #footer div as a fallback
        if (!container) {
            container = document.getElementById('footer');
        }
        
        // If we found a container, append the footer
        if (container) {
            console.log('Appending footer to container:', container);
            container.appendChild(footer);
            
            // Update the position immediately
            updateFooterPosition();
        } else {
            console.error('No container found for footer');
            
            // Last resort - append to body
            document.body.appendChild(footer);
        }
    }
    
    // Setup hover effects for the back to top button
    function setupBackToTopButton() {
        const backToTopBtn = document.getElementById('back-to-top');
        if (!backToTopBtn) return;
        
        backToTopBtn.addEventListener('mouseover', function() {
            this.style.color = 'rgba(var(--circle-primary-color, 212, 175, 55), 1)';
        });
        
        backToTopBtn.addEventListener('mouseout', function() {
            this.style.color = '#888';
        });
    }
    
    // Set the active navigation link based on the current page
    function setActiveNavLink() {
        // Get all navigation links from the header
        const navLinks = document.querySelectorAll('.header-nav-link');
        if (!navLinks || navLinks.length === 0) {
            console.log('No navigation links found');
            return;
        }
        
        // Get the current page filename
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        console.log('Current page detected as:', currentPage);
        
        let activeFound = false;
        
        // Loop through all nav links and set the active class
        navLinks.forEach(link => {
            // Get the href attribute
            const href = link.getAttribute('href');
            
            // If this link's href matches the current page, set it as active
            if (href === currentPage || 
                (currentPage === '' && href === 'index.html') ||
                (currentPage === '/' && href === 'index.html')) {
                link.classList.add('active');
                console.log('Setting active class on:', href);
                activeFound = true;
            } else {
                link.classList.remove('active');
            }
        });
        
        if (!activeFound) {
            console.log('No active link was found for current page');
        }
    }
    
    // Update the footer position on the page
    function updateFooterPosition() {
        const footerCard = document.getElementById('disktro-card');
        if (!footerCard) return;
        
        // Get the parent container
        const container = footerCard.parentElement;
        if (!container) return;
        
        // First remove the footer to ensure it's at the end
        footerCard.remove();
        
        // Then re-append it to ensure it's the last element
        container.appendChild(footerCard);
        
        console.log('Footer repositioned');
        
        // Setup back to top button again after repositioning
        setupBackToTopButton();
    }
});