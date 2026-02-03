# 报价系统

一个简单的报价计算系统，支持管理员和使用者两种角色。

## 功能特点

### 管理员功能
- 设置报价公式参数（基础价格系数、固定费用、百分比加成）
- 设置隐藏系数（对使用者不可见）
- 所有设置自动保存

### 使用者功能
- 输入价格计算报价
- 查看计算结果
- 无需登录即可使用基本功能

## 账号信息

### 管理员账号
- **用户名**：admin
- **密码**：password

### 使用者账号
- **用户名**：user
- **密码**：password

## 部署指南

### 方法一：GitHub Pages

1. **创建GitHub仓库**
   - 在GitHub上创建一个新的仓库
   - 复制仓库的SSH或HTTPS地址

2. **推送代码**
   ```bash
   # 添加远程仓库
   git remote add origin <仓库地址>
   
   # 推送代码
   git push -u origin main
   ```

3. **启用GitHub Pages**
   - 在仓库的Settings页面中，找到GitHub Pages设置
   - 选择main分支作为Source
   - 点击Save按钮
   - 等待几分钟，然后访问显示的URL

### 方法二：Vercel

1. **访问Vercel官网**
   - 打开 https://vercel.com
   - 使用GitHub账号登录

2. **导入项目**
   - 点击"New Project"
   - 选择你的GitHub仓库
   - 点击"Import"

3. **部署项目**
   - 保持默认设置
   - 点击"Deploy"
   - 部署完成后，Vercel会提供一个外网访问URL

### 方法三：Netlify

1. **访问Netlify官网**
   - 打开 https://www.netlify.com
   - 使用GitHub账号登录

2. **导入项目**
   - 点击"New site from Git"
   - 选择GitHub
   - 选择你的仓库

3. **部署项目**
   - 保持默认设置
   - 点击"Deploy site"
   - 部署完成后，Netlify会提供一个外网访问URL

## 本地开发

1. **启动本地服务器**
   ```bash
   # 使用Python 3
   python3 -m http.server 8000
   
   # 或使用Python 2
   python -m SimpleHTTPServer 8000
   
   # 或使用Node.js
   npx serve .
   ```

2. **访问本地网站**
   - 打开浏览器，访问 http://localhost:8000

## 技术栈

- **前端**：HTML5, CSS3, JavaScript
- **样式**：Tailwind CSS v3
- **图标**：Font Awesome
- **存储**：localStorage
- **响应式设计**：适配桌面端和移动端

## 计算公式

最终报价 = (输入价格 * 基础价格系数 * (1 + 百分比加成/100) + 固定费用) * 隐藏系数

## 注意事项

- 本项目使用localStorage存储设置，数据仅保存在浏览器本地
- 账号密码验证仅在前端实现，实际生产环境应使用后端验证
- 隐藏系数对使用者不可见，但可以通过浏览器开发者工具查看