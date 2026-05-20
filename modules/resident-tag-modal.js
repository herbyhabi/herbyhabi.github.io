(function () {
    const defaultTags = [
        '糖尿病', '高血压', '低盐饮食', '独居', '高脂血症', '冠心病', '规律服药',
        '血糖波动', '复诊逾期', '运动不足', '睡眠欠佳', '高意向', '需随访', '营养干预'
    ];

    const modalContentHTML = `
        <div class="resident-tag-search">
            <i class="fas fa-magnifying-glass"></i>
            <input id="residentTagSearchInput" type="search" placeholder="输入关键词后回车查询" autocomplete="off">
        </div>
        <div class="resident-tag-results" id="residentTagResults"></div>
        <div class="resident-tag-actions">
            <button class="resident-tag-confirm" type="button" id="residentTagConfirm">确认</button>
        </div>
    `;

    const styleText = `
        .resident-tag-search { margin: 2px 0 12px; }
        .resident-tag-helper {
            color: var(--text-3);
            font-size: 12px;
            line-height: 1.5;
        }
        .resident-tag-results {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-top: 12px;
        }
        .resident-tag-option,
        .resident-tag-create {
            flex: 0 0 auto;
            max-width: 100%;
            min-height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 7px 12px;
            border: 1px solid var(--line);
            border-radius: 999px;
            background: #fff;
            color: var(--text-1);
            font-size: 13px;
            font-weight: 800;
            text-align: center;
            cursor: pointer;
        }
        .resident-tag-option.is-selected {
            border-color: rgba(47, 122, 246, 0.42);
            background: var(--blue-soft);
            color: var(--blue);
        }
        .resident-tag-option span,
        .resident-tag-create span {
            min-width: 0;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        .resident-tag-create {
            border-color: rgba(47, 122, 246, 0.18);
            background: var(--blue-soft);
            color: var(--blue);
        }
        .resident-tag-empty {
            width: 100%;
            margin-top: 12px;
            padding: 12px;
            border-radius: 12px;
            background: #f8fbff;
        }
        .resident-tag-actions {
            position: sticky;
            bottom: -16px;
            margin: 16px -16px -16px;
            padding: 12px 16px calc(12px + env(safe-area-inset-bottom, 0px));
            background: rgba(255, 255, 255, 0.96);
            border-top: 1px solid var(--line);
        }
        .resident-tag-confirm {
            width: 100%;
            height: 44px;
            border: 0;
            border-radius: 12px;
            background: var(--blue);
            color: #fff;
            font-size: 15px;
            font-weight: 900;
            cursor: pointer;
        }
    `;

    let config = {
        availableTags: defaultTags,
        getCurrentTags: () => [],
        onAddTag: () => {}
    };
    let selectedTags = new Set();
    let initialTags = new Set();
    let modalInstance = null;

    function init(options = {}) {
        config = {
            ...config,
            ...options,
            availableTags: options.availableTags || config.availableTags
        };
        injectStyle();
        injectModal();
        bindEvents();
    }

    function open() {
        injectStyle();
        injectModal();
        bindEvents();
        const input = document.getElementById('residentTagSearchInput');
        initialTags = new Set(config.getCurrentTags());
        selectedTags = new Set(initialTags);
        modalInstance.open();
        input.value = '';
        renderInitialState();
        setTimeout(() => input.focus(), 80);
    }

    function close() {
        if (modalInstance) modalInstance.close();
    }

    function injectStyle() {
        if (document.getElementById('residentTagModalStyle')) return;
        const style = document.createElement('style');
        style.id = 'residentTagModalStyle';
        style.textContent = styleText;
        document.head.appendChild(style);
    }

    function injectModal() {
        if (modalInstance) return;
        if (!window.MobileModal) {
            throw new Error('ResidentTagModal requires components/mobile/mobile-modal.js');
        }
        modalInstance = MobileModal.create({
            id: 'residentTagModal',
            type: 'bottomSheet',
            title: '设置标签',
            className: 'resident-tag-modal-mask',
            content: modalContentHTML,
            rightAction: {
                icon: 'fas fa-xmark',
                close: true,
                ariaLabel: '关闭'
            }
        });
    }

    function bindEvents() {
        const input = document.getElementById('residentTagSearchInput');
        if (!input || input.dataset.bound === 'true') return;
        input.dataset.bound = 'true';
        input.addEventListener('keydown', event => {
            if (event.key !== 'Enter') return;
            event.preventDefault();
            search();
        });
        document.getElementById('residentTagConfirm').addEventListener('click', confirm);
    }

    function search() {
        const keyword = document.getElementById('residentTagSearchInput').value.trim();
        const results = document.getElementById('residentTagResults');
        if (!keyword) {
            renderInitialState();
            return;
        }
        const matchedTags = getAllTags().filter(tag => tag.includes(keyword));
        results.innerHTML = matchedTags.length
            ? matchedTags.map(tag => getTagOptionHTML(tag)).join('')
            : `
                <div class="resident-tag-empty">
                    <div class="resident-tag-helper">未找到“${escapeHTML(keyword)}”</div>
                    <button class="resident-tag-create" type="button" data-create-tag="${escapeHTML(keyword)}">
                        <span>新建标签：${escapeHTML(keyword)}</span>
                    </button>
                </div>
            `;
        bindResultEvents();
    }

    function renderInitialState() {
        const results = document.getElementById('residentTagResults');
        results.innerHTML = getAllTags()
            .map(tag => getTagOptionHTML(tag))
            .join('');
        bindResultEvents();
    }

    function bindResultEvents() {
        document.querySelectorAll('[data-resident-tag]').forEach(button => {
            button.onclick = () => toggle(button.dataset.residentTag);
        });
        document.querySelectorAll('[data-create-tag]').forEach(button => {
            button.onclick = () => {
                selectedTags.add(button.dataset.createTag);
                renderInitialState();
            };
        });
    }

    function toggle(tagName) {
        if (initialTags.has(tagName)) return;
        if (selectedTags.has(tagName)) {
            selectedTags.delete(tagName);
        } else {
            selectedTags.add(tagName);
        }
        renderCurrentResults();
    }

    function confirm() {
        Array.from(selectedTags)
            .filter(tag => !initialTags.has(tag))
            .forEach(tag => config.onAddTag(tag));
        close();
    }

    function renderCurrentResults() {
        const keyword = document.getElementById('residentTagSearchInput').value.trim();
        if (keyword) {
            search();
        } else {
            renderInitialState();
        }
    }

    function getAllTags() {
        return Array.from(new Set([
            ...config.getCurrentTags(),
            ...config.availableTags,
            ...selectedTags
        ]));
    }

    function getTagOptionHTML(tag) {
        const isSelected = selectedTags.has(tag);
        return `
            <button class="resident-tag-option${isSelected ? ' is-selected' : ''}" type="button" data-resident-tag="${escapeHTML(tag)}">
                <span>${escapeHTML(tag)}</span>
            </button>
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

    window.ResidentTagModal = {
        init,
        open,
        close
    };
}());
