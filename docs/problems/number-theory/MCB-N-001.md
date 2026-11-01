---
id: MCB-N-001
title: 证明 n 的五次方减 n 被 30 整除
category: 数论
difficulty: 2
tags:
  - 整除
  - 同余
  - 费马小定理
stage: 初中竞赛
source: 经典问题（公开领域）
verified: true
---

# 证明 n 的五次方减 n 被 30 整除

<ProblemMeta />

## 题目

证明：对任意整数 $n$，都有

$$
30\mid n^5-n.
$$

<details class="solution">
<summary>查看解答</summary>

## 解答

首先，$n^5-n=n(n-1)(n+1)(n^2+1)$。三个连续整数 $n-1,n,n+1$ 中必有一个为偶数、一个为 $3$ 的倍数，因此 $6\mid n^5-n$。

再对模 $5$ 分类。若 $5\mid n$，结论显然；若 $5\nmid n$，由 Fermat 小定理有 $n^4\equiv1\pmod5$，从而 $n^5-n\equiv0\pmod5$。故 $5\mid n^5-n$。

因为 $(6,5)=1$，所以 $30\mid n^5-n$。

</details>

