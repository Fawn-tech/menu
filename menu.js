// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const searchInput = document.getElementById('searchInput');
    const menuSections = document.querySelectorAll('.menu-section');
    const menuItems = document.querySelectorAll('.menu-item');
    const noResultsMessage = document.getElementById('noResultsMessage');
    const customItemsContainer = document.getElementById('customItemsContainer');
    
    let currentSearchTerm = '';

    // Load custom menu items from localStorage
    loadCustomMenuItems();

    // Search input event listener (real-time filtering)
    searchInput.addEventListener('input', function(e) {
        currentSearchTerm = e.target.value.toLowerCase().trim();
        filterMenu();
    });

    // Main filter function
    function filterMenu() {
        let hasVisibleItems = false;
        const searchTerm = currentSearchTerm;

        // If search is empty, show all items
        if (searchTerm === '') {
            menuItems.forEach(item => {
                item.style.display = 'block';
            });
            
            // Show all custom items
            const customItems = document.querySelectorAll('.custom-menu-item');
            customItems.forEach(item => {
                item.style.display = 'block';
            });
            
            // Show all sections
            menuSections.forEach(section => {
                section.style.display = 'block';
            });
            
            noResultsMessage.style.display = 'none';
            return;
        }

        // Filter regular menu items
        menuItems.forEach(item => {
            const itemName = item.getAttribute('data-name').toLowerCase();
            
            if (itemName.includes(searchTerm)) {
                item.style.display = 'block';
                hasVisibleItems = true;
            } else {
                item.style.display = 'none';
            }
        });

        // Filter custom items (if any)
        const customItems = document.querySelectorAll('.custom-menu-item');
        customItems.forEach(item => {
            const itemName = item.getAttribute('data-name').toLowerCase();
            
            if (itemName.includes(searchTerm)) {
                item.style.display = 'block';
                hasVisibleItems = true;
            } else {
                item.style.display = 'none';
            }
        });

        // Show/hide menu sections based on visible items
        menuSections.forEach(section => {
            const sectionItems = section.querySelectorAll('.menu-item');
            let hasVisibleInSection = false;
            
            sectionItems.forEach(item => {
                if (item.style.display !== 'none') {
                    hasVisibleInSection = true;
                }
            });
            
            // Also check for custom items in this section
            const customItemsInSection = document.querySelectorAll(`.custom-menu-item`);
            customItemsInSection.forEach(item => {
                if (item.style.display !== 'none') {
                    hasVisibleInSection = true;
                }
            });
            
            section.style.display = hasVisibleInSection ? 'block' : 'none';
        });

        // Show/hide no results message
        if (!hasVisibleItems && searchTerm !== '') {
            noResultsMessage.style.display = 'block';
        } else {
            noResultsMessage.style.display = 'none';
        }
    }

    // Function to load custom menu items from localStorage
    function loadCustomMenuItems() {
        const customItems = JSON.parse(localStorage.getItem('customMenuItems')) || [];
        
        if (customItems.length > 0) {
            // Group custom items by category
            const itemsByCategory = {};
            customItems.forEach(item => {
                if (!itemsByCategory[item.category]) {
                    itemsByCategory[item.category] = [];
                }
                itemsByCategory[item.category].push(item);
            });

            // Create sections for each category with custom items
            Object.keys(itemsByCategory).forEach(category => {
                // Find existing section for this category
                let section = null;
                const sections = document.querySelectorAll('.menu-section');
                
                // Try to match category with existing sections
                sections.forEach(sec => {
                    const heading = sec.querySelector('h2');
                    if (heading && heading.textContent.toLowerCase().includes(category.toLowerCase())) {
                        section = sec;
                    }
                });
                
                if (!section) {
                    // Create new section if no match found
                    section = document.createElement('section');
                    section.className = 'menu-section';
                    
                    const heading = document.createElement('h2');
                    heading.textContent = category.charAt(0).toUpperCase() + category.slice(1) + ' (Custom)';
                    section.appendChild(heading);
                    
                    const grid = document.createElement('div');
                    grid.className = 'menu-grid';
                    section.appendChild(grid);
                    
                    document.getElementById('menuContainer').appendChild(section);
                }

                // Get or create grid for the section
                let menuGrid = section.querySelector('.menu-grid');
                if (!menuGrid) {
                    menuGrid = document.createElement('div');
                    menuGrid.className = 'menu-grid';
                    section.appendChild(menuGrid);
                }
                
                // Add custom items to the section
                itemsByCategory[category].forEach(item => {
                    const menuItem = createCustomMenuItemElement(item);
                    menuGrid.appendChild(menuItem);
                });
            });
        }
    }

    // Helper function to create custom menu item element
    function createCustomMenuItemElement(item) {
        const menuItem = document.createElement('div');
        menuItem.className = 'menu-item custom-menu-item';
        menuItem.setAttribute('data-name', item.name);
        menuItem.setAttribute('data-category', item.category);
        
        menuItem.innerHTML = `
            <img src="${item.image || 'https://via.placeholder.com/150x150/8e44ad/ffffff?text=Custom+Dish'}" 
                 alt="${item.name}" 
                 style="width: 100%; height: 150px; object-fit: cover; border-radius: 5px; margin-bottom: 1rem;">
            <h3>${item.name}</h3>
            <p>${item.description || 'A delicious custom dish'}</p>
            <span class="price">$${item.price || '9.99'}</span>
        `;
        
        return menuItem;
    }

    // Debounce function for better performance
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Replace the input event listener with debounced version
    const debouncedFilter = debounce(filterMenu, 300);
    searchInput.removeEventListener('input', filterMenu);
    searchInput.addEventListener('input', function(e) {
        currentSearchTerm = e.target.value.toLowerCase().trim();
        debouncedFilter();
    });

    // Add keyboard support for search
    searchInput.addEventListener('keyup', function(e) {
        if (e.key === 'Escape') {
            this.value = '';
            currentSearchTerm = '';
            filterMenu();
        }
    });

    // Initialize with all items visible
    filterMenu();
});