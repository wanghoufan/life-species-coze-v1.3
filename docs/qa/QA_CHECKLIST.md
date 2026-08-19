# QA Checklist

> 暂无可验证的历史回归基线（neat-freak 2026-08-18）

本项目为 COZE 编程提示词交付包，目前**无 design-qa 报告**。建议按主规范 `docs/pm/life_species_coze_prompt_v1_3_FINAL.md` 的「十二、最终 P0 验收」清单建立首版回归基线，至少覆盖：

- [ ] 24 道题全部可完成；Q10 选 1–3 项、Q15 选 1–5 项
- [ ] 正式评分仅服务端，使用 `mvp-1.2-calibrated`；旧 scorer 不进生产
- [ ] 24/24 fixture PASS、deterministic PASS、两副物种与主物种不同 family、非法输入被拒
- [ ] Supabase Schema / Migration / RLS / Seed 正确；Seed 幂等
- [ ] `runToken` 明文不入库；service_role 不在前端 bundle
- [ ] complete API 幂等；永久结果路径 `/r/{share_code}`，刷新 / 换浏览器不丢失
- [ ] 3 个角色 ZIP 解压合并为同一 `public/assets/species/`（24 PNG，无 part 子目录）；`manifest.csv` 不部署
- [ ] 375 / 390 / 430 px 无明显布局错误；分享卡二维码指向正确永久结果页
