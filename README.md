# RemoveBG - AI 智能抠图工具

一个基于 ONNX 模型的客户端背景去除工具，完全在浏览器中运行，保护您的隐私。

## 特性

- **🎯 精准抠图**: 使用先进的 RMBG-1.4 和 U2Net 模型，精准识别主体并去除背景
- **🔒 隐私保护**: 所有处理都在浏览器本地完成，图片不会上传到服务器
- **⚡ 快速处理**: 利用 WebAssembly 和 Web Worker 技术，实现高性能处理
- **🎨 Neo-Brutalism 设计**: 采用现代 Neo-Brutalism 设计风格，提供独特的视觉体验
- **🌍 多语言支持**: 支持中文和英文界面
- **🔄 模型切换**: 可在设置中切换不同的背景去除模型
- **📱 响应式设计**: 完美适配各种屏幕尺寸
- **🎭 深色模式**: 支持明暗主题切换

## 技术栈

- **框架**: Next.js 16 (App Router) + React 19
- **AI 推理**: ONNX Runtime Web
- **样式**: Tailwind CSS 4
- **UI 组件**: Radix UI
- **国际化**: next-intl
- **动画**: Framer Motion
- **语言**: TypeScript

## 安装

```bash
# 克隆项目
git clone <repository-url>

# 进入项目目录
cd removebg

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

## 使用方法

1. **上传图片**: 点击上传区域或拖拽图片到页面
2. **自动处理**: 模型会自动加载并去除背景
3. **对比查看**: 使用对比滑块查看处理前后效果
4. **调整视图**: 使用缩放和平移功能查看细节
5. **下载结果**: 点击下载按钮保存透明背景图片

## 模型说明

### U2Net (推荐)
- 输入尺寸: 320x320
- 特点: 通用场景效果更好，适合大多数图片，推荐优先使用
- 模型地址: https://cdn.isboyjc.com/models/u2net/u2net.onnx

### RMBG-1.4
- 输入尺寸: 1024x1024
- 特点: 某些特定场景下可能效果更佳，可作为备选方案
- 模型地址: https://cdn.isboyjc.com/models/rmbg/rmbg1.4.onnx

## 项目结构

```
removebg/
├── app/                    # Next.js App Router
│   └── [locale]/          # 国际化路由
├── components/            # React 组件
│   ├── ui/               # 基础 UI 组件
│   └── ImageEditor/      # 图像编辑器组件
├── hooks/                # 自定义 Hooks
├── i18n/                 # 国际化配置
├── lib/                  # 工具库
│   ├── rmbg-worker.ts   # ONNX 模型 Worker
│   └── rmbg-processor.ts # 模型处理器
├── messages/             # 国际化消息
└── public/              # 静态资源
```

## 开发命令

```bash
# 开发模式
pnpm dev

# 构建生产版本
pnpm build

# 启动生产服务器
pnpm start

# 代码检查
pnpm lint
```

## 浏览器兼容性

- Chrome/Edge: >= 90
- Firefox: >= 88
- Safari: >= 14
- 需要支持 WebAssembly 和 Cache API

## 许可证

MIT

## 相关项目

- [Cleanup](../cleanup) - 基于 ONNX + LaMa 模型的水印去除工具

## 致谢

- [RMBG](https://huggingface.co/briaai/RMBG-1.4) - RMBG-1.4 模型
- [U2Net](https://github.com/xuebinqin/U-2-Net) - U2Net 模型
- [ONNX Runtime](https://onnxruntime.ai/) - 推理引擎
