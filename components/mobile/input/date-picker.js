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
        if (!base || window.DatePicker) return;

    // 日期选择组件，基于浏览器原生日期/时间输入能力封装。
    function create(options = {}) {
        const config = base.normalizeOptions(options);
        const field = base.createField(config, (body, fieldConfig, fieldNode) => {
            const input = document.createElement('input');
            input.className = base.classNames(base.defaults.inputClass, config.inputClass);
            input.type = getInputType(config.type);
            input.value = config.value;
            input.placeholder = config.placeholder;
            base.setDisabledState(input, config);

            input.addEventListener('input', () => {
                fieldNode.value = input.value;
            });
            input.addEventListener('change', () => base.dispatchChange(fieldNode, {
                value: input.value,
                format: config.format || ''
            }));

            body.appendChild(input);
            fieldNode.input = input;
        });

        field.value = config.value;
        return field;
    }

    function getInputType(type) {
        if (type === 'datetime') return 'datetime-local';
        if (type === 'time') return 'time';
        if (type === 'month') return 'month';
        return 'date';
    }

    window.DatePicker = {
        create,
        render(container, options) {
            return base.render(container, create(options));
        }
    };
    });
}());
