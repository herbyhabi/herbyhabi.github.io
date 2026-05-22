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
        if (!base || window.PickerSelect) return;

    // 选择器组件，优先使用 MobileModal 底部弹层，未加载时降级为内嵌选项面板。
    function create(options = {}) {
        const config = base.normalizeOptions(options);
        const optionsList = Array.isArray(config.options) ? config.options : [];
        let value = config.multiple
            ? (Array.isArray(config.value) ? config.value.slice() : [])
            : config.value;

        const field = base.createField(config, (body, fieldConfig, fieldNode) => {
            const button = document.createElement('button');
            button.type = 'button';
            button.disabled = config.disabled;
            button.className = 'mobile-input-picker-trigger';

            const text = document.createElement('span');
            text.className = 'mobile-input-picker-trigger__text';
            const arrow = document.createElement('span');
            arrow.className = 'mobile-input-picker-trigger__arrow';
            arrow.textContent = '›';
            button.appendChild(text);
            button.appendChild(arrow);
            body.appendChild(button);

            function normalizeOption(option) {
                if (typeof option === 'string' || typeof option === 'number') {
                    return { label: String(option), value: option };
                }
                return {
                    label: option.label == null ? String(option.value || '') : String(option.label),
                    value: option.value == null ? option.label : option.value,
                    disabled: Boolean(option.disabled)
                };
            }

            function selectedOptions() {
                return optionsList.map(normalizeOption).filter(item => {
                    return config.multiple ? value.includes(item.value) : item.value === value;
                });
            }

            function sync() {
                fieldNode.value = value;
                const labels = selectedOptions().map(item => item.label);
                text.textContent = labels.length ? labels.join('、') : config.placeholder;
                text.className = base.classNames(
                    'mobile-input-picker-trigger__text',
                    !labels.length && 'is-placeholder'
                );
            }

            function choose(item) {
                if (item.disabled) return;
                if (config.multiple) {
                    value = value.includes(item.value)
                        ? value.filter(current => current !== item.value)
                        : value.concat(item.value);
                    sync();
                    base.dispatchChange(fieldNode, { value });
                    return;
                }
                value = item.value;
                sync();
                base.dispatchChange(fieldNode, { value });
            }

            function getOptionButton(item) {
                const selected = config.multiple ? value.includes(item.value) : item.value === value;
                const optionButton = document.createElement('button');
                optionButton.type = 'button';
                optionButton.disabled = item.disabled;
                optionButton.className = base.classNames(
                    'mobile-input-picker-option',
                    selected && 'is-selected',
                    item.disabled && 'is-disabled'
                );
                optionButton.innerHTML = `<span>${base.escapeHTML(item.label)}</span><span>${selected ? '✓' : ''}</span>`;
                optionButton.addEventListener('click', () => {
                    choose(item);
                    if (!config.multiple && optionButton.closest('.mobile-input-picker-fallback')) {
                        optionButton.closest('.mobile-input-picker-fallback').remove();
                    }
                });
                return optionButton;
            }

            function openFallback() {
                const oldPanel = document.querySelector('.mobile-input-picker-fallback');
                if (oldPanel) {
                    oldPanel.remove();
                    return;
                }
                const panel = document.createElement('div');
                const rect = button.getBoundingClientRect();
                panel.className = 'mobile-input-picker-fallback';
                panel.style.left = `${Math.max(12, rect.left)}px`;
                panel.style.top = `${rect.bottom + 8}px`;
                panel.style.width = `${Math.max(180, rect.width)}px`;
                optionsList.map(normalizeOption).forEach(item => panel.appendChild(getOptionButton(item)));
                document.body.appendChild(panel);

                setTimeout(() => {
                    document.addEventListener('click', closeFallback, { once: true });
                }, 0);
            }

            function closeFallback(event) {
                const panel = document.querySelector('.mobile-input-picker-fallback');
                if (!panel) return;
                if (event && (panel.contains(event.target) || button.contains(event.target))) {
                    document.addEventListener('click', closeFallback, { once: true });
                    return;
                }
                panel.remove();
            }

            function openModal() {
                const content = document.createElement('div');
                content.className = 'mobile-input-picker-options';
                optionsList.map(normalizeOption).forEach(item => content.appendChild(getOptionButton(item)));
                const modal = window.MobileModal.create({
                    type: 'bottomSheet',
                    title: config.label || '请选择',
                    rightAction: config.multiple ? { text: '确定', primary: true, close: true } : null,
                    content: content.outerHTML
                });
                modal.open();
                modal.getBody().querySelectorAll('button').forEach((itemButton, index) => {
                    itemButton.addEventListener('click', () => {
                        choose(normalizeOption(optionsList[index]));
                        if (!config.multiple) modal.close();
                    });
                });
            }

            button.addEventListener('click', () => {
                if (config.disabled) return;
                if (window.MobileModal && typeof window.MobileModal.create === 'function') {
                    openModal();
                } else {
                    openFallback();
                }
            });

            sync();
        });

        field.value = value;
        return field;
    }

    window.PickerSelect = {
        create,
        render(container, options) {
            return base.render(container, create(options));
        }
    };
    });
}());
