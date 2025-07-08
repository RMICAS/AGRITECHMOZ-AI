document.addEventListener('DOMContentLoaded', function() {
    const chatInput = document.getElementById('chatInput');
    const sendButton = document.getElementById('sendButton');
    const chatMessages = document.getElementById('chatMessages');
    const buttonIcon = sendButton.querySelector('.fas.fa-arrow-up');
    const buttonLoading = sendButton.querySelector('.button-loading');
    const leftArrow = document.getElementById('leftArrow');
    const rightArrow = document.getElementById('rightArrow');
    const cropsSlider = document.getElementById('cropsSlider');
    
    // Hamburger menu elements
    const hamburgerButton = document.getElementById('hamburgerButton');
    const hamburgerSidebar = document.getElementById('hamburgerSidebar');
    const hamburgerOverlay = document.getElementById('hamburgerOverlay');
    const closeSidebarButton = document.getElementById('closeSidebarButton');
    const signOffButton = document.getElementById('signOffButton');
    
    let isFirstMessage = true;
    let selectedCrop = null;
    let currentPosition = 0;
    let visibleCrops = getVisibleCropsCount();
    let isRateLimited = false;
    
    // Function to get number of visible crops based on screen size
    function getVisibleCropsCount() {
        if (window.innerWidth <= 430) {
            return 2; // Show only 2 crops for mobile screens up to 430px
        } else if (window.innerWidth <= 576) {
            return 3; // For small screens
        } else if (window.innerWidth <= 768) {
            return 4; // For medium screens
        } else {
            return 5; // Default for larger screens
        }
    }
    
    // List of all crops
    const crops = [
        'Tomato', 'Carrot', 'Onions', 'Kale', 'Cabbage', 
        'Maize', 'Rice', 'Cassava', 'Beans', 'Cotton'
    ];

    // Initialize the crop carousel with cloned elements for cyclical scrolling
    function initCropCarousel() {
        // Create main crop buttons
        crops.forEach((crop, index) => {
            const cropBtn = document.createElement('button');
            cropBtn.className = 'crop-btn original';
            cropBtn.setAttribute('data-crop', crop.toLowerCase());
            cropBtn.textContent = crop;
            cropBtn.setAttribute('data-index', index);
            
            cropBtn.addEventListener('click', () => {
                selectCrop(crop, index);
            });
            
            cropsSlider.appendChild(cropBtn);
        });
        
        // Clone the first set of items and add them at the end
        const visibleCount = getVisibleCropsCount();
        for (let i = 0; i < visibleCount; i++) {
            const originalBtn = document.querySelector(`.crop-btn[data-index="${i}"]`);
            const cloneBtn = originalBtn.cloneNode(true);
            cloneBtn.className = 'crop-btn clone-end';
            
            cloneBtn.addEventListener('click', () => {
                selectCrop(crops[i], i);
                // Jump back to original position after clicking a clone
                setTimeout(() => {
                    silentJump(i);
                }, 100);
            });
            
            cropsSlider.appendChild(cloneBtn);
        }
        
        // Clone the last set of items and add them at the beginning
        for (let i = crops.length - visibleCount; i < crops.length; i++) {
            const originalBtn = document.querySelector(`.crop-btn[data-index="${i}"]`);
            const cloneBtn = originalBtn.cloneNode(true);
            cloneBtn.className = 'crop-btn clone-start';
            
            cloneBtn.addEventListener('click', () => {
                selectCrop(crops[i], i);
                // Jump to original position after clicking a clone
                setTimeout(() => {
                    silentJump(i);
                }, 100);
            });
            
            cropsSlider.insertBefore(cloneBtn, cropsSlider.firstChild);
        }
        
        // Set the initial position to the first original item
        silentJump(0);
    }
    
    // Select a crop
    function selectCrop(crop, index) {
        // Remove selected class from all crop buttons
        document.querySelectorAll('.crop-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        
        // Add selected class to clicked crop button
        document.querySelector(`.crop-btn[data-crop="${crop.toLowerCase()}"]`).classList.add('selected');
        
        // Update selected crop
        selectedCrop = crop.toLowerCase();
        
        // Enable all stage cards
        document.querySelectorAll('.card').forEach(card => {
            card.classList.remove('disabled');
            card.style.opacity = '1';
            card.style.cursor = 'pointer';
        });
        
        // Ensure the selected crop is visible
        ensureCropVisible(index);
    }
    
    // Ensure the selected crop is visible in the carousel
    function ensureCropVisible(index) {
        // For cyclical scroll, we have cloned elements at start and end
        // We need to adjust the current position to the real item's position
        const offset = getVisibleCropsCount();
        
        if (index < currentPosition - offset) {
            // Need to scroll left
            currentPosition = index + offset;
            updateCarouselPosition();
        } else if (index >= currentPosition - offset + visibleCrops) {
            // Need to scroll right
            currentPosition = index - visibleCrops + offset + 1;
            updateCarouselPosition();
        }
    }
    
    // Function to jump to a position without animation (used for infinite scroll reset)
    function silentJump(position) {
        const cropButtons = document.querySelectorAll('.crop-btn');
        if (cropButtons.length === 0) return;
        
        const cropWidth = cropButtons[0].offsetWidth + 
                       parseInt(window.getComputedStyle(cropButtons[0]).marginLeft) + 
                       parseInt(window.getComputedStyle(cropButtons[0]).marginRight);
        
        // Add the offset for the cloned items at the beginning
        const offset = getVisibleCropsCount();
        currentPosition = position + offset;
        
        // Temporarily remove transition for instant jump
        cropsSlider.style.transition = 'none';
        cropsSlider.style.transform = `translateX(${-currentPosition * cropWidth}px)`;
        
        // Force browser to apply the change before re-enabling transitions
        setTimeout(() => {
            cropsSlider.style.transition = 'transform 0.3s ease';
        }, 10);
    }
    
    // Update carousel position with smooth infinite scroll
    function updateCarouselPosition() {
        const cropButtons = document.querySelectorAll('.crop-btn');
        if (cropButtons.length === 0) return;
        
        const cropWidth = cropButtons[0].offsetWidth + 
                         parseInt(window.getComputedStyle(cropButtons[0]).marginLeft) + 
                         parseInt(window.getComputedStyle(cropButtons[0]).marginRight);
        
        // Re-enable transition if it was disabled
        if (cropsSlider.style.transition !== 'transform 0.3s ease') {
            cropsSlider.style.transition = 'transform 0.3s ease';
        }
        
        // Calculate visible crops count and offset
        visibleCrops = getVisibleCropsCount();
        const offset = visibleCrops;
        
        // Apply the transform
        cropsSlider.style.transform = `translateX(${-currentPosition * cropWidth}px)`;
        
        // Update arrow states
        updateArrowStates();
    }
    
    // Update arrow states based on current position
    function updateArrowStates() {
        const visibleCount = getVisibleCropsCount();
        const offset = visibleCount;
        
        // Always show arrows for infinite scroll
        leftArrow.style.display = 'block';
        rightArrow.style.display = 'block';
    }

    // Function to add a new message
    function addMessage(message, isUser = false, isError = false) {
        // Show chat messages area on first message
        if (isFirstMessage) {
            chatMessages.classList.add('visible');
            isFirstMessage = false;
        }

        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'} ${isError ? 'error-message' : ''}`;
        
        messageDiv.innerHTML = `
            <div class="message-content">
                <i class="fas ${isUser ? 'fa-user' : isError ? 'fa-exclamation-triangle' : 'fa-robot'} message-icon"></i>
                <p>${message}</p>
            </div>
        `;
        
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Handle card clicks for both desktop and mobile
    async function handleCardClick(card) {
        if (!selectedCrop) {
            addMessage("Please select a crop first before choosing a stage.");
            return;
        }
        
        if (isRateLimited) {
            addMessage("You have reached the daily message limit. Please try again tomorrow.", false, true);
            return;
        }
        
        const category = card.getAttribute('data-category');
        
        try {
            // Show loading state
            card.style.opacity = '0.7';
            card.style.cursor = 'wait';
            
            // Make API call to get predefined Q&A
            const response = await fetch(`/api/predefined?crop=${selectedCrop}&stage=${category}`);
            const data = await response.json();
            
            if (response.ok) {
                // Add the question and answer to chat
                addMessage(data.prompt, true);
                addMessage(data.answer, false);
            } else {
                if (data.error && data.error.includes('daily message limit')) {
                    isRateLimited = true;
                    addMessage(data.error, false, true);
                    disableChatInput();
                } else {
                    addMessage(data.error || 'Failed to get agricultural advice. Please try again.', false, true);
                }
            }
        } catch (error) {
            console.error('Error fetching predefined Q&A:', error);
            addMessage('Network error. Please check your connection and try again.', false, true);
        } finally {
            // Reset card state
            card.style.opacity = '1';
            card.style.cursor = 'pointer';
        }
    }

    // Add click event listeners to all cards
    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('click', () => handleCardClick(card));
    });
    
    // Hamburger Menu functionality
    function toggleHamburgerMenu() {
        hamburgerSidebar.classList.toggle('open');
        hamburgerOverlay.classList.toggle('visible');
    }
    
    // Event listener for hamburger button
    hamburgerButton.addEventListener('click', toggleHamburgerMenu);
    
    // Event listener for close sidebar button
    closeSidebarButton.addEventListener('click', toggleHamburgerMenu);
    
    // Event listener for overlay (close when clicking outside)
    hamburgerOverlay.addEventListener('click', toggleHamburgerMenu);
    
    // Sign off functionality - simplified for anonymous access
    signOffButton.addEventListener('click', function() {
        // For anonymous access, just refresh the page
        window.location.reload();
    });

    // Disable chat input when rate limited
    function disableChatInput() {
        chatInput.disabled = true;
        sendButton.disabled = true;
        chatInput.placeholder = 'Daily limit reached. Please try again tomorrow.';
    }

    // Handle send button click
    async function handleSend() {
        const message = chatInput.value.trim();
        if (!message) return;

        if (isRateLimited) {
            addMessage("You have reached the daily message limit. Please try again tomorrow.", false, true);
            return;
        }

        // Add user message
        addMessage(message, true);
        chatInput.value = '';

        // Show loading state
        buttonIcon.style.display = 'none';
        buttonLoading.classList.remove('d-none');

        try {
            // Make API call to Gemini AI
            const response = await fetch('/api/send_message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: message })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                addMessage(data.response, false);
            } else {
                if (data.error && data.error.includes('daily message limit')) {
                    isRateLimited = true;
                    addMessage(data.error, false, true);
                    disableChatInput();
                } else {
                    addMessage(data.error || 'Failed to get AI response. Please try again.', false, true);
                }
            }
        } catch (error) {
            console.error('Error sending message:', error);
            addMessage('Network error. Please check your connection and try again.', false, true);
        } finally {
            // Hide loading state
            buttonIcon.style.display = 'inline-block';
            buttonLoading.classList.add('d-none');
        }
    }

    // Event listeners for carousel navigation with smooth cyclical infinite scroll
    leftArrow.addEventListener('click', () => {
        currentPosition--;
        updateCarouselPosition();
    });
    
    rightArrow.addEventListener('click', () => {
        // Update visible crops count before updating position
        visibleCrops = getVisibleCropsCount();
        currentPosition++;
        updateCarouselPosition();
    });
    
    // Add window resize event listener to update visible crops and carousel position
    window.addEventListener('resize', () => {
        const oldVisibleCrops = visibleCrops;
        visibleCrops = getVisibleCropsCount();
        
        // If visible crops count changed, update carousel position
        if (oldVisibleCrops !== visibleCrops) {
            // For infinite scroll, just make sure position is within bounds
            if (currentPosition > crops.length - visibleCrops) {
                currentPosition = Math.max(0, crops.length - visibleCrops);
            }
            updateCarouselPosition();
        }
    });

    // Event listeners for chat
    sendButton.addEventListener('click', handleSend);
    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleSend();
        }
    });
    
    // Initialize the crop carousel
    initCropCarousel();
    
    // Initial check to ensure arrow states are correct
    updateArrowStates();
    
    // Add an event listener for transitionend to handle the cycling
    cropsSlider.addEventListener('transitionend', function() {
        const visibleCount = getVisibleCropsCount();
        
        // If we've scrolled to clones, reset to the real items for a seamless experience
        if (currentPosition <= visibleCount - 1) {
            silentJump(crops.length - visibleCount);
        } else if (currentPosition >= crops.length + visibleCount) {
            silentJump(0);
        }
    });
});
