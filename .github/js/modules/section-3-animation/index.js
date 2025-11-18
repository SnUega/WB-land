// Section 3 Animation with ScrollTrigger
// GSAP и ScrollTrigger должны быть подключены через CDN

class Section3Animation {
  constructor() {
    this.section = document.querySelector('.section-3');
    if (!this.section) return;

    this.init();
  }

  init() {
    // Проверяем наличие GSAP
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      console.warn('GSAP or ScrollTrigger not loaded');
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    // Получаем элементы
    const title = this.section.querySelector('.section-3__title');
    const question = this.section.querySelector('.section-3__question');
    const responses = this.section.querySelector('.section-3__responses');
    const responsesNumber = this.section.querySelector('.section-3__responses-number');
    const bars = this.section.querySelectorAll('.chart-item__bar');
    const values = this.section.querySelectorAll('.chart-item__value');

    // Устанавливаем начальное состояние для прогрессбаров
    gsap.set(bars, { width: '0%' });
    
    // Устанавливаем начальное значение для числа ответов (будет анимироваться)
    if (responsesNumber) {
      responsesNumber.setAttribute('data-target', '86');
      responsesNumber.textContent = '0';
    }

    // Устанавливаем начальные значения цифр в 0
    values.forEach((valueEl) => {
      const originalText = valueEl.textContent;
      valueEl.setAttribute('data-original-text', originalText);
      // Заменяем все числа на 0
      let zeroText = originalText.replace(/[\d.]+/g, '0');
      valueEl.textContent = zeroText;
    });

    // Анимация числа "86" в responses (начинается вместе с каскадным появлением заголовков)
    if (responsesNumber) {
      const responsesNumberObj = { value: 0 };
      gsap.to(responsesNumberObj, {
        value: 86,
        duration: 2.6,
        ease: 'none',
        scrollTrigger: {
          trigger: this.section,
          start: 'top 75%',
          end: 'bottom 25%',
          toggleActions: 'play none none none',
          once: true,
        },
        onUpdate: () => {
          responsesNumber.textContent = Math.floor(responsesNumberObj.value);
        },
      });
    }

    // Создаем timeline для анимации прогрессбаров и цифр
    const barsTl = gsap.timeline({
      scrollTrigger: {
        trigger: this.section,
        start: 'top 75%',
        end: 'bottom 25%',
        toggleActions: 'play none none none',
        once: true,
      },
    });

    // Небольшая задержка после появления заголовков (примерно 1.5 секунды)
    barsTl.to({}, { duration: 1.5 });

    // Анимация прогрессбаров и цифр одновременно
    bars.forEach((bar, index) => {
      const percent = bar.getAttribute('data-percent');
      const valueElement = values[index];

      // Анимация ширины прогрессбара (очень плавная)
      // Для единиц делаем быстрее и плавнее
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

      // Анимация цифр в значениях прогрессбаров
      if (valueElement) {
        const originalText = valueElement.getAttribute('data-original-text');
        // Извлекаем все числа из текста
        const numbers = originalText.match(/[\d.]+/g) || [];

        if (numbers.length > 0) {
          const mainNumber = parseFloat(numbers[0]);
          const percentNumber = numbers[1] ? parseFloat(numbers[1]) : null;

          // Создаем объекты для анимации
          const numberObj = { value: 0 };
          const percentObj = percentNumber ? { value: 0 } : null;

          // Функция обновления текста
          const updateText = () => {
            let newText = originalText;
            // Заменяем первое число (только целые числа)
            const currentValue = Math.floor(numberObj.value);
            newText = newText.replace(/[\d.]+/, currentValue);
            // Заменяем процент, если есть
            if (percentObj && percentNumber) {
              const currentPercent = Math.floor(percentObj.value * 10) / 10; // Округляем до 0.1
              newText = newText.replace(/\([\d.]+%\)/, `(${currentPercent.toFixed(1)}%)`);
            }
            valueElement.textContent = newText;
          };

          // Анимация основного числа (синхронизирована с прогрессбаром)
          // Для единиц делаем быстрее и плавнее, синхронизируем с прогрессбаром
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

          // Анимация процента (очень быстро до целого, затем медленнее до десятичного)
          if (percentObj && percentNumber) {
            const wholePart = Math.floor(percentNumber);
            const decimalPart = percentNumber - wholePart;
            
            // Для единиц делаем быстрее и плавнее
            const isOnePercent = mainNumber === 1;
            const firstDuration = isOnePercent ? 0.2 : 0.3;
            const secondDuration = isOnePercent ? 0.6 : 2.3;
            const percentEase = isOnePercent ? 'power2.out' : 'none';
            
            // Сначала быстро до целого числа
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
            
            // Затем медленнее до десятичного
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


    // Timeline уже настроен с ScrollTrigger, ничего не добавляем
  }
}

export default Section3Animation;
