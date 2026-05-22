(function () {
    if (window.MobileInputBase) return;

    const styleId = 'mobile-input-base-styles';
    const defaults = {
        rowClass: 'mobile-input-field',
        disabledRowClass: 'is-disabled',
        labelClass: 'mobile-input-field__label',
        requiredClass: 'mobile-input-field__required',
        contentClass: 'mobile-input-field__content',
        inputClass: 'mobile-input-control',
        errorClass: 'mobile-input-field__error',
        helperClass: 'mobile-input-field__helper'
    };

    function ensureStyles() {
        if (document.getElementById(styleId)) return;

        // 移动端输入组件基础样式，避免组件依赖宿主页面是否加载 Tailwind。
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            .mobile-input-field {
                min-height: 48px;
                display: flex;
                align-items: flex-start;
                justify-content: space-between;
                gap: 12px;
                box-sizing: border-box;
                padding: 12px 16px;
                border-bottom: 1px solid #eef1f5;
                background: #ffffff;
                color: #333333;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
            }
            .mobile-input-field.is-disabled {
                opacity: 0.6;
            }
            .mobile-input-field__label {
                flex: 0 0 96px;
                box-sizing: border-box;
                padding-top: 1px;
                color: #666666;
                font-size: 14px;
                font-weight: 500;
                line-height: 22px;
            }
            .mobile-input-field__required {
                margin-left: 2px;
                color: #f53f3f;
            }
            .mobile-input-field__content {
                flex: 1 1 auto;
                min-width: 0;
                color: #333333;
                text-align: right;
            }
            .mobile-input-control {
                width: 100%;
                box-sizing: border-box;
                border: 0;
                outline: none;
                background: transparent;
                color: #333333;
                font: inherit;
                font-size: 14px;
                line-height: 22px;
                text-align: right;
                -webkit-appearance: none;
                appearance: none;
            }
            .mobile-input-control::placeholder {
                color: #999999;
            }
            .mobile-input-control:disabled {
                color: #999999;
            }
            .mobile-input-field__error {
                margin-top: 4px;
                color: #f53f3f;
                font-size: 12px;
                line-height: 18px;
            }
            .mobile-input-field__helper {
                margin-top: 4px;
                color: #999999;
                font-size: 12px;
                line-height: 18px;
            }
            .mobile-input-inline {
                min-height: 24px;
                display: flex;
                align-items: center;
                justify-content: flex-end;
                gap: 8px;
                width: 100%;
            }
            .mobile-input-clear,
            .mobile-input-remove {
                flex: 0 0 auto;
                width: 20px;
                height: 20px;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                box-sizing: border-box;
                padding: 0;
                border: 0;
                border-radius: 50%;
                background: #cbd5e1;
                color: #ffffff;
                font: inherit;
                font-size: 13px;
                line-height: 1;
                cursor: pointer;
                transition: background 0.16s ease, transform 0.16s ease;
                -webkit-tap-highlight-color: transparent;
            }
            .mobile-input-clear:active,
            .mobile-input-remove:active {
                background: #94a3b8;
                transform: scale(0.94);
            }
            .mobile-input-clear:disabled,
            .mobile-input-remove:disabled {
                opacity: 0.55;
                cursor: default;
            }
            .mobile-input-add {
                width: 20px;
                height: 20px;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                box-sizing: border-box;
                margin-top: 8px;
                margin-left: auto;
                padding: 0;
                border: 0;
                border-radius: 50%;
                background: #2f7af6;
                color: #ffffff;
                font: inherit;
                font-size: 18px;
                line-height: 1;
                box-shadow: 0 4px 10px rgba(47, 122, 246, 0.22);
                cursor: pointer;
            }
            .mobile-input-add:active {
                background: #1f63d8;
            }
            .mobile-input-add:disabled {
                background: #cbd5e1;
                box-shadow: none;
                cursor: default;
            }
            .mobile-input-picker-trigger {
                min-height: 24px;
                display: flex;
                align-items: center;
                justify-content: flex-end;
                gap: 8px;
                width: 100%;
                padding: 0;
                border: 0;
                background: transparent;
                color: #333333;
                font: inherit;
                text-align: right;
                cursor: pointer;
            }
            .mobile-input-picker-trigger:disabled {
                color: #999999;
                cursor: default;
            }
            .mobile-input-picker-trigger__text {
                flex: 1 1 auto;
                min-width: 0;
                overflow: hidden;
                color: #333333;
                font-size: 14px;
                line-height: 22px;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            .mobile-input-picker-trigger__text.is-placeholder {
                color: #999999;
            }
            .mobile-input-picker-trigger__arrow {
                flex: 0 0 auto;
                color: #999999;
                font-size: 14px;
            }
            .mobile-input-picker-options,
            .mobile-input-picker-fallback {
                background: #ffffff;
            }
            .mobile-input-picker-fallback {
                position: fixed;
                z-index: 999;
                max-height: 256px;
                overflow: auto;
                border: 1px solid #eef1f5;
                border-radius: 12px;
                box-shadow: 0 8px 20px rgba(60, 101, 145, 0.12);
            }
            .mobile-input-picker-option {
                width: 100%;
                min-height: 48px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 12px;
                box-sizing: border-box;
                padding: 0 16px;
                border: 0;
                border-bottom: 1px solid #eef1f5;
                background: #ffffff;
                color: #333333;
                font: inherit;
                font-size: 14px;
                text-align: left;
                cursor: pointer;
            }
            .mobile-input-picker-option:last-child {
                border-bottom: 0;
            }
            .mobile-input-picker-option.is-selected {
                color: #2f7af6;
                font-weight: 700;
            }
            .mobile-input-picker-option:disabled,
            .mobile-input-picker-option.is-disabled {
                color: #999999;
                cursor: default;
            }
            .mobile-input-textarea {
                min-height: 80px;
                resize: none;
                text-align: left;
                line-height: 24px;
            }
            .mobile-input-phone-list {
                display: grid;
                gap: 8px;
                width: 100%;
                text-align: left;
            }
            .mobile-input-phone-row {
                min-height: 36px;
                display: flex;
                align-items: center;
                justify-content: flex-end;
                gap: 8px;
            }
            .mobile-input-unit,
            .mobile-input-location-button,
            .mobile-date-range-separator,
            .mobile-switch-text {
                flex: 0 0 auto;
                color: #666666;
                font-size: 14px;
                line-height: 22px;
            }
            .mobile-input-location-button {
                padding: 0;
                border: 0;
                background: transparent;
                color: #2f7af6;
                font: inherit;
                font-weight: 500;
                cursor: pointer;
            }
            .mobile-input-location-button:disabled {
                color: #999999;
                cursor: default;
            }
            .mobile-date-range {
                display: grid;
                grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
                align-items: center;
                gap: 8px;
                width: 100%;
            }
            .mobile-date-range-separator {
                color: #999999;
                font-size: 12px;
            }
            .mobile-option-group {
                display: flex;
                flex-wrap: wrap;
                justify-content: flex-end;
                gap: 8px;
            }
            .mobile-option-group.is-vertical {
                flex-direction: column;
                align-items: flex-end;
            }
            .mobile-option-pill {
                min-height: 32px;
                box-sizing: border-box;
                padding: 0 12px;
                border: 1px solid #e2e8f0;
                border-radius: 999px;
                background: #ffffff;
                color: #666666;
                font: inherit;
                font-size: 14px;
                cursor: pointer;
            }
            .mobile-option-pill.is-selected {
                border-color: #2f7af6;
                background: #eaf3ff;
                color: #2f7af6;
                font-weight: 500;
            }
            .mobile-option-pill:disabled {
                opacity: 0.6;
                cursor: default;
            }
            .mobile-switch {
                min-height: 28px;
                display: inline-flex;
                align-items: center;
                justify-content: flex-end;
                gap: 8px;
                padding: 0;
                border: 0;
                background: transparent;
                font: inherit;
                cursor: pointer;
            }
            .mobile-switch:disabled {
                opacity: 0.6;
                cursor: default;
            }
            .mobile-switch-track {
                position: relative;
                width: 48px;
                height: 28px;
                display: inline-flex;
                border-radius: 999px;
                background: #cbd5e1;
                transition: background 0.16s ease;
            }
            .mobile-switch-track.is-checked {
                background: #2f7af6;
            }
            .mobile-switch-thumb {
                position: absolute;
                top: 2px;
                left: 2px;
                width: 24px;
                height: 24px;
                border-radius: 50%;
                background: #ffffff;
                box-shadow: 0 2px 6px rgba(15, 23, 42, 0.18);
                transition: transform 0.16s ease;
            }
            .mobile-switch-thumb.is-checked {
                transform: translateX(20px);
            }
            .mobile-form-section {
                overflow: hidden;
                border-radius: 16px;
                background: #ffffff;
            }
            .mobile-form-section.is-bordered {
                border: 1px solid #eef1f5;
            }
            .mobile-form-section__body.is-inset {
                padding: 0;
            }
            .mobile-form-section__header {
                width: 100%;
                display: flex;
                align-items: flex-start;
                justify-content: space-between;
                gap: 12px;
                box-sizing: border-box;
                padding: 12px 16px;
                border: 0;
                border-bottom: 1px solid #eef1f5;
                background: transparent;
                color: inherit;
                font: inherit;
                text-align: left;
            }
            .mobile-form-section__copy {
                flex: 1 1 auto;
                min-width: 0;
            }
            .mobile-form-section__title {
                color: #333333;
                font-size: 16px;
                font-weight: 500;
                line-height: 22px;
            }
            .mobile-form-section__description {
                margin-top: 4px;
                color: #999999;
                font-size: 12px;
                line-height: 20px;
            }
            .mobile-form-section__arrow {
                color: #999999;
                font-size: 14px;
            }
            .is-hidden,
            .hidden {
                display: none !important;
            }
        `;
        document.head.appendChild(style);
    }

    // 移动端输入组件共享工具，统一字段结构、状态 class 与基础事件分发。
    function classNames(...items) {
        return items
            .reduce((result, item) => result.concat(Array.isArray(item) ? item : [item]), [])
            .filter(Boolean)
            .join(' ')
            .replace(/\s+/g, ' ')
            .trim();
    }

    function escapeHTML(value) {
        return String(value == null ? '' : value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function toBoolean(value) {
        return value === true || value === 'true';
    }

    function normalizeOptions(options = {}) {
        return {
            ...options,
            label: options.label || '',
            placeholder: options.placeholder || '',
            value: options.value == null ? '' : options.value,
            required: toBoolean(options.required),
            disabled: toBoolean(options.disabled),
            readonly: toBoolean(options.readonly),
            error: options.error || ''
        };
    }

    function createField(options = {}, content) {
        ensureStyles();
        const config = normalizeOptions(options);
        const row = document.createElement('div');
        row.className = classNames(defaults.rowClass, config.disabled && defaults.disabledRowClass, config.className);
        if (config.error) row.dataset.error = 'true';

        const label = document.createElement('div');
        label.className = classNames(defaults.labelClass, config.labelClass);
        label.textContent = config.label;
        if (config.required) {
            const star = document.createElement('span');
            star.className = defaults.requiredClass;
            star.textContent = '*';
            label.appendChild(star);
        }

        const body = document.createElement('div');
        body.className = classNames(defaults.contentClass, config.contentClass);

        if (typeof content === 'function') {
            content(body, config, row);
        } else if (content) {
            body.appendChild(content);
        }

        if (config.error) {
            const error = document.createElement('div');
            error.className = classNames(defaults.errorClass, config.errorClass);
            error.textContent = config.error;
            body.appendChild(error);
        }

        row.appendChild(label);
        row.appendChild(body);
        return row;
    }

    function render(container, element) {
        const target = typeof container === 'string' ? document.querySelector(container) : container;
        if (!target) return null;
        target.appendChild(element);
        return element;
    }

    function setDisabledState(element, config) {
        element.disabled = Boolean(config.disabled);
        if ('readOnly' in element) element.readOnly = Boolean(config.readonly);
    }

    function dispatchChange(root, detail) {
        root.dispatchEvent(new CustomEvent('change', {
            bubbles: true,
            detail
        }));
    }

    window.MobileInputBase = {
        defaults,
        classNames,
        escapeHTML,
        normalizeOptions,
        createField,
        render,
        setDisabledState,
        dispatchChange
    };
    ensureStyles();
}());
