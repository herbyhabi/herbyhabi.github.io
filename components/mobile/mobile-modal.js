(function () {
    const styleId = 'mobile-modal-styles';
    const allowedTypes = ['dialog', 'bottomSheet', 'fullScreen', 'actionSheet'];
    let modalCount = 0;
    let bodyLockDepth = 0;
    let originalBodyOverflow = '';

    function ensureStyles() {
        if (document.getElementById(styleId)) return;

        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            .mobile-modal-mask {
                position: fixed;
                inset: 0;
                z-index: var(--mobile-modal-z-index, 900);
                display: none;
                align-items: center;
                justify-content: center;
                padding: 16px;
                box-sizing: border-box;
                background: rgba(14, 25, 42, 0.38);
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
            }

            .mobile-modal-mask.is-open {
                display: flex;
            }

            .mobile-modal-mask[data-type="bottomSheet"],
            .mobile-modal-mask[data-type="actionSheet"] {
                align-items: flex-end;
                padding: 0;
            }

            .mobile-modal-mask[data-type="fullScreen"] {
                align-items: stretch;
                justify-content: stretch;
                padding: 0;
                background: #fff;
            }

            .mobile-modal-panel {
                width: min(100%, var(--mobile-modal-dialog-width, 320px));
                max-height: min(78vh, 620px);
                display: flex;
                flex-direction: column;
                overflow: hidden;
                box-sizing: border-box;
                border-radius: 18px;
                background: #fff;
                color: #333333;
                box-shadow: 0 18px 48px rgba(12, 20, 34, 0.18);
            }

            .mobile-modal-mask[data-type="bottomSheet"] .mobile-modal-panel,
            .mobile-modal-mask[data-type="actionSheet"] .mobile-modal-panel {
                width: 100%;
                max-height: var(--mobile-modal-sheet-max-height, 72vh);
                border-radius: 20px 20px 0 0;
                box-shadow: 0 -12px 36px rgba(12, 20, 34, 0.16);
            }

            .mobile-modal-mask[data-type="fullScreen"] .mobile-modal-panel {
                width: 100%;
                height: 100%;
                max-height: none;
                border-radius: 0;
                box-shadow: none;
            }

            .mobile-modal-header {
                position: relative;
                min-height: 0;
                display: grid;
                grid-template-columns: minmax(56px, auto) minmax(0, 1fr) minmax(56px, auto);
                align-items: center;
                gap: 8px;
                flex: 0 0 auto;
                padding: 8px 16px 4px;
                box-sizing: border-box;
            }

            .mobile-modal-header.is-hidden {
                display: none;
            }

            .mobile-modal-title {
                min-width: 0;
                color: #333333;
                font-size: 16px;
                font-weight: 700;
                line-height: 1.25;
                text-align: center;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }

            .mobile-modal-side {
                min-width: 0;
                display: flex;
                align-items: center;
            }

            .mobile-modal-left {
                justify-content: flex-start;
            }

            .mobile-modal-right {
                justify-content: flex-end;
            }

            .mobile-modal-action {
                min-width: 32px;
                min-height: 32px;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                gap: 4px;
                padding: 0 8px;
                border: 0;
                border-radius: 10px;
                background: transparent;
                color: var(--mobile-modal-action-color, #666666);
                font: inherit;
                font-size: 14px;
                font-weight: 600;
                cursor: pointer;
                -webkit-tap-highlight-color: transparent;
            }

            .mobile-modal-action.is-primary {
                color: var(--mobile-modal-primary, #2f7af6);
                font-weight: 700;
            }

            .mobile-modal-action:active {
                transform: scale(0.96);
            }

            .mobile-modal-body {
                flex: 1 1 auto;
                min-height: 0;
                overflow: auto;
                padding: 8px 16px 16px;
                box-sizing: border-box;
                -webkit-overflow-scrolling: touch;
            }

            .mobile-modal-mask[data-type="actionSheet"] .mobile-modal-body {
                padding: 8px 12px calc(8px + env(safe-area-inset-bottom, 0px));
            }

            .mobile-modal-mask[data-type="fullScreen"] .mobile-modal-body {
                padding-bottom: calc(16px + env(safe-area-inset-bottom, 0px));
            }

            .mobile-modal-action-list {
                display: grid;
                gap: 8px;
            }

            .mobile-modal-action-item {
                width: 100%;
                min-height: 48px;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 0 12px;
                border: 0;
                border-radius: 12px;
                background: #f7f9fc;
                color: #333333;
                font-size: 16px;
                font-weight: 600;
                cursor: pointer;
            }

            .mobile-modal-action-item.is-danger {
                color: #e5484d;
            }
        `;
        document.head.appendChild(style);
    }

    function create(options = {}) {
        ensureStyles();

        const type = allowedTypes.includes(options.type) ? options.type : 'dialog';
        const id = options.id || `mobileModal${++modalCount}`;
        let mask = document.getElementById(id);

        if (!mask) {
            mask = document.createElement('div');
            mask.id = id;
            document.body.appendChild(mask);
        }

        mask.className = `mobile-modal-mask ${options.className || ''}`.trim();
        mask.setAttribute('role', 'dialog');
        mask.setAttribute('aria-modal', 'true');
        const closeOnMask = options.closeOnMask !== false;
        const instance = {
            id,
            element: mask,
            open() {
                if (options.lockScroll !== false && !mask.classList.contains('is-open')) {
                    if (bodyLockDepth === 0) originalBodyOverflow = document.body.style.overflow;
                    bodyLockDepth += 1;
                    document.body.style.overflow = 'hidden';
                }
                mask.classList.add('is-open');
                if (typeof options.onOpen === 'function') options.onOpen(instance);
            },
            close() {
                const wasOpen = mask.classList.contains('is-open');
                mask.classList.remove('is-open');
                if (options.lockScroll !== false && wasOpen) {
                    bodyLockDepth = Math.max(0, bodyLockDepth - 1);
                    if (bodyLockDepth === 0) document.body.style.overflow = originalBodyOverflow;
                }
                if (typeof options.onClose === 'function') options.onClose(instance);
            },
            setContent(content) {
                const body = mask.querySelector('.mobile-modal-body');
                if (body) body.innerHTML = content || '';
            },
            getBody() {
                return mask.querySelector('.mobile-modal-body');
            },
            getPanel() {
                return mask.querySelector('.mobile-modal-panel');
            },
            destroy() {
                instance.close();
                mask.remove();
            }
        };

        mask.dataset.type = type;
        mask.innerHTML = getModalHTML(options);
        mask.onclick = (event) => {
            if (closeOnMask && event.target === mask) instance.close();
        };

        bindAction(mask, '.mobile-modal-left [data-mobile-modal-action]', options.leftAction, instance);
        bindAction(mask, '.mobile-modal-right [data-mobile-modal-action]', options.rightAction, instance);
        bindSheetActions(mask, options.actions, instance);
        mask.querySelectorAll('[data-mobile-modal-close]').forEach(button => {
            if (button.dataset.mobileModalAction) return;
            button.onclick = () => instance.close();
        });
        mask.querySelector('.mobile-modal-panel').onclick = event => event.stopPropagation();

        return instance;
    }

    function getModalHTML(options) {
        const headerVisible = options.header !== false;
        const leftAction = normalizeAction(options.leftAction);
        const rightAction = normalizeAction(options.rightAction);
        const actionItems = Array.isArray(options.actions) ? getActionListHTML(options.actions) : '';
        const content = options.content || actionItems || '';

        return `
            <div class="mobile-modal-panel" role="document">
                <div class="mobile-modal-header${headerVisible ? '' : ' is-hidden'}">
                    <div class="mobile-modal-side mobile-modal-left">${getActionHTML(leftAction, 'left')}</div>
                    <div class="mobile-modal-title">${escapeHTML(options.title || '')}</div>
                    <div class="mobile-modal-side mobile-modal-right">${getActionHTML(rightAction, 'right')}</div>
                </div>
                <div class="mobile-modal-body">${content}</div>
            </div>
        `;
    }

    function normalizeAction(action) {
        if (!action) return null;
        if (typeof action === 'string') return { text: action };
        return action;
    }

    function getActionHTML(action, position) {
        if (!action) return '';
        if (action.html) return action.html;

        const icon = action.icon ? `<i class="${escapeAttribute(action.icon)}"></i>` : '';
        const text = action.text ? `<span>${escapeHTML(action.text)}</span>` : '';
        const closeAttr = action.close ? ' data-mobile-modal-close="true"' : '';
        const primaryClass = action.primary ? ' is-primary' : '';
        const ariaLabel = action.ariaLabel || action.text || (position === 'left' ? '左侧操作' : '右侧操作');

        return `
            <button class="mobile-modal-action${primaryClass}" type="button" data-mobile-modal-action="${position}"${closeAttr} aria-label="${escapeAttribute(ariaLabel)}">
                ${icon}${text}
            </button>
        `;
    }

    function getActionListHTML(actions) {
        return `
            <div class="mobile-modal-action-list">
                ${actions.map((action, index) => `
                    <button class="mobile-modal-action-item${action.danger ? ' is-danger' : ''}" type="button" data-mobile-modal-sheet-action="${index}">
                        ${escapeHTML(action.text || '')}
                    </button>
                `).join('')}
            </div>
        `;
    }

    function bindAction(root, selector, action, instance) {
        const button = root.querySelector(selector);
        if (!button || !action) return;
        button.onclick = event => {
            if (typeof action.onClick === 'function') action.onClick(event, instance);
            if (action.close) instance.close();
        };
    }

    function bindSheetActions(root, actions, instance) {
        if (!Array.isArray(actions)) return;

        root.querySelectorAll('[data-mobile-modal-sheet-action]').forEach(button => {
            button.onclick = event => {
                const action = actions[Number(button.dataset.mobileModalSheetAction)];
                if (!action) return;
                if (typeof action.onClick === 'function') action.onClick(event, instance);
                if (action.close !== false) instance.close();
            };
        });
    }

    function escapeHTML(value) {
        return String(value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function escapeAttribute(value) {
        return escapeHTML(value).replace(/`/g, '&#96;');
    }

    window.MobileModal = {
        create,
        ensureStyles
    };
}());
