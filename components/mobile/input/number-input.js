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
        if (!base || window.NumberInput) return;

    // 数字输入组件，限制数字格式并支持范围、小数位与单位展示。
    function create(options = {}) {
        const config = base.normalizeOptions(options);
        const precision = Number.isFinite(Number(config.precision)) ? Number(config.precision) : null;
        const field = base.createField(config, (body, fieldConfig, fieldNode) => {
            const wrapper = document.createElement('div');
            wrapper.className = 'mobile-input-inline';

            const input = document.createElement('input');
            input.className = base.classNames(base.defaults.inputClass, config.inputClass);
            input.type = 'number';
            input.inputMode = precision && precision > 0 ? 'decimal' : 'numeric';
            input.placeholder = config.placeholder;
            input.value = config.value;
            if (config.min != null) input.min = config.min;
            if (config.max != null) input.max = config.max;
            if (precision != null) input.step = precision > 0 ? String(1 / Math.pow(10, precision)) : '1';
            base.setDisabledState(input, config);

            input.addEventListener('blur', () => {
                if (precision != null && input.value !== '') {
                    input.value = Number(input.value).toFixed(Math.max(0, precision));
                }
                fieldNode.value = input.value;
            });
            input.addEventListener('input', () => {
                fieldNode.value = input.value;
            });
            input.addEventListener('change', () => base.dispatchChange(fieldNode, { value: input.value }));

            wrapper.appendChild(input);
            if (config.unit) {
                const unit = document.createElement('span');
                unit.className = 'mobile-input-unit';
                unit.textContent = config.unit;
                wrapper.appendChild(unit);
            }
            body.appendChild(wrapper);
            fieldNode.input = input;
        });

        field.value = config.value;
        return field;
    }

    window.NumberInput = {
        create,
        render(container, options) {
            return base.render(container, create(options));
        }
    };
    });
}());
