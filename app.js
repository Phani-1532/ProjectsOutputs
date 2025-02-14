document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('projects');

    // Fetch projects from JSON file
    fetch('projects.json')
        .then(response => response.json())
        .then(data => {
            // Initialize with fetched projects
            initializeApp(data.projects);
        })
        .catch(error => console.error('Error loading projects:', error));

    function initializeApp(projects) {
        const container = document.getElementById('projects');

        // Add these variables at the top of the initializeApp function
        let isDragging = false;
        let currentDragIndex = -1;
        let initialX = 0;
        let initialY = 0;
        let xOffset = 0;
        let yOffset = 0;

        function createProjectCard(project, index) {
            const card = document.createElement('div');
            card.className = 'project-card';
            card.dataset.index = index; // Store index for drag-and-drop



            // Existing content setup...
            card.innerHTML += `
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

            // Add this inside the createProjectCard function before return card
            card.draggable = true;
            card.style.cursor = 'grab';

            // Add drag event handlers to the card
            card.addEventListener('dragstart', handleDragStart);
            card.addEventListener('dragend', handleDragEnd);

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
            const cards = Array.from(container.children)
                .filter(c => c.style.display !== 'none' && !c.classList.contains('centered-card'));

            const containerRect = container.getBoundingClientRect();
            const radius = Math.min(containerRect.width * 0.4, 500);
            const centerX = containerRect.width / 2;
            const centerY = containerRect.height / 2;

            cards.forEach((card, i) => {
                const angle = (Math.PI * 2 * i) / cards.length;
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;

                card.style.transform = `translate(
                    ${centerX + x - card.offsetWidth / 2}px, 
                    ${centerY + y - card.offsetHeight / 2}px
                )`;
                card.style.position = 'absolute';
                card.style.zIndex = i;
                card.classList.remove('centered-card');
            });
        }

        // Handle window resize
        window.addEventListener('resize', () => {
            if (currentView === 'sphere') {
                arrangeInSphere();
            }
        });

        // Initial arrangement based on current view
        if (currentView === 'sphere') {
            arrangeInSphere();
        }

        // Update theme initialization
        initializeThemeSwitcher();

        // Add these new functions inside initializeApp
        function handleDragStart(e) {
            if (currentView !== 'sphere') return;

            isDragging = true;
            const card = e.target.closest('.project-card');
            card.style.cursor = 'grabbing';
            card.style.transition = 'none';

            initialX = e.clientX - xOffset;
            initialY = e.clientY - yOffset;

            if (e.target === card) {
                currentDragIndex = parseInt(card.dataset.index);
            }
        }

        function handleDragEnd(e) {
            if (currentView !== 'sphere') return;

            const card = e.target.closest('.project-card');
            if (!card || !isDragging) return;

            isDragging = false;
            card.style.cursor = 'grab';
            card.style.transition = 'transform 0.3s ease';

            // Get container dimensions and position
            const containerRect = container.getBoundingClientRect();
            const containerCenterX = containerRect.left + containerRect.width / 2;
            const containerCenterY = containerRect.top + containerRect.height / 2;

            // Get card position relative to viewport
            const cardRect = card.getBoundingClientRect();
            const cardCenterX = cardRect.left + cardRect.width / 2;
            const cardCenterY = cardRect.top + cardRect.height / 2;

            // Calculate distance from container center
            const dx = cardCenterX - containerCenterX;
            const dy = cardCenterY - containerCenterY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // Use DataTransfer API for proper drop handling
            if (distance < 150) {
                const dataTransfer = e.dataTransfer;
                dataTransfer.dropEffect = 'move';
                // Calculate new position relative to container
                const newX = containerRect.width / 2 - cardRect.width / 2;
                const newY = containerRect.height / 2 - cardRect.height / 2;

                card.style.transform = `translate(${newX}px, ${newY}px)`;
                card.style.zIndex = 9999;
                card.classList.add('centered-card');

                // Add physics-like animation
                card.style.transition = 'transform 0.5s cubic-bezier(0.18, 0.89, 0.32, 1.28)';
            } else {
                // Return to sphere with smooth transition
                card.style.transition = 'transform 0.5s ease-out';
                arrangeInSphere();
            }
        }

        function handleDragOver(e) {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
        }

        function handleDrop(e) {
            e.preventDefault();
            const containerRect = container.getBoundingClientRect();
            const dropX = e.clientX - containerRect.left;
            const dropY = e.clientY - containerRect.top;

            // Calculate center position
            const centerX = containerRect.width / 2;
            const centerY = containerRect.height / 2;

            if (Math.abs(dropX - centerX) < 100 && Math.abs(dropY - centerY) < 100) {
                const draggedIndex = e.dataTransfer.getData('text/plain');
                const draggedCard = container.children[draggedIndex];

                // Animate to center
                draggedCard.style.transform = `translate(${centerX - draggedCard.offsetWidth / 2}px, 
                    ${centerY - draggedCard.offsetHeight / 2}px)`;
                draggedCard.classList.add('centered-card');
            }
        }

        // Add container as a drop zone
        container.addEventListener('dragover', handleDragOver);
        container.addEventListener('drop', handleDrop);
    }

    // Keep these functions outside the initializeApp if they need to be called later
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
});

// Add this CSS to your stylesheet
