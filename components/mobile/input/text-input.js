(function () {
    const currentScript = document.currentScript;

    function withBase(callback) {
        if (window.MobileInputBase) {
            callback(window.MobileInputBase);
            return;
        }

        const src = currentScript && currentScript.src
            ? currentScript.src.replace(/[^/]+$/, 'base-field.js')
            : 'base-field.js';
        const existing = Array.from(document.scripts).find(script => script.src === src);
        if (existing) {
            existing.addEventListener('load', () => callback(window.MobileInputBase), { once: true });
            return;
        }

        const script = document.createElement('script');
        script.src = src;
        script.onload = () => callback(window.MobileInputBase);
        document.head.appendChild(script);
    }

    withBase((base) => {
        if (!base || window.TextInput) return;

    // 单行文本输入组件，适用于姓名、单位、联系人、编号等字段。
    function create(options = {}) {
        const config = base.normalizeOptions(options);
        const field = base.createField(config, (body, fieldConfig, fieldNode) => {
            const wrapper = document.createElement('div');
            wrapper.className = 'mobile-input-inline';

            const input = document.createElement('input');
            input.className = base.classNames(base.defaults.inputClass, config.inputClass);
            input.type = 'text';
            input.placeholder = config.placeholder;
            input.value = config.value;
            input.autocomplete = options.autocomplete || 'off';
            if (config.maxLength) input.maxLength = Number(config.maxLength);
            base.setDisabledState(input, config);

            input.addEventListener('input', () => {
                const showClear = Boolean(input.value && !config.disabled && !config.readonly);
                clearButton.classList.toggle('is-hidden', !showClear);
                fieldNode.value = input.value;
            });
            input.addEventListener('change', () => base.dispatchChange(fieldNode, { value: input.value }));

            const clearButton = document.createElement('button');
            clearButton.className = base.classNames(
                'mobile-input-clear',
                !(config.clearable && input.value && !config.disabled && !config.readonly) && 'is-hidden'
            );
            clearButton.type = 'button';
            clearButton.setAttribute('aria-label', '清空');
            clearButton.textContent = '×';
            clearButton.addEventListener('click', () => {
                input.value = '';
                fieldNode.value = '';
                clearButton.classList.add('is-hidden');
                input.dispatchEvent(new Event('input', { bubbles: true }));
                base.dispatchChange(fieldNode, { value: '' });
            });

            if (!config.clearable) clearButton.remove();
            wrapper.appendChild(input);
            if (config.clearable) wrapper.appendChild(clearButton);
            body.appendChild(wrapper);

            fieldNode.input = input;
        });

        field.value = config.value;
        return field;
    }

    window.TextInput = {
        create,
        render(container, options) {
            return base.render(container, create(options));
        }
    };
    });
}());
