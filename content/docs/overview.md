---
title: "Overview"
layout: "simple"
seo_title: "Architecture and Documentation Overview"
description: "Understand HariKube's architecture, supported databases, deployment model, limitations, and Kubernetes-native application use cases."
prevTitle: "Quick Start"
prevLink: "/docs/quick-start/"
nextTitle: "Installation"
nextLink: "/docs/installation/"
---

{{< ld-docs >}}

{{< toc >}}

## 📖 Overview

HariKube is an advanced Kubernetes-native platform that enhances how
microservices and custom resources are managed by distributing data
across multiple databases. It addresses ETCD's limitations by introducing
a powerful multi-layer and vendor database topology. Bringing a cloud-native
development experience and turning Kubernetes into a true PaaS.

## ❓ What is HariKube?

HariKube is a system that simplifies data location management in
Kubernetes by offloading microservice data from ETCD into databases
like MySQL and PostgreSQL, which are optimized for handling large-scale,
high-throughput data workloads.
It uses a middleware to handle routing and storage logic, improving scalability, performance, and reliability.

## 🌐 Benefits of HariKube Architecture

{{< details >}}
{
    "details": [
        {
            "title": "Separation of Concerns",
            "file": "docs/details/separation-of-concerns"
        },
        {
            "title": "Scalability",
            "file": "docs/details/scalability"
        },
        {
            "title": "Reliability",
            "file": "docs/details/reliability"
        },
        {
            "title": "Extensibility",
            "file": "docs/details/extensibility"
        },
        {
            "title": "Developer Simplicity",
            "file": "docs/details/developer-simplicity"
        },
        {
            "title": "No vendor locking",
            "file": "docs/details/no-vendor-locking"
        }
    ]
}
{{< /details >}}

## ⚠️ Limitations

While HariKube improves performance over single-ETCD setups, it inherits some
Kubernetes design tradeoffs.

| Limitation | Description |
|-|-|
| Eventual Consistency | Updates may not be immediately visible across the system |
| Non-Transactional | No support for ACID transactions |
| Relational Logic | Complex joins or relations between data entities are not supported |
| Limited Data Filtering | No advanced query engine included within Kubernetes |
| Limited number of CRDs | Kubernetes Discovery API reaches it's limit proximately around at 500 |

> 💡 Don't worry, the Kubernetes API aggregation layer can help overcome the limitations of the core API server by allowing you to extend the API with custom APIs that are served by a separate backend, or extension API server. This setup enables you to implement specific logic and capabilities that aren't available in the core API. We started to maintain a project to deal with the limitations: [api-extension](https://github.com/HariKube/api-extension).

## 🛢️ Supported Databases

HariKube supports multiple backends, each with different capabilities regarding data access and filtering. The table below outlines which storage engines are compatible and whether they support storage-side filtering for efficient querying.

| Database | Storage-Side Filtering | Data isolation | Decreased latency | Increased throughput | Large Dataset Support | Auto GC |
|-|-|-|-|-|-|-|
| <a href="https://www.mysql.com/" target="_blank">**MySQL**</a> | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| <a href="https://mariadb.org/" target="_blank">**MariaDB**</a> | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| <a href="https://www.pingcap.com/" target="_blank">**TiDB**</a> | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| <a href="https://www.postgresql.org/" target="_blank">**PostgreSQL**</a> | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| <a href="https://www.cockroachlabs.com/" target="_blank">**CockRoachDB**</a> | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| <a href="https://www.yugabyte.com/" target="_blank">**YugabyteDB**</a> | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| <a href="https://www.sqlite.org/" target="_blank">**SQLite**</a> | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ |

> ℹ️ Storage-side filtering means the database can apply selectors (`label`, `field`) before returning data-reducing memory usage and improving performance at scale.

## 💼 What Teams Can Build {#-common-use-cases}

HariKube supports four related application patterns. Shared state means a common resource and API model, not a requirement to put every workload in one physical database.

### Scale Kubernetes Beyond etcd

Route supported resource workloads to database backends to reduce pressure on etcd. Per-namespace isolation, regional placement, and resource-based sharding are topology choices to evaluate with your workload. Start with the [Kubernetes scaling guide](/topics/kubernetes-scaling/) and [database topology automation](/docs/automation/).

### Build a Cloud-Native Application Platform

Use Kubernetes APIs, RBAC, schemas, and watches as application foundations. Controllers, serverless functions, and custom APIs can implement business logic around resource state. Follow the [operators and custom APIs guide](/topics/kubernetes-operators/) and [developer experience overview](/features/developer-experience/).

### Coordinate Event-Driven AI Agents

Let agents, operators, and services share resource state and react to changes. Evaluate object churn, concurrency, and visibility delays rather than assuming a particular agent count or latency. See the [AI infrastructure guide](/topics/ai-infrastructure/).

### Connect Shared State with Event Streams

Explore Kubernetes APIs for state management alongside Kafka for asynchronous delivery. **Kafka integration is experimental**, not a blanket stable-release capability. Read the [streaming architecture and evaluation guidance](/features/event-streaming/) before planning a deployment.


## 🧠 How HariKube Works

<div style="text-align: center">
  <a href="/images/harikube-architecture-overview.png" target="_blank"><img src="/images/harikube-architecture-overview.png" alt="Harikube Architecture Overview" /></a>
</div>

#### [Installation -->](/docs/installation/)