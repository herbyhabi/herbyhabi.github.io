(function () {
    const defaultDynamics = [];

    const modalContentHTML = `
        <div class="medication-dynamic-summary" id="medicationDynamicSummary"></div>
        <div class="medication-dynamic-list" id="medicationDynamicList"></div>
    `;

    const styleText = `
        .medication-dynamic-modal-mask {
            --mobile-modal-sheet-max-height: 76vh;
        }
        .medication-dynamic-modal-mask .mobile-modal-panel {
            background: #f6f8fb;
        }
        .medication-dynamic-modal-mask .mobile-modal-header {
            padding-top: 12px;
            background: #f6f8fb;
        }
        .medication-dynamic-modal-mask .mobile-modal-body {
            padding-top: 8px;
        }
        .medication-dynamic-summary {
            margin: 0 2px 10px;
            color: #666666;
            font-size: 12px;
            line-height: 1.5;
        }
        .medication-dynamic-list {
            display: grid;
            gap: 10px;
            padding-bottom: calc(4px + env(safe-area-inset-bottom, 0px));
        }
        .medication-dynamic-card {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            gap: 12px;
            min-height: 52px;
            padding: 12px 14px;
            border: 1px solid #edf1f5;
            border-radius: 12px;
            background: #fff;
            box-shadow: 0 6px 16px rgba(68, 84, 104, 0.04);
        }
        .medication-dynamic-meta {
            flex: 0 0 66px;
            min-width: 0;
            display: grid;
            gap: 5px;
            align-self: stretch;
            align-content: center;
            justify-items: center;
            padding-right: 12px;
            border-right: 1px solid #edf1f5;
            text-align: center;
        }
        .medication-dynamic-date,
        .medication-dynamic-type {
            display: block;
            line-height: 1.2;
        }
        .medication-dynamic-date {
            color: #999999;
            font-size: 12px;
            font-weight: 500;
            white-space: nowrap;
        }
        .medication-dynamic-type {
            color: #2f7af6;
            font-size: 13px;
            font-weight: 700;
        }
        .medication-dynamic-content {
            align-self: center;
            flex: 1;
            min-width: 0;
            color: #333333;
            font-size: 14px;
            font-weight: 500;
            line-height: 1.35;
            word-break: break-word;
        }
        .medication-dynamic-empty {
            padding: 26px 12px;
            border-radius: 12px;
            background: #fff;
            color: #999999;
            font-size: 13px;
            text-align: center;
        }
    `;

    let config = {
        dynamics: defaultDynamics
    };
    let modalInstance = null;

    function init(options = {}) {
        config = {
            ...config,
            ...options,
            dynamics: Array.isArray(options.dynamics) ? options.dynamics : config.dynamics
        };
        injectStyle();
        injectModal();
    }

    function open() {
        injectStyle();
        injectModal();
        modalInstance.open();
        renderDynamics();
    }

    function close() {
        if (modalInstance) modalInstance.close();
    }

    function injectStyle() {
        if (document.getElementById('medicationDynamicModalStyle')) return;
        const style = document.createElement('style');
        style.id = 'medicationDynamicModalStyle';
        style.textContent = styleText;
        document.head.appendChild(style);
    }

    function injectModal() {
        if (modalInstance) return;
        if (!window.MobileModal) {
            throw new Error('MedicationDynamicModal requires components/mobile/mobile-modal.js');
        }
        modalInstance = MobileModal.create({
            id: 'medicationDynamicModal',
            type: 'bottomSheet',
            title: '用药动态',
            className: 'medication-dynamic-modal-mask',
            content: modalContentHTML,
            rightAction: {
                icon: 'fas fa-xmark',
                close: true,
                ariaLabel: '关闭'
            }
        });
    }

    // 渲染用药动态列表，卡片样式与既往史弹窗保持一致
    function renderDynamics() {
        const dynamics = config.dynamics.filter(item => item && item.content);
        const summary = document.getElementById('medicationDynamicSummary');
        const list = document.getElementById('medicationDynamicList');

        summary.textContent = `近一个月共 ${dynamics.length} 条用药动态`;
        list.innerHTML = dynamics.length
            ? dynamics.map(getDynamicCardHTML).join('')
            : '<div class="medication-dynamic-empty">暂无用药动态</div>';
    }

    function getDynamicCardHTML(item) {
        return `
            <div class="medication-dynamic-card">
                <div class="medication-dynamic-meta">
                    <span class="medication-dynamic-date">${escapeHTML(item.date || '--')}</span>
                    <span class="medication-dynamic-type">${escapeHTML(item.type || '动态')}</span>
                </div>
                <div class="medication-dynamic-content">${escapeHTML(item.content)}</div>
            </div>
        `;
    }

    function escapeHTML(value) {
        return String(value).replace(/[&<>"']/g, char => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        }[char]));
    }

    window.MedicationDynamicModal = {
        init,
        open,
        close
    };
}());
