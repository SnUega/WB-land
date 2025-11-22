class Translations {
  constructor() {
    this.currentLang = localStorage.getItem('lang') || 'rus';
    this.translations = {
      rus: {
        // Navigation
        'nav.about': 'О сервисе',
        'nav.how': 'Как это работает?',
        'nav.advantages': 'Преимущества',
        'nav.reviews': 'Отзывы и результаты',
        'nav.pricing': 'Стоимость услуг',
        'nav.faq': 'FAQ',
        'nav.contacts': 'Контакты',
        
        // Hero section
        'hero.subtitle': 'Репутационный менеджмент',
        'hero.title': 'Управление репутацией <span class="hero__title-nowrap">на Wildberries</span>',
        'hero.description': 'Укрепляем репутацию, рейтинг и доверие — чтобы ваши товары оставались в ТОПе выдачи и стабильно росли в продажах с минимальными затратами на продвижение.',
        'hero.cta': 'Укрепить репутацию',
        
        // Section 2
        'section2.subtitle': 'Что мешает продажам',
        'section2.title': 'На Wildberries всё решает<br>репутация карточки',
        'section2.desc': 'Ваш товар заслуживает больше продаж — но карточка теряется среди конкурентов?',
        'section2.cta': 'Мы делаем так, чтобы покупатели выбирали вас, а не конкурентов.',
        'section2.stat.reviews': 'отзывы',
        'section2.stat.rating': 'РЕЙТИНГ И КОММУНИКАЦИИ',
        'section2.stat.orders': 'КОНКУРЕНТЫ И УВЕЛИЧЕНИЕ',
        'section2.stat.less': 'менее',
        'section2.stat.more': 'более',
        'section2.stat.reviews.count': 'отзывов',
        'section2.stat.rating.avg': 'среднего рейтинга',
        'section2.stat.orders.count': 'конкурентов',
        'section2.stat.reviews.problem1': 'Мало отзывов и оценок — покупатели считают товар «непроверенным», повышаются затраты на рекламу (ДРР)',
        'section2.stat.reviews.problem2': 'Нет новых отзывов — карточка выглядит заброшенной',
        'section2.stat.reviews.problem3': 'Однотипные отзывы снижают доверие и конверсию',
        'section2.stat.rating.problem1': 'Средний рейтинг <4,7 — покупатели выбирают конкурентов',
        'section2.stat.rating.problem2': 'Нет ответов продавца — создаётся ощущение безразличия',
        'section2.stat.rating.problem3': 'Мало фото в отзывах — теряется визуальное доверие',
        'section2.stat.orders.problem1': 'Конкуренты обновляют отзывы и оценки быстрее',
        'section2.stat.orders.problem2': 'Покупатели ориентируются на репутацию, а не на цену',
        'section2.stat.orders.problem3': 'Даже качественные товары без отзывов остаются незамеченными',
        
        // Section 3
        'section3.title': 'Опрос покупателей',
        'section3.question': 'По каким критериям вы выбираете<br>у кого купить на WB?',
        'section3.responses': 'ответов',
        'section3.chart.brand': 'Известность бренда',
        'section3.chart.price': 'Цена',
        'section3.chart.reviews': 'Отзывы',
        'section3.chart.photo': 'Качество фото',
        'section3.chart.rating': 'Рейтинг',
        'section3.chart.delivery': 'Скорость доставки',
        'section3.chart.purchase': 'Брала только по выкупу',
        'section3.chart.materials': 'Качество материалов',
        'section3.chart.description': 'Полное описание (состав)',
        'section3.chart.quality': 'Качество вещей',
        'section3.chart.appearance': 'Внешний вид',
        'section3.chart.composition': 'В основном читаю состав...',
        
        // Section 4
        'section4.title': 'Этапы продвижения',
        'section4.question': 'Как это работает?',
        'section4.desc': 'Всё максимально просто и прозрачно. Вы запускаете продвижение карточки, а мы помогаем ей обрести доверие и внимание покупателей. Каждый шаг под вашим контролем, а результаты видны с первых дней.',
        'section4.step': 'Шаг',
        'section4.step1.title': 'Добавьте артикул товара<br>на Wildberries',
        'section4.step1.desc': 'Введите артикул, добавьте ключевые слова и выберите услугу — от лёгкого старта до комплексной работы с репутацией. Быстро запускайте продвижение без сложных настроек.',
        'section4.step2.title': 'Настройте количество выкупов и отзывов',
        'section4.step2.desc': 'Вы сами решаете, сколько выкупов и отзывов необходимо. Заполняйте график выкупов и выбирайте удобный ПВЗ для получения товара.',
        'section4.step3.title': 'Безопасная оплата через банковскую карту',
        'section4.step3.desc': 'Привяжите карту в личном кабинете и устанавливайте лимиты. Наши специалисты не имеют доступа к вашим данным — полностью безопасно для вас и товара.',
        'section4.step4.title': 'Осуществление выкупов и написание отзывов',
        'section4.step4.desc': 'Наши специалисты осуществляют выкупы. В личном кабинете после доставки в ПВЗ будет доступен QR код для получения. Вы забираете заказ из ПВЗ и Вам становится доступно написание отзыва.',
        'section4.step5.title': 'Рост рейтинга и интереса покупателей',
        'section4.step5.desc': 'Карточка получает свежие оценки и отзывы, повышается рейтинг, растёт видимость товара и интерес покупателей, что увеличивает продажи.',
        
        // Section 5
        'section5.title': 'Преимущества',
        'section5.question': 'Мы понимаем продавцов',
        'section5.desc': 'Знаем, как больно, когда карточка зависла без заказов, несмотря<br>на качественный товар',
        'section5.advantage1.title': 'Безопасно для карточки',
        'section5.advantage1.desc': 'Никаких серых схем — всё в рамках правил Wildberries, с плавным и стабильным ростом.',
        'section5.advantage2.title': 'Держим связь и показываем результат',
        'section5.advantage2.desc': 'Отчётность, статистика и поддержка — всегда под рукой.',
        'section5.advantage3.title': 'Возвращаем внимание к товару',
        'section5.advantage3.desc': 'Рейтинг растёт, отзывы обновляются,<br>карточка снова в поиске и получает заказы.',
        'section5.advantage4.title': 'Ты не один',
        'section5.advantage4.desc': 'Более 1000 продавцов уже восстановили<br>свои карточки и вышли в стабильные<br>продажи',
        
        // Section 6
        'section6.subtitle': 'Наш девиз',
        'section6.title': 'Мы делаем ставку на репутацию —<br>а не на бесконечные скидки и акции,<br>которые съедают прибыль',
        'section6.cta': 'Начать работу с репутацией',
        'section6.feature1': 'Безопасно',
        'section6.feature2': 'Прозрачно',
        'section6.feature3': 'Эффективно',
        
        // Section 7
        'section7.subtitle': 'Результаты',
        'section7.title': 'Примеры улучшения репутации',
        'section7.card1.title': 'Детская одежда',
        'section7.card2.title': 'Косметический набор',
        'section7.card3.title': 'Наушники Bluetooth',
        'section7.card4.title': 'Аромасвеча в стекле',
        'section7.card5.title': 'Рюкзак городской',
        'section7.card.service': 'Услуга:',
        'section7.card.reviews': 'Отзывы:',
        'section7.card.result': 'Результат',
        'section7.card.rating': 'Рейтинг вырос на',
        'section7.card1.service': 'Выкупы на WB',
        'section7.card1.reviews': '+ 300 новых отзывов',
        'section7.card1.desc': 'Покупатели начали оставлять положительные<br>отзывы, выросло доверие',
        'section7.card2.service': 'Отзывы на WB',
        'section7.card2.reviews': '+ 600 новых отзывов',
        'section7.card2.desc': 'Появился поток заказов, карточка снова видна в<br>поиске',
        'section7.card3.service': 'Отзывы на WB',
        'section7.card3.reviews': '+ 450 новых отзывов',
        'section7.card3.desc.short': 'Карточка почти не продавалась — рейтинг...',
        'section7.card3.desc.full': 'Карточка почти не продавалась — рейтинг опустился до 2,2 из-за пары негативных отзывов. После работы с отзывами и обновления описания рейтинг вырос до уверенного уровня, товар снова стал появляться в подборках и рекомендациях.',
        'section7.card4.title': 'Аромасвеча в стекле',
        'section7.card4.service': 'Выкупы на WB',
        'section7.card4.reviews': '+ 250 новых отзывов',
        'section7.card4.desc.short': 'У карточки было мало отзывов, слабая конверсия...',
        'section7.card4.desc.full': 'У карточки было мало отзывов, слабая конверсия и почти полное отсутствие заказов. После серии выкупов и свежих отзывов карточка вернулась в ТОП-10 категории, появилась органика и выросло доверие покупателей.',
        'section7.card5.title': 'Рюкзак городской',
        'section7.card5.service': 'Комплексное продвижение (выкупы + отзывы)',
        'section7.card5.reviews': '+ 700 новых отзывов',
        'section7.card5.desc.short': 'Карточка долго держалась на низком уровне — 3,1,...',
        'section7.card5.desc.full': 'Карточка долго держалась на низком уровне — 3,1, показы снижались, покупатели обходили стороной. После комплексного продвижения и волны положительных отзывов карточка вернулась в ТОП-5, а количество заказов выросло почти вдвое.',
        'section7.card3.desc.short': 'Карточка почти не продавалась — рейтинг...',
        'section7.card3.desc.full': 'Карточка почти не продавалась — рейтинг опустился до 2,2 из-за пары негативных отзывов. После работы с отзывами и обновления описания рейтинг вырос до уверенного уровня, товар снова стал появляться в подборках и рекомендациях.',
        'section7.card4.desc.short': 'У карточки было мало отзывов, слабая конверсия...',
        'section7.card4.desc.full': 'У карточки было мало отзывов, слабая конверсия и почти полное отсутствие заказов. После серии выкупов и свежих отзывов карточка вернулась в ТОП-10 категории, появилась органика и выросло доверие покупателей.',
        'section7.card5.desc.short': 'Карточка долго держалась на низком уровне — 3,1,...',
        'section7.card5.desc.full': 'Карточка долго держалась на низком уровне — 3,1, показы снижались, покупатели обходили стороной. После комплексного продвижения и волны положительных отзывов карточка вернулась в ТОП-5, а количество заказов выросло почти вдвое.',
        
        // Section 8
        'section8.subtitle': 'Цены',
        'section8.title': 'Стоимость услуг продвижения',
        'section8.description': 'Выкупы помогают карточке получить активность и попасть в ТОП-выдачу',
        'section8.toggle.purchases': 'Выкупы на WB',
        'section8.toggle.reviews': 'Отзывы на WB',
        'section8.item.prefix': 'от',
        'section8.item.unit.purchases': 'выкупов',
        'section8.item.unit.reviews': 'отзывов',
        'section8.item.currency': 'руб / шт.',
        'section8.button': 'Заказать',
        'section8.minimum': 'Минимальный заказ - 5 выкупов',
        
        // Section 9
        'section9.title': 'FAQ',
        'section9.desc': 'Частые вопросы продавцов',
        'section9.accordion1.question': 'Это безопасно для карточки?',
        'section9.accordion1.answer': 'Да, но всё проходит в безопасном темпе, без резких изменений, чтобы сохранить стабильность карточки. По статистике покупатели чаще выбирают карточки, где не менее 50 отзывов и средняя оценка 4,7 и выше — именно такие товары вызывают доверие и получают больше заказов.',
        'section9.accordion2.question': 'Зачем нужны выкупы?',
        'section9.accordion2.answer': 'Выкупы помогают карточке получить активность и попасть в ТОП-выдачу. Чем больше выкупов, тем выше позиция карточки в поиске и тем больше органических заказов.',
        'section9.accordion3.question': 'Зачем нужны отзывы помимо рейтинга и доверия покупателей?',
        'section9.accordion3.answer': 'Отзывы не только повышают рейтинг, но и помогают карточке выглядеть живой и актуальной. Покупатели чаще выбирают товары с свежими отзывами, что увеличивает конверсию.',
        'section9.accordion4.question': 'Нужно ли давать доступ к кабинету?',
        'section9.accordion4.answer': 'Нет, доступ к вашему кабинету не требуется. Все выкупы и отзывы выполняются нашими специалистами через их собственные аккаунты.',
        'section9.accordion5.question': 'Каким способом происходит оплата за товар?',
        'section9.accordion5.answer': 'Оплата за товар происходит через привязанную банковскую карту в личном кабинете. Вы можете установить лимиты на расходы и контролировать все операции.',
        'section9.accordion6.question': 'Когда появятся изменения?',
        'section9.accordion6.answer': 'Первые результаты будут заметны уже через несколько дней после запуска кампании. Полный эффект от продвижения обычно проявляется в течение 2-4 недель.',
        'section9.accordion7.question': 'Что входит в услугу?',
        'section9.accordion7.answer': 'В услугу входит выполнение выкупов, написание отзывов, мониторинг результатов и предоставление отчетности. Все услуги выполняются в рамках правил Wildberries.',
        'section9.accordion8.question': 'Что делать, если рейтинг упал или появились негативные отзывы?',
        'section9.accordion8.answer': 'Мы поможем вам восстановить рейтинг с помощью новых положительных отзывов и работы с негативными. Наши специалисты знают, как правильно работать с репутацией карточки.',
        'section9.accordion9.question': 'Можно ли ускорить результат?',
        'section9.accordion9.answer': 'Да, можно увеличить количество выкупов и отзывов, что ускорит рост рейтинга и позиций. Однако важно соблюдать безопасный темп, чтобы не вызвать подозрений у платформы.',
        
        // Ghost words (Wildberries не переводится - это название бренда)
        'ghost.profit': 'Прибыль',
        'ghost.reviews': 'Отзывы',
        'ghost.rating': 'Рейтинг',
        
        // Card labels
        'card.withWallet': 'с WB Кошельком',
        'card.tomorrow': 'Завтра',
        'card.rating': 'оценка',
        'card.afterTomorrow': 'Послезавтра',
        
        // LG Card
        'lgcard.title': 'Продажи с Prodsfera',
        'lgcard.item1': 'Безопасно для карточки',
        'lgcard.item2': 'Всё в рамках правил маркетплейса',
        'lgcard.item3': 'Подходит для новых и действующих товаров',
        
        // WB Card
        'wbcard.cta': 'Завтра',
        'wbcard.product1': 'LAGERA / Косметический набор унив...',
        'wbcard.product2': 'LASD / Сумочка женская из натуральной кожи',
        'wbcard.product3': 'HOTYY / Ботинки женские демисезонные',
        'wbcard.product4': 'KEGVA / Комбинезон детский демисезонный',
        'wbcard.product5': 'LAGERA / Косметический набор универсальный',
        'wbcard.product6': 'LAGERA / Наушники Bluetooth',
        'wbcard.product7': 'LAGERA / Аромасвеча в стекле',
        'wbcard.product8': 'LAGERA / Рюкзак городской',
        
        // Footer
        'footer.desc': 'Сервис управления репутацией на Wildberries.',
        'footer.telegram': 'Telegram: @REPBOOSTER',
        'footer.whatsapp': 'WhatsApp: +7 913 392 34 56',
        'footer.legal': 'ИП Ларионов А.Л. | ИНН 540445819080 | ОГРНИП 325547600083011',
        'footer.copyright': '© 2025 Prodsfera. Все права защищены',
        'footer.link.privacy': 'Политика конфиденциальности',
        'footer.link.terms': 'Пользовательское соглашение',
        'footer.link.offer': 'Договор-оферта',
        'footer.disclaimer': 'Работаем с открытыми данными и строго в рамках правил платформы',
        
        // Forms
        'form.name': 'ФИО',
        'form.phone': 'Номер телефона',
        'form.email': 'E-mail',
        'form.company': 'Контрагент (название юр.лица)',
        'form.telegram': 'Telegram (необязательно)',
        'form.service': 'Выберите услугу',
        'form.quantity': 'Введите количество',
        'form.message': 'Сообщение',
        'form.submit': 'Отправить',
        'form.order': 'Заказать',
        'form.success': 'Ваша заявка отправлена',
        'form.placeholder.name': 'Иванов Иван Иванович',
        'form.placeholder.email': 'info@mail.ru',
        'form.placeholder.phone': '+7',
        'form.placeholder.company': 'ООО "Ромашка"',
        'form.placeholder.telegram': '@user',
        'form.placeholder.quantity': 'Минимальный заказ - 5 выкупов',
        'form.placeholder.message': 'Ваше сообщение',
        'form.dropdown.select': 'Выберите услугу',
        'form.dropdown.purchases': 'Выкупы с WB',
        'form.dropdown.reviews': 'Отзывы',
        'form.dropdown.complex': 'Комплексная работа',
        'form.total': 'Итого: на сумму',
        'form.sending': 'Отправка...',
        'form.error.sending': 'Ошибка отправки',
        'form.error.required': 'Это поле обязательно для заполнения',
        'form.error.email': 'Введите корректный email адрес',
        'form.error.phone': 'Введите корректный номер телефона (например: +7 999 123 45 67)',
        'form.error.name': 'Введите полное имя (минимум имя и фамилия)',
        'form.error.quantity': 'Минимальный заказ - 5 выкупов',
        'form.error.privacy': 'Необходимо согласиться с политикой конфиденциальности',
        'modal.feedback.title': 'Оставить заявку',
        'modal.feedback.intro1': 'Мы с Вами свяжемся, затем вышлем договор (через ЭДО, потребуется ЭЦП)',
        'modal.feedback.intro2': 'Заявки принимаются каждый день, но обрабатываются по будням в рабочие часы, т.к. мы работаем через оператора связи (суббота, воскресенье - выходные и номера не выдаются).',
        'modal.feedback.intro3': 'Для быстрой связи напишите нам в Telegram:',
        'modal.feedback.intro4': 'Заявка доступна только для юридических лиц (ИП/ООО)',
        'modal.order.title': 'Заказать',
        'modal.success.title': 'Ваша заявка отправлена',
        'modal.success.desc': 'Наш специалист с Вами свяжется в течение 24 часов',
        'form.privacy': 'Я согласен на обработку персональных данных и принимаю условия',
        'form.privacy.link': 'Политики конфиденциальности',
        'form.readMore': 'Читать полностью',
        
        // Buttons
        'button.order': 'Заказать',
        'button.more': 'Подробнее',
        'button.close': 'Закрыть',
        
        // Common
        'lang.rus': 'RUS',
        'lang.eng': 'ENG',
      },
      eng: {
        // Navigation
        'nav.about': 'About',
        'nav.how': 'How it works',
        'nav.advantages': 'Advantages',
        'nav.reviews': 'Reviews & Results',
        'nav.pricing': 'Pricing',
        'nav.faq': 'FAQ',
        'nav.contacts': 'Contacts',
        
        // Hero section
        'hero.subtitle': 'Reputation Management',
        'hero.title': 'Reputation Management <span class="hero__title-nowrap">on Wildberries</span>',
        'hero.description': 'We strengthen reputation, rating and trust — so your products stay in the TOP of search results and steadily grow in sales with minimal promotion costs.',
        'hero.cta': 'Strengthen Reputation',
        
        // Section 2
        'section2.subtitle': 'What prevents sales',
        'section2.title': 'On Wildberries everything depends<br>on card reputation',
        'section2.desc': 'Your product deserves more sales — but the card gets lost among competitors?',
        'section2.cta': 'We make sure buyers choose you, not your competitors.',
        'section2.stat.reviews': 'reviews',
        'section2.stat.rating': 'RATING AND COMMUNICATIONS',
        'section2.stat.orders': 'COMPETITORS AND INCREASE',
        'section2.stat.less': 'less than',
        'section2.stat.more': 'more than',
        'section2.stat.reviews.count': 'reviews',
        'section2.stat.rating.avg': 'average rating',
        'section2.stat.orders.count': 'competitors',
        'section2.stat.reviews.problem1': 'Few reviews and ratings — buyers consider the product "unverified", advertising costs increase (ACOS)',
        'section2.stat.reviews.problem2': 'No new reviews — the card looks abandoned',
        'section2.stat.reviews.problem3': 'Similar reviews reduce trust and conversion',
        'section2.stat.rating.problem1': 'Average rating <4.7 — buyers choose competitors',
        'section2.stat.rating.problem2': 'No seller responses — creates a sense of indifference',
        'section2.stat.rating.problem3': 'Few photos in reviews — visual trust is lost',
        'section2.stat.orders.problem1': 'Competitors update reviews and ratings faster',
        'section2.stat.orders.problem2': 'Buyers focus on reputation, not price',
        'section2.stat.orders.problem3': 'Even quality products without reviews remain unnoticed',
        
        // Section 3
        'section3.title': 'Customer Survey',
        'section3.question': 'By what criteria do you choose<br>who to buy from on WB?',
        'section3.responses': 'responses',
        'section3.chart.brand': 'Brand recognition',
        'section3.chart.price': 'Price',
        'section3.chart.reviews': 'Reviews',
        'section3.chart.photo': 'Photo quality',
        'section3.chart.rating': 'Rating',
        'section3.chart.delivery': 'Delivery speed',
        'section3.chart.purchase': 'Only purchased with buyout',
        'section3.chart.materials': 'Material quality',
        'section3.chart.description': 'Full description (composition)',
        'section3.chart.quality': 'Product quality',
        'section3.chart.appearance': 'Appearance',
        'section3.chart.composition': 'I mainly read the composition...',
        
        // Section 4
        'section4.title': 'Promotion Stages',
        'section4.question': 'How it works?',
        'section4.desc': 'Everything is as simple and transparent as possible. You launch card promotion, and we help it gain trust and attention from buyers. Every step is under your control, and results are visible from the first days.',
        'section4.step': 'Step',
        'section4.step1.title': 'Add product article<br>on Wildberries',
        'section4.step1.desc': 'Enter the article, add keywords and select a service — from a light start to comprehensive reputation work. Quickly launch promotion without complex settings.',
        'section4.step2.title': 'Configure number of purchases and reviews',
        'section4.step2.desc': 'You decide how many purchases and reviews are needed. Fill in the purchase schedule and choose a convenient pickup point for receiving the product.',
        'section4.step3.title': 'Secure payment via bank card',
        'section4.step3.desc': 'Link your card in your personal account and set limits. Our specialists do not have access to your data — completely safe for you and the product.',
        'section4.step4.title': 'Making purchases and writing reviews',
        'section4.step4.desc': 'Our specialists make purchases. In your personal account, after delivery to the pickup point, a QR code will be available for collection. You pick up the order from the pickup point and writing a review becomes available to you.',
        'section4.step5.title': 'Rating growth and buyer interest',
        'section4.step5.desc': 'The card receives fresh ratings and reviews, the rating increases, product visibility and buyer interest grow, which increases sales.',
        
        // Section 5
        'section5.title': 'Advantages',
        'section5.question': 'We understand sellers',
        'section5.desc': 'We know how painful it is when a card is stuck without orders, despite<br>a quality product',
        'section5.advantage1.title': 'Safe for the card',
        'section5.advantage1.desc': 'No gray schemes — everything within Wildberries rules, with smooth and stable growth.',
        'section5.advantage2.title': 'We keep in touch and show results',
        'section5.advantage2.desc': 'Reporting, statistics and support — always at hand.',
        'section5.advantage3.title': 'We return attention to the product',
        'section5.advantage3.desc': 'Rating grows, reviews are updated,<br>the card is back in search and receives orders.',
        'section5.advantage4.title': 'You are not alone',
        'section5.advantage4.desc': 'More than 1000 sellers have already restored<br>their cards and reached stable<br>sales',
        
        // Section 6
        'section6.subtitle': 'Our motto',
        'section6.title': 'We bet on reputation —<br>not on endless discounts and promotions,<br>that eat up profit',
        'section6.cta': 'Start working with reputation',
        'section6.feature1': 'Safe',
        'section6.feature2': 'Transparent',
        'section6.feature3': 'Effective',
        
        // Section 7
        'section7.subtitle': 'Results',
        'section7.title': 'Reputation Improvement Examples',
        'section7.card1.title': 'Children\'s Clothing',
        'section7.card2.title': 'Cosmetic Set',
        'section7.card3.title': 'Bluetooth Headphones',
        'section7.card4.title': 'Scented Candle in Glass',
        'section7.card5.title': 'Urban Backpack',
        'section7.card.service': 'Service:',
        'section7.card.reviews': 'Reviews:',
        'section7.card.result': 'Result',
        'section7.card.rating': 'Rating increased by',
        'section7.card1.service': 'Purchases on WB',
        'section7.card1.reviews': '+ 300 new reviews',
        'section7.card1.desc': 'Buyers started leaving positive<br>reviews, trust grew',
        'section7.card2.service': 'Reviews on WB',
        'section7.card2.reviews': '+ 600 new reviews',
        'section7.card2.desc': 'A stream of orders appeared, the card is visible again in<br>search',
        'section7.card3.service': 'Reviews on WB',
        'section7.card3.reviews': '+ 450 new reviews',
        'section7.card3.desc.short': 'The card was almost not selling — rating...',
        'section7.card3.desc.full': 'The card was almost not selling — the rating dropped to 2.2 due to a couple of negative reviews. After working with reviews and updating the description, the rating rose to a confident level, and the product began to appear again in selections and recommendations.',
        'section7.card4.title': 'Aromatic candle in glass',
        'section7.card4.service': 'Purchases on WB',
        'section7.card4.reviews': '+ 250 new reviews',
        'section7.card4.desc.short': 'The card had few reviews, weak conversion...',
        'section7.card4.desc.full': 'The card had few reviews, weak conversion and almost complete absence of orders. After a series of purchases and fresh reviews, the card returned to TOP-10 of the category, organic traffic appeared and buyer trust grew.',
        'section7.card5.title': 'Urban backpack',
        'section7.card5.service': 'Complex promotion (purchases + reviews)',
        'section7.card5.reviews': '+ 700 new reviews',
        'section7.card5.desc.short': 'The card stayed at a low level for a long time — 3.1,...',
        'section7.card5.desc.full': 'The card stayed at a low level for a long time — 3.1, impressions decreased, buyers avoided it. After complex promotion and a wave of positive reviews, the card returned to TOP-5, and the number of orders almost doubled.',
        'section7.card3.desc.short': 'The card almost didn\'t sell — rating...',
        'section7.card3.desc.full': 'The card almost didn\'t sell — the rating dropped to 2.2 due to a couple of negative reviews. After working with reviews and updating the description, the rating rose to a confident level, the product began to appear again in selections and recommendations.',
        'section7.card4.desc.short': 'The card had few reviews, weak conversion...',
        'section7.card4.desc.full': 'The card had few reviews, weak conversion and almost no orders. After a series of purchases and fresh reviews, the card returned to the TOP-10 of the category, organic traffic appeared and buyer trust grew.',
        'section7.card5.desc.short': 'The card stayed at a low level for a long time — 3.1,...',
        'section7.card5.desc.full': 'The card stayed at a low level for a long time — 3.1, impressions decreased, buyers passed by. After comprehensive promotion and a wave of positive reviews, the card returned to TOP-5, and the number of orders almost doubled.',
        
        // Section 8
        'section8.subtitle': 'Prices',
        'section8.title': 'Promotion Service Pricing',
        'section8.description': 'Purchases help the card gain activity and get into TOP search results',
        'section8.toggle.purchases': 'Purchases on WB',
        'section8.toggle.reviews': 'Reviews on WB',
        'section8.item.prefix': 'from',
        'section8.item.unit.purchases': 'purchases',
        'section8.item.unit.reviews': 'reviews',
        'section8.item.currency': 'rub / pcs.',
        'section8.button': 'Order',
        'section8.minimum': 'Minimum order - 5 purchases',
        
        // Section 9
        'section9.title': 'FAQ',
        'section9.desc': 'Frequently asked questions from sellers',
        'section9.accordion1.question': 'Is it safe for the card?',
        'section9.accordion1.answer': 'Yes, but everything happens at a safe pace, without sudden changes, to maintain card stability. According to statistics, buyers more often choose cards with at least 50 reviews and an average rating of 4.7 and above — such products inspire trust and receive more orders.',
        'section9.accordion2.question': 'Why are purchases needed?',
        'section9.accordion2.answer': 'Purchases help the card gain activity and get into TOP search results. The more purchases, the higher the card\'s position in search and the more organic orders.',
        'section9.accordion3.question': 'Why are reviews needed besides rating and buyer trust?',
        'section9.accordion3.answer': 'Reviews not only increase the rating but also help the card look alive and relevant. Buyers more often choose products with fresh reviews, which increases conversion.',
        'section9.accordion4.question': 'Do I need to give access to my account?',
        'section9.accordion4.answer': 'No, access to your account is not required. All purchases and reviews are performed by our specialists through their own accounts.',
        'section9.accordion5.question': 'How is payment for the product made?',
        'section9.accordion5.answer': 'Payment for the product is made through a linked bank card in your personal account. You can set spending limits and control all transactions.',
        'section9.accordion6.question': 'When will changes appear?',
        'section9.accordion6.answer': 'The first results will be noticeable within a few days after the campaign launch. The full effect of promotion usually appears within 2-4 weeks.',
        'section9.accordion7.question': 'What is included in the service?',
        'section9.accordion7.answer': 'The service includes making purchases, writing reviews, monitoring results, and providing reports. All services are performed within Wildberries rules.',
        'section9.accordion8.question': 'What to do if the rating dropped or negative reviews appeared?',
        'section9.accordion8.answer': 'We will help you restore the rating with new positive reviews and work with negative ones. Our specialists know how to properly work with card reputation.',
        'section9.accordion9.question': 'Can the result be accelerated?',
        'section9.accordion9.answer': 'Yes, you can increase the number of purchases and reviews, which will accelerate rating and position growth. However, it is important to maintain a safe pace to avoid raising platform suspicions.',
        
        // Ghost words (Wildberries не переводится - это название бренда)
        'ghost.profit': 'Profit',
        'ghost.reviews': 'Reviews',
        'ghost.rating': 'Rating',
        
        // Card labels
        'card.withWallet': 'with WB wallet',
        'card.tomorrow': 'Tomorrow',
        'card.rating': 'rating',
        'card.afterTomorrow': 'Day after tomorrow',
        
        // LG Card
        'lgcard.title': 'Sales with Prodsfera',
        'lgcard.item1': 'Safe for the card',
        'lgcard.item2': 'Everything within marketplace rules',
        'lgcard.item3': 'Suitable for new and existing products',
        
        // WB Card
        'wbcard.cta': 'Tomorrow',
        'wbcard.product1': 'LAGERA / Universal cosmetic set...',
        'wbcard.product2': 'LASD / Women\'s bag made of genuine leather',
        'wbcard.product3': 'HOTYY / Women\'s demi-season boots',
        'wbcard.product4': 'KEGVA / Children\'s demi-season overalls',
        'wbcard.product5': 'LAGERA / Universal cosmetic set',
        'wbcard.product6': 'LAGERA / Bluetooth headphones',
        'wbcard.product7': 'LAGERA / Scented candle in glass',
        'wbcard.product8': 'LAGERA / Urban backpack',
        
        // Footer
        'footer.desc': 'Wildberries reputation management service.',
        'footer.telegram': 'Telegram: @REPBOOSTER',
        'footer.whatsapp': 'WhatsApp: +7 913 392 34 56',
        'footer.legal': 'IE Larionov A.L. | TIN 540445819080 | OGRNIP 325547600083011',
        'footer.copyright': '© 2025 Prodsfera. All rights reserved',
        'footer.link.privacy': 'Privacy Policy',
        'footer.link.terms': 'Terms of Use',
        'footer.link.offer': 'Public Offer',
        'footer.disclaimer': 'We work with open data and strictly within platform rules',
        
        // Forms
        'form.name': 'Full Name',
        'form.phone': 'Phone Number',
        'form.email': 'E-mail',
        'form.company': 'Counterparty (legal entity name)',
        'form.telegram': 'Telegram (optional)',
        'form.service': 'Select Service',
        'form.quantity': 'Enter Quantity',
        'form.message': 'Message',
        'form.submit': 'Submit',
        'form.order': 'Order',
        'form.success': 'Your request has been sent',
        'form.placeholder.name': 'Ivanov Ivan Ivanovich',
        'form.placeholder.email': 'info@mail.ru',
        'form.placeholder.phone': '+7',
        'form.placeholder.company': 'LLC "Romashka"',
        'form.placeholder.telegram': '@user',
        'form.placeholder.quantity': 'Minimum order - 5 purchases',
        'form.placeholder.message': 'Your message',
        'form.dropdown.select': 'Select Service',
        'form.dropdown.purchases': 'Purchases on WB',
        'form.dropdown.reviews': 'Reviews',
        'form.dropdown.complex': 'Complex Work',
        'form.total': 'Total: amount',
        'form.sending': 'Sending...',
        'form.error.sending': 'Sending Error',
        'form.error.required': 'This field is required',
        'form.error.email': 'Enter a valid email address',
        'form.error.phone': 'Enter a valid phone number (e.g.: +7 999 123 45 67)',
        'form.error.name': 'Enter full name (minimum first and last name)',
        'form.error.quantity': 'Minimum order - 5 purchases',
        'form.error.privacy': 'You must agree to the privacy policy',
        'modal.feedback.title': 'Submit Request',
        'modal.feedback.intro1': 'We will contact you, then send a contract (via EDI, digital signature required)',
        'modal.feedback.intro2': 'Requests are accepted every day, but processed on weekdays during business hours, as we work through a telecom operator (Saturday, Sunday - days off and numbers are not issued).',
        'modal.feedback.intro3': 'For quick contact, write to us on Telegram:',
        'modal.feedback.intro4': 'Request is available only for legal entities (IE/LLC)',
        'modal.order.title': 'Order',
        'modal.success.title': 'Your request has been sent',
        'modal.success.desc': 'Our specialist will contact you within 24 hours',
        'form.privacy': 'I agree to the processing of personal data and accept the terms of',
        'form.privacy.link': 'Privacy Policy',
        'form.readMore': 'Read more',
        
        // Buttons
        'button.order': 'Order',
        'button.more': 'Learn More',
        'button.close': 'Close',
        
        // Common
        'lang.rus': 'RUS',
        'lang.eng': 'ENG',
      }
    };
    this.init();
  }

  init() {
    this.applyLanguage(this.currentLang);
    document.documentElement.lang = this.currentLang === 'rus' ? 'ru' : 'en';
  }

  get(key) {
    return this.translations[this.currentLang]?.[key] || key;
  }

  setLanguage(lang) {
    if (!this.translations[lang]) return;
    this.currentLang = lang;
    localStorage.setItem('lang', lang);
    document.documentElement.lang = lang === 'rus' ? 'ru' : 'en';
    this.applyLanguage(lang);
    
    // Dispatch custom event for other modules
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
  }

  applyLanguage(lang) {
    // Update all elements with data-i18n attribute
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(element => {
      const key = element.getAttribute('data-i18n');
      const translation = this.translations[lang]?.[key];
      if (translation) {
        if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
          element.placeholder = translation;
        } else {
          element.textContent = translation;
        }
      }
    });

    // Update all elements with data-i18n-html attribute (for HTML content)
    const htmlElements = document.querySelectorAll('[data-i18n-html]');
    htmlElements.forEach(element => {
      const key = element.getAttribute('data-i18n-html');
      const translation = this.translations[lang]?.[key];
      if (translation) {
        element.innerHTML = translation;
      }
    });

    // Update aria-labels
    const ariaElements = document.querySelectorAll('[data-i18n-aria]');
    ariaElements.forEach(element => {
      const key = element.getAttribute('data-i18n-aria');
      const translation = this.translations[lang]?.[key];
      if (translation) {
        element.setAttribute('aria-label', translation);
      }
    });

    // Update placeholders
    const placeholderElements = document.querySelectorAll('[data-i18n-placeholder]');
    placeholderElements.forEach(element => {
      const key = element.getAttribute('data-i18n-placeholder');
      const translation = this.translations[lang]?.[key];
      if (translation) {
        element.placeholder = translation;
      }
    });
  }

  getCurrentLang() {
    return this.currentLang;
  }
}

// Create singleton instance
const translationsInstance = new Translations();
window.translations = translationsInstance;

export default Translations;

