// Resources Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the page
    init();
    
    // Add event listeners
    bindEventListeners();
});

// Initialize the page
function init() {
    console.log('Resources page initialized');
    
    // Check if we have resource categories in URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    
    if (category) {
        scrollToCategory(category);
    }
}

// Scroll to specific category
function scrollToCategory(categoryName) {
    // Find the section header with the matching text
    const sections = document.querySelectorAll('.section-header h3');
    
    for (const section of sections) {
        if (section.textContent.toLowerCase().includes(categoryName.toLowerCase())) {
            const parentSection = section.closest('.resource-section');
            if (parentSection) {
                // Scroll to the section with a small offset for better visibility
                const yOffset = -80; 
                const y = parentSection.getBoundingClientRect().top + window.pageYOffset + yOffset;
                
                window.scrollTo({top: y, behavior: 'smooth'});
                
                // Highlight the section briefly
                parentSection.classList.add('highlight-section');
                setTimeout(() => {
                    parentSection.classList.remove('highlight-section');
                }, 2000);
                
                break;
            }
        }
    }
}

// Bind event listeners
function bindEventListeners() {
    // Add event listener for suggest button
    const suggestButton = document.querySelector('.suggest-button');
    if (suggestButton) {
        suggestButton.addEventListener('click', function(e) {
            e.preventDefault();
            
            // In a real implementation, this would open a form modal
            // For now, just show an alert
            alert('Resource suggestion functionality coming soon! Thanks for your interest in contributing to our resource collection.');
        });
    }
    
    // Add event listeners for filter buttons
    const filterButtons = document.querySelectorAll('.filter-button');
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get the filter value
            const filterValue = this.getAttribute('data-filter');
            
            // Filter the resources
            filterResources(filterValue);
        });
    });
    
    // Make resource cards more interactive
    const resourceCards = document.querySelectorAll('.resource-card');
    resourceCards.forEach(card => {
        // Add hover effect classes
        card.addEventListener('mouseenter', function() {
            this.classList.add('card-hover');
        });
        
        card.addEventListener('mouseleave', function() {
            this.classList.remove('card-hover');
        });
        
        // Make the entire card clickable (optional)
        card.addEventListener('click', function(e) {
            // Only trigger if the click wasn't on the link itself
            if (!e.target.closest('.resource-link')) {
                const link = this.querySelector('.resource-link');
                if (link) {
                    // Open in new tab if it has target="_blank"
                    if (link.getAttribute('target') === '_blank') {
                        window.open(link.href, '_blank');
                    } else {
                        window.location.href = link.href;
                    }
                }
            }
        });
    });
}

// Function to filter resources by type
function filterResources(type) {
    const resourceSections = document.querySelectorAll('.resource-section');
    
    if (type === 'all') {
        // Show all sections
        resourceSections.forEach(section => {
            section.style.display = 'block';
        });
    } else {
        // Show only sections that match the type
        resourceSections.forEach(section => {
            const sectionTitle = section.querySelector('.section-header h3').textContent.toLowerCase();
            
            // Create a mapping of filter types to keywords
            const filterMap = {
                'documentation': ['documentation', 'docs', 'wiki'],
                'learning': ['learning', 'education', 'tutorial', 'course'],
                'community': ['community', 'forum', 'users'],
                'news': ['news', 'information'],
                'tools': ['tools', 'utilities'],
                'books': ['books', 'publications']
            };
            
            // Check if any keywords match the section title
            const keywords = filterMap[type] || [type];
            const matches = keywords.some(keyword => sectionTitle.includes(keyword));
            
            if (matches) {
                section.style.display = 'block';
                
                // Add a subtle highlight effect
                section.classList.add('highlight-section');
                setTimeout(() => {
                    section.classList.remove('highlight-section');
                }, 1000);
            } else {
                section.style.display = 'none';
            }
        });
    }
}

// Function to add a new resource (for future implementation)
function addResource(resourceData) {
    // This would be used with a form submission
    console.log('New resource suggestion:', resourceData);
    
    // In a real implementation, this would send the data to a server
    // or store it locally, and potentially add it to the DOM
} 