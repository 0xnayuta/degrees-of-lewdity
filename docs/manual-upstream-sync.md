# 手动同步上游（Manual Upstream Sync）

> 本仓库（`0xnayuta/degrees-of-lewdity`）是 `gitgud.io/Vrelnir/degrees-of-lewdity` 的 GitHub 镜像。
> `master` 每 6 小时由 GitHub Actions 自动同步（`.github/workflows/sync-upstream.yml`）。
> 本文档覆盖两种情况下的**手动**同步：① 自动同步失败需要人工介入；② 把上游更新并入个人开发分支（如 `0xnayuta/repo-analysis`）。
> 供仓库所有者与后续 agent 直接按步骤执行。

---

## 0. 背景速览（先读，30 秒）

| 事项 | 内容 |
|---|---|
| 上游仓库 | `https://gitgud.io/Vrelnir/degrees-of-lewdity.git`（公开，匿名可读） |
| 自动同步 | `.github/workflows/sync-upstream.yml`，位于 **master**；`schedule` cron `0 */6 * * *`（UTC）+ `workflow_dispatch` 手动触发 |
| 自动同步会动 | `master`（合并上游 master）、`dev`（`git push origin upstream/dev:dev`）、`tags`（`git push origin --tags`） |
| 自动同步绝不碰 | `0xnayuta/*` 及其他主题分支；绝不 force；绝不反向推送 |
| master 现状（2026-08-07） | `41993d3f`（上游 0.5.11.9）→ `acbc96396`（workflow 提交）→ `06c3bb5cb`（sanity 门禁） |
| 上游 master 现状（2026-08-07） | `41993d3f`（与克隆时一致，尚无新提交） |
| 个人分支 | `0xnayuta/repo-analysis` = `e7e5e4568`（深度扫描报告） |

**核心概念**：master 是"已同步镜像"；个人分支需要上游内容时，把 master 合并进来即可（见 §5）。

---

## 1. 何时需要手动同步

1. **个人开发分支需要上游新内容**（最常见）；
2. **自动同步运行失败**——查看 GitHub Actions → Sync upstream 的运行记录，失败原因见 §9；
3. **需要立即拿到上游最新内容**（不想等 6 小时定时任务）。

---

## 2. 前置检查（判断是否有更新）

```bash
# 首次使用才需要添加 upstream remote
git remote add upstream https://gitgud.io/Vrelnir/degrees-of-lewdity.git

# 拉取最新状态
git fetch origin
git fetch upstream

# 比较：两个哈希不同说明上游有更新
git rev-parse HEAD               # 本地 master
git rev-parse upstream/master    # 上游 master
```

---

## 3. 手动同步 master（复刻自动 workflow 的行为）

```bash
git checkout master
git pull origin master
git merge --no-edit upstream/master   # 关键：用普通合并，不要用 --ff-only
git push origin master
```

说明：

- master 上存在 fork 独有提交（`.github` workflow 等），上游推进后**必然产生合并提交**——这是设计行为，不是异常（原因见 §4）；
- 该操作与自动同步幂等：master 已最新时 `merge` 输出 "Already up to date"，push 为 no-op；
- 手动同步后，自动 workflow 的下一次运行会自动跳过（无更新）。

---

## 4. 为什么不能 `--ff-only` / force

- **快进（FF）**要求"本地 master 的历史包含上游最新提交"（本地是上游的祖先）。本地有上游没有的 `.github` 提交 → 永远不满足 → 只能合并。看到 "Not possible to fast-forward" 属正常。
- **force push master**：GitHub 默认禁止对默认分支 force push；即便放开，也会覆盖本地提交（包括 workflow 文件）。**永远不要 force master**。
- 正确的历史形态（每次上游更新后）：

```
         U2 ──► U3                    ← 上游提交（平行线）
        /                \
41993d3f ──► acbc96396 ──► 06c3bb5cb ──► M（合并提交，github-actions[bot] 署名）
```

---

## 5. 同步个人分支（如 `0xnayuta/repo-analysis`）

### 方式 A：merge（推荐，零风险）

```bash
git checkout 0xnayuta/repo-analysis
git merge master          # 等价简写：git pull origin master
git push origin 0xnayuta/repo-analysis
```

- 自己的提交原样保留，普通推送即可（不需要 force）；
- 个人分支目前只有 `docs/repo-deep-scan-report.md`，与上游内容重叠的概率几乎为零。

### 方式 B：rebase（进阶，历史更干净，需 force）

```bash
git checkout 0xnayuta/repo-analysis
git rebase master
git push --force-with-lease origin 0xnayuta/repo-analysis
```

- 把自己的提交"重放"到 master 最新之上，分支历史成一条直线；
- 会改写提交哈希，**必须** `--force-with-lease`（个人分支无保护规则，安全）；
- 仅限个人分支使用；有未推送的本地提交时先推送/提交完再 rebase，避免混乱。

---

## 6. 处理冲突

- merge 冲突：`git merge` 列出 `CONFLICT` 文件 → 编辑保留两边内容 → `git add <文件>` → `git commit`（用自动生成的合并消息即可）；
- rebase 冲突：解决后 `git add <文件>` → `git rebase --continue`；
- 本仓库冲突极罕见；若冲突文件涉及 `.github/` 或 `docs/`，优先保留 fork 侧内容。

---

## 7. 同步 dev 与 tags（自动 workflow 已覆盖，手动可选）

```bash
git fetch upstream
git push origin upstream/dev:dev   # 若被远端拒绝（非快进），说明 dev 有本地提交——属正确行为，需人工决定
git push origin --tags             # 幂等，只推缺失 tag
```

---

## 8. 验证推送成功

```bash
git status -sb                                        # 应显示无 ahead/behind
git ls-remote origin refs/heads/master refs/heads/0xnayuta/repo-analysis
git log --oneline -3 master
```

---

## 9. 注意事项（agent 必读）

1. **`.github/` 被根 `.gitignore` 的 `.*` 规则忽略**（上游 GitLab 项目遗留）。新增/修改 workflow 文件必须 `git add -f`；不要修改 `.gitignore` 本身。
2. **workflow 文件必须留在 master**：`schedule` 触发器只认默认分支上的文件。把它挪走 = 定时同步失效。
3. **单向镜像**：不要向 gitgud.io 推送任何东西。
4. **force 红线**：master 永不 force；个人分支 force 必须 `--force-with-lease`。
5. **手动触发自动同步**：`gh workflow run sync-upstream.yml`（需 gh 已登录仓库所有者账号）。
6. **sanityCheck 门禁语义**（自动同步内置）：脚本无失败退出码、输出含 ANSI 色码、上游树本身有数百条既有告警，因此门禁只把**本次同步实际改动文件**中的**结构性破坏类**发现（TripleOpen、Missing*Bracket、AccidentalAssignmentInIf 等 27 种）当作失败并中止推送；`check.py` 未闭合报告、一次性变量、拼写等仅记录。手动复跑：`echo | ./sanityCheck.sh`（结尾 `read -p` 需输入，`echo |` 即喂一个回车）。
7. **并发**：避免在自动 workflow 运行进行中手动 push 相同分支（极小概率竞争）；两者幂等，错开即可。
8. **上游变更**：上游 URL 或分支改名时，同步改 `workflow` 与本文档中的 remote URL 一处即可。
9. **自动同步失败排查**：打开 Actions → Sync upstream → 失败步骤日志。常见原因：① gitgud.io 不可达（重跑即可）；② sanity 门禁命中（日志 `::error` 列出具体文件与检查项，人工确认是否真问题）；③ dev 推送被拒（dev 有本地提交，需人工处理）。
10. **状态快照会过时**：本文档 §0 的提交哈希是 2026-08-07 的记录，后续以 `git log`/`git ls-remote` 实测为准。
