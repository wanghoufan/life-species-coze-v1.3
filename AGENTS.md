# AGENTS — 生活物种（COZE 提示词交付包）

> 项目结构事实与协作约定（neat-freak 2026-08-18 建立）

## 项目性质
- 本项目是「扣子（COZE）编程」的**最终开发提示词 v1.3 交付包**，同时含一份完整可运行的 Next.js 16 + Supabase MVP（预览：https://5dnqscfrmp.coze.site/）。
- 目标产出：带 Supabase 后端数据库的移动端优先 Web 网站（生活物种测试）。
- 当前状态：DONE（提示词与素材交付完成）。

## 项目结构事实
- 主需求 / 开发规范：`docs/pm/life_species_coze_prompt_v1_3_FINAL.md`（COZE 提示词 v1.3，唯一权威）
- 交付素材：`species_assets_v1/`（3 part 解压目录）、`species_assets_v1_part1/2/3.zip`（3 个独立 ZIP，共同组成 species_assets_v1）
- 冗余副本（已隔离）：`scratch/species_assets_v1 - 副本/`
- 规范骨架：`docs/{pm,qa,review,handoff,roles}/` + `scratch/`

## Source of Truth（务必遵守提示词约束）
- 唯一正式评分事实源：`life_species_calibrated_scorer_v1.mjs`
- 唯一正式图片映射依据：`life_species_supabase_seed_manifest_v1.json`
- 24 张正式 PNG 命名与 `species_key` 固定绑定，禁止重命名 / 翻译 / 改扩展名
- `manifest.csv` 不上传、不部署、不作为正式映射依据
- 高权限信息（Supabase `service_role`、`DATABASE_URL`）仅服务端环境变量，严禁进前端 bundle

## 协作约定
- 实施时 3 个 ZIP 解压后合并为同一 `public/assets/species/`（24 张 PNG），禁止 part1/2/3 子目录
- 评分模块须通过 `node life_species_calibrated_scorer_test_v1.mjs`：24/24 fixture、deterministic、crossFamilySecondary、status=PASS
- 文档遵循规范模板 v2.3
