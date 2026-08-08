# 生活物种 - 项目上下文

## 项目概览
"生活物种"是一个趣味心理测试 Web 应用，通过 24 道题将用户匹配到 24 种"生活物种"之一，并生成 2 个跨家族副物种。

## 技术栈
- **Framework**: Next.js 16 (App Router)
- **Core**: React 19
- **Language**: TypeScript 5
- **UI**: Tailwind CSS 4 + shadcn/ui
- **Database**: Supabase (PostgreSQL)
- **Scorer**: 纯 JS 模块 (life_species_calibrated_scorer_v1.mjs)

## 目录结构
```
├── public/assets/species/     # 24 张角色 PNG 图片
├── src/
│   ├── app/
│   │   ├── page.tsx           # 首页
│   │   ├── test/page.tsx      # 24 道测试题
│   │   └── r/[shareCode]/page.tsx  # 永久结果页
│   │   └── api/
│   │       ├── runs/start/route.ts      # 开始测试
│   │       ├── runs/[runId]/complete/route.ts  # 完成测试
│   │       ├── runs/[runId]/feedback/route.ts  # 反馈
│   │       └── results/[shareCode]/route.ts    # 公开结果
│   ├── components/ui/         # shadcn/ui 组件
│   └── lib/supabase-admin.ts  # Supabase 管理客户端
├── life_species_calibrated_scorer_v1.mjs       # 正式评分器
├── life_species_calibrated_scorer_test_v1.mjs  # 评分器测试
├── life_species_supabase_seed_manifest_v1.json # 物种数据清单
├── DESIGN.md                 # 设计规范
└── AGENTS.md                 # 本文件
```

## 评分系统
- **版本**: mvp-1.2-calibrated
- **24 题 → 18 维度 → 24 物种**
- 主物种 + 2 个跨家族副物种
- 评分器纯函数，确定性输出

## 数据库
- `test_runs`: 测试运行记录
- `test_answers`: 答案记录
- `species_content`: 24 个物种的完整内容
- `result_snapshot`: 永久结果快照（最小化 < 1KB）
- `feedback`: 用户反馈
- RLS: 匿名用户可插入/查询，service_role 管理

## API 端点
- `POST /api/runs/start` - 开始测试
- `POST /api/runs/{runId}/complete` - 完成测试 (幂等)
- `GET /api/results/{shareCode}` - 公开结果
- `POST /api/runs/{runId}/feedback` - 提交反馈 (rating 1-4)

## 关键规范
- 移动端优先 (375/390/430px)
- 一屏一题
- Q10 最多选 3 项, Q15 最多选 5 项
- 永久结果路径: /r/{share_code}
- 分享码: 10 位 Base62