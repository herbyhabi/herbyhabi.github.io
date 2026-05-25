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

        // 移动端输入组件基础样式：保留组件语义类名，内部统一使用 Tailwind CSS 语法实现。
        const style = document.createElement('style');
        style.id = styleId;
        style.type = 'text/tailwindcss';
        style.textContent = `
            @layer components {
                .mobile-input-field {
                    @apply box-border flex min-h-12 items-start justify-between gap-3 border-b border-[#eef1f5] bg-white px-4 py-3 font-sans text-[#333333];
                }
                .mobile-input-field.is-disabled {
                    @apply opacity-60;
                }
                .mobile-input-field__label {
                    @apply box-border w-24 shrink-0 pt-px text-sm font-medium leading-[22px] text-[#666666];
                }
                .mobile-input-field__required {
                    @apply ml-0.5 text-[#f53f3f];
                }
                .mobile-input-field__content {
                    @apply min-w-0 flex-1 text-right text-[#333333];
                }
                .mobile-input-control {
                    @apply box-border w-full appearance-none border-0 bg-transparent text-right text-sm leading-[22px] text-[#333333] outline-none placeholder:text-[#999999] disabled:text-[#999999];
                    font: inherit;
                }
                .mobile-input-field__error {
                    @apply mt-1 text-xs leading-[18px] text-[#f53f3f];
                }
                .mobile-input-field__helper {
                    @apply mt-1 text-xs leading-[18px] text-[#999999];
                }
                .mobile-input-inline {
                    @apply flex min-h-6 w-full items-center justify-end gap-2;
                }
                .mobile-input-clear,
                .mobile-input-remove {
                    @apply box-border inline-flex size-5 shrink-0 cursor-pointer items-center justify-center rounded-full border-0 bg-slate-300 p-0 text-[13px] leading-none text-white transition-[background,transform] duration-150 ease-out active:scale-[0.94] active:bg-slate-400 disabled:cursor-default disabled:opacity-55;
                    font: inherit;
                    -webkit-tap-highlight-color: transparent;
                }
                .mobile-input-add {
                    @apply mt-2 ml-auto box-border inline-flex size-5 cursor-pointer items-center justify-center rounded-full border-0 bg-[#2f7af6] p-0 text-lg leading-none text-white shadow-[0_4px_10px_rgba(47,122,246,0.22)] active:bg-[#1f63d8] disabled:cursor-default disabled:bg-slate-300 disabled:shadow-none;
                    font: inherit;
                }
                .mobile-input-picker-trigger {
                    @apply flex min-h-6 w-full cursor-pointer items-center justify-end gap-2 border-0 bg-transparent p-0 text-right text-[#333333] disabled:cursor-default disabled:text-[#999999];
                    font: inherit;
                }
                .mobile-input-picker-trigger__text {
                    @apply min-w-0 flex-1 overflow-hidden truncate text-sm leading-[22px] text-[#333333];
                }
                .mobile-input-picker-trigger__text.is-placeholder {
                    @apply text-[#999999];
                }
                .mobile-input-picker-trigger__arrow {
                    @apply shrink-0 text-sm text-[#999999];
                }
                .mobile-input-picker-options,
                .mobile-input-picker-fallback {
                    @apply bg-white;
                }
                .mobile-input-picker-fallback {
                    @apply fixed z-[999] max-h-64 overflow-auto rounded-xl border border-[#eef1f5] shadow-[0_8px_20px_rgba(60,101,145,0.12)];
                }
                .mobile-input-picker-option {
                    @apply box-border flex min-h-12 w-full cursor-pointer items-center justify-between gap-3 border-0 border-b border-[#eef1f5] bg-white px-4 text-left text-sm text-[#333333] disabled:cursor-default disabled:text-[#999999];
                    font: inherit;
                }
                .mobile-input-picker-option:last-child {
                    @apply border-b-0;
                }
                .mobile-input-picker-option.is-selected {
                    @apply font-bold text-[#2f7af6];
                }
                .mobile-input-picker-option.is-disabled {
                    @apply cursor-default text-[#999999];
                }
                .mobile-input-textarea {
                    @apply min-h-20 resize-none text-left leading-6;
                }
                .mobile-input-phone-list {
                    @apply grid w-full gap-2 text-left;
                }
                .mobile-input-phone-row {
                    @apply flex min-h-9 items-center justify-end gap-2;
                }
                .mobile-input-unit,
                .mobile-input-location-button,
                .mobile-date-range-separator,
                .mobile-switch-text {
                    @apply shrink-0 text-sm leading-[22px] text-[#666666];
                }
                .mobile-input-location-button {
                    @apply cursor-pointer border-0 bg-transparent p-0 font-medium text-[#2f7af6] disabled:cursor-default disabled:text-[#999999];
                    font: inherit;
                }
                .mobile-date-range {
                    @apply grid w-full grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2;
                }
                .mobile-date-range-separator {
                    @apply text-xs text-[#999999];
                }
                .mobile-option-group {
                    @apply flex flex-wrap justify-end gap-2;
                }
                .mobile-option-group.is-vertical {
                    @apply flex-col items-end;
                }
                .mobile-option-pill {
                    @apply box-border min-h-8 cursor-pointer rounded-full border border-slate-200 bg-white px-3 text-sm text-[#666666] disabled:cursor-default disabled:opacity-60;
                    font: inherit;
                }
                .mobile-option-pill.is-selected {
                    @apply border-[#2f7af6] bg-[#eaf3ff] font-medium text-[#2f7af6];
                }
                .mobile-switch {
                    @apply inline-flex min-h-7 cursor-pointer items-center justify-end gap-2 border-0 bg-transparent p-0 disabled:cursor-default disabled:opacity-60;
                    font: inherit;
                }
                .mobile-switch-track {
                    @apply relative inline-flex h-7 w-12 rounded-full bg-slate-300 transition-colors duration-150 ease-out;
                }
                .mobile-switch-track.is-checked {
                    @apply bg-[#2f7af6];
                }
                .mobile-switch-thumb {
                    @apply absolute top-0.5 left-0.5 size-6 rounded-full bg-white shadow-[0_2px_6px_rgba(15,23,42,0.18)] transition-transform duration-150 ease-out;
                }
                .mobile-switch-thumb.is-checked {
                    @apply translate-x-5;
                }
                .mobile-form-section {
                    @apply overflow-hidden rounded-2xl bg-white;
                }
                .mobile-form-section.is-bordered {
                    @apply border border-[#eef1f5];
                }
                .mobile-form-section__body.is-inset {
                    @apply p-0;
                }
                .mobile-form-section__header {
                    @apply box-border flex w-full items-start justify-between gap-3 border-0 border-b border-[#eef1f5] bg-transparent px-4 py-3 text-left text-inherit;
                    font: inherit;
                }
                .mobile-form-section__copy {
                    @apply min-w-0 flex-1;
                }
                .mobile-form-section__title {
                    @apply text-base font-medium leading-[22px] text-[#333333];
                }
                .mobile-form-section__description {
                    @apply mt-1 text-xs leading-5 text-[#999999];
                }
                .mobile-form-section__arrow {
                    @apply text-sm text-[#999999];
                }
                .is-hidden,
                .hidden {
                    @apply hidden;
                }
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
