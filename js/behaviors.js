
//Inactivity Timer 
//let inactivityTimer;

//function redirectToIndex() {
  // window.location.href = "index.php";
//}

//function resetInactivityTimer() {
 //   clearTimeout(inactivityTimer);
  //  inactivityTimer = setTimeout(redirectToIndex, 30000); // 30 seconds
//}


//['mousemove', 'mousedown', 'keypress', 'touchstart', 'click'].forEach(event => {
  //  document.addEventListener(event, resetInactivityTimer, false);
//});


//window.onload = () => {
  //  resetInactivityTimer();
//};
//end of inactivty timer




//banner or ads? parallax
document.addEventListener("DOMContentLoaded", function() {
    const header = document.querySelector('.header');
    const images = [
        'images/adsBanner/1.png',
        'images/adsBanner/4.png'
    ];

    let currentIndex = 0;

    setInterval(() => {
        currentIndex = (currentIndex + 1) % images.length;
        header.style.backgroundImage = `url('${images[currentIndex]}')`;
    }, 3000);
});

// end of banner parall



//scroll behavior
document.addEventListener('DOMContentLoaded', function() {
    const sidebar = document.querySelector('.sidebar');
    
    let isDragging = false;
    let startY;
    let scrollTop;
    

    sidebar.addEventListener('mousedown', function(e) {

        if (e.target.tagName !== 'A' && e.target.tagName !== 'BUTTON') {
            isDragging = true;
            startY = e.pageY;
            scrollTop = sidebar.scrollTop;
            sidebar.classList.add('dragging');
            e.preventDefault();
        }
    });
    
    document.addEventListener('mousemove', function(e) {
        if (!isDragging) return;
        const y = e.pageY;
        const walk = (y - startY) * 100; //speed
        sidebar.scrollTop = scrollTop - walk;
    });
    
    document.addEventListener('mouseup', function() {
        isDragging = false;
        sidebar.classList.remove('dragging');
    });
     
  
 
    sidebar.addEventListener('touchstart', function(e) {
       
        if (e.target.tagName !== 'A' && e.target.tagName !== 'BUTTON') {
            isDragging = true;
            startY = e.touches[0].pageY;
            scrollTop = sidebar.scrollTop;
            sidebar.classList.add('dragging');
        }
    }, { passive: false });
    
    sidebar.addEventListener('touchmove', function(e) {
        if (!isDragging) return;
        const y = e.touches[0].pageY;
        const walk = (y - startY) * 100;
        sidebar.scrollTop = scrollTop - walk;
        e.preventDefault(); 
    }, { passive: false });
    
    document.addEventListener('touchend', function() {
        isDragging = false;
        sidebar.classList.remove('dragging');
    });
    

    document.addEventListener('mouseleave', function() {
        if (isDragging) {
            isDragging = false;
            sidebar.classList.remove('dragging');
        }
    });
    
 
    sidebar.addEventListener('click', function(e) {
        if (isDragging) {
            e.preventDefault();
            e.stopPropagation();
        }
    });
});

//end of scroll behavior

document.addEventListener('DOMContentLoaded', function () {
    function applyDragScroll(containerSelector) {
        const container = document.querySelector(containerSelector);

        if (!container) return;

        let isDragging = false;
        let startY;
        let scrollTop;

        // Mouse Events
        container.addEventListener('mousedown', function (e) {
            if (e.target.tagName !== 'A' && e.target.tagName !== 'BUTTON') {
                isDragging = true; 
                startY = e.pageY;
                scrollTop = container.scrollTop;
                container.classList.add('dragging');
                e.preventDefault();
            }
        });

        document.addEventListener('mousemove', function (e) {
            if (!isDragging) return;
            const y = e.pageY;
            const walk = (y - startY) * 1000;
            container.scrollTop = scrollTop - walk;
        });

        document.addEventListener('mouseup', function () {
            isDragging = false;
            container.classList.remove('dragging'); 
        });

        // Touch Events
        container.addEventListener('touchstart', function (e) {
            if (e.target.tagName !== 'A' && e.target.tagName !== 'BUTTON') {
                isDragging = true;
                startY = e.touches[0].pageY;
                scrollTop = container.scrollTop;
                container.classList.add('dragging');
            }
        }, { passive: false });

        container.addEventListener('touchmove', function (e) {
            if (!isDragging) return;
            const y = e.touches[0].pageY;
            const walk = (y - startY) * 1000;
            container.scrollTop = scrollTop - walk;
            e.preventDefault();
        }, { passive: false });

        document.addEventListener('touchend', function () {
            isDragging = false;
            container.classList.remove('dragging');
        });

        document.addEventListener('mouseleave', function () {
            if (isDragging) {
                isDragging = false;
                container.classList.remove('dragging');
            }
        });

        container.addEventListener('click', function (e) {
            if (isDragging) {
                e.preventDefault();
                e.stopPropagation();
            }
        });
    }

    // Apply to both .sidebar and .menu-content
    applyDragScroll('.sidebar');
    applyDragScroll('.menu-content');
});



//added behaviors of scrolls //menugrid scroll drag


//end

//fullscreen autmatics agad agad

function enableFullScreen() {
 
    const elem = document.documentElement;
    

    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) { 
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { 
      elem.msRequestFullscreen();
    } else if (elem.mozRequestFullScreen) { 
      elem.mozRequestFullScreen();
    }
  }
  

  document.addEventListener('DOMContentLoaded', function() {
   
    enableFullScreen();
    
    
    document.addEventListener('click', function onFirstClick() {
      enableFullScreen();
      document.removeEventListener('click', onFirstClick);
    }, { once: true });
  });
  //end autmatic fullscreen

  //disable inspect screen element// for not debuggingh
  document.addEventListener('contextmenu', function (e) {
    e.preventDefault();
  });


  //MOBILE SIDEBAR SCROLL//

  document.addEventListener('DOMContentLoaded', function() {
    const sidebar = document.querySelector('.sidebar');
    const leftArrow = document.querySelector('.sidebar-arrow-left');
    const rightArrow = document.querySelector('.sidebar-arrow-right');
    

    function isMobile() {
        return window.innerWidth <= 768;
    }
    
    if (sidebar) { 
        let isScrolling = false;
        let startX, scrollLeft;
        
        // Mouse event handlers
        sidebar.addEventListener('mousedown', (e) => {
            isScrolling = true;
            sidebar.classList.add('sidebar-dragging');
            startX = e.pageX - sidebar.offsetLeft;
            scrollLeft = sidebar.scrollLeft;
            e.preventDefault(); 
        });
        
        document.addEventListener('mousemove', (e) => {
            if (!isScrolling) return;
            
            e.preventDefault();
            const x = e.pageX - sidebar.offsetLeft;
            const walk = (startX - x) * 1.5; 
            sidebar.scrollLeft = scrollLeft + walk;
        });
        
        document.addEventListener('mouseup', () => {
            isScrolling = false;
            sidebar.classList.remove('sidebar-dragging');
        });
        
        sidebar.addEventListener('mouseleave', () => {
            if (isScrolling) {
                isScrolling = false;
                sidebar.classList.remove('sidebar-dragging');
            }
        });
        
  
        sidebar.addEventListener('touchstart', (e) => {
            isScrolling = true;
            startX = e.touches[0].pageX - sidebar.offsetLeft;
            scrollLeft = sidebar.scrollLeft;
        }, { passive: false });
        
        sidebar.addEventListener('touchmove', (e) => {
            if (!isScrolling) return;
            
            const x = e.touches[0].pageX - sidebar.offsetLeft;
            const walk = (startX - x) * 1.5; // Adjust scrolling speed
            sidebar.scrollLeft = scrollLeft + walk;
        }, { passive: false });
        
        sidebar.addEventListener('touchend', () => {
            isScrolling = false;
        });
        
    
        if (leftArrow && rightArrow) {
         
            const scrollStep = 150;
            
            leftArrow.addEventListener('click', () => {
                sidebar.scrollLeft -= scrollStep;
                updateArrowVisibility();
            });
            
            rightArrow.addEventListener('click', () => {
                sidebar.scrollLeft += scrollStep;
                updateArrowVisibility();
            });
            

            function updateArrowVisibility() {
                const hasScrollLeft = sidebar.scrollLeft > 0;
                const hasScrollRight = sidebar.scrollLeft < (sidebar.scrollWidth - sidebar.clientWidth - 5);
                
                leftArrow.style.opacity = hasScrollLeft ? '1' : '0.3';
                rightArrow.style.opacity = hasScrollRight ? '1' : '0.3';
                
          
                leftArrow.disabled = !hasScrollLeft;
                rightArrow.disabled = !hasScrollRight;
            }
            

            sidebar.addEventListener('scroll', updateArrowVisibility);
            
 
            updateArrowVisibility();
        }
        

        function checkOverflow() {
            if (sidebar.scrollWidth > sidebar.clientWidth) {
           
                if (leftArrow) leftArrow.style.display = 'flex';
                if (rightArrow) rightArrow.style.display = 'flex';
            } else {
              
                if (leftArrow) leftArrow.style.display = 'none';
                if (rightArrow) rightArrow.style.display = 'none';
            }
        }
        
    
        checkOverflow();
        window.addEventListener('resize', checkOverflow);
        
       
        const style = document.createElement('style');
        style.textContent = `
            .sidebar-container {
                position: relative !important;
            }
            
            /* For browsers that support it, improve scroll behavior */
            .sidebar {
                scroll-behavior: smooth !important;
            }
            
            /* Styling for when dragging is active */
            .sidebar-dragging {
                cursor: grabbing !important;
                user-select: none !important;
            }
            
            /* Default drag cursor */
            .sidebar {
                cursor: grab !important;
            }
            
            /* Active state for buttons */
            .sidebar-arrow:active {
                transform: translateY(-50%) scale(0.95) !important;
            }
            
            /* Disabled state for buttons */
            .sidebar-arrow[disabled] {
                opacity: 0.3 !important;
                cursor: default !important;
            }
        `;
        document.head.appendChild(style);
    }
});

// iOS Safari Mobile Detection and Modal Content Fix
function detectiOSSafariMobile() {
    const userAgent = navigator.userAgent;
    const platform = navigator.platform;
    const maxTouchPoints = navigator.maxTouchPoints;
    
    // Check for iOS devices
    const isIOS = /iPad|iPhone|iPod/.test(userAgent) || 
                 (platform === 'MacIntel' && maxTouchPoints > 1);
    
    // Check for Safari browser (not Chrome on iOS)
    const isSafari = /Safari/.test(userAgent) && !/Chrome|CriOS|FxiOS|EdgiOS/.test(userAgent);
    
    // Check for mobile screen size
    const isMobile = window.innerWidth <= 768;
    
    // Additional Safari checks
    const hasWebkit = /WebKit/.test(userAgent);
    const hasVersion = /Version\//.test(userAgent);
    
    return isIOS && isSafari && isMobile && hasWebkit && hasVersion;
}

// Apply iOS Safari specific styling to .modal-content1
function applyiOSSafariModalFix() {
    if (detectiOSSafariMobile()) {
        // Apply styles directly to existing .modal-content1 elements
        const modalElements = document.querySelectorAll('.modal-content1');
        modalElements.forEach(element => {
            element.style.paddingBottom = '80px';
        });
        
        // Watch for dynamically added .modal-content elements
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(function(node) {
                        if (node.nodeType === 1) { // Element node
                            // Check if the added node is .modal-content
                            if (node.classList && node.classList.contains('modal-content1')) {
                                node.style.paddingBottom = '80px';
                            }
                            // Check for .modal-content within added nodes
                            const modalContents = node.querySelectorAll('.modal-content1');
                            modalContents.forEach(element => {
                                element.style.paddingBottom = '80px';
                            });
                        }
                    });
                }
            });
        });
        
        // Start observing
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        return true;
    }
    return false;
}

// Initialize immediately if DOM is ready, otherwise wait
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyiOSSafariModalFix);
} else {
    applyiOSSafariModalFix();
}

// Re-check on window resize (orientation change)
window.addEventListener('resize', function() {
    setTimeout(applyiOSSafariModalFix, 100);
});

// Simple one-liner version for quick implementation
if (/iPad|iPhone|iPod/.test(navigator.userAgent) && /Safari/.test(navigator.userAgent) && !/Chrome|CriOS/.test(navigator.userAgent) && window.innerWidth <= 768) {
    const applyPadding = () => document.querySelectorAll('.modalcontent').forEach(el => el.style.paddingBottom = '80px');
    applyPadding();
    new MutationObserver(() => applyPadding()).observe(document.body, {childList: true, subtree: true});
}



