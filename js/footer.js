// Add a simple info card at the bottom of the distro list
document.addEventListener('DOMContentLoaded', function() {
    // Create the footer card initially
    createFooterCard();
    
    // Add event listener to recreate the footer card when the version filter changes
    const versionFilter = document.getElementById('version-filter');
    if (versionFilter) {
        versionFilter.addEventListener('change', function() {
            // Use setTimeout to ensure this runs after refreshAllCards completes
            setTimeout(createFooterCard, 500);
        });
    }
    
    // Function to create the footer card
    function createFooterCard() {
        // Only create if it doesn't already exist
        if (!document.getElementById('disktro-card')) {
            // Create a new card element just like the other distro cards
            const infoCard = document.createElement('div');
            infoCard.id = 'disktro-card';
            infoCard.className = 'distro-card';
            
            // Count the total number of distros
            const distroCount = window.distros ? window.distros.length : 16;
            
            infoCard.innerHTML = `
                <div class="card-header">
                    <img src="img/disktro-logo.png" alt="Disktro logo" class="distro-logo">
                    <h2 class="distro-title">Disktro | ISO Library</h2>
                    <div class="header-controls">
                        <a href="https://github.com/disktro/disktro" target="_blank" class="home-link" data-tooltip="View source on GitHub">🏠</a>
                        <a href="https://github.com/disktro/disktro/issues" target="_blank" class="docs-link" data-tooltip="Report an issue">❓</a>
                    </div>
                </div>
                <div class="version-subtitle">Find and download your perfect Linux distribution</div>
                <div class="card-content">
                    <div class="info-bar" style="display:none; margin:0; padding:0; height:0;"></div>
                    <div class="footer-info" style="display: flex; flex-wrap: wrap; gap: 20px; margin-bottom: 15px;">
                        <div style="flex: 1; min-width: 200px;">
                            <p style="margin: 0 0 8px 0; color: #aaa; font-size: 14px;">Currently tracking ${distroCount} distributions</p>
                            <p style="margin: 0 0 8px 0; color: #aaa; font-size: 14px;">Powered by the open-source community</p>
                        </div>
                        <div style="flex: 1; min-width: 200px;">
                            <p style="margin: 0 0 8px 0; color: #aaa; font-size: 14px;">Made with ❤️ for Linux users everywhere</p>
                            <p style="margin: 0 0 8px 0; color: #aaa; font-size: 14px;">All logos belong to their respective projects</p>
                        </div>
                    </div>
                    <div class="hash" style="cursor: default; text-align: center; background-color: transparent; border: none;">
                        © ${new Date().getFullYear()} Disktro — Helping you find your perfect distro
                    </div>
                </div>
            `;
            
            // Append it to the OS sections
            document.querySelector('.os-sections').appendChild(infoCard);
            
            // Apply the proper layout styling based on current view mode
            if (typeof updateFooterCardLayout === 'function') {
                updateFooterCardLayout();
            }
            
            // Add tooltip functionality to the footer links
            const footerHomeLink = infoCard.querySelector('.home-link');
            const footerDocsLink = infoCard.querySelector('.docs-link');
            
            if (typeof addQuickTooltip === 'function') {
                addQuickTooltip(footerHomeLink);
                addQuickTooltip(footerDocsLink);
            } else {
                // Fallback if addQuickTooltip function isn't available yet
                footerHomeLink.addEventListener('mouseenter', function() {
                    const tooltip = document.createElement('span');
                    tooltip.className = 'quick-tooltip';
                    tooltip.textContent = this.getAttribute('data-tooltip');
                    this.appendChild(tooltip);
                });
                
                footerHomeLink.addEventListener('mouseleave', function() {
                    const tooltip = this.querySelector('.quick-tooltip');
                    if (tooltip) tooltip.remove();
                });
                
                footerDocsLink.addEventListener('mouseenter', function() {
                    const tooltip = document.createElement('span');
                    tooltip.className = 'quick-tooltip';
                    tooltip.textContent = this.getAttribute('data-tooltip');
                    this.appendChild(tooltip);
                });
                
                footerDocsLink.addEventListener('mouseleave', function() {
                    const tooltip = this.querySelector('.quick-tooltip');
                    if (tooltip) tooltip.remove();
                });
            }
            
            // Hide the original footer div
            const originalFooter = document.getElementById('footer');
            if (originalFooter) {
                originalFooter.style.display = 'none';
            }
            
            console.log('Footer card created');
        } else {
            // Ensure the footer card is always at the end
            const disktroCard = document.getElementById('disktro-card');
            const osSection = document.querySelector('.os-sections');
            osSection.appendChild(disktroCard);
            console.log('Footer card repositioned');
        }
    }
});