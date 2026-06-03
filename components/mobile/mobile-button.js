(function () {
    if (window.MobileButton) return;

    const styleId = 'mobile-button-styles';
    const typeMap = {
        primary: 'mobile-button--primary',
        secondary: 'mobile-button--secondary',
        weak: 'mobile-button--weak',
        text: 'mobile-button--text',
        danger: 'mobile-button--danger'
    };
    const sizeMap = {
        large: 'mobile-button--large',
        medium: 'mobile-button--medium',
        small: 'mobile-button--small'
    };

    function ensureStyles() {
        if (document.getElementById(styleId)) return;

        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            .mobile-button {
                box-sizing: border-box;
                min-width: 0;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                gap: 6px;
                border: 0;
                border-radius: 12px;
                background: transparent;
                color: #1D2129;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
                font-size: 14px;
                font-weight: 500;
                line-height: 20px;
                text-align: center;
                text-decoration: none;
                white-space: nowrap;
                cursor: pointer;
                user-select: none;
                -webkit-tap-highlight-color: transparent;
                transition: background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease, opacity 0.15s ease, transform 0.12s ease;
            }

            .mobile-button:active:not(:disabled) {
                transform: scale(0.98);
            }

            .mobile-button:disabled,
            .mobile-button.is-disabled,
            .mobile-button.is-loading {
                cursor: default;
                pointer-events: none;
            }

            .mobile-button.is-disabled {
                opacity: 0.48;
            }

            .mobile-button.is-loading {
                opacity: 0.82;
            }

            .mobile-button--large {
                min-height: 48px;
                padding: 0 18px;
                font-size: 16px;
                line-height: 22px;
            }

            .mobile-button--medium {
                min-height: 44px;
                padding: 0 16px;
            }

            .mobile-button--small {
                min-height: 44px;
                padding: 0 12px;
                border-radius: 10px;
                font-size: 13px;
                line-height: 18px;
            }

            .mobile-button--block {
                width: 100%;
                display: flex;
            }

            .mobile-button--round {
                border-radius: 999px;
            }

            .mobile-button--wrap {
                height: auto;
                white-space: normal;
            }

            .mobile-button--primary {
                background: #2F6BFF;
                color: #FFFFFF;
            }

            .mobile-button--primary:active:not(:disabled) {
                background: #2458D9;
            }

            .mobile-button--secondary {
                border: 1px solid #2F6BFF;
                background: #FFFFFF;
                color: #2F6BFF;
            }

            .mobile-button--secondary:active:not(:disabled) {
                background: #F0F5FF;
                border-color: #2458D9;
                color: #2458D9;
            }

            .mobile-button--weak {
                background: #F2F6FF;
                color: #2F6BFF;
            }

            .mobile-button--weak:active:not(:disabled) {
                background: #E6EFFF;
                color: #2458D9;
            }

            .mobile-button--text {
                min-height: 44px;
                padding-right: 8px;
                padding-left: 8px;
                color: #2F6BFF;
            }

            .mobile-button--text:active:not(:disabled) {
                background: #F2F6FF;
                color: #2458D9;
            }

            .mobile-button--danger {
                background: #F53F3F;
                color: #FFFFFF;
            }

            .mobile-button--danger:active:not(:disabled) {
                background: #D92D2D;
            }

            .mobile-button--secondary.is-disabled,
            .mobile-button--weak.is-disabled,
            .mobile-button--text.is-disabled {
                color: #86909C;
            }

            .mobile-button__text {
                min-width: 0;
                overflow: hidden;
                text-overflow: ellipsis;
            }

            .mobile-button--wrap .mobile-button__text {
                overflow: visible;
                text-overflow: clip;
                white-space: normal;
                word-break: break-word;
            }

            .mobile-button__icon,
            .mobile-button__loading {
                width: 16px;
                height: 16px;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                flex: 0 0 auto;
                line-height: 1;
            }

            .mobile-button--large .mobile-button__icon,
            .mobile-button--large .mobile-button__loading {
                width: 18px;
                height: 18px;
            }

            .mobile-button__icon svg,
            .mobile-button__loading svg {
                width: 100%;
                height: 100%;
                display: block;
            }

            .mobile-button__loading {
                animation: mobile-button-spin 0.8s linear infinite;
            }

            @keyframes mobile-button-spin {
                to {
                    transform: rotate(360deg);
                }
            }
        `;
        document.head.appendChild(style);
    }

    function classNames(...items) {
        return items
            .reduce((result, item) => result.concat(Array.isArray(item) ? item : [item]), [])
            .filter(Boolean)
            .join(' ')
            .replace(/\s+/g, ' ')
            .trim();
    }

    function toBoolean(value) {
        return value === true || value === 'true';
    }

    function normalizeOptions(options = {}) {
        return {
            text: options.text == null ? '' : String(options.text),
            type: typeMap[options.type] ? options.type : 'primary',
            size: sizeMap[options.size] ? options.size : 'medium',
            disabled: toBoolean(options.disabled),
            loading: toBoolean(options.loading),
            block: toBoolean(options.block),
            round: toBoolean(options.round),
            icon: options.icon || null,
            iconPosition: options.iconPosition === 'right' ? 'right' : 'left',
            wrapText: toBoolean(options.wrapText),
            onClick: typeof options.onClick === 'function' ? options.onClick : null,
            className: options.className || '',
            ariaLabel: options.ariaLabel || ''
        };
    }

    function createLoadingIcon() {
        const span = document.createElement('span');
        span.className = 'mobile-button__loading';
        span.setAttribute('aria-hidden', 'true');
        span.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="3" opacity="0.28"></circle>
                <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" stroke-width="3" stroke-linecap="round"></path>
            </svg>
        `;
        return span;
    }

    function createIcon(icon) {
        if (!icon) return null;

        const span = document.createElement('span');
        span.className = 'mobile-button__icon';
        span.setAttribute('aria-hidden', 'true');

        if (icon instanceof HTMLElement || icon instanceof SVGElement) {
            span.appendChild(icon.cloneNode(true));
            return span;
        }

        const iconText = String(icon).trim();
        if (!iconText) return null;

        if (iconText[0] === '<') {
            span.innerHTML = iconText;
            return span;
        }

        const iconNode = document.createElement('i');
        iconNode.className = iconText;
        span.appendChild(iconNode);
        return span;
    }

    function create(options = {}) {
        ensureStyles();
        const config = normalizeOptions(options);
        const button = document.createElement('button');
        const unavailable = config.disabled || config.loading;
        const icon = config.loading ? createLoadingIcon() : createIcon(config.icon);
        const text = document.createElement('span');

        button.type = 'button';
        button.disabled = unavailable;
        button.className = classNames(
            'mobile-button',
            typeMap[config.type],
            sizeMap[config.size],
            config.block && 'mobile-button--block',
            config.round && 'mobile-button--round',
            config.wrapText && 'mobile-button--wrap',
            config.disabled && 'is-disabled',
            config.loading && 'is-loading',
            config.className
        );
        if (config.ariaLabel) button.setAttribute('aria-label', config.ariaLabel);
        if (config.loading) button.setAttribute('aria-busy', 'true');

        text.className = 'mobile-button__text';
        text.textContent = config.text;

        if (icon && config.iconPosition === 'left') button.appendChild(icon);
        button.appendChild(text);
        if (icon && config.iconPosition === 'right') button.appendChild(icon);

        button.addEventListener('click', (event) => {
            if (button.disabled || config.disabled || config.loading) {
                event.preventDefault();
                return;
            }

            if (config.onClick) config.onClick(event, button);
            button.dispatchEvent(new CustomEvent('mobile-button-click', {
                detail: { text: config.text, type: config.type, size: config.size },
                bubbles: true
            }));
        });

        button.mobileButtonOptions = config;
        return button;
    }

    function render(container, options) {
        const target = typeof container === 'string' ? document.querySelector(container) : container;
        if (!target) return null;

        const button = create(options);
        target.appendChild(button);
        return button;
    }

    window.MobileButton = {
        create,
        render,
        ensureStyles
    };
}());
