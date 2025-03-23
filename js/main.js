const distros = ['debian', 'ubuntu', 'fedora', 'arch', 'mint', 'gentoo', 'slackware', 'pureos', 'opensuse', 'manjaro', 'popos', 'elementary', 'zorin', 'kali', 'rocky', 'endeavouros'];

// We'll keep these arrays for reference in case we need them in the future
// but they're no longer used for filtering
const noNetVersions = ['endeavouros', 'elementary', 'gentoo', 'slackware', 'pureos', 'kali', 'zorin', 'rocky', 'manjaro', 'popos'];
const hasNetVersions = ['debian', 'ubuntu', 'fedora', 'opensuse', 'arch'];

// Define popular distros for sorting by popularity (top 5 most widely used)
const popularityRanking = {
    'debian': 1,
    'ubuntu': 2,
    'fedora': 3,
    'arch': 4,
    'mint': 5,
    'opensuse': 6,
    'manjaro': 7, 
    'popos': 8,
    'kali': 9,
    'elementary': 10,
    'zorin': 11,
    'gentoo': 12,
    'endeavouros': 13,
    'rocky': 14,
    'slackware': 15,
    'pureos': 16
};

document.addEventListener('DOMContentLoaded', function() {
    // Initialize variables
    const searchBar = document.getElementById('search-bar');
    const resetButton = document.getElementById('reset-button');
    const versionFilter = document.getElementById('version-filter');
    const layoutButtons = document.querySelectorAll('#layout-toggle .toggle-button');
    const osSection = document.querySelector('.os-sections');
    
    let showOnlyLatest = true;
    let selectedCard = null;
    let currentLayout = 'grid';
    
    // Apply initial layout class
    osSection.classList.add('grid-layout');
    
    // Layout toggle buttons
    layoutButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Update UI state
            layoutButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Get the selected layout
            currentLayout = this.getAttribute('data-value');
            
            // Update class on the os-sections container
            osSection.classList.remove('grid-layout', 'column-layout');
            osSection.classList.add(currentLayout + '-layout');
            
            // Save user preference in localStorage
            localStorage.setItem('preferredLayout', currentLayout);
            
            // Update the footer card's layout
            updateFooterCardLayout();
            
            // Update spacing in all cards based on the new layout
            document.querySelectorAll('.distro-card').forEach(card => {
                const cardContent = card.querySelector('.card-content');
                const infoBar = card.querySelector('.info-bar');
                
                if (currentLayout === 'grid') {
                    // Apply grid-specific spacing
                    if (cardContent) {
                        cardContent.style.marginTop = '0';
                        cardContent.style.paddingTop = '10px';
                    }
                    
                    // Handle info bar spacing if it exists
                    if (infoBar) {
                        infoBar.style.display = 'none';
                        infoBar.style.margin = '0';
                        infoBar.style.padding = '0';
                        infoBar.style.height = '0';
                    }
                } else {
                    // Apply column-specific spacing
                    if (cardContent) {
                        cardContent.style.marginTop = '0';
                        cardContent.style.paddingTop = '10px';
                    }
                    
                    // Reset info bar styles for column layout
                    if (infoBar) {
                        infoBar.style.margin = '0';
                        infoBar.style.padding = '0';
                        infoBar.style.height = '0';
                        infoBar.style.display = 'none';
                    }
                }
            });
        });
    });
    
    // Check if user has a saved layout preference
    const savedLayout = localStorage.getItem('preferredLayout');
    if (savedLayout) {
        // Apply saved layout
        layoutButtons.forEach(btn => {
            if (btn.getAttribute('data-value') === savedLayout) {
                btn.click(); // Trigger the click event on the saved layout button
            }
        });
    }
    
    // Version filter
    versionFilter.addEventListener('change', function() {
        showOnlyLatest = versionFilter.value === 'latest';
        console.log("Version filter changed to:", versionFilter.value, "- showOnlyLatest:", showOnlyLatest);
        
        // Save the current layout state
        const currentLayoutClass = osSection.classList.contains('column-layout') ? 'column-layout' : 'grid-layout';
        
        if (showOnlyLatest) {
            // Remove all version cards when switching to "Latest only"
            console.log("Switching to 'Latest only' mode - removing all version cards");
            distros.forEach(distro => {
                const versionCards = document.querySelectorAll(`[id^="${distro}-"][id$="-card"]:not([id="${distro}-card"])`);
                versionCards.forEach(card => card.remove());
            });
        } else {
            // Create version cards for all distros when switching to "All versions"
            console.log("Switching to 'All versions' mode - adding version cards");
            
            // Fetch data for each distro and create version cards
            const dataPromises = distros.map(distro => {
                return fetch(`distro/${distro}.json`)
                    .then(response => response.json())
                    .catch(err => {
                        console.error(`Error fetching data for ${distro}:`, err);
                        return null;
                    });
            });
            
            Promise.all(dataPromises).then(results => {
                results.forEach((data, index) => {
                    if (data && data.versions && data.versions.length > 1) {
                        createMultipleVersionCards(distros[index], data);
                    }
                });
                
                // Restore layout class
                osSection.classList.remove('grid-layout', 'column-layout');
                osSection.classList.add(currentLayoutClass);
                
                // Re-apply the filter if there's search text
                const searchBar = document.getElementById('search-bar');
                if (searchBar && searchBar.value.trim()) {
                    filterCards(searchBar.value, showOnlyLatest);
                }
            });
        }
    });
    
    // Reset button
    resetButton.addEventListener('click', function() {
        console.log("Reset button clicked");
        
        // Reset UI elements
        searchBar.value = '';
        
        // Reset version filter to "Latest"
        versionFilter.value = 'latest';
        showOnlyLatest = true;
        
        // Remove all version cards
        distros.forEach(distro => {
            const versionCards = document.querySelectorAll(`[id^="${distro}-"][id$="-card"]:not([id="${distro}-card"])`);
            versionCards.forEach(card => card.remove());
        });
        
        // Reset layout toggle to grid
        layoutButtons.forEach(btn => {
            if (btn.getAttribute('data-value') === 'grid') {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        currentLayout = 'grid';
        osSection.classList.remove('grid-layout', 'column-layout');
        osSection.classList.add('grid-layout');
        localStorage.setItem('preferredLayout', 'grid');
        
        // The most reliable way to reset everything is to refresh all cards
        console.log("Complete refresh after reset button");
        refreshAllCards();
        
        // Show all cards
        document.querySelectorAll('.distro-card:not(#disktro-card)').forEach(card => {
            card.style.display = 'flex';
        });
        
        // Clear any no-matches message if it exists
        const noMatchesMessage = document.getElementById('no-matches-message');
        if (noMatchesMessage) {
            noMatchesMessage.style.display = 'none';
        }
    });

    // Initial card load
    refreshAllCards();
    
    console.log("Initial refreshAllCards will verify card availability");

    // Define the filterCards function inside the DOMContentLoaded scope
    // to ensure it has access to all necessary variables
    window.filterCards = function(searchText, showLatest) {
        searchText = searchText.toLowerCase();
        const cards = document.querySelectorAll('.distro-card');
        let visibleCount = 0;
        
        cards.forEach(card => {
            // Skip filtering the disktro-card (footer card)
            if (card.id === 'disktro-card') {
                card.style.display = 'flex';
                return;
            }
            
            const cardName = card.querySelector('.distro-title').textContent.toLowerCase();
            
            // Check if card matches the search text
            const matchesSearch = cardName.includes(searchText);
            
            // Display the card if it matches search criteria
            if (matchesSearch) {
                card.style.display = 'flex';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });
        
        // Show "no matches" message if all cards are hidden
        const noMatchesMessage = document.getElementById('no-matches-message');
        
        if (visibleCount === 0) {
            // Create a message if it doesn't exist
            if (!noMatchesMessage) {
                const message = document.createElement('div');
                message.id = 'no-matches-message';
                message.className = 'no-matches-message';
                message.textContent = 'No matching distros found';
                document.querySelector('.os-sections').appendChild(message);
            } else {
                noMatchesMessage.textContent = 'No matching distros found';
                noMatchesMessage.style.display = 'block';
            }
        } else if (noMatchesMessage) {
            noMatchesMessage.style.display = 'none';
        }
        
        // Always ensure the disktro-card is the last element
        const disktroCard = document.getElementById('disktro-card');
        if (disktroCard) {
            const osSection = document.querySelector('.os-sections');
            osSection.appendChild(disktroCard);
        }
        
        // Debug output
        console.log(`Search: "${searchText}", Visible cards: ${visibleCount}`);
    };
});

// Completely refresh all cards - first remove all cards, then create new ones
function refreshAllCards() {
    // Get the version filter value first before clearing anything
    const versionFilter = document.getElementById('version-filter');
    const showOnlyLatest = versionFilter ? versionFilter.value === 'latest' : true;
    
    console.log("refreshAllCards called with showOnlyLatest:", showOnlyLatest);
    
    // Save the disktro-card if it exists
    const disktroCard = document.getElementById('disktro-card');
    if (disktroCard) {
        disktroCard.remove(); // Remove it but keep the reference
    }
    
    // Save current layout class
    const osSection = document.querySelector('.os-sections');
    const currentLayoutClass = osSection.classList.contains('column-layout') ? 'column-layout' : 'grid-layout';
    
    // Clear the section content
    osSection.innerHTML = '';
    
    // Show a loading indicator
    const loadingMsg = document.createElement('div');
    loadingMsg.className = 'loading-message';
    loadingMsg.textContent = 'Loading distributions...';
    loadingMsg.style.textAlign = 'center';
    loadingMsg.style.padding = '20px';
    loadingMsg.style.color = '#ccc';
    osSection.appendChild(loadingMsg);
    
    // Restore layout class
    osSection.classList.add(currentLayoutClass);
    
    // Create new cards in alphabetical order
    const cardPromises = distros.map(distro => {
        return fetch(`distro/${distro}.json`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error ${response.status} for ${distro}`);
                }
                return response.json();
            })
            .then(distroData => {
                // Validation check
                if (!distroData || typeof distroData !== 'object') {
                    console.error(`Invalid data structure for ${distro}: Not an object`);
                    return { distro, name: distro, data: null };
                }
                if (!distroData.name) {
                    console.error(`Invalid data structure for ${distro}: Missing name property`);
                    return { distro, name: distro, data: null };
                }
                return { distro, name: distroData.name, data: distroData };
            })
            .catch(error => {
                console.error(`Error fetching data for ${distro}:`, error);
                return { distro, name: distro, data: null }; // Fallback to using the distro ID as name
            });
    });

    Promise.all(cardPromises)
        .then(distroInfos => {
            // Remove loading indicator
            osSection.innerHTML = '';
            
            // Reapply layout class after clearing
            osSection.classList.add(currentLayoutClass);
            
            // Filter out any null data entries
            distroInfos = distroInfos.filter(info => info.data !== null);
            
            if (distroInfos.length === 0) {
                const errorMsg = document.createElement('div');
                errorMsg.className = 'error-message';
                errorMsg.textContent = 'No distribution data could be loaded. Please refresh the page to try again.';
                errorMsg.style.padding = '20px';
                errorMsg.style.color = 'red';
                errorMsg.style.textAlign = 'center';
                osSection.appendChild(errorMsg);
                return;
            }
            
            // Sort purely alphabetically by name (case-insensitive)
            distroInfos.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
            
            console.log("Sorted distros:", distroInfos.map(info => info.name));
            
            // First create all cards
            const allCards = document.createDocumentFragment();
            
            // Create main cards first
            distroInfos.forEach(info => {
                try {
                    // Create a basic card structure
                    const card = document.createElement('div');
                    card.id = `${info.distro}-card`;
                    card.className = `distro-card ${info.distro}`;
                    card.setAttribute('data-distro-name', info.name.toLowerCase());
                    card.style.display = 'flex'; // Ensure it's visible
                    
                    // Create card header
                    const header = document.createElement('div');
                    header.className = 'card-header';
                    
                    // Add logo
                    const logo = document.createElement('img');
                    logo.className = 'distro-logo';
                    logo.src = `img/logo-${info.distro}.png`;
                    logo.alt = `${info.name} logo`;
                    
                    // Add title
                    const title = document.createElement('h2');
                    title.className = 'distro-title';
                    title.textContent = info.name;
                    
                    // Create header controls
                    const controls = document.createElement('div');
                    controls.className = 'header-controls';
                    
                    // Add home link
                    const homeLink = document.createElement('a');
                    homeLink.className = 'home-link';
                    homeLink.href = info.data.homePage || '#';
                    homeLink.target = '_blank';
                    homeLink.innerHTML = '🏠';
                    homeLink.setAttribute('data-tooltip', 'Visit homepage');
                    
                    // Add docs link
                    const docsLink = document.createElement('a');
                    docsLink.className = 'docs-link';
                    docsLink.href = info.data.docsPage || (info.data.homePage ? info.data.homePage + '/docs' : '#');
                    docsLink.target = '_blank';
                    docsLink.innerHTML = '📖';
                    docsLink.setAttribute('data-tooltip', 'View documentation');
                    
                    // Add subtitle
                    const subtitle = document.createElement('div');
                    subtitle.className = 'version-subtitle';
                    
                    // Add content area
                    const content = document.createElement('div');
                    content.className = 'card-content';
                    
                    // Add info bar
                    const infoBar = document.createElement('div');
                    infoBar.className = 'info-bar';
                    
                    // Add download section
                    const downloadSection = document.createElement('div');
                    downloadSection.className = 'download-section';
                    
                    // Add download link
                    const osLink = document.createElement('a');
                    osLink.className = 'os-link';
                    osLink.href = '#';
                    osLink.target = '_blank';
                    osLink.textContent = 'Loading...';
                    
                    // Add hash section
                    const hash = document.createElement('div');
                    hash.className = 'hash';
                    
                    // Build the card structure
                    controls.appendChild(homeLink);
                    controls.appendChild(docsLink);
                    header.appendChild(logo);
                    header.appendChild(title);
                    header.appendChild(controls);
                    
                    downloadSection.appendChild(osLink);
                    downloadSection.appendChild(hash);
                    
                    content.appendChild(infoBar);
                    content.appendChild(downloadSection);
                    
                    card.appendChild(header);
                    card.appendChild(subtitle);
                    card.appendChild(content);
                    
                    // Initialize the card with data
                    createCardFromData(info.distro, info.data, card, 0);
                    
                    // Add to fragment
                    allCards.appendChild(card);
                } catch (error) {
                    console.error(`Error creating card for ${info.distro}:`, error);
                }
            });
            
            // Add all main cards to the DOM at once
            osSection.appendChild(allCards);
            
            // Now if showing all versions, add version cards
            if (!showOnlyLatest) {
                // Add version cards
                distroInfos.forEach(info => {
                    try {
                        if (info.data && info.data.versions && info.data.versions.length > 1) {
                            const mainCard = document.getElementById(`${info.distro}-card`);
                            if (!mainCard) {
                                console.warn(`Main card for ${info.distro} not found when adding version cards`);
                                return;
                            }
                            
                            // Add version cards for this distro
                            for (let i = 1; i < info.data.versions.length; i++) {
                                createVersionCard(info.distro, info.data, info.data.versions[i], i, mainCard);
                            }
                        }
                    } catch (error) {
                        console.error(`Error creating version cards for ${info.distro}:`, error);
                    }
                });
                
                // Re-sort all cards to ensure proper order
                sortCardsInDOM();
            }
            
            // Re-add the disktro-card if it existed
            if (disktroCard) {
                osSection.appendChild(disktroCard);
            }
            
            // Add search event listener after cards are loaded
            const searchBar = document.getElementById('search-bar');
            if (searchBar) {
                searchBar.addEventListener('input', function() {
                    filterCards(searchBar.value, showOnlyLatest);
                });
            }
            
            // Make sure all cards are visible
            showAllCards();
            
            // Debug output of visible cards
            const visibleCards = document.querySelectorAll('.distro-card:not(#disktro-card)');
            console.log(`Total cards created: ${visibleCards.length}`);
        })
        .catch(error => {
            console.error("Fatal error loading cards:", error);
            // Show an error message to the user
            const errorMsg = document.createElement('div');
            errorMsg.className = 'error-message';
            errorMsg.textContent = 'Error loading distribution data. Please refresh the page to try again.';
            errorMsg.style.padding = '20px';
            errorMsg.style.color = 'red';
            errorMsg.style.textAlign = 'center';
            osSection.appendChild(errorMsg);
        });
}

// Helper function to create a version card and insert it
function createVersionCard(distro, data, version, versionIndex, mainCard) {
    console.log(`Creating card for ${distro} version ${version.version}`);
    
    // Create a unique ID for this version card
    const versionCardId = `${distro}-${version.version.replace(/\s+/g, '-')}-card`;
    
    // Create subtitle text with version, codeName, and date
    let subtitleText = version.version || "Latest";
    if (version.codeName) {
        subtitleText += ` "${version.codeName}"`;
    }
    if (version.releaseDate) {
        subtitleText += ` • ${version.releaseDate}`;
    }
    
    // Create the card HTML directly
    const cardHTML = `
    <div id="${versionCardId}" class="distro-card ${distro}" data-version="${version.version}" data-distro-name="${data.name.toLowerCase()}">
        <div class="card-header">
            <img class="distro-logo" src="img/logo-${distro}.png" alt="${data.name} logo">
            <h2 class="distro-title">${data.name}</h2>
            <div class="header-controls">
                <a class="home-link" href="${data.homePage}" target="_blank" data-tooltip="Visit homepage">🏠</a>
                <a class="docs-link" href="${data.docsPage || data.homePage + '/docs'}" target="_blank" data-tooltip="View documentation">📖</a>
            </div>
        </div>
        <div class="version-subtitle">${subtitleText}</div>
        <div class="card-content">
            <div class="info-bar" style="display:none; margin:0; padding:0; height:0;"></div>
            <div class="download-section">
                <a class="os-link" href="#" target="_blank">Loading...</a>
                <div class="hash">Loading...</div>
            </div>
        </div>
    </div>`;
    
    // Create a temporary container to hold the HTML
    const temp = document.createElement('div');
    temp.innerHTML = cardHTML.trim();
    const newCard = temp.firstChild;
    
    // Add the card after the main card for this distro
    mainCard.parentNode.insertBefore(newCard, mainCard.nextSibling);
    
    // Update card content with the version data
    createCardFromData(distro, data, newCard, versionIndex);
    
    // Check if the card was added successfully
    const cardInDOM = document.getElementById(versionCardId);
    if (cardInDOM) {
        console.log(`Successfully added card ${versionCardId} to the DOM`);
    } else {
        console.error(`Failed to find card ${versionCardId} in the DOM after adding it!`);
    }
    
    return newCard;
}

// Function to create separate cards for each version - now uses the helper function
function createMultipleVersionCards(distro, data) {
    console.log(`CREATING MULTIPLE VERSION CARDS FOR ${distro} - VERSIONS:`, data.versions ? data.versions.length : 0);
    
    // Main card already exists
    const mainCard = document.getElementById(`${distro}-card`);
    if (!mainCard) {
        console.error(`Main card for ${distro} not found!`);
        return;
    }
    
    console.log(`Main card found:`, mainCard.id);
    
    // Get the OS section
    const osSection = document.querySelector('.os-sections');
    if (!osSection) {
        console.error("OS section not found!");
        return;
    }
    
    // First count existing version cards (for debugging)
    const existingCards = document.querySelectorAll(`[id^="${distro}-"][id$="-card"]:not([id="${distro}-card"])`);
    console.log(`Found ${existingCards.length} existing version cards for ${distro}`);
    
    // Remove existing version cards
    existingCards.forEach(card => {
        console.log("Removing existing version card:", card.id);
        card.remove();
    });
    
    // Skip if no versions or just one version
    if (!data.versions || data.versions.length <= 1) {
        console.log(`No additional versions for ${distro}`);
        return;
    }
    
    // Create version cards for all versions EXCEPT the first one (index 0)
    // The first version is already displayed in the main card
    let cardsCreated = 0;
    
    for (let i = 1; i < data.versions.length; i++) {
        createVersionCard(distro, data, data.versions[i], i, mainCard);
        cardsCreated++;
    }
    
    console.log(`Finished creating ${cardsCreated} version cards for ${distro}`);
    
    // Final validation - count total cards now
    const allVersionCards = document.querySelectorAll(`[id^="${distro}-"][id$="-card"]:not([id="${distro}-card"])`);
    console.log(`Now have ${allVersionCards.length} total version cards for ${distro} in the DOM`);
    
    // Sort all cards to ensure alphabetical order
    sortCardsInDOM();
}

// Helper function to sort all cards in the DOM alphabetically
function sortCardsInDOM() {
    const osSection = document.querySelector('.os-sections');
    const disktroCard = document.getElementById('disktro-card');
    
    // Remove disktro-card temporarily if it exists
    if (disktroCard) {
        disktroCard.remove();
    }
    
    // Get all cards except disktro-card
    const cards = Array.from(osSection.querySelectorAll('.distro-card:not(#disktro-card)'));
    
    // Sort cards by distro name (alphabetically)
    cards.sort((a, b) => {
        const aName = a.querySelector('.distro-title').textContent.toLowerCase();
        const bName = b.querySelector('.distro-title').textContent.toLowerCase();
        
        // First sort by distro name
        const nameCompare = aName.localeCompare(bName);
        if (nameCompare !== 0) return nameCompare;
        
        // If same distro, sort by version - main cards first, then version cards in descending order
        const aIsMain = a.id.endsWith('-card');
        const bIsMain = b.id.endsWith('-card');
        
        if (aIsMain && !bIsMain) return -1;
        if (!aIsMain && bIsMain) return 1;
        
        // Both are version cards of the same distro
        if (!aIsMain && !bIsMain) {
            const aVersion = a.getAttribute('data-version') || '';
            const bVersion = b.getAttribute('data-version') || '';
            return bVersion.localeCompare(aVersion); // Newer versions first
        }
        
        return 0;
    });
    
    // Reinsert cards in sorted order
    cards.forEach(card => osSection.appendChild(card));
    
    // Put disktro-card back at the end
    if (disktroCard) {
        osSection.appendChild(disktroCard);
    }
    
    console.log("Cards sorted alphabetically in DOM");
}

function createCardFromData(distro, data, card, versionIndex = 0) {
    // Store the version index as a data attribute for future reference
    card.setAttribute('data-version-index', versionIndex);
    
    // Set card data attributes
    if (data.versions) {
        const version = data.versions[versionIndex];
        card.setAttribute('data-version', version.version);
    } else if (data.version) {
        card.setAttribute('data-version', data.version);
    }
    
    // Set distro name attribute for sorting
    card.setAttribute('data-distro-name', data.name.toLowerCase());
    
    // Update logo and title
    const logoImg = card.querySelector('.distro-logo');
    const title = card.querySelector('.distro-title');
    logoImg.src = `img/logo-${distro}.png`;
    logoImg.alt = `${data.name} logo`;
    
    // Always use just the distro name for the main title
    title.textContent = data.name;
    
    if (data.versions) {
        // For cards with versions
        const selectedVersion = data.versions[versionIndex];
        updateCardContent(card, data, selectedVersion);
    } else {
        // For distros with single version, create a simplified version object
        const singleVersion = {
            version: data.version || "Latest",
            codeName: data.codeName || "",  // Provide empty string if missing
            releaseDate: data.releaseDate || "",  // Provide empty string if missing
            x86: data.x86 || {},
            arm: data.arm || {}
        };
        
        updateCardContent(card, data, singleVersion);
    }
}

function updateCardContent(card, data, selectedVersion) {
    console.log(`Updating card content for ${data.name}, version: ${selectedVersion.version || 'Unknown'}`);
    
    // Update common fields
    card.querySelector('.distro-title').textContent = data.name;
    
    // Add version and date as a subtitle, positioned between card header and card content
    let versionSubtitle = card.querySelector('.version-subtitle');
    if (!versionSubtitle) {
        versionSubtitle = document.createElement('div');
        versionSubtitle.className = 'version-subtitle';
        
        // Insert after the card header and before the card content
        const cardHeader = card.querySelector('.card-header');
        const cardContent = card.querySelector('.card-content');
        card.insertBefore(versionSubtitle, cardContent);
    }
    
    // Create subtitle text with version, codeName, and date (if available)
    let subtitleText = selectedVersion.version || "Latest";
    
    // Add code name to subtitle if available
    if (selectedVersion.codeName) {
        subtitleText += ` "${selectedVersion.codeName}"`;
    }
    
    // Add release date to subtitle if available
    if (selectedVersion.releaseDate) {
        subtitleText += ` • ${selectedVersion.releaseDate}`;
    }
    
    versionSubtitle.textContent = subtitleText;
    versionSubtitle.style.display = 'block';
    
    // Set data attribute for version (used in filtering)
    if (selectedVersion.version) {
        card.setAttribute('data-version', selectedVersion.version);
    }
    
    // Set up the home link icon
    let headerControls = card.querySelector('.header-controls');
    if (!headerControls) {
        headerControls = document.createElement('div');
        headerControls.className = 'header-controls';
        card.querySelector('.card-header').appendChild(headerControls);
    } else {
        headerControls.innerHTML = '';
    }
    
    // Add home link icon
    const homeLink = document.createElement('a');
    homeLink.className = 'home-link';
    homeLink.href = data.homePage || '#';
    homeLink.target = '_blank';
    homeLink.innerHTML = '🏠';
    homeLink.setAttribute('data-tooltip', 'Visit homepage');
    headerControls.appendChild(homeLink);
    
    // Add documentation link icon
    const docsLink = document.createElement('a');
    docsLink.className = 'docs-link';
    docsLink.href = data.docsPage || (data.homePage ? data.homePage + '/docs' : '#');
    docsLink.target = '_blank';
    docsLink.innerHTML = '📖';
    docsLink.setAttribute('data-tooltip', 'View documentation');
    headerControls.appendChild(docsLink);
    
    // Add hover event listeners for tooltips
    addQuickTooltip(homeLink);
    addQuickTooltip(docsLink);
    
    // Create or clear the info bar - but now hide it since we're showing the info in the subtitle
    let infoBar = card.querySelector('.info-bar');
    if (!infoBar) {
        infoBar = document.createElement('div');
        infoBar.className = 'info-bar';
        
        // Get the card content element
        const cardContent = card.querySelector('.card-content');
        
        // Insert at the beginning of card content
        if (cardContent && cardContent.firstChild) {
            cardContent.insertBefore(infoBar, cardContent.firstChild);
        } else if (cardContent) {
            cardContent.appendChild(infoBar);
        }
    } else {
        infoBar.innerHTML = '';
    }
    
    // Always hide the info bar now that we've moved the information to the subtitle
    infoBar.style.display = 'none';
    infoBar.style.margin = '0';
    infoBar.style.padding = '0';
    infoBar.style.height = '0';
        
    // Adjust content spacing - use positive padding instead of negative margin
    const cardContent = card.querySelector('.card-content');
    if (cardContent) {
        cardContent.style.marginTop = '0'; // Remove negative margin
        cardContent.style.paddingTop = '10px'; // Add padding instead
    }
    
    // Debug output
    console.log('Version data structure:', selectedVersion);
    
    // Check for download information in the JSON with case-insensitive key handling
    let downloadInfo = null;
    
    // Try all possible architecture and type combinations to find any valid download
    const archKeys = ['x86', 'X86', 'arm', 'ARM'];
    const typeKeys = ['FULL', 'full', 'NET', 'net'];
    
    // Check in priority order
    for (const arch of archKeys) {
        if (!selectedVersion[arch]) continue;
        
        for (const type of typeKeys) {
            if (selectedVersion[arch][type]) {
                downloadInfo = selectedVersion[arch][type];
                console.log(`Found download info for ${arch}.${type}:`, downloadInfo);
                break;
            }
        }
        
        if (downloadInfo) break; // Exit if we found info
    }
    
    // Always make card visible and show a message if no download is available
    if (!downloadInfo) {
        console.warn(`No download info found for ${data.name} ${selectedVersion.version || 'unknown version'}`);
        
        // Make sure the card is visible despite no download info
        card.style.display = 'flex';
        
        // Update with a placeholder message
        const downloadLink = card.querySelector('.os-link');
        downloadLink.textContent = 'No download available';
        downloadLink.href = '#';
        downloadLink.removeAttribute('download');
        
        const hashElement = card.querySelector('.hash');
        hashElement.textContent = '';
    } else {
        // Make sure the card is visible
        card.style.display = 'flex';
        
        // Update download link
        updateDownloadLinkElement(card, downloadInfo);
        
        // Update hash information
        updateHashElement(card, downloadInfo);
    }
}

function updateHashElement(card, distroData) {
    const hashElement = card.querySelector('.hash');
    
    if (distroData.sha256) {
        hashElement.textContent = `SHA256: ${distroData.sha256}`;
        
        // Add copy to clipboard functionality
        hashElement.addEventListener('click', function() {
            const text = distroData.sha256;
            navigator.clipboard.writeText(text)
                .then(() => {
                    // Show temporary tooltip
                    const tooltip = document.createElement('span');
                    tooltip.className = 'tooltip';
                    tooltip.textContent = 'Copied to clipboard!';
                    hashElement.appendChild(tooltip);
                    
                    // Remove tooltip after delay
                    setTimeout(() => {
                        tooltip.classList.add('fade-out');
                        setTimeout(() => {
                            tooltip.remove();
                        }, 500);
                    }, 1500);
                })
                .catch(err => {
                    console.error('Failed to copy text: ', err);
                });
        });
    } else {
        hashElement.textContent = '';
    }
}

function updateDownloadLinkElement(card, distroData) {
    // Update download link
    const downloadLink = card.querySelector('.os-link');
    
    if (distroData.downloadLink && distroData.size) {
        const fileName = distroData.downloadLink.split('/').pop();
        downloadLink.textContent = `Download ${distroData.size}`;
        downloadLink.href = distroData.downloadLink;
        downloadLink.setAttribute('download', fileName);
    } else {
        downloadLink.textContent = 'Download';
        downloadLink.href = distroData.downloadLink || '';
        downloadLink.removeAttribute('download');
    }
}

function showAllCards() {
    const cards = document.querySelectorAll('.distro-card');
    let visibleCount = 0;
    
    cards.forEach(card => {
        // Skip the footer card
        if (card.id === 'disktro-card') {
            card.style.display = 'flex';
            return;
        }
        
        card.style.display = 'flex';
        visibleCount++;
    });
    
    // Hide any no matches message
    const noMatchesElement = document.getElementById('no-matches-message');
    if (noMatchesElement) {
        noMatchesElement.style.display = 'none';
    }
    
    console.log(`showAllCards: ${visibleCount} visible cards`);
}

function addQuickTooltip(element) {
    element.addEventListener('mouseenter', function() {
        // Remove any existing tooltips
        const existingTooltip = this.querySelector('.quick-tooltip');
        if (existingTooltip) {
            existingTooltip.remove();
        }
        
        // Create and add tooltip
        const tooltip = document.createElement('span');
        tooltip.className = 'quick-tooltip';
        tooltip.textContent = this.getAttribute('data-tooltip');
        this.appendChild(tooltip);
    });
    
    element.addEventListener('mouseleave', function() {
        // Remove tooltip on mouse leave
        const tooltip = this.querySelector('.quick-tooltip');
        if (tooltip) {
            tooltip.remove();
        }
    });
}

// Update the footer card's styling based on current layout
function updateFooterCardLayout() {
    const footerCard = document.getElementById('disktro-card');
    if (footerCard) {
        const osSection = document.querySelector('.os-sections');
        // Apply specific styles based on layout
        if (osSection.classList.contains('column-layout')) {
            footerCard.style.width = '100%';
            footerCard.style.maxWidth = '100%';
            // Additional column-specific styles if needed
        } else {
            // Reset to default grid styles
            footerCard.style.width = '100%';
            footerCard.style.maxWidth = '';
        }
    }
}