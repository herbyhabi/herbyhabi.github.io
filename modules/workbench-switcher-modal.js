(function () {
    const workbenchMap = {
        specialist: {
            type: 'specialist',
            name: '专科慢病',
            icon: 'fas fa-stethoscope'
        },
        'public-health': {
            type: 'public-health',
            name: '公卫慢病',
            icon: 'fas fa-hospital'
        },
        operation: {
            type: 'operation',
            name: '运营中心',
            icon: 'fas fa-headset'
        }
    };

    let config = {
        title: '切换工作台',
        options: ['specialist', 'public-health', 'operation'],
        selectedType: '',
        onSelect: () => {}
    };
    let modalInstance = null;

    function init(options = {}) {
        config = {
            ...config,
            ...options,
            options: normalizeOptions(options.options || config.options)
        };
        injectStyle();
        injectModal();
        renderOptions();
    }

    function open(options = {}) {
        if (Object.keys(options).length) init(options);
        injectStyle();
        injectModal();
        renderOptions();
        modalInstance.open();
    }

    function close() {
        if (modalInstance) modalInstance.close();
    }

    function injectStyle() {
        if (document.getElementById('workbenchSwitcherModalStyle')) return;
        const style = document.createElement('style');
        style.id = 'workbenchSwitcherModalStyle';
        style.textContent = `
            .workbench-switcher-modal-mask {
                --mobile-modal-primary: #2F6BFF;
                --mobile-modal-sheet-max-height: 72vh;
            }

            .workbench-switcher-modal-mask .mobile-modal-body {
                padding: 8px 16px calc(16px + env(safe-area-inset-bottom, 0px));
            }

            .workbench-switcher-list {
                display: flex;
                flex-direction: column;
                gap: 12px;
            }

            .workbench-switcher-item {
                width: 100%;
                min-height: 64px;
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 12px 14px;
                border: 1px solid #E5E6EB;
                border-radius: 14px;
                background: #FFFFFF;
                color: #1D2129;
                text-align: left;
                cursor: pointer;
                -webkit-tap-highlight-color: transparent;
            }

            .workbench-switcher-item.is-active {
                border-color: rgba(47, 107, 255, 0.42);
                background: #F2F6FF;
            }

            .workbench-switcher-item:active {
                transform: scale(0.98);
            }

            .workbench-switcher-icon {
                width: 42px;
                height: 42px;
                flex: 0 0 auto;
                display: grid;
                place-items: center;
                border-radius: 12px;
                font-size: 18px;
            }

            .workbench-switcher-item.specialist .workbench-switcher-icon {
                background: #EAF3FF;
                color: #2F6BFF;
            }

            .workbench-switcher-item.public-health .workbench-switcher-icon {
                background: #E8FFEA;
                color: #07C160;
            }

            .workbench-switcher-item.operation .workbench-switcher-icon {
                background: #FFF4E2;
                color: #FF8A34;
            }

            .workbench-switcher-name {
                min-width: 0;
                flex: 1 1 auto;
                overflow: hidden;
                color: #1D2129;
                font-size: 15px;
                font-weight: 600;
                line-height: 1.35;
                text-overflow: ellipsis;
                white-space: nowrap;
            }

            .workbench-switcher-arrow {
                flex: 0 0 auto;
                color: #86909C;
                font-size: 13px;
            }
        `;
        document.head.appendChild(style);
    }

    function injectModal() {
        if (modalInstance) return;
        if (!window.MobileModal) {
            throw new Error('WorkbenchSwitcherModal requires components/mobile/mobile-modal.js');
        }
        modalInstance = MobileModal.create({
            id: 'workbenchSwitcherModal',
            type: 'bottomSheet',
            title: config.title,
            className: 'workbench-switcher-modal-mask',
            content: '<div class="workbench-switcher-list" id="workbenchSwitcherList"></div>',
            leftAction: {
                text: '取消',
                close: true
            }
        });
    }

    function renderOptions() {
        if (!modalInstance) return;
        const title = modalInstance.element.querySelector('.mobile-modal-title');
        const list = document.getElementById('workbenchSwitcherList');
        if (title) title.textContent = config.title;
        if (!list) return;

        list.innerHTML = config.options.map(workbench => `
            <button class="workbench-switcher-item ${escapeAttribute(workbench.type)}${workbench.type === config.selectedType ? ' is-active' : ''}" type="button" data-workbench-type="${escapeAttribute(workbench.type)}">
                <span class="workbench-switcher-icon"><i class="${escapeAttribute(workbench.icon)}"></i></span>
                <span class="workbench-switcher-name">${escapeHTML(workbench.name)}</span>
                <i class="fas fa-chevron-right workbench-switcher-arrow"></i>
            </button>
        `).join('');

        list.querySelectorAll('[data-workbench-type]').forEach(item => {
            item.onclick = () => {
                const type = item.dataset.workbenchType;
                const workbench = config.options.find(option => option.type === type);
                if (!workbench) return;
                config.selectedType = type;
                renderOptions();
                config.onSelect(type, workbench);
            };
        });
    }

    function normalizeOptions(options) {
        return options
            .map(option => {
                if (typeof option === 'string') return workbenchMap[option];
                if (!option || !option.type || !workbenchMap[option.type]) return null;
                return { ...workbenchMap[option.type], ...option };
            })
            .filter(Boolean);
    }

    function escapeHTML(value) {
        return String(value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function escapeAttribute(value) {
        return escapeHTML(value).replace(/`/g, '&#96;');
    }

    window.WorkbenchSwitcherModal = {
        init,
        open,
        close
    };
}());
