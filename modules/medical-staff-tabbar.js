(function () {
    const componentName = 'medical-staff-tabbar';

    if (customElements.get(componentName)) return;

    function ensureStyles() {
        if (document.getElementById('medical-staff-tabbar-styles')) return;

        const style = document.createElement('style');
        style.id = 'medical-staff-tabbar-styles';
        style.textContent = `
            medical-staff-tabbar {
                --medical-staff-tabbar-primary: #2F6BFF;
                --medical-staff-tabbar-danger: #F53F3F;
                --medical-staff-tabbar-divider: #ECEEF2;
                --medical-staff-tabbar-text-light: #86909C;
                position: fixed;
                left: 50%;
                bottom: 0;
                z-index: 100;
                width: 100%;
                min-width: 320px;
                max-width: 768px;
                min-height: calc(64px + env(safe-area-inset-bottom, 0px));
                padding: 6px 12px calc(6px + env(safe-area-inset-bottom, 0px));
                display: grid;
                grid-template-columns: repeat(3, minmax(0, 1fr));
                transform: translateX(-50%);
                background: #FFFFFF;
                border-top: 1px solid var(--medical-staff-tabbar-divider);
                box-sizing: border-box;
                font-family: system-ui, "PingFang SC", sans-serif;
            }

            medical-staff-tabbar button {
                position: relative;
                min-height: 52px;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                gap: 4px;
                border: 0;
                background: transparent;
                color: var(--medical-staff-tabbar-text-light);
                font: inherit;
                font-size: 12px;
                line-height: 1;
                font-weight: 500;
                cursor: pointer;
                -webkit-tap-highlight-color: transparent;
            }

            medical-staff-tabbar button:active {
                opacity: 0.82;
            }

            medical-staff-tabbar button.is-active {
                color: var(--medical-staff-tabbar-primary);
            }

            medical-staff-tabbar i {
                font-size: 22px;
            }

            medical-staff-tabbar .medical-staff-tabbar__badge {
                position: absolute;
                top: 4px;
                right: calc(50% - 28px);
                min-width: 18px;
                height: 18px;
                padding: 0 5px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 999px;
                background: var(--medical-staff-tabbar-danger);
                color: #FFFFFF;
                border: 2px solid #FFFFFF;
                font-size: 12px;
                line-height: 1;
                font-weight: 600;
                box-sizing: border-box;
            }
        `;
        document.head.appendChild(style);
    }

    class MedicalStaffTabbar extends HTMLElement {
        static get observedAttributes() {
            return ['active', 'message-badge'];
        }

        connectedCallback() {
            ensureStyles();
            this.render();
        }

        attributeChangedCallback() {
            if (this.isConnected) this.render();
        }

        render() {
            const active = this.getAttribute('active') || '';
            const messageBadge = this.getAttribute('message-badge') || '';
            const items = [
                { key: 'home', label: '首页', icon: 'fas fa-house', href: 'medical-staff-home.html' },
                { key: 'message', label: '消息', icon: 'fas fa-comment-dots', href: 'medical-staff-message-center.html', badge: messageBadge },
                { key: 'profile', label: '我的', icon: 'fas fa-user', href: 'medical-staff-profile.html' }
            ];

            this.innerHTML = items.map((item) => {
                const isActive = active === item.key;
                const badge = item.badge && item.badge !== '0'
                    ? `<span class="medical-staff-tabbar__badge">${this.escapeHtml(item.badge)}</span>`
                    : '';
                return `
                    <button class="${isActive ? 'is-active' : ''}" type="button" data-key="${this.escapeHtml(item.key)}" data-href="${this.escapeHtml(item.href)}" aria-current="${isActive ? 'page' : 'false'}">
                        <i class="${this.escapeHtml(item.icon)}"></i>
                        <span>${this.escapeHtml(item.label)}</span>
                        ${badge}
                    </button>
                `;
            }).join('');

            this.querySelectorAll('button').forEach((button) => {
                button.addEventListener('click', () => {
                    if (button.dataset.key === active) return;
                    window.location.href = button.dataset.href;
                });
            });
        }

        escapeHtml(value) {
            return String(value == null ? '' : value)
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#39;');
        }
    }

    customElements.define(componentName, MedicalStaffTabbar);
}());
