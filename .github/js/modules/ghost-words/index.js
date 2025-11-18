class GhostWordsManager {
    constructor() {
        this.lgCard = null;
        this.config = {
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
        window.addEventListener('resize', () => this.updateVariables());
    }
    setup() {
        this.lgCard = document.querySelector('.lg-card');
        if (!this.lgCard) {
            console.warn('GhostWordsManager: .lg-card не найден');
            return;
        }
        this.updateVariables();
        window.ghostWordsManager = this;
    }
    updateVariables() {
        if (!this.lgCard) return;
        const isMobile = window.matchMedia('(max-width: 480px)').matches;
        const values = isMobile ? this.config.mobile : this.config.desktop;
        this.lgCard.style.setProperty('--ghost-otzyvy-top', values.otzyvy.top);
        this.lgCard.style.setProperty('--ghost-otzyvy-left', values.otzyvy.left);
        this.lgCard.style.setProperty('--ghost-otzyvy-font-size', values.otzyvy.fontSize);
        this.lgCard.style.setProperty('--ghost-reyting-top', values.reyting.top);
        this.lgCard.style.setProperty('--ghost-reyting-right', values.reyting.right);
        this.lgCard.style.setProperty('--ghost-reyting-font-size', values.reyting.fontSize);
    }
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
    getValues(breakpoint = 'desktop') {
        return JSON.parse(JSON.stringify(this.config[breakpoint]));
    }
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
const ghostWordsManager = new GhostWordsManager();
export default ghostWordsManager;
