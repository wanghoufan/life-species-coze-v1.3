# Code Review — 生活物种（COZE 提示词交付包）

> 代码审查首版（neat-freak 2026-08-18，依据可验证事实，不写未验证猜测）

## 审查范围与结论
- 本包是 COZE 编程的**开发提示词与素材交付**，不含可运行代码，因此无源码级 Code Review 对象。本文件记录「实施交付时的必查项」，供 COZE 编程或新 Agent 落地时对照。

## 必查一致性（来自提示词 v1.3 与 AGENTS.md）
- 评分仅允许 `life_species_calibrated_scorer_v1.mjs`（版本 mvp-1.2-calibrated），禁止旧参考 scorer 或前端自维护评分逻辑
- Supabase 按 SQL 编号顺序初始化：基础 Schema → 永久结果链接 Migration → scorer_version Migration → RLS → Seed（幂等）
- 初始化后应满足：test version=mvp-1.2、scoring engine=mvp-1.2-calibrated、questions=24、dimensions=18、species=24
- `species_content.image_url` 必须与 `life_species_supabase_seed_manifest_v1.json` 正式路径一致
- `test_runs` / `test_answers` 不允许浏览器匿名用户整表读写（RLS 边界）

## 待实施方复核点
- [ ] 24/24 fixture 命中、deterministic、crossFamilySecondary、status=PASS
- [ ] 图片目录 `public/assets/species/` 单目录、24 张原名 PNG，无 part 子目录
- [ ] 高权限密钥仅服务端环境变量
- [ ] MVP 排除项（登录 / 互评 / 匹配 / 排行榜 / 社区 / 私信 / AI 聊天）确实未实现

## 风险
- 提示词为最新修订版（v1.3 > v1.2），若旧规范冲突以 v1.3 为准；实施时须先读 `00_START_HERE/` 基础总规范再叠加 v1.3。
