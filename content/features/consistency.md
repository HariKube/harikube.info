---
title: "Strict Consistency & Direct Storage Architecture"
description: "Eliminating the 'Stale Read' problem. HariKube bypasses the traditional watch cache to deliver real-time data accuracy through high-performance storage-level filtering."
layout: "feature"
badge: "Strong Consistency"
badgeColor: "#059669"
features:
  - title: "Linearizable Reads"
    description: "In standard Kubernetes, the API server's watch cache can lag behind the source of truth (etcd). HariKube eliminates this middleman. Every read and watch reflects the absolute current state of your storage, ensuring that what you see is exactly what is there."
  - title: "Storage-Native Filtering"
    description: "By pushing complex filtering logic (labels, fields) directly into the storage engine, we remove the need for an in-memory API cache. This drastically reduces the RAM overhead of your control plane while maintaining sub-millisecond query performance."
  - title: "Reduced Conflict Loops"
    description: "Standard controllers often fail with '409 Conflict' because their local cache is out of sync with etcd. HariKube's direct consistency model ensures your controllers are able act on fresh data, reducing the 'retry-loop' churn and stabilizing your application."
  - title: "Decreasing the 'Cache Tax'"
    description: "Caches aren't free; they consume massive amounts of memory and CPU cycles for synchronization. By disabling the watch cache, HariKube lowers the TCO of your control plane nodes, allowing you to run leaner infrastructure without sacrificing reliability."
---

{{< ld-docs >}}

Traditional Kubernetes architecture makes a trade-off: it uses an in-memory Watch Cache to protect the database, but this introduces eventual consistency. In high-traffic clusters, this leads to "ghost" resources, stale list views, and race conditions that plague platform engineers and developers alike.

HariKube changes the paradigm. We believe that the API should never lie to the user. By optimizing the storage layer to handle native Kubernetes filtering, we have removed the requirement for an intermediate cache layer.

#### The True Cost of Caching

In a standard cluster, every API server instance maintains its own copy of the cluster state in RAM. As your cluster grows to thousands of Pods and CRDs, this "Cache Tax" manifests in three ways:
 - Memory Bloat: API servers require increasingly large instance types just to hold the cache in memory, multiple times if you ar erunning in HA.
 - Synchronization Overhead: CPU cycles are wasted constantly "replaying" events from etcd to keep the multiple caches somewhat aligned, multiple times if you ar erunning in HA.
 - The Consistency Gap: The millisecond-delay between an etcd write and a cache update creates a window of "truth fragmentation" where different API servers return different results for the same query.

Real-Time Precision at Scale

HariKube provides a Strictly Consistent control plane. By leveraging our pluggable database backends and pushing selection logic to the source, we ensure that every GET, LIST, and WATCH is a direct reflection of the committed state.

For mission-critical orchestration, financial transactions within the cluster, or high-speed scaling events, HariKube provides the rock-solid data integrity that origianl eventual consistency of the control plane simply cannot match.

#### [<-- Performance](/features/performance/) | [Infrastructure Flexibility -->](/features/flexible-stack/)