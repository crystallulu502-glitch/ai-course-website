# 《普通人如何拥有第一个AI员工》课程介绍页

中文 AI 效率入门课程介绍页，价格 9.9 元。原生 HTML、CSS、JavaScript，无构建步骤，无第三方运行依赖，无外部字体或图片请求，支持手机与电脑浏览。

## 预览

下载项目后，双击 `index.html` 即可浏览页面与报名说明，无需安装软件。

也可以在项目目录运行：

```sh
python3 -m http.server 8000 --bind 0.0.0.0
```

在自己的电脑上运行时，浏览器打开 `http://localhost:8000`。云 onboarding 界面不支持 localhost 预览链接。停止服务按 Ctrl+C。

## 上线：GitHub Pages（推荐）

1. 将项目文件上传或提交到 GitHub 仓库 `crystallulu502-glitch/ai-course-website` 的 `main` 分支。工作区保存不等于已经推送。
2. 打开仓库 **Settings → Pages**。
3. 在 **Build and deployment** 选择 **Deploy from a branch**，分支选 `main`，目录选 `/ (root)`，点击 **Save**。
4. 等待部署完成，使用 Pages 设置页面提供的网站地址。默认地址通常是 `https://crystallulu502-glitch.github.io/ai-course-website/`，以实际部署结果为准。

无需构建命令。如果 Pages 不可用，请检查仓库权限和套餐支持情况。也可以将 `index.html`、`styles.css`、`script.js` 上传到其他静态网站托管服务，保持三者在同一目录。

## 修改内容

- `index.html`：课程文案、价格、大纲、常见问题。
- `styles.css`：颜色、布局、手机适配。
- `script.js`：报名弹窗、关闭交互、年份。

「9.9元立即解锁」按钮目前是占位入口，仅显示说明，不收集个人信息、不接入支付。正式开放前应明确课程交付方式、服务条款及退款规则。随后将按钮链接替换为真实报名地址，移除 `data-enroll` 属性以停用演示弹窗，并更新常见问题、报名区的演示说明。

## 验证

运行 `node --check script.js` 检查语法。浏览器测试需要开发环境提供 Playwright 和 Chromium（网站本身不依赖它们）。先启动上述服务，再运行：

```sh
node tests/smoke.cjs
```

测试覆盖 320、375、768、1440 像素宽度的布局、内容、资源加载、报名弹窗、键盘关闭、焦点恢复与 FAQ。
