# WGX Travel Planning Skill

**From travel research to an editable travel workspace.**  
从旅行研究、路线规划到可编辑旅行网站，一套 Skill 完成旅行计划的生成、执行、分享与持续维护。

Created and maintained by **Freddy Wang**

[English](README_EN.md) · 中文

---

## 项目定位

**WGX Travel Planning Skill** 是一个面向 AI Agent 的完整旅行规划 Skill。

它不是一个独立 Agent，也不定义 Multi-Agent 架构；宿主 Agent 负责与用户对话、调用搜索 / 地图 / 浏览器 / 云端等能力，本 Skill 负责提供旅行场景中的：

- 需求澄清与偏好建模
- 目的地 Research 与时效核验
- 路线与逐日行程规划
- 航班 / 交通 / 住宿信息组织
- 六种 UI 风格预览与用户确认
- TravelPack 1.1.0 结构化数据生成与校验
- 五模块旅行网站交付
- 云端可编辑、只读分享与冲突检测
- 地图能力协商与降级
- 已部署旅行网站的安全升级与回滚

它希望解决的不是：

> “AI 帮我写一篇旅行攻略。”

而是：

> **“让 AI 帮我从零建立一个真正可以规划、执行、记录、分享和持续维护的旅行空间。”**

当前版本：`1.0.0`  
Skill ID：`wgx-travel-planning`

> 迁移兼容 ID：`hks-travel-skill`、`travel-guide-builder`。这两个 ID 仅用于升级既有部署时识别旧版本清单，不作为展示名，也不会写入新生成的清单。

---

## 一次完整调用会发生什么？

例如用户只说：

> “我想去云南玩 9 天，喜欢自然风景，不想太赶，预算中等。”

WGX Travel Planning Skill 会把这句话逐步转化为：

```text
旅行需求
  ↓
偏好摘要与确认
  ↓
目的地 / POI / 交通 / 住宿 / 预约 Research
  ↓
区域规划与候选地点
  ↓
逐日路线草案
  ↓
用户确认路线
  ↓
六种 UI 风格 Preview
  ↓
用户选择视觉风格
  ↓
生成 TravelPack 1.1.0
  ↓
Schema / 引用 / 时间 / 金额等确定性校验
  ↓
发现当前 Agent 的云端与地图能力
  ↓
用户授权部署
  ↓
生成五模块旅行网站
  ↓
真实浏览器验收
  ↓
Owner 编辑 + Read-only 分享
  ↓
旅行过程中持续维护
  ↓
未来使用新版 Skill 安全升级
```

最终交付的不是一篇静态攻略，而是一个可持续维护的 **Personal Travel Workspace**。

---

## 支持环境

- **WorkBuddy**
- **Codex**
- 其他 **Skill-compatible AI environments**

把 `wgx-travel-planning/` 放入宿主文档指定的 Skills 目录即可。

---

# 核心能力

## 1. 旅行需求理解与偏好建模

Skill 会先理解用户真正想要什么，而不是直接套用模板生成攻略。

可处理的旅行约束包括：

- 目的地
- 出发 / 返程日期
- 出发地与返程地
- 同行人员
- 旅行节奏
- 兴趣偏好
- 预算范围
- 拥挤容忍度
- 交通偏好或限制
- 住宿区域偏好
- 饮食偏好
- 是否自驾
- 是否存在老人、儿童或其他特殊出行需求

用户已经提供的信息不会重复询问。

在正式 Research 前，Skill 会先在会话中生成一份 **偏好摘要**，让用户确认旅行方向，避免 Agent 在错误需求上进行大量检索。

---

## 2. 多源目的地 Research 与时效管理

研究不只回答“哪里好玩”，而是围绕旅行是否真正可执行展开。

研究范围可以覆盖：

- 景点 / POI
- 城市与区域关系
- 景点之间的移动成本
- 城际交通
- 航班
- 火车 / 高铁
- 住宿区域
- 开放时间
- 预约规则
- 门票规则
- 季节变化
- 高峰拥挤情况
- 旅行节奏
- 潜在踩坑点
- 负面反证与替代方案

关键资料会保留来源与时效信息，包括：

- 来源平台
- 标题
- URL
- 获取时间
- 核验时间
- 信息类型
- 有效期
- 当前状态

动态事实不会被当成永久事实。

对于航班、预约、开放时间、季节规则等容易变化的信息，Skill 会区分：

- `live`
- `dynamic`
- `seasonal`
- `stable`

并对过期信息标记 `needs-recheck`，而不是把历史信息包装成当前结论。

---

## 3. 从“景点清单”升级为可执行路线

WGX Travel Planning Skill 不只是列出景点，而是把地点真正组织成可执行行程。

路线规划会综合考虑：

- 地理位置
- 每日可用时间
- 景点开放时间
- 城市之间移动成本
- 交通衔接
- 住宿位置
- 用户节奏偏好
- 同一天地点顺序
- 到达 / 离开时间
- 是否需要提前预约

典型流程：

```text
区域方案
  ↓
候选地点
  ↓
逐日草案
  ↓
时间段补全
  ↓
用户确认
  ↓
正式行程
```

正式行程节点会组织为明确的：

- 日期
- 地点
- 类型
- 开始时间
- 结束时间
- 顺序
- 备注
- 攻略 / 购票 / 餐厅等链接

避免只生成：

> 上午 A 景点  
> 下午 B 景点  
> 晚上自由活动

这种难以真正执行的模糊安排。

---

## 4. 航班与交通规划

Skill 将整个旅行中的交通统一组织为结构化 `transportSegments`。

可表达：

- 去程
- 返程
- 中途城际交通
- 航班
- 高铁 / 火车
- 汽车
- 其他交通方式

交通信息可以包含：

- 出发地
- 到达地
- 出发日期
- 到达日期
- 起飞 / 出发时间
- 到达时间
- 航站楼
- 登机口
- 建议到达机场时间
- 值机截止时间
- 登机时间
- 状态
- 票据关联
- 附件关联

对于尚未预订的行程，可以基于已确认时间窗口整理真实可查询候选航班，但状态仍保持为 `planned`，不会伪装成已预订。

如果只知道日期、不知道具体时间，也可以使用日期精度保存，而不是虚构班次时间。

---

## 5. 地图、POI 与路线能力协商

WGX Travel Planning Skill 不把“地图”当成单一功能，而是区分：

1. **Agent 侧地点 / 路线数据能力**
2. **WebService API**
3. **网页底图渲染能力**

Skill 会优先发现当前宿主已有的：

- 地图 MCP
- 地图 Connector
- 地图 WebService
- Web 地图 SDK
- 其他可配置地图能力

可用于：

- POI 搜索
- 坐标获取
- 路线研究
- 地点核验
- 地图标记
- 行程连线

生成的网站同时包含一套 **绘制式路线图**。

即使网页底图 Key、SDK 或第三方地图不可用，也可以继续展示：

- 地点编号
- 路线顺序
- 相对位置
- 选中地点详情
- 行程路线示意

如果网页底图加载失败，会降级为可读的路线示意，而不是让整个行程模块失效。

---

# 六种 UI 风格

正式部署前，Skill 会使用 **本次真实旅行数据** 生成 UI Preview，让用户先看效果，再选择视觉风格。

当前包含六个设计方向：

| Style ID | 风格 | 说明 |
|---|---|---|
| `aviation` | 航空票夹 | Boarding Pass / Travel Wallet 视觉语言 |
| `natural` | 自然手账 | 温和、旅行手账感 |
| `minimal` | 极简导览 | 清晰、轻量、信息优先 |
| `collage` | 拼贴裁纸 | 更强的旅行纪念册视觉 |
| `print` | 印画风 | 套色油墨 / 编辑版式 |
| `urban` | 都市设计 | 更现代的城市旅行视觉 |

其中 `collage`、`print`、`urban` 当前属于 V4 先行审核方向：先以 **出行模块**完成视觉审核，用户确认后再扩展到其余模块。

UI Preview 必须通过真实 HTTP(S) 页面或真实浏览器截图展示，不能只根据风格名称让用户盲选。

同时支持：

- Light Mode
- Dark Mode
- Desktop
- Mobile

---

# 五大旅行模块

最终产品固定包含五个一级模块：

```text
出行 · 行程 · 准备 · 记账 · 资料
```

长篇攻略、表格报告或静态单页只能作为补充，不能替代这五个模块。

---

## ① 出行 · Transport

统一管理整趟旅行的交通与票据。

支持：

- 去程 / 返程 / 中途交通
- 航班 / 火车 / 高铁 / 汽车等
- 时间与日期
- 航站楼 / 登机口
- 建议到达机场时间
- 值机截止
- 登机时间
- 交通状态
- 票据与附件
- 途中换乘

Aviation 风格下，出行模块以旅行票夹 / 登机牌视觉呈现。

---

## ② 行程 · Itinerary

这是整个旅行规划的核心模块。

支持：

- 按天查看行程
- 每日主题
- 时间轴
- 地点编号
- 开始 / 结束时间
- 地点详情
- 备注
- 多攻略链接
- 路线地图
- 全程总览

### 鼠标 + 触摸拖拽

每个地点节点都可以通过拖拽调整。

支持：

- 同一天调整顺序
- 跨日期移动地点
- 桌面鼠标拖拽
- 移动端触摸拖拽

拖拽保存后，以下内容使用同一份排序结果并同步更新：

- 行程列表
- 地图编号
- 路线连线
- 绘制式路线图

---

## ③ 准备 · Checklist

旅行前真正影响体验的，往往不是攻略本身，而是预约、提醒和准备事项。

准备模块可管理：

- 景点预约
- 门票购买
- 酒店确认
- 航班复查
- 天气复查
- 行李
- 证件
- 出发提醒
- 其他旅行待办

任务支持：

- `pending`
- `done`
- 截止时间
- 关联地点
- 关联交通
- 关联资料

完成后会显示完成状态与划线。

带提醒日期的任务还可以：

- **添加到日历**
- **导出 ICS 日历文件**

移动端在能力允许时优先调用系统分享 / 日历入口。

---

## ④ 记账 · Expense

内置多人旅行 AA 记账系统。

每笔账单可以记录：

- 日期
- 项目
- 币种
- 金额
- 付款人
- 参与人
- 分摊方式

支持：

- **均摊**
- **自定义分摊**

系统会验证：

> 所有人分摊金额之和 = 账单总金额

### 个人汇总

每位参与人分别计算：

- 个人应摊
- 实际支付
- 净应收
- 净应付

计算逻辑：

```text
净额 = 实际支付 − 个人应摊
```

### 结算建议

系统会把整趟旅行所有账单统一汇总，抵消多人之间的互相欠款，再生成最简化的结算建议。

不同币种独立计算，不会混合结算。

在数据存在错误时，例如：

- 未知同行人
- 自定义分摊合计不一致
- 无法完全平账

这类数据会在导入与校验阶段被确定性校验直接拒绝，不会进入页面展示，也不会被包装成结算结果。

---

## ⑤ 资料 · Materials

集中保存旅行过程中的资料、链接和附件。

可管理：

- 地点资料
- 票据
- 攻略
- 网页链接
- 预约信息
- 酒店资料
- 小红书攻略
- 公众号文章
- 餐厅链接
- 购票页面
- 其他旅行网页
- 可选云端附件

一个地点可以保存多个攻略链接。

交通、住宿与行程节点也可以拥有自己的独立链接。

当宿主存在共享对象存储能力时，可开放真正的云端附件上传；如果当前环境没有该能力，页面会明确显示：

> 附件未启用

不会把仅存在本机的文件冒充共享附件。

---

# TravelPack 1.1.0

WGX Travel Planning Skill 使用 **TravelPack 1.1.0** 作为旅行数据协议。

顶层结构包含：

```text
appearance
trip
companions[]
days[]
places[]
itineraryItems[]
transportSegments[]
stays[]
tasks[]
expenses[]
materials[]
assets[]
sources[]
```

TravelPack 将：

**旅行 Research / Agent 推理**

与：

**旅行产品 UI / 云端存储**

解耦。

这意味着同一份旅行数据可以持续被：

- AI 更新
- 用户网页编辑
- 新版本 Skill 升级
- 不同宿主环境读取

而不需要重新生成整个旅行产品。

正式交付之前会运行确定性校验，包括：

- Schema 版本
- ID 唯一性
- 引用完整性
- 日期范围
- 行程顺序
- 时间格式
- 交通时间逻辑
- URL 合法性
- AA 分摊金额
- 来源结构
- 敏感字段边界

避免 AI 生成“看起来正确，但运行时数据已经损坏”的结果。

---

# 可编辑云端旅行网站

WGX Travel Planning Skill 的正式交付目标不是静态页面，而是一个可持续维护的旅行工具。

完整云端模式需要同时具备：

- 官方五模块前端
- 云端 TravelPack 读取
- 云端 TravelPack 保存
- Owner 编辑入口
- Read-only 分享入口
- Revision / 版本冲突检测
- 刷新后数据恢复
- 只读写入拒绝
- 可选附件存储

Owner 可以继续：

- 修改路线
- 添加地点
- 调整时间
- 更新交通
- 完成待办
- 新增账单
- 添加资料
- 上传附件

同行人则可以通过只读链接查看旅行，但不能修改数据。

---

# 多宿主部署

Skill 不绑定单一云平台。

它会先检查当前 Agent 环境拥有的能力，再选择部署路径。

当前设计可适配：

- WorkBuddy
- Cloudflare
- Codex Sites
- 通用 Agent / MCP 适配（静态预览仅用于 UI 审核，不作为正式交付）
- 其他具有数据库、身份、发布能力的 Agent Host

判断标准不是“是否生成了一个 URL”，而是检查最终产品是否具备：

- 可编辑
- 可持久化
- 可只读分享
- 可识别冲突
- 刷新后可恢复
- 用户需要时可支持共享附件

只有完整闭环成立时，才会把结果称为完整旅行产品。

---

# 已部署旅行安全升级

WGX Travel Planning Skill 还支持对已经上线的旅行网站进行版本升级。

例如：

> “使用最新版 WGX Travel Planning Skill 升级我之前的云南旅行网站。”

Skill 不会静默创建一个新网站替换旧网站。

升级流程会先读取：

`travel-app-manifest.json`

识别：

- 当前版本
- 数据 Schema
- 宿主模式
- 部署标识
- 线上 TravelPack
- Revision
- 附件状态

然后执行：

```text
读取清单
  ↓
导出线上数据
  ↓
生成升级计划
  ↓
建立升级前备份
  ↓
更新静态资源 / 必要适配器
  ↓
重新发布
  ↓
验证数据与五模块
  ↓
验证编辑入口与只读入口
  ↓
失败时回滚
```

升级默认保留：

- 原 TravelPack
- 用户网页修改
- 已完成待办
- AA 账单
- 上传附件
- 数据库
- 域名
- 分享链接
- 权限
- Secret

升级前会建立带 **SHA-256** 的备份。

纯代码升级不会重写线上 TravelPack。

---

# 页面预览

> 以下截图来自真实 HTTP(S) 页面，并经过公开信息检查。画面不含真实邮箱、验证码、访问令牌、地图 Key、Cookie 或本机路径；示例数据为匿名东京行程。

## 产品总览

![产品总览](docs/screenshots/product-overview-desktop.png)

## 行程与路线图

![行程与路线图](docs/screenshots/itinerary-desktop.png)

## 准备与日历

![准备与日历](docs/screenshots/checklist-desktop.png)

## AA 记账与结算

![AA 记账与结算](docs/screenshots/expense-desktop.png)

## 资料与攻略链接

![资料与攻略链接](docs/screenshots/materials-desktop.png)

## 移动端

<img src="docs/screenshots/itinerary-mobile.png" alt="行程移动端" width="390">

## UI 风格预览

> `aviation` / `natural` / `minimal` 为完整五模块风格；`collage` / `print` / `urban` 当前处于 V4 出行模块先行审核阶段。

![六种 UI 风格](docs/screenshots/style-overview.png)

---

# 安装

克隆仓库后，把 Skill 目录复制到对应环境的 Skills 目录。

## WorkBuddy

```bash
git clone https://github.com/FreddyWang-02/wgx-travel-skill.git
cp -R wgx-travel-skill/wgx-travel-planning ~/.workbuddy/skills/wgx-travel-planning
```

复制完成后**重启或刷新 WorkBuddy**，Skill 索引会在启动时加载；之后即可用：

```text
$wgx-travel-planning
```

调用。

## Codex

```bash
git clone https://github.com/FreddyWang-02/wgx-travel-skill.git
cp -R wgx-travel-skill/wgx-travel-planning ~/.codex/skills/wgx-travel-planning
```

## 其他 Skill-compatible 环境

把 `wgx-travel-planning/` 放入其文档指定的 Skills 目录。

目录名需与 `SKILL.md` 的 `name` 字段保持一致。

---

# 使用

## 创建一趟新的旅行

```text
请使用 $wgx-travel-planning 帮我规划 9 天丽江和香格里拉旅行。

先确认我的旅行偏好，再研究目的地、交通、住宿和预约信息；
路线确认后，用真实旅行数据展示 UI 风格；
等我确认视觉风格和部署后，再生成可编辑旅行网站。
```

## 更新旅行内容

```text
请使用 $wgx-travel-planning 更新我现有旅行计划。

保留我已经完成的待办、记账、附件和网页编辑内容，
只调整这次明确要求修改的路线和地点。
```

## 升级已经部署的网站

```text
请使用最新版 WGX Travel Planning Skill 升级这个网站：

<网站地址>

保留数据库、用户编辑内容、附件、访问链接和域名；
升级前备份，升级后验证编辑入口、只读入口和 TravelPack。
```

新版 Skill 不会主动修改线上网站。

只有用户明确指定目标网站后，Agent 才会读取 `travel-app-manifest.json` 并进入升级流程。

---

# 地图说明

地图 MCP、WebService API 与网页底图是三项独立能力。

例如：

- 地图 MCP 可以提供 POI / 坐标 / 路线数据
- WebService API 可以提供运行时地点能力
- 网页底图通常还需要 Web Key、域名白名单和前端适配器

连接某个地图 MCP **不等于**网页已经获得对应地图底图。

当需要账号、Key、OAuth 或计费信息时，Skill 会展示配置步骤并等待授权。

所有凭据必须通过：

- 宿主 Secret
- 身份系统
- 环境变量

注入。

禁止把 Key、验证码或访问令牌写入：

- TravelPack
- 聊天记录
- 日志
- 公开版本清单

---

# 项目结构

```text
wgx-travel-skill/
├── wgx-travel-planning/
│   ├── SKILL.md
│   ├── agents/
│   ├── assets/
│   │   ├── frontend-template/
│   │   ├── backend-template/
│   │   └── map-connectors/
│   ├── references/
│   └── scripts/
├── docs/
│   └── screenshots/
├── scripts/
│   └── audit-public-tree.mjs
├── tests/
├── CHANGELOG.md
├── PRIVACY.md
├── SECURITY.md
├── THIRD_PARTY_NOTICES.md
└── README.md
```

`SKILL.md` 只保留核心工作流与边界。

宿主适配、TravelPack、地图、部署、产品契约和升级细节位于 `references/`。

确定性校验、备份、部署选择与升级验证位于 `scripts/`。

---

# 开发与检查

需要 Node.js 20 或更高版本。

仓库没有运行时 npm 依赖。

```bash
npm run audit
npm test
npm run check
```

`npm run audit` 会拒绝常见：

- 密钥
- 真实邮箱
- 本机绝对路径
- 数据库
- 日志
- 缓存
- 发布压缩包

提交前仍应人工检查：

- 截图
- Git 历史
- Secret scanning
- 示例 TravelPack
- 部署清单

---

# 隐私与安全

公开发布前请阅读：

- [PRIVACY.md](PRIVACY.md)
- [SECURITY.md](SECURITY.md)
- [Open Source Audit](docs/OPEN_SOURCE_AUDIT.md)

仓库只应包含：

- Skill
- 匿名示例数据
- 经过检查的页面截图

以下内容必须留在公开仓库之外：

- 生产数据库
- 邮箱验证码
- 邮件 outbox
- 浏览器状态
- 云平台缓存
- 本地日志
- 历史发布包
- Access Token / API Key / Cookie

---

# 第三方组件

前端模板当前内置：

- Leaflet 1.9.4
- Lucide 0.468.0

许可与版权信息见：

[THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)

---

# 维护者

本仓库由 **Freddy Wang** 维护。

GitHub：[@FreddyWang-02](https://github.com/FreddyWang-02)

---

# License

项目采用 [MIT License](LICENSE)。

第三方组件继续适用各自许可证。
