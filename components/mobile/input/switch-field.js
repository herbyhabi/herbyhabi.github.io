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
        if (!base || window.SwitchField) return;

    // 开关字段组件，用于布尔状态切换。
    function create(options = {}) {
        const config = base.normalizeOptions(options);
        let checked = Boolean(config.value);
        const field = base.createField(config, (body, fieldConfig, fieldNode) => {
            const button = document.createElement('button');
            button.type = 'button';
            button.disabled = config.disabled;
            button.className = 'mobile-switch';

            const text = document.createElement('span');
            text.className = 'mobile-switch-text';

            const track = document.createElement('span');
            track.className = 'mobile-switch-track';
            const thumb = document.createElement('span');
            thumb.className = 'mobile-switch-thumb';
            track.appendChild(thumb);

            function sync() {
                fieldNode.value = checked;
                text.textContent = checked ? (config.activeText || '开启') : (config.inactiveText || '关闭');
                track.className = base.classNames(
                    'mobile-switch-track',
                    checked && 'is-checked'
                );
                thumb.className = base.classNames(
                    'mobile-switch-thumb',
                    checked && 'is-checked'
                );
            }

            button.addEventListener('click', () => {
                if (config.disabled) return;
                checked = !checked;
                sync();
                base.dispatchChange(fieldNode, { value: checked });
            });

            button.appendChild(text);
            button.appendChild(track);
            body.appendChild(button);
            sync();
        });

        field.value = checked;
        return field;
    }

    window.SwitchField = {
        create,
        render(container, options) {
            return base.render(container, create(options));
        }
    };
    });
}());
