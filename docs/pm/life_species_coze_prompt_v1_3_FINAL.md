# 生活物种｜给扣子编程的最终开发提示词 v1.3

请基于我上传的“生活物种”项目交付文件，完成一个带 Supabase 后端数据库的移动端优先 Web 网站。

## 一、最高优先级规则

1. 先完整读取开发交付包中的：
   - `00_START_HERE/README_FIRST.md`
   - `00_START_HERE/life_species_coze_master_prompt_v1_2.md`

2. 上述文件仍然是项目的基础总规范；但**本条 v1.3 提示词是最新修订版**。  
   如果旧规范与本提示词发生冲突，以本提示词为准。

3. 不要自行重新设计或修改：
   - 24 道测试题
   - 18 个隐藏维度
   - 24 个 `species_key`
   - 校准后的正式评分算法
   - 主物种 + 2 个副物种规则
   - Supabase 数据结构
   - 永久结果链接机制
   - RLS / 数据库安全边界
   - 正式角色图片文件名
   - 已确定的视觉方向

4. MVP 暂不实现：
   - 登录注册
   - 朋友互评
   - 双人匹配
   - 排行榜
   - 社区
   - 私信
   - AI 聊天

---

# 二、正式评分器

生产环境只允许使用：

`life_species_calibrated_scorer_v1.mjs`

正式评分器版本：

`mvp-1.2-calibrated`

禁止把旧的参考 scorer 作为生产算法，也禁止让前端自己维护另一套评分逻辑。

正式流程：

24 道原始答案  
→ 服务端校验  
→ 18 个隐藏维度  
→ 24 个物种匹配  
→ 主物种  
→ 2 个跨 family 副物种

同一份答案 + 同一测试版本 + 同一评分器版本，必须永远得到相同结果。

正式物种判断不得由 AI 临时生成。

开发完成后必须运行自动测试：

`node life_species_calibrated_scorer_test_v1.mjs`

必须达到：

- 24 / 24 fixture 主物种命中
- deterministic = true
- crossFamilySecondary = true
- inputValidation = true
- status = PASS

任何一项失败，都不能视为评分模块完成。

---

# 三、Supabase 数据库

数据库使用 Supabase / PostgreSQL。

请严格按照交付包中 SQL 文件编号顺序初始化数据库：

1. PostgreSQL / Supabase 基础 Schema
2. 永久结果链接 Migration
3. scorer_version Migration
4. RLS
5. Seed

初始化完成后应满足：

- test version = `mvp-1.2`
- scoring engine = `mvp-1.2-calibrated`
- questions = 24
- dimensions = 18
- species = 24

Seed 必须幂等，重复执行不得插入重复物种。

Supabase `service_role`、数据库密码、`DATABASE_URL` 等高权限信息只能保存在服务端环境变量中，严禁进入前端 bundle。

`test_runs` 和 `test_answers` 不允许浏览器匿名用户直接整表读写。

---

# 四、正式角色图片资源【本条为 v1.3 最新修订】

由于扣子编程平台限制**单个上传文件不超过 20 MB**，原来的：

`species_assets_v1.zip`

已经拆成 3 个**相互独立的普通 ZIP 文件**：

- `species_assets_v1_part1.zip`
- `species_assets_v1_part2.zip`
- `species_assets_v1_part3.zip`

这三个 ZIP 共同组成同一套：

`species_assets_v1`

它们不是三套素材，也不是三个前端目录。

## 4.1 图片编号范围

按当前拆包约定：

- `species_assets_v1_part1.zip`：01–08
- `species_assets_v1_part2.zip`：09–16
- `species_assets_v1_part3.zip`：17–24

请分别解压三个 ZIP，把其中 **24 张 PNG 文件本身合并到同一个目录**：

```text
public/
└── assets/
    └── species/
        ├── 01_weekend-dog.png
        ├── 02_weekend-missing.png
        ├── 03_city-guide.png
        ├── ...
        ├── 23_banter-artist.png
        └── 24_invisible-mode.png
```

禁止建立：

```text
public/assets/species/part1/
public/assets/species/part2/
public/assets/species/part3/
```

也禁止形成：

```text
public/assets/species/species_assets_v1_part1/
```

最终网站只存在一个统一的：

`public/assets/species/`

目录。

## 4.2 图片命名绝对不能修改

24 张正式角色 PNG 文件名已经与数据库 `species_key` 固定绑定。

禁止：

- 重命名
- 翻译
- 删除 01–24 编号
- 修改英文 key
- 给图片追加 `-v1`
- 用哈希文件名替代并破坏现有数据库映射
- 使用旧原型占位图替代正式角色

示例：

```text
weekend-dog
→ /assets/species/01_weekend-dog.png

homebody
→ /assets/species/04_homebody.png

dinner-engine
→ /assets/species/10_dinner-engine.png

invisible-mode
→ /assets/species/24_invisible-mode.png
```

完整映射以：

`life_species_supabase_seed_manifest_v1.json`

为唯一核对依据。

Supabase 中：

`species_content.image_url`

必须与上述正式路径一致。

## 4.3 manifest.csv 最新规则

图片生成目录里原本可能存在：

`manifest.csv`

**这个 CSV 不需要上传给扣子，也不需要放进项目。**

如果某个 ZIP 中意外包含 `manifest.csv`：

- 忽略它；
- 不放入 `public/assets/species/`；
- 不将它作为数据库事实源；
- 不部署到生产网站。

项目唯一正式图片映射清单仍然是：

`life_species_supabase_seed_manifest_v1.json`

因此最终：

`public/assets/species/`

目录里应该只有 24 张正式 PNG。

## 4.4 图片存储要求

- PNG 不允许转成 Base64 存 PostgreSQL。
- 不允许把图片二进制写入普通数据库字段。
- 数据库只保存 `image_url`。
- 正式 PNG 使用静态资源 / CDN / Object Storage。
- 透明 PNG 不要强制加白色方形底板。
- 物种名称、标语、锐评等文字由 HTML/CSS 渲染，不要重新烘焙进角色图片。
- 如果为了网页性能生成 WebP，可以额外生成 WebP 派生文件，但不得删除或重命名正式 PNG 母图，也不得破坏现有 `species_key → PNG` 映射。

---

# 五、前端页面

至少实现：

```text
/                 首页
/test             24 道测试
/r/{share_code}   永久结果页
```

移动端优先，至少检查：

- 375 px
- 390 px
- 430 px

测试页要求：

- 一屏一题
- Q10 最多选 3 项
- Q15 最多选 5 项
- 答题过程轻量，不做传统心理测评风
- 可以本地缓存未完成答题进度，但最终结果不能只依赖 localStorage

---

# 六、永久结果分享

测试完成后必须生成：

`/r/{share_code}`

示例：

`/r/K7m2Qx9P`

要求：

- `share_code` 随机、唯一、不可预测
- 推荐 10 位 Base62
- 无需登录即可查看
- 分享链接刷新后不丢失
- 换浏览器/无痕窗口仍然可以查看
- 后续算法升级不得重新计算旧结果

永久结果必须读取已经冻结的数据，而不是重新运行新评分算法。

---

# 七、免费数据库优化

`result_snapshot` 采用最小快照。

只保存类似：

```json
{
  "schemaVersion": "result-snapshot-1",
  "testVersion": "mvp-1.2",
  "scorerVersion": "mvp-1.2-calibrated",
  "mainSpeciesKey": "weekend-dog",
  "secondarySpeciesKeys": [
    "dinner-engine",
    "dopamine-beast"
  ],
  "completedAt": "..."
}
```

要求：

- 单条目标 < 1 KB
- 原则上不超过 2 KB
- 不在 snapshot 重复保存完整 18 维度
- 不保存图片
- 不保存 Base64
- 不保存完整题库
- 不保存完整物种文案
- 不保存 HTML / CSS

18 个维度单独保存在：

`dimension_scores`

标签单独保存在各自字段。

不要给 `result_snapshot` 建不必要的大型 JSONB / GIN 索引。

---

# 八、API

至少实现：

## 开始测试

`POST /api/runs/start`

返回：

- `runId`
- `runToken`

`runToken` 为匿名写权限凭证。

数据库只保存 `run_token_hash`，不要保存明文 token。

## 完成测试

`POST /api/runs/{runId}/complete`

必须：

- 验证 `runToken`
- 验证完整 24 道答案
- 在服务端运行正式 scorer
- 写入 `test_version`
- 写入 `scorer_version`
- 写入主物种
- 写入 2 个副物种
- 写入 dimension_scores
- 写入 summon_tags
- 写入 food_tags
- 生成 share_code
- 写入最小 result_snapshot
- 标记 completed

该 API 必须幂等。

同一 run 重复 complete：

- 不重新算出不同结果
- 不生成第二个 share_code
- 不生成第二条完成记录

## 公开结果

`GET /api/results/{shareCode}`

允许公开返回：

- 主物种
- 副物种
- 结果页需要的 Buff
- summon tags
- food tags
- species content
- 正式图片 URL

禁止返回：

- 原始 24 道答案
- runToken
- run_token_hash
- Supabase 高权限密钥
- 不必要的内部数据库字段

## 结果反馈

`POST /api/runs/{runId}/feedback`

四档：

- 完全不像
- 有一点
- 挺像
- 太准了

用于以后第二轮算法校准。

---

# 九、视觉方向

整体视觉：

**动物卡通人格宇宙 + 手绘贴纸感 + 粗黑线条 + 人类物种图鉴 + 有点损但不低幼。**

禁止重新设计成：

- MBTI 四字母风
- 严肃心理咨询风
- 紫色神秘星空
- 雷达图人格报告
- 学术心理测评报告

结果页展示优先级：

1. 正式动物角色图
2. 主物种名称
3. 一句话标语 / 系统锐评
4. 两个副物种
5. 生活 Buff
6. 如何召唤我
7. 投喂指南
8. 如何与本物种相处
9. 典型症状
10. 分享卡

---

# 十、分享卡

分享卡必须使用当前 24 张正式动物 PNG。

至少展示：

- 主物种角色
- 主物种名称
- 一句话标语
- 2 个副物种
- 3 个最突出生活特征
- 系统锐评
- 永久结果页二维码

二维码必须指向：

`/r/{share_code}`

而不是首页。

朋友扫码后：

查看朋友结果  
→ 点击“测测我是什么生活物种”  
→ 进入 `/test`

第一版分享卡图片不要保存到 PostgreSQL。

---

# 十一、开发范围再次锁定

本 MVP 不要额外开发：

- 用户登录
- 微信 OAuth
- 好友系统
- 朋友互评
- 双人匹配
- 排行榜
- 评论
- 社区
- 私信
- AI 聊天
- 用户手动选择自己的物种

不要在本次任务中自行扩大范围。

---

# 十二、最终 P0 验收

完成前必须逐项验证：

- [ ] 24 道题全部可正常完成
- [ ] Q10 只能选 1–3 项
- [ ] Q15 只能选 1–5 项
- [ ] 正式评分只发生在服务端
- [ ] 使用 `mvp-1.2-calibrated`
- [ ] 旧 scorer 没有进入生产逻辑
- [ ] 24/24 fixture PASS
- [ ] deterministic PASS
- [ ] 两个副物种与主物种不同 family
- [ ] 输入非法值被拒绝
- [ ] Supabase Schema / Migration / RLS / Seed 均正确完成
- [ ] Seed 重复执行不生成重复数据
- [ ] `test_runs.scorer_version` 正确记录
- [ ] `runToken` 明文没有写入数据库
- [ ] Supabase service_role 不在前端 bundle
- [ ] complete API 幂等
- [ ] 永久结果路径为 `/r/{share_code}`
- [ ] 刷新结果不丢失
- [ ] 换浏览器打开分享链接可以查看
- [ ] 旧结果不会因为算法升级重新计算
- [ ] 公开 API 不返回原始 24 道答案
- [ ] 三个角色 ZIP 已全部正确解压
- [ ] 24 张 PNG 最终全部位于 `public/assets/species/`
- [ ] `public/assets/species/` 不存在 part1/part2/part3 子目录
- [ ] `manifest.csv` 未部署到 `public/assets/species/`
- [ ] 24 张角色图无 404
- [ ] 24 个 `species_key` 与 PNG 映射全部正确
- [ ] 没有继续使用旧占位图
- [ ] PNG 没有 Base64 存入数据库
- [ ] 375 / 390 / 430 px 页面无明显布局错误
- [ ] 分享卡二维码打开正确永久结果页
- [ ] 结果反馈可以保存

---

# 十三、完成后不要只说“已完成”

开发完成后请输出：

1. 实际使用的前端/后端技术栈；
2. scorer 的实际文件路径；
3. 服务端在哪里调用正式 scorer；
4. Supabase 5 个初始化 SQL 的执行结果；
5. Seed 结果：questions / dimensions / species 数量；
6. 当前所有 RLS policy；
7. 24 fixture 自动测试命令；
8. 自动测试完整结果；
9. 24 张图片最终项目路径和映射检查结果；
10. 确认没有把 `manifest.csv` 部署进图片目录；
11. 一个实际永久结果测试链接；
12. complete API 幂等测试结果；
13. 375 / 390 / 430 px QA 结果；
14. 本提示词 P0 验收清单逐项 PASS / FAIL。

---

# 十四、最终执行指令

请严格按照本 v1.3 提示词及交付包完成整个「生活物种」MVP。

特别注意：

**由于平台 20 MB 单文件限制，正式角色图片已经从原来的单个 `species_assets_v1.zip` 改成 3 个独立 ZIP。旧规范中所有“上传/解压单个 species_assets_v1.zip”的描述均被本 v1.3 覆盖。三个 ZIP 解压后必须合并为同一个 `public/assets/species/` 目录。`manifest.csv` 不上传、不部署、不作为正式映射依据。**

唯一正式图片映射依据：

`life_species_supabase_seed_manifest_v1.json`

唯一正式评分事实源：

`life_species_calibrated_scorer_v1.mjs`

任何 P0 验收项失败，都不能视为开发完成。
