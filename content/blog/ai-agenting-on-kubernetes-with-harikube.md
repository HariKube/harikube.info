---
title: "AI Agenting on Kubernetes with HariKube"
date: 2026-05-15
author: "Richard Kovacs"
description: "HariKube helps make Kubernetes more scalable, more efficient, and better suited for AI workloads."
categories: ["AI", "Microservice", "Infrastructure"]
tags: ["kubernetes", "agentic ai", "microservice", "infrastructure"]
featured_image: "/images/blog/ai-agenting-on-kubernetes-with-harikube.png"
---

HariKube helps us run **more AI workloads** on the same Kubernetes infrastructure, which can **reduce the need for expensive multi-cluster** expansion. It also provides a **platform model** where AI agents can interact through Kubernetes APIs and events instead of relying only on traditional database-driven coordination. This **makes AI platforms more scalable, more observable, and more efficient** to operate.

## What is the benefit of HariKube?

HariKube helps make Kubernetes **more scalable, more efficient, and better suited for AI workloads** by introducing a **horizontally scalable Kubernetes** control plane and a resource based **data sharding**, supporting multiple SQL databases.

### Let's numbers talk for themself

| Metric | HariKube with 6 databases | Vanilla K8s | Gain |
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

> For details please follow [Harikube vs Vanilla Kubernetes](/blog/harikube-vs-vanilla-kubernetes/) post.

---

### More pods can run on the same infrastructure

In a traditional Kubernetes setup, the **control plane and etcd can become a bottleneck** when there are many workloads, state changes, events, and scaling actions.

HariKube helps reduce that pressure, which means:

 - more pods can run in the same cluster
 - better scalability for AI and agent-based workloads
 - fewer control-plane bottlenecks

> 💡 With the same infrastructure, we can support more AI workloads.

---

### In standalone mode, it reduces the need for multi-cluster expansion

Many organizations introduce additional clusters when a single cluster **becomes too hard to scale or operate** efficiently.

HariKube pushes that limit further, so:

 - you do not need to create new clusters as early
 - operational complexity is lower
 - multi-cluster management costs are reduced
 - there is less networking, security, and governance overhead

> 💡 In standalone mode, HariKube allows us to scale further within one environment, reducing the need for costly multi-cluster architectures.

#### It is especially useful for AI because agents create many short-lived workloads

AI agents typically:

 - launch many small tasks
 - run in parallel
 - scale dynamically
 - trigger each other
 - generate a high volume of orchestration events

In many enterprise and banking use cases, these agent tasks also need to run in isolated or sandboxed environments for security, compliance, and risk control. That isolation is important, but it adds operational overhead because the platform has to create, schedule, manage, and tear down many short-lived secure execution environments.

Traditional Kubernetes can support this, but at scale the control plane can become a bottleneck when it has to handle both:

 - the high churn of agent workloads, and
 - the extra orchestration overhead introduced by sandboxing

HariKube is valuable here because it helps Kubernetes operate more efficiently under exactly this kind of pressure.

> 💡 AI agents do not just create many short-lived workloads — in regulated environments they often need to run in sandboxed containers as well, which increases security overhead. HariKube helps absorb that operational load more efficiently.

---

### As a Platform-as-a-Service, it enables agent-to-agent orchestration

This is one of the strongest messages for an AI-focused presentation.

If HariKube is used not only to run pods, but also as an **API-driven platform**, then:

 - agents do not have to coordinate only through a traditional database
 - they can interact through Kubernetes API objects
 - workflows, tasks, and states can be handled declaratively
 - one agent can create or update a resource that another agent watches and processes
 - this enables native agent-to-agent triggering

Why this matters for AI:

 - agents can be more loosely coupled
 - state and lifecycle are easier to observe
 - orchestration becomes more standardized
 - scaling and recovery can be handled more naturally by the platform

> 💡 With HariKube, AI agents do not just run on the platform — they can collaborate through the platform.

#### What does “replacing database calls with Kubernetes API calls” mean?

In a traditional model:

 - one service writes to a database
 - another service reads from it
 - workflow logic is spread across application code

In a HariKube / platform model:

 - one agent creates or updates a Kubernetes resource
 - another agent reacts to that change
 - state, triggers, and orchestration are managed through the platform

Benefits:

 - more consistent orchestration
 - better auditability
 - more declarative workflows
 - easier automation
 - more natural agent-to-agent interaction

> 💡 Instead of moving records between services through a database, we manage shared state and events through the platform.

> For details please follow [The Future of Kubernetes PaaS and Kubernetes-native Service Development is Here](/blog/the-future-of-kubernetes-paas-and-kubernetes-native-service-development-is-here/) post.

---

That’s it! If you’re ready to move beyond traditional Kubernetes scaling limits and build an AI-ready platform with lower multi-cluster overhead, HariKube offers a new operating model. In standalone mode, it helps you run more workloads efficiently in a single environment. As a platform, it enables secure, event-driven, agent-to-agent orchestration through Kubernetes-native APIs — making it easier to scale AI use cases with stronger control, observability, and business efficiency.

Thank you for reading, and feel free to [share your thoughts](https://github.com/HariKube/harikube/discussions).