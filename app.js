document.addEventListener('DOMContentLoaded', () => {
    const projects = [
        {
            title: "NEURAL CHAT v2.0",
            tech: ["PYTHON", "TENSORFLOW", "WEBRTC"],
            description: "ENCRYPTED AI COMMUNICATION PLATFORM WITH END-TO-END SECURITY",
            year: "2024",
            link: "#",
            demo: "#"
        },
        {
            title: "CRYPTO EXCHANGE",
            tech: ["BLOCKCHAIN", "SOLIDITY", "REACT"],
            description: "DECENTRALIZED TRADING PLATFORM WITH SMART CONTRACTS",
            year: "2023",
            link: "#",
            demo: "#"
        },
        {
            title: "E-Commerce Hub",
            tech: "React • Node.js • Stripe API",
            description: "Full-stack shopping platform with payment integration",
            link: "#",
            year: "2023"
        },
        {
            title: "Social Network",
            tech: "Vue.js • Firebase • AWS",
            description: "Decentralized social media with real-time updates",
            link: "#",
            year: "2023"
        },
        {
            title: "Game Engine",
            tech: "C++ • OpenGL • PhysX",
            description: "3D game development framework with physics",
            link: "#",
            year: "2022"
        },
        {
            title: "Health Tracker",
            tech: "Flutter • Firebase • ML Kit",
            description: "Mobile health monitoring with AI insights",
            link: "#",
            year: "2024"
        },
        {
            title: "IoT Farm System",
            tech: "Raspberry Pi • Arduino • MQTT",
            description: "Smart agriculture monitoring solution",
            link: "#",
            year: "2022"
        }
    ];

    const container = document.getElementById('projects');

    function createProjectCard(project) {
        const card = document.createElement('div');
        card.className = 'project-card';
        card.innerHTML = `
            <h3>${project.title}</h3>
            <div class="tech-stack">
                ${project.tech.map(t => `<span class="tech-item">${t}</span>`).join('')}
            </div>
            <p>${project.description}</p>
            <div class="card-footer">
                <span class="year">[${project.year}]</span>
                <div class="button-group">
                    <button class="demo-btn" data-link="${project.link}" data-type="repo">GITHUB REPO</button>
                    <button class="demo-btn" data-link="${project.demo}" data-type="demo">LIVE DEMO</button>
                </div>
            </div>
        `;

        card.querySelectorAll('.demo-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const link = btn.dataset.link;
                if (link && link !== '#') {
                    window.open(link, '_blank');
                } else {
                    btn.textContent = "COMING SOON";
                    btn.disabled = true;
                    setTimeout(() => {
                        const btnType = btn.dataset.type;
                        btn.textContent = btnType === 'repo' ? 'REPO GENERATED' : 'LINK GENERATED';
                        btn.disabled = false;
                        btn.style.backgroundColor = "rgba(0, 255, 0, 0.1)";
                        btn.style.borderColor = "#0f05";
                        btn.style.color = "#0f0";
                        btn.disabled = true;
                    }, 2000);
                }
            });
        });

        card.addEventListener('click', (e) => {
            if (!e.target.closest('.demo-btn')) {
                card.classList.add('active');
                setTimeout(() => card.classList.remove('active'), 500);
            }
        });

        return card;
    }

    projects.forEach(project => {
        container.appendChild(createProjectCard(project));
    });

    // View mode handling
    const viewButtons = document.querySelectorAll('[data-view]');
    const searchInput = document.getElementById('searchInput');
    let currentView = 'grid';

    viewButtons.forEach(button => {
        button.addEventListener('click', () => {
            const view = button.dataset.view;

            // Update active state
            viewButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Apply view mode
            container.className = `projects-container ${view}`;
            currentView = view;

            if (view === 'sphere') {
                arrangeInSphere();
            } else {
                // Reset positioning for grid/list views
                Array.from(container.children).forEach(card => {
                    card.style.transform = '';
                    card.style.position = '';
                    card.style.zIndex = '';
                });
            }
        });
    });

    // Search functionality
    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        const cards = container.children;

        Array.from(cards).forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const tech = card.querySelector('.tech-stack').textContent.toLowerCase();
            const description = card.querySelector('p').textContent.toLowerCase();
            const matches = title.includes(term) || tech.includes(term) || description.includes(term);
            card.style.display = matches ? '' : 'none';
        });

        if (currentView === 'sphere') {
            arrangeInSphere();
        }
    });

    // Enhanced sphere arrangement
    function arrangeInSphere() {
        const cards = Array.from(container.children).filter(c => c.style.display !== 'none');
        const radius = Math.min(window.innerWidth * 0.4, 500);
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;

        cards.forEach((card, i) => {
            const angle = (Math.PI * 2 * i) / cards.length;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;

            card.style.transform = `translate(${centerX + x - 200}px, ${centerY + y - 150}px)`;
            card.style.position = 'absolute';
            card.style.zIndex = i;
        });
    }

    // Handle window resize
    window.addEventListener('resize', () => {
        if (currentView === 'sphere') {
            arrangeInSphere();
        }
    });

    // Initial view setup
    arrangeInSphere();

    // Update theme initialization
    function initializeThemeSwitcher() {
        const savedTheme = localStorage.getItem('portfolioTheme') || 'matrix';
        document.documentElement.setAttribute('data-theme', savedTheme);

        document.querySelectorAll('.dropdown-content button').forEach(btn => {
            if (btn.dataset.theme === savedTheme) {
                btn.innerHTML = `✓ ${btn.textContent}`;
            }

            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const theme = btn.dataset.theme;
                document.documentElement.setAttribute('data-theme', theme);
                localStorage.setItem('portfolioTheme', theme);

                // Update checkmarks
                document.querySelectorAll('.dropdown-content button').forEach(b => {
                    b.innerHTML = b.textContent.replace('✓ ', '');
                });
                btn.innerHTML = `✓ ${btn.textContent}`;
            });
        });
    }

    // Call this at the end of DOMContentLoaded
    initializeThemeSwitcher();
});