// Prevent browser from restoring previous scroll position
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}

document.addEventListener('DOMContentLoaded', () => {
    // Force scroll to top on load
    window.scrollTo(0, 0);
    
    // Preloader Logic
    const preloader = document.getElementById('preloader');
    const terminalLines = document.getElementById('terminal-lines');
    const loadingBar = document.getElementById('loading-bar');
    const loadingPercentage = document.getElementById('loading-percentage');
    
    if (preloader) {
        document.body.classList.add('no-scroll');
        
        const bootSequence = [
            'INIT_SYSTEM_BOOT_SEQUENCE_V4.2...',
            'LOADING_KERNEL_MODULES....... [OK]',
            'MOUNTING_VIRTUAL_FILESYSTEMS. [OK]',
            'VERIFYING_CHECKSUMS.......... <span class="success">[PASS]</span>',
            'STARTING_NETWORK_INTERFACE... [OK]',
            'ESTABLISHING_SECURE_UPLINK... <span class="warning">[WAIT]</span>',
            'ESTABLISHING_SECURE_UPLINK... <span class="success">[OK]</span>',
            'INITIALIZING_HARDWARE_BUS.... [OK]',
            '--> SCANNING_I2C_DEVICES...   <span class="warning">3 FOUND</span>',
            '--> SCANNING_SPI_DEVICES...   <span class="warning">1 FOUND</span>',
            '--> DETECTED: DOT_PROJECTS_MCU_CORE_V1.0',
            'ALLOCATING_MEMORY............ <span class="success">[OK]</span>',
            'SYNCING_IOT_MODULES.......... [OK]',
            'CALIBRATING_SENSORS.......... <span class="warning">[CALIBRATING]</span>',
            'CALIBRATING_SENSORS.......... <span class="success">[OK]</span>',
            'CONNECTING_TO_MQTT_BROKER.... [OK]',
            'FETCHING_ASSETS.............. <span class="warning">[WAIT]</span>',
            'DECRYPTING_PAYLOAD........... [OK]',
            'RENDERING_DOM_ELEMENTS....... [OK]',
            'ENABLING_INTERACTIVE_MODES... [OK]',
            'SYSTEM_READY. ACCESS_GRANTED.'
        ];

        let lineIndex = 0;
        let progress = 0;

        const typeLine = () => {
            if (lineIndex < bootSequence.length) {
                const line = document.createElement('div');
                line.className = 'terminal-line';
                line.innerHTML = `<span class="label">sys@dot:~#</span> ${bootSequence[lineIndex]}`;
                terminalLines.appendChild(line);
                
                // Auto-scroll to bottom
                terminalLines.scrollTop = terminalLines.scrollHeight;

                lineIndex++;
                
                // Random delay between lines for realism
                const delay = Math.random() * 150 + 50; 
                setTimeout(typeLine, delay);
            }
        };

        const updateProgress = () => {
            if (progress < 100) {
                // Non-linear progress for realism
                const increment = Math.random() > 0.8 ? Math.random() * 15 : Math.random() * 5;
                progress = Math.min(progress + increment, 100);
                
                loadingBar.style.width = `${progress}%`;
                loadingPercentage.innerText = Math.floor(progress).toString().padStart(2, '0');
                
                const delay = Math.random() * 100 + 20;
                setTimeout(updateProgress, delay);
            } else {
                // Finish loading
                setTimeout(() => {
                    preloader.classList.add('hidden');
                    document.body.classList.remove('no-scroll');
                    setTimeout(() => {
                        preloader.style.display = 'none';
                    }, 800); // Wait for transition
                }, 500);
            }
        };

        // Start sequences
        setTimeout(typeLine, 200);
        setTimeout(updateProgress, 300);
    }

    // Scroll reveal animation
    const autoReveals = document.querySelectorAll('.hero-content, .section-heading, .grid-item, .featured-left, .featured-right, .capabilities-list, .capabilities-heading, .testimonial-content, .footer-content');
    
    autoReveals.forEach(el => {
        el.classList.add('reveal');
    });

    const revealOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    // Observe ALL elements with the reveal class, including manually added ones
    const allReveals = document.querySelectorAll('.reveal');
    allReveals.forEach(reveal => {
        revealOnScroll.observe(reveal);
    });

    // Chatbot Toggle Logic
    const chatbotToggle = document.getElementById('chatbotToggle');
    const chatbotWindow = document.getElementById('chatbotWindow');
    const closeChat = document.getElementById('closeChat');

    if (chatbotToggle && chatbotWindow && closeChat) {
        chatbotToggle.addEventListener('click', () => {
            chatbotWindow.classList.add('active');
            chatbotToggle.style.transform = 'scale(0)';
            setTimeout(() => { chatbotToggle.style.display = 'none'; }, 300);
            
            // Adjust height if on mobile
            if (window.visualViewport && window.innerWidth <= 768) {
                chatbotWindow.style.height = `${window.visualViewport.height}px`;
            }
        });

        closeChat.addEventListener('click', () => {
            chatbotWindow.classList.remove('active');
            chatbotToggle.style.display = 'flex';
            chatbotWindow.style.height = ''; // Reset height
            setTimeout(() => { chatbotToggle.style.transform = 'scale(1)'; }, 10);
        });

        // Dynamic viewport adjustment for mobile keyboards
        if (window.visualViewport) {
            window.visualViewport.addEventListener('resize', () => {
                if (chatbotWindow.classList.contains('active') && window.innerWidth <= 768) {
                    chatbotWindow.style.height = `${window.visualViewport.height}px`;
                    const cBody = document.getElementById('chatBody');
                    if (cBody) cBody.scrollTop = cBody.scrollHeight;
                }
            });
        }

        // Chatbot API Logic
        const chatInput = document.getElementById('chatInput');
        const sendBtn = document.getElementById('sendBtn');
        const chatBody = document.getElementById('chatBody');

        function addMessageToChat(text, senderClass) {
            const msgDiv = document.createElement('div');
            msgDiv.className = `chat-message ${senderClass}`;
            // Use textContent to prevent XSS
            const p = document.createElement('p');
            p.textContent = text;
            msgDiv.appendChild(p);
            chatBody.appendChild(msgDiv);
            chatBody.scrollTop = chatBody.scrollHeight;
        }

        async function sendMessage() {
            const text = chatInput.value.trim();
            if (!text) return;

            // Add user message
            addMessageToChat(text, 'user-message');
            chatInput.value = '';
            
            // Add typing indicator
            const typingDiv = document.createElement('div');
            typingDiv.className = 'chat-message bot-message typing-indicator';
            typingDiv.innerHTML = '<p>PROCESSING...</p>';
            chatBody.appendChild(typingDiv);
            chatBody.scrollTop = chatBody.scrollHeight;

            sendBtn.disabled = true;
            chatInput.disabled = true;

            try {
                const response = await fetch('/api/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message: text })
                });

                const data = await response.json();
                
                // Remove typing indicator
                chatBody.removeChild(typingDiv);

                if (response.ok) {
                    addMessageToChat(data.reply, 'bot-message');
                } else {
                    addMessageToChat('ERROR: ' + (data.error || 'COMMUNICATION FAILURE'), 'bot-message');
                }
            } catch (error) {
                chatBody.removeChild(typingDiv);
                addMessageToChat('ERROR: NETWORK FAILURE', 'bot-message');
            } finally {
                sendBtn.disabled = false;
                chatInput.disabled = false;
                chatInput.focus();
            }
        }

        sendBtn.addEventListener('click', sendMessage);
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMessage();
        });

        // Mobile Keyboard Hack: Push UI up when input is focused
        chatInput.addEventListener('focus', () => {
            if (window.innerWidth <= 768) {
                // Add padding to the bottom of the window to physically push the input field up
                chatbotWindow.style.paddingBottom = '320px'; 
                setTimeout(() => {
                    if (chatBody) chatBody.scrollTop = chatBody.scrollHeight;
                }, 100);
            }
        });

        chatInput.addEventListener('blur', () => {
            if (window.innerWidth <= 768) {
                // Remove the padding when keyboard closes
                chatbotWindow.style.paddingBottom = '0px';
            }
        });
    }

    // Targeting Bracket Cursor Logic
    const targetCursor = document.getElementById('target-cursor');
    
    if (targetCursor) {
        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        
        let cursorX = mouseX;
        let cursorY = mouseY;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        // Use requestAnimationFrame for smooth lerping
        function animateTargetCursor() {
            // Lerp towards mouse position
            cursorX += (mouseX - cursorX) * 0.2;
            cursorY += (mouseY - cursorY) * 0.2;
            
            targetCursor.style.transform = `translate(calc(${cursorX}px - 50%), calc(${cursorY}px - 50%))`;
            
            requestAnimationFrame(animateTargetCursor);
        }
        
        animateTargetCursor();

        // Add hover effect for interactive elements
        const interactiveElements = document.querySelectorAll('a, button, .image-wrapper, .chatbot-toggle, .close-btn, input, .scroll-indicator');
        
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                targetCursor.classList.add('hovering');
            });
            el.addEventListener('mouseleave', () => {
                targetCursor.classList.remove('hovering');
            });
        });
    }
});
