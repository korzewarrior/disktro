// Defer adding the footer card until after all distro cards are loaded
// We'll use a small delay to ensure the distro cards are rendered first
document.addEventListener('DOMContentLoaded', function() {
    // Wait for the main.js to finish loading all cards
    setTimeout(function() {
        fetch('elements/footer.html')
            .then(response => response.text())
            .then(data => {
                // Add the footer card as the last card in the OS sections
                document.querySelector('.os-sections').insertAdjacentHTML('beforeend', data);
                
                // Hide the original footer div since we don't need it anymore
                document.getElementById('footer').style.display = 'none';
            });
    }, 1000); // 1 second delay to ensure distro cards are loaded
});