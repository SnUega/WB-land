class Section3Animation {
  constructor() {
    this.section = document.querySelector('.section-3');
    if (!this.section) return;
    this.init();
  }
  init() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      console.warn('GSAP or ScrollTrigger not loaded');
      return;
    }
    gsap.registerPlugin(ScrollTrigger);
    const title = this.section.querySelector('.section-3__title');
    const question = this.section.querySelector('.section-3__question');
    const responses = this.section.querySelector('.section-3__responses');
    const responsesNumber = this.section.querySelector('.section-3__responses-number');
    const bars = this.section.querySelectorAll('.chart-item__bar');
    const values = this.section.querySelectorAll('.chart-item__value');
    // Reset function to be called on each animation
    const resetAnimation = () => {
      gsap.set(bars, { width: '0%' });
      if (responsesNumber) {
        responsesNumber.setAttribute('data-target', '86');
        responsesNumber.textContent = '0';
      }
      values.forEach((valueEl) => {
        const originalText = valueEl.getAttribute('data-original-text') || valueEl.textContent;
        valueEl.setAttribute('data-original-text', originalText);
        let zeroText = originalText.replace(/[\d.]+/g, '0');
        valueEl.textContent = zeroText;
      });
    };
    
    // Initial reset
    resetAnimation();
    if (responsesNumber) {
      let responsesNumberTween = null;
      const responsesNumberObj = { value: 0 };
      
      const animateNumber = () => {
        if (responsesNumberTween) {
          responsesNumberTween.kill();
        }
        responsesNumberObj.value = 0;
        responsesNumber.textContent = '0';
        responsesNumberTween = gsap.to(responsesNumberObj, {
          value: 86,
          duration: 2.6,
          ease: 'none',
          onUpdate: () => {
            responsesNumber.textContent = Math.floor(responsesNumberObj.value);
          },
        });
      };
      
      ScrollTrigger.create({
        trigger: this.section,
        start: 'top 80%',
        end: 'bottom top',
        onEnter: () => {
          resetAnimation();
          animateNumber();
        },
        onEnterBack: () => {
          resetAnimation();
          animateNumber();
        },
        onLeave: () => {
          if (responsesNumberTween) {
            responsesNumberTween.kill();
          }
          responsesNumberObj.value = 0;
          responsesNumber.textContent = '0';
        },
        onLeaveBack: () => {
          if (responsesNumberTween) {
            responsesNumberTween.kill();
          }
          responsesNumberObj.value = 0;
          responsesNumber.textContent = '0';
        },
        once: false,
      });
    }
    const barsTl = gsap.timeline({
      paused: true,
    });
    barsTl.to({}, { duration: 1.5 });
    
    ScrollTrigger.create({
      trigger: this.section,
      start: 'top 80%',
      end: 'bottom top',
      onEnter: () => {
        barsTl.progress(0);
        barsTl.restart();
        resetAnimation();
      },
      onEnterBack: () => {
        barsTl.progress(0);
        barsTl.restart();
        resetAnimation();
      },
      onLeave: () => {
        barsTl.pause();
        barsTl.progress(0);
        resetAnimation();
      },
      onLeaveBack: () => {
        barsTl.pause();
        barsTl.progress(0);
        resetAnimation();
      },
      once: false,
    });
    bars.forEach((bar, index) => {
      const percent = bar.getAttribute('data-percent');
      const valueElement = values[index];
      const isOne = parseFloat(percent) <= 1.5; // Проверяем, если процент <= 1.5 (единицы)
      const barDuration = isOne ? 0.8 : 2.6;
      const barEase = isOne ? 'power2.out' : 'power1.out';
      barsTl.to(
        bar,
        {
          width: `${percent}%`,
          duration: barDuration,
          ease: barEase,
        },
        '<' // Все прогрессбары начинаются одновременно после задержки
      );
      if (valueElement) {
        const originalText = valueElement.getAttribute('data-original-text');
        const numbers = originalText.match(/[\d.]+/g) || [];
        if (numbers.length > 0) {
          const mainNumber = parseFloat(numbers[0]);
          const percentNumber = numbers[1] ? parseFloat(numbers[1]) : null;
          const numberObj = { value: 0 };
          const percentObj = percentNumber ? { value: 0 } : null;
          const updateText = () => {
            let newText = originalText;
            const currentValue = Math.floor(numberObj.value);
            newText = newText.replace(/[\d.]+/, currentValue);
            if (percentObj && percentNumber) {
              const currentPercent = Math.floor(percentObj.value * 10) / 10; // Округляем до 0.1
              newText = newText.replace(/\([\d.]+%\)/, `(${currentPercent.toFixed(1)}%)`);
            }
            valueElement.textContent = newText;
          };
          const isOneNumber = mainNumber === 1;
          const numberDuration = isOneNumber ? 0.8 : 2.6;
          const numberEase = isOneNumber ? 'power2.out' : 'none';
          barsTl.to(
            numberObj,
            {
              value: mainNumber,
              duration: numberDuration,
              ease: numberEase,
              onUpdate: updateText,
            },
            '<' // Одновременно с прогрессбарами
          );
          if (percentObj && percentNumber) {
            const wholePart = Math.floor(percentNumber);
            const decimalPart = percentNumber - wholePart;
            const isOnePercent = mainNumber === 1;
            const firstDuration = isOnePercent ? 0.2 : 0.3;
            const secondDuration = isOnePercent ? 0.6 : 2.3;
            const percentEase = isOnePercent ? 'power2.out' : 'none';
            barsTl.to(
              percentObj,
              {
                value: wholePart,
                duration: firstDuration,
                ease: 'none',
                onUpdate: updateText,
              },
              '<' // Начинается одновременно
            );
            if (decimalPart > 0) {
              barsTl.to(
                percentObj,
                {
                  value: percentNumber,
                  duration: secondDuration, // Для единиц быстрее
                  ease: percentEase, // Плавная анимация для единиц
                  onUpdate: updateText,
                },
                '>' // После предыдущей анимации
              );
            }
          }
        }
      }
    });
  }
}
export default Section3Animation;
