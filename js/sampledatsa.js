document.addEventListener('DOMContentLoaded', function() {

    const categories = ['all', 'appetizers', 'omelette', 'katsu', 'drinks', 'desserts', 'dessert'];
   
    const sidebarItems = document.querySelectorAll('.sidebar ul li');
    
    if (sidebarItems.length < categories.length) {
    
      const sidebar = document.querySelector('.sidebar ul');
      
      categories.forEach(category => {
        const item = document.createElement('li');
        
     
        switch(category) {
          case 'all':
            item.textContent = 'All Items';
            break;
          case 'appetizers':
            item.textContent = 'Chicken';
            break;
          case 'omelette':
            item.textContent = 'Pasta and Salad';
            break;
          case 'katsu':
            item.textContent = 'Burgers';
            break;
          case 'drinks':
            item.textContent = 'Drinks';
            break;
          case 'desserts':
            item.textContent = 'Pizza';
            break;
            case 'dessert':
                item.textContent = 'Dessert';
                break;
        }
        
        item.setAttribute('data-category', category);
        sidebar.appendChild(item);
      });
    } else {
      
      sidebarItems.forEach((item, index) => {
        if (index < categories.length) {
          item.setAttribute('data-category', categories[index]);
        }
      });
    }
    

    document.querySelector('.sidebar ul li[data-category="all"]').classList.add('active');
    
  
    const allItems = Array.from(document.querySelectorAll('.menu-item'));
    

    const itemsByCategory = {
      'all': allItems,
      
      // Chicken category
      'appetizers': allItems.filter(item => {
        const title = item.querySelector('h3').textContent.trim();
        return title === 'Small Group Chicken' || 
               title === 'Large Chicken' || 
               title === 'Single Meal Chicken';
      }),
      
      // Pasta and Salad category
      'omelette': allItems.filter(item => {
        const title = item.querySelector('h3').textContent.trim();
        return title === 'Asian Pasta' || 
               title === 'Charlie Chan' ||
               title === 'Spaghetti' ||
               title === 'Meatball Spaghetti' ||
               title === 'Italian Spaghetti' ||
               title === 'Carbonara' ||
               title === 'Creole';
      }),
      
      // Burgers category
      'katsu': allItems.filter(item => {
        const title = item.querySelector('h3').textContent.trim();
        return title === 'Ghost Burger' || 
        title === 'Big Burger' ||
        title === 'Crispy Burger' ||
        title === 'Combo Meal' ||
               title === 'Chicken Burger';
      }),
      
      // Drinks category
      'drinks': allItems.filter(item => {
        const title = item.querySelector('h3').textContent.trim();
        return title.includes('Drink');
      }),
      
      // Pizza category
      'desserts': allItems.filter(item => {
        const title = item.querySelector('h3').textContent.trim();
        return title.includes('Pizza');
      }),

      'dessert': allItems.filter(item => {
        const title = item.querySelector('h3').textContent.trim();
        return title.includes('Dessert');
      })
    };
    
  
    const menuContent = document.querySelector('.menu-content');
    const menuGrid = document.querySelector('.menu-grid');
    
    Object.keys(itemsByCategory).forEach((category, index) => {
 
      const categoryContainer = document.createElement('div');
      categoryContainer.id = category;
      categoryContainer.className = 'category-container' + (category === 'all' ? ' active' : '');
      
      
      const categoryTitle = document.createElement('h1');
      categoryTitle.style.color = '#502314';
      categoryTitle.style.fontWeight = 'bold';
      
    
      switch(category) {
        case 'all':
          categoryTitle.textContent = 'All Items';
          break;
        case 'appetizers':
          categoryTitle.textContent = 'Chicken';
          break;
        case 'omelette':
          categoryTitle.textContent = 'Pasta and Salad';
          break;
        case 'katsu':
          categoryTitle.textContent = 'Burgers';
          break;
        case 'drinks':
          categoryTitle.textContent = 'Drinks';
          break;
        case 'desserts':
          categoryTitle.textContent = 'Pizza';
          break;
          case 'dessert':
          categoryTitle.textContent = 'dessert';
          break;
      }
      
      // Create grid for menu items
      const categoryGrid = document.createElement('div');
      categoryGrid.className = 'menu-grid';
      
      // Add items to grid
      itemsByCategory[category].forEach(item => {
        const itemClone = item.cloneNode(true);
        categoryGrid.appendChild(itemClone);
      });
      
      // Add title and grid to container
      categoryContainer.appendChild(categoryTitle);
      categoryContainer.appendChild(categoryGrid);
      
      // Add container to menu content
      if (category === 'all') {
        if (menuGrid) {
          menuContent.replaceChild(categoryContainer, menuGrid);
        } else {
          menuContent.appendChild(categoryContainer);
        }
      } else {
        menuContent.appendChild(categoryContainer);
      }
    });
    
    // Add click handlers for sidebar items
    const allSidebarItems = document.querySelectorAll('.sidebar ul li');
    allSidebarItems.forEach(item => {
      item.addEventListener('click', function() {
        const category = this.getAttribute('data-category');
        if (!category) return;
        
        // Update active state
        allSidebarItems.forEach(el => el.classList.remove('active'));
        this.classList.add('active');
        
        // Hide all categories
        document.querySelectorAll('.category-container').forEach(container => {
          container.style.display = 'none';
        });
        
        // Show selected category
        const selectedCategory = document.getElementById(category);
        if (selectedCategory) {
          selectedCategory.style.display = 'block';
        }
      });
    });
  });
  
  // Add CSS for category display
  const style = document.createElement('style');
  style.textContent = `
    .category-container {
      display: none;
    }
    .category-container.active {
      display: block;
    }
  `;
  document.head.appendChild(style);