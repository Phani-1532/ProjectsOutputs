document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('projects');
    let projectsData = []; // Store projects globally for dynamic updates

    // Fetch projects from JSON file
    fetch('projects.json')
        .then(response => response.json())
        .then(data => {
            projectsData = data.projects;
            initializeApp(projectsData);
        })
        .catch(error => {
            console.error('Error loading projects:', error);
            // Fallback futuristic message
            container.innerHTML = '<p class="error-glow">Transmission Failed: Projects Offline</p>';
        });

    function initializeApp(projects) {
        let isDragging = false;
        let currentDragIndex = -1;
        let initialX = 0, initialY = 0, xOffset = 0, yOffset = 0;

        // Create futuristic particle background
        createParticleBackground();

        function createProjectCard(project, index) {
            const card = document.createElement('div');
            card.className = 'project-card';
            card.dataset.index = index;

            card.innerHTML = `
                <h3 class="holo-title">${project.title}</h3>
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

            // Button click with futuristic animation
            card.querySelectorAll('.demo-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const link = btn.dataset.link;
                    btn.classList.add('pulse-activate');
                    setTimeout(() => btn.classList.remove('pulse-activate'), 300);
                    if (link && link !== '#') {
                        window.open(link, '_blank');
                    } else {
                        btn.textContent = "INITIALIZING...";
                        btn.disabled = true;
                        setTimeout(() => {
                            const btnType = btn.dataset.type;
                            btn.textContent = btnType === 'repo' ? 'REPO ONLINE' : 'DEMO DEPLOYED';
                            btn.disabled = false;
                            btn.classList.add('active');
                        }, 1500);
                    }
                });
            });

            // Card click for holographic zoom
            card.addEventListener('click', (e) => {
                if (!e.target.closest('.demo-btn')) {
                    card.classList.toggle('holo-zoom');
                    if (card.classList.contains('holo-zoom')) {
                        container.appendChild(card); // Bring to front
                    }
                }
            });

            card.draggable = true;
            card.style.cursor = 'grab';
            card.addEventListener('dragstart', handleDragStart);
            card.addEventListener('dragend', handleDragEnd);

            return card;
        }

        // Dynamic card generation with entry animation
        function renderProjects(filteredProjects = projects) {
            container.innerHTML = '';
            filteredProjects.forEach((project, index) => {
                const card = createProjectCard(project, index);
                container.appendChild(card);
                setTimeout(() => card.classList.add('card-appear'), index * 100); // Staggered entry
            });
        }
        renderProjects();

        // View mode handling with transitions
        const viewButtons = document.querySelectorAll('[data-view]');
        const searchInput = document.getElementById('searchInput');
        let currentView = 'grid';

        viewButtons.forEach(button => {
            button.addEventListener('click', () => {
                const view = button.dataset.view;
                viewButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                container.className = `projects-container ${view}`;
                currentView = view;

                if (view === 'sphere') {
                    arrangeInSphere();
                } else {
                    Array.from(container.children).forEach(card => {
                        card.style.transform = '';
                        card.style.position = '';
                        card.style.zIndex = '';
                        card.classList.remove('holo-zoom');
                    });
                }
            });
        });

        // Enhanced search with predictive filtering
        searchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            const filtered = projects.filter(p => 
                p.title.toLowerCase().includes(term) ||
                p.tech.join(' ').toLowerCase().includes(term) ||
                p.description.toLowerCase().includes(term)
            );
            renderProjects(filtered);
            if (currentView === 'sphere') arrangeInSphere();
        });

        // Futuristic sphere arrangement with rotation
        function arrangeInSphere() {
            const cards = Array.from(container.children).filter(c => !c.classList.contains('holo-zoom'));
            const containerRect = container.getBoundingClientRect();
            const radius = Math.min(containerRect.width * 0.4, 500);
            const centerX = containerRect.width / 2;
            const centerY = containerRect.height / 2;

            cards.forEach((card, i) => {
                const angle = (Math.PI * 2 * i) / cards.length + (Date.now() * 0.0001); // Slow rotation
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;

                card.style.transform = `translate(${centerX + x - card.offsetWidth / 2}px, ${centerY + y - card.offsetHeight / 2}px) rotateY(${angle * 10}deg)`;
                card.style.position = 'absolute';
                card.style.zIndex = i;
            });

            requestAnimationFrame(arrangeInSphere); // Continuous animation
        }

        // Drag handlers with futuristic snap
        function handleDragStart(e) {
            if (currentView !== 'sphere') return;
            isDragging = true;
            const card = e.target.closest('.project-card');
            card.style.cursor = 'grabbing';
            card.style.transition = 'none';
            initialX = e.clientX - xOffset;
            initialY = e.clientY - yOffset;
            currentDragIndex = parseInt(card.dataset.index);
            e.dataTransfer.setData('text/plain', currentDragIndex);
        }

        function handleDragEnd(e) {
            if (currentView !== 'sphere') return;
            const card = e.target.closest('.project-card');
            isDragging = false;
            card.style.cursor = 'grab';
            card.style.transition = 'transform 0.5s ease-out';

            const containerRect = container.getBoundingClientRect();
            const centerX = containerRect.width / 2;
            const centerY = containerRect.height / 2;
            const cardRect = card.getBoundingClientRect();
            const distance = Math.hypot(
                (cardRect.left + cardRect.width / 2) - (containerRect.left + centerX),
                (cardRect.top + cardRect.height / 2) - (containerRect.top + centerY)
            );

            if (distance < 150) {
                card.style.transform = `translate(${centerX - card.offsetWidth / 2}px, ${centerY - card.offsetHeight / 2}px) scale(1.2)`;
                card.style.zIndex = 9999;
                card.classList.add('holo-zoom');
            } else {
                arrangeInSphere();
            }
        }

        container.addEventListener('dragover', e => e.preventDefault());
        container.addEventListener('drop', handleDragEnd);

        // Voice command support (futuristic feature)
        if ('webkitSpeechRecognition' in window) {
            const recognition = new webkitSpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = false;

            recognition.onresult = (event) => {
                const command = event.results[0][0].transcript.toLowerCase();
                if (command.includes('grid')) viewButtons[0].click();
                if (command.includes('list')) viewButtons[1].click();
                if (command.includes('sphere')) viewButtons[2].click();
                if (command.includes('search')) {
                    const term = command.split('search')[1]?.trim();
                    if (term) searchInput.value = term;
                    searchInput.dispatchEvent(new Event('input'));
                }
            };

            const voiceBtn = document.createElement('button');
            voiceBtn.textContent = '🎙️ VOICE';
            voiceBtn.className = 'demo-btn';
            document.querySelector('.search-box').appendChild(voiceBtn);
            voiceBtn.addEventListener('click', () => recognition.start());
        }

        // Particle background generator
        function createParticleBackground() {
            const canvas = document.createElement('canvas');
            canvas.className = 'particle-bg';
            document.body.appendChild(canvas);
            const ctx = canvas.getContext('2d');
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;

            const particles = Array.from({ length: 100 }, () => ({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 3 + 1,
                speed: Math.random() * 2 + 0.5
            }));

            function animateParticles() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                particles.forEach(p => {
                    p.y += p.speed;
                    if (p.y > canvas.height) p.y = 0 - p.size;
                    ctx.fillStyle = 'rgba(0, 255, 0, 0.7)';
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                    ctx.fill();
                });
                requestAnimationFrame(animateParticles);
            }
            animateParticles();

            window.addEventListener('resize', () => {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            });
        }

        initializeThemeSwitcher();
        if (currentView === 'sphere') arrangeInSphere();
    }

    function initializeThemeSwitcher() {
        const savedTheme = localStorage.getItem('portfolioTheme') || 'matrix';
        document.documentElement.setAttribute('data-theme', savedTheme);

        document.querySelectorAll('.dropdown-content button').forEach(btn => {
            if (btn.dataset.theme === savedTheme) btn.innerHTML = `✓ ${btn.textContent}`;
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const theme = btn.dataset.theme;
                document.documentElement.setAttribute('data-theme', theme);
                localStorage.setItem('portfolioTheme', theme);
                document.querySelectorAll('.dropdown-content button').forEach(b => {
                    b.innerHTML = b.textContent.replace('✓ ', '');
                });
                btn.innerHTML = `✓ ${btn.textContent}`;
            });
        });
    }
});