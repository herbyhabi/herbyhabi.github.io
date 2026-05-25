(function () {
    const styleId = 'grouped-info-card-styles';
    const componentName = 'grouped-info-card';

    function ensureStyles() {
        if (document.getElementById(styleId)) return;

        // 分组信息卡片基础样式，使用本地 Tailwind 运行时编译。
        const style = document.createElement('style');
        style.id = styleId;
        style.type = 'text/tailwindcss';
        style.textContent = `
            @layer components {
                .grouped-info-card {
                    @apply box-border flex w-full flex-col rounded-xl border border-slate-100 bg-white font-sans text-[#333333];
                }
                .grouped-info-card.is-clickable {
                    @apply cursor-pointer active:scale-[0.99];
                    -webkit-tap-highlight-color: transparent;
                }
                .grouped-info-card.is-disabled {
                    @apply pointer-events-none opacity-55;
                }
                .grouped-info-card__header {
                    @apply box-border grid min-h-[52px] min-w-0 items-center gap-3 px-4 py-2;
                }
                .grouped-info-card__header.has-divider {
                    @apply border-b border-dashed border-slate-200;
                }
                .grouped-info-card__heading {
                    @apply flex min-w-0 items-start justify-between gap-3;
                }
                .grouped-info-card__title-wrap {
                    @apply flex min-w-0 flex-1 flex-wrap items-center gap-1.5;
                }
                .grouped-info-card__title {
                    @apply min-w-0 whitespace-normal text-base font-bold leading-5 text-[#333333];
                    overflow-wrap: anywhere;
                    word-break: break-word;
                }
                .grouped-info-card__status {
                    @apply max-w-full shrink-0;
                }
                status-tag.grouped-info-card__status {
                    @apply inline-flex h-5 max-w-full items-center rounded-full bg-[#f5f5f5] px-1.5 text-[11px] font-bold leading-5 text-[#666666];
                }
                .grouped-info-card__subtitle {
                    @apply min-w-0 shrink-0 whitespace-normal text-right text-xs font-normal leading-[18px] text-[#999999];
                    overflow-wrap: anywhere;
                    word-break: break-word;
                }
                .grouped-info-card__description {
                    @apply min-w-0 whitespace-normal text-sm font-normal leading-[22px] text-[#666666];
                    overflow-wrap: anywhere;
                    word-break: break-word;
                }
                .grouped-info-card__actions {
                    @apply order-[100] grid min-h-[52px] items-center gap-0 border-t border-dashed border-slate-200 px-4 py-2;
                    grid-template-columns: repeat(var(--grouped-info-card-action-count, 1), minmax(0, 1fr));
                }
                .grouped-info-card__action {
                    @apply inline-flex min-h-9 min-w-0 cursor-pointer items-center justify-center gap-1.5 rounded-none border-0 bg-transparent px-2.5 text-sm font-medium leading-4 text-[#333333] disabled:cursor-not-allowed disabled:opacity-50 active:scale-[0.98];
                    font-family: inherit;
                    -webkit-tap-highlight-color: transparent;
                }
                .grouped-info-card__action.is-primary {
                    @apply text-[#2f7af6];
                }
                .grouped-info-card__action + .grouped-info-card__action {
                    @apply border-l border-slate-200;
                }
                .grouped-info-card__action-icon {
                    @apply shrink-0 text-sm leading-none;
                }
                .grouped-info-card__action-label {
                    @apply min-w-0 truncate;
                }
                .grouped-info-card__empty {
                    @apply box-border flex min-h-[120px] items-center justify-center px-4 py-6 text-center text-sm font-medium text-[#999999];
                }
                .grouped-info-card__highlight {
                    @apply rounded bg-[#FFE7BA] px-0.5 font-extrabold text-[#FA8C16];
                }
                .grouped-info-card__skeleton {
                    @apply grid gap-2.5 p-4;
                }
                .grouped-info-card__skeleton-line {
                    @apply h-3.5 rounded-full;
                    background: linear-gradient(90deg, #f1f5f9 0%, #e8eef6 50%, #f1f5f9 100%);
                    background-size: 200% 100%;
                    animation: groupedInfoCardLoading 1.2s ease-in-out infinite;
                }
                .grouped-info-card__skeleton-line:nth-child(1) {
                    @apply w-[42%];
                }
                .grouped-info-card__skeleton-line:nth-child(2) {
                    @apply w-[78%];
                }
                .grouped-info-card__skeleton-line:nth-child(3) {
                    @apply w-[64%];
                }
                @keyframes groupedInfoCardLoading {
                    0% { background-position: 100% 0; }
                    100% { background-position: -100% 0; }
                }
            }
        `;
        document.head.appendChild(style);
    }

    function normalizeOptions(options = {}) {
        return {
            title: options.title || '',
            status: normalizeStatus(options.status),
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

    function normalizeStatus(status) {
        if (!status) return null;

        if (typeof status === 'string') {
            const label = status.trim();
            return label ? { label, color: 'gray', size: 'small' } : null;
        }

        if (typeof status !== 'object') return null;

        const label = String(status.label || status.text || status.value || '').trim();
        if (!label) return null;

        return {
            label,
            color: String(status.color || 'gray'),
            size: String(status.size || 'small')
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

    function createStatusTag(status) {
        // 标题状态复用通用状态标签组件，保持列表卡片内的状态表达一致。
        const tag = document.createElement('status-tag');
        tag.className = 'grouped-info-card__status';
        tag.setAttribute('label', status.label);
        tag.setAttribute('color', status.color);
        tag.setAttribute('size', status.size);
        tag.textContent = status.label;
        return tag;
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

        if (!config.title && !config.status && !config.subtitle && !config.description) {
            const empty = document.createElement('div');
            empty.className = 'grouped-info-card__empty';
            empty.textContent = config.emptyText;
            card.appendChild(empty);
            return card;
        }

        const header = document.createElement('div');
        header.className = 'grouped-info-card__header';
        if (config.showDivider) header.classList.add('has-divider');

        if (config.title || config.status || config.subtitle) {
            const heading = document.createElement('div');
            heading.className = 'grouped-info-card__heading';

            if (config.title || config.status) {
                const titleWrap = document.createElement('div');
                titleWrap.className = 'grouped-info-card__title-wrap';

                if (config.title) {
                    const title = document.createElement('div');
                    title.className = 'grouped-info-card__title';
                    appendHighlightedText(title, config.title, config.keyword, fieldCanHighlight(config, 'title'));
                    titleWrap.appendChild(title);
                }

                if (config.status) {
                    titleWrap.appendChild(createStatusTag(config.status));
                }

                heading.appendChild(titleWrap);
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
