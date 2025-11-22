class Section7Cards {
  // SVG icons as constants to avoid duplication
  static SVG_EXPANDED = '<path fill-rule="evenodd" clip-rule="evenodd" d="M9.78033 5.78033C9.48744 6.07322 9.01256 6.07322 8.71967 5.78033L5.25 2.31066L1.78033 5.78033C1.48744 6.07322 1.01256 6.07322 0.71967 5.78033C0.426777 5.48744 0.426777 5.01256 0.71967 4.71967L4.54289 0.896447C4.93342 0.505923 5.56658 0.505923 5.95711 0.896447L9.78033 4.71967C10.0732 5.01256 10.0732 5.48744 9.78033 5.78033Z" fill="#1C1C1C"/>';
  static SVG_COLLAPSED = '<path fill-rule="evenodd" clip-rule="evenodd" d="M0.21967 0.21967C0.512563 -0.0732233 0.987437 -0.0732233 1.28033 0.21967L4.75 3.68934L8.21967 0.21967C8.51256 -0.0732233 8.98744 -0.0732233 9.28033 0.21967C9.57322 0.512563 9.57322 0.987437 9.28033 1.28033L5.45711 5.10355C5.06658 5.49408 4.43342 5.49408 4.04289 5.10355L0.21967 1.28033C-0.0732233 0.987437 -0.0732233 0.512563 0.21967 0.21967Z" fill="#1C1C1C"/>';
  
  constructor() {
    this.cards = document.querySelectorAll('.section-7__card');
    this.section = document.querySelector('.section-7');
    if (!this.cards.length) return;
    this.init();
  }
  
  /**
   * Calculate adaptive value based on viewport width
   * @param {number} min - Minimum value in pixels
   * @param {number} max - Maximum value in pixels
   * @returns {number} Adaptive value
   */
  getAdaptiveValue(min, max) {
    const viewportWidth = window.innerWidth;
    // Linear interpolation between min and max based on viewport width
    // Assuming breakpoints: 375px (mobile) to 1920px (desktop)
    const minWidth = 375;
    const maxWidth = 1920;
    const ratio = Math.min(1, Math.max(0, (viewportWidth - minWidth) / (maxWidth - minWidth)));
    return min + (max - min) * ratio;
  }
  
  init() {
    this.cards.forEach((card) => {
      const readMoreBtn = card.querySelector('.section-7__card-read-more');
      const descShort = card.querySelector('.section-7__card-desc-short');
      const descFull = card.querySelector('.section-7__card-desc-full');
      const cardRating = card.querySelector('.section-7__card-rating');
      const cardResults = card.querySelector('.section-7__card-results');
      
      if (readMoreBtn) {
        // Store base heights on first interaction
        if (!card.dataset.baseHeight) {
          card.dataset.baseHeight = card.offsetHeight;
        }
        if (this.section && !this.section.dataset.baseHeight) {
          this.section.dataset.baseHeight = this.section.offsetHeight;
        }
        
        readMoreBtn.addEventListener('click', () => {
          const isExpanded = card.classList.toggle('is-expanded');
          const span = readMoreBtn.querySelector('span');
          const svg = readMoreBtn.querySelector('svg');
          
          // Get base heights
          const baseCardHeight = parseFloat(card.dataset.baseHeight) || card.offsetHeight;
          const baseSectionHeight = this.section ? (parseFloat(this.section.dataset.baseHeight) || this.section.offsetHeight) : 0;
          
          // Calculate adaptive increments (increased to fit rating values and add spacing)
          const cardIncrement = this.getAdaptiveValue(60, 110); // Increased to 60-110px for more space below rating
          const sectionIncrement = this.getAdaptiveValue(80, 130); // Increased to 80-130px to match card growth
          
          // Common animation function for expand/collapse (reversible)
          const animateTextToggle = (expand) => {
            if (!descShort || !descFull) {
              // No text elements, just animate height
              const targetCardHeight = expand ? baseCardHeight + cardIncrement : baseCardHeight;
              const targetSectionHeight = expand ? baseSectionHeight + sectionIncrement : baseSectionHeight;
              
              if (typeof gsap !== 'undefined') {
                gsap.to(card, {
                  height: targetCardHeight,
                  duration: 0.8,
                  ease: 'power1.inOut'
                });
                if (this.section) {
                  gsap.to(this.section, {
                    height: targetSectionHeight,
                    duration: 0.8,
                    ease: 'power1.inOut'
                  });
                }
              } else {
                card.style.transition = 'height 0.8s ease';
                card.style.height = `${targetCardHeight}px`;
                if (this.section) {
                  this.section.style.transition = 'height 0.8s ease';
                  this.section.style.height = `${targetSectionHeight}px`;
                }
              }
              return;
            }
            
            if (typeof gsap !== 'undefined') {
              // Kill any existing animations first
              gsap.killTweensOf(card);
              gsap.killTweensOf(descFull);
              gsap.killTweensOf(descShort);
              if (this.section) {
                gsap.killTweensOf(this.section);
              }
              
              // Clear CSS transitions
              card.style.transition = 'none';
              descFull.style.transition = 'none';
              if (this.section) {
                this.section.style.transition = 'none';
              }
              
              // Measure heights
              descShort.style.setProperty('display', 'block', 'important');
              descFull.style.setProperty('display', 'none', 'important');
              const shortHeight = descShort.offsetHeight;
              
              descShort.style.setProperty('display', 'none', 'important');
              descFull.style.setProperty('display', 'block', 'important');
              descFull.style.visibility = 'hidden';
              descFull.style.position = 'absolute';
              const fullHeight = descFull.offsetHeight;
              descFull.style.visibility = '';
              descFull.style.position = '';
              
              // Calculate durations based on distance to synchronize speed
              const cardHeightDistance = cardIncrement;
              const textDistance = fullHeight - shortHeight;
              const baseSpeed = 275;
              const speedMultiplier = 1.2;
              const finalCardDuration = (cardHeightDistance / baseSpeed) * speedMultiplier;
              const finalTextDuration = (textDistance / baseSpeed) * speedMultiplier;
              const animEase = 'power1.inOut';
              
              // Prepare elements for animation
              card.style.setProperty('overflow', 'hidden', 'important');
              
              if (expand) {
                // EXPAND: short -> full
                // Start: show short, hide full (position absolute to avoid layout shift)
                descShort.style.setProperty('display', 'block', 'important');
                descShort.style.setProperty('opacity', '1', 'important');
                descFull.style.setProperty('display', 'block', 'important');
                descFull.style.setProperty('position', 'absolute', 'important');
                descFull.style.setProperty('top', '0', 'important');
                descFull.style.setProperty('left', '0', 'important');
                descFull.style.setProperty('width', '100%', 'important');
                gsap.set(descFull, { maxHeight: shortHeight, overflow: 'hidden', opacity: 0, immediateRender: true });
                gsap.set(card, { height: baseCardHeight, immediateRender: true });
                if (this.section) {
                  gsap.set(this.section, { height: baseSectionHeight, immediateRender: true });
                }
                
                // Animate
                const tl = gsap.timeline({
                  onComplete: () => {
                    descShort.style.setProperty('display', 'none', 'important');
                    descFull.style.removeProperty('position');
                    descFull.style.removeProperty('top');
                    descFull.style.removeProperty('left');
                    descFull.style.removeProperty('width');
                    descFull.style.removeProperty('max-height');
                    descFull.style.removeProperty('overflow');
                    descFull.style.removeProperty('opacity');
                    card.style.removeProperty('overflow');
                    card.style.setProperty('height', `${baseCardHeight + cardIncrement}px`, 'important');
                    if (this.section) {
                      this.section.style.setProperty('height', `${baseSectionHeight + sectionIncrement}px`, 'important');
                    }
                    // Update Lenis scroll height after section height change
                    if (window.lenis) {
                      window.lenis.resize();
                    }
                  }
                });
                
                // Fade out short, then fade in full (sequential to avoid overlap)
                tl.to(descShort, { opacity: 0, duration: 0.15, ease: animEase }, 0);
                tl.call(() => {
                  descShort.style.setProperty('display', 'none', 'important');
                  descFull.style.removeProperty('position');
                  descFull.style.removeProperty('top');
                  descFull.style.removeProperty('left');
                  descFull.style.removeProperty('width');
                }, null, 0.15);
                tl.to(descFull, { maxHeight: fullHeight, opacity: 1, duration: finalTextDuration, ease: animEase }, 0.15);
                tl.to(card, { height: baseCardHeight + cardIncrement, duration: finalCardDuration, ease: animEase }, 0);
                if (this.section) {
                  tl.to(this.section, { height: baseSectionHeight + sectionIncrement, duration: finalCardDuration, ease: animEase }, 0);
                }
              } else {
                // COLLAPSE: full -> short
                // Hide full immediately, show short immediately to avoid overlap
                descFull.style.setProperty('display', 'none', 'important');
                descShort.style.setProperty('display', 'block', 'important');
                descShort.style.setProperty('opacity', '1', 'important');
                
                // Measure current position of rating/button for smooth transition
                const ratingMarginTop = cardRating ? parseFloat(getComputedStyle(cardRating).marginTop) || 0 : 0;
                const resultsMarginBottom = cardResults ? parseFloat(getComputedStyle(cardResults).marginBottom) || 0 : 0;
                
                // Set initial state
                gsap.set(card, { height: baseCardHeight + cardIncrement, immediateRender: true });
                if (this.section) {
                  gsap.set(this.section, { height: baseSectionHeight + sectionIncrement, immediateRender: true });
                }
                
                // Animate - decrease height smoothly
                const tl = gsap.timeline({
                  onComplete: () => {
                    card.style.removeProperty('overflow');
                    card.style.setProperty('height', `${baseCardHeight}px`, 'important');
                    if (this.section) {
                      this.section.style.setProperty('height', `${baseSectionHeight}px`, 'important');
                    }
                    // Clean up any margin animations
                    if (cardRating) {
                      cardRating.style.removeProperty('margin-top');
                    }
                    if (cardResults) {
                      cardResults.style.removeProperty('margin-bottom');
                    }
                    // Update Lenis scroll height after section height change
                    if (window.lenis) {
                      window.lenis.resize();
                    }
                  }
                });
                
                // Height decreases smoothly - same duration as expand
                tl.to(card, { height: baseCardHeight, duration: finalCardDuration, ease: animEase }, 0);
                if (this.section) {
                  tl.to(this.section, { height: baseSectionHeight, duration: finalCardDuration, ease: animEase }, 0);
                }
              }
            } else {
              // Fallback without GSAP
              // Measure heights properly
              descShort.style.setProperty('display', 'block', 'important');
              descFull.style.setProperty('display', 'none', 'important');
              const shortHeight = descShort.offsetHeight;
              
              descShort.style.setProperty('display', 'none', 'important');
              descFull.style.setProperty('display', 'block', 'important');
              descFull.style.visibility = 'hidden';
              descFull.style.position = 'absolute';
              const fullHeight = descFull.offsetHeight;
              descFull.style.visibility = '';
              descFull.style.position = '';
              
              if (expand) {
                descShort.style.display = 'none';
                descFull.style.display = 'block';
                descFull.style.maxHeight = `${shortHeight}px`;
                descFull.style.overflow = 'hidden';
                descFull.style.transition = 'max-height 0.8s ease';
                
                setTimeout(() => {
                  descFull.style.maxHeight = `${fullHeight}px`;
                  setTimeout(() => {
                    descFull.style.maxHeight = '';
                    descFull.style.overflow = '';
                  }, 800);
                }, 10);
              } else {
                descFull.style.maxHeight = `${fullHeight}px`;
                descFull.style.overflow = 'hidden';
                descFull.style.transition = 'max-height 0.8s ease';
                
                setTimeout(() => {
                  descFull.style.maxHeight = `${shortHeight}px`;
                  setTimeout(() => {
                    descFull.style.display = 'none';
                    descFull.style.maxHeight = '';
                    descFull.style.overflow = '';
                    descShort.style.display = 'block';
                  }, 800);
                }, 10);
              }
              
              // Synchronize card height with text animation
              card.style.transition = 'height 0.8s ease';
              card.style.height = `${expand ? baseCardHeight + cardIncrement : baseCardHeight}px`;
              if (this.section) {
                this.section.style.transition = 'height 0.8s ease';
                this.section.style.height = `${expand ? baseSectionHeight + sectionIncrement : baseSectionHeight}px`;
              }
            }
          };
          
          if (isExpanded) {
            // Expand: reverse of collapse
            animateTextToggle(true);
            span.textContent = 'Свернуть';
            svg.innerHTML = Section7Cards.SVG_EXPANDED;
          } else {
            // Collapse: reverse of expand
            animateTextToggle(false);
            span.textContent = 'Читать полностью';
            svg.innerHTML = Section7Cards.SVG_COLLAPSED;
          }
        });
      }
    });
  }
}

export default Section7Cards;