# 医护移动端 H5 Design Guideline

---

# 核心定位

面向医护场景移动端 H5 页面设计规范。

目标：

* 保持高信息密度与高业务效率
* 减少卡片堆叠导致的信息碎片化
* 强约束 AI 输出风格，降低页面风格漂移
* 优先保证业务结构，其次视觉表现

---

# 技术栈

```text
Frontend：HTML5

Styling：Tailwind CSS（优先使用项目已有版本，不主动升级版本）

Environment：Static HTML / Browser
```

---

# 执行约束（Critical Rules）

## 本地预览服务控制

* **禁止自动启动**

除非用户明确发出类似：

```text
启动预览
运行服务
start dev server
```

否则严禁自动启动任何服务：

* Live Server
* Vite
* Webpack
* Node Server
* 其他本地服务

默认行为：

```text
仅生成、修改或提供代码内容，保持静默更新
```

---

## 环境启动约束

### Node.js 限制

禁止在以下场景启动 Node 环境：

* 调整 HTML 结构
* 调整 Tailwind 样式
* 调整布局
* 修改文案
* 修改组件结构

仅允许在以下情况建议启动：

* 安装新的 NPM 包
* 修改 tailwind.config.js
* 构建依赖调整
* 必须依赖 Node 的复杂逻辑实现

---

## 代码实现规范

### 引入策略

优先复用项目已有引入方式。

默认轻量方案：

```html
<script src="../assets/vendor/tailwind-browser.js"></script>
```

禁止：

* 主动升级 Tailwind 版本
* 主动修改项目构建方案
* 引入复杂打包链路

---

### 代码输出要求

* 完整代码模块必须添加中文注释
* 保持 HTML 结构完整
* 禁止输出半截代码
* 默认输出移动端 H5 页面

---

# 页面设计原则

## 核心原则

* 结构化 / 流式布局
* 卡片仅作为一级业务分区手段
* 业务信息密度优先于视觉装饰
* 优先单手操作
* 优先减少跳转链路

---

## 页面要求

### 页面默认支持纵向滚动

优先：

```text
单页流式结构
减少频繁跳转
减少弹窗链路
```

---

### 操作区域要求

高频操作：

```text
放置屏幕中下区域
保证单手可达
```

---

### 数据真实性要求

演示数据必须符合医疗场景。

禁止：

```text
年龄 300 岁
血压 500 mmHg
明显错误病历
异常时间格式
```

---

## 禁止项

### 禁止视觉过度设计

禁止：

* 玻璃拟态
* 大面积渐变
* 重阴影
* 炫酷动画
* 大面积插画

---

### 禁止卡片滥用

禁止：

* Card in Card
* 万物皆卡片
* 单字段独立卡片
* 单按钮独立卡片
* 无逻辑文本卡片

---

### 禁止 Native 化

禁止强依赖 Native 交互：

* 底部 Tab 导航
* 写死屏幕高度
* 依赖手势完成核心流程
* 强 App 化页面结构

保持：

```text
浏览器滚动模型
H5 自适应布局
```

---

# 页面尺寸与安全区规范

## 设计规格

```text
设计稿宽度：390px

min-width：320px

max-width：768px

width：100%
```

要求：

```text
禁止固定页面宽高
内容区域必须 w-full
```

---

## 推荐最外层容器

```html
<div class="
mx-auto
min-h-screen
max-w-[768px]
bg-[#F8FAFC]
px-4
pb-24
pt-[env(safe-area-inset-top)]
">
```

---

## 安全区规范

### Header

必须：

```text
pt-[env(safe-area-inset-top)]
```

---

### Footer

必须：

```text
pb-[env(safe-area-inset-bottom)]
```

推荐高度：

```text
56~64px
```

---

### Fixed / Sticky 规则

所有：

```text
fixed
sticky
absolute bottom
```

必须考虑：

```text
safe-area
遮挡风险
滚动兼容
```

否则视为布局缺陷。

---

# 页面布局与去卡片化规范

---

## 页面基础规范

页面背景：

```text
#F8FAFC
```

左右边距：

```text
16px（px-4）
```

模块间距：

```text
12~16px
```

禁止：

```text
超过 24px 无意义留白
```

---

# 去卡片化布局模式

---

## 模式选择优先级

```text
高内聚业务域 → 模式A

时间流 / 历史流 → 模式B

指标聚合 / 数据看板 → 模式C
```

禁止混用导致层级混乱。

---

## 模式 A：大通栏容器

适用：

```text
患者概览
处方汇总
业务摘要
```

规则：

* 仅允许一级容器
* 内部禁止圆角阴影
* 使用 divider 分隔

推荐：

```html
divide-y divide-[#ECEEF2]

space-y-4
```

---

## 模式 B：无界线性流

适用：

```text
随访记录
动态记录
历史列表
时间线
```

规则：

* 去掉卡片边框
* 去掉白底
* 去掉阴影

推荐：

```html
border-b border-[#E5E6EB]
```

---

## 模式 C：网格指标布局

适用：

```text
生命体征

化验指标

统计看板
```

推荐：

```html
grid-cols-2

grid-cols-3
```

内部：

```html
border-r border-[#ECEEF2]
```

禁止：

```text
一个指标一个小卡片
```

---

# 基础组件语义规范

---

## 一级业务容器

### 标准类

```html
bg-white rounded-xl p-4 shadow-[0_2px_8px_rgba(29,33,41,0.03)]
```

---

### 弱化类

```html
bg-[#F8FAFC]
rounded-lg
p-3
border
border-[#E5E6EB]
shadow-none
```

---

### 使用限制

```text
单屏建议 ≤ 3 个一级容器

超过则改流式布局
```

---

# 字体与排版

页面标题：

```text
18px
font-semibold
#1D2129
```

模块标题：

```text
16px
font-medium
#1D2129
```

正文：

```text
14px
#4E5969
```

辅助：

```text
12px
#86909C
```

---

## 数值强调规则

核心指标：

```text
必须通过字号
字重
布局
```

禁止：

```text
仅靠颜色强调
```

---

# 颜色 Token

主色：

```text
Primary：#2F6BFF

Success：#07C160

Warning：#FF8A34

Danger：#F53F3F
```

文字：

```text
Primary Text：#1D2129

Secondary Text：#4E5969

Disabled：#86909C
```

边框：

```text
#E5E6EB

#ECEEF2
```

---

# 组件与模块沉淀规范

---

# 组件优先级

```text
业务模块

↓

通用组件

↓

页面结构

↓

样式实现
```

禁止：

```text
先写样式后补业务结构
```

---

## 通用组件优先原则

优先：

```text
复用已有组件
组合已有组件
减少重复结构
```

禁止：

```text
复制粘贴相同 HTML
```

---

## 通用组件识别规则

触发条件：

```text
同类结构重复 ≥2 次

或具备明显扩展趋势
```

候选组件：

```text
Header
FooterActionBar
FormGroup
SearchBar
ListItem
Tag
Tabs
Timeline
FilterBar
Collapse
MetricGrid
SectionHeader
EmptyState
StatusBadge
InfoRow
```

---

## 业务模块识别规则

特征：

```text
强业务含义

多组件组合

高复用
```

示例：

```text
PatientSummary

AnomalyDashboard

MedicationChangeList
```

原则：

```text
高内聚

扁平化

拒绝套娃卡片
```

---

# Trigger Rules

---

## 通用组件提示

```text
🔍 【架构优化建议：通用组件沉淀】

发现当前结构存在复用价值，建议抽离为标准通用组件。

- 建议组件名：
- 组件职责：
- 推荐 Tailwind 扁平类组合：
- 可配置属性（Props）：
```

---

## 业务模块提示

```text
🏥 【业务模块化建议：拒绝套娃卡片】

检测到该区域具有独立医疗业务含义。

- 模块名称：
- 包含子项：
- 优化纠偏：
- 输入参数（Data Structure）：
```

---

# AI 输出约束

---

## MUST

* 默认移动端 H5
* 完全自适应
* 支持纵向滚动
* 多用组合少用容器
* 保持高信息密度
* 优先业务结构
* 输出完整 HTML

推荐：

```html
flex flex-col gap-3

space-y-3
```

---

## MUST NOT

禁止：

```text
深层嵌套卡片

写死高度

断裂 HTML

过度包装 div

视觉优先于业务
```
