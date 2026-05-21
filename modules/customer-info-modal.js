(function () {
    const defaultNutritionists = [
        { id: 'dietitian-001', name: '李娜', title: '主管营养师' },
        { id: 'dietitian-002', name: '王敏', title: '营养师' },
        { id: 'dietitian-003', name: '陈晨', title: '高级营养顾问' },
        { id: 'dietitian-004', name: '赵雅', title: '慢病营养师' }
    ];

    const modalContentHTML = `
        <form class="customer-info-form" id="customerInfoForm">
            <div class="customer-info-field">
                <label class="customer-info-label" for="customerNameInput">客户姓名<span class="required-star">*</span></label>
                <input id="customerNameInput" class="customer-info-input" type="text" placeholder="请输入客户姓名" autocomplete="off">
            </div>
            <div class="customer-info-field">
                <label class="customer-info-label" for="customerRemarkInput">客户备注</label>
                <input id="customerRemarkInput" class="customer-info-input" type="text" placeholder="请输入客户备注" autocomplete="off">
            </div>
            <div class="customer-info-phone-block">
                <div class="customer-info-label">联系号码</div>
                <div class="customer-info-phone-list" id="customerPhoneList"></div>
                <button class="customer-info-add-phone" type="button" id="customerAddPhone">
                    <span class="customer-info-add-icon"><i class="fas fa-plus"></i></span>
                    <span>添加电话号码</span>
                </button>
            </div>
            <div class="customer-info-field">
                <label class="customer-info-label" for="customerAddressInput">居住地址</label>
                <input id="customerAddressInput" class="customer-info-input" type="text" placeholder="请输入居住地址" autocomplete="off">
            </div>
            <div class="customer-info-field">
                <label class="customer-info-label" for="customerIdCardInput">证件号码</label>
                <input id="customerIdCardInput" class="customer-info-input" type="text" placeholder="请输入证件号码" autocomplete="off">
            </div>
            <div class="customer-info-staff-picker">
                <label class="customer-info-label" for="customerStaffSearch">负责人员<span class="required-star">*</span></label>
                <div class="customer-info-search">
                    <i class="fas fa-search"></i>
                    <input id="customerStaffSearch" type="search" placeholder="搜索营养师" autocomplete="off">
                </div>
                <div class="customer-info-staff-list" id="customerStaffList"></div>
                <div class="customer-info-selected" id="customerSelectedStaff"></div>
            </div>
        </form>
    `;

    const styleText = `
        .customer-info-modal-mask {
            --mobile-modal-sheet-max-height: 88vh;
            --mobile-modal-primary: #2f7af6;
        }
        .customer-info-modal-mask .mobile-modal-panel {
            background: #eef2f6;
        }
        .customer-info-modal-mask .mobile-modal-header {
            padding: 10px 16px 8px;
            background: #eef2f6;
        }
        .customer-info-modal-mask .mobile-modal-title {
            font-size: 16px;
            font-weight: 700;
        }
        .customer-info-modal-mask .mobile-modal-action {
            font-size: 14px;
        }
        .customer-info-modal-mask .mobile-modal-action i {
            font-size: 14px;
        }
        .customer-info-modal-mask .mobile-modal-body {
            padding: 0;
        }
        .customer-info-form {
            background: #fff;
            color: #333333;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", sans-serif;
        }
        .customer-info-field,
        .customer-info-phone-block,
        .customer-info-staff-picker {
            padding: 12px 16px;
            background: #fff;
            border-bottom: 1px solid #eef1f5;
        }
        .customer-info-label {
            display: block;
            margin-bottom: 8px;
            color: #666666;
            font-size: 13px;
            font-weight: 700;
        }
        .customer-info-label .required-star {
            margin-left: 3px;
            color: #f53f3f;
            font-size: 13px;
            font-weight: 800;
        }
        .customer-info-input {
            width: 100%;
            min-height: 40px;
            border: 0;
            outline: none;
            background: #fff;
            color: #333333;
            font-size: 15px;
            line-height: 1.4;
        }
        .customer-info-input::placeholder,
        .customer-info-search input::placeholder {
            color: #c7ccd3;
        }
        .customer-info-phone-list {
            display: grid;
            gap: 0;
        }
        .customer-info-phone-row {
            display: grid;
            grid-template-columns: 32px minmax(0, 1fr);
            align-items: center;
            gap: 12px;
            min-height: 54px;
        }
        .customer-info-phone-row + .customer-info-phone-row {
            border-top: 1px solid #eef1f5;
        }
        .customer-info-phone-remove,
        .customer-info-add-icon {
            width: 24px;
            height: 24px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            border: 0;
            border-radius: 50%;
            color: #fff;
            font-size: 12px;
        }
        .customer-info-phone-remove {
            background: #ff3b4f;
            cursor: pointer;
        }
        .customer-info-phone-input {
            width: 100%;
            min-height: 52px;
            border: 0;
            outline: none;
            color: #333333;
            font-size: 15px;
        }
        .customer-info-add-phone {
            min-height: 42px;
            display: inline-flex;
            align-items: center;
            gap: 12px;
            border: 0;
            background: transparent;
            color: #b8bec7;
            font-size: 15px;
            cursor: pointer;
        }
        .customer-info-add-icon {
            background: #2fd06f;
            font-size: 12px;
        }
        .customer-info-search {
            min-height: 40px;
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 0;
            border: 0;
            background: #fff;
            color: #999999;
        }
        .customer-info-search i {
            flex: 0 0 auto;
            font-size: 14px;
        }
        .customer-info-search input {
            flex: 1;
            min-width: 0;
            border: 0;
            outline: none;
            background: transparent;
            color: #333333;
            font-size: 15px;
        }
        .customer-info-selected {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-top: 8px;
        }
        .customer-info-selected:empty {
            display: none;
        }
        .customer-info-staff-chip {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            max-width: 100%;
            min-height: 30px;
            padding: 0 10px;
            border-radius: 999px;
            background: #eaf3ff;
            color: #2f7af6;
            font-size: 12px;
            font-weight: 700;
        }
        .customer-info-staff-chip span {
            min-width: 0;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        .customer-info-staff-chip button {
            border: 0;
            background: transparent;
            color: #2f7af6;
            font-size: 11px;
            cursor: pointer;
        }
        .customer-info-staff-list {
            display: none;
            gap: 8px;
            margin-top: 8px;
            padding: 8px;
            border: 1px solid #edf1f5;
            border-radius: 10px;
            background: #fff;
            box-shadow: 0 8px 20px rgba(60, 101, 145, 0.1);
        }
        .customer-info-staff-list:not(:empty) {
            display: grid;
        }
        .customer-info-staff-option {
            width: 100%;
            min-height: 40px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            padding: 8px 10px;
            border: 0;
            border-radius: 8px;
            background: #fff;
            color: #333333;
            text-align: left;
            cursor: pointer;
        }
        .customer-info-staff-option.is-selected {
            background: #f4f8ff;
            color: #2f7af6;
        }
        .customer-info-staff-option i {
            font-size: 14px;
        }
        .customer-info-staff-main {
            min-width: 0;
        }
        .customer-info-staff-name {
            font-size: 14px;
            font-weight: 700;
        }
        .customer-info-staff-title {
            display: block;
            margin-top: 3px;
            color: #999999;
            font-size: 12px;
        }
        .customer-info-empty {
            padding: 14px 12px;
            border-radius: 8px;
            background: #f8fbff;
            color: #999999;
            font-size: 12px;
            text-align: center;
        }
    `;

    let config = {
        getCustomerInfo: () => ({}),
        nutritionists: defaultNutritionists,
        onSave: () => {}
    };
    let modalInstance = null;
    let selectedStaffIds = new Set();

    function init(options = {}) {
        config = {
            ...config,
            ...options,
            nutritionists: Array.isArray(options.nutritionists) ? options.nutritionists : config.nutritionists
        };
        injectStyle();
        injectModal();
        bindEvents();
    }

    function open() {
        injectStyle();
        injectModal();
        bindEvents();
        fillForm(config.getCustomerInfo());
        modalInstance.open();
        setTimeout(() => {
            const input = document.getElementById('customerNameInput');
            if (input) input.focus();
        }, 80);
    }

    function close() {
        if (modalInstance) modalInstance.close();
    }

    function injectStyle() {
        if (document.getElementById('customerInfoModalStyle')) return;
        const style = document.createElement('style');
        style.id = 'customerInfoModalStyle';
        style.textContent = styleText;
        document.head.appendChild(style);
    }

    function injectModal() {
        if (modalInstance) return;
        if (!window.MobileModal) {
            throw new Error('CustomerInfoModal requires components/mobile/mobile-modal.js');
        }
        modalInstance = MobileModal.create({
            id: 'customerInfoModal',
            type: 'bottomSheet',
            title: '修改客户信息',
            className: 'customer-info-modal-mask',
            content: modalContentHTML,
            leftAction: {
                text: '取消',
                close: true
            },
            rightAction: {
                text: '保存',
                primary: true,
                onClick: save
            }
        });
    }

    function bindEvents() {
        const form = document.getElementById('customerInfoForm');
        if (!form || form.dataset.bound === 'true') return;
        form.dataset.bound = 'true';
        form.addEventListener('submit', event => {
            event.preventDefault();
            save();
        });
        document.getElementById('customerAddPhone').addEventListener('click', () => {
            addPhoneInput('');
        });
        document.getElementById('customerStaffSearch').addEventListener('input', renderStaffList);
    }

    // 回填客户资料，并重建手机号和负责人选择状态
    function fillForm(info = {}) {
        document.getElementById('customerNameInput').value = info.name || '';
        document.getElementById('customerRemarkInput').value = info.remark || '';
        document.getElementById('customerAddressInput').value = info.address || '';
        document.getElementById('customerIdCardInput').value = info.idCard || '';
        document.getElementById('customerStaffSearch').value = '';

        selectedStaffIds = new Set((info.responsibleStaff || []).map(item => item.id));
        renderPhoneList(info.phones || []);
        renderSelectedStaff();
        clearStaffList();
    }

    function renderPhoneList(phones) {
        const list = document.getElementById('customerPhoneList');
        list.innerHTML = '';
        const values = phones.length ? phones : [''];
        values.forEach(phone => addPhoneInput(phone));
    }

    function addPhoneInput(value) {
        const list = document.getElementById('customerPhoneList');
        const row = document.createElement('div');
        row.className = 'customer-info-phone-row';
        row.innerHTML = `
            <button class="customer-info-phone-remove" type="button" aria-label="删除电话号码">
                <i class="fas fa-minus"></i>
            </button>
            <input class="customer-info-phone-input" type="tel" placeholder="请输入电话号码" value="${escapeAttribute(value || '')}">
        `;
        row.querySelector('.customer-info-phone-remove').onclick = () => {
            row.remove();
            if (!list.querySelector('.customer-info-phone-row')) addPhoneInput('');
        };
        list.appendChild(row);
    }

    function renderSelectedStaff() {
        const selected = document.getElementById('customerSelectedStaff');
        const staffList = getSelectedStaff();
        selected.innerHTML = staffList.map(staff => `
            <span class="customer-info-staff-chip">
                <span>${escapeHTML(staff.name)}</span>
                <button type="button" data-remove-staff="${escapeAttribute(staff.id)}" aria-label="移除${escapeAttribute(staff.name)}">
                    <i class="fas fa-xmark"></i>
                </button>
            </span>
        `).join('');
        selected.querySelectorAll('[data-remove-staff]').forEach(button => {
            button.onclick = () => {
                selectedStaffIds.delete(button.dataset.removeStaff);
                renderSelectedStaff();
                renderStaffList();
            };
        });
    }

    function renderStaffList() {
        const keyword = normalizeText(document.getElementById('customerStaffSearch').value);
        const list = document.getElementById('customerStaffList');
        if (!keyword) {
            clearStaffList();
            return;
        }
        const matchedStaff = config.nutritionists.filter(staff => {
            const text = normalizeText(`${staff.name} ${staff.title || ''}`);
            return text.includes(keyword);
        });
        list.innerHTML = matchedStaff.length ? matchedStaff.map(staff => `
            <button class="customer-info-staff-option${selectedStaffIds.has(staff.id) ? ' is-selected' : ''}" type="button" data-staff-id="${escapeAttribute(staff.id)}">
                <span class="customer-info-staff-main">
                    <span class="customer-info-staff-name">${escapeHTML(staff.name)}</span>
                    <span class="customer-info-staff-title">${escapeHTML(staff.title || '营养师')}</span>
                </span>
                <i class="fas ${selectedStaffIds.has(staff.id) ? 'fa-check-circle' : 'fa-circle'}"></i>
            </button>
        `).join('') : '<div class="customer-info-empty">暂无匹配营养师</div>';
        list.querySelectorAll('[data-staff-id]').forEach(button => {
            button.onclick = () => toggleStaff(button.dataset.staffId);
        });
    }

    function clearStaffList() {
        const list = document.getElementById('customerStaffList');
        if (list) list.innerHTML = '';
    }

    function toggleStaff(staffId) {
        if (selectedStaffIds.has(staffId)) {
            selectedStaffIds.delete(staffId);
        } else {
            selectedStaffIds.add(staffId);
        }
        renderSelectedStaff();
        document.getElementById('customerStaffSearch').value = '';
        clearStaffList();
    }

    function save() {
        const payload = collectPayload();
        if (!payload.name) {
            notify('请输入客户姓名');
            return;
        }
        if (!payload.responsibleStaff.length) {
            notify('请选择负责人员');
            return;
        }
        config.onSave(payload);
        close();
    }

    function collectPayload() {
        return {
            name: document.getElementById('customerNameInput').value.trim(),
            remark: document.getElementById('customerRemarkInput').value.trim(),
            phones: Array.from(document.querySelectorAll('.customer-info-phone-input'))
                .map(input => input.value.trim())
                .filter(Boolean),
            address: document.getElementById('customerAddressInput').value.trim(),
            idCard: document.getElementById('customerIdCardInput').value.trim(),
            responsibleStaff: getSelectedStaff()
        };
    }

    function getSelectedStaff() {
        return config.nutritionists.filter(staff => selectedStaffIds.has(staff.id));
    }

    function notify(message) {
        if (typeof window.showToast === 'function') {
            window.showToast(message);
            return;
        }
        window.alert(message);
    }

    function normalizeText(value) {
        return String(value || '').trim().toLowerCase();
    }

    function escapeHTML(value) {
        return String(value || '').replace(/[&<>"']/g, char => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        }[char]));
    }

    function escapeAttribute(value) {
        return escapeHTML(value).replace(/`/g, '&#96;');
    }

    window.CustomerInfoModal = {
        init,
        open,
        close
    };
}());
