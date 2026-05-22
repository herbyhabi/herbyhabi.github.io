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
        if (!base || window.LocationInput) return;

    // 地址输入组件，支持手动输入与定位按钮事件。
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
            input.autocomplete = 'off';
            base.setDisabledState(input, config);
            input.addEventListener('input', () => {
                fieldNode.value = input.value;
            });
            input.addEventListener('change', () => base.dispatchChange(fieldNode, { value: input.value }));

            wrapper.appendChild(input);
            if (config.enableLocation !== false) {
                const locate = document.createElement('button');
                locate.type = 'button';
                locate.disabled = config.disabled;
                locate.className = 'mobile-input-location-button';
                locate.textContent = '定位';
                locate.addEventListener('click', () => {
                    fieldNode.dispatchEvent(new CustomEvent('location-click', {
                        bubbles: true,
                        detail: { value: input.value }
                    }));
                });
                wrapper.appendChild(locate);
            }

            body.appendChild(wrapper);
            fieldNode.input = input;
        });

        field.value = config.value;
        return field;
    }

    window.LocationInput = {
        create,
        render(container, options) {
            return base.render(container, create(options));
        }
    };
    });
}());
