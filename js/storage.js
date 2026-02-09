/**
 * 数据存储模块
 * 处理本地存储相关操作
 */
const storage = {
    /**
     * 获取报价设置
     * @returns {Object} 包含公式和隐藏系数的设置对象
     */
    getSettings() {
        try {
            const settings = localStorage.getItem('quote-settings');
            return settings ? JSON.parse(settings) : {
                formula: {
                    base: 1.0,
                    fee: 0,
                    percentage: 0
                },
                hiddenCoefficient: 1.0
            };
        } catch (e) {
            console.error('读取设置失败:', e);
            return {
                formula: { base: 1.0, fee: 0, percentage: 0 },
                hiddenCoefficient: 1.0
            };
        }
    },

    /**
     * 保存报价设置
     * @param {Object} settings 设置对象
     */
    saveSettings(settings) {
        try {
            localStorage.setItem('quote-settings', JSON.stringify(settings));
        } catch (e) {
            console.error('保存设置失败:', e);
            alert('保存设置失败，可能是存储空间不足');
        }
    },

    /**
     * 获取当前登录用户
     * @returns {string|null} 用户角色 ('admin' 或 'user') 或 null
     */
    getUser() {
        return localStorage.getItem('quote-user');
    },

    /**
     * 保存当前登录用户状态
     * @param {string} role 用户角色
     */
    saveUser(role) {
        localStorage.setItem('quote-user', role);
    },

    /**
     * 清除登录状态
     */
    clearUser() {
        localStorage.removeItem('quote-user');
    },

    // --- 用户管理相关方法 ---

    /**
     * 获取所有用户
     * @returns {Object} 包含 admin 和 user 数组的对象
     */
    getUsers() {
        try {
            const users = localStorage.getItem('quote-users');
            return users ? JSON.parse(users) : {
                admin: [{ username: 'admin', password: 'password' }],
                user: [{ username: 'user', password: 'password' }]
            };
        } catch (e) {
            console.error('读取用户数据失败:', e);
            return { admin: [], user: [] };
        }
    },

    /**
     * 保存所有用户数据
     * @param {Object} users 用户数据对象
     */
    saveUsers(users) {
        try {
            localStorage.setItem('quote-users', JSON.stringify(users));
        } catch (e) {
            console.error('保存用户数据失败:', e);
            alert('保存用户数据失败');
        }
    },

    /**
     * 添加新用户
     * @param {string} role 角色
     * @param {string} username 用户名
     * @param {string} password 密码
     * @returns {boolean} 是否成功
     */
    addUser(role, username, password) {
        const users = this.getUsers();
        if (!users[role]) {
            users[role] = [];
        }
        
        // 检查是否存在
        if (users[role].some(u => u.username === username)) {
            return false;
        }

        users[role].push({ username, password });
        this.saveUsers(users);
        return true;
    },

    /**
     * 更新用户密码
     * @param {string} role 角色
     * @param {string} username 用户名
     * @param {string} newPassword 新密码
     * @returns {boolean} 是否成功
     */
    updateUserPassword(role, username, newPassword) {
        const users = this.getUsers();
        if (users[role]) {
            const userIndex = users[role].findIndex(user => user.username === username);
            if (userIndex !== -1) {
                users[role][userIndex].password = newPassword;
                this.saveUsers(users);
                return true;
            }
        }
        return false;
    },

    /**
     * 根据用户名查找用户
     * @param {string} role 角色
     * @param {string} username 用户名
     * @returns {Object|null} 用户对象
     */
    getUserByUsername(role, username) {
        const users = this.getUsers();
        if (users[role]) {
            return users[role].find(user => user.username === username);
        }
        return null;
    }
};
