# 交接文档（HANDOFF）— 生活物种（林粒粒 AI 编程第三周 · SBTI · COZE 提示词项目）

> 本文件依据规范模板 v2.3 的 `docs/handoff/HANDOFF.md` 生成；由 neat-freak 整理动作产出（2026-08-18）。

## 1. 项目概述
- 项目交付物：一份给「扣子（COZE）编程」的**最终开发提示词 v1.3**，用于完成一个带 Supabase 后端数据库的移动端优先 Web 网站（24 道测试 → 18 隐藏维度 → 24 物种 → 主物种 + 2 副物种）。
- 已 DONE（见文件夹命名 `DONE丨20260811`）。本项目以**提示词 + 素材交付包**为主，非完整代码仓库。

## 2. 当前状态
- 主需求 / 开发规范：`docs/pm/life_species_coze_prompt_v1_3_FINAL.md`（原根目录文件，按规范归入 `docs/pm/`，保留原名）。
- 24 张正式角色 PNG 与 3 个拆分 ZIP 为交付素材，均保留。

## 3. 技术栈 / Source of Truth（来自提示词）
- 目标架构：Supabase / PostgreSQL 后端 + 移动端优先 Web；前端页面 `/`、`/test`、`/r/{share_code}`。
- 唯一正式评分事实源：`life_species_calibrated_scorer_v1.mjs`（生产只允许此 scorer）。
- 唯一正式图片映射依据：`life_species_supabase_seed_manifest_v1.json`。
- 24 张正式 PNG 命名与 `species_key` 固定绑定，**禁止重命名 / 翻译 / 改扩展名**。
- `manifest.csv` 不上传、不部署、不作为映射依据。

## 4. 文档地图（规范 v2.3）
| 文件 | 内容 |
|---|---|
| `docs/pm/PLAN.md` | 计划骨架（待补充） |
| `docs/pm/life_species_coze_prompt_v1_3_FINAL.md` | 主需求 / 开发规范（COZE 提示词 v1.3） |
| `docs/qa/QA_CHECKLIST.md` | 回归清单（待补充） |
| `docs/qa/BUGS.md` | 缺陷跟踪（待补充） |
| `docs/review/CODE_REVIEW.md` | 代码审查（待补充） |
| `docs/review/PRODUCT_BACKLOG.md` | 产品优化 backlog（待补充） |
| `docs/handoff/HANDOFF.md` | 本文件 |
| `docs/roles/*.md` | 角色规范骨架（待补充） |
| `scratch/species_assets_v1 - 副本/` | 物种图冗余副本（26 张，疑似 `species_assets_v1` 的重复，已移入 scratch 保留不删） |
| `scratch/` | 临时 / 冗余 / 备份 |

## 5. 本次整理记录（2026-08-18）
- `life_species_coze_prompt_v1_3_FINAL.md` → `docs/pm/`（保留原名，按规范归位）。
- `species_assets_v1 - 副本`（26 张图，疑似冗余副本）→ `scratch/`（保留不删）。
- 新建全套规范骨架。
- 交付素材不动：`species_assets_v1/`（含 part1/2/3 解压目录）、`species_assets_v1_part1/2/3.zip`。

## 6. 已知事项 / 下一步
- 实施时须将 3 个 ZIP 解压后合并为**同一个** `public/assets/species/`（24 张 PNG），禁止生成 part1/2/3 子目录（`manifest.csv` 不上传）。
- 评分模块须通过自动测试 `node life_species_calibrated_scorer_test_v1.mjs`：24/24 fixture 命中、deterministic=true、crossFamilySecondary=true、status=PASS。
- 高权限信息（Supabase `service_role`、`DATABASE_URL`）只允许服务端环境变量，严禁进入前端 bundle。
- `docs/pm/PLAN.md`、`docs/qa/QA_CHECKLIST.md` 等建议后续补充。

## 7. neat-freak 收尾记录（2026-08-18）

- 一致性核查：主需求/开发规范位于 `docs/pm/life_species_coze_prompt_v1_3_FINAL.md`（已归位）；交付素材 `species_assets_v1/`（3 part 解压目录）、`species_assets_v1_part1/2/3.zip` 均在。
- 文档-代码差异：本项目为 **COZE 提示词交付包**，无代码仓库、无运行态；故无传统 `AGENTS.md` 结构。已新建 `AGENTS.md` 说明项目性质与 Source of Truth。
- 文档地图：规范骨架齐备；因无 design-qa 报告，`QA_CHECKLIST.md` 等暂无历史回归基线，建议后续按提示词「十二、最终 P0 验收」清单建立。
- scratch/：`species_assets_v1 - 副本/`（24 图 + manifest.csv + 一个 part zip，疑似冗余副本，已移入 scratch 保留不删；注意 manifest.csv 按提示词不得部署）。
- 无重复 / 过时 / 互相冲突的项目管理 Markdown。
