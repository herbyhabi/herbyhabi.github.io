(function () {
    if (window.MobileInputComponents) return;

    // 输入组件统一入口，按固定顺序加载共享基础能力与所有输入组件。
    const files = [
        'base-field.js',
        'text-input.js',
        'number-input.js',
        'textarea.js',
        'picker-select.js',
        'radio-group.js',
        'checkbox-group.js',
        'switch-field.js',
        'date-picker.js',
        'date-range-picker.js',
        'location-input.js',
        'phone-input.js',
        'form-section.js'
    ];

    function getBasePath() {
        const current = document.currentScript;
        if (!current || !current.src) return './';
        return current.src.slice(0, current.src.lastIndexOf('/') + 1);
    }

    function loadScript(src) {
        return new Promise((resolve, reject) => {
            if (document.querySelector(`script[src="${src}"]`)) {
                resolve();
                return;
            }
            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    const basePath = getBasePath();
    window.MobileInputComponents = {
        ready: files.reduce((chain, file) => {
            return chain.then(() => loadScript(basePath + file));
        }, Promise.resolve())
    };
}());
