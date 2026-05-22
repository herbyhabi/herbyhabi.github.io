(function () {
    const defaultEmployees = [];
    const defaultGroups = [];

    const modalContentHTML = `
        <mobile-tabs id="friendRelationTabs"></mobile-tabs>
        <div class="friend-relation-summary" id="friendRelationSummary"></div>
        <div class="friend-relation-list" id="friendRelationList"></div>
    `;

    const styleText = `
        .friend-relation-modal-mask {
            --mobile-modal-sheet-max-height: 78vh;
        }
        .friend-relation-modal-mask .mobile-modal-panel {
            background: #f6f8fb;
        }
        .friend-relation-modal-mask .mobile-modal-header {
            padding-top: 12px;
            background: #f6f8fb;
        }
        .friend-relation-modal-mask .mobile-modal-body {
            padding-top: 8px;
        }
        .friend-relation-summary {
            margin: 10px 2px 8px;
            color: #666666;
            font-size: 12px;
            line-height: 1.5;
        }
        .friend-relation-list {
            overflow: hidden;
            border: 1px solid #edf1f5;
            border-radius: 12px;
            background: #ffffff;
            box-shadow: 0 6px 16px rgba(68, 84, 104, 0.04);
        }
        .friend-relation-item {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 14px;
            border-bottom: 1px solid #edf1f5;
            background: #ffffff;
        }
        .friend-relation-item:last-child {
            border-bottom: 0;
        }
        .friend-relation-avatar {
            flex: 0 0 auto;
            width: 44px;
            height: 44px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            background: #eaf3ff;
            color: #2f7af6;
            font-size: 18px;
        }
        .friend-relation-avatar.group {
            background: #eafaf2;
            color: #13b66b;
        }
        .friend-relation-info {
            flex: 1;
            min-width: 0;
        }
        .friend-relation-head {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 8px;
            margin-bottom: 4px;
        }
        .friend-relation-title {
            min-width: 0;
            color: #333333;
            font-size: 15px;
            font-weight: 500;
            line-height: 1.35;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        .friend-relation-bottom {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 8px;
        }
        .friend-relation-desc {
            min-width: 0;
            color: #999999;
            font-size: 12px;
            line-height: 1.35;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        .friend-relation-tag {
            flex: 0 0 auto;
            min-height: 20px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 2px 7px;
            border-radius: 999px;
            background: #fff4e2;
            color: #ff8a00;
            font-size: 11px;
            font-weight: 700;
            line-height: 1;
            white-space: nowrap;
        }
        .friend-relation-item.employee .friend-relation-tag {
            align-self: center;
            max-width: 76px;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .friend-relation-empty {
            padding: 34px 12px;
            color: #999999;
            font-size: 13px;
            text-align: center;
            background: #ffffff;
        }
    `;

    let config = {
        employees: defaultEmployees,
        groups: defaultGroups
    };
    let currentTab = 'employees';
    let modalInstance = null;

    function init(options = {}) {
        config = {
            ...config,
            ...options,
            employees: Array.isArray(options.employees) ? options.employees : config.employees,
            groups: Array.isArray(options.groups) ? options.groups : config.groups
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
        render();
    }

    function close() {
        if (modalInstance) modalInstance.close();
    }

    function injectStyle() {
        if (document.getElementById('friendRelationModalStyle')) return;
        const style = document.createElement('style');
        style.id = 'friendRelationModalStyle';
        style.textContent = styleText;
        document.head.appendChild(style);
    }

    function injectModal() {
        if (modalInstance) return;
        if (!window.MobileModal) {
            throw new Error('FriendRelationModal requires components/mobile/mobile-modal.js');
        }
        if (!customElements.get('mobile-tabs')) {
            throw new Error('FriendRelationModal requires components/mobile/mobile-tabs.js');
        }
        modalInstance = MobileModal.create({
            id: 'friendRelationModal',
            type: 'bottomSheet',
            title: '好友关系',
            className: 'friend-relation-modal-mask',
            content: modalContentHTML,
            rightAction: {
                icon: 'fas fa-xmark',
                close: true,
                ariaLabel: '关闭'
            }
        });
    }

    function bindEvents() {
        const tabs = document.getElementById('friendRelationTabs');
        if (!tabs || tabs.dataset.bound === 'true') return;
        tabs.dataset.bound = 'true';
        tabs.addEventListener('change', event => {
            currentTab = event.detail.value === 'groups' ? 'groups' : 'employees';
            renderList();
        });
    }

    // 渲染好友关系页签及当前列表，作为运营健康画像中的独立业务模块
    function render() {
        const tabs = document.getElementById('friendRelationTabs');
        if (!tabs) return;
        tabs.tabs = [
            { label: '企业员工', value: 'employees'},
            { label: '所在群聊', value: 'groups'}
        ];
        tabs.value = currentTab;
        renderList();
    }

    function renderList() {
        const summary = document.getElementById('friendRelationSummary');
        const list = document.getElementById('friendRelationList');
        if (!summary || !list) return;

        const isGroupTab = currentTab === 'groups';
        const data = isGroupTab ? config.groups : config.employees;
        summary.textContent = isGroupTab
            ? `共加入 ${data.length} 个客户群聊`
            : `共添加 ${data.length} 位企业员工`;
        list.innerHTML = data.length
            ? data.map(item => isGroupTab ? getGroupItemHTML(item) : getEmployeeItemHTML(item)).join('')
            : `<div class="friend-relation-empty">暂无${isGroupTab ? '所在群聊' : '企业员工'}</div>`;
    }

    function getEmployeeItemHTML(employee) {
        return `
            <div class="friend-relation-item employee">
                <div class="friend-relation-avatar"><i class="fas fa-user-tie"></i></div>
                <div class="friend-relation-info">
                    <div class="friend-relation-head">
                        <span class="friend-relation-title">${escapeHTML(employee.name || '--')}</span>
                    </div>
                    <div class="friend-relation-bottom">
                        <span class="friend-relation-desc">添加时间：${escapeHTML(employee.addedAt || '--')}</span>
                    </div>
                </div>
                ${employee.ownerTag ? `<span class="friend-relation-tag">${escapeHTML(employee.ownerTag)}</span>` : ''}
            </div>
        `;
    }

    function getGroupItemHTML(group) {
        const memberCount = group.memberCount || 0;
        return `
            <div class="friend-relation-item">
                <div class="friend-relation-avatar group"><i class="fas fa-user-group"></i></div>
                <div class="friend-relation-info">
                    <div class="friend-relation-head">
                        <span class="friend-relation-title">${escapeHTML(group.name || '--')}（${escapeHTML(memberCount)}人）</span>
                    </div>
                    <div class="friend-relation-bottom">
                        <span class="friend-relation-desc">加入时间：${escapeHTML(group.joinedAt || '--')}</span>
                    </div>
                </div>
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

    window.FriendRelationModal = {
        init,
        open,
        close
    };
}());
