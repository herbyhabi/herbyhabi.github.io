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
        if (!base || window.DateRangePicker) return;

    // 日期范围选择组件，用于开始日期与结束日期的区间录入。
    function create(options = {}) {
        const config = base.normalizeOptions(options);
        const field = base.createField(config, (body, fieldConfig, fieldNode) => {
            const wrapper = document.createElement('div');
            wrapper.className = 'mobile-date-range';

            const startInput = document.createElement('input');
            startInput.className = base.classNames(base.defaults.inputClass, config.inputClass);
            startInput.type = 'date';
            startInput.value = config.startValue || '';
            startInput.disabled = config.disabled;

            const separator = document.createElement('span');
            separator.className = 'mobile-date-range-separator';
            separator.textContent = '至';

            const endInput = document.createElement('input');
            endInput.className = base.classNames(base.defaults.inputClass, config.inputClass);
            endInput.type = 'date';
            endInput.value = config.endValue || '';
            endInput.disabled = config.disabled;

            function sync(shouldDispatch) {
                fieldNode.value = {
                    startValue: startInput.value,
                    endValue: endInput.value
                };
                if (shouldDispatch) {
                    base.dispatchChange(fieldNode, {
                        startValue: startInput.value,
                        endValue: endInput.value,
                        format: config.format || ''
                    });
                }
            }

            startInput.addEventListener('change', () => sync(true));
            endInput.addEventListener('change', () => sync(true));

            wrapper.appendChild(startInput);
            wrapper.appendChild(separator);
            wrapper.appendChild(endInput);
            body.appendChild(wrapper);
            fieldNode.startInput = startInput;
            fieldNode.endInput = endInput;
            sync(false);
        });

        return field;
    }

    window.DateRangePicker = {
        create,
        render(container, options) {
            return base.render(container, create(options));
        }
    };
    });
}());
