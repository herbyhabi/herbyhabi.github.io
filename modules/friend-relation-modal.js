(function () {
    const defaultEmployees = [];
    const defaultGroups = [];

    const modalContentHTML = `
        <div class="-mx-4 -mb-4 bg-[#F8FAFC] px-4 pb-4">
            <mobile-tabs id="friendRelationTabs"></mobile-tabs>
            <div class="friend-relation-summary mt-2 mb-2 text-xs leading-5 text-[#86909C]" id="friendRelationSummary"></div>
            <div class="friend-relation-list -mx-4 border-y border-[#E5E6EB] bg-white" id="friendRelationList"></div>
        </div>
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
        injectModal();
        bindEvents();
    }

    function open() {
        injectModal();
        bindEvents();
        modalInstance.open();
        render();
    }

    function close() {
        if (modalInstance) modalInstance.close();
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
            : `<div class="friend-relation-empty bg-white px-4 py-8 text-center text-xs leading-5 text-[#86909C]">暂无${isGroupTab ? '所在群聊' : '企业员工'}</div>`;
    }

    function getEmployeeItemHTML(employee) {
        return `
            <div class="friend-relation-item employee flex min-h-[72px] items-center gap-3 bg-white pl-4 transition-colors active:bg-[#F2F3F5] last:[&_.friend-relation-info]:border-b-0">
                <div class="friend-relation-avatar flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#EAF3FF] text-lg text-[#2F6BFF]"><i class="fas fa-user-tie"></i></div>
                <div class="friend-relation-info flex min-w-0 flex-1 self-stretch border-b border-[#ECEEF2] py-3 pr-4">
                    <div class="min-w-0 flex-1 self-center">
                        <div class="friend-relation-head mb-1 flex items-center justify-between gap-2">
                        <span class="friend-relation-title min-w-0 truncate text-sm font-medium leading-5 text-[#1D2129]">${escapeHTML(employee.name || '--')}</span>
                        ${employee.ownerTag ? `<span class="friend-relation-tag inline-flex min-h-5 max-w-[76px] shrink-0 items-center justify-center truncate rounded-full bg-[#FFF7ED] px-2 py-0.5 text-[11px] font-medium leading-none text-[#FF8A34]">${escapeHTML(employee.ownerTag)}</span>` : ''}
                        </div>
                        <div class="friend-relation-bottom flex items-center justify-between gap-2">
                            <span class="friend-relation-desc min-w-0 truncate text-xs leading-4 text-[#86909C]">添加时间：${escapeHTML(employee.addedAt || '--')}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    function getGroupItemHTML(group) {
        const memberCount = group.memberCount || 0;
        return `
            <div class="friend-relation-item flex min-h-[72px] items-center gap-3 bg-white pl-4 transition-colors active:bg-[#F2F3F5] last:[&_.friend-relation-info]:border-b-0">
                <div class="friend-relation-avatar group flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#E8F8EF] text-lg text-[#07C160]"><i class="fas fa-user-group"></i></div>
                <div class="friend-relation-info flex min-w-0 flex-1 self-stretch border-b border-[#ECEEF2] py-3 pr-4">
                    <div class="min-w-0 flex-1 self-center">
                        <div class="friend-relation-head mb-1 flex items-center justify-between gap-2">
                            <span class="friend-relation-title min-w-0 truncate text-sm font-medium leading-5 text-[#1D2129]">${escapeHTML(group.name || '--')}</span>
                            <span class="shrink-0 text-xs leading-4 text-[#86909C]">${escapeHTML(memberCount)}人</span>
                        </div>
                        <div class="friend-relation-bottom flex items-center justify-between gap-2">
                            <span class="friend-relation-desc min-w-0 truncate text-xs leading-4 text-[#86909C]">加入时间：${escapeHTML(group.joinedAt || '--')}</span>
                        </div>
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
