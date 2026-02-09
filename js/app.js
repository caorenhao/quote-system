/**
 * 应用程序主逻辑
 */
document.addEventListener('DOMContentLoaded', () => {
    // 页面元素缓存
    const elements = {
        // 登录相关
        loginModal: document.getElementById('login-modal'),
        loginButton: document.getElementById('login-button'),
        closeLoginModal: document.getElementById('close-login-modal'),
        submitLogin: document.getElementById('submit-login'),
        loginUsername: document.getElementById('login-username'),
        loginPassword: document.getElementById('login-password'),
        
        // 导航栏和用户菜单
        authButtons: document.getElementById('auth-buttons'),
        userMenu: document.getElementById('user-menu'),
        userName: document.getElementById('user-name'),
        userDropdownButton: document.getElementById('user-dropdown-button'),
        userDropdown: document.getElementById('user-dropdown'),
        adminLink: document.getElementById('admin-link'),
        calculatorLink: document.getElementById('calculator-link'),
        logoutButton: document.getElementById('logout-button'),
        
        // 页面容器
        adminPage: document.getElementById('admin-page'),
        loginPage: document.getElementById('login-page'),
        calculatorPage: document.getElementById('calculator-page'),
        
        // 管理员页面表单
        formulaBase: document.getElementById('formula-base'),
        formulaFee: document.getElementById('formula-fee'),
        formulaPercentage: document.getElementById('formula-percentage'),
        hiddenCoefficient: document.getElementById('hidden-coefficient'),
        saveSettings: document.getElementById('save-settings'),
        
        // 用户管理相关
        adminUsersList: document.getElementById('admin-users-list'),
        userUsersList: document.getElementById('user-users-list'),
        newUserRole: document.getElementById('new-user-role'),
        newUserUsername: document.getElementById('new-user-username'),
        newUserPassword: document.getElementById('new-user-password'),
        addUserButton: document.getElementById('add-user-button'),
        updateUserRole: document.getElementById('update-user-role'),
        updateUserUsername: document.getElementById('update-user-username'),
        updateUserPassword: document.getElementById('update-user-password'),
        updatePasswordButton: document.getElementById('update-password-button'),
        
        // 待登录页面
        loginPageButton: document.getElementById('login-page-button'),
        
        // 计算器页面
        inputPrice: document.getElementById('input-price'),
        calculateButton: document.getElementById('calculate-button'),
        resultSection: document.getElementById('result-section'),
        resultBase: document.getElementById('result-base'),
        resultFinal: document.getElementById('result-final')
    };

    /**
     * 应用程序核心逻辑对象
     */
    const app = {
        /**
         * 初始化应用
         */
        init() {
            this.loadSettingsToForm();
            this.checkLoginStatus();
            this.bindEvents();
        },

        /**
         * 加载设置到管理员表单
         */
        loadSettingsToForm() {
            const settings = storage.getSettings();
            if (elements.formulaBase) elements.formulaBase.value = settings.formula.base;
            if (elements.formulaFee) elements.formulaFee.value = settings.formula.fee;
            if (elements.formulaPercentage) elements.formulaPercentage.value = settings.formula.percentage;
            if (elements.hiddenCoefficient) elements.hiddenCoefficient.value = settings.hiddenCoefficient;
        },

        /**
         * 检查登录状态并更新 UI
         */
        checkLoginStatus() {
            const user = storage.getUser();
            
            if (user) {
                // 已登录状态
                this.updateUIForLoggedInUser(user);
            } else {
                // 未登录状态
                this.updateUIForGuest();
            }
        },

        /**
         * 为已登录用户更新 UI
         * @param {string} role 用户角色
         */
        updateUIForLoggedInUser(role) {
            elements.authButtons.classList.add('hidden');
            elements.userMenu.classList.remove('hidden');
            elements.userName.textContent = role === 'admin' ? '管理员' : '使用者';
            
            // 根据角色显示/隐藏菜单项
            if (role === 'admin') {
                elements.adminLink.classList.remove('hidden');
            } else {
                elements.adminLink.classList.add('hidden');
            }
            
            // 默认显示计算页面，隐藏其他
            elements.loginPage.classList.add('hidden');
            elements.adminPage.classList.add('hidden');
            elements.calculatorPage.classList.remove('hidden');
        },

        /**
         * 为未登录访客更新 UI
         */
        updateUIForGuest() {
            elements.authButtons.classList.remove('hidden');
            elements.userMenu.classList.add('hidden');
            
            // 显示待登录页面，隐藏其他
            elements.loginPage.classList.remove('hidden');
            elements.adminPage.classList.add('hidden');
            elements.calculatorPage.classList.add('hidden');
        },

        /**
         * 绑定所有事件监听器
         */
        bindEvents() {
            // 登录相关
            if (elements.loginButton) {
                elements.loginButton.addEventListener('click', () => this.showLoginModal());
            }
            if (elements.loginPageButton) {
                elements.loginPageButton.addEventListener('click', () => this.showLoginModal());
            }
            if (elements.closeLoginModal) {
                elements.closeLoginModal.addEventListener('click', () => this.hideLoginModal());
            }
            if (elements.loginModal) {
                elements.loginModal.addEventListener('click', (e) => {
                    if (e.target === elements.loginModal) this.hideLoginModal();
                });
            }
            if (elements.submitLogin) {
                elements.submitLogin.addEventListener('click', () => this.handleLogin());
            }

            // 用户菜单
            if (elements.userDropdownButton) {
                elements.userDropdownButton.addEventListener('click', (e) => {
                    e.stopPropagation();
                    elements.userDropdown.classList.toggle('hidden');
                });
            }
            document.addEventListener('click', (e) => {
                if (elements.userMenu && !elements.userMenu.contains(e.target)) {
                    elements.userDropdown.classList.add('hidden');
                }
            });

            // 导航链接
            if (elements.adminLink) {
                elements.adminLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.showAdminPage();
                });
            }
            if (elements.calculatorLink) {
                elements.calculatorLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.showCalculatorPage();
                });
            }
            if (elements.logoutButton) {
                elements.logoutButton.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.handleLogout();
                });
            }

            // 管理员设置
            if (elements.saveSettings) {
                elements.saveSettings.addEventListener('click', () => this.saveSettings());
            }
            
            // 用户管理
            if (elements.addUserButton) {
                elements.addUserButton.addEventListener('click', () => this.handleAddUser());
            }
            if (elements.updatePasswordButton) {
                elements.updatePasswordButton.addEventListener('click', () => this.handleUpdatePassword());
            }

            // 报价计算
            if (elements.calculateButton) {
                elements.calculateButton.addEventListener('click', () => this.calculateQuote());
            }
            
            // 监听键盘事件，支持回车登录
            if (elements.loginPassword) {
                elements.loginPassword.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') this.handleLogin();
                });
            }
        },

        // --- 交互处理方法 ---

        showLoginModal() {
            elements.loginModal.classList.remove('hidden');
            elements.loginUsername.focus();
        },

        hideLoginModal() {
            elements.loginModal.classList.add('hidden');
        },

        handleLogin() {
            const username = elements.loginUsername.value.trim();
            const password = elements.loginPassword.value;
            const roleRadio = document.querySelector('input[name="role"]:checked');
            
            if (!roleRadio) return;
            const role = roleRadio.value;
            
            if (!username || !password) {
                alert('请输入用户名和密码');
                return;
            }

            const users = storage.getUsers();
            const validUser = users[role]?.find(u => u.username === username && u.password === password);
            
            if (validUser) {
                storage.saveUser(role);
                this.hideLoginModal();
                this.checkLoginStatus();
                
                // 清空表单
                elements.loginUsername.value = '';
                elements.loginPassword.value = '';
            } else {
                alert('账号或密码错误，请检查后重试');
            }
        },

        handleLogout() {
            storage.clearUser();
            this.checkLoginStatus();
            elements.userDropdown.classList.add('hidden');
        },

        showAdminPage() {
            elements.adminPage.classList.remove('hidden');
            elements.calculatorPage.classList.add('hidden');
            elements.userDropdown.classList.add('hidden');
            this.displayUsersList(); // 刷新用户列表
        },

        showCalculatorPage() {
            elements.adminPage.classList.add('hidden');
            elements.calculatorPage.classList.remove('hidden');
            elements.userDropdown.classList.add('hidden');
        },

        saveSettings() {
            const settings = {
                formula: {
                    base: parseFloat(elements.formulaBase.value) || 1.0,
                    fee: parseFloat(elements.formulaFee.value) || 0,
                    percentage: parseFloat(elements.formulaPercentage.value) || 0
                },
                hiddenCoefficient: parseFloat(elements.hiddenCoefficient.value) || 1.0
            };
            
            storage.saveSettings(settings);
            alert('设置保存成功！');
        },

        // --- 用户管理逻辑 ---

        displayUsersList() {
            const users = storage.getUsers();
            
            // 渲染管理员列表
            this.renderUserList(elements.adminUsersList, users.admin, '管理员');
            // 渲染使用者列表
            this.renderUserList(elements.userUsersList, users.user, '使用者');
        },

        renderUserList(container, userList, roleName) {
            container.innerHTML = '';
            if (userList && userList.length > 0) {
                userList.forEach(user => {
                    const div = document.createElement('div');
                    div.className = 'flex justify-between items-center bg-white p-3 rounded border border-gray-200 hover:bg-gray-50 transition-colors';
                    div.innerHTML = `
                        <span class="font-medium text-gray-700">${user.username}</span>
                        <span class="text-xs px-2 py-1 bg-gray-100 text-gray-500 rounded">${roleName}</span>
                    `;
                    container.appendChild(div);
                });
            } else {
                container.innerHTML = `<div class="text-gray-400 text-sm text-center py-2">暂无${roleName}</div>`;
            }
        },

        handleAddUser() {
            const role = elements.newUserRole.value;
            const username = elements.newUserUsername.value.trim();
            const password = elements.newUserPassword.value;
            
            if (!username || !password) {
                alert('请填写完整的用户信息');
                return;
            }
            
            if (storage.addUser(role, username, password)) {
                elements.newUserUsername.value = '';
                elements.newUserPassword.value = '';
                this.displayUsersList();
                alert('用户添加成功！');
            } else {
                alert('该用户名已存在，请使用其他用户名');
            }
        },

        handleUpdatePassword() {
            const role = elements.updateUserRole.value;
            const username = elements.updateUserUsername.value.trim();
            const newPassword = elements.updateUserPassword.value;
            
            if (!username || !newPassword) {
                alert('请填写完整的用户信息');
                return;
            }
            
            if (storage.updateUserPassword(role, username, newPassword)) {
                elements.updateUserUsername.value = '';
                elements.updateUserPassword.value = '';
                alert('密码修改成功！');
            } else {
                alert('该用户不存在，请检查输入');
            }
        },

        // --- 核心业务逻辑：报价计算 ---

        calculateQuote() {
            const inputPrice = parseFloat(elements.inputPrice.value);
            
            if (isNaN(inputPrice) || inputPrice < 0) {
                alert('请输入有效的价格');
                return;
            }
            
            const settings = storage.getSettings();
            
            // 计算公式：
            // (输入价格 * 基础系数 * (1 + 百分比/100) + 固定费用) * 隐藏系数
            const baseMultiplier = settings.formula.base;
            const percentageMultiplier = 1 + (settings.formula.percentage / 100);
            const fee = settings.formula.fee;
            const hiddenCoeff = settings.hiddenCoefficient;
            
            const calculatedPrice = (inputPrice * baseMultiplier * percentageMultiplier + fee) * hiddenCoeff;
            
            // 格式化显示
            elements.resultBase.textContent = `¥${inputPrice.toFixed(2)}`;
            elements.resultFinal.textContent = `¥${calculatedPrice.toFixed(2)}`;
            
            elements.resultSection.classList.remove('hidden');
            
            // 平滑滚动到结果区域
            elements.resultSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    };

    // 启动应用
    app.init();
});
