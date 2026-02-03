document.addEventListener('DOMContentLoaded', () => {
    // 0. Inject Sidebar
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
        // Calculate root path based on recursion depth or location
        // Simple heuristic: count occurrences of "/" in pathname relative to docs root
        // But since we don't know the absolute root easily on local filesystem without config,
        // we can check if we are in a subdirectory by checking if ../ works or by explicit depth.
        // Better yet: Just infer from the current script source if possible, or assume standard structure.

        // Let's use a robust method: check existing links or meta tags? No, let's count directories up from current location.
        // Assuming:
        // docs/index.html -> depth 0
        // docs/tutorials/foo.html -> depth 1
        // docs/reference/protocols/bar.html -> depth 2

        // We can check how many levels deep we are by splitting the pathname
        // However, checking for "docs" in path is risky if it's renamed.
        // Let's try to detect based on known structure.

        // Calculate root path by finding the 'docs' segment in the path
        // This is safer than guessing based on folder names like 'tutorials' which might appear elsewhere

        let rootPath = '';
        const path = window.location.pathname;
        const segments = path.split('/');

        // Find the index of the 'docs' folder
        // We look for the *last* occurrence in case it's nested deep (unlikely but safe)
        const docsIndex = segments.lastIndexOf('docs');

        if (docsIndex !== -1) {
            // Calculate how deep we are relative to docs/
            // segments: [..., 'docs', 'tutorials', 'index.html'] -> length is docsIndex + 2 + 1? No.
            // Example: /foo/docs/index.html -> segments[docsIndex] is 'docs'. Next is 'index.html'. Depth 0.
            // Example: /foo/docs/tutorials/foo.html -> 'tutorials', 'foo.html'. Depth 1.

            // Current depth is total segments minus (docsIndex + 1) minus 1 (for filename)
            // But trailing slash issues might exist? Assume file paths usually.

            const depth = segments.length - (docsIndex + 2);
            // If at docs/index.html: length is N. docs is at N-2. depth = N - (N-2+2) = 0.

            if (depth > 0) {
                rootPath = '../'.repeat(depth);
            }
        } else {
            // Fallback to the heuristic if 'docs' is renamed or not found
            if (segments.includes('tutorials') || segments.includes('support') || segments.includes('css') || segments.includes('js')) {
                rootPath = '../';
            } else if (segments.includes('reference')) {
                if (segments.includes('protocols') || segments.includes('features') || segments.includes('engines')) {
                    rootPath = '../../';
                } else {
                    rootPath = '../';
                }
            }
        }

        console.log(`Current Path: ${path}, Root Path Calculated: ${rootPath}`);

        // If we are at root (index.html), rootPath stays empty.
        // Edge case: what if `tutorials` is in the folder name higher up?
        // Let's assume standard structure for now.

        sidebar.innerHTML = `
        <a href="${rootPath}index.html" class="logo">
            <div class="logo-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
            </div>
            <span class="logo-text">Control It Docs</span>
        </a>

        <!-- Navigation Menu -->
        <div class="nav-menu">

            <!-- Getting Started -->
            <div class="nav-section-title">Getting Started</div>
            <a href="${rootPath}index.html" class="nav-link">
                <span>Overview</span>
            </a>

            <!-- Tutorials -->
            <div class="nav-section-title">Tutorials</div>
            <a href="#" class="nav-link has-submenu">
                <span>Step-by-Step Guides</span>
                <svg class="chevron" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
                </svg>
            </a>
            <ul class="submenu">
                <li><a href="${rootPath}tutorials/index_tutorial.html" class="nav-link">All Tutorials</a></li>
                <li><a href="${rootPath}tutorials/http_actions_tutorial.html" class="nav-link">Mastering HTTP</a></li>
                <li><a href="${rootPath}tutorials/osc_control_tutorial.html" class="nav-link">Advanced OSC</a></li>
                <li><a href="${rootPath}tutorials/midi_studio_tutorial.html" class="nav-link">MIDI Studio Setup</a></li>
                <li><a href="${rootPath}tutorials/polling_tutorial.html" class="nav-link">Deep Dive: Polling</a></li>
                <li><a href="${rootPath}tutorials/collaborative_tutorial.html" class="nav-link">Collaborative Grids</a></li>
                <li><a href="${rootPath}tutorials/shop_tutorial.html" class="nav-link">Publishing to Shop</a></li>
                <li><a href="${rootPath}tutorials/http_server_tutorial.html" class="nav-link">HTTP Server Engine</a></li>
                <li><a href="${rootPath}tutorials/midi_engine_tutorial.html" class="nav-link">MIDI Engine</a></li>
                <li><a href="${rootPath}tutorials/web_bridge_tutorial.html" class="nav-link">Web Bridge Setup</a></li>
            </ul>

            <!-- Reference: Protocols -->
            <div class="nav-section-title">Reference</div>
            <a href="#" class="nav-link has-submenu">
                <span>Protocols</span>
                <svg class="chevron" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
                </svg>
            </a>
            <ul class="submenu">
                <li><a href="${rootPath}reference/protocols/http.html" class="nav-link">HTTP / HTTPS</a></li>
                <li><a href="${rootPath}reference/protocols/osc.html" class="nav-link">OSC (Open Sound Control)</a></li>
                <li><a href="${rootPath}reference/protocols/tcp_udp.html" class="nav-link">TCP & UDP</a></li>
                <li><a href="${rootPath}reference/protocols/midi.html" class="nav-link">MIDI</a></li>
            </ul>

            <!-- Reference: Features -->
            <a href="#" class="nav-link has-submenu">
                <span>Features</span>
                <svg class="chevron" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
                </svg>
            </a>
            <ul class="submenu">
                <li><a href="${rootPath}reference/features/collaborative.html" class="nav-link">Collaborative Grids</a></li>
                <li><a href="${rootPath}reference/features/shop.html" class="nav-link">The Shop</a></li>
                <li><a href="${rootPath}reference/features/polling.html" class="nav-link">Polling & Regex</a></li>
            </ul>

            <!-- Reference: Engines -->
            <a href="#" class="nav-link has-submenu">
                <span>Engines</span>
                <svg class="chevron" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
                </svg>
            </a>
            <ul class="submenu">
                <li><a href="${rootPath}reference/engines/http_server.html" class="nav-link">HTTP Trigger Server</a></li>
                <li><a href="${rootPath}reference/engines/midi_engine.html" class="nav-link">MIDI Engine</a></li>
                <li><a href="${rootPath}reference/engines/bluetooth.html" class="nav-link">Bluetooth Bridge</a></li>
            </ul>

            <!-- Support -->
            <div class="nav-section-title">Support</div>
            <a href="${rootPath}support/troubleshooting.html" class="nav-link">
                <span>Troubleshooting</span>
            </a>
        </div>
        `;
    }

    // 1. Highlight Active Link & Expand Parent Menu
    const currentPath = window.location.pathname;
    // Handle both strict matches and "index.html" defaults
    const filename = currentPath.split('/').pop() || 'index.html';

    // Select all nav links (both top-level and submenu items)
    const links = document.querySelectorAll('.nav-link');

    links.forEach(link => {
        const href = link.getAttribute('href');
        // Handle relative paths (e.g. "../protocols/http.html" -> "http.html")
        // This simple check assumes unique filenames which is generally true here
        if (href && href.endsWith(filename)) {
            link.classList.add('active');

            // If this link is inside a submenu, open the submenu
            const parentSubmenu = link.closest('.submenu');
            if (parentSubmenu) {
                parentSubmenu.classList.add('open');
                // Also mark the parent toggle as expanded
                const parentToggle = parentSubmenu.previousElementSibling;
                if (parentToggle) {
                    parentToggle.classList.add('expanded');
                }
            }
        }
    });

    // 2. Handle Submenu Toggles
    const toggles = document.querySelectorAll('.nav-link.has-submenu');

    toggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent navigation for toggle items

            // Toggle expanded class on the button itself
            toggle.classList.toggle('expanded');

            // Toggle the visibility of the sibling submenu
            const submenu = toggle.nextElementSibling;
            if (submenu) {
                submenu.classList.toggle('open');
            }
        });
    });

    // 3. Smooth Scroll for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });

                // Close mobile sidebar if open
                if (window.innerWidth <= 768) {
                    toggleSidebar(false);
                }
            }
        });
    });

    // 4. Mobile Menu Injection
    injectMobileMenu();

    function injectMobileMenu() {
        // Create Toggle Button
        const btn = document.createElement('button');
        btn.className = 'menu-toggle';
        btn.innerHTML = `
            <svg viewBox="0 0 24 24">
                <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
            </svg>
        `;
        document.body.appendChild(btn);

        // Create Overlay
        const overlay = document.createElement('div');
        overlay.className = 'sidebar-overlay';
        document.body.appendChild(overlay);

        // Event Listeners
        btn.addEventListener('click', () => {
            toggleSidebar(true);
        });

        overlay.addEventListener('click', () => {
            toggleSidebar(false);
        });

        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') toggleSidebar(false);
        });
    }

    function toggleSidebar(show) {
        const sidebar = document.querySelector('.sidebar');
        const overlay = document.querySelector('.sidebar-overlay');

        if (show) {
            sidebar?.classList.add('open');
            overlay?.classList.add('visible');
        } else {
            sidebar?.classList.remove('open');
            overlay?.classList.remove('visible');
        }
    }
});
