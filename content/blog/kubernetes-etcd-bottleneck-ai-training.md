---
title: "The Kubernetes etcd Bottleneck Is Now an AI Infrastructure Problem"
date: 2026-05-19
author: "Andras Szanto"
description: "AWS rebuilt its etcd storage layer to run 100K-node AI clusters. Here is what that means for everyone not on EKS, and why the etcd limit is now an AI problem."
categories: ["AI", "Infrastructure"]
tags: ["kubernetes", "etcd", "ai training", "infrastructure", "eks", "etcd replacement", "control plane"]
featured_image: "/images/blog/kubernetes-etcd-bottleneck-ai-training.png"
---

The **Kubernetes etcd bottleneck** has always existed. For most clusters, it stayed quiet. AI training workloads changed that. When Amazon announced in July 2025 that EKS now supports 100,000 nodes in a single cluster, they buried a critical detail three paragraphs in: to make it work, they had to **rebuild the etcd storage layer from scratch**. That is not a tuning decision. It is an admission that standard Kubernetes was not ready for AI at scale -- and that AWS had to fix it in private.

This post explains why **etcd limits are now an AI infrastructure problem**, what Amazon actually built, and why their solution leaves most of the market still exposed.

---

## Why AI Training Breaks the Kubernetes etcd Limit

Kubernetes was designed for stateless web services. Moderate object counts, predictable churn, manageable control plane load. The etcd limits that existed on paper rarely became a problem in practice.

AI training clusters are a different workload entirely:

- A single training job at scale involves **hundreds of thousands of pods**
- Scheduling decisions run continuously across **millions of Kubernetes objects**
- Control plane operations run for **days or weeks without pause**
- Failure is not gradual -- when etcd hits its limit, **writes stop and the cluster halts**

The existing public documentation shows where those limits sit. Red Hat caps recommended namespaces at **5,000** and prescribes manual defragmentation as the mitigation. Google Kubernetes Engine sets a hard **6 GB etcd database size limit** -- roughly one million Kubernetes objects -- and stops accepting writes when you hit it. Microsoft Azure acknowledges etcd performance as a control plane scaling constraint and recommends a multi-cluster architecture as the workaround.

None of these are configuration problems. They are structural limits in the storage layer itself. At AI training scale, you hit them inside a single job.


## What Amazon Built to Get Past the etcd Bottleneck

Amazon's announcement names two production users: **Anthropic**, running Claude, and **Amazon's own AGI team**, running Nova. Both needed infrastructure that standard Kubernetes could not provide.

The blog describes what it took:

> *"A reimagined etcd storage layer for efficient state management."*

That phrase covers a full architectural rebuild. According to Amazon's technical deep dive, they replaced Raft consensus with an internal journal service, replaced the bbolt backend with an in-memory design, and partitioned the keyspace so different key ranges are handled independently. The result eliminates the single-leader bottleneck that makes standard etcd break at scale.

The outcome for Anthropic: write API calls completing within 15ms improved from **35% of requests to consistently above 90%**. The test cluster contained over **10 million Kubernetes objects**, with an aggregate etcd database size across partitions of **32 GB** -- more than five times the limit Google publishes for standard clusters.

That is not a marginal improvement. It is the difference between an architecture that fails under AI workloads and one rebuilt to handle them.


## The Gap: This etcd Replacement Lives Only Inside AWS

Here is what the announcement does not say: this is not a Kubernetes feature. It is not in upstream etcd. It is not available through the CNCF ecosystem.

It is a **proprietary AWS infrastructure change**, delivered through a managed service, on AWS hardware, to customers who are individually onboarded. The capability is explicitly positioned for AI/ML at ultra scale -- not general availability.

The rest of the market is still running the original architecture:

- **GKE** replaced etcd with a Spanner-based backend for its largest clusters -- also proprietary, also Google-only
- **AKS** recommends fleet-based multi-cluster as the answer to etcd performance constraints
- **OpenShift, Rancher, and on-premises** deployments run standard etcd with the same limits Red Hat documents

<br>

| Platform | etcd approach at AI scale | Available to |
|---|---|---|
| Amazon EKS | Rebuilt: journal service, in-memory backend, partitioned keyspace | AWS customers, invite-only |
| Google GKE | Replaced with Spanner-based backend | GCP customers |
| Microsoft AKS | Multi-cluster fleet as workaround | AKS customers |
| OpenShift / Rancher / on-prem | Standard etcd | Everyone -- with the original limits |

<br>

According to Gartner, **95% of new AI deployments will use Kubernetes by 2028**. The number of GPU-powered instances running on Kubernetes has doubled in the past year. The demand is here. The etcd replacement solutions are locked inside two cloud vendors' proprietary infrastructure.

---

## HariKube: The Open Answer to the Kubernetes etcd Limit

HariKube replaces etcd as the Kubernetes storage layer with a **distributed, database-agnostic architecture** that maintains full Kubernetes API compatibility. It does not require AWS infrastructure, a specific cloud vendor, or an onboarding programme.

The benchmark results show what happens when you remove the etcd constraint:

| Metric | HariKube (6 DB) | Vanilla Kubernetes | Gain |
|---|---|---|---|
| Throughput | 119 req/s | 25 req/s | 4.8x |
| Success Rate | 100% | KILLED (OOM) | not comparable |
| Latency average | 167ms | 799ms | 4.8x |
| Latency p95 | 543ms | 2820ms | 5.2x |
| Objects Handled | 215,000 | ~26,000 (crashed) | 8x |
| Stability | Completed (60 min) | Crashed (~34 min) | not comparable |

> For benchmark details see [HariKube vs Vanilla Kubernetes](/blog/harikube-vs-vanilla-kubernetes/).

These are the same failure modes Amazon solved inside EKS. The difference is that HariKube operates at the Kubernetes API storage interface: if it speaks the Kubernetes API, it works.

Amazon's announcement is confirmation that the problem is real, that it matters at the scale AI demands, and that solving it requires a full architectural rebuild. What they built works. It is also available to exactly one cloud vendor's customers, on that vendor's hardware, under an invite-only programme.

The other 90% of the Kubernetes market running AI workloads still needs an answer.

Thank you for reading, and feel free to [share your thoughts](https://github.com/HariKube/harikube/discussions).
