---
id: MCB-G-001
title: 三角形中位线定理
category: 几何
difficulty: 1
tags:
  - 三角形
  - 相似
  - 中位线
stage: 初中竞赛入门
source: 经典定理（公开领域）
verified: true
---

# 三角形中位线定理

<ProblemMeta />

## 题目

在三角形 $ABC$ 中，点 $D,E$ 分别是边 $AB,AC$ 的中点。证明：$DE\parallel BC$，且 $DE=\frac12BC$。

<details class="solution">
<summary>查看解答</summary>

## 解答

因为 $D,E$ 分别是 $AB,AC$ 的中点，所以

$$
\frac{AD}{AB}=\frac{AE}{AC}=\frac12.
$$

又 $\angle DAE=\angle BAC$，故 $\triangle ADE\sim\triangle ABC$。因此对应角相等，得到 $DE\parallel BC$；同时

$$
\frac{DE}{BC}=\frac{AD}{AB}=\frac12,
$$

即 $DE=\frac12BC$。

</details>

