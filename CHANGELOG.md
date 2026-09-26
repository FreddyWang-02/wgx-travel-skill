# Changelog

本文件记录 WGX Travel Planning Skill 的版本变更。

版本格式遵循 `x.y.z`。

## 未发布

**文档与元数据**

- README / README_EN 重写：补齐安装路径、五模块说明、hosts 支持矩阵，并按真实代码校正文案
- README 预览图全部重制：基于一份匿名东京 Demo（TravelPack 1.1.0 校验通过），由真实浏览器点击后截图，共 8 张
- 移动端行程图重截：修正此前截图工具拼接缺陷导致的页面空白
- SKILL.md / agents/openai.yaml 描述重写为中文，明确适用场景、工作流与不适用场景，便于在 Skill 商城中被正确检索与触发

## 1.0.0

首个正式发布版本。由 Freddy Wang 创建并维护。

**发布内容**

- Initial release of WGX Travel Planning Skill
- Personalized travel planning — 收集目的地、日期、同行人、节奏、兴趣、预算与交通限制，先确认偏好与路线，再进入大规模研究
- TravelPack structured output — 生成并严格校验 TravelPack 1.1.0 结构化数据
- Interactive travel Web App generation — 交付「出行、行程、准备、记账、资料」五模块旅行网站，支持拖拽排序、待办、日历导出、AA 记账、附件与只读分享

**其他能力**

- 六种 UI 风格预览（航空票夹、自然手账、极简导览、拼贴裁纸、印刷、都市），正式部署前由用户选择
- 宿主云能力发现与部署路由
- 既有网站安全升级：版本清单、备份、迁移验证、浏览器验收与回滚点

**身份迁移**

- Skill ID 由 `hks-travel-skill` 迁移为 `wgx-travel-planning`
- 展示名统一为 `WGX Travel Planning Skill`
- `hks-travel-skill` 与 `travel-guide-builder` 保留为迁移兼容 ID，仅用于识别并升级既有部署，不作为展示名，也不会写进新生成的清单

**未变更**

- TravelPack 1.1.0 数据协议
- 旅行规划工作流
- Web App 生成逻辑
