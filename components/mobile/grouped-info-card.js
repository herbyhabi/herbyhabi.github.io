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
                display: flex;
                flex-direction: column;
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
                border-bottom: 1px dashed #e2e8f0;
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

            .grouped-info-card__actions {
                order: 100;
                min-height: 52px;
                display: grid;
                grid-template-columns: repeat(var(--grouped-info-card-action-count, 1), minmax(0, 1fr));
                align-items: center;
                gap: 0;
                border-top: 1px dashed #e2e8f0;
                padding: 8px 16px;
                box-sizing: border-box;
            }

            .grouped-info-card__action {
                min-width: 0;
                min-height: 36px;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                gap: 6px;
                padding: 0 10px;
                border: 0;
                border-radius: 0;
                background: transparent;
                color: #333333;
                font: inherit;
                font-size: 13px;
                font-weight: 700;
                line-height: 18px;
                cursor: pointer;
                -webkit-tap-highlight-color: transparent;
            }

            .grouped-info-card__action.is-primary {
                color: #2f7af6;
            }

            .grouped-info-card__action + .grouped-info-card__action {
                border-left: 1px solid #e2e8f0;
            }

            .grouped-info-card__action:disabled {
                opacity: 0.52;
                cursor: not-allowed;
            }

            .grouped-info-card__action:not(:disabled):active {
                transform: scale(0.98);
            }

            .grouped-info-card__action-icon {
                flex: 0 0 auto;
                font-size: 14px;
                line-height: 1;
            }

            .grouped-info-card__action-label {
                min-width: 0;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
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
            actions: normalizeActions(options.actions),
            loading: Boolean(options.loading),
            disabled: Boolean(options.disabled),
            onClick: typeof options.onClick === 'function' ? options.onClick : null
        };
    }

    function normalizeActions(actions = []) {
        if (!Array.isArray(actions)) return [];

        // 操作栏最多展示 3 个按钮，避免移动端底部操作区拥挤
        return actions.slice(0, 3)
            .filter((action) => action && action.label)
            .map((action) => ({
                label: String(action.label),
                icon: String(action.icon || ''),
                disabled: Boolean(action.disabled),
                primary: Boolean(action.primary),
                onClick: typeof action.onClick === 'function' ? action.onClick : null
            }));
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

        card.appendChild(header);
        appendActions(card, config.actions, config);
        return card;
    }

    function appendActions(card, actions, config) {
        if (!actions.length) return;

        // 卡片操作栏固定渲染在底部，与主体内容之间使用虚线分隔
        const actionBar = document.createElement('div');
        actionBar.className = 'grouped-info-card__actions';
        actionBar.style.setProperty('--grouped-info-card-action-count', actions.length);

        actions.forEach((action) => {
            const button = document.createElement('button');
            button.className = 'grouped-info-card__action';
            if (action.primary) button.classList.add('is-primary');
            button.type = 'button';
            button.disabled = action.disabled || config.disabled;

            if (action.icon) {
                const icon = document.createElement('i');
                icon.className = `grouped-info-card__action-icon ${action.icon}`;
                icon.setAttribute('aria-hidden', 'true');
                button.appendChild(icon);
            }

            const label = document.createElement('span');
            label.className = 'grouped-info-card__action-label';
            label.textContent = action.label;
            button.appendChild(label);

            if (action.onClick) {
                button.addEventListener('click', (event) => {
                    event.stopPropagation();
                    action.onClick(event, config, action);
                });
            }

            actionBar.appendChild(button);
        });

        card.appendChild(actionBar);
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
