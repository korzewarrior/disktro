// Distro data for comparisons
window.distroData = {
    ubuntu: {
        id: "ubuntu",
        name: "Ubuntu",
        description: "Ubuntu is a popular Linux distribution based on Debian, known for its ease of use and regular release schedule. It offers a polished desktop experience with good hardware support.",
        base: "Debian",
        package_manager: "APT (deb)",
        release_model: "Fixed (6-month cycle with LTS)",
        desktop: "GNOME",
        difficulty: "Beginner-friendly",
        stability: "Balanced (regular releases) or Stable (LTS)",
        system_requirements: "4GB RAM, 25GB disk space",
        strengths: [
            "Excellent hardware support", 
            "Large community", 
            "Corporate backing (Canonical)", 
            "Extensive documentation"
        ],
        weaknesses: [
            "Some proprietary elements", 
            "GNOME can be resource-intensive"
        ],
        use_cases: [
            "New Linux users", 
            "General-purpose computing", 
            "Software development", 
            "Server deployments"
        ]
    },
    fedora: {
        id: "fedora",
        name: "Fedora",
        description: "Fedora is a cutting-edge Linux distribution sponsored by Red Hat. It focuses on innovation and integrates new technologies before most other distributions.",
        base: "Independent (Red Hat sponsored)",
        package_manager: "DNF (rpm)",
        release_model: "Fixed (6-month cycle)",
        desktop: "GNOME",
        difficulty: "Intermediate",
        stability: "Bleeding edge, newest packages",
        system_requirements: "4GB RAM, 20GB disk space",
        strengths: [
            "Latest software/features", 
            "Pure open source philosophy", 
            "Strong security (SELinux)", 
            "Red Hat innovations"
        ],
        weaknesses: [
            "Less stable than LTS distros", 
            "May require more technical knowledge"
        ],
        use_cases: [
            "Software developers", 
            "System administrators", 
            "Open source enthusiasts", 
            "Testing new technologies"
        ]
    },
    debian: {
        id: "debian",
        name: "Debian",
        description: "Debian is one of the oldest and most respected Linux distributions, known for its stability, security, and vast software repository. It serves as the foundation for many other distributions.",
        base: "Independent",
        package_manager: "APT (deb)",
        release_model: "Fixed (approximately 2-year cycle)",
        desktop: "GNOME (multiple options)",
        difficulty: "Intermediate",
        stability: "Very stable, conservative",
        system_requirements: "2GB RAM, 10GB disk space",
        strengths: [
            "Extremely stable", 
            "Massive repository", 
            "Strong commitment to free software", 
            "Solid security track record"
        ],
        weaknesses: [
            "Older software versions", 
            "Conservative update policy", 
            "Can be less user-friendly"
        ],
        use_cases: [
            "Servers", 
            "Production environments", 
            "Stability-focused users", 
            "Older hardware"
        ]
    },
    arch: {
        id: "arch",
        name: "Arch Linux",
        description: "Arch Linux is a lightweight, flexible distribution that follows a rolling release model. It emphasizes simplicity, minimalism, and user-centrality.",
        base: "Independent",
        package_manager: "Pacman",
        release_model: "Rolling release",
        desktop: "None (DIY)",
        difficulty: "Advanced",
        stability: "Bleeding edge, newest packages",
        system_requirements: "512MB RAM, 2GB disk space (minimal)",
        strengths: [
            "Latest software/features", 
            "Highly customizable", 
            "Excellent documentation (Arch Wiki)", 
            "Simple and elegant design"
        ],
        weaknesses: [
            "Steep learning curve", 
            "Requires technical knowledge", 
            "Manual installation process", 
            "Higher maintenance"
        ],
        use_cases: [
            "Advanced users", 
            "Those who want complete control", 
            "Learning Linux internals", 
            "Custom configurations"
        ]
    },
    mint: {
        id: "mint",
        name: "Linux Mint",
        description: "Linux Mint is a popular desktop Linux distribution based on Ubuntu. It focuses on providing a familiar, elegant desktop experience with out-of-the-box functionality.",
        base: "Ubuntu/Debian",
        package_manager: "APT (deb)",
        release_model: "Fixed (follows Ubuntu LTS)",
        desktop: "Cinnamon (also MATE, Xfce)",
        difficulty: "Beginner-friendly",
        stability: "Stable (based on LTS)",
        system_requirements: "2GB RAM, 20GB disk space",
        strengths: [
            "Very user-friendly", 
            "Windows-like interface", 
            "Pre-installed multimedia codecs", 
            "Strong stability"
        ],
        weaknesses: [
            "Less cutting-edge than some distros", 
            "Smaller community than Ubuntu", 
            "Some added complexity over Ubuntu"
        ],
        use_cases: [
            "Windows converts", 
            "Beginners", 
            "Desktop/laptop users", 
            "Media consumption"
        ]
    },
    manjaro: {
        id: "manjaro",
        name: "Manjaro",
        description: "Manjaro is an accessible, friendly, open-source operating system based on Arch Linux. It combines the powerful Arch base with user-friendly installation and configuration.",
        base: "Arch Linux",
        package_manager: "Pacman",
        release_model: "Rolling release (with stabilization)",
        desktop: "Xfce, KDE, GNOME (multiple editions)",
        difficulty: "Intermediate",
        stability: "Semi-rolling, slightly delayed for stability",
        system_requirements: "2GB RAM, 30GB disk space",
        strengths: [
            "Arch benefits with easier installation", 
            "User-friendly Arch experience", 
            "Multiple desktop environments", 
            "Hardware detection"
        ],
        weaknesses: [
            "Less stable than fixed releases", 
            "Not pure Arch", 
            "Package delays compared to Arch"
        ],
        use_cases: [
            "Users wanting Arch without the difficulty", 
            "Desktop users", 
            "Tinkerers", 
            "Gaming"
        ]
    },
    popos: {
        id: "popos",
        name: "Pop!_OS",
        description: "Pop!_OS is a Linux distribution developed by System76, a computer manufacturer specializing in Linux. It offers a refined and focused desktop experience with enhancements for creators and developers.",
        base: "Ubuntu",
        package_manager: "APT (deb)",
        release_model: "Fixed (follows Ubuntu)",
        desktop: "GNOME (customized)",
        difficulty: "Beginner-friendly",
        stability: "Balanced, follows Ubuntu",
        system_requirements: "4GB RAM, 20GB disk space",
        strengths: [
            "Excellent hardware support", 
            "NVIDIA driver integration", 
            "Optimized for developers", 
            "Polished user experience"
        ],
        weaknesses: [
            "Less customizable out of box", 
            "Higher system requirements", 
            "Smaller community than Ubuntu"
        ],
        use_cases: [
            "Developers", 
            "Creative professionals", 
            "NVIDIA GPU users", 
            "System76 hardware owners"
        ]
    },
    opensuse: {
        id: "opensuse",
        name: "openSUSE",
        description: "openSUSE is a stable, user-friendly Linux distribution supported by the community and sponsored by SUSE. It offers multiple release versions to suit different needs.",
        base: "Independent",
        package_manager: "Zypper (rpm)",
        release_model: "Two versions: Leap (fixed) and Tumbleweed (rolling)",
        desktop: "KDE (GNOME also well-supported)",
        difficulty: "Intermediate",
        stability: "Tumbleweed: Bleeding edge / Leap: Stable",
        system_requirements: "2GB RAM, 40GB disk space",
        strengths: [
            "YaST control center", 
            "Enterprise-grade tools", 
            "Excellent KDE implementation", 
            "Choice of release models"
        ],
        weaknesses: [
            "Smaller community than Ubuntu/Fedora", 
            "Some enterprise focus makes it less desktop-oriented", 
            "More complex package management"
        ],
        use_cases: [
            "System administrators", 
            "Enterprise desktop users", 
            "KDE fans", 
            "Those wanting both fixed and rolling options"
        ]
    },
    elementary: {
        id: "elementary",
        name: "Elementary OS",
        description: "Elementary OS is a stylish, macOS-inspired Linux distribution focused on non-technical users. It emphasizes a beautiful design, ease of use, and a curated application experience.",
        base: "Ubuntu",
        package_manager: "APT (deb)",
        release_model: "Fixed (follows Ubuntu LTS)",
        desktop: "Pantheon",
        difficulty: "Beginner-friendly",
        stability: "Stable (based on LTS)",
        system_requirements: "4GB RAM, 15GB disk space",
        strengths: [
            "Beautiful design", 
            "macOS-like interface", 
            "Focus on human interface guidelines", 
            "Curated app store"
        ],
        weaknesses: [
            "Limited customization", 
            "Smaller application ecosystem", 
            "Higher system requirements than some alternatives"
        ],
        use_cases: [
            "macOS users", 
            "Design-focused users", 
            "Those who value simplicity", 
            "Basic computing needs"
        ]
    },
    zorin: {
        id: "zorin",
        name: "Zorin OS",
        description: "Zorin OS is a Linux distribution designed to make your computer faster, more powerful, secure and privacy-respecting. It has a familiar Windows-like interface making it easy for Windows users to transition.",
        base: "Ubuntu",
        package_manager: "APT (deb)",
        release_model: "Fixed (follows Ubuntu)",
        desktop: "Zorin Desktop (GNOME-based)",
        difficulty: "Beginner-friendly",
        stability: "Stable (based on LTS)",
        system_requirements: "2GB RAM, 10GB disk space",
        strengths: [
            "Windows-like interface", 
            "Easy transition for Windows users", 
            "Multiple layout options", 
            "Pre-configured for new users"
        ],
        weaknesses: [
            "Pro version costs money", 
            "Less unique than some alternatives", 
            "Some features only in Pro version"
        ],
        use_cases: [
            "Windows converts", 
            "Beginners", 
            "Business deployments", 
            "Education"
        ]
    },
    gentoo: {
        id: "gentoo",
        name: "Gentoo",
        description: "Gentoo is a flexible, source-based Linux distribution that emphasizes choice and performance. It allows users to build the entire system from source code optimized for their specific hardware.",
        base: "Independent",
        package_manager: "Portage",
        release_model: "Rolling release",
        desktop: "None (DIY)",
        difficulty: "Advanced",
        stability: "Build from source for latest versions",
        system_requirements: "2GB RAM, 8GB disk space (minimum)",
        strengths: [
            "Complete customization", 
            "Source-based package management", 
            "Optimized compilation for hardware", 
            "Advanced USE flag system"
        ],
        weaknesses: [
            "Very steep learning curve", 
            "Time-consuming installation and updates", 
            "High maintenance requirements"
        ],
        use_cases: [
            "Advanced users", 
            "System optimizers", 
            "Learning Linux internals", 
            "Programming and development"
        ]
    },
    slackware: {
        id: "slackware",
        name: "Slackware",
        description: "Slackware is one of the oldest Linux distributions still in active development. It focuses on design stability and simplicity, following a UNIX-like philosophy that values simplicity and security.",
        base: "Independent",
        package_manager: "pkgtools",
        release_model: "Fixed (infrequent releases)",
        desktop: "KDE (multiple available)",
        difficulty: "Advanced",
        stability: "Very stable, conservative",
        system_requirements: "1GB RAM, 5GB disk space",
        strengths: [
            "Simplicity in design", 
            "UNIX-like philosophy", 
            "Stability", 
            "Minimal changes to upstream packages"
        ],
        weaknesses: [
            "No automatic dependency resolution", 
            "Manual configuration required", 
            "Infrequent updates"
        ],
        use_cases: [
            "UNIX traditionalists", 
            "System administrators", 
            "Users who prefer manual control", 
            "Stable server environments"
        ]
    },
    pureos: {
        id: "pureos",
        name: "PureOS",
        description: "PureOS is a privacy-focused Linux distribution endorsed by the Free Software Foundation. It uses only free and open-source software, with an emphasis on security and user freedoms.",
        base: "Debian",
        package_manager: "APT (deb)",
        release_model: "Rolling release",
        desktop: "GNOME",
        difficulty: "Intermediate",
        stability: "Balanced, follows Debian Testing",
        system_requirements: "4GB RAM, 15GB disk space",
        strengths: [
            "Focus on privacy and security", 
            "FSF-endorsed free software", 
            "No proprietary software", 
            "Librem hardware integration"
        ],
        weaknesses: [
            "Limited hardware support", 
            "No proprietary drivers or firmware", 
            "Smaller community"
        ],
        use_cases: [
            "Privacy-focused users", 
            "Free software advocates", 
            "Librem hardware owners", 
            "Security-conscious users"
        ]
    },
    kali: {
        id: "kali",
        name: "Kali Linux",
        description: "Kali Linux is a security-focused distribution designed for penetration testing, ethical hacking, and security auditing. It includes hundreds of specialized tools for various information security tasks.",
        base: "Debian",
        package_manager: "APT (deb)",
        release_model: "Rolling release",
        desktop: "Xfce",
        difficulty: "Intermediate",
        stability: "Regularly updated security tools",
        system_requirements: "2GB RAM, 20GB disk space",
        strengths: [
            "Extensive security tools", 
            "Penetration testing focus", 
            "Regular updates for security tools", 
            "Forensics capabilities"
        ],
        weaknesses: [
            "Not designed for everyday use", 
            "Can be overkill for non-security professionals", 
            "Not recommended for Linux beginners"
        ],
        use_cases: [
            "Security professionals", 
            "Penetration testers", 
            "Digital forensics", 
            "Security researchers"
        ]
    },
    rocky: {
        id: "rocky",
        name: "Rocky Linux",
        base: "Red Hat Enterprise Linux",
        package_manager: "DNF (rpm)",
        release_model: "Fixed (follows RHEL)",
        desktop: "GNOME",
        difficulty: "Intermediate",
        stability: "Very stable, enterprise-focused",
        system_requirements: "2GB RAM, 20GB disk space",
        strengths: [
            "Enterprise-grade stability", 
            "Long-term support", 
            "CentOS replacement", 
            "Commercial support available"
        ],
        weaknesses: [
            "Conservative package versions", 
            "Not bleeding edge", 
            "Less desktop-focused"
        ],
        use_cases: [
            "Servers", 
            "Enterprise environments", 
            "Production workloads", 
            "Former CentOS users"
        ]
    },
    endeavouros: {
        id: "endeavouros",
        name: "EndeavourOS",
        description: "EndeavourOS is an Arch Linux-based distribution that aims to be accessible to less-experienced users while still adhering to Arch principles. It offers a friendly community and easier installation.",
        base: "Arch Linux",
        package_manager: "Pacman",
        release_model: "Rolling release",
        desktop: "Xfce (multiple available)",
        difficulty: "Intermediate",
        stability: "Bleeding edge, newest packages",
        system_requirements: "2GB RAM, 15GB disk space",
        strengths: [
            "Arch Linux with easier installation", 
            "Friendly community", 
            "Vanilla desktop environments", 
            "Minimal customization"
        ],
        weaknesses: [
            "Less stable than fixed releases", 
            "Requires some technical knowledge", 
            "Regular updates needed"
        ],
        use_cases: [
            "Users wanting Arch without manual setup", 
            "Distro hoppers", 
            "Experienced Linux users", 
            "Those who want near-vanilla desktops"
        ]
    }
}; 
