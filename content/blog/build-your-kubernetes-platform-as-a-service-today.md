---
title: "Build Your Kubernetes Platform-as-a-Service Today"
date: 2025-11-06
author: "Richard Kovacs"
description: "Learn how to crush the biggest scalability bottlenecks in Kubernetes."
categories: ["Open-Source", "Infrastructure", "Microservice"]
tags: ["kubernetes", "scalability", "infrastructure", "microservice"]
featured_image: "/images/blog/build-your-kubernetes-platform-as-a-service-today.png"
---

{{< toc >}}

## 💡 Our Mission at HariKube: Unlocking Kubernetes' True Potential

The promise of **Kubernetes** was simple: to become the universal operating system for the cloud. Yet, for all its power, it hit a wall at enterprise scale—specifically, the limitations of **ETCD** and a fragmented application development experience. The result? A fantastic container orchestrator, but a **broken Platform-as-a-Service (PaaS)**.

We believe that the Kubernetes API should be the single, scalable, and language-agnostic foundation for every cloud-native workload—from event-driven nanoservices to complex stateful microservices and classic REST APIs. Read the full article [[→]](/blog/the-future-of-kubernetes-paas-and-kubernetes-native-service-development-is-here/)

## 🛑 The Scalability Wall: ETCD Limits and Client-Side Filtering

While Kubernetes is masterful at scheduling and orchestration, its control plane has two fundamental design decisions that prevent it from scaling linearly into a true enterprise PaaS: the reliance on ETCD and the practice of client-side filtering. ETCD is officially recommended to stay near 2GB of total data. For small resources, this is adequate, but for large-scale enterprise clusters managing tens of thousands of custom resources (CRs), the limit is quickly hit.

The second, and often more insidious, scalability issue stems from how the Kubernetes API server queries data:

> 🐌 Kubernetes API Server fetches all relevant resources from the database (ETCD), then filters them in memory (on the client side) before returning the final result.

## 🚀 HariKube's Dynamic Data Fabric: Scaling to Infinity

HariKube introduces a **dynamic, database-agnostic data fabric** that completely reimagines how the Kubernetes API server interacts with its persistent store. This fabric unlocks Kubernetes’ true potential, providing the **enterprise-level scaling** needed to manage massive clusters and high-throughput microservices.

However, we understand that not all use cases demand this full enterprise architecture. To empower the wider community and allow everyone to benefit from these advancements, we have **Ppen-Sourced a critical toolset** designed to help developers and smaller organizations achieve robust scalability and avoid common ETCD limitations by implementing **efficient storage-side filtering** within their existing Kubernetes environments.

## 🛠️ Introducing the HariKube Open Source Toolset

To democratize the advancements needed to overcome the limitations of ETCD and client-side filtering, we have open-sourced a core toolset. This solution acts as a bridge, allowing standard Kubernetes deployments to use a scalable SQL backend and benefit from storage-side filtering without adopting the full enterprise architecture.

This toolset consists of two key components:

1. Modified **Kine** ([Kine](https://github.com/k3s-io/kine) is not etcd)

Kine is an existing etcd-shim (a compatibility layer) that translates the Kubernetes API server's native ETCD API calls into standard SQL queries for backends like SQLite, Postgres, or MySQL. It allows Kubernetes to use these databases instead of ETCD.

Our Modification: The HariKube version of Kine contains crucial enhancements that implement storage-side filtering logic. When the Kubernetes API server issues a request that typically requires client-side filtering (like a label selector), our modified Kine translates that request into an optimized SQL WHERE clause. This offloads the filtering work to the efficient SQL database, drastically cutting down on the amount of data transferred and processed by the API server, directly solving the client-side filtering performance bottleneck.

2. Modified **Kubernetes Control Plane**

While Kine handles the data access layer, to fully leverage the performance gains, we also provide a small set of targeted modifications to the Kubernetes API Server itself.

The Change: These modifications enhance the way the API server constructs requests to its storage layer (our modified Kine). Specifically, they ensure that the server-side filters (like the label selectors and field selectors) are correctly passed down and translated by Kine into the SQL query, rather than being handled as an afterthought in memory.

The Result: This coupling of the modified Kine and the modified Kubernetes Control Plane provides a transparent, drop-in replacement for the standard ETCD setup, enabling a huge leap in scalability and query performance for clusters that choose to adopt a SQL backend.

3. **vCluster** Integration (Isolation and Scalability)

While it is entirely possible to run a standalone instance of this setup, for real-world production use, we **strongly suggest** utilizing the **vCluster** version of the toolset.

What is vCluster? vCluster (Virtual Cluster) is an open-source tool that provisions lightweight, isolated Kubernetes control planes (the virtual cluster) running inside a regular Kubernetes namespace (the host cluster).

The Benefit: Deploying our modified control plane and Kine setup inside a vCluster provides critical advantages:

- **Separation of Concerns**: It cleanly separates the underlying infrastructure data (the host cluster) from the application and service data (the virtual cluster), enhancing stability and security.
- **Easier Deployment and Management**: Virtual clusters are simple to provision and manage declaratively, just like any other Kubernetes resource.
- **Individual Scalability**: Each virtual cluster gets its own Kubernetes API server and isolated Kine/SQL backend, meaning its scalability and performance are independent of all other clusters and the host clusters, making it the ideal pattern for deploying multiple scalable services.

By using this open-source toolset, developers can immediately start building more data-intensive microservices and operators without worrying about the looming scalability wall of a standard ETCD deployment.

## ⚙️ Step 1: Bring Your Cluster

The power of the HariKube open-source toolset lies in its agnosticism—it is designed to work with any existing Kubernetes distribution you use today. There is no vendor lock-in and no need to migrate to a specific cloud provider or distribution.

Whether you are running:

- **Cloud-Managed Clusters**: Such as GKE, EKS, AKS, or DigitalOcean.
- **On-Premises or Self-Hosted Clusters**: Using k3s, RKE, or bare metal deployments.
- **Local Development Environments**: Like minikube or kind.

...the principle remains the same. You bring your existing cluster, and our modified control plane and Kine shim will integrate directly with it. This allows you to immediately begin scaling your control plane and benefiting from storage-side filtering without any disruptive infrastructure changes.

## ✨ Step 2: Launch the Scalable Control Plane

With your host Kubernetes cluster ready, the next step is to deploy the vCluster instance containing our modified Kine shim and Kubernetes control plane. This single declarative step handles the creation of the virtual cluster and configures it to use a scalable, file-backed SQLite instance (perfect for testing and small deployments) instead of the standard ETCD.

This deployment instantly gives you a new, isolated control plane that benefits from:

- **ETCD Avoidance**: State is routed to the SQL backend via Kine.
- **Storage-Side Filtering**: All data queries are optimized for performance.
- **Isolation**: The control plane is separated into its own namespace via vCluster.

To execute this, simply run the following command:

{{< code bash >}}kubectl apply -f https://github.com/HariKube/kine/releases/download/release-v0.14.6/vcluster-kine-sqlite.yaml
{{< /code >}}

Once the virtual cluster is running, you can connect to it directly using the vCluster CLI:

{{< code bash >}}vcluster connect kine
{{< /code >}}

You are now connected to a highly performant, isolated control plane that is no longer limited by ETCD or client-side filtering. Congratulations on taking the first step towards truly scalable cloud-native development!

Once connected, vCluster changes your current local `KUBECONFIG` file to point directly to the virtual control plane. This is seamless for developers and means all subsequent kubectl commands will interact with your new, scalable instance. When you are finished working on the virtual cluster, you can easily swap back to your host cluster by running the command `vcluster disconnect`.

## 🧠 Final Thoughts

The journey to an unconstrained, scalable Kubernetes platform begins here. The limitations imposed by ETCD and the inefficiency of client-side filtering have long bottlenecked enterprise adoption and prevented Kubernetes from fully realizing its potential as a true PaaS.

This open-source release is a testament to our mission: to redefine the cloud-native application development blueprint. Whether you adopt the full HariKube enterprise data fabric or utilize these open-source tools, you are moving toward a more resilient, high-throughput, and scalable future. Start building your next generation of microservices, operators, and functions where the **Kubernetes API truly is the scalable source of truth**, no longer limited by yesterday's architectural constraints.

## 🙏 Share Feedback and Report Issues

Your feedback is invaluable in helping us improve this operator. If you encounter any issues, have a suggestion for a new feature, or simply want to share your experience, we want to hear from you!

- Report Bugs: If you find a bug, please open a [GitHub Issue](https://github.com/HariKube/kine/issues). Include as much detail as possible, such as steps to reproduce the bug, expected behavior, and your environment (e.g., Kubernetes version).
- Request a Feature: If you have an idea for a new feature, open a [GitHub Issue](https://github.com/HariKube/kine/issues) and use the `enhancement` label. Describe the use case and how the new feature would benefit the community.
- Ask a Question: For general questions or discussions, please use the [GitHub Discussions](https://github.com/HariKube/kine/discussions).

---

That’s it! You've successfully deployed a **fully isolated, performance-optimized, and scalable** virtual Kubernetes control plane. It's now ready to host your most demanding applications, operators, and event-driven functions, free from the constraints of ETCD limits and client-side filtering.

Thank you for reading, and feel free to share your thoughts.