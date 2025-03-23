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
            <div class="card-header">
                <img src="img/disktro-logo.png" alt="Disktro logo" class="distro-logo">
                <h2 class="distro-title">DIS<span class="highlight">[K]</span>TRO</h2>
                <div class="header-controls">
                    <a href="https://github.com" target="_blank" class="home-link" data-tooltip="Visit GitHub">🏠</a>
                    <a href="javascript:void(0)" class="docs-link" data-tooltip="Contact site administrator">❓</a>
                </div>
            </div>
            <div class="version-subtitle">ISO Library — Find Your Perfect Linux</div>
            <div class="card-content">
                <div class="info-bar" style="display:none; margin:0; padding:0; height:0;"></div>
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
                <div class="footer-nav">
                    <a href="index.html" class="footer-nav-link" data-page="index">Home</a>
                    <a href="faq.html" class="footer-nav-link" data-page="faq">FAQ</a>
                    <a href="getting-started.html" class="footer-nav-link" data-page="getting-started">Getting Started</a>
                    <a href="compare.html" class="footer-nav-link" data-page="compare">Compare</a>
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
        
        console.log('Footer element created directly:', footerCard.id);
        
        // Update dynamic content
        setDynamicContent(footerCard);
        
        // Append footer to the proper container
        appendFooterToContainer(footerCard);
        
        // Set active navigation links
        setActiveNavLink(footerCard);
        
        // Initialize tooltips
        initializeTooltips(footerCard);
        
        // Apply layout styling
        if (typeof updateFooterCardLayout === 'function') {
            updateFooterCardLayout();
        }
        
        console.log('Footer loaded and inserted successfully');
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
            countElement.textContent = window.distros ? window.distros.length : 16;
        }
    }
    
    // Append the footer to the appropriate container
    function appendFooterToContainer(footer) {
        console.log('Appending footer to container');
        
        let osSection = document.querySelector('.os-sections');
        console.log('Found .os-sections?', !!osSection);
        
        // If .os-sections doesn't exist (like on content pages), create a container for the footer
        if (!osSection) {
            console.log('Creating container for footer');
            const footerContainer = document.createElement('div');
            footerContainer.className = 'footer-container';
            
            // Create a substitute .os-sections element
            osSection = document.createElement('div');
            osSection.className = 'os-sections';
            
            footerContainer.appendChild(osSection);
            
            // Find where to insert the footer container (before the #footer div)
            const originalFooter = document.getElementById('footer');
            if (originalFooter) {
                console.log('Inserting before #footer div');
                originalFooter.parentNode.insertBefore(footerContainer, originalFooter);
            } else {
                // If no #footer, append to body
                console.log('No #footer found, appending to body');
                document.body.appendChild(footerContainer);
            }
        }
        
        osSection.appendChild(footer);
        console.log('Footer appended to section container');
        
        // Hide the original footer div
        const originalFooter = document.getElementById('footer');
        if (originalFooter) {
            originalFooter.style.display = 'none';
            console.log('Original footer hidden');
        }
    }
    
    // Set the active navigation link based on current page
    function setActiveNavLink(footer) {
        const currentPath = window.location.pathname;
        console.log('Current path for nav links:', currentPath);
        const navLinks = footer.querySelectorAll('.footer-nav-link');
        
        navLinks.forEach(link => {
            // Remove any existing active class
            link.classList.remove('active');
            
            // Get the page identifier from data attribute
            const page = link.getAttribute('data-page');
            
            // Check if this is the current page
            if ((page === 'index' && (currentPath.endsWith('index.html') || currentPath === '/' || currentPath.endsWith('/'))) ||
                (page !== 'index' && currentPath.endsWith(page + '.html'))) {
                link.classList.add('active');
                console.log('Active nav link set:', page);
            }
        });
    }
    
    // Initialize tooltips for footer links
    function initializeTooltips(footer) {
        const footerHomeLink = footer.querySelector('.home-link');
        const footerDocsLink = footer.querySelector('.docs-link');
        
        if (typeof addQuickTooltip === 'function') {
            addQuickTooltip(footerHomeLink);
            addQuickTooltip(footerDocsLink);
        } else {
            // Fallback if addQuickTooltip function isn't available
            [footerHomeLink, footerDocsLink].forEach(link => {
                if (link) {
                    link.addEventListener('mouseenter', function() {
                        const tooltip = document.createElement('span');
                        tooltip.className = 'quick-tooltip';
                        tooltip.textContent = this.getAttribute('data-tooltip');
                        this.appendChild(tooltip);
                    });
                    
                    link.addEventListener('mouseleave', function() {
                        const tooltip = this.querySelector('.quick-tooltip');
                        if (tooltip) tooltip.remove();
                    });
                }
            });
        }
    }
    
    // Fallback simple footer creation if loading template fails
    function createSimpleFooter() {
        console.log('Creating simple fallback footer');
        const footer = document.createElement('div');
        footer.id = 'disktro-card';
        footer.className = 'distro-card footer-card';
        footer.innerHTML = `
            <div class="card-header">
                <img src="img/disktro-logo.png" alt="Disktro logo" class="distro-logo">
                <h2 class="distro-title">DIS<span class="highlight">[K]</span>TRO</h2>
            </div>
            <div class="card-content">
                <div class="footer-nav">
                    <a href="index.html" class="footer-nav-link" data-page="index">Home</a>
                    <a href="faq.html" class="footer-nav-link" data-page="faq">FAQ</a>
                    <a href="getting-started.html" class="footer-nav-link" data-page="getting-started">Getting Started</a>
                    <a href="compare.html" class="footer-nav-link" data-page="compare">Compare</a>
                </div>
                <div class="footer-copyright">
                    © ${new Date().getFullYear()} DIS[K]TRO — Helping you find your perfect distro
                </div>
            </div>
        `;
        
        appendFooterToContainer(footer);
    }
    
    // Update the footer position (ensure it's at the end)
    function updateFooterPosition() {
        const disktroCard = document.getElementById('disktro-card');
        const osSection = document.querySelector('.os-sections');
        
        if (disktroCard && osSection) {
            osSection.appendChild(disktroCard);
            console.log('Footer position updated');
        } else {
            console.log('Cannot update footer position - elements not found:', 
                        'disktroCard:', !!disktroCard, 
                        'osSection:', !!osSection);
        }
    }
    
    // Force footer loading after a short delay in case there are timing issues
    setTimeout(function() {
        if (!document.getElementById('disktro-card')) {
            console.log('Footer not found after delay, forcing load');
            loadFooter();
        }
    }, 1000);
});