
import re

def refactor():
    with open('index.html', 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. 移除 tailwind 配置 script
    content = re.sub(r'<script>\s*tailwind\.config\s*=\s*\{[\s\S]*?\}\s*</script>', '', content)

    # 2. 移除 tailwind 样式 style
    content = re.sub(r'<style type="text/tailwindcss">[\s\S]*?</style>', '', content)

    # 3. 移除底部的 script
    # 查找最后一个 <script> 标签（包含逻辑的那个），通常在 body 结束前
    # 我们可以通过查找 "const storage =" 来定位
    content = re.sub(r'<script>\s*// 存储设置和用户信息[\s\S]*?</script>', '', content)

    # 4. 在 head 中插入新引用
    # 找到 font-awesome 引用，在后面添加
    new_head_links = '''
    <link href="https://cdn.jsdelivr.net/npm/font-awesome@4.7.0/css/font-awesome.min.css" rel="stylesheet">
    <link href="css/style.css" rel="stylesheet">
    <script src="js/tailwind-config.js"></script>'''
    
    content = content.replace(
        '<link href="https://cdn.jsdelivr.net/npm/font-awesome@4.7.0/css/font-awesome.min.css" rel="stylesheet">',
        new_head_links.strip()
    )

    # 5. 在 body 结束前插入新 script 引用
    new_scripts = '''
    <!-- JavaScript -->
    <script src="js/storage.js"></script>
    <script src="js/app.js"></script>
</body>'''
    
    content = content.replace('</body>', new_scripts.strip())
    
    # 清理多余空行
    content = re.sub(r'\n\s*\n\s*\n', '\n\n', content)

    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(content)

if __name__ == '__main__':
    refactor()
