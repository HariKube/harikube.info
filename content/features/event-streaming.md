---
title: "Event Streaming and Shared State"
layout: "feature"
description: "Connect shared Kubernetes resource state with asynchronous event streams through HariKube's Kafka integration."
badge: "Experimental Streaming"
badgeColor: "#4f46e5"
aliases: ["/docs/event-streaming/"]
features:
  - title: "Shared Resource State"
    description: "Use a common Kubernetes resource model so services, controllers, and agents can coordinate around application state."
  - title: "Asynchronous Event Delivery"
    description: "Explore Kafka connectors for bringing events into resource state and publishing changes to stream consumers."
  - title: "Complementary Interfaces"
    description: "Choose Kubernetes resource operations or asynchronous streams according to your application's access, delivery, and recovery needs."
  - title: "Experimental Integration"
    description: "Verify connector availability and test ordering, retries, visibility, and permissions for the build you evaluate before relying on it."
---

{{< ld-docs >}}

## 🧪 Experimental Integration {#experimental-integration}

HariKube's Kafka integration is experimental. The [architecture article](/blog/kubernetes-is-harikubes-query-language-control-protocol-and-application-interface-for-managing-data-streams/) describes the proposed connector model and links to a development build. Do not assume that those connectors are included in every stable release or ready for production use. Verify availability and behavior for the version you evaluate.

## 🔀 Two Interfaces, Different Responsibilities {#two-interfaces-different-responsibilities}

- **Kubernetes APIs** provide resource operations, schemas, authorization, and watches for managing application state. Controllers and agents can observe resources and reconcile their work through that interface.
- **Kafka** provides asynchronous event delivery. The connector design explores bringing events into resource state and publishing state changes to streams.

Kubernetes watches and Kafka streams have different delivery and recovery behavior. They are not interchangeable, and an API request and a Kafka message should not be assumed to form one atomic transaction or share a global ordering guarantee.

## 💼 What Teams Could Build {#what-teams-could-build}

A service could manage an order as a Kubernetes resource while a connector delivers relevant changes to asynchronous consumers. An AI agent could react to shared resource state alongside operators and serverless functions. These are application patterns to evaluate, not guarantees of immediate or exactly-once processing.

This is a shared-state and event-streaming pattern, not a claim that HariKube provides a general-purpose analytical data lake or query engine.

## ✅ Validate Before Adopting {#validate-before-adopting}

For the specific build and connector configuration, test:

- Which resource operations and message directions are supported.
- How duplicate, delayed, and out-of-order messages are handled.
- Whether consumers can retry or replay safely, and how offsets relate to committed state.
- What happens during connector, database, broker, and network failures.
- How permissions, schema validation, and error handling apply at each integration boundary.
- Which ordering, retention, and consistency guarantees are actually documented and observed.

Plan for eventual visibility across components unless a stronger guarantee is documented for your exact deployment. Application-level idempotency and reconciliation remain design concerns.

## 📚 Related Documentation {#related-documentation}

Read the [architecture overview and limitations](/docs/overview/) and [storage access and consistency guidance](/features/consistency/). For practical application examples, follow the [operators and custom APIs guide](/topics/kubernetes-operators/) or [AI infrastructure guide](/topics/ai-infrastructure/). The [scaling guide](/topics/kubernetes-scaling/) covers workload-specific performance evaluation.

#### [<-- Data Isolation](/features/data-isolation/)