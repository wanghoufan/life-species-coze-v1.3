# PLAN — 生活物种（COZE 提示词交付包 v1.3）

> 项目计划首版（neat-freak 2026-08-18，依据 AGENTS.md 与 life_species_coze_prompt_v1_3_FINAL.md 已验证事实）

## 1. 项目性质
「扣子（COZE）编程」最终开发提示词 v1.3 交付包，**非完整代码仓库、无可运行态**。目标产出：带 Supabase 后端数据库的移动端优先 Web 网站（生活物种测试）。

## 2. Source of Truth（必须严格遵守）
- 唯一正式评分事实源：`life_species_calibrated_scorer_v1.mjs`
- 唯一正式图片映射依据：`life_species_supabase_seed_manifest_v1.json`
- 24 张正式 PNG 与 `species_key` 固定绑定，禁止重命名 / 翻译 / 改扩展名
- `manifest.csv` 不上传、不部署、不作为正式映射依据
- 高权限信息（Supabase `service_role`、`DATABASE_URL`）仅服务端环境变量，严禁进前端 bundle

## 3. 核心规格（提示词 v1.3）
- 24 道测试题、18 个隐藏维度、24 个 `species_key`、校准后正式评分算法（mvp-1.2-calibrated）
- 主物种 + 2 个跨 family 副物种规则；Permanent result link 机制；RLS / 数据库安全边界；已确定视觉方向
- MVP 暂不实现：登录注册、朋友互评、双人匹配、排行榜、社区、私信、AI 聊天

## 4. 交付物与协作约定
- 主需求：`docs/pm/life_species_coze_prompt_v1_3_FINAL.md`（唯一权威）
- 素材：3 个独立 ZIP（part1 01–08 / part2 09–16 / part3 17–24）解压后合并为同一 `public/assets/species/`（24 张 PNG），禁止 part 子目录
- 评分测试必须：`node life_species_calibrated_scorer_test_v1.mjs` → 24/24 fixture、deterministic、crossFamilySecondary、inputValidation、status=PASS
- 冗余副本已隔离至 `scratch/species_assets_v1 - 副本/`

## 5. 下一步（PRODUCT_BACKLOG）
- 由 COZE 编程按提示词落地为可运行网站（本包为规格，不含实现）
- 验收以评分器测试与 manifest 映射为准

## 6. 验收基线
- 本包已完成提示词与素材交付（DONE）；实施验收标准见提示词「正式评分器」段。
