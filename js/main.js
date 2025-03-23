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

    fetch(`/distro/${distro}.json`)
        .then(response => response.json())
        .then(data => {
            const distroData = data[arch][type];
            card.querySelector('h2').textContent = `${data.name} ${data.version} - ${arch} - ${type}`; 

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
                homePageElement.classList.add('hidden');
            } else {
                homePageElement.href = data.homePage; 
                homePageElement.textContent = data.homePage;
                homePageElement.classList.remove('hidden');
            }

            const hashElement = card.querySelector('.hash');
            if (distroData.sha256 === "") {
                hashElement.classList.add('hidden');
            } else {
                hashElement.textContent = `sha256: ${distroData.sha256}`;
                hashElement.style.cursor = 'pointer'; 
                hashElement.addEventListener('click', function() {
                    const fullText = this.textContent;
                    const hash = fullText.replace('sha256: ', '');  
                    navigator.clipboard.writeText(hash).then(() => {
                        this.textContent = 'Copied!';  
                        setTimeout(() => this.textContent = fullText, 2000);  
                    }, function(err) {
                        console.error('Could not copy text: ', err);
                    });
                });
                hashElement.classList.remove('hidden');
            }

            const rawLinkDiv = card.querySelector('.raw-link div');
            if (distroData.downloadLink === "") {
                rawLinkDiv.classList.add('hidden');
            } else {
                rawLinkDiv.textContent = distroData.downloadLink;
                rawLinkDiv.addEventListener('click', function() {
                    const originalText = this.textContent;
                    navigator.clipboard.writeText(this.textContent).then(() => {
                        this.textContent = 'Copied!';
                        setTimeout(() => this.textContent = originalText, 2000);
                    }, function(err) {
                        console.error('Could not copy text: ', err);
                    });
                });
                rawLinkDiv.classList.remove('hidden');
            }

            const osLink = card.querySelector('.os-link');
            const fileName = distroData.downloadLink.split('/').pop();
            osLink.textContent = `${fileName} (${distroData.size})`;
            osLink.href = distroData.downloadLink;
        })
        .catch(error => console.error('Error:', error));
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