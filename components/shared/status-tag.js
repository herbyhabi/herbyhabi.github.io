(function () {
    const componentName = 'status-tag';
    const colorMap = {
        gray: {
            text: '#666666',
            background: '#f5f5f5',
            border: '#e5e5e5'
        },
        blue: {
            text: '#2f7af6',
            background: '#eef5ff',
            border: '#cfe0ff'
        },
        green: {
            text: '#168a4a',
            background: '#ecfdf3',
            border: '#c8f0d8'
        },
        orange: {
            text: '#c76a12',
            background: '#fff7ed',
            border: '#fed7aa'
        },
        red: {
            text: '#d92d20',
            background: '#fff1f1',
            border: '#ffc9c9'
        },
        cyan: {
            text: '#0e7490',
            background: '#ecfeff',
            border: '#bae6fd'
        }
    };
    const sizeMap = {
        small: {
            height: '22px',
            padding: '0 7px',
            fontSize: '12px',
            lineHeight: '20px',
            fontWeight: '700'
        },
        medium: {
            height: '26px',
            padding: '0 9px',
            fontSize: '13px',
            lineHeight: '24px',
            fontWeight: '700'
        }
    };

    if (customElements.get(componentName)) return;

    class StatusTag extends HTMLElement {
        static get observedAttributes() {
            return ['color', 'size', 'label'];
        }

        constructor() {
            super();
            this.attachShadow({ mode: 'open' });
        }

        connectedCallback() {
            this.render();
            this.observeLightDom();
        }

        disconnectedCallback() {
            if (this.observer) {
                this.observer.disconnect();
                this.observer = null;
            }
        }

        attributeChangedCallback() {
            if (!this.isConnected) return;
            this.render();
        }

        observeLightDom() {
            if (this.observer) return;
            this.observer = new MutationObserver(() => this.render());
            this.observer.observe(this, { childList: true, characterData: true, subtree: true });
        }

        getAppearance() {
            const color = colorMap[this.getAttribute('color')] || colorMap.gray;
            const size = sizeMap[this.getAttribute('size')] || sizeMap.medium;
            return { color, size };
        }

        render() {
            const { color, size } = this.getAppearance();
            const label = this.getAttribute('label');
            const content = label || Array.from(this.childNodes)
                .map((node) => node.textContent || '')
                .join('')
                .trim();
             
            // 具体显示样式设置
            this.shadowRoot.innerHTML = `
                <style>
                    :host {
                        max-width: 100%;
                        display: inline-block;
                        vertical-align: middle;
                    }
                    .status-tag {
                        max-width: 100%;
                        height: ${size.height};
                        display: inline-flex;
                        align-items: center;
                        justify-content: center;
                        padding: ${size.padding};
                        border: 0px solid ${color.border};
                        border-radius: 999px;
                        background: ${color.background};
                        color: ${color.text};
                        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
                        font-size: ${size.fontSize};
                        font-weight: ${size.fontWeight};
                        line-height: ${size.lineHeight};
                        white-space: nowrap;
                        box-sizing: border-box;
                    }

                    .status-tag__content {
                        min-width: 0;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                    }
                </style>
                <span class="status-tag">
                    <span class="status-tag__content">${this.escapeHtml(content)}</span>
                </span>
            `;
        }

        escapeHtml(value) {
            return String(value)
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#39;');
        }
    }

    customElements.define(componentName, StatusTag);
}());
