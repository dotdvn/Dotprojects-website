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
    const reveals = document.querySelectorAll('.hero-content, .section-heading, .grid-item, .featured-left, .featured-right, .capabilities-list, .capabilities-heading, .testimonial-content, .footer-content');
    
    reveals.forEach(el => {
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

    reveals.forEach(reveal => {
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
        });

        closeChat.addEventListener('click', () => {
            chatbotWindow.classList.remove('active');
            chatbotToggle.style.display = 'flex';
            setTimeout(() => { chatbotToggle.style.transform = 'scale(1)'; }, 10);
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
