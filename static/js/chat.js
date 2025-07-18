// static/js/chat.js (Final, Refactored Version)

document.addEventListener('DOMContentLoaded', function() {
    const chatInput = document.getElementById('chatInput');
    const sendButton = document.getElementById('sendButton');
    const chatMessages = document.getElementById('chatMessages');
    const buttonIcon = sendButton.querySelector('.fas.fa-arrow-up');
    const buttonLoading = sendButton.querySelector('.button-loading');
    const leftArrow = document.getElementById('leftArrow');
    const rightArrow = document.getElementById('rightArrow');
    const cropsSlider = document.getElementById('cropsSlider');
    
    // Mobile carousel elements
    const mobileLeftArrow = document.getElementById('mobileLeftArrow');
    const mobileRightArrow = document.getElementById('mobileRightArrow');
    const mobileCardsContainer = document.querySelector('.cards-scroll-container');
    

    
    // Hamburger menu elements
    const hamburgerButton = document.getElementById('hamburgerButton');
    const hamburgerSidebar = document.getElementById('hamburgerSidebar');
    const hamburgerOverlay = document.getElementById('hamburgerOverlay');
    const closeSidebarButton = document.getElementById('closeSidebarButton');
    const signOffButton = document.getElementById('signOffButton');
    
    // Debug: Check if hamburger elements are found
    console.log('Hamburger elements found:', {
        hamburgerButton: !!hamburgerButton,
        hamburgerSidebar: !!hamburgerSidebar,
        hamburgerOverlay: !!hamburgerOverlay,
        closeSidebarButton: !!closeSidebarButton,
        signOffButton: !!signOffButton
    });
    
    let isFirstMessage = true;
    let selectedCrop = null;
    let currentPosition = 0;
    let visibleCrops = getVisibleCropsCount();
    let isRateLimited = false;
    let sessionStarted = false;
    
    // Mobile carousel variables
    let mobileCurrentPosition = 0;
    const mobileCards = ['sowing', 'growth', 'harvest', 'financial'];
    const mobileCardsPerView = 2;
    
    // Counter management for predefined questions
    let questionCounters = {
        sowing: 10,
        growth: 10,
        harvest: 10,
        financial: 10
    };
    
    // Initialize counters from localStorage if available
    function initializeCounters() {
        const savedCounters = localStorage.getItem('questionCounters');
        if (savedCounters) {
            questionCounters = JSON.parse(savedCounters);
        }
        updateAllCounters();
    }
    
    // Mobile carousel navigation functions
    function updateMobileCarouselPosition() {
        if (!mobileCardsContainer) return;
        
        const cardWidth = mobileCardsContainer.querySelector('.card').offsetWidth + 10; // 10px for margin
        const scrollPosition = mobileCurrentPosition * cardWidth * mobileCardsPerView;
        
        mobileCardsContainer.scrollTo({
            left: scrollPosition,
            behavior: 'smooth'
        });
        
        updateMobileArrowStates();
    }
    
    function updateMobileArrowStates() {
        if (!mobileLeftArrow || !mobileRightArrow) {
            return;
        }
        
        mobileLeftArrow.disabled = mobileCurrentPosition <= 0;
        mobileRightArrow.disabled = mobileCurrentPosition >= Math.ceil(mobileCards.length / mobileCardsPerView) - 1;
    }
    
    function mobileNextSlide() {
        const maxPosition = Math.ceil(mobileCards.length / mobileCardsPerView) - 1;
        if (mobileCurrentPosition < maxPosition) {
            mobileCurrentPosition++;
            updateMobileCarouselPosition();
        }
    }
    
    function mobilePrevSlide() {
        if (mobileCurrentPosition > 0) {
            mobileCurrentPosition--;
            updateMobileCarouselPosition();
        }
    }
    
    // Update counter display for a specific category
    function updateCounter(category) {
        const counter = questionCounters[category];
        const counterElements = document.querySelectorAll(`#${category}-counter, #${category}-counter-mobile`);
        
        counterElements.forEach(element => {
            element.textContent = counter;
        });
        
        // Disable card if counter reaches 0
        const cards = document.querySelectorAll(`[data-category="${category}"]`);
        cards.forEach(card => {
            if (counter <= 0) {
                card.classList.add('disabled');
            } else {
                card.classList.remove('disabled');
            }
        });
    }
    
    // Update all counters
    function updateAllCounters() {
        Object.keys(questionCounters).forEach(category => {
            updateCounter(category);
        });
    }
    
    // Decrease counter for a category
    function decreaseCounter(category) {
        if (questionCounters[category] > 0) {
            questionCounters[category]--;
            localStorage.setItem('questionCounters', JSON.stringify(questionCounters));
            updateCounter(category);
            
            // Check if all categories are now depleted
            checkAllCategoriesDepleted();
            
            return true;
        }
        return false;
    }
    
    // Reset all counters (for testing or new session)
    function resetCounters() {
        questionCounters = {
            sowing: 10,
            growth: 10,
            harvest: 10,
            financial: 10
        };
        localStorage.setItem('questionCounters', JSON.stringify(questionCounters));
        updateAllCounters();
    }
    
    // Function to get number of visible crops based on screen size
    function getVisibleCropsCount() {
        if (window.innerWidth <= 430) {
            return 2;
        } else if (window.innerWidth <= 576) {
            return 3;
        } else if (window.innerWidth <= 768) {
            return 4;
        } else {
            return 5;
        }
    }
    
    // List of all crops
    const crops = [
        'Tomate', 'Cenoura', 'Cebola', 'Couve', 'Repolho', 
        'Milho', 'Arroz', 'Mandioqueira', 'Feijão', 'Algodão'
    ];

    // Check if this is the first interaction of the session
    function checkFirstInteraction() {
        if (!sessionStarted && chatMessages.children.length === 0) {
            // Welcome message removed - chat starts without initial message
            sessionStarted = true;
        }
    }
    
    // Check if all categories are depleted
    function checkAllCategoriesDepleted() {
        const allDepleted = Object.values(questionCounters).every(counter => counter <= 0);
        if (allDepleted) {
            addMessage("Utilizaste todas as perguntas pré-definidas! Podes continuar a fazer perguntas livres sobre agricultura.", false);
        }
    }

    // Initialize the crop carousel (Your existing code here is perfect, no changes)
    function initCropCarousel() {
        crops.forEach((crop, index) => {
            const cropBtn = document.createElement('button');
            cropBtn.className = 'crop-btn original';
            cropBtn.setAttribute('data-crop', crop.toLowerCase());
            cropBtn.textContent = crop;
            cropBtn.setAttribute('data-index', index);
            cropBtn.addEventListener('click', () => selectCrop(crop, index));
            cropsSlider.appendChild(cropBtn);
        });
        
        const visibleCount = getVisibleCropsCount();
        for (let i = 0; i < visibleCount; i++) {
            const originalBtn = document.querySelector(`.crop-btn[data-index="${i}"]`);
            const cloneBtn = originalBtn.cloneNode(true);
            cloneBtn.className = 'crop-btn clone-end';
            cloneBtn.addEventListener('click', () => {
                selectCrop(crops[i], i);
                setTimeout(() => silentJump(i), 100);
            });
            cropsSlider.appendChild(cloneBtn);
        }
        
        for (let i = crops.length - visibleCount; i < crops.length; i++) {
            const originalBtn = document.querySelector(`.crop-btn[data-index="${i}"]`);
            const cloneBtn = originalBtn.cloneNode(true);
            cloneBtn.className = 'crop-btn clone-start';
            cloneBtn.addEventListener('click', () => {
                selectCrop(crops[i], i);
                setTimeout(() => silentJump(i), 100);
            });
            cropsSlider.insertBefore(cloneBtn, cropsSlider.firstChild);
        }
        silentJump(0);
    }
    
    // Select a crop (Your existing code here is perfect, no changes)
    function selectCrop(crop, index) {
        document.querySelectorAll('.crop-btn').forEach(btn => btn.classList.remove('selected'));
        const activeButtons = document.querySelectorAll(`.crop-btn[data-crop="${crop.toLowerCase()}"]`);
        activeButtons.forEach(btn => btn.classList.add('selected'));
        selectedCrop = crop.toLowerCase();
        document.querySelectorAll('.card').forEach(card => {
            card.classList.remove('disabled');
            card.style.opacity = '1';
            card.style.cursor = 'pointer';
        });
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
        
        // Check for infinite scroll reset
        if (currentPosition < offset) {
            // We've scrolled past the beginning, reset to end
            setTimeout(() => {
                currentPosition = crops.length + offset;
                cropsSlider.style.transition = 'none';
                cropsSlider.style.transform = `translateX(${-currentPosition * cropWidth}px)`;
                setTimeout(() => {
                    cropsSlider.style.transition = 'transform 0.3s ease';
                }, 10);
            }, 300);
        } else if (currentPosition >= crops.length + offset) {
            // We've scrolled past the end, reset to beginning
            setTimeout(() => {
                currentPosition = offset;
                cropsSlider.style.transition = 'none';
                cropsSlider.style.transform = `translateX(${-currentPosition * cropWidth}px)`;
                setTimeout(() => {
                    cropsSlider.style.transition = 'transform 0.3s ease';
                }, 10);
            }, 300);
        }
        
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

    // Function to improve formatting
    function formatMessage(message) {
        // Remove markdown-style bold formatting (**text**)
        let formattedMessage = message.replace(/\*\*(.*?)\*\*/g, '$1');
        
        // Convert line breaks to HTML line breaks
        formattedMessage = formattedMessage.replace(/\n/g, '<br>');
        
        // Convert asterisks to proper bullet points
        formattedMessage = formattedMessage.replace(/\* /g, '• ');
        
        // Clean up multiple consecutive line breaks to reduce spacing
        formattedMessage = formattedMessage.replace(/<br><br><br>/g, '<br>');
        formattedMessage = formattedMessage.replace(/<br><br>/g, '<br>');
        
        return formattedMessage;
    }

    // Function to add a new message
    function addMessage(message, isUser = false, isError = false, isWelcome = false) {
        if (chatMessages.children.length === 0) {
            chatMessages.classList.add('visible');
        }

        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'} ${isError ? 'error-message' : ''} ${isWelcome ? 'welcome-message' : ''}`;
        
        // Format the message to convert ** to <strong> tags
        const formattedMessage = formatMessage(message);
        
        messageDiv.innerHTML = `
            <div class="message-content">
                <i class="fas ${isUser ? 'fa-user' : isError ? 'fa-exclamation-triangle' : 'fa-robot'} message-icon"></i>
                <p>${formattedMessage}</p>
            </div>
        `;
        
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // UPDATED: Handle card clicks to fetch from the backend
    async function handleCardClick(card) {
        // Check for first interaction
        checkFirstInteraction();
        
        if (!selectedCrop) {
            addMessage("Por favor, seleciona uma cultura primeiro antes de escolher uma fase.", false, true);
            return;
        }
        
        if (isRateLimited) {
            addMessage("Atingiu o limite diário de mensagens. Tente novamente amanhã.", false, true);
            return;
        }
        
        const category = card.getAttribute('data-category');
        
        // Check if counter is available for this category
        if (questionCounters[category] <= 0) {
            addMessage("Já utilizaste todas as perguntas disponíveis para esta categoria. Tenta outra categoria ou faz uma pergunta livre.", false, true);
            return;
        }
        
        try {
            card.style.opacity = '0.7';
            card.style.cursor = 'wait';
            
            // NEW: Fetch predefined Q&A from your Python backend
            const response = await fetch(`/api/predefined?crop=${selectedCrop}&stage=${category}`);
            const data = await response.json();
            
            if (response.ok) {
                // Decrease counter only if the request was successful
                if (decreaseCounter(category)) {
                    addMessage(data.prompt, true);
                    addMessage(data.answer, false);
                }
            } else {
                if (response.status === 429) { // Specifically check for the rate limit status code
                    isRateLimited = true;
                    addMessage(data.error, false, true);
                    disableChatInput();
                } else {
                    addMessage(data.error || 'Falha ao obter conselhos agrícolas. Tente novamente.', false, true);
                }
            }
        } catch (error) {
            console.error('Error fetching predefined Q&A:', error);
            addMessage('Erro de rede. Verifica a tua ligação e tenta novamente.', false, true);
        } finally {
            card.style.opacity = '1';
            card.style.cursor = 'pointer';
        }
    }

    // Add click event listeners to all cards (This is fine, no changes)
    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('click', () => handleCardClick(card));
    });
    
    // Hamburger Menu functionality
    function toggleHamburgerMenu() {
        console.log('Toggle hamburger menu called');
        if (hamburgerSidebar && hamburgerOverlay) {
            hamburgerSidebar.classList.toggle('open');
            hamburgerOverlay.classList.toggle('visible');
            console.log('Hamburger menu toggled');
        } else {
            console.error('Hamburger elements not found');
        }
    }

    // Event listener for hamburger button
    if (hamburgerButton) {
        hamburgerButton.addEventListener('click', toggleHamburgerMenu);
        console.log('Hamburger button event listener added');
    } else {
        console.error('Hamburger button not found');
    }

    // Event listener for close button
    if (closeSidebarButton) {
        closeSidebarButton.addEventListener('click', toggleHamburgerMenu);
        console.log('Close button event listener added');
    } else {
        console.error('Close button not found');
    }

    // Event listener for overlay click
    if (hamburgerOverlay) {
        hamburgerOverlay.addEventListener('click', toggleHamburgerMenu);
        console.log('Overlay event listener added');
    } else {
        console.error('Overlay not found');
    }

    // Event listener for sign off button
    if (signOffButton) {
        signOffButton.addEventListener('click', () => {
            // Reset counters and reload
            resetCounters();
            location.reload();
        });
        console.log('Sign off button event listener added');
    } else {
        console.error('Sign off button not found');
    }

    // Disable chat input when rate limited (This is fine, no changes)
    function disableChatInput() {
        chatInput.disabled = true;
        sendButton.disabled = true;
        chatInput.placeholder = 'Limite diário atingido. Tenta novamente amanhã.';
    }

    // UPDATED: Handle send button click to fetch from the backend
    async function handleSend() {
        const message = chatInput.value.trim();
        if (!message) return;

        // Check for first interaction
        checkFirstInteraction();

        if (isRateLimited) {
            addMessage("Atingiu o limite diário de mensagens. Tenta novamente amanhã.", false, true);
            return;
        }

        addMessage(message, true);
        chatInput.value = '';

        buttonIcon.style.display = 'none';
        buttonLoading.classList.remove('d-none');

        try {
            // NEW: Fetch AI response from your Python backend
            const response = await fetch('/api/send_message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: message }) // Your backend expects a 'message' key
            });
            
            const data = await response.json();
            
            if (response.ok) {
                addMessage(data.response, false); // Your backend returns a 'response' key
            } else {
                if (response.status === 429) { // Check for rate limit
                    isRateLimited = true;
                    addMessage(data.error, false, true);
                    disableChatInput();
                } else {
                    addMessage(data.error || 'Falha ao obter resposta da IA. Tenta novamente.', false, true);
                }
            }
        } catch (error) {
            console.error('Error sending message:', error);
            addMessage('Erro de rede. Verifica a tua ligação e tenta novamente.', false, true);
        } finally {
            buttonIcon.style.display = 'inline-block';
            buttonLoading.classList.add('d-none');
        }
    }

        // Event listeners for carousel navigation
    leftArrow.addEventListener('click', () => {
        const visibleCount = getVisibleCropsCount();
        currentPosition -= visibleCount;
        
        // Check if we need to loop to the end
        const offset = visibleCount;
        if (currentPosition < offset) {
            // Jump to the end of the original items
            currentPosition = crops.length + offset;
            silentJump(crops.length - 1);
        } else {
            updateCarouselPosition();
        }
    });

    rightArrow.addEventListener('click', () => {
        const visibleCount = getVisibleCropsCount();
        currentPosition += visibleCount;
        
        // Check if we need to loop to the beginning
        const offset = visibleCount;
        if (currentPosition >= crops.length + offset) {
            // Jump to the beginning of the original items
            currentPosition = offset;
            silentJump(0);
        } else {
            updateCarouselPosition();
        }
    });
    
    // Mobile carousel event listeners
    if (mobileLeftArrow) {
        mobileLeftArrow.addEventListener('click', mobilePrevSlide);
    }
    
    if (mobileRightArrow) {
        mobileRightArrow.addEventListener('click', mobileNextSlide);
    }
    
    window.addEventListener('resize', () => {
        visibleCrops = getVisibleCropsCount();
        updateArrowStates();
    });

    // Event listeners for chat (This is fine, no changes)
    sendButton.addEventListener('click', handleSend);
    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleSend();
        }
    });
    
    // Initialize the crop carousel (This is fine, no changes)
    initCropCarousel();
    
    // Check for first interaction when page loads
    checkFirstInteraction();
    
    // Initialize counters on page load with a small delay to ensure DOM is ready
    setTimeout(() => {
        initializeCounters();
            // Initialize mobile carousel
    if (mobileCardsContainer) {
        updateMobileArrowStates();
    }
    }, 100);
    
    // ... All your other initial setup functions and event listeners ...
});