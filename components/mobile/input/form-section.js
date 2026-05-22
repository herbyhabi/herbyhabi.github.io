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
        if (!base || window.FormSection) return;

    // 表单分组卡片组件，用于承载同类输入字段。
    function create(options = {}) {
        const config = {
            title: options.title || '',
            description: options.description || '',
            collapsible: Boolean(options.collapsible),
            bordered: options.bordered !== false,
            inset: options.inset !== false,
            content: options.content || ''
        };

        const section = document.createElement('section');
        section.className = base.classNames(
            'mobile-form-section',
            config.bordered && 'is-bordered',
            options.className
        );

        const body = document.createElement('div');
        body.className = base.classNames('mobile-form-section__body', config.inset && 'is-inset', options.bodyClass);

        if (config.title || config.description || config.collapsible) {
            const header = document.createElement('button');
            header.type = 'button';
            header.className = 'mobile-form-section__header';
            header.disabled = !config.collapsible;

            const copy = document.createElement('div');
            copy.className = 'mobile-form-section__copy';
            if (config.title) {
                const title = document.createElement('div');
                title.className = 'mobile-form-section__title';
                title.textContent = config.title;
                copy.appendChild(title);
            }
            if (config.description) {
                const description = document.createElement('div');
                description.className = 'mobile-form-section__description';
                description.textContent = config.description;
                copy.appendChild(description);
            }

            const arrow = document.createElement('span');
            arrow.className = base.classNames('mobile-form-section__arrow', !config.collapsible && 'is-hidden');
            arrow.textContent = '⌄';
            header.appendChild(copy);
            header.appendChild(arrow);
            section.appendChild(header);

            header.addEventListener('click', () => {
                if (!config.collapsible) return;
                const collapsed = section.dataset.collapsed === 'true';
                section.dataset.collapsed = String(!collapsed);
                body.classList.toggle('hidden', !collapsed);
                arrow.textContent = collapsed ? '⌄' : '›';
            });
        }

        if (typeof config.content === 'string') {
            body.innerHTML = config.content;
        } else if (config.content instanceof Node) {
            body.appendChild(config.content);
        } else if (Array.isArray(config.content)) {
            config.content.forEach(item => {
                if (item instanceof Node) body.appendChild(item);
            });
        }

        section.body = body;
        section.appendChild(body);
        return section;
    }

    window.FormSection = {
        create,
        render(container, options) {
            return base.render(container, create(options));
        }
    };
    });
}());
