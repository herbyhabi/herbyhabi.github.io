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
        if (!base || window.RadioGroup) return;

    // 单选组组件，用于多个互斥选项中选择一个值。
    function create(options = {}) {
        const config = base.normalizeOptions(options);
        const optionsList = Array.isArray(config.options) ? config.options : [];
        let value = config.value;

        const field = base.createField(config, (body, fieldConfig, fieldNode) => {
            const group = document.createElement('div');
            group.className = base.classNames(
                'mobile-option-group',
                config.direction === 'vertical' && 'is-vertical'
            );
            group.setAttribute('role', 'radiogroup');

            function normalizeOption(option) {
                if (typeof option === 'string' || typeof option === 'number') return { label: String(option), value: option };
                return { label: String(option.label || option.value || ''), value: option.value == null ? option.label : option.value, disabled: Boolean(option.disabled) };
            }

            function sync() {
                fieldNode.value = value;
                group.querySelectorAll('button').forEach(button => {
                    const selected = button.dataset.value === String(value);
                    button.setAttribute('aria-checked', String(selected));
                    button.className = base.classNames(
                        'mobile-option-pill',
                        selected && 'is-selected'
                    );
                });
            }

            optionsList.map(normalizeOption).forEach(item => {
                const button = document.createElement('button');
                button.type = 'button';
                button.dataset.value = String(item.value);
                button.disabled = config.disabled || item.disabled;
                button.setAttribute('role', 'radio');
                button.textContent = item.label;
                button.addEventListener('click', () => {
                    if (button.disabled) return;
                    value = item.value;
                    sync();
                    base.dispatchChange(fieldNode, { value });
                });
                group.appendChild(button);
            });

            body.appendChild(group);
            sync();
        });

        field.value = value;
        return field;
    }

    window.RadioGroup = {
        create,
        render(container, options) {
            return base.render(container, create(options));
        }
    };
    });
}());
