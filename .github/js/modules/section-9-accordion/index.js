class Section9Accordion {
  constructor() {
    this.accordionItems = document.querySelectorAll('.section-9__accordion-item[data-accordion]');
    this.section = document.querySelector('.section-9');
    if (this.accordionItems.length === 0) return;
    this.baseSectionHeight = null;
    this.init();
  }

  init() {
    // Store base section height (before any accordion opens)
    if (this.section && !this.baseSectionHeight) {
      // Wait a bit for layout to settle
      setTimeout(() => {
        this.baseSectionHeight = this.section.offsetHeight;
      }, 100);
    }
    
    // Make gradient IDs unique for each SVG
    this.accordionItems.forEach((item, index) => {
      const icon = item.querySelector('.section-9__accordion-icon');
      if (icon) {
        const gradientId = `paint0_linear_accordion_${index}`;
        const rect = icon.querySelector('rect');
        const linearGradient = icon.querySelector('linearGradient');
        
        if (rect) {
          rect.setAttribute('stroke', `url(#${gradientId})`);
        }
        if (linearGradient) {
          linearGradient.setAttribute('id', gradientId);
        }
      }
    });
    
    this.accordionItems.forEach((item) => {
      const button = item.querySelector('.section-9__accordion-item-btn');
      const answer = item.querySelector('.section-9__accordion-answer');
      
      if (button) {
        button.addEventListener('click', () => {
          const isOpen = item.hasAttribute('data-accordion-open');
          
          // Toggle current item
          if (isOpen) {
            item.removeAttribute('data-accordion-open');
          } else {
            item.setAttribute('data-accordion-open', '');
          }
          
          // Update section height dynamically with smooth animation
          this.updateSectionHeight();
        });
      }
    });
  }
  
  updateSectionHeight() {
    if (!this.section) return;
    
    // If base height not set yet, set it now
    if (!this.baseSectionHeight) {
      this.baseSectionHeight = this.section.offsetHeight;
    }
    
    // Use requestAnimationFrame to ensure DOM has updated
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        // Calculate total height of all open answers
        let totalAnswerHeight = 0;
        this.accordionItems.forEach((item) => {
          if (item.hasAttribute('data-accordion-open')) {
            const answer = item.querySelector('.section-9__accordion-answer');
            if (answer) {
              // Measure actual content height when fully expanded
              const currentMaxHeight = answer.style.maxHeight;
              const currentOpacity = answer.style.opacity;
              answer.style.maxHeight = 'none';
              answer.style.opacity = '1';
              answer.style.visibility = 'hidden';
              answer.style.position = 'absolute';
              const answerHeight = answer.scrollHeight + parseFloat(getComputedStyle(answer).marginTop) + parseFloat(getComputedStyle(answer).marginBottom);
              answer.style.maxHeight = currentMaxHeight;
              answer.style.opacity = currentOpacity;
              answer.style.visibility = '';
              answer.style.position = '';
              totalAnswerHeight += answerHeight;
            }
          }
        });
        
        // Update section height with smooth animation synchronized with answer animation (0.4s)
        const newHeight = this.baseSectionHeight + totalAnswerHeight;
        if (typeof gsap !== 'undefined') {
          gsap.to(this.section, {
            height: newHeight,
            duration: 0.4, // Match answer animation duration exactly
            ease: 'power1.inOut',
            onComplete: () => {
              // Update Lenis scroll height after animation
              if (window.lenis) {
                window.lenis.resize();
              }
            }
          });
        } else {
          this.section.style.transition = 'height 0.4s ease';
          this.section.style.height = `${newHeight}px`;
          // Update Lenis scroll height after transition
          setTimeout(() => {
            if (window.lenis) {
              window.lenis.resize();
            }
          }, 400);
        }
      });
    });
  }
}

export default Section9Accordion;

