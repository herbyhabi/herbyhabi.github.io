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
        if (!base || window.CheckboxGroup) return;

    // 多选组组件，支持横向或纵向布局及最大选择数量限制。
    function create(options = {}) {
        const config = base.normalizeOptions(options);
        const optionsList = Array.isArray(config.options) ? config.options : [];
        let value = Array.isArray(config.value) ? config.value.slice() : [];

        const field = base.createField(config, (body, fieldConfig, fieldNode) => {
            const group = document.createElement('div');
            group.className = base.classNames(
                'mobile-option-group',
                config.direction === 'vertical' && 'is-vertical'
            );

            function normalizeOption(option) {
                if (typeof option === 'string' || typeof option === 'number') return { label: String(option), value: option };
                return { label: String(option.label || option.value || ''), value: option.value == null ? option.label : option.value, disabled: Boolean(option.disabled) };
            }

            function sync() {
                fieldNode.value = value.slice();
                group.querySelectorAll('button').forEach(button => {
                    const selected = value.some(current => String(current) === button.dataset.rawValue);
                    button.className = base.classNames(
                        'mobile-option-pill',
                        selected && 'is-selected'
                    );
                });
            }

            optionsList.map(normalizeOption).forEach(item => {
                const button = document.createElement('button');
                button.type = 'button';
                button.dataset.rawValue = String(item.value);
                button.disabled = config.disabled || item.disabled;
                button.textContent = item.label;
                button.addEventListener('click', () => {
                    if (button.disabled) return;
                    const raw = String(item.value);
                    if (value.some(current => String(current) === raw)) {
                        value = value.filter(current => String(current) !== raw);
                    } else if (!config.max || value.length < Number(config.max)) {
                        value = value.concat(item.value);
                    }
                    sync();
                    base.dispatchChange(fieldNode, { value: value.slice() });
                });
                group.appendChild(button);
            });

            body.appendChild(group);
            sync();
        });

        field.value = value;
        return field;
    }

    window.CheckboxGroup = {
        create,
        render(container, options) {
            return base.render(container, create(options));
        }
    };
    });
}());
