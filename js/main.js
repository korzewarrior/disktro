const distros = ['debian', 'ubuntu', 'fedora', 'arch', 'mint', 'gentoo', 'slackware', 'pureos'];

document.addEventListener('DOMContentLoaded', function() {
    fetch('elements/toggle.html')
    .then(response => response.text())
    .then(data => {
        const container = document.querySelector('.button-container');
        container.insertAdjacentHTML('beforeend', data);
        const resetButton = document.getElementById('reset-button');
        container.appendChild(resetButton);
        document.querySelectorAll('.toggle-button').forEach(button => {
            button.addEventListener('click', function() {
                this.parentNode.querySelectorAll('.toggle-button').forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                updateAllCards();
            });
        });
    });

    const cardPromises = distros.map(distro => {
        return fetch('elements/card.html')
            .then(response => response.text())
            .then(data => {
                const cardHtml = data.replace(/{distro}/g, distro);
                document.querySelector('.os-sections').innerHTML += cardHtml;
                document.getElementById(`${distro}-card`).classList.add(distro);
                return distro;
            })
            .then(updateInfo);
    });

    Promise.all(cardPromises).then(updateAllCards);
});

function updateAllCards() {
    distros.forEach(updateInfo);
}

function updateInfo(distro) {
    const card = document.getElementById(`${distro}-card`);
    const archToggle = document.querySelector('.arch-toggle.active');
    const typeToggle = document.querySelector('.type-toggle.active');

    const arch = archToggle.textContent === 'ARM' ? 'ARM' : 'x86';
    const type = typeToggle.textContent === 'Full' ? 'FULL' : 'NET';

    fetch(`distro/${distro}.json`)
        .then(response => response.json())
        .then(data => {
            if (data.versions && Array.isArray(data.versions)) {
                let versionSelector = card.querySelector('.version-selector');
                if (!versionSelector) {
                    versionSelector = document.createElement('select');
                    versionSelector.className = 'version-selector';
                    versionSelector.addEventListener('change', function() {
                        updateCardContent(card, data, this.value, arch, type);
                    });
                    
                    const cardHeader = card.querySelector('.card-header');
                    cardHeader.insertAdjacentElement('afterend', versionSelector);
                } else {
                    versionSelector.innerHTML = '';
                }
                
                data.versions.forEach(version => {
                    const option = document.createElement('option');
                    option.value = version.version;
                    option.textContent = `${version.version} "${version.codeName}"`;
                    versionSelector.appendChild(option);
                });
                
                if (data.currentVersion) {
                    versionSelector.value = data.currentVersion;
                }
                
                updateCardContent(card, data, versionSelector.value, arch, type);
            } else {
                const distroData = data[arch][type];
                updateCardContentLegacy(card, data, distroData);
            }
        })
        .catch(error => console.error('Error:', error));
}

function updateCardContent(card, data, selectedVersion, arch, type) {
    const versionData = data.versions.find(v => v.version === selectedVersion);
    if (!versionData) {
        console.error(`Version ${selectedVersion} not found for ${data.name}`);
        return;
    }
    
    const distroData = versionData[arch] && versionData[arch][type] ? versionData[arch][type] : null;
    if (!distroData) {
        console.warn(`No ${arch}/${type} data available for ${data.name} version ${selectedVersion}`);
        card.classList.add('unavailable');
        return;
    }
    
    card.classList.remove('unavailable');
    
    card.querySelector('h2').textContent = `${data.name} ${versionData.version} - ${arch} - ${type}`;
    
    const codeNameElement = card.querySelector('.code-name');
    if (versionData.codeName === "") {
        codeNameElement.classList.add('hidden');
    } else {
        codeNameElement.textContent = `"${versionData.codeName}"`;
        codeNameElement.classList.remove('hidden');
    }
    
    const dateElement = card.querySelector('.date');
    if (versionData.releaseDate === "") {
        dateElement.classList.add('hidden');
    } else {
        dateElement.textContent = `Release Date: ${versionData.releaseDate}`;
        dateElement.classList.remove('hidden');
    }
    
    const homePageElement = card.querySelector('.home-page a');
    if (data.homePage === "") {
        homePageElement.parentElement.classList.add('hidden');
    } else {
        homePageElement.href = data.homePage;
        homePageElement.textContent = data.homePage;
        homePageElement.parentElement.classList.remove('hidden');
    }
    
    updateHashElement(card, distroData);
    updateDownloadLinkElement(card, distroData);
}

function updateCardContentLegacy(card, data, distroData) {
    card.querySelector('h2').textContent = `${data.name} ${data.version} - ${data.arch || 'x86'} - ${data.type || 'FULL'}`; 

    const codeNameElement = card.querySelector('.code-name');
    if (data.codeName === "") {
        codeNameElement.classList.add('hidden');
    } else {
        codeNameElement.textContent = `"${data.codeName}"`;
        codeNameElement.classList.remove('hidden');
    }

    const dateElement = card.querySelector('.date');
    if (data.releaseDate === "") {
        dateElement.classList.add('hidden');
    } else {
        dateElement.textContent = `Release Date: ${data.releaseDate}`;
        dateElement.classList.remove('hidden');
    }

    const homePageElement = card.querySelector('.home-page a');
    if (data.homePage === "") {
        homePageElement.parentElement.classList.add('hidden');
    } else {
        homePageElement.href = data.homePage; 
        homePageElement.textContent = data.homePage;
        homePageElement.parentElement.classList.remove('hidden');
    }
    
    updateHashElement(card, distroData);
    updateDownloadLinkElement(card, distroData);
}

function updateHashElement(card, distroData) {
    const hashElement = card.querySelector('.hash');
    if (!distroData || distroData.sha256 === "") {
        hashElement.classList.add('hidden');
    } else {
        hashElement.textContent = `sha256: ${distroData.sha256}`;
        hashElement.style.cursor = 'pointer'; 
        
        const newHashElement = hashElement.cloneNode(true);
        hashElement.parentNode.replaceChild(newHashElement, hashElement);
        
        newHashElement.addEventListener('click', function() {
            const fullText = this.textContent;
            const hash = fullText.replace('sha256: ', '');  
            navigator.clipboard.writeText(hash).then(() => {
                this.textContent = 'Copied!';  
                setTimeout(() => this.textContent = fullText, 2000);  
            }, function(err) {
                console.error('Could not copy text: ', err);
            });
        });
        newHashElement.classList.remove('hidden');
    }
}

function updateDownloadLinkElement(card, distroData) {
    const rawLinkDiv = card.querySelector('.raw-link div');
    const rawLinkContainer = card.querySelector('.raw-link');
    
    if (!distroData || distroData.downloadLink === "") {
        rawLinkContainer.classList.add('hidden');
    } else {
        rawLinkContainer.classList.remove('hidden');
        rawLinkDiv.textContent = distroData.downloadLink;
        
        const newRawLinkDiv = rawLinkDiv.cloneNode(true);
        rawLinkDiv.parentNode.replaceChild(newRawLinkDiv, rawLinkDiv);
        
        newRawLinkDiv.addEventListener('click', function() {
            const originalText = this.textContent;
            navigator.clipboard.writeText(this.textContent).then(() => {
                this.textContent = 'Copied!';
                setTimeout(() => this.textContent = originalText, 2000);
            }, function(err) {
                console.error('Could not copy text: ', err);
            });
        });
    }

    const osLink = card.querySelector('.os-link');
    if (!distroData || distroData.downloadLink === "") {
        osLink.classList.add('hidden');
    } else {
        const fileName = distroData.downloadLink.split('/').pop();
        osLink.textContent = `${fileName} (${distroData.size})`;
        osLink.href = distroData.downloadLink;
        osLink.classList.remove('hidden');
    }
}

document.getElementById('search-bar').addEventListener('input', function(e) {
    const searchTerm = e.target.value.toLowerCase();
    const cards = document.querySelectorAll('.distro-card');
    cards.forEach(card => {
        const title = card.querySelector('h2').textContent.toLowerCase();
        if (title.includes(searchTerm)) {
            card.style.display = '';
        } else {
            card.style.display = 'none';
        }
    });
});

function showAllCards() {
    const cards = document.querySelectorAll('.distro-card');
    cards.forEach(card => {
        card.style.display = '';
    });
}

document.getElementById('reset-button').addEventListener('click', function() {
    document.getElementById('search-bar').value = '';

    document.querySelector('.arch-toggle.active').classList.remove('active');
    document.querySelector('.arch-toggle').classList.add('active');
    document.querySelector('.type-toggle.active').classList.remove('active');
    document.querySelector('.type-toggle').classList.add('active');

    showAllCards();

    updateAllCards();
});