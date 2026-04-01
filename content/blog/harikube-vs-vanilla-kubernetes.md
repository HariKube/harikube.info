---
title: "HariKube vs. Vanilla Kubernetes: A Deep Dive into Performance and Correctness"
date: 2026-04-01
author: "Richard Kovacs"
description: "This post covers two things: how fast it is, and whether you can trust it."
categories: ["Infrastructure"]
tags: ["kubernetes", "scalability", "infrastructure"]
featured_image: "/images/blog/harikube-vs-vanilla-kubernetes.png"
---

{{< toc >}}

Kubernetes has a dirty secret: **ETCD is a bottleneck**. The default storage backend for Kubernetes was designed for configuration data, not for the scale modern clusters demand. As cluster resource counts grow into the tens or hundreds of thousands, the Kubernetes API server begins to crack - eating RAM, slowing down, and eventually dying with an OOM kill. The reason is simple: ETCD lacks server-side filtering, so the Kubernetes API server must load entire datasets into memory to filter records.

**HariKube** is a fork of [Kine](https://github.com/k3s-io/kine) that replaces ETCD with SQL databases (PostgreSQL, MySQL, [full list](/docs/overview/#-supported-databases)) as the Kubernetes storage backend. But more than a simple swap, HariKube introduces **resource-group/type based sharding and namespace isolation**, distributing cluster state across multiple parallel databases to eliminate the single-writer bottleneck entirely.

This post covers two things: how **fast** it is, and whether you can **trust** it.

## 📈 The Performance Test

### 🕵️‍♀️ Benchmark Details

Both benchmarks were run under realistic, production-like conditions with Kubernetes API validation and RBAC fully enabled. The load was generated using [k6](https://github.com/grafana/k6).

 - Specs: Intel Ultra 7 165H 18 Core 4GB RAM (single machine ran everything including the benchmark itself)
 - Duration: The test execution was 1 hour
 - Write test: Each iteration creates 6 different types of custom resources in parallel
 - Read test: Each iteration reads back the created custom resources via label selector in parallel

> If you want to run the benchmark on your own environment, please follow the contest we launched on [GitHub](https://github.com/HariKube/kubernetes-performance-challenge/blob/main/README.md).

#### Vanilla Kubernetes with 3 node ETCD cluster:

> 💀 The test execution has been OOM Killed at the middle of the test.

{{< output >}}checks_succeeded...: 100.00% 51236 out of 51236
checks_failed......: 0.00% 0 out of 51236
http_req_duration..............: avg=799.54ms min=3.87ms med=82.39ms max=4.17s p(90)=2.47s p(95)=2.82s
http_req_failed................: 0.00% 0 out of 51236
http_reqs......................: 51236 24.976013/s

level=error msg="test run was aborted because k6 received a 'interrupt' signal" make: *** [Makefile:589: k6s-start] Error 105
{{< /output >}}

The vanilla etcd run didn't just slow down, it **died**. The Kubernetes API server was OOM-killed mid-test.

This is a well-known failure mode: under heavy load the API server's in-memory watch cache grows unbounded. ETCD pushes all events to the API server, which filters in memory, the O(n) RAM usage proportional to the number of objects. Under sustained load, it runs out of memory.


#### HariKube with 6 PostgreSQL databases

> ✅ The test finished without a single error.

{{< output >}}checks_succeeded...: 100.00% 429180 out of 429180
checks_failed......: 0.00%   0 out of 429180
http_req_duration..............: avg=167.17ms min=7.75ms   med=71.06ms max=3.71s  p(90)=398ms p(95)=543.76ms
http_req_failed................: 0.00%  0 out of 429180
http_reqs......................: 429180 119.106435/s
{{< /output >}}

The key architectural difference is where filtering happens.

In vanilla Kubernetes, the API server fetches raw data from ETCD and filters it in-memory. In HariKube, filtering is pushed down into the database layer - SQL is exceptionally good at this. This means:

 - The API server never needs to hold entire resource lists in memory
 - Memory consumption becomes O(1) rather than O(n) relative to cluster size
 - The watch cache can be disabled entirely

On top of this, sharding by resource type means all 6 PostgreSQL databases serve requests in parallel. A flood of one resource writes doesn't starve other resource reads. Each resource domain gets its own I/O path, connection pool, and query planner.

The result: **429,180 requests completed successfully vs. 51,236 before the crash. More than 8x the request volume, at ~5.2x lower tail latencies**.

> ⚠️ This benchmark used only 6 databases. Based on our calculations the optimum number of databases is around 24.

### 🏁 Summary of test results

| Metric | HariKube | Vanilla K8s | Gain |
| - | - | - | - |
| Throughput | 119 req/s ✅ | 25 req/s ❌ | 4.8x |
| Success Rate | 100% ✅ | KILLED ❌ | not comparable |
| Latency average | 167ms ✅ | 799ms ❌ | 4.8x |
| Latency p95 | 543ms ✅ | 2820ms ❌ | 5.2x |
| Latency p90 | 398ms ✅ | 2470ms ❌ | 6.2x |
| Test Duration | 60m ✅ | ~34m (OOM) ❌ | not comparable |
| Stability | Completed ✅ | KILLED ❌ | not comparable |
| Objects Handled | 215k ✅ | ~26k (crashed) ❌ | 8x |
| Requests Handled | 429k ✅ | ~51k (crashed) ❌ | 8x |

#### Understanding p(95) Latency

The p(95) latency means that 95% of all requests completed faster than this value, and only the slowest 5% took longer. It is one of the most honest measures of real-world user experience, because averages can hide outliers while p(95) captures what your worst typical request actually looks like. In the vanilla Kubernetes ETCD benchmark, the p(95) latency was 2.82 seconds, meaning 1 in 20 requests kept the client waiting for nearly 3 seconds. This is a threshold that would be noticeable and painful in any interactive or automated system. HariKube brought that number down to 543ms, a 5.2x improvement.

In practice, this means that even your slowest requests under heavy load are now well under a second. That is not just a performance win, it is the difference between a cluster that feels responsive under pressure and one that feels like it is about to fall over. **The 543ms demonstrates that HariKube was handling requests in a stable, controlled manner throughout the entire run, with significant headroom remaining before approaching any system limit**.

## 🤹 The Correctness Test

Performance without correctness is worthless. So how does HariKube hold up against the Kubernetes API conformance test suite?

Our set of Kubernetes features flags are:
 - AllAlpha=false
 - WatchList=true, WatchListClient=true
 - OrderedNamespaceDeletion=true
 - VolumeAttributesClass=true
 - CustomResourceFieldSelectors=true
 - MutatingAdmissionPolicy=true`

### 🛃 Test Scope

The following Kubernetes official E2E test suites were run on each change:

{{< code bash >}}--focus-regex=sig-api-machinery|sig-apps|sig-auth|sig-instrumentation|sig-scheduling
{{< /code >}}

These cover the most critical API surface areas:

 - sig-api-machinery: core CRUD, watch, pagination, admission
 - sig-apps: Deployments, StatefulSets, DaemonSets, ReplicaSets
 - sig-auth: RBAC, ServiceAccounts, Secrets
 - sig-instrumentation: Metrics, events
 - sig-scheduling: Pod scheduling, affinity, taints

### 🚫 What Was Skipped

 {{< code bash >}}--skip-regex=Alpha|Flaky|[Aa]uto[Ss]cal|mysql|zookeeper|redis|CockroachDB|
ClusterTrustBundle|SchedulerAsyncPreemption|BoundServiceAccountTokenVolume|
StorageVersionAPI|StatefulUpgrade|CoordinatedLeaderElection|
capture the life of a ResourceClaim|should rollback without unnecessary restarts|
should grab all metrics from|compacted away
{{< /code >}}

The skips fall into five categories:

 1. Tests that are flaky on vanilla ETCD too. Any test excluded here was excluded because it flaps on the vanilla ETCD baseline in our CI. Using flaky tests as a correctness signal produces noise, not insight. We only count stable tests.
    - Flaky, capture the life of a ResourceClaim, should rollback without unnecessary restarts, should grab all metrics from, compacted away
 1. Features off by default. Some tests requires feature gate to be enabled.
    - ClusterTrustBundle, SchedulerAsyncPreemption, BoundServiceAccountTokenVolume, StorageVersionAPI, CoordinatedLeaderElection
 1. Tests require multi node cluster. Our CI environment spins up a single node Kubernetes instance. The reason for this is we are developing a storage solution under Kubernetes, so running multiple nodes for each changes generates unnecessary costs.
    - [Aa]uto[Ss]cal
 1. Missing cluster resource. The test expects some pre-created resource, which we do not create in our CI.
    - StatefulUpgrade
 1. Alpha/unrelated workloads. Some tests are out of scope for this environment.
    - Alpha, mysql, zookeeper, redis, CockroachDB

> ✅ HariKube passes all stable, relevant Kubernetes API conformance tests across sig-api-machinery, sig-apps, sig-auth, sig-instrumentation, and sig-scheduling.

Across all five test domains, HariKube passed a total of **347** tests without a single failure. The largest suite, sig-api-machinery, contributed 171 passing tests, covering the full breadth of core Kubernetes API behavior including CRUD operations, watch streams, paginated list requests, and admission control. **347 passing tests across the most critical Kubernetes API surface areas is a strong signal that HariKube is not just fast, it is correct too**.

This means **standard Kubernetes workloads** like Deployments, RBAC, scheduling, event streaming, API pagination, watchers work correctly on HariKube's multi PostgreSQL backend, **without modification**.

#### Kine official tests

For reference, Kine's official test suite only covers `sig-api-machinery` with a broad skip list. HariKube runs five sig groups with a precisely documented, minimal skip set.

{{< code bash >}}--focus-regex=sig-api-machinery
--skip-regex=StorageVersionAPI|Slow|Flaky|Feature:OffByDefault
{{< /code >}}

## 🧭 Summary

HariKube isn't a prototype or a toy. It is a production-grade Kubernetes storage backend that:

 - Handles ~4.8x more throughput than a vanilla 3-node etcd cluster
 - Achieves ~5.2x lower tail latencies under sustained load
 - Doesn't OOM-kill your API server under pressure
 - Passes the Kubernetes conformance tests that matter for real workloads

The secret is architectural: **push filtering into the database, shard by resource type, and let SQL do what SQL was built for**.

---

That's it! If your cluster is hitting ETCD's ceiling, HariKube is worth a look. The architecture is sound, the numbers are real, and the tests pass. The only question left is how far it can scale. We are actively finding out, and you can too, via the [performance contest](https://github.com/HariKube/kubernetes-performance-challenge/blob/main/README.md).

Thank you for reading, and feel free to [share your thoughts](https://github.com/HariKube/harikube/discussions).