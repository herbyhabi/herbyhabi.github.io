(function () {
    const styleId = 'grouped-info-card-styles';
    const componentName = 'grouped-info-card';

    function ensureStyles() {
        if (document.getElementById(styleId)) return;

        // 分组信息卡片基础样式，仅保留卡片外壳和标题信息展示
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            .grouped-info-card {
                width: 100%;
                box-sizing: border-box;
                border: 1px solid #f1f5f9;
                border-radius: 12px;
                background: #ffffff;
                color: #333333;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
            }

            .grouped-info-card.is-clickable {
                cursor: pointer;
                -webkit-tap-highlight-color: transparent;
            }

            .grouped-info-card.is-clickable:active {
                transform: scale(0.99);
            }

            .grouped-info-card.is-disabled {
                opacity: 0.56;
                pointer-events: none;
            }

            .grouped-info-card__header {
                min-width: 0;
                display: grid;
                gap: 12px;
                padding: 16px;
                box-sizing: border-box;
            }

            .grouped-info-card__header.has-divider {
                padding-bottom: 0;
            }

            .grouped-info-card__heading {
                min-width: 0;
                display: flex;
                align-items: flex-start;
                justify-content: space-between;
                gap: 12px;
            }

            .grouped-info-card__title {
                flex: 1 1 auto;
                min-width: 0;
                color: #333333;
                font-size: 15px;
                font-weight: 700;
                line-height: 20px;
                white-space: normal;
                overflow-wrap: anywhere;
                word-break: break-word;
            }

            .grouped-info-card__subtitle {
                flex: 0 0 auto;
                min-width: 0;
                color: #999999;
                font-size: 12px;
                font-weight: 400;
                line-height: 18px;
                text-align: right;
                white-space: normal;
                overflow-wrap: anywhere;
                word-break: break-word;
            }

            .grouped-info-card__description {
                min-width: 0;
                color: #666666;
                font-size: 14px;
                font-weight: 400;
                line-height: 22px;
                white-space: normal;
                overflow-wrap: anywhere;
                word-break: break-word;
            }

            .grouped-info-card__divider {
                width: 100%;
                height: 0;
                border-top: 1px dashed #e2e8f0;
            }

            .grouped-info-card__empty {
                min-height: 120px;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 24px 16px;
                box-sizing: border-box;
                color: #999999;
                font-size: 14px;
                font-weight: 500;
                text-align: center;
            }

            .grouped-info-card__highlight {
                color: #FA8C16;
                font-weight: 800;
                background: #FFE7BA;
                border-radius: 4px;
                padding: 0 2px;
            }

            .grouped-info-card__skeleton {
                display: grid;
                gap: 10px;
                padding: 16px;
            }

            .grouped-info-card__skeleton-line {
                height: 14px;
                border-radius: 999px;
                background: linear-gradient(90deg, #f1f5f9 0%, #e8eef6 50%, #f1f5f9 100%);
                background-size: 200% 100%;
                animation: groupedInfoCardLoading 1.2s ease-in-out infinite;
            }

            .grouped-info-card__skeleton-line:nth-child(1) {
                width: 42%;
            }

            .grouped-info-card__skeleton-line:nth-child(2) {
                width: 78%;
            }

            .grouped-info-card__skeleton-line:nth-child(3) {
                width: 64%;
            }

            @keyframes groupedInfoCardLoading {
                0% { background-position: 100% 0; }
                100% { background-position: -100% 0; }
            }
        `;
        document.head.appendChild(style);
    }

    function normalizeOptions(options = {}) {
        return {
            title: options.title || '',
            subtitle: options.subtitle || '',
            description: options.description || '',
            keyword: String(options.keyword || '').trim(),
            highlightFields: Array.isArray(options.highlightFields)
                ? options.highlightFields
                : ['title', 'subtitle', 'description'],
            emptyText: options.emptyText || '暂无内容',
            showDivider: Boolean(options.showDivider),
            loading: Boolean(options.loading),
            disabled: Boolean(options.disabled),
            onClick: typeof options.onClick === 'function' ? options.onClick : null
        };
    }

    function appendHighlightedText(target, text, keyword, shouldHighlight) {
        const value = String(text || '');
        const normalizedKeyword = String(keyword || '').toLowerCase();
        target.innerHTML = '';

        if (!shouldHighlight || !normalizedKeyword) {
            target.textContent = value;
            return;
        }

        const lowerValue = value.toLowerCase();
        let startIndex = 0;
        let matchIndex = lowerValue.indexOf(normalizedKeyword, startIndex);

        while (matchIndex !== -1) {
            if (matchIndex > startIndex) {
                target.appendChild(document.createTextNode(value.slice(startIndex, matchIndex)));
            }

            const highlight = document.createElement('span');
            highlight.className = 'grouped-info-card__highlight';
            highlight.textContent = value.slice(matchIndex, matchIndex + normalizedKeyword.length);
            target.appendChild(highlight);

            startIndex = matchIndex + normalizedKeyword.length;
            matchIndex = lowerValue.indexOf(normalizedKeyword, startIndex);
        }

        if (startIndex < value.length) {
            target.appendChild(document.createTextNode(value.slice(startIndex)));
        }
    }

    function fieldCanHighlight(options, field) {
        return options.highlightFields.includes(field);
    }

    function createSkeleton() {
        const card = document.createElement('section');
        card.className = 'grouped-info-card';
        card.setAttribute('aria-busy', 'true');

        const skeleton = document.createElement('div');
        skeleton.className = 'grouped-info-card__skeleton';
        for (let index = 0; index < 3; index += 1) {
            const line = document.createElement('div');
            line.className = 'grouped-info-card__skeleton-line';
            skeleton.appendChild(line);
        }

        card.appendChild(skeleton);
        return card;
    }

    function createCard(options = {}) {
        ensureStyles();
        const config = normalizeOptions(options);

        if (config.loading) return createSkeleton();

        // 基础卡片只负责通用头部信息，业务列表内容由各页面自行实现
        const card = document.createElement('section');
        card.className = 'grouped-info-card';
        if (config.disabled) card.classList.add('is-disabled');
        if (config.onClick) {
            card.classList.add('is-clickable');
            card.setAttribute('role', 'button');
            card.tabIndex = 0;
            card.addEventListener('click', (event) => config.onClick(event, config));
            card.addEventListener('keydown', (event) => {
                if (event.key !== 'Enter' && event.key !== ' ') return;
                event.preventDefault();
                config.onClick(event, config);
            });
        }

        if (!config.title && !config.subtitle && !config.description) {
            const empty = document.createElement('div');
            empty.className = 'grouped-info-card__empty';
            empty.textContent = config.emptyText;
            card.appendChild(empty);
            return card;
        }

        const header = document.createElement('div');
        header.className = 'grouped-info-card__header';
        if (config.showDivider) header.classList.add('has-divider');

        if (config.title || config.subtitle) {
            const heading = document.createElement('div');
            heading.className = 'grouped-info-card__heading';

            if (config.title) {
                const title = document.createElement('div');
                title.className = 'grouped-info-card__title';
                appendHighlightedText(title, config.title, config.keyword, fieldCanHighlight(config, 'title'));
                heading.appendChild(title);
            }

            if (config.subtitle) {
                const subtitle = document.createElement('div');
                subtitle.className = 'grouped-info-card__subtitle';
                appendHighlightedText(subtitle, config.subtitle, config.keyword, fieldCanHighlight(config, 'subtitle'));
                heading.appendChild(subtitle);
            }

            header.appendChild(heading);
        }

        if (config.description) {
            const description = document.createElement('div');
            description.className = 'grouped-info-card__description';
            appendHighlightedText(description, config.description, config.keyword, fieldCanHighlight(config, 'description'));
            header.appendChild(description);
        }

        if (config.showDivider) {
            const divider = document.createElement('div');
            divider.className = 'grouped-info-card__divider';
            header.appendChild(divider);
        }

        card.appendChild(header);
        return card;
    }

    function render(container, options) {
        const target = typeof container === 'string' ? document.querySelector(container) : container;
        if (!target) return null;
        const card = createCard(options);
        target.appendChild(card);
        return card;
    }

    if (!customElements.get(componentName)) {
        customElements.define(componentName, class GroupedInfoCardElement extends HTMLElement {
            connectedCallback() {
                ensureStyles();
                this.render();
            }

            set data(value) {
                this._data = value;
                this.render();
            }

            get data() {
                return this._data;
            }

            render() {
                if (!this.isConnected || !this._data) return;
                this.innerHTML = '';
                this.appendChild(createCard(this._data));
            }
        });
    }

    window.GroupedInfoCard = {
        create: createCard,
        render,
        ensureStyles
    };
}());
