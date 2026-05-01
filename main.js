document.addEventListener('DOMContentLoaded', () => {
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
});
