# 医护移动端 H5 Design Guideline

## 技术栈

```text
Frontend：HTML5
Styling：Tailwind CSS
Environment：Static HTML / Browser
```

---

# 页面设计原则

```text
医疗专业风格
中高信息密度
卡片化布局
移动端优先
业务优先于视觉
```

要求：

* 优先保证信息效率
* 页面允许纵向滚动
* 优先单手操作区域
* 避免消费类 App 风格
* 避免过度装饰

禁止：

* 玻璃拟态
* 大面积渐变
* 重阴影
* 大面积插画
* 炫酷动画

---

# 页面尺寸规范

## 设计稿

```text
宽度：390px
参考机型：iPhone14
```

## H5 适配规则

```text
min-width:320px
max-width:768px
width:100%
```

规则：

* 页面必须自适应
* 禁止固定页面宽度
* 禁止固定页面高度
* 内容区域使用 width-full

推荐容器：

```html
<div class="mx-auto min-h-screen max-w-[768px] bg-[#F8FAFC]">
```

---

# 安全区规范

必须兼容异形屏。

顶部：

```css
padding-top: env(safe-area-inset-top)
```

底部：

```css
padding-bottom: env(safe-area-inset-bottom)
```

规则：

* Fixed Header 必须考虑顶部安全区
* Fixed Footer 必须考虑底部安全区
* 底部按钮禁止遮挡内容

---

# 页面布局规范

## 页面背景

```text
Background：#F8FAFC
```

## 页面边距

```text
左右边距：16px
顶部间距：16px
模块间距：16~24px
Card Padding：16px
```

规则：

* 内容放入卡片
* 避免整页纯白
* 使用统一间距体系

---

# 字体规范

字体：

```text
system-ui
PingFang SC
sans-serif
```

| 场景   | 字号      | 字重  |
| ---- | ------- | --- |
| 页面标题 | 18~20px | 600 |
| 模块标题 | 16~18px | 500 |
| 正文   | 14~16px | 400 |
| 辅助信息 | 12~13px | 400 |
| 标签   | 12px    | 500 |

规则：

* 控制在 4 个层级内
* 不小于 12px
* 保持一致性

---

# 颜色规范

## 主色

| Token   | Value   |
| ------- | ------- |
| primary | #2F6BFF |
| success | #07C160 |
| warning | #FF8A34 |
| danger  | #F53F3F |

## 中性色

| Token      | Value   |
| ---------- | ------- |
| page-bg    | #F8FAFC |
| card-bg    | #FFFFFF |
| border     | #E5E6EB |
| divider    | #ECEEF2 |
| text-main  | #1D2129 |
| text-sub   | #4E5969 |
| text-light | #86909C |

规则：

* 页面主色 ≤ 2 套
* 状态色统一
* 避免高饱和背景

---

# 间距规范

采用 4px Grid。

| Token | Value |
| ----- | ----- |
| xs    | 4px   |
| sm    | 8px   |
| md    | 12px  |
| lg    | 16px  |
| xl    | 20px  |
| xxl   | 24px  |

---

# 卡片规范

默认：

```text
背景：白色
圆角：16px
Padding：16px
间距：16px
```

阴影：

```css
shadow-[0_2px_10px_rgba(0,0,0,0.04)]
```

规则：

* 优先卡片化
* 优先模块化
* 避免复杂边框

---

# Header 规范

高度：

```text
44~48px
```

规则：

* 返回按钮居左
* 标题居中
* 支持吸顶

推荐：

```html
sticky top-0 z-10 bg-white
```

---

# Footer 操作栏规范

高度：

```text
56~64px
```

规则：

* 固定底部
* 预留安全区
* 页面内容留白

推荐：

```text
页面底部额外预留：80~100px
```

---

# 按钮规范

主按钮：

```text
Height：48px
Radius：12px
```

规则：

* 点击区域 ≥44px
* 底部按钮优先固定
* 同屏主按钮 ≤2 个

---

# 表单规范

输入框：

```text
Height：48px
Radius：10px
Border：#E5E6EB
```

规则：

* 必填加 *
* 单列布局
* 长表单分组
* 输入说明放下方

---

# 图标规范

```text
线性图标
24px 优先
统一描边
```

禁止：

* 彩色插画风
* 混合图标体系

---

# Tailwind 规范

优先：

```text
flex
grid
sticky
overflow-auto
min-h-screen
max-w-*
w-full
gap-*
```

避免：

```text
大量 absolute
固定高度布局
大量 z-index
深层嵌套
```

---

# 组件复用规范

优先：

```text
通用组件
业务模块
统一 Card
统一 Form
统一 Header
统一 Footer
```

避免：

```text
重复造组件
重复业务模块
页面内独立实现相同逻辑
```

---

# AI 输出约束

必须：

* 默认移动端 H5
* 页面自适应
* 支持滚动
* 使用卡片布局
* 保持真实业务密度
* 优先复用组件

禁止：

* 自动启动服务
* 自动补传统 CSS
* 写死尺寸布局
* 输出 App Native 风格页面

```
```

建议加，而且建议不要写成“发现重复就提示”，这样 AI 执行会很弱。应该明确触发条件，否则会出现过度提示。

建议新增一个章节：

# 组件沉淀规范

## 通用组件优先原则

页面开发时：

```text
优先复用已有通用组件
优先复用已有业务模块
禁止重复实现相同能力
```

---

## 通用组件识别规则

当满足以下任一条件时，应判断为可沉淀组件：

* 同类 UI 结构出现 ≥ 2 次
* 同类交互逻辑出现 ≥ 2 次
* 存在明显业务无关的重复布局
* 页面内多个区域使用相似结构
* 未来高概率复用

常见候选：

```text
Card
Header
Footer Action Bar
Form Group
Search Bar
Empty State
List Item
Tag
Tabs
Popup
Section Block
Timeline
Collapse
Filter Bar
```

---

## AI 提示规则

当检测到存在组件沉淀价值时：

必须主动提示：

```text
发现当前结构存在复用价值，建议抽离为通用组件。

建议组件名称：
组件职责：
可配置属性：
预计复用场景：

是否需要沉淀为通用组件？
```

---

## 业务模块识别规则

满足以下条件时，优先建议业务模块化：

* 同业务区域重复出现
* 由多个通用组件组合形成
* 具备独立业务含义

示例：

```text
居民信息卡
患者摘要卡
随访摘要模块
服务履约模块
用药记录模块
疾病标签模块
```

提示格式：

```text
发现该区域具备业务独立性，建议沉淀为业务模块。

模块名称：
包含组件：
输入参数：
输出行为：
```

---

## 禁止事项

禁止：

```text
同页面重复实现组件
复制已有布局重新开发
仅修改样式生成新组件
过度拆分低复用组件
```

