// Guides Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the page
    init();
    
    // Add event listeners
    bindEventListeners();
});

// Initialize the page
function init() {
    // Placeholder for future functionality
    console.log('Guides page initialized');
}

// Bind event listeners
function bindEventListeners() {
    // Add click event to all guide buttons
    const guideButtons = document.querySelectorAll('.guide-button');
    guideButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Currently all guide links are placeholders
            e.preventDefault();
            alert('This guide is coming soon! Check back later for the full content.');
        });
    });
    
    // Add click event to the request button
    const requestButton = document.querySelector('.request-button');
    if (requestButton) {
        requestButton.addEventListener('click', function(e) {
            e.preventDefault();
            alert('Guide request functionality coming soon! In the meantime, you can check our existing guides.');
        });
    }
    
    // Future functionality could include:
    // - Filtering guides by difficulty level
    // - Searching for guides
    // - Sorting guides by popularity or date
    // - Showing/hiding guide details
}

// Future functions:

// Function to filter guides by difficulty
function filterByDifficulty(difficulty) {
    const guideCards = document.querySelectorAll('.guide-card');
    
    guideCards.forEach(card => {
        const cardDifficulty = card.querySelector('.difficulty');
        
        if (difficulty === 'all' || cardDifficulty.classList.contains(difficulty)) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
}

// Function to search guides
function searchGuides(searchTerm) {
    const guideCards = document.querySelectorAll('.guide-card');
    searchTerm = searchTerm.toLowerCase();
    
    guideCards.forEach(card => {
        const title = card.querySelector('h4').textContent.toLowerCase();
        const description = card.querySelector('.guide-preview p').textContent.toLowerCase();
        
        if (title.includes(searchTerm) || description.includes(searchTerm)) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
}

// Function to load a guide
function loadGuide(guideId) {
    // This would fetch the guide content from the server
    // and display it in a modal or navigate to the guide page
    console.log(`Loading guide: ${guideId}`);
}

// For future implementation: track which guides are most viewed
function trackGuideView(guideId) {
    console.log(`Guide viewed: ${guideId}`);
    // This would send analytics data to track popular guides
} 