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
        if (!base || window.PhoneInput) return;

    // 手机号输入组件，自动过滤非数字字符；multiple 为 true 时支持多个手机号。
    function create(options = {}) {
        const config = base.normalizeOptions(options);
        const maxLength = Number(config.maxlength || config.maxLength || 11);
        const field = base.createField(config, (body, fieldConfig, fieldNode) => {
            if (config.multiple) {
                createMultiplePhoneInput(body, fieldNode, config, maxLength, options);
                return;
            }

            const input = document.createElement('input');
            input.className = base.classNames(base.defaults.inputClass, config.inputClass);
            input.type = 'tel';
            input.inputMode = 'numeric';
            input.placeholder = config.placeholder;
            input.value = String(config.value || '').replace(/\D/g, '').slice(0, maxLength);
            input.maxLength = maxLength;
            input.autocomplete = options.autocomplete || 'tel';
            base.setDisabledState(input, config);

            input.addEventListener('input', () => {
                const nextValue = input.value.replace(/\D/g, '').slice(0, maxLength);
                if (input.value !== nextValue) input.value = nextValue;
                fieldNode.value = input.value;
            });
            input.addEventListener('change', () => base.dispatchChange(fieldNode, { value: input.value }));

            body.appendChild(input);
            fieldNode.input = input;
            fieldNode.value = input.value;
        });

        return field;
    }

    function normalizePhoneValue(value, maxLength) {
        return String(value || '').replace(/\D/g, '').slice(0, maxLength);
    }

    function getInitialPhones(value, maxLength) {
        const list = Array.isArray(value) ? value : String(value || '').split(',');
        const phones = list
            .map(item => normalizePhoneValue(item, maxLength))
            .filter(Boolean);
        return phones.length ? phones : [''];
    }

    function createMultiplePhoneInput(body, fieldNode, config, maxLength, options) {
        let phones = getInitialPhones(config.value, maxLength);
        const max = Number(config.max || config.maxCount || 0);

        const list = document.createElement('div');
        list.className = 'mobile-input-phone-list';

        const addButton = document.createElement('button');
        addButton.type = 'button';
        addButton.disabled = config.disabled;
        addButton.className = 'mobile-input-add';
        addButton.setAttribute('aria-label', options.addText || '添加手机号');
        addButton.textContent = '+';

        function sync(shouldDispatch) {
            const values = Array.from(list.querySelectorAll('input')).map(input => input.value).filter(Boolean);
            fieldNode.value = values;
            addButton.classList.toggle('hidden', Boolean(max && values.length >= max));
            if (shouldDispatch) base.dispatchChange(fieldNode, { value: values });
        }

        function renderRows() {
            list.innerHTML = '';
            phones.forEach((phone, index) => {
                const row = document.createElement('div');
                row.className = 'mobile-input-phone-row';

                const input = document.createElement('input');
                input.className = base.classNames(base.defaults.inputClass, config.inputClass);
                input.type = 'tel';
                input.inputMode = 'numeric';
                input.placeholder = config.placeholder || '请输入手机号';
                input.value = phone;
                input.maxLength = maxLength;
                input.autocomplete = options.autocomplete || 'tel';
                base.setDisabledState(input, config);
                input.addEventListener('input', () => {
                    const nextValue = normalizePhoneValue(input.value, maxLength);
                    if (input.value !== nextValue) input.value = nextValue;
                    phones[index] = input.value;
                    sync(false);
                });
                input.addEventListener('change', () => sync(true));

                const removeButton = document.createElement('button');
                removeButton.type = 'button';
                removeButton.disabled = config.disabled || phones.length <= 1;
                removeButton.className = 'mobile-input-remove';
                removeButton.setAttribute('aria-label', '删除手机号');
                removeButton.textContent = '×';
                removeButton.addEventListener('click', () => {
                    phones.splice(index, 1);
                    if (!phones.length) phones = [''];
                    renderRows();
                    sync(true);
                });

                row.appendChild(input);
                row.appendChild(removeButton);
                list.appendChild(row);
            });
            sync(false);
        }

        addButton.addEventListener('click', () => {
            if (config.disabled || (max && phones.length >= max)) return;
            phones.push('');
            renderRows();
            sync(true);
        });

        body.appendChild(list);
        body.appendChild(addButton);
        fieldNode.list = list;
        renderRows();
    }

    window.PhoneInput = {
        create,
        render(container, options) {
            return base.render(container, create(options));
        }
    };
    });
}());
