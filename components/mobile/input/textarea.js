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
        if (!base || window.Textarea) return;

    // 多行文本输入组件，支持最大字数、字数统计与高度自适应。
    function create(options = {}) {
        const config = base.normalizeOptions(options);
        const field = base.createField(config, (body, fieldConfig, fieldNode) => {
            const input = document.createElement('textarea');
            input.className = base.classNames(
                base.defaults.inputClass,
                'mobile-input-textarea',
                config.inputClass
            );
            input.placeholder = config.placeholder;
            input.value = config.value;
            input.rows = Number(config.rows || 3);
            if (config.maxLength) input.maxLength = Number(config.maxLength);
            base.setDisabledState(input, config);

            const count = document.createElement('div');
            count.className = base.defaults.helperClass;

            function updateCount() {
                fieldNode.value = input.value;
                if (config.showCount) {
                    const max = config.maxLength ? `/${config.maxLength}` : '';
                    count.textContent = `${input.value.length}${max}`;
                }
                input.style.height = 'auto';
                input.style.height = `${input.scrollHeight}px`;
            }

            input.addEventListener('input', updateCount);
            input.addEventListener('change', () => base.dispatchChange(fieldNode, { value: input.value }));
            body.appendChild(input);
            if (config.showCount) body.appendChild(count);
            requestAnimationFrame(updateCount);
            fieldNode.input = input;
        });

        field.value = config.value;
        return field;
    }

    window.Textarea = {
        create,
        render(container, options) {
            return base.render(container, create(options));
        }
    };
    });
}());
