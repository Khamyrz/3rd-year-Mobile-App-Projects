// Hamburger menu animation
function toggleHamburger(menuButton) {
    if (menuButton) {
        menuButton.classList.toggle('active');
        const hamburger = menuButton.querySelector('.hamburger-menu');
        if (hamburger) {
            hamburger.classList.toggle('active');
        }
    }
}

// Toggle sidebar with animation
function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.overlay');
    const menuButton = document.querySelector('.menu-button');
    
    if (sidebar && overlay) {
        sidebar.classList.toggle('active');
        overlay.classList.toggle('active');
        toggleHamburger(menuButton);
        
        // Toggle scroll lock
        document.body.style.overflow = 
            sidebar.classList.contains('active') ? 'hidden' : 'auto';
    }
}

// Close sidebar with animation
function closeSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.overlay');
    const menuButton = document.querySelector('.menu-button');
    
    if (sidebar && overlay) {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
        if (menuButton) {
            menuButton.classList.remove('active');
            const hamburger = menuButton.querySelector('.hamburger-menu');
            if (hamburger) {
                hamburger.classList.remove('active');
            }
        }
        document.body.style.overflow = 'auto';
    }
}

// Initialize sidebar functionality
document.addEventListener('DOMContentLoaded', () => {
    // Add click event listeners
    const menuButtons = document.querySelectorAll('.menu-button');
    menuButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleSidebar();
        });
    });

    // Add click event listener to overlay
    const overlay = document.querySelector('.overlay');
    if (overlay) {
        overlay.addEventListener('click', closeSidebar);
    }

    // Add click event listener to close button
    const closeButton = document.querySelector('.close-sidebar');
    if (closeButton) {
        closeButton.addEventListener('click', (e) => {
            e.preventDefault();
            closeSidebar();
        });
    }

    // Add hover effects to menu items
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        const icon = item.querySelector('i');
        if (icon) {
            item.addEventListener('mouseenter', () => {
                icon.style.transform = 'scale(1.2)';
            });
            
            item.addEventListener('mouseleave', () => {
                icon.style.transform = 'scale(1)';
            });
        }
    });

    // Handle escape key to close sidebar
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeSidebar();
        }
    });
}); 