document.addEventListener('DOMContentLoaded', function() {
    console.log('FAQ: DOM loaded, initializing...');
    
    const faqContainer = document.getElementById('faq');
    if (!faqContainer) {
        console.error('FAQ: Container #faq not found');
        return;
    }
    
    const questions = faqContainer.querySelectorAll('[id^="q-"]');
    console.log(`FAQ: Found ${questions.length} questions`);
    
    if (questions.length === 0) {
        console.warn('FAQ: No questions found with id pattern "q-*"');
        return;
    }

    questions.forEach((question, index) => {
        console.log(`FAQ: Processing question ${index}:`, question.id);
        
        const header = question.querySelector('[data-faq-header], .faq-header, h3, .question-header');
        const content = question.querySelector('[data-faq-content], .faq-content, .answer, .question-content');
        
        if (!header) {
            console.error(`FAQ: Question ${index} - header not found. Available children:`, 
                Array.from(question.children).map(el => `${el.tagName}.${el.className}`));
            return;
        }
        
        if (!content) {
            console.error(`FAQ: Question ${index} - content not found. Available children:`, 
                Array.from(question.children).map(el => `${el.tagName}.${el.className}`));
            return;
        }

        // Ensure content is hidden initially
        content.style.display = 'none';
        
        header.addEventListener('click', function() {
            console.log(`FAQ: Clicked question ${index}`);
            
            const isCurrentlyOpen = question.classList.contains('faq-open');
            
            if (isCurrentlyOpen) {
                closeQuestion(question, header, content, index);
            } else {
                // Close all other questions first
                questions.forEach((otherQuestion, otherIndex) => {
                    if (otherIndex !== index && otherQuestion.classList.contains('faq-open')) {
                        const otherHeader = otherQuestion.querySelector('[data-faq-header], .faq-header, h3, .question-header');
                        const otherContent = otherQuestion.querySelector('[data-faq-content], .faq-content, .answer, .question-content');
                        closeQuestion(otherQuestion, otherHeader, otherContent, otherIndex);
                    }
                });
                
                openQuestion(question, header, content, index);
            }
        });

        setupAccessibility(header, content, index);
    });

    function openQuestion(question, header, content, index) {
        console.log(`FAQ: Opening question ${index}`);
        question.classList.add('faq-open');
        
        // Reset styles and measure natural height
        content.style.height = '';
        content.style.overflow = '';
        content.style.display = 'block';
        
        const naturalHeight = content.scrollHeight;
        
        // Set to 0 and animate to natural height
        content.style.height = '0px';
        content.style.overflow = 'hidden';
        content.style.transition = 'height 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
        
        requestAnimationFrame(() => {
            content.style.height = naturalHeight + 'px';
        });
        
        header.setAttribute('aria-expanded', 'true');
    }

    function closeQuestion(question, header, content, index) {
        console.log(`FAQ: Closing question ${index}`);
        question.classList.remove('faq-open');
        
        // Get current height and animate to 0
        const currentHeight = content.scrollHeight;
        content.style.height = currentHeight + 'px';
        content.style.transition = 'height 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        
        requestAnimationFrame(() => {
            content.style.height = '0px';
        });
        
        setTimeout(() => {
            content.style.display = 'none';
        }, 300);
        
        header.setAttribute('aria-expanded', 'false');
    }

    function setupAccessibility(header, content, index) {
        header.setAttribute('tabindex', '0');
        header.setAttribute('role', 'button');
        header.setAttribute('aria-expanded', 'false');
        header.setAttribute('aria-controls', `faq-content-${index}`);
        content.setAttribute('id', `faq-content-${index}`);
        
        header.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                header.click();
            }
        });
    }

    // Open first question by default
    if (questions.length > 0) {
        const firstQuestion = questions[0];
        const firstHeader = firstQuestion.querySelector('[data-faq-header], .faq-header, h3, .question-header');
        const firstContent = firstQuestion.querySelector('[data-faq-content], .faq-content, .answer, .question-content');
        
        if (firstHeader && firstContent) {
            openQuestion(firstQuestion, firstHeader, firstContent, 0);
        }
    }
});