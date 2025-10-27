---
title: "Streamlined Cloud-Native Development"
description: "HariKube simplifies the developer workflow by abstracting infrastructure complexity. Focus purely on data structures and business logic while the platform handles data routing and storage."
layout: "feature"
badge: "Development"
badgeColor: "#f59e0b"
features:
  - title: "No local infrastructure setup required"
    description: "Developers continue using stock Kubernetes APIs and workflows—HariKube operates transparently in the background and is only needed in the production environment. There’s no need to install or configure anything locally, keeping development environments lightweight and familiar."
  - title: "Native support for built-in Kubernetes features"
    description: "HariKube seamlessly extends Kubernetes without disrupting native functionality—supporting RBAC, events, admission webhooks, and other core features out of the box. This ensures full compatibility with existing tooling and policies while enhancing the platform’s data capabilities behind the scenes."
  - title: "Consistent behavior from development to production"
    description: "HariKube preserves standard Kubernetes APIs and resource definitions, ensuring that applications behave identically across development, staging, and production. Since it operates transparently at the infrastructure level, no code changes or environment-specific logic are required."
  - title: "Fully documented APIs and integration guides"
    description: "HariKube builds on Kubernetes' well-documented, stable APIs, allowing developers to build and operate applications using only cloud-native tools. There's no need to learn new interfaces—just use standard Kubernetes workflows, with HariKube enhancing the platform transparently behind the scenes."
---

{{< ld-docs >}}

Kubernetes has become the backbone of modern cloud-native development, offering a consistent and declarative way to manage infrastructure and application lifecycles. But as platforms evolve and microservices scale, infrastructure complexity often seeps into the developer workflow—slowing teams down and introducing friction.

While Kubernetes has enabled a powerful cloud-native development workflow, it remains fundamentally limited when it comes to handling data-intensive applications. This is because the underlying data store—ETCD—is optimized for configuration and state management, not high-throughput or large-scale operational data. As a result, cloud-native workflows are often confined to infrastructure automation, while application-level data handling must rely on external systems, breaking the end-to-end cloud-native paradigm.

HariKube addresses this by decoupling infrastructure concerns from application development. It operates transparently within your Kubernetes cluster, letting developers work entirely within standard Kubernetes APIs while it routes and stores custom resource data in multiple databases behind the scenes.

Why It Matters

 - **No local setup needed** – Developers don't need to run heavy database instances or mock ETCD clusters locally. Since HariKube is designed for production environments and integrates with stock Kubernetes APIs, development can remain fast, lightweight, and focused.

 - **Cloud-native by default** – With support for built-in Kubernetes features like RBAC, admission webhooks, and eventing, HariKube fits naturally into your existing toolchain—whether you're using Helm, ArgoCD, or GitOps workflows.

 - **Environment parity** – Applications behave consistently across environments because there's no custom runtime logic or external SDK to introduce variability. If it works in dev, it works in prod.

 - **Built for simplicity** – With fully documented APIs and plug-and-play integration, developers can rely on existing Kubernetes knowledge without the need to learn or manage another system.

 - **Transforms Kubernetes into a true Platform-as-a-Service (PaaS)** – HariKube abstracts data infrastructure complexity, allowing developer teams to focus solely on business logic. This streamlined workflow not only accelerates development but also reduces operational overhead and infrastructurerelated  development costs.

HariKube empowers platform teams to handle scale, compliance, and infrastructure complexity—while developers stay focused on writing and deploying great software.

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

 #### [<-- Data Isolation](/features/data-isolation/)