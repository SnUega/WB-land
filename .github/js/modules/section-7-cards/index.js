class Section7Cards {
  static SVG_EXPANDED = '<path fill-rule="evenodd" clip-rule="evenodd" d="M9.78033 5.78033C9.48744 6.07322 9.01256 6.07322 8.71967 5.78033L5.25 2.31066L1.78033 5.78033C1.48744 6.07322 1.01256 6.07322 0.71967 5.78033C0.426777 5.48744 0.426777 5.01256 0.71967 4.71967L4.54289 0.896447C4.93342 0.505923 5.56658 0.505923 5.95711 0.896447L9.78033 4.71967C10.0732 5.01256 10.0732 5.48744 9.78033 5.78033Z" fill="#1C1C1C"/>';
  static SVG_COLLAPSED = '<path fill-rule="evenodd" clip-rule="evenodd" d="M0.21967 0.21967C0.512563 -0.0732233 0.987437 -0.0732233 1.28033 0.21967L4.75 3.68934L8.21967 0.21967C8.51256 -0.0732233 8.98744 -0.0732233 9.28033 0.21967C9.57322 0.512563 9.57322 0.987437 9.28033 1.28033L5.45711 5.10355C5.06658 5.49408 4.43342 5.49408 4.04289 5.10355L0.21967 1.28033C-0.0732233 0.987437 -0.0732233 0.512563 0.21967 0.21967Z" fill="#1C1C1C"/>';
  
  constructor() {
    this.cards = document.querySelectorAll('.section-7__card');
    this.section = document.querySelector('.section-7');
    if (!this.cards.length) return;
    this.init();
  }
  
  getAdaptiveValue(min, max) {
    const viewportWidth = window.innerWidth;
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
          
          const baseCardHeight = parseFloat(card.dataset.baseHeight) || card.offsetHeight;
          const baseSectionHeight = this.section ? (parseFloat(this.section.dataset.baseHeight) || this.section.offsetHeight) : 0;
          
          const cardIncrement = this.getAdaptiveValue(60, 110);
          const sectionIncrement = this.getAdaptiveValue(80, 130);
          
          const animateTextToggle = (expand) => {
            if (!descShort || !descFull) {
              const targetCardHeight = expand ? baseCardHeight + cardIncrement : baseCardHeight;
              const targetSectionHeight = expand ? baseSectionHeight + sectionIncrement : baseSectionHeight;
              
              if (typeof gsap !== 'undefined') {
                const tl = gsap.timeline({
                  onComplete: () => {
                    if (!expand) {
                      card.style.removeProperty('height');
                      if (this.section) {
                        this.section.style.removeProperty('height');
                      }
                    }
                    if (window.lenis) {
                      window.lenis.resize();
                    }
                  }
                });
                tl.to(card, {
                  height: targetCardHeight,
                  duration: 0.8,
                  ease: 'power1.inOut'
                });
                if (this.section) {
                  tl.to(this.section, {
                    height: targetSectionHeight,
                    duration: 0.8,
                    ease: 'power1.inOut'
                  }, 0);
                }
              } else {
                card.style.transition = 'height 0.8s ease';
                card.style.height = `${targetCardHeight}px`;
                if (this.section) {
                  this.section.style.transition = 'height 0.8s ease';
                  this.section.style.height = `${targetSectionHeight}px`;
                }
                if (!expand) {
                  setTimeout(() => {
                    card.style.removeProperty('height');
                    if (this.section) {
                      this.section.style.removeProperty('height');
                    }
                  }, 800);
                }
              }
              return;
            }
            
            if (typeof gsap !== 'undefined') {
              gsap.killTweensOf(card);
              gsap.killTweensOf(descFull);
              gsap.killTweensOf(descShort);
              if (this.section) {
                gsap.killTweensOf(this.section);
              }
              
              card.style.transition = 'none';
              descFull.style.transition = 'none';
              if (this.section) {
                this.section.style.transition = 'none';
              }
              
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
              
              const cardHeightDistance = cardIncrement;
              const textDistance = fullHeight - shortHeight;
              const baseSpeed = 275;
              const speedMultiplier = 1.2;
              const finalCardDuration = (cardHeightDistance / baseSpeed) * speedMultiplier;
              const finalTextDuration = (textDistance / baseSpeed) * speedMultiplier;
              const animEase = 'power1.inOut';
              
              card.style.setProperty('overflow', 'hidden', 'important');
              
              if (expand) {
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
                    if (window.lenis) {
                      window.lenis.resize();
                    }
                  }
                });
                
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
                descFull.style.setProperty('display', 'none', 'important');
                descShort.style.setProperty('display', 'block', 'important');
                descShort.style.setProperty('opacity', '1', 'important');
                
                const ratingMarginTop = cardRating ? parseFloat(getComputedStyle(cardRating).marginTop) || 0 : 0;
                const resultsMarginBottom = cardResults ? parseFloat(getComputedStyle(cardResults).marginBottom) || 0 : 0;
                
                gsap.set(card, { height: baseCardHeight + cardIncrement, immediateRender: true });
                if (this.section) {
                  gsap.set(this.section, { height: baseSectionHeight + sectionIncrement, immediateRender: true });
                }
                
                const tl = gsap.timeline({
                  onComplete: () => {
                    card.style.removeProperty('overflow');
                    card.style.removeProperty('height');
                    if (this.section) {
                      this.section.style.removeProperty('height');
                    }
                    if (cardRating) {
                      cardRating.style.removeProperty('margin-top');
                    }
                    if (cardResults) {
                      cardResults.style.removeProperty('margin-bottom');
                    }
                    if (window.lenis) {
                      window.lenis.resize();
                    }
                  }
                });
                
                tl.to(card, { height: baseCardHeight, duration: finalCardDuration, ease: animEase }, 0);
                if (this.section) {
                  tl.to(this.section, { height: baseSectionHeight, duration: finalCardDuration, ease: animEase }, 0);
                }
              }
            } else {
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
              
              card.style.transition = 'height 0.8s ease';
              card.style.height = `${expand ? baseCardHeight + cardIncrement : baseCardHeight}px`;
              if (this.section) {
                this.section.style.transition = 'height 0.8s ease';
                this.section.style.height = `${expand ? baseSectionHeight + sectionIncrement : baseSectionHeight}px`;
              }
            }
          };
          
          if (isExpanded) {
            animateTextToggle(true);
            span.textContent = 'Свернуть';
            svg.innerHTML = Section7Cards.SVG_EXPANDED;
          } else {
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