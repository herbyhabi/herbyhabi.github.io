(function () {
    const currentScript = document.currentScript;
    const defaultNutritionists = [
        { id: 'dietitian-001', name: '李娜', title: '主管营养师' },
        { id: 'dietitian-002', name: '王敏', title: '营养师' },
        { id: 'dietitian-003', name: '陈晨', title: '高级营养顾问' },
        { id: 'dietitian-004', name: '赵雅', title: '慢病营养师' }
    ];
    const customerStageOptions = ['新客户', '意向客户', '成交客户'];

    const modalContentHTML = `
        <form class="customer-info-form" id="customerInfoForm">
            <div class="customer-info-form__inner" id="customerInfoFormInner"></div>
        </form>
    `;

    const styleText = `
        .customer-info-modal-mask {
            --mobile-modal-sheet-max-height: 88vh;
            --mobile-modal-primary: #2f7af6;
        }
        .customer-info-modal-mask .mobile-modal-panel,
        .customer-info-modal-mask .mobile-modal-header {
            background: #eef2f6;
        }
        .customer-info-modal-mask .mobile-modal-header {
            padding: 10px 16px 8px;
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
            background: #eef2f6;
        }
        .customer-info-form {
            min-height: 100%;
            background: #eef2f6;
            color: #333333;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", sans-serif;
        }
        .customer-info-form__inner {
            display: grid;
            gap: 10px;
            padding: 10px 12px 18px;
        }
        .customer-info-section-body {
            background: #fff;
        }
        .customer-info-section-body .mobile-input-field {
            position: relative;
            border-bottom: 0;
        }
        .customer-info-section-body .mobile-input-field::after {
            content: "";
            position: absolute;
            right: 16px;
            bottom: 0;
            left: 16px;
            height: 1px;
            background: #eef1f5;
            pointer-events: none;
        }
        .customer-info-section-body .mobile-input-field:last-child::after {
            display: none;
        }
        .customer-info-section-body .mobile-input-field__label {
            flex: 0 0 88px;
        }
        .customer-info-form .grouped-info-card {
            overflow: hidden;
            border-color: #edf1f5;
            border-radius: 12px;
        }
        .customer-info-form .grouped-info-card__header {
            padding: 14px 16px 0;
            gap: 10px;
        }
        .customer-info-form .grouped-info-card__title {
            font-size: 16px;
            font-weight: 700;
        }
        .customer-info-form .grouped-info-card__divider {
            border-top-style: solid;
            border-top-color: #eef1f5;
        }
    `;

    let config = {
        getCustomerInfo: () => ({}),
        nutritionists: defaultNutritionists,
        onSave: () => {}
    };
    let modalInstance = null;
    let renderedFields = {};
    let dependencyPromise = null;

    function init(options = {}) {
        config = {
            ...config,
            ...options,
            nutritionists: Array.isArray(options.nutritionists) ? options.nutritionists : config.nutritionists
        };
        injectStyle();
        injectModal();
        bindEvents();
        ensureFormDependencies().then(() => renderForm(config.getCustomerInfo()));
    }

    function open() {
        injectStyle();
        injectModal();
        bindEvents();
        ensureFormDependencies().then(() => {
            renderForm(config.getCustomerInfo());
            modalInstance.open();
            setTimeout(() => {
                const input = document.getElementById('customerNameInput');
                if (input) input.focus();
            }, 80);
        });
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
            title: '编辑信息',
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
    }

    // 动态加载通用分组卡片和通用输入框组件，调用方无需额外维护脚本顺序。
    function ensureFormDependencies() {
        if (dependencyPromise) return dependencyPromise;
        dependencyPromise = Promise.all([
            ensureScript('../components/mobile/grouped-info-card.js', () => window.GroupedInfoCard),
            ensureScript('../components/mobile/input/index.js', () => window.MobileInputComponents)
        ]).then(() => {
            if (window.MobileInputComponents && window.MobileInputComponents.ready) {
                return window.MobileInputComponents.ready;
            }
            return null;
        });
        return dependencyPromise;
    }

    function ensureScript(relativePath, isReady) {
        if (isReady()) return Promise.resolve();
        const src = getScriptSrc(relativePath);
        const existing = Array.from(document.scripts).find(script => script.src === src);
        if (existing) {
            return new Promise((resolve, reject) => {
                existing.addEventListener('load', resolve, { once: true });
                existing.addEventListener('error', reject, { once: true });
            });
        }
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    function getScriptSrc(relativePath) {
        const base = currentScript && currentScript.src ? currentScript.src : window.location.href;
        return new URL(relativePath, base).href;
    }

    // 使用通用分组卡片承载信息分组，并把所有字段交给通用输入框组件渲染。
    function renderForm(info = {}) {
        const root = document.getElementById('customerInfoFormInner');
        if (!root || !window.GroupedInfoCard || !window.TextInput || !window.Textarea || !window.PickerSelect || !window.PhoneInput) return;

        root.innerHTML = '';
        renderedFields = {};

        const basicSection = createSection(root, '基本信息');
        renderedFields.name = createTextField(basicSection, {
            label: '客户姓名',
            placeholder: '请输入',
            value: info.name || '',
            required: true,
            clearable: true
        }, 'customerNameInput');
        renderedFields.remark = createTextField(basicSection, {
            label: '备注名',
            placeholder: '请输入',
            value: info.remark || '',
            clearable: true,
            rows: 3,
            maxLength: 80,
            showCount: true
        });
        renderedFields.stage = createPickerField(basicSection, {
            label: '客户阶段',
            placeholder: '请选择',
            value: info.stage || info.customerStage || '',
            required: true,
            options: customerStageOptions
        });
        renderedFields.responsibleStaff = createPickerField(basicSection, {
            label: '负责人员',
            placeholder: '请选择',
            value: getInitialStaffIds(info),
            multiple: true,
            required: true,
            options: getStaffOptions()
        });

        const contactSection = createSection(root, '联系信息');
        renderedFields.phones = createPhoneField(contactSection, {
            label: '联系号码',
            placeholder: '请输入',
            value: info.phones || [],
            multiple: true,
            addText: '添加联系号码',
            maxCount: 5
        });
        renderedFields.address = createTextField(contactSection, {
            label: '居住地址',
            placeholder: '请输入',
            value: info.address || '',
            clearable: true
        });

        const identitySection = createSection(root, '身份信息');
        renderedFields.idCard = createTextField(identitySection, {
            label: '身份证号',
            placeholder: '请输入',
            value: info.idCard || '',
            clearable: true,
            maxLength: 18
        });
    }

    function createSection(root, title) {
        const card = GroupedInfoCard.create({ title, showDivider: true });
        const body = document.createElement('div');
        body.className = 'customer-info-section-body';
        card.appendChild(body);
        root.appendChild(card);
        return body;
    }

    function createTextField(container, options, inputId) {
        const field = TextInput.render(container, withFieldClass(options));
        if (field && inputId && field.input) field.input.id = inputId;
        return field;
    }

    function createTextareaField(container, options) {
        return Textarea.render(container, withFieldClass(options));
    }

    function createPickerField(container, options) {
        return PickerSelect.render(container, withFieldClass(options));
    }

    function createPhoneField(container, options) {
        return PhoneInput.render(container, withFieldClass(options, 'customer-info-field--phone'));
    }

    function withFieldClass(options, extraClass = '') {
        return {
            ...options,
            className: ['customer-info-field', extraClass, options.className].filter(Boolean).join(' ')
        };
    }

    function getInitialStaffIds(info = {}) {
        if (Array.isArray(info.responsibleStaffIds)) return info.responsibleStaffIds;
        if (info.responsibleStaffId) return [info.responsibleStaffId];
        const staffList = Array.isArray(info.responsibleStaff) ? info.responsibleStaff : [];
        return staffList.map(staff => staff.id).filter(Boolean);
    }

    function getStaffOptions() {
        return config.nutritionists.map(staff => ({
            label: staff.title ? `${staff.name}（${staff.title}）` : staff.name,
            value: staff.id
        }));
    }

    function save() {
        const payload = collectPayload();
        if (!payload.name) {
            notify('请输入客户姓名');
            return;
        }
        if (!payload.stage) {
            notify('请选择客户阶段');
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
        const stage = getFieldValue('stage');
        return {
            name: getFieldValue('name').trim(),
            remark: getFieldValue('remark').trim(),
            stage,
            customerStage: stage,
            phones: getPhoneValues(),
            address: getFieldValue('address').trim(),
            idCard: getFieldValue('idCard').trim(),
            responsibleStaff: getSelectedStaff()
        };
    }

    function getFieldValue(key) {
        const field = renderedFields[key];
        if (!field) return '';
        if (field.input) return String(field.input.value || '');
        return String(field.value || '');
    }

    function getPhoneValues() {
        const field = renderedFields.phones;
        if (!field) return [];
        if (Array.isArray(field.value)) return field.value.filter(Boolean);
        return String(field.value || '').split(',').map(item => item.trim()).filter(Boolean);
    }

    function getSelectedStaff() {
        const selectedValue = renderedFields.responsibleStaff ? renderedFields.responsibleStaff.value : '';
        const selectedIds = (Array.isArray(selectedValue) ? selectedValue : [selectedValue])
            .map(item => String(item || ''))
            .filter(Boolean);
        if (!selectedIds.length) return [];
        return config.nutritionists.filter(staff => selectedIds.includes(String(staff.id)));
    }

    function notify(message) {
        if (typeof window.showToast === 'function') {
            window.showToast(message);
            return;
        }
        window.alert(message);
    }

    window.CustomerInfoModal = {
        init,
        open,
        close
    };
}());
