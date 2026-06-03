(function () {
    const componentName = 'mobile-title-bar';
    const styleId = 'mobile-title-bar-styles';

    if (customElements.get(componentName)) return;

    function ensureStyles() {
        if (document.getElementById(styleId)) return;

        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            mobile-title-bar {
                --mobile-title-bar-height: 48px;
                --mobile-title-bar-bg: #FFFFFF;
                --mobile-title-bar-color: #1D2129;
                --mobile-title-bar-subtitle-color: #86909C;
                --mobile-title-bar-border: #E5E6EB;
                --mobile-title-bar-action-color: #2F6BFF;
                --mobile-title-bar-side-width: 88px;
                --mobile-title-bar-top-offset: 0px;
                --mobile-title-bar-total-height: calc(var(--mobile-title-bar-height) + env(safe-area-inset-top, 0px));
                --mobile-title-bar-z-index: 100;
                position: sticky;
                top: var(--mobile-title-bar-top-offset);
                z-index: var(--mobile-title-bar-z-index);
                display: block;
                width: 100%;
                min-width: 0;
                color: var(--mobile-title-bar-color);
                background: var(--mobile-title-bar-bg);
                border-bottom: 1px solid transparent;
                box-sizing: border-box;
                font-family: system-ui, "PingFang SC", sans-serif;
                -webkit-font-smoothing: antialiased;
            }

            mobile-title-bar[fixed="true"] {
                position: fixed;
                right: 0;
                left: 0;
                max-width: var(--mobile-title-bar-max-width, 768px);
                margin: 0 auto;
            }

            mobile-title-bar[safe-area="true"],
            mobile-title-bar[safearea="true"] {
                padding-top: env(safe-area-inset-top, 0px);
            }

            mobile-title-bar[border="true"] {
                border-bottom-color: var(--mobile-title-bar-border);
            }

            mobile-title-bar[theme="transparent"] {
                background: transparent;
                border-bottom-color: transparent;
            }

            mobile-title-bar .mobile-title-bar__inner {
                display: grid;
                grid-template-columns: var(--mobile-title-bar-side-width) minmax(0, 1fr) var(--mobile-title-bar-side-width);
                align-items: center;
                width: 100%;
                min-height: var(--mobile-title-bar-height);
                padding: 0 16px;
                box-sizing: border-box;
            }

            mobile-title-bar[title-align="left"] .mobile-title-bar__inner {
                grid-template-columns: auto minmax(0, 1fr) auto;
                column-gap: 8px;
            }

            mobile-title-bar .mobile-title-bar__side {
                min-width: 0;
                display: flex;
                align-items: center;
            }

            mobile-title-bar .mobile-title-bar__left {
                justify-content: flex-start;
            }

            mobile-title-bar .mobile-title-bar__right {
                justify-content: flex-end;
            }

            mobile-title-bar .mobile-title-bar__content {
                min-width: 0;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                line-height: 1.2;
                pointer-events: none;
            }

            mobile-title-bar[title-align="left"] .mobile-title-bar__content {
                align-items: flex-start;
            }

            mobile-title-bar .mobile-title-bar__title,
            mobile-title-bar .mobile-title-bar__subtitle,
            mobile-title-bar .mobile-title-bar__right-text {
                max-width: 100%;
                min-width: 0;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }

            mobile-title-bar .mobile-title-bar__title {
                color: var(--mobile-title-bar-color);
                font-size: 16px;
                font-weight: 600;
            }

            mobile-title-bar .mobile-title-bar__subtitle {
                margin-top: 2px;
                color: var(--mobile-title-bar-subtitle-color);
                font-size: 12px;
                font-weight: 400;
            }

            mobile-title-bar button {
                min-width: 44px;
                min-height: 44px;
                border: 0;
                padding: 0;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                gap: 4px;
                border-radius: 10px;
                background: transparent;
                color: inherit;
                font: inherit;
                cursor: pointer;
                -webkit-tap-highlight-color: transparent;
            }

            mobile-title-bar button:active {
                background: #F2F3F5;
            }

            mobile-title-bar[theme="transparent"] button:active {
                background: rgba(29, 33, 41, 0.08);
            }

            mobile-title-bar .mobile-title-bar__back,
            mobile-title-bar .mobile-title-bar__right-action {
                flex: 0 1 auto;
            }

            mobile-title-bar .mobile-title-bar__icon {
                width: 24px;
                height: 24px;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                flex: 0 0 auto;
                font-size: 18px;
                line-height: 1;
            }

            mobile-title-bar .mobile-title-bar__right-action {
                max-width: 100%;
                padding: 0 4px;
                color: var(--mobile-title-bar-action-color);
                font-size: 14px;
                font-weight: 500;
            }

            mobile-title-bar .mobile-title-bar__right-text {
                display: inline-block;
            }
        `;
        document.head.appendChild(style);
    }

    function toBoolean(value, fallback) {
        if (value === null || value === undefined || value === '') return fallback;
        return value !== false && value !== 'false';
    }

    class MobileTitleBar extends HTMLElement {
        static get observedAttributes() {
            return [
                'title',
                'subtitle',
                'show-back',
                'showback',
                'back-icon',
                'right-text',
                'right-icon',
                'fixed',
                'safe-area',
                'safearea',
                'border',
                'background',
                'title-align',
                'titlealign',
                'theme'
            ];
        }

        constructor() {
            super();
            this._onBack = null;
            this._onRightClick = null;
            this.handleBackClick = this.handleBackClick.bind(this);
            this.handleRightClick = this.handleRightClick.bind(this);
        }

        connectedCallback() {
            ensureStyles();
            this.render();
        }

        attributeChangedCallback() {
            if (this.isConnected) this.render();
        }

        get onBack() {
            return this._onBack;
        }

        set onBack(callback) {
            this._onBack = typeof callback === 'function' ? callback : null;
        }

        get onRightClick() {
            return this._onRightClick;
        }

        set onRightClick(callback) {
            this._onRightClick = typeof callback === 'function' ? callback : null;
        }

        get title() {
            return this.getAttribute('title') || '';
        }

        set title(value) {
            this.setAttribute('title', value || '');
        }

        get subtitle() {
            return this.getAttribute('subtitle') || '';
        }

        set subtitle(value) {
            if (value) {
                this.setAttribute('subtitle', value);
            } else {
                this.removeAttribute('subtitle');
            }
        }

        get showBack() {
            return toBoolean(this.getAttribute('show-back') ?? this.getAttribute('showback'), true);
        }

        set showBack(value) {
            this.setAttribute('show-back', value === false ? 'false' : 'true');
        }

        get backIcon() {
            return this.getAttribute('back-icon') || '';
        }

        set backIcon(value) {
            if (value) {
                this.setAttribute('back-icon', value);
            } else {
                this.removeAttribute('back-icon');
            }
        }

        get rightText() {
            return this.getAttribute('right-text') || '';
        }

        set rightText(value) {
            if (value) {
                this.setAttribute('right-text', value);
            } else {
                this.removeAttribute('right-text');
            }
        }

        get rightIcon() {
            return this.getAttribute('right-icon') || '';
        }

        set rightIcon(value) {
            if (value) {
                this.setAttribute('right-icon', value);
            } else {
                this.removeAttribute('right-icon');
            }
        }

        get fixed() {
            return toBoolean(this.getAttribute('fixed'), false);
        }

        set fixed(value) {
            this.setAttribute('fixed', value === true ? 'true' : 'false');
        }

        get safeArea() {
            return toBoolean(this.getAttribute('safe-area') ?? this.getAttribute('safearea'), true);
        }

        set safeArea(value) {
            this.setAttribute('safe-area', value === false ? 'false' : 'true');
        }

        get border() {
            return toBoolean(this.getAttribute('border'), this.getAttribute('theme') !== 'transparent');
        }

        set border(value) {
            this.setAttribute('border', value === false ? 'false' : 'true');
        }

        get background() {
            return this.getAttribute('background') || '';
        }

        set background(value) {
            if (value) {
                this.setAttribute('background', value);
            } else {
                this.removeAttribute('background');
            }
        }

        get titleAlign() {
            const value = this.getAttribute('title-align') || this.getAttribute('titlealign');
            return value === 'left' ? 'left' : 'center';
        }

        set titleAlign(value) {
            this.setAttribute('title-align', value === 'left' ? 'left' : 'center');
        }

        get theme() {
            return this.getAttribute('theme') === 'transparent' ? 'transparent' : 'default';
        }

        set theme(value) {
            this.setAttribute('theme', value === 'transparent' ? 'transparent' : 'default');
        }

        handleBackClick(event) {
            if (this._onBack) this._onBack(event);
            this.dispatchEvent(new CustomEvent('back', {
                detail: { source: this },
                bubbles: true
            }));
        }

        handleRightClick(event) {
            if (this._onRightClick) this._onRightClick(event);
            this.dispatchEvent(new CustomEvent('right-click', {
                detail: { source: this },
                bubbles: true
            }));
        }

        render() {
            const title = this.title;
            const subtitle = this.subtitle;
            const showBack = this.showBack;
            const backIcon = this.backIcon || '<i class="fas fa-chevron-left"></i>';
            const rightText = this.rightText;
            const rightIcon = this.rightIcon;
            const background = this.background;
            const titleAlign = this.titleAlign;
            const theme = this.theme;
            const hasRightAction = Boolean(rightText || rightIcon);

            if (this.getAttribute('title-align') !== titleAlign) {
                this.setAttribute('title-align', titleAlign);
            }
            if (this.getAttribute('theme') !== theme) {
                this.setAttribute('theme', theme);
            }
            if (!this.hasAttribute('border')) {
                this.setAttribute('border', theme === 'transparent' ? 'false' : 'true');
            }
            if (!this.hasAttribute('safe-area') && !this.hasAttribute('safearea')) {
                this.setAttribute('safe-area', 'true');
            }
            if (background) {
                this.style.setProperty('--mobile-title-bar-bg', background);
            } else {
                this.style.removeProperty('--mobile-title-bar-bg');
            }

            this.innerHTML = `
                <div class="mobile-title-bar__inner">
                    <div class="mobile-title-bar__side mobile-title-bar__left">
                        ${showBack ? `
                            <button class="mobile-title-bar__back" type="button" aria-label="返回">
                                <span class="mobile-title-bar__icon">${backIcon}</span>
                            </button>
                        ` : ''}
                    </div>
                    <div class="mobile-title-bar__content">
                        <div class="mobile-title-bar__title">${this.escapeHtml(title)}</div>
                        ${subtitle ? `<div class="mobile-title-bar__subtitle">${this.escapeHtml(subtitle)}</div>` : ''}
                    </div>
                    <div class="mobile-title-bar__side mobile-title-bar__right">
                        ${hasRightAction ? `
                            <button class="mobile-title-bar__right-action" type="button" aria-label="${this.escapeAttribute(rightText || '操作')}">
                                ${rightText ? `<span class="mobile-title-bar__right-text">${this.escapeHtml(rightText)}</span>` : ''}
                                ${rightIcon ? `<span class="mobile-title-bar__icon">${rightIcon}</span>` : ''}
                            </button>
                        ` : ''}
                    </div>
                </div>
            `;

            const backButton = this.querySelector('.mobile-title-bar__back');
            const rightButton = this.querySelector('.mobile-title-bar__right-action');
            if (backButton) backButton.addEventListener('click', this.handleBackClick);
            if (rightButton) rightButton.addEventListener('click', this.handleRightClick);
        }

        escapeHtml(value) {
            return String(value)
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#39;');
        }

        escapeAttribute(value) {
            return this.escapeHtml(value).replace(/`/g, '&#96;');
        }
    }

    customElements.define(componentName, MobileTitleBar);
}());
