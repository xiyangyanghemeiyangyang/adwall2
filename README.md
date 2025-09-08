## Realtime Node worker server

Run realtime simulation server:

```bash
npm run server
```

It starts a WebSocket at ws://localhost:8080 and broadcasts computed updates.

# CrmPlus - B 端管理系统

基于 React 和 TypeScript 开发的 B 端 CRM 管理系统前端项目。

## 技术栈

- React 18
- TypeScript
- Vite
- React Router
- Ant Design
- TailwindCSS
- Redux Toolkit
- Axios
- MSW (模拟数据)

## 功能模块

- 推广账号管理
- 内容审核系统
- 区域管理系统
- 数据分析中心
- 佣金结算系统
- 运营管理系统

## 开发指南

### 安装依赖

```bash
npm install
```

### 本地开发

```bash
npm run dev
```

### 构建项目

```bash
npm run build
```

### 预览构建结果

```bash
npm run preview
```

## 项目结构

```
src/
├── components/       # 通用组件
├── features/         # 业务功能模块
├── hooks/            # 自定义钩子
├── layouts/          # 布局组件
├── mocks/            # 模拟数据和服务
├── pages/            # 页面组件
├── services/         # API服务
├── types/            # TypeScript类型定义
└── utils/            # 工具函数
```

## 设备适配

- 移动端 (< 768px)
- 平板 (768px - 1024px)
- PC (> 1024px)

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ["./tsconfig.node.json", "./tsconfig.app.json"],
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    "react-x": reactX,
    "react-dom": reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs["recommended-typescript"].rules,
    ...reactDom.configs.recommended.rules,
  },
});
```

# B 端 CRM 平台前端开发指南

## 业务流程梳理

### 主要业务流程

1. **账号管理流程**
   - 推广账号申请 → 审核 → 权限分配 → 区域绑定 → 账号管理
2. **内容审核流程**
   - 内容提交 → 自动初审 → 人工复审 → 发布/退回修改
3. **数据分析流程**
   - 数据采集 → 清洗处理 → 图表展示 → 报表导出
4. **佣金结算流程**
   - 业绩记录 → 计算佣金 → 生成账单 → 财务审核 → 结算

## 技术栈推荐

### 基础框架

- **React + TypeScript**：流行且性能良好，TypeScript 提供类型安全
- **Next.js**：支持 SSR，有利于 SEO 和首屏加载速度

### 组件库

- **Ant Design**：企业级 UI 组件库，功能丰富，适合管理系统
- **TailwindCSS**：响应式设计更加灵活

### 状态管理

- **Redux Toolkit**：简化 Redux 使用，适合复杂状态管理
- **React Query**：处理异步数据请求，支持缓存

### 图表可视化

- **Echarts** 或 **AntV**：数据可视化能力强

## 多端适配方案

### 响应式设计策略

- 采用移动优先（Mobile First）的设计理念
- 使用相对单位（rem/em/vw）和媒体查询
- 关键断点设置：
  - 手机：< 768px
  - 平板：768px - 1024px
  - PC：> 1024px

### 多端适配技术

- **媒体查询**：根据不同设备显示不同布局
- **Grid/Flexbox**：弹性布局
- **组件条件渲染**：根据设备类型渲染不同组件

## 模拟数据开发策略

### 方案选择

- **MSW(Mock Service Worker)**：拦截网络请求，无需修改代码即可切换到真实 API
- **JSON Server**：快速创建 REST API 模拟服务器

### 模拟数据结构

1. 为每个模块创建独立的模拟数据文件
2. 遵循后端 API 的数据结构设计
3. 包含各种边界情况的测试数据

## 开发步骤建议

1. **搭建项目基础架构**

   - 创建 Next.js 项目，集成 TypeScript
   - 配置 ESLint、Prettier、Husky 等工具
   - 设置路由结构和基础布局

2. **开发通用组件**

   - 设计系统：按钮、表单、卡片等基础组件
   - 导航系统：菜单、面包屑、标签页等
   - 权限控制组件

3. **构建核心业务模块**

   - 按照业务流程开发各模块页面
   - 优先完成高频使用功能
   - 实现模块间数据流转

4. **优化用户体验**

   - 加载状态和错误处理
   - 表单验证和错误提示
   - 响应式适配测试

5. **性能优化**
   - 代码分割和懒加载
   - 图片和资源优化
   - 组件复用和缓存策略

## 项目文件结构建议

```
src/
├── components/       # 通用组件
├── features/         # 业务功能模块
├── hooks/            # 自定义钩子
├── layouts/          # 布局组件
├── mocks/            # 模拟数据和服务
├── pages/            # 页面组件
├── services/         # API服务
├── styles/           # 全局样式
├── types/            # TypeScript类型定义
└── utils/            # 工具函数
```

这个结构遵循特性优先(feature-first)的组织方式，有利于业务模块的独立性和可维护性。

希望这个指南能帮助您理清思路，开始 B 端 CRM 平台的前端开发。
