---
title: "Overview"
layout: "simple"
description: "Explore HariKube’s mission, leadership, and the vision driving our Kubernetes-native platform."
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

> 💡 Don't worry, the Kubernetes API aggregation layer can help overcome the limitations of the core API server by allowing you to extend the API with custom APIs that are served by a separate backend, or extension API server. This setup enables you to implement specific logic and capabilities that aren't available in the core API.

## 🛢️ Supported Databases

HariKube supports multiple backends, each with different capabilities regarding data access and filtering. The table below outlines which storage engines are compatible and whether they support storage-side filtering for efficient querying.

| Database | Storage-Side Filtering | Data isolation | Decreased latency | Increased throughput | Large Dataset Support | Auto GC |
|-|-|-|-|-|-|-|
| <a href="https://etcd.io/" target="_blank">**ETCD**</a> | ❌ | ✅ | ✅ | ✅ | ❌ | ❌ |
| <a href="https://nats.io/" target="_blank">**NATS**</a> | ❌ | ✅ | ✅ | ✅ | ✅ | ❌ |
| <a href="https://www.mysql.com/" target="_blank">**MySQL**</a> | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| <a href="https://mariadb.org/" target="_blank">**MariaDB**</a> | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| <a href="https://www.pingcap.com/" target="_blank">**TiDB**</a> | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| <a href="https://www.postgresql.org/" target="_blank">**PostgreSQL**</a> | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| <a href="https://www.cockroachlabs.com/" target="_blank">**CockRoachDB**</a> | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| <a href="https://www.yugabyte.com/" target="_blank">**YugabyteDB**</a> | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| <a href="https://www.sqlite.org/" target="_blank">**SQLite**</a> | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ |

> ℹ️ Storage-side filtering means the database can apply selectors (`label`, `field`) before returning data-reducing memory usage and improving performance at scale.

## 💼 Common Use Cases

- Multi-tenant Kubernetes platforms
- Per-namespace database isolation
- Regional workload distribution
- Offloading CRDs to scalable and high capacity databases
- Simplifying stateless microservice infrastructure


## 🧠 How HariKube Works

![HariKube overview](/images/harikube-high-view.png "HariKube overview")

Here’s a clear bullet-point breakdown of the HariKube Overview diagram:

- User initiates a CRUD operation on a Kubernetes resource (e.g., a Custom Resource).
- The request is passed to Kubernetes API server, which forwards it through the midleware.
- HariKube intercepts the request and determines where the data should be stored based on configured routing policies.
- If a routing policy is found, the request is forwarded to the corresponding database (e.g., MySQL).
- If no routing policy is defined, the request falls back to ETCD (the default Kubernetes data store).
- The selected backend (MySQL or ETCD) processes the CRUD request.
- Once the backend responds, the response is passed back through the chain, returning an <OK> to the user.

#### [Installation -->](/docs/installation/)