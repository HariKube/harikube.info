---
title: "Kuernetes Performance Challenge"
date: 2026-02-27
author: "Richard Kovacs"
description: "Join to the contest! Be the best!"
categories: ["Open-Source", "Infrastructure"]
tags: ["kubernetes", "scalability", "infrastructure"]
featured_image: "/images/blog/kubernetes-performance-challenge.png"
---

{{< toc >}}

## The Kubernetes Performance Challenge, Join to the contest!

We were interested in how far we can go with Kubernetes. While it can scale up applications to the space (beyond the clouds 😜), Kubernetes itself fails to scale gracefully. Or maybe not?

**Think we're exaggerating? Prove us wrong!**

> The contest is running on [GitHub](https://github.com/HariKube/kubernetes-performance-challenge/blob/main/README.md).

## 🚀 The Challenge

Participants are invited to execute standardized performance tests against the Kubernetes to measure latency, throughput, and system stability.

> Participation is free and requires no purchase.

## 🏆 The Grand Prize

The ultimate reward for pushing the boundaries of cloud engineering.

Every participant who achieves a higher score than ours will receive a custom-manufactured, limited-edition technical shirt.

The Design:
 - Front: Kubernetes Performance Challenge
 - Back: I BEAT HARIKUBE
 - Sleeve: Your specific performance metrics (like number of objects, latencies, and success rate) printed as a permanent record of your achievement.

## 🎖️ The "First Ten" Grant

The first 10 participants to submit a valid benchmark report (regardless of their final ranking) will receive a exclusive one-year HariKube [Pro Edition](/editions/) License.

## 🎲 The "Second Chance" Draw

Don't be discouraged if you missed the first ten or couldn't beat our score. At the conclusion of the challenge, one additional HariKube [Pro Edition](/editions/) License will be raffled off among all participants who submitted a valid report but haven't won through the other categories.

### 📅 Contest Period

 - Starts at 2026.02.25. 18:00 GMT
 - Ends at 2026.05.25. 22:00 GMT

## 📜 Rules and Constraints

To ensure valid and comparable results, all participants must adhere to the following constraints:

 - **Discussion Protocol**: Upon completion of the challenge, all winners (who beat our score) will be invited to a friendly discussion regarding the results, architectural insights, and the underlying optimization strategies. This ensures a high-level technical exchange within a vetted peer group.
 - **RBAC Policy Enforcement**: Role-Based Access Control must remain enabled and fully functional. Performance gains achieved by bypassing security layers are disqualified.
 - **Feature Parity**: All core Kubernetes features, including AMission Controllers and standard API validation, must be active. No "stripping" of the environment is permitted.
 - **No Shortcuts**: Any modification to the core that compromises data consistency will result in an invalid run.
 - **Zero Tolerance for Instability**: Database or Kubernetes crash lead to immediate disqualification.

> **Integrity & Honor**: We are aware that benchmarks can be manipulated, and no amount of technical restriction can fully prevent dedicated cheating. However, this challenge is a matter of professional honor. We are not fools - any discrepancies will immediately surface during the discussion. Let’s not ruin the collective experience for 15 minutes of fame; if you can’t beat the baseline honestly, use the opportunity to learn how to improve.

 - Winners are responsible for any local taxes or customs duties related to their prizes.
 - HariKube reserves the right to disqualify any submission that violates the spirit of the challenge. Our decision is final and non-negotiable.
 - By submitting a PR, you consent to the public display of your GitHub username on the leaderboard. Personal information for prizes will be handled temporary and will not be shared with third parties.
 - Legal Disclaimer: This is a skill-based challenge. Participation is free. By submitting your results, you acknowledge that the final validation of any score is subject to the Technical Discussion Protocol to ensure compliance with the rules.
   
### Score calculation

`floor(checks_total / (http_req_duration.med*0.2 + http_req_duration.p90*0.3 + http_req_duration.p95*0.5) * pow(1 - checks_failed / checks_total, 7))`

> http_req_duration counted in ms

### 🛠️ Getting Started

 - **Deployment**: Bring your own Kubernetes.
 - **Benchmarking**: Execute our [k6 test](https://github.com/HariKube/kubernetes-performance-challenge/blob/main/k6_custom_resource_6_read_write.js) against on your cluster.
   - Run `make` command for details.
 - **Create a PR**: Share your results via Pull-Request on the challenge repository. The PR must contains:
   - The data is collected under `results/${USER}` directory
   - Summary of k6 benchmark execution, example location: `results/${USER}/1771941557_20_sum.json`
   - Collected benchmark data, example location: `results/${USER}/1771941557_20.json`
   - Updated `Current Leaderboard` in `README.md`
   - If you have the highest score; update `Leader Benchmark Details` in `README.md` based on the example

### 🕵️ Benchmark Details

 - The test execution is 1 hour
 - Define concurrency on your own taste
 - Each iteration creates 6 different type of custom resources in parallel
 - Each iteration reads beck the created custom resources via label selector in parallel

## 🔀 Join to the Contest

> For more details please visit the [GitHub](https://github.com/HariKube/kubernetes-performance-challenge/blob/main/README.md) page where contest is running.
