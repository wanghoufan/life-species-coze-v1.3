# Bugs — 生活物种（COZE 提示词交付包）

> 缺陷跟踪首版（neat-freak 2026-08-18）

## 已验证状态
- 本包为提示词 + 素材交付（DONE），无可运行态，无代码级缺陷。
- 唯一已知数据风险点在提示词中明确约束：24 张 PNG 文件名与 `species_key` 绑定，禁止重命名 / 翻译 / 哈希替代，否则破坏数据库映射。

## 待实施方注意（非本包缺陷）
- [ ] 评估 / 合并素材时必须保持 `public/assets/species/` 单目录、24 张原名 PNG（禁止 part1/2/3 子目录）
- [ ] `manifest.csv` 不得作为正式映射依据
- [ ] 服务端环境变量仅放 `service_role` / `DATABASE_URL`，严禁进前端 bundle
- [ ] 评分模块须通过 `life_species_calibrated_scorer_test_v1.mjs` 24/24 且 status=PASS，否则不视为完成

## 待排查 / 潜在项（open）
- [ ] `scratch/species_assets_v1 - 副本/`（26 文件）是否确为冗余副本，待用户确认后可清理（整理阶段未删除）
- [ ] 3 个 ZIP 与副本的内容一致性未逐字节校验

## 处理规则
- 任何实现改动不得修改 24 题 / 18 维 / 24 species_key / 校准算法 / 视觉方向（提示词最高优先级规则）。
