(function () {
    const defaultHistories = [];

    const modalContentHTML = `
        <div class="mobile-search past-history-search">
            <i class="fas fa-search"></i>
            <input id="pastHistorySearchInput" type="search" placeholder="搜索疾病名称" autocomplete="off">
        </div>
        <div class="past-history-summary" id="pastHistorySummary"></div>
        <div class="past-history-list" id="pastHistoryList"></div>
    `;

    const styleText = `
        .past-history-modal-mask {
            --mobile-modal-sheet-max-height: 76vh;
        }
        .past-history-modal-mask .mobile-modal-panel {
            background: #f6f8fb;
        }
        .past-history-modal-mask .mobile-modal-header {
            padding-top: 12px;
            background: #f6f8fb;
        }
        .past-history-modal-mask .mobile-modal-body {
            padding-top: 8px;
        }
        .past-history-search {
            margin-bottom: 12px;
        }
        .past-history-summary {
            margin: 0 2px 10px;
            color: #666666;
            font-size: 12px;
            line-height: 1.5;
        }
        .past-history-list {
            display: grid;
            gap: 10px;
            padding-bottom: calc(4px + env(safe-area-inset-bottom, 0px));
        }
        .past-history-card {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            min-height: 52px;
            padding: 12px 14px;
            border: 1px solid #edf1f5;
            border-radius: 12px;
            background: #fff;
            box-shadow: 0 6px 16px rgba(68, 84, 104, 0.04);
        }
        .past-history-name {
            min-width: 0;
            color: #333333;
            font-size: 15px;
            font-weight: 500;
            line-height: 1.35;
            word-break: break-word;
        }
        .past-history-new {
            flex: 0 0 auto;
            min-width: 22px;
            height: 20px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 0 6px;
            border-radius: 999px;
            background: #fff3e8;
            color: #f28c28;
            font-size: 12px;
            font-weight: 700;
            line-height: 1;
        }
        .past-history-empty {
            padding: 26px 12px;
            border-radius: 12px;
            background: #fff;
            color: #999999;
            font-size: 13px;
            text-align: center;
        }
    `;

    let config = {
        histories: defaultHistories
    };
    let modalInstance = null;

    function init(options = {}) {
        config = {
            ...config,
            ...options,
            histories: Array.isArray(options.histories) ? options.histories : config.histories
        };
        injectStyle();
        injectModal();
        bindEvents();
    }

    function open() {
        injectStyle();
        injectModal();
        bindEvents();
        modalInstance.open();
        const input = document.getElementById('pastHistorySearchInput');
        input.value = '';
        renderHistories();
        setTimeout(() => input.focus(), 80);
    }

    function close() {
        if (modalInstance) modalInstance.close();
    }

    function injectStyle() {
        if (document.getElementById('pastMedicalHistoryModalStyle')) return;
        const style = document.createElement('style');
        style.id = 'pastMedicalHistoryModalStyle';
        style.textContent = styleText;
        document.head.appendChild(style);
    }

    function injectModal() {
        if (modalInstance) return;
        if (!window.MobileModal) {
            throw new Error('PastMedicalHistoryModal requires components/mobile/mobile-modal.js');
        }
        modalInstance = MobileModal.create({
            id: 'pastMedicalHistoryModal',
            type: 'bottomSheet',
            title: '既往史情况',
            className: 'past-history-modal-mask',
            content: modalContentHTML,
            rightAction: {
                icon: 'fas fa-xmark',
                close: true,
                ariaLabel: '关闭'
            }
        });
        if (window.MobileSearch) {
            MobileSearch.ensureStyles();
            MobileSearch.apply(modalInstance.getBody());
        }
    }

    function bindEvents() {
        const input = document.getElementById('pastHistorySearchInput');
        if (!input || input.dataset.bound === 'true') return;
        input.dataset.bound = 'true';
        input.addEventListener('input', renderHistories);
    }

    // 渲染既往史疾病列表，并根据搜索关键词实时过滤
    function renderHistories() {
        const keyword = document.getElementById('pastHistorySearchInput').value.trim();
        const histories = getFilteredHistories(keyword);
        const summary = document.getElementById('pastHistorySummary');
        const list = document.getElementById('pastHistoryList');
        const newCount = histories.filter(isNewDisease).length;

        summary.textContent = keyword
            ? `匹配到 ${histories.length} 项既往史疾病`
            : `共 ${histories.length} 项既往史，近三个月新增 ${newCount} 项`;
        list.innerHTML = histories.length
            ? histories.map(getHistoryCardHTML).join('')
            : `<div class="past-history-empty">暂无数据</div>`;
    }

    function getFilteredHistories(keyword) {
        const normalizedKeyword = normalizeText(keyword);
        return config.histories
            .filter(history => history && history.name)
            .filter(history => !normalizedKeyword || normalizeText(history.name).includes(normalizedKeyword));
    }

    function getHistoryCardHTML(history) {
        return `
            <div class="past-history-card">
                <div class="past-history-name">${escapeHTML(history.name)}</div>
                ${isNewDisease(history) ? '<span class="past-history-new">新</span>' : ''}
            </div>
        `;
    }

    function isNewDisease(history) {
        if (!history.addedAt) return false;
        const addedTime = new Date(history.addedAt).getTime();
        if (Number.isNaN(addedTime)) return false;
        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
        return addedTime >= threeMonthsAgo.getTime() && addedTime <= Date.now();
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

    function normalizeText(value) {
        return String(value).trim().toLowerCase();
    }

    window.PastMedicalHistoryModal = {
        init,
        open,
        close
    };
}());
