---
title: "Kubernetes Scaling and Performance Guide"
layout: "simple"
weight: 1
description: "Understand Kubernetes control-plane and etcd bottlenecks, review HariKube benchmarks, and plan a scaling evaluation for your own workload."
---

Scaling Kubernetes applications is not only about adding worker nodes. The number of API objects, read and write patterns, WATCH traffic, and storage topology all affect control-plane behavior. This guide connects the architectural background with benchmarks and deployment documentation.

## 1. Understand the Bottleneck

Start with [the Kubernetes etcd bottleneck and AI training](/blog/kubernetes-etcd-bottleneck-ai-training/) for a discussion of control-plane pressure and infrastructure trade-offs. Then read the [HariKube architecture overview](/docs/overview/) for supported databases, deployment models, and current limitations.

## 2. Evaluate the Benchmark Evidence

Read [HariKube vs. Vanilla Kubernetes](/blog/harikube-vs-vanilla-kubernetes/) alongside the [performance and database-routing examples](/features/performance/). Compare hardware, software versions, workload shape, latency, throughput, and error rates before applying any result to your own environment.

Storage-side filtering can reduce cache-related memory pressure, but does not establish constant total memory use or unlimited API-server capacity. Test controller caches, database replicas, and visibility requirements alongside throughput; see the [storage access and consistency guidance](/features/consistency/).

The [Kubernetes Performance Challenge](/blog/kubernetes-performance-challenge/) links to the challenge materials for readers who want to investigate the workload themselves.

## 3. Plan Your Own Evaluation

Use the [installation guide](/docs/installation/) to prepare an evaluation environment and the [monitoring documentation](/docs/monitoring/) to decide what to observe. Test the API operations and resource sizes your application actually uses, rather than relying on a single headline throughput number.

For a personalized next step, [request a free Kubernetes scalability assessment](/kubernetes-assessments/). Review [HariKube editions and licensing](/editions/) when you are ready to compare deployment options.

## Related Learning Paths

- [AI infrastructure on Kubernetes](/topics/ai-infrastructure/) for short-lived workloads and agent coordination.
- [Kubernetes operators and custom APIs](/topics/kubernetes-operators/) for application-level resource and API design.
