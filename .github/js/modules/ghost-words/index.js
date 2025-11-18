// Ghost Words Module - управление позиционированием ghost слов "Рейтинг" и "Отзывы"
// Этот модуль позволяет динамически изменять позиции ghost слов через CSS переменные

class GhostWordsManager {
    constructor() {
        this.lgCard = null;
        this.config = {
            // Десктоп значения по умолчанию (соответствуют текущим значениям в CSS)
            desktop: {
                otzyvy: {
                    top: '11vw',
                    left: '63vw',
                    fontSize: '1.56vw'
                },
                reyting: {
                    top: '6vw',
                    right: '9.5vw',
                    fontSize: '3.65vw'
                }
            },
            // Мобильные значения по умолчанию
            mobile: {
                otzyvy: {
                    top: '1vw',
                    left: '2vw',
                    fontSize: '4.27vw'
                },
                reyting: {
                    top: '-18vw',
                    right: '-5.5vw',
                    fontSize: '6.4vw'
                }
            }
        };
        this.init();
    }

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }

        // Слушаем изменения размера окна для обновления значений
        window.addEventListener('resize', () => this.updateVariables());
    }

    setup() {
        this.lgCard = document.querySelector('.lg-card');
        
        if (!this.lgCard) {
            console.warn('GhostWordsManager: .lg-card не найден');
            return;
        }

        // Применяем начальные значения
        this.updateVariables();

        // Экспортируем метод для внешнего использования
        window.ghostWordsManager = this;
    }

    /**
     * Обновляет CSS переменные на элементе .lg-card
     */
    updateVariables() {
        if (!this.lgCard) return;

        // Определяем мобильное/десктопное состояние согласно новым медиа-запросам
        // Mobile: до 480px
        const isMobile = window.matchMedia('(max-width: 480px)').matches;
        
        const values = isMobile ? this.config.mobile : this.config.desktop;

        // Устанавливаем переменные на элементе .lg-card
        this.lgCard.style.setProperty('--ghost-otzyvy-top', values.otzyvy.top);
        this.lgCard.style.setProperty('--ghost-otzyvy-left', values.otzyvy.left);
        this.lgCard.style.setProperty('--ghost-otzyvy-font-size', values.otzyvy.fontSize);
        
        this.lgCard.style.setProperty('--ghost-reyting-top', values.reyting.top);
        this.lgCard.style.setProperty('--ghost-reyting-right', values.reyting.right);
        this.lgCard.style.setProperty('--ghost-reyting-font-size', values.reyting.fontSize);
    }

    /**
     * Устанавливает значения для ghost слов
     * @param {Object} values - Объект с новыми значениями
     * @param {string} breakpoint - 'desktop' или 'mobile'
     */
    setValues(values, breakpoint = 'desktop') {
        if (!['desktop', 'mobile'].includes(breakpoint)) {
            console.error('GhostWordsManager: breakpoint должен быть "desktop" или "mobile"');
            return;
        }

        if (values.otzyvy) {
            if (values.otzyvy.top !== undefined) this.config[breakpoint].otzyvy.top = values.otzyvy.top;
            if (values.otzyvy.left !== undefined) this.config[breakpoint].otzyvy.left = values.otzyvy.left;
            if (values.otzyvy.fontSize !== undefined) this.config[breakpoint].otzyvy.fontSize = values.otzyvy.fontSize;
        }

        if (values.reyting) {
            if (values.reyting.top !== undefined) this.config[breakpoint].reyting.top = values.reyting.top;
            if (values.reyting.right !== undefined) this.config[breakpoint].reyting.right = values.reyting.right;
            if (values.reyting.fontSize !== undefined) this.config[breakpoint].reyting.fontSize = values.reyting.fontSize;
        }

        this.updateVariables();
    }

    /**
     * Получает текущие значения
     * @param {string} breakpoint - 'desktop' или 'mobile'
     * @returns {Object} Текущие значения
     */
    getValues(breakpoint = 'desktop') {
        return JSON.parse(JSON.stringify(this.config[breakpoint]));
    }

    /**
     * Сбрасывает значения к значениям по умолчанию
     * @param {string} breakpoint - 'desktop' или 'mobile'
     */
    reset(breakpoint = 'desktop') {
        if (breakpoint === 'desktop') {
            this.config.desktop = {
                otzyvy: {
                    top: '1.56vw',
                    left: '1.56vw',
                    fontSize: '1.56vw'
                },
                reyting: {
                    top: 'auto',
                    right: '1.56vw',
                    fontSize: '3.65vw'
                }
            };
        } else {
            this.config.mobile = {
                otzyvy: {
                    top: '1vw',
                    left: '2vw',
                    fontSize: '4.27vw'
                },
                reyting: {
                    top: '-18vw',
                    right: '-5.5vw',
                    fontSize: '6.4vw'
                }
            };
        }
        this.updateVariables();
    }
}

// Инициализация модуля
const ghostWordsManager = new GhostWordsManager();

export default ghostWordsManager;

