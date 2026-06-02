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
        if (!base || window.DisplayField) return;

        // 只读展示字段，适用于头像、状态、绑定信息等非输入型表单行。
        function create(options = {}) {
            const config = base.normalizeOptions(options);
            const field = base.createField(config, (body, fieldConfig, fieldNode) => {
                const wrapper = document.createElement(options.action ? 'button' : 'div');
                wrapper.className = base.classNames('mobile-input-display', options.action && 'is-action', config.contentClass);
                if (options.action) {
                    wrapper.type = 'button';
                    wrapper.addEventListener('click', options.action);
                }

                if (options.iconClass) {
                    const icon = document.createElement('span');
                    icon.className = base.classNames('mobile-input-display__icon', options.iconClassName);
                    icon.innerHTML = `<i class="${base.escapeHTML(options.iconClass)}"></i>`;
                    wrapper.appendChild(icon);
                }

                const value = document.createElement('span');
                value.className = base.classNames(
                    'mobile-input-display__value',
                    !config.value && 'is-placeholder',
                    options.valueClass
                );
                value.textContent = config.value || config.placeholder || '';
                wrapper.appendChild(value);

                if (options.arrow) {
                    const arrow = document.createElement('span');
                    arrow.className = 'mobile-input-display__arrow';
                    arrow.innerHTML = '<i class="fas fa-chevron-right"></i>';
                    wrapper.appendChild(arrow);
                }

                body.appendChild(wrapper);
                fieldNode.valueElement = value;
                fieldNode.setValue = (nextValue) => {
                    fieldNode.value = nextValue || '';
                    value.textContent = fieldNode.value || config.placeholder || '';
                    value.classList.toggle('is-placeholder', !fieldNode.value);
                };
            });

            field.value = config.value || '';
            return field;
        }

        window.DisplayField = {
            create,
            render(container, options) {
                return base.render(container, create(options));
            }
        };
    });
}());
