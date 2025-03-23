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
    const resetButton = document.getElementById('reset-finder');
    const questionContainer = document.getElementById('question-container');
    
    // State variables
    let currentQuestionIndex = 0;
    const userResponses = {
        1: null, // experience
        2: null, // useCase
        3: null, // hardware
        4: null, // stability
        5: null, // interface
        6: null, // philosophy
        7: null  // customization
    };
    
    // Mapping of question numbers to category keys for matching
    const questionCategories = {
        1: 'experience',
        2: 'useCase',
        3: 'hardware',
        4: 'stability',
        5: 'interface',
        6: 'philosophy',
        7: 'customization'
    };
    
    // Distribution data with tags for matching
    const distributions = [
        {
            name: "Ubuntu",
            description: "A user-friendly Linux distribution with strong community support and widespread adoption.",
            matchPoints: 0,
            tags: {
                experience: ["beginner", "intermediate"],
                useCase: ["general", "development", "server", "gaming"],
                hardware: ["modern", "mid"],
                stability: ["balanced", "stable"],
                interface: ["modern", "gnome"],
                philosophy: ["pragmatic", "balanced"],
                customization: ["works", "some"]
            },
            logo: "img/ubuntu-logo.png",
            link: "index.html#debian"
        },
        {
            name: "Fedora",
            description: "A cutting-edge distribution sponsored by Red Hat that focuses on the latest technologies.",
            matchPoints: 0,
            tags: {
                experience: ["intermediate", "advanced"],
                useCase: ["general", "development", "server"],
                hardware: ["modern", "mid"],
                stability: ["latest", "balanced"],
                interface: ["modern", "gnome"],
                philosophy: ["free", "balanced"],
                customization: ["some", "full"]
            },
            logo: "img/fedora-logo.png",
            link: "index.html#fedora"
        },
        {
            name: "Linux Mint",
            description: "An elegant, easy to use, up to date and comfortable Linux desktop distribution.",
            matchPoints: 0,
            tags: {
                experience: ["beginner", "intermediate"],
                useCase: ["general", "gaming"],
                hardware: ["mid", "old"],
                stability: ["stable", "balanced"],
                interface: ["traditional", "minimal"],
                philosophy: ["pragmatic", "balanced"],
                customization: ["works", "some"]
            },
            logo: "img/mint-logo.png",
            link: "index.html#mint"
        },
        {
            name: "Debian",
            description: "A stable and security-focused distribution that serves as the foundation for many other distributions.",
            matchPoints: 0,
            tags: {
                experience: ["intermediate", "advanced"],
                useCase: ["general", "server", "development"],
                hardware: ["mid", "old"],
                stability: ["stable"],
                interface: ["any", "minimal", "traditional", "modern"],
                philosophy: ["free"],
                customization: ["some", "full"]
            },
            logo: "img/debian-logo.png",
            link: "index.html#debian"
        },
        {
            name: "Arch Linux",
            description: "A lightweight and flexible Linux distribution that follows the KISS principle - Keep It Simple, Stupid.",
            matchPoints: 0,
            tags: {
                experience: ["advanced"],
                useCase: ["general", "development", "gaming"],
                hardware: ["modern", "mid"],
                stability: ["latest"],
                interface: ["any", "minimal"],
                philosophy: ["free", "balanced"],
                customization: ["full"]
            },
            logo: "img/arch-logo.png",
            link: "index.html#arch"
        },
        {
            name: "Manjaro",
            description: "A user-friendly, desktop-oriented operating system based on Arch Linux.",
            matchPoints: 0,
            tags: {
                experience: ["beginner", "intermediate"],
                useCase: ["general", "gaming", "development"],
                hardware: ["modern", "mid"],
                stability: ["latest", "balanced"],
                interface: ["traditional", "modern", "minimal"],
                philosophy: ["pragmatic", "balanced"],
                customization: ["some", "full"]
            },
            logo: "img/manjaro-logo.png",
            link: "index.html#manjaro"
        },
        {
            name: "Pop!_OS",
            description: "A Linux distribution by System76 focused on creative professionals, scientists, and developers.",
            matchPoints: 0,
            tags: {
                experience: ["beginner", "intermediate"],
                useCase: ["general", "development", "gaming"],
                hardware: ["modern", "mid"],
                stability: ["balanced", "latest"],
                interface: ["modern", "gnome"],
                philosophy: ["pragmatic", "balanced"],
                customization: ["works", "some"]
            },
            logo: "img/popos-logo.png",
            link: "index.html#popos"
        },
        {
            name: "openSUSE",
            description: "A stable, easy to use and complete multi-purpose distribution.",
            matchPoints: 0,
            tags: {
                experience: ["intermediate", "beginner"],
                useCase: ["general", "server", "development"],
                hardware: ["modern", "mid"],
                stability: ["stable", "balanced"],
                interface: ["traditional", "modern"],
                philosophy: ["balanced", "free"],
                customization: ["some", "works"]
            },
            logo: "img/opensuse-logo.png",
            link: "index.html#opensuse"
        },
        {
            name: "Zorin OS",
            description: "A Linux distribution designed to be familiar to Windows users.",
            matchPoints: 0,
            tags: {
                experience: ["beginner"],
                useCase: ["general"],
                hardware: ["mid", "old"],
                stability: ["stable"],
                interface: ["traditional", "mac"],
                philosophy: ["pragmatic"],
                customization: ["works", "some"]
            },
            logo: "img/zorin-logo.png",
            link: "index.html#zorin"
        },
        {
            name: "Elementary OS",
            description: "A fast, open, and privacy-respecting replacement for macOS and Windows.",
            matchPoints: 0,
            tags: {
                experience: ["beginner"],
                useCase: ["general"],
                hardware: ["modern", "mid"],
                stability: ["stable"],
                interface: ["mac"],
                philosophy: ["balanced"],
                customization: ["works"]
            },
            logo: "img/elementary-logo.png",
            link: "index.html#elementary"
        },
        {
            name: "Gentoo",
            description: "A highly flexible, source-based Linux distribution that emphasizes choice and performance.",
            matchPoints: 0,
            tags: {
                experience: ["advanced"],
                useCase: ["development", "server"],
                hardware: ["modern", "mid"],
                stability: ["latest"],
                interface: ["any", "minimal"],
                philosophy: ["free"],
                customization: ["full"]
            },
            logo: "img/gentoo-logo.png",
            link: "index.html#gentoo"
        },
        {
            name: "Kali Linux",
            description: "A specialized Debian-based distribution designed for penetration testing and digital forensics.",
            matchPoints: 0,
            tags: {
                experience: ["intermediate", "advanced"],
                useCase: ["development", "server"],
                hardware: ["mid", "modern"],
                stability: ["stable"],
                interface: ["modern", "minimal"],
                philosophy: ["free"],
                customization: ["some", "full"]
            },
            logo: "img/kali-logo.png",
            link: "index.html#kali"
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
            nextButton.textContent = "Next Question";
        }
        
        // Check if the current question has a selection to enable/disable the next button
        const currentQuestionId = questions[index].id.split('-')[1];
        nextButton.disabled = userResponses[currentQuestionId] === null;
        
        // Update current question indicator
        document.getElementById('current-question').textContent = index + 1;
    }
    
    // Update the progress bar
    function updateProgress() {
        const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
        progressFill.style.width = `${progress}%`;
    }
    
    // Handle option selection
    function selectOption(questionId, optionValue) {
        const questionNumber = questionId.split('-')[1];
        userResponses[questionNumber] = optionValue;
        
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
        console.log("Resetting quiz");
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
        
        // Show the question container again
        questionContainer.style.display = 'block';
        document.querySelector('.finder-progress').style.display = 'block';
        document.querySelector('.navigation-buttons').style.display = 'flex';
        
        // Hide results
        resultsContainer.style.display = 'none';
        resultsList.innerHTML = '';
    }
    
    // Calculate distribution matches based on user responses
    function calculateMatches() {
        // Reset all match points
        distributions.forEach(distro => {
            distro.matchPoints = 0;
            distro.bonusPoints = 0;
        });
        
        // Calculate match points for each distribution
        Object.entries(userResponses).forEach(([questionNumber, userValue]) => {
            if (userValue) {
                const category = questionCategories[questionNumber];
                distributions.forEach(distro => {
                    // Perfect match
                    if (distro.tags[category] && distro.tags[category].includes(userValue)) {
                        distro.matchPoints += 1;
                    } 
                    // 'any' is a wildcard that matches any value
                    else if (distro.tags[category] && distro.tags[category].includes('any')) {
                        distro.matchPoints += 0.75;
                    }
                    // Give some points for being in the general ballpark
                    // E.g., if user selects "beginner" and distro has "intermediate"
                    else if (category === 'experience') {
                        if (userValue === 'beginner' && distro.tags[category].includes('intermediate')) {
                            distro.bonusPoints += 0.5;
                        } else if (userValue === 'intermediate' && 
                                  (distro.tags[category].includes('beginner') || 
                                   distro.tags[category].includes('advanced'))) {
                            distro.bonusPoints += 0.5;
                        }
                    }
                    // Hardware compatibility is often more flexible downward
                    else if (category === 'hardware') {
                        if (userValue === 'old' && 
                           (distro.tags[category].includes('mid') || 
                            distro.tags[category].includes('modern'))) {
                            distro.bonusPoints += 0.5;
                        } else if (userValue === 'mid' && distro.tags[category].includes('modern')) {
                            distro.bonusPoints += 0.5;
                        }
                    }
                    // Interface flexibility
                    else if (category === 'interface') {
                        distro.bonusPoints += 0.3; // All distros can use different DEs with some work
                    }
                });
            }
        });
        
        // Add bonus points to match points
        distributions.forEach(distro => {
            distro.totalPoints = distro.matchPoints + distro.bonusPoints;
        });
        
        // Sort distributions by match points in descending order
        return [...distributions].sort((a, b) => b.totalPoints - a.totalPoints);
    }
    
    // Show the results page
    function showResults() {
        // Calculate matches
        const matches = calculateMatches();
        
        // Always show at least top 3 distributions, even if they have 0 match points
        let topMatches = matches.filter(distro => distro.totalPoints > 0);
        if (topMatches.length < 3) {
            topMatches = matches.slice(0, 3);
        } else {
            // Show up to 5 matches if they have points
            topMatches = topMatches.slice(0, 5);
        }
        
        // Hide questions, show results
        questions.forEach(question => {
            question.style.display = 'none';
        });
        
        document.querySelector('.finder-progress').style.display = 'none';
        document.querySelector('.navigation-buttons').style.display = 'none';
        questionContainer.style.display = 'none';
        
        // Display results
        resultsContainer.style.display = 'block';
        resultsList.innerHTML = '';
        
        // Always show results even if no perfect matches
        topMatches.forEach(distro => {
            // Calculate match percentage with a minimum of 30% to avoid discouraging the user
            const rawPercentage = Math.round((distro.totalPoints / Object.keys(userResponses).length) * 100);
            const matchPercentage = Math.max(30, rawPercentage);
            
            const resultCard = document.createElement('div');
            resultCard.className = 'result-card';
            resultCard.innerHTML = `
                <img src="${distro.logo}" alt="${distro.name} Logo" class="result-logo">
                <div class="result-details">
                    <h4>${distro.name}</h4>
                    <p>${distro.description}</p>
                    <div class="result-actions">
                        <a href="${distro.link}" class="result-button primary">Learn More</a>
                        <a href="compare.html?distro1=${distro.name.toLowerCase()}" class="result-button">Compare</a>
                    </div>
                </div>
                <div class="result-match">${matchPercentage}% Match</div>
            `;
            
            resultsList.appendChild(resultCard);
        });
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