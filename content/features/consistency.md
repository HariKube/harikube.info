---
title: "Storage Access, Caching and Consistency"
description: "Understand HariKube's storage-side filtering, cache tradeoffs, and consistency considerations for controllers, database replicas, and event streams."
layout: "feature"
badge: "Storage Access"
badgeColor: "#4f46e5"
features:
  - title: "Storage-Side Filtering"
    description: "Supported database backends can apply label and field selectors before returning resources, reducing the amount of data the API server must filter in memory."
  - title: "Reduced Cache Dependence"
    description: "Storage-side filtering can reduce dependence on an API-server watch cache. Validate cache configuration, memory use, and request latency for your backend and workload."
  - title: "Workload-Aware Read Semantics"
    description: "Data visibility depends on the request path, database configuration, replication, and client-side caches. A direct storage read does not by itself establish an end-to-end linearizability guarantee."
  - title: "Reconciliation Still Matters"
    description: "Controllers and agents must handle conflicts, retries, and delayed observations. Shared resource state does not eliminate asynchronous processing or application-level coordination."
---

{{< ld-docs >}}

HariKube routes supported Kubernetes resources to database backends and can push selection logic into storage. This architecture can reduce cache-related memory pressure, but cache configuration and consistency guarantees are separate concerns.

## What Storage-Side Filtering Changes {#the-true-cost-of-caching}

An API-server watch cache retains resource data in memory and needs ongoing synchronization. Moving supported filtering into the database can reduce the need to retain and scan that data at the API layer. The benefit depends on selectors, result sizes, concurrency, and database behavior; it is not a promise of constant total memory use or sub-millisecond queries.

## What It Does Not Guarantee

Disabling a watch cache does not make every GET, LIST, and WATCH immediately reflect every change throughout an application. Controller caches, asynchronous processing, database replication, and event delivery can introduce visibility delays. Resource-version behavior and read guarantees must be checked for the exact operation, backend, and configuration.

Applications should continue to handle optimistic-concurrency conflicts and use reconciliation where appropriate. Do not treat shared Kubernetes resource state as a cross-resource transaction engine.

## Database Replicas and Event Streams

Read replicas can add replication lag. Before introducing read/write splitting, verify that the routing policy preserves the visibility and resource-version behavior your clients need.

Kafka integration is and asynchronous. Do not assume that a Kafka message and a Kubernetes API operation form an atomic transaction, or that all consumers observe one global event order. See [shared state and event streams](/features/event-streaming/) for evaluation questions.

## Evaluate Your Requirements

Review the [architecture limitations](/docs/overview/#-limitations), then test read-after-write behavior, watch reconnection, conflicts, replica lag, and failure recovery with representative clients. Use the [Kubernetes scaling guide](/topics/kubernetes-scaling/) to evaluate performance alongside correctness.

#### [<-- Performance](/features/performance/) | [Infrastructure Flexibility -->](/features/flexible-stack/)
