// Comparison functionality for Linux distributions
document.addEventListener('DOMContentLoaded', function() {
    // Get references to DOM elements
    const distro1Select = document.getElementById('distro1');
    const distro2Select = document.getElementById('distro2');
    const compareButton = document.getElementById('compare-button');
    const presetButtons = document.querySelectorAll('.preset-button');
    const comparisonResults = document.getElementById('comparison-results');
    
    // Populate the select dropdowns with options from distro-data
    function populateDropdowns() {
        // Check if distroData exists
        if (!window.distroData) {
            console.error('Distro data not found. Make sure distro-data.js is loaded properly.');
            return;
        }
        
        // Clear existing options
        distro1Select.innerHTML = '<option value="">Select a distribution</option>';
        distro2Select.innerHTML = '<option value="">Select a distribution</option>';
        
        // Get distro keys and sort them alphabetically
        const distroKeys = Object.keys(window.distroData).sort((a, b) => {
            return window.distroData[a].name.localeCompare(window.distroData[b].name);
        });
        
        // Add options to the dropdowns
        distroKeys.forEach(key => {
            const distro = window.distroData[key];
            const option1 = document.createElement('option');
            const option2 = document.createElement('option');
            
            option1.value = key;
            option1.textContent = distro.name;
            
            option2.value = key;
            option2.textContent = distro.name;
            
            distro1Select.appendChild(option1);
            distro2Select.appendChild(option2);
        });
    }
    
    // Compare button action
    compareButton.addEventListener('click', function() {
        performComparison();
    });
    
    // Handle form submission (prevent default and trigger comparison)
    const compareForm = document.querySelector('#comparison-form');
    if (compareForm) {
        compareForm.addEventListener('submit', function(e) {
            e.preventDefault();
            performComparison();
        });
    }
    
    // Update preset button active state based on current selection
    function updatePresetButtonActiveState() {
        const distro1 = distro1Select.value;
        const distro2 = distro2Select.value;
        
        // Remove active class from all preset buttons
        presetButtons.forEach(button => {
            button.classList.remove('active');
            
            // Add active class if this button matches the current selection
            const buttonDistro1 = button.getAttribute('data-distro1');
            const buttonDistro2 = button.getAttribute('data-distro2');
            
            if ((buttonDistro1 === distro1 && buttonDistro2 === distro2) || 
                (buttonDistro1 === distro2 && buttonDistro2 === distro1)) {
                button.classList.add('active');
            }
        });
    }
    
    // Preset comparison buttons
    presetButtons.forEach(button => {
        button.addEventListener('click', function() {
            const distro1 = this.getAttribute('data-distro1');
            const distro2 = this.getAttribute('data-distro2');
            
            if (!distro1 || !distro2) {
                console.error('Missing data attributes for preset button');
                return;
            }
            
            distro1Select.value = distro1;
            distro2Select.value = distro2;
            
            // Add active class to this button
            presetButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            performComparison();
        });
    });
    
    // Listen for changes on select dropdowns to update active preset button
    distro1Select.addEventListener('change', updatePresetButtonActiveState);
    distro2Select.addEventListener('change', updatePresetButtonActiveState);
    
    function performComparison() {
        const distro1 = distro1Select.value;
        const distro2 = distro2Select.value;
        
        if (distro1 === "" || distro2 === "") {
            comparisonResults.innerHTML = `
                <div class="card-header">
                    <h2 class="distro-title">Comparison Results</h2>
                </div>
                <div class="version-subtitle">Error</div>
                <div class="card-content">
                    <div class="error-message">
                        <p>Please select two distributions to compare.</p>
                    </div>
                </div>
            `;
            return;
        }
        
        if (distro1 === distro2) {
            comparisonResults.innerHTML = `
                <div class="card-header">
                    <h2 class="distro-title">Comparison Results</h2>
                </div>
                <div class="version-subtitle">Error</div>
                <div class="card-content">
                    <div class="error-message">
                        <p>Please select two different distributions to compare.</p>
                    </div>
                </div>
            `;
            return;
        }
        
        // Check if distroData exists and has the selected distributions
        if (!window.distroData) {
            comparisonResults.innerHTML = `
                <div class="card-header">
                    <h2 class="distro-title">Comparison Results</h2>
                </div>
                <div class="version-subtitle">Error</div>
                <div class="card-content">
                    <div class="error-message">
                        <p>Distribution data is not available. Please make sure distro-data.js is loaded properly.</p>
                    </div>
                </div>
            `;
            return;
        }
        
        const data1 = window.distroData[distro1];
        const data2 = window.distroData[distro2];
        
        if (!data1 || !data2) {
            comparisonResults.innerHTML = `
                <div class="card-header">
                    <h2 class="distro-title">Comparison Results</h2>
                </div>
                <div class="version-subtitle">Error</div>
                <div class="card-content">
                    <div class="error-message">
                        <p>Data for one or both selected distributions is not available.</p>
                    </div>
                </div>
            `;
            return;
        }
        
        // Update theme color based on first selected distro
        if (typeof updateCircleColors === 'function') {
            updateCircleColors(distro1);
        } else if (typeof distroColors !== 'undefined' && distroColors[distro1]) {
            // Fallback to distroColors if available
            document.documentElement.style.setProperty('--circle-primary-color', distroColors[distro1].primary);
            document.documentElement.style.setProperty('--circle-primary-color-rgb', 
                distroColors[distro1].secondary || '212, 175, 55');
        }
        
        // Update active preset button
        updatePresetButtonActiveState();
        
        // Scroll to results
        setTimeout(() => {
            comparisonResults.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
        
        // Generate comparison HTML
        comparisonResults.innerHTML = `
            <div class="card-header">
                <h2 class="distro-title">Comparison Results</h2>
            </div>
            <div class="version-subtitle">${data1.name} vs ${data2.name}</div>
            <div class="card-content">
                ${generateComparisonHTML(data1, data2)}
            </div>
        `;
    }
    
    function generateComparisonHTML(data1, data2) {
        // Handle missing properties safely with fallbacks
        const renderList = (items) => {
            if (!items || !Array.isArray(items) || items.length === 0) {
                return '<li>No data available</li>';
            }
            return items.map(item => `<li>${item}</li>`).join('');
        };
        
        // Safely get property or use fallback
        const get = (obj, prop, fallback = 'Not specified') => {
            return obj && obj[prop] ? obj[prop] : fallback;
        };
        
        // Safely get image path
        const getLogoPath = (distroId) => {
            return `img/logo-${distroId}.png`;
        };
        
        return `
            <div class="comparison-header">
                <div class="distro-logos">
                    <div class="distro-logo-container">
                        <img src="${getLogoPath(data1.id)}" alt="${get(data1, 'name')} logo" class="comparison-logo" onerror="this.src='img/disktro-logo.png'">
                        <h3>${get(data1, 'name')}</h3>
                    </div>
                    <div class="versus-divider">VS</div>
                    <div class="distro-logo-container">
                        <img src="${getLogoPath(data2.id)}" alt="${get(data2, 'name')} logo" class="comparison-logo" onerror="this.src='img/disktro-logo.png'">
                        <h3>${get(data2, 'name')}</h3>
                    </div>
                </div>
            </div>
            
            <!-- Overview Section -->
            <div class="comparison-section">
                <h2 class="section-title">Overview</h2>
                <div class="comparison-flex-container">
                    <div class="distro-details">
                        <p>${get(data1, 'description')}</p>
                    </div>
                    <div class="distro-details">
                        <p>${get(data2, 'description')}</p>
                    </div>
                </div>
            </div>
            
            <!-- Technical Specifications -->
            <div class="comparison-section">
                <h2 class="section-title">Technical Specifications</h2>
                <table class="comparison-table">
                    <tr>
                        <th>Feature</th>
                        <th>${get(data1, 'name')}</th>
                        <th>${get(data2, 'name')}</th>
                    </tr>
                    <tr>
                        <td>Based On</td>
                        <td>${get(data1, 'base')}</td>
                        <td>${get(data2, 'base')}</td>
                    </tr>
                    <tr>
                        <td>Package Manager</td>
                        <td>${get(data1, 'package_manager')}</td>
                        <td>${get(data2, 'package_manager')}</td>
                    </tr>
                    <tr>
                        <td>Release Model</td>
                        <td>${get(data1, 'release_model')}</td>
                        <td>${get(data2, 'release_model')}</td>
                    </tr>
                    <tr>
                        <td>Default Desktop</td>
                        <td>${get(data1, 'desktop')}</td>
                        <td>${get(data2, 'desktop')}</td>
                    </tr>
                    <tr>
                        <td>Difficulty Level</td>
                        <td>${get(data1, 'difficulty')}</td>
                        <td>${get(data2, 'difficulty')}</td>
                    </tr>
                    <tr>
                        <td>Stability vs. Cutting Edge</td>
                        <td>${get(data1, 'stability')}</td>
                        <td>${get(data2, 'stability')}</td>
                    </tr>
                    <tr>
                        <td>System Requirements</td>
                        <td>${get(data1, 'system_requirements')}</td>
                        <td>${get(data2, 'system_requirements')}</td>
                    </tr>
                </table>
            </div>
            
            <!-- Strengths Section -->
            <div class="comparison-section">
                <h2 class="section-title">Key Strengths</h2>
                <div class="comparison-flex-container">
                    <div class="distro-details">
                        <h3 class="distro-name">${get(data1, 'name')} Strengths</h3>
                        <ul class="distro-list">
                            ${renderList(data1.strengths)}
                        </ul>
                    </div>
                    
                    <div class="distro-details">
                        <h3 class="distro-name">${get(data2, 'name')} Strengths</h3>
                        <ul class="distro-list">
                            ${renderList(data2.strengths)}
                        </ul>
                    </div>
                </div>
            </div>
            
            <!-- Weaknesses Section -->
            <div class="comparison-section">
                <h2 class="section-title">Potential Weaknesses</h2>
                <div class="comparison-flex-container">
                    <div class="distro-details">
                        <h3 class="distro-name">${get(data1, 'name')} Weaknesses</h3>
                        <ul class="distro-list">
                            ${renderList(data1.weaknesses)}
                        </ul>
                    </div>
                    
                    <div class="distro-details">
                        <h3 class="distro-name">${get(data2, 'name')} Weaknesses</h3>
                        <ul class="distro-list">
                            ${renderList(data2.weaknesses)}
                        </ul>
                    </div>
                </div>
            </div>
            
            <!-- Best For Section -->
            <div class="comparison-section">
                <h2 class="section-title">Best For</h2>
                <div class="comparison-flex-container">
                    <div class="distro-details">
                        <h3 class="distro-name">${get(data1, 'name')} is Best For</h3>
                        <ul class="distro-list">
                            ${renderList(data1.use_cases)}
                        </ul>
                    </div>
                    
                    <div class="distro-details">
                        <h3 class="distro-name">${get(data2, 'name')} is Best For</h3>
                        <ul class="distro-list">
                            ${renderList(data2.use_cases)}
                        </ul>
                    </div>
                </div>
            </div>
            
            <div class="comparison-conclusion">
                <p>Ready to try one of these distributions? Head to the <a href="index.html">main page</a> to download, or check out our <a href="getting-started.html">Getting Started guide</a> for installation help.</p>
            </div>
        `;
    }
    
    // Initialize the page
    populateDropdowns();
    
    // Check for URL parameters to auto-select distributions
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const distro1Param = urlParams.get('distro1');
        const distro2Param = urlParams.get('distro2');
        
        if (distro1Param && distro2Param) {
            distro1Select.value = distro1Param;
            distro2Select.value = distro2Param;
            
            // If both values were set successfully, perform comparison
            if (distro1Select.value === distro1Param && distro2Select.value === distro2Param) {
                performComparison();
            }
        }
    } catch (e) {
        console.error('Error processing URL parameters:', e);
    }
}); 