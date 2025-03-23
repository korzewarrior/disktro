// Distro Finder - Interactive Distribution Recommendation Tool

document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const questions = document.querySelectorAll('.question');
    const prevButton = document.getElementById('prev-button');
    const nextButton = document.getElementById('next-button');
    const progressFill = document.querySelector('.progress-fill');
    const progressText = document.querySelector('.progress-text');
    const resultsContainer = document.getElementById('results-container');
    const resultsList = document.getElementById('results-list');
    const resetButton = document.querySelector('.reset-button');
    
    // State variables
    let currentQuestionIndex = 0;
    const userResponses = {
        experience: null,
        useCase: null,
        hardware: null,
        stability: null,
        interface: null,
        philosophy: null,
        customization: null
    };
    
    // Distribution data with tags for matching
    const distributions = [
        {
            name: "Ubuntu",
            description: "A user-friendly Linux distribution with strong community support and widespread adoption.",
            matchPoints: 0,
            tags: {
                experience: ["beginner", "intermediate"],
                useCase: ["desktop", "development", "server"],
                hardware: ["modern", "moderate"],
                stability: ["balanced", "stable"],
                interface: ["gnome"],
                philosophy: ["mixed"],
                customization: ["medium"]
            },
            logo: "img/ubuntu-logo.png",
            link: "distro/ubuntu.html"
        },
        {
            name: "Fedora",
            description: "A cutting-edge distribution sponsored by Red Hat that focuses on the latest technologies.",
            matchPoints: 0,
            tags: {
                experience: ["intermediate", "advanced"],
                useCase: ["desktop", "development", "workstation"],
                hardware: ["modern"],
                stability: ["latest"],
                interface: ["gnome"],
                philosophy: ["free", "mixed"],
                customization: ["medium"]
            },
            logo: "img/fedora-logo.png",
            link: "distro/fedora.html"
        },
        {
            name: "Linux Mint",
            description: "An elegant, easy to use, up to date and comfortable Linux desktop distribution.",
            matchPoints: 0,
            tags: {
                experience: ["beginner", "intermediate"],
                useCase: ["desktop"],
                hardware: ["moderate", "older"],
                stability: ["stable"],
                interface: ["cinnamon", "mate", "xfce"],
                philosophy: ["mixed"],
                customization: ["medium", "high"]
            },
            logo: "img/mint-logo.png",
            link: "distro/mint.html"
        },
        {
            name: "Debian",
            description: "A stable and security-focused distribution that serves as the foundation for many other distributions.",
            matchPoints: 0,
            tags: {
                experience: ["intermediate", "advanced"],
                useCase: ["desktop", "server"],
                hardware: ["moderate", "older"],
                stability: ["stable"],
                interface: ["gnome", "kde", "xfce", "mate"],
                philosophy: ["free"],
                customization: ["high"]
            },
            logo: "img/debian-logo.png",
            link: "distro/debian.html"
        },
        {
            name: "Arch Linux",
            description: "A lightweight and flexible Linux distribution that follows the KISS principle - Keep It Simple, Stupid.",
            matchPoints: 0,
            tags: {
                experience: ["advanced"],
                useCase: ["desktop", "development"],
                hardware: ["modern", "moderate"],
                stability: ["latest"],
                interface: ["any"],
                philosophy: ["control"],
                customization: ["very-high"]
            },
            logo: "img/arch-logo.png",
            link: "distro/arch.html"
        },
        {
            name: "Manjaro",
            description: "A user-friendly, desktop-oriented operating system based on Arch Linux.",
            matchPoints: 0,
            tags: {
                experience: ["beginner", "intermediate"],
                useCase: ["desktop", "gaming"],
                hardware: ["modern", "moderate"],
                stability: ["latest", "balanced"],
                interface: ["kde", "gnome", "xfce"],
                philosophy: ["mixed", "control"],
                customization: ["high"]
            },
            logo: "img/manjaro-logo.png",
            link: "distro/manjaro.html"
        },
        {
            name: "Pop!_OS",
            description: "A Linux distribution by System76 focused on creative professionals, scientists, and developers.",
            matchPoints: 0,
            tags: {
                experience: ["beginner", "intermediate"],
                useCase: ["desktop", "development", "gaming"],
                hardware: ["modern"],
                stability: ["balanced"],
                interface: ["gnome"],
                philosophy: ["mixed"],
                customization: ["medium"]
            },
            logo: "img/pop-logo.png",
            link: "distro/pop.html"
        },
        {
            name: "openSUSE",
            description: "A stable, easy to use and complete multi-purpose distribution.",
            matchPoints: 0,
            tags: {
                experience: ["intermediate"],
                useCase: ["desktop", "server"],
                hardware: ["modern", "moderate"],
                stability: ["stable", "balanced"],
                interface: ["kde", "gnome"],
                philosophy: ["mixed"],
                customization: ["high"]
            },
            logo: "img/opensuse-logo.png",
            link: "distro/opensuse.html"
        },
        {
            name: "Zorin OS",
            description: "A Linux distribution designed to be familiar to Windows users.",
            matchPoints: 0,
            tags: {
                experience: ["beginner"],
                useCase: ["desktop"],
                hardware: ["moderate", "older"],
                stability: ["stable"],
                interface: ["zorin"],
                philosophy: ["mixed"],
                customization: ["low", "medium"]
            },
            logo: "img/zorin-logo.png",
            link: "distro/zorin.html"
        },
        {
            name: "Elementary OS",
            description: "A fast, open, and privacy-respecting replacement for macOS and Windows.",
            matchPoints: 0,
            tags: {
                experience: ["beginner"],
                useCase: ["desktop"],
                hardware: ["modern", "moderate"],
                stability: ["stable"],
                interface: ["pantheon"],
                philosophy: ["mixed"],
                customization: ["low"]
            },
            logo: "img/elementary-logo.png",
            link: "distro/elementary.html"
        },
        {
            name: "Solus",
            description: "A Linux distribution built from scratch with a focus on providing a cohesive desktop experience.",
            matchPoints: 0,
            tags: {
                experience: ["beginner", "intermediate"],
                useCase: ["desktop"],
                hardware: ["modern", "moderate"],
                stability: ["balanced"],
                interface: ["budgie", "mate", "gnome"],
                philosophy: ["mixed"],
                customization: ["medium"]
            },
            logo: "img/solus-logo.png",
            link: "distro/solus.html"
        },
        {
            name: "Tails",
            description: "A portable operating system that protects your privacy and anonymity.",
            matchPoints: 0,
            tags: {
                experience: ["intermediate"],
                useCase: ["security", "privacy"],
                hardware: ["moderate", "older"],
                stability: ["stable"],
                interface: ["gnome"],
                philosophy: ["free"],
                customization: ["low"]
            },
            logo: "img/tails-logo.png",
            link: "distro/tails.html"
        }
    ];
    
    // Initialize the quiz
    function init() {
        showQuestion(0);
        updateProgress();
        bindEventListeners();
    }
    
    // Show a specific question by index
    function showQuestion(index) {
        questions.forEach((question, i) => {
            question.style.display = i === index ? 'block' : 'none';
        });
        
        // Update button states
        prevButton.disabled = index === 0;
        
        // Change next button text for the last question
        if (index === questions.length - 1) {
            nextButton.textContent = "See Results";
        } else {
            nextButton.textContent = "Next";
        }
        
        // Check if the current question has a selection to enable/disable the next button
        const currentQuestionId = questions[index].id;
        const responseKey = currentQuestionId.replace('question-', '');
        
        nextButton.disabled = userResponses[responseKey] === null;
    }
    
    // Update the progress bar
    function updateProgress() {
        const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
        progressFill.style.width = `${progress}%`;
        progressText.textContent = `Question ${currentQuestionIndex + 1} of ${questions.length}`;
    }
    
    // Handle option selection
    function selectOption(questionId, optionValue) {
        const responseKey = questionId.replace('question-', '');
        userResponses[responseKey] = optionValue;
        
        // Update UI to highlight the selected option
        const questionElement = document.getElementById(questionId);
        const options = questionElement.querySelectorAll('.option-card');
        
        options.forEach(option => {
            if (option.dataset.value === optionValue) {
                option.classList.add('selected');
            } else {
                option.classList.remove('selected');
            }
        });
        
        // Enable the next button
        nextButton.disabled = false;
    }
    
    // Navigate to the next question
    function nextQuestion() {
        if (currentQuestionIndex < questions.length - 1) {
            currentQuestionIndex++;
            showQuestion(currentQuestionIndex);
            updateProgress();
        } else {
            // Show results if we're on the last question
            showResults();
        }
    }
    
    // Navigate to the previous question
    function prevQuestion() {
        if (currentQuestionIndex > 0) {
            currentQuestionIndex--;
            showQuestion(currentQuestionIndex);
            updateProgress();
        }
    }
    
    // Reset the quiz
    function resetQuiz() {
        // Reset all responses
        Object.keys(userResponses).forEach(key => {
            userResponses[key] = null;
        });
        
        // Reset UI selections
        const optionCards = document.querySelectorAll('.option-card');
        optionCards.forEach(card => {
            card.classList.remove('selected');
        });
        
        // Reset to first question
        currentQuestionIndex = 0;
        showQuestion(0);
        updateProgress();
        
        // Hide results
        resultsContainer.style.display = 'none';
        resultsList.innerHTML = '';
    }
    
    // Calculate distribution matches based on user responses
    function calculateMatches() {
        // Reset all match points
        distributions.forEach(distro => {
            distro.matchPoints = 0;
        });
        
        // Calculate match points for each distribution
        Object.entries(userResponses).forEach(([category, userValue]) => {
            if (userValue) {
                distributions.forEach(distro => {
                    if (distro.tags[category] && distro.tags[category].includes(userValue)) {
                        distro.matchPoints += 1;
                    } else if (distro.tags[category] && distro.tags[category].includes('any')) {
                        // 'any' is a wildcard that matches any value
                        distro.matchPoints += 0.5;
                    }
                });
            }
        });
        
        // Sort distributions by match points in descending order
        return [...distributions].sort((a, b) => b.matchPoints - a.matchPoints);
    }
    
    // Show the results page
    function showResults() {
        // Calculate matches
        const matches = calculateMatches();
        const topMatches = matches.filter(distro => distro.matchPoints > 0).slice(0, 5);
        
        // Hide questions, show results
        questions.forEach(question => {
            question.style.display = 'none';
        });
        
        document.querySelector('.finder-progress').style.display = 'none';
        document.querySelector('.navigation-buttons').style.display = 'none';
        
        // Display results
        resultsContainer.style.display = 'block';
        resultsList.innerHTML = '';
        
        if (topMatches.length === 0) {
            resultsList.innerHTML = '<div class="no-matches-message">No distributions matched your criteria. Please try again with different selections.</div>';
        } else {
            topMatches.forEach(distro => {
                const matchPercentage = Math.round((distro.matchPoints / Object.keys(userResponses).length) * 100);
                
                const resultCard = document.createElement('div');
                resultCard.className = 'result-card';
                resultCard.innerHTML = `
                    <img src="${distro.logo}" alt="${distro.name} Logo" class="result-logo">
                    <div class="result-details">
                        <h4>${distro.name}</h4>
                        <p>${distro.description}</p>
                        <div class="result-actions">
                            <a href="${distro.link}" class="result-button primary">Learn More</a>
                            <a href="compare.html?distros=${distro.name.toLowerCase()}" class="result-button">Compare</a>
                        </div>
                    </div>
                    <div class="result-match">${matchPercentage}% Match</div>
                `;
                
                resultsList.appendChild(resultCard);
            });
        }
    }
    
    // Bind event listeners
    function bindEventListeners() {
        // Option selection
        const optionCards = document.querySelectorAll('.option-card');
        optionCards.forEach(card => {
            card.addEventListener('click', function() {
                const questionId = this.closest('.question').id;
                const optionValue = this.dataset.value;
                selectOption(questionId, optionValue);
            });
        });
        
        // Navigation buttons
        prevButton.addEventListener('click', prevQuestion);
        nextButton.addEventListener('click', nextQuestion);
        
        // Reset button
        resetButton.addEventListener('click', resetQuiz);
    }
    
    // Start the quiz
    init();
}); 