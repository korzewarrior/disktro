// Modular navbar implementation
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded - attempting to load navbar');
    
    // Delay slightly to ensure header is loaded first
    setTimeout(function() {
        // Create the navbar initially
        loadNavbar();
    }, 100);
    
    // Function to load the navbar and insert it
    function loadNavbar() {
        console.log('loadNavbar called');
        
        // Log the current page structure to diagnose issues
        console.log('Page structure check:');
        console.log('- Header container exists:', !!document.getElementById('header'));
        console.log('- Navbar container exists:', !!document.getElementById('navbar'));
        console.log('- Main container exists:', !!document.querySelector('.container'));
        
        // If navbar already exists, just ensure it's properly loaded
        if (document.querySelector('.navbar-card')) {
            console.log('Navbar already exists, setting active link');
            setActiveNavLink();
            return;
        }
        
        console.log('Creating navbar directly');
        
        // DIRECT HTML INJECTION
        const navbarHTML = `
        <div class="navbar-card">
            <div class="navbar">
                <a href="index.html" class="navbar-link" data-page="index">Disks</a>
                <a href="getting-started.html" class="navbar-link" data-page="getting-started">Start</a>
                <a href="compare.html" class="navbar-link" data-page="compare">Compare</a>
                <a href="desktop-environments.html" class="navbar-link" data-page="desktop-environments">DEs</a>
                <a href="distro-finder.html" class="navbar-link" data-page="distro-finder">Quiz</a>
                <a href="guides.html" class="navbar-link" data-page="guides">Guides</a>
                <a href="resources.html" class="navbar-link" data-page="resources">Resources</a>
                <a href="faq.html" class="navbar-link" data-page="faq">FAQ</a>
            </div>
        </div>`;
        
        // Create a temporary container
        const tempContainer = document.createElement('div');
        tempContainer.innerHTML = navbarHTML;
        
        // Get the navbar element
        const navbarCard = tempContainer.firstElementChild;
        
        // Add the navbar to the appropriate container
        appendNavbarToContainer(navbarCard);
        
        // Set active link in navbar
        setActiveNavLink();
    }
    
    // Add navbar to the appropriate container
    function appendNavbarToContainer(navbar) {
        // Look for a specific navbar container
        let container = document.getElementById('navbar');
        
        // If found, insert the navbar INTO the container
        if (container) {
            console.log('Found navbar container, inserting navbar');
            
            // Clear any existing content in the navbar container
            container.innerHTML = '';
            
            // Append the navbar
            container.appendChild(navbar);
            
            // Log success and position
            console.log('Navbar inserted successfully');
            const rect = navbar.getBoundingClientRect();
            console.log('Navbar position:', rect.top, rect.left, rect.bottom, rect.right);
            return;
        }
        
        // If not found, look for the header container to insert after it
        const headerContainer = document.getElementById('header');
        if (headerContainer) {
            // Insert navbar after the header
            headerContainer.parentNode.insertBefore(navbar, headerContainer.nextSibling);
            console.log('Inserted navbar after header');
            return;
        }
        
        // If specific containers not found, look for the main container
        container = document.querySelector('.container');
        
        if (container) {
            // Insert at the beginning of the container, but after header if it exists
            const headerCard = container.querySelector('.header-card');
            if (headerCard) {
                container.insertBefore(navbar, headerCard.nextSibling);
                console.log('Inserted navbar after header card in container');
            } else {
                container.insertBefore(navbar, container.firstChild);
                console.log('Inserted navbar at beginning of container');
            }
            return;
        }
        
        // Last resort - append to body
        console.log('No suitable container found, appending to body');
        document.body.appendChild(navbar);
    }
    
    // Set the active navigation link based on the current page
    function setActiveNavLink() {
        // Get all navigation links from the navbar
        const navLinks = document.querySelectorAll('.navbar-link');
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
}); 