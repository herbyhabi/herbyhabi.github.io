(function () {
    const componentName = 'mobile-tabs';

    if (customElements.get(componentName)) return;

    class MobileTabs extends HTMLElement {
        static get observedAttributes() {
            return ['tabs', 'value'];
        }

        constructor() {
            super();
            this.attachShadow({ mode: 'open' });
        }

        connectedCallback() {
            this.render();
        }

        attributeChangedCallback() {
            if (this.isConnected) this.render();
        }

        get tabs() {
            return this.parseTabs();
        }

        set tabs(value) {
            const tabs = Array.isArray(value) ? value : [];
            this.setAttribute('tabs', JSON.stringify(tabs));
        }

        get value() {
            return this.getAttribute('value') || '';
        }

        set value(value) {
            this.setAttribute('value', value || '');
        }

        // 解析外部传入的页签数据，保证异常数据不会影响页面主体渲染
        parseTabs() {
            try {
                const tabs = JSON.parse(this.getAttribute('tabs') || '[]');
                if (!Array.isArray(tabs)) return [];

                return tabs
                    .filter((tab) => tab && tab.value !== undefined)
                    .map((tab) => ({
                        label: String(tab.label || ''),
                        value: String(tab.value),
                        count: tab.count
                    }));
            } catch (error) {
                return [];
            }
        }

        // 点击页签后更新当前值，并向业务页面派发 change 事件
        handleTabClick(tabValue) {
            this.value = tabValue;
            this.dispatchEvent(new CustomEvent('change', {
                detail: { value: tabValue },
                bubbles: true
            }));
        }

        formatCount(count) {
            if (count === undefined || count === null || count === '') return '';
            return `（${count}）`;
        }

        render() {
            const tabs = this.tabs;
            const currentValue = this.value || (tabs[0] && tabs[0].value) || '';

            this.shadowRoot.innerHTML = `
                <style>
                    :host {
                        display: block;
                        width: 100%;
                        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
                    }

                    .mobile-tabs {
                        display: grid;
                        grid-template-columns: repeat(var(--mobile-tabs-count, 2), minmax(0, 1fr));
                        gap: 8px;
                        padding: 4px;
                        border-radius: 999px;
                        background: #f1f5f9;
                        box-sizing: border-box;
                    }

                    .mobile-tabs__item {
                        min-width: 0;
                        height: 36px;
                        display: inline-flex;
                        align-items: center;
                        justify-content: center;
                        padding: 0 10px;
                        border: 0;
                        border-radius: 999px;
                        background: transparent;
                        color: #666666;
                        font: inherit;
                        font-size: 14px;
                        font-weight: 600;
                        line-height: 36px;
                        white-space: nowrap;
                        cursor: pointer;
                        -webkit-tap-highlight-color: transparent;
                    }

                    .mobile-tabs__item.is-active {
                        color: #2f7af6;
                        background: #ffffff;
                        box-shadow: 0 6px 16px rgba(47, 122, 246, 0.14);
                    }

                    .mobile-tabs__item:active {
                        transform: scale(0.98);
                    }

                    .mobile-tabs__label {
                        min-width: 0;
                        overflow: hidden;
                        text-overflow: ellipsis;
                    }
                </style>
                <div class="mobile-tabs" role="tablist" style="--mobile-tabs-count: ${Math.max(tabs.length, 1)}">
                    ${tabs.map((tab) => {
                        const isActive = tab.value === currentValue;
                        return `
                            <button class="mobile-tabs__item ${isActive ? 'is-active' : ''}" type="button" role="tab" aria-selected="${isActive}" data-value="${this.escapeAttribute(tab.value)}">
                                <span class="mobile-tabs__label">${this.escapeHtml(tab.label)}${this.escapeHtml(this.formatCount(tab.count))}</span>
                            </button>
                        `;
                    }).join('')}
                </div>
            `;

            this.shadowRoot.querySelectorAll('.mobile-tabs__item').forEach((button) => {
                button.addEventListener('click', () => this.handleTabClick(button.dataset.value));
            });
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
            return this.escapeHtml(value);
        }
    }

    customElements.define(componentName, MobileTabs);
}());
