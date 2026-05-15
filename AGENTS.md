## 核心技术栈
*   **Frontend:** HTML5
*   **Styling:** Tailwind CSS (优先使用 Play CDN)
*   **Environment:** Static HTML / Browser-based

---

## 执行约束 (Critical Rules)

### 1. 本地预览服务控制
*   **禁止自动启动**：除非用户明确发出类似“启动预览”、“运行服务”或“start dev server”的指令，否则严禁自动启动任何本地预览服务（如 Live Server, Vite, Webpack 等）。
*   **默认行为**：仅生成、修改或提供代码内容，保持静默更新。

### 2. 环境启动约束
*   **Node.js 限制**：严禁在仅调整 HTML 结构或 Tailwind 样式时启动 Node.js 环境。
*   **触发条件**：只有当涉及到必须依赖 Node.js 的逻辑调整（如：安装新的 NPM 包、修改 `tailwind.config.js` 配置文件、或编写复杂的后端 JavaScript 逻辑）时，方可调用或建议启动 Node.js。

### 3. 代码实现规范
*   **轻量化引入**：默认通过以下方式引入 Tailwind，避免复杂的构建流程：
    ```html
    <script src="[https://cdn.tailwindcss.com](https://cdn.tailwindcss.com)"></script>