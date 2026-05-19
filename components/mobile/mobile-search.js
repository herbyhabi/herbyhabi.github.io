(function () {
    const styleId = 'mobile-search-styles';
    const containers = [
        '.mobile-search',
        '.search-box',
        '.search-input-wrapper',
        '.resident-tag-search',
        '.mobile-search.search-box',
        '.mobile-search.search-input-wrapper',
        '.mobile-search.resident-tag-search'
    ];
    const containerSelector = containers.join(', ');
    const iconSelector = containers.map(selector => `${selector} i`).join(', ');
    const inputSelector = containers.map(selector => `${selector} input`).join(', ');
    const placeholderSelector = containers.map(selector => `${selector} input::placeholder`).join(', ');
    const focusSelector = containers.map(selector => `${selector}:focus-within`).join(', ');

    function ensureStyles() {
        if (document.getElementById(styleId)) return;
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            ${containerSelector} {
                position: relative;
                height: 34px;
                min-height: 34px;
                display: flex;
                align-items: center;
                gap: 0;
                padding: 0;
                box-sizing: border-box;
                border: 0;
                border-radius: 17px;
                background: #f3f5f8;
                box-shadow: none;
            }

            ${iconSelector} {
                position: absolute;
                left: 11px;
                top: 50%;
                transform: translateY(-50%);
                z-index: 1;
                color: #8a96a8;
                font-size: 12px;
                pointer-events: none;
            }

            ${inputSelector} {
                width: 100%;
                height: 34px;
                min-height: 34px;
                padding: 0 12px 0 32px;
                border: 0;
                border-radius: 17px;
                outline: none;
                background: transparent;
                color: #142033;
                font-size: 13px;
                line-height: 34px;
                box-shadow: none;
                box-sizing: border-box;
            }

            ${placeholderSelector} {
                color: #9aa5b5;
                font-weight: 400;
            }

            ${focusSelector} {
                background: #eef5ff;
                box-shadow: 0 0 0 1px rgba(47, 122, 246, 0.16);
            }
        `;
        document.head.appendChild(style);
    }

    function apply(root = document) {
        root.querySelectorAll(containerSelector).forEach(item => {
            item.classList.add('mobile-search');
        });
    }

    ensureStyles();

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => apply());
    } else {
        apply();
    }

    window.MobileSearch = {
        apply,
        ensureStyles
    };
}());
