(function () {
    const componentName = 'mobile-title-bar';

    if (customElements.get(componentName)) return;

    function ensureStyles() {
        if (document.getElementById('mobile-title-bar-styles')) return;

        const style = document.createElement('style');
        style.id = 'mobile-title-bar-styles';
        style.textContent = `
            mobile-title-bar {
                --mobile-title-bar-height: 52px;
                --mobile-title-bar-bg: rgba(217, 235, 255, 0.82);
                --mobile-title-bar-color: #0f1f33;
                --mobile-title-bar-border: rgba(48, 48, 49, 0.12);
                --mobile-title-bar-shadow: 0 10px 26px rgba(60, 101, 145, 0.08);
                --mobile-title-bar-title-size: 16px;
                --mobile-title-bar-side-width: 96px;
                position: sticky;
                top: 0;
                z-index: var(--mobile-title-bar-z-index, 100);
                min-height: var(--mobile-title-bar-height);
                display: grid;
                grid-template-columns: var(--mobile-title-bar-side-width) minmax(0, 1fr) var(--mobile-title-bar-side-width);
                align-items: center;
                padding: 0 16px;
                overflow: hidden;
                color: var(--mobile-title-bar-color);
                background: var(--mobile-title-bar-bg);
                border-bottom: 1px solid var(--mobile-title-bar-border);
                box-shadow: var(--mobile-title-bar-shadow);
                backdrop-filter: blur(14px);
                -webkit-backdrop-filter: blur(14px);
                box-sizing: border-box;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
            }

            mobile-title-bar::before {
                content: "";
                position: absolute;
                top: -58px;
                right: -34px;
                width: 170px;
                height: 150px;
                border-radius: 34px;
                background: linear-gradient(135deg, rgba(67, 142, 255, 0.2), rgba(255, 255, 255, 0.06));
                transform: rotate(-12deg);
                pointer-events: none;
            }

            mobile-title-bar .mobile-title-bar__side,
            mobile-title-bar .mobile-title-bar__title {
                position: relative;
                z-index: 1;
                min-width: 0;
            }

            mobile-title-bar .mobile-title-bar__left {
                justify-self: start;
            }

            mobile-title-bar .mobile-title-bar__right {
                justify-self: end;
            }

            mobile-title-bar .mobile-title-bar__title {
                justify-self: center;
                max-width: 100%;
                text-align: center;
                font-size: var(--mobile-title-bar-title-size);
                font-weight: 800;
                line-height: 1.2;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                pointer-events: none;
            }

            mobile-title-bar .mobile-title-bar__title .title-meta {
                display: block;
                margin-top: 2px;
                font-size: 11px;
                font-weight: 600;
                color: #7f8a98;
            }

            mobile-title-bar button {
                border: 0;
                background: transparent;
                color: inherit;
                font: inherit;
                cursor: pointer;
                -webkit-tap-highlight-color: transparent;
            }

            mobile-title-bar .mobile-title-bar__back,
            mobile-title-bar .mobile-title-bar__icon-action {
                width: 36px;
                height: 36px;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                border-radius: 10px;
                font-size: 18px;
            }

            mobile-title-bar .mobile-title-bar__text-action {
                min-height: 32px;
                padding: 0 10px;
                border-radius: 999px;
                color: #2f7af6;
                font-size: 14px;
                font-weight: 800;
            }

            mobile-title-bar .mobile-title-bar__workbench {
                max-width: 100%;
                min-height: 28px;
                padding: 0 9px;
                display: inline-flex;
                align-items: center;
                gap: 4px;
                border: 1px solid rgba(47, 122, 246, 0.16);
                border-radius: 999px;
                background: rgba(255, 255, 255, 0.78);
                color: #536171;
                font-size: 12px;
                font-weight: 700;
                box-shadow: 0 8px 18px rgba(60, 101, 145, 0.08);
            }

            mobile-title-bar .mobile-title-bar__workbench strong {
                min-width: 0;
                color: #2f7af6;
                font-weight: 900;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }

            mobile-title-bar button:active {
                transform: scale(0.96);
            }
        `;
        document.head.appendChild(style);
    }

    class MobileTitleBar extends HTMLElement {
        static get observedAttributes() {
            return ['title', 'back', 'back-action', 'right-text', 'right-icon', 'right-action', 'workbench', 'workbench-action'];
        }

        connectedCallback() {
            ensureStyles();
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
            if (this.isConnected) this.render();
        }

        observeLightDom() {
            if (this.observer) return;
            this.observer = new MutationObserver(() => {
                const rawContent = Array.from(this.childNodes)
                    .filter((node) => !node.classList || !node.classList.contains('mobile-title-bar__side'))
                    .filter((node) => !node.classList || !node.classList.contains('mobile-title-bar__title'))
                    .map((node) => node.textContent || '')
                    .join('')
                    .trim();
                if (rawContent) this.render();
            });
            this.observer.observe(this, { childList: true, characterData: true, subtree: true });
        }

        getTitleHtml() {
            const title = this.getAttribute('title');
            const lightHtml = Array.from(this.childNodes)
                .filter((node) => !node.classList || !node.classList.contains('mobile-title-bar__side'))
                .filter((node) => !node.classList || !node.classList.contains('mobile-title-bar__title'))
                .map((node) => node.outerHTML || node.textContent || '')
                .join('')
                .trim();

            return lightHtml || this.escapeHtml(title || '');
        }

        render() {
            const showBack = this.getAttribute('back') !== 'false';
            const backAction = this.getAttribute('back-action') || 'history.back()';
            const rightText = this.getAttribute('right-text');
            const rightIcon = this.getAttribute('right-icon');
            const rightAction = this.getAttribute('right-action') || '';
            const workbench = this.getAttribute('workbench');
            const workbenchAction = this.getAttribute('workbench-action') || '';

            const left = showBack
                ? `<button class="mobile-title-bar__back" type="button" onclick="${this.escapeAttribute(backAction)}" aria-label="返回"><i class="fas fa-chevron-left"></i></button>`
                : '';
            let right = '';

            if (workbench) {
                right = `<button class="mobile-title-bar__workbench" type="button" onclick="${this.escapeAttribute(workbenchAction)}"><strong id="currentWorkbench">${this.escapeHtml(workbench)}</strong><i class="fas fa-chevron-down"></i></button>`;
            } else if (rightText) {
                right = `<button class="mobile-title-bar__text-action" type="button" onclick="${this.escapeAttribute(rightAction)}">${this.escapeHtml(rightText)}</button>`;
            } else if (rightIcon) {
                right = `<button class="mobile-title-bar__icon-action" type="button" onclick="${this.escapeAttribute(rightAction)}" aria-label="操作"><i class="${this.escapeAttribute(rightIcon)}"></i></button>`;
            }

            this.innerHTML = `
                <div class="mobile-title-bar__side mobile-title-bar__left">${left}</div>
                <div class="mobile-title-bar__title">${this.getTitleHtml()}</div>
                <div class="mobile-title-bar__side mobile-title-bar__right">${right}</div>
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

        escapeAttribute(value) {
            return this.escapeHtml(value).replace(/`/g, '&#96;');
        }
    }

    customElements.define(componentName, MobileTitleBar);
})();
