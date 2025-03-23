fetch('elements/footer.html')
    .then(response => response.text())
    .then(data => {
        // Add the footer card as the last card in the OS sections
        document.querySelector('.os-sections').insertAdjacentHTML('beforeend', data);
        
        // Hide the original footer div since we don't need it anymore
        document.getElementById('footer').style.display = 'none';
    });