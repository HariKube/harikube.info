---
title: "Kubernetes is HariKube's query language, control protocol, and application interface for managing data streams"
date: 2026-09-01
author: "Richard Kovacs"
description: "Four HariKube application patterns: Kubernetes scaling, cloud-native platforms, event-driven AI agents, and shared state with Kafka streams."
categories: ["Architecture", "AI"]
tags: ["kubernetes", "data-streaming", "control-plane", "ai-agents", "query-language", "cloud-native-platform"]
featured_image: "/images/blog/kubernetes-is-harikubes-query-language-control-protocol-and-application-interface-for-managing-data-streams.png"
---

{{< toc >}}

**If you are more interested in HariKube's business impact, follow the link.** [[→]](/blog/the-great-architectural-cycle-and-the-next-wave-just-hit/)

---

Building production-grade microservices has meant wrestling with legacy anti-patterns, dealing with tightly coupled databases, managing complex service meshes, and **burning 20 to 40 percent of our development cycles purely on repetitive infrastructure boilerplate**. We have all felt the steep learning curves and the constant headache of trying to faithfully reproduce production environments locally. We **all had scary nigths scaling Control-Plane** or watching memory filling up with unused resources **for too long...**

HariKube connects four application patterns: **scaling Kubernetes beyond etcd, building a cloud-native application platform, coordinating event-driven AI agents, and connecting shared state with event streams**. This article explores the architecture behind those outcomes.

> **Experimental Kafka integration:** The connector model discussed here is development work, not a guarantee of stable-release availability, zero overhead, or immediate delivery. See the [streaming architecture and evaluation guidance](/features/event-streaming/) for the current documentation scope.

## 🔎 Let's analyze the title!

- **Query Language**: By leveraging Custom Resource Definitions (CRDs) and storage-side filtering directly against distributed databases like TiDB or CockroachDB, **the Kubernetes API schema effectively functions as the data query language**. These storage-side optimizations turn CRDs into a widely used representation layer for most workloads.

- **Control Protocol**: The control plane exposes resource state while HariKube routes supported workloads to configured databases. Controllers, functions, and agents can observe changes and reconcile their work. Scale and reaction latency depend on the backend, clients, and deployment.

- **Application Interface**: Developers and AI workloads interact with a unified ecosystem where APIs are well known, rules are clear, schema migration is built-in, secure by design, and they can implement any custom business logic to manage the state of their application. **Different service designs can speak the same Cloud-Native language, and they can interact with each other via a single API endpoint.** Any service can join the party as long as it speaks HTTP and is authorized to join.

- **Managing Data Streams**: If this story wasn't interesting enough, let's meet the real beast. I know this is very ambitious, and we are just working on the first version, but wait! HariKube is a middleware - **what if you could register Kafka producers and consumers directly into the middleware layer?** For the price of sending or receiving messages:
    - Explore mapping incoming messages into resource state
    - Let Kubernetes clients react after those changes become visible
    - Explore publishing resource changes to asynchronous consumers
    - Evaluate connector transformations and plugin behavior in the development build

  These are integration goals. Verify ordering, retries, duplicate handling, and authorization boundaries rather than assuming API and Kafka operations have identical semantics.

> We are running a [competition](https://github.com/HariKube/kubernetes-performance-challenge/blob/main/README.md) to find out where the limits of Kubernetes are. Join the elite group of Kubernetes hyper-scalers.

## 📎 How it looks on paper?

Whether you are orchestrating CRDs, streamlining microservice workflows, or hosting large amount of AI agents and secure sandboxes, this release fundamentally changes what is possible on Kubernetes. Time to break down the architecture that makes it all happen (I ❤️‍🔥 diagrams, click for big view).

<a href="/images/harikube-architecture-overview.png" target="_blank"><img src="/images/harikube-architecture-overview.png" alt="Harikube Architecture Overview" /></a>

**HariKube offers a common resource and API model for application state across configured databases.** Kubernetes is the application-facing interface; controllers and services can update resources and react to observed changes. This is not a general-purpose analytical warehouse or data-lake query engine.

> 💡 I know you may think about Kubernetes API design limitations; my short answer is: that's where Aggregation APIs come into the picture.

**The Kafka connector design adds an asynchronous integration path alongside Kubernetes resource access.** An application might manage an order through the API and deliver selected changes to stream consumers. Watches and Kafka are different mechanisms: choose based on delivery, replay, recovery, and latency requirements, and validate the connector rather than assuming Kafka's broker guarantees automatically extend to resource updates.

## 🧠 What is HariKube

It's hard to tell - not because we don't know how it works, or because we introduced something that didn't exist before. But **fixing the scalability of Kubernetes fundamentally changed everything**, and like peeling an onion, we found new options week by week. HariKube depends on well-known, widely adopted tools; we just connected the right dots to unlock the full potential of the system.

### Scale Kubernetes Beyond etcd {#kubernetes-hyper-scaler}

Move supported resource workloads to database backends, reducing etcd pressure and cache-related filtering work. API-serving capacity still depends on database throughput, concurrency, and operational limits; there is no universal three-to-five-instance ceiling or constant-memory guarantee. Follow the [Kubernetes scaling learning path](/topics/kubernetes-scaling/) and [consistency guidance](/features/consistency/) to evaluate your workload.

### Build a Cloud-Native Application Platform {#cloud-native-platform-as-a-service}

Reuse Kubernetes APIs, RBAC, schemas, and watches so teams can focus on business logic instead of rebuilding platform foundations. Controllers, functions, and custom APIs remain application components that teams design and operate. Start with the [operators and custom APIs learning path](/topics/kubernetes-operators/).

### Coordinate Event-Driven AI Agents {#home-for-large-amount-of-of-ai-agents-and-sandboxes}

Agents, operators, and services can share resource state and react to observed changes through a common Kubernetes-native interface. Capacity, sandboxing, and delivery latency require their own evaluation; shared state does not guarantee a particular number of agents or inference speed. See the [AI infrastructure learning path](/topics/ai-infrastructure/).

### Connect Shared State with Event Streams {#data-lake-with-kubernetes-frontendcontrol}

Combine Kubernetes APIs for state management with Kafka integration for asynchronous delivery. Shared state is a logical model that can span separate databases, not a general-purpose data lake or a promise of atomic API-and-stream updates. Read the [streaming architecture and validation checklist](/features/event-streaming/).

### Murder of Service Mesh XD

This is just a joke, but every good joke has a kernel of truth. Without going into too much detail, if you think about it: your communication isn't low-level anymore. Services don't (can, but don't necessarily have to) talk directly to each other; **they update the state of the application over already-managed TLS.** If your Git is fast enough, you can even version-control your webshop orders. A pod in cluster A doesn't need to reach a pod in cluster B. If you can share your API, they are part of your ecosystem.

> 🫶 Of course synchronous Service-to-Service communication still needs the extra care of meshes.

So **Service Mesh is not dead - you just need less of it.** That is the beauty of this architecture: it gives you all the tools to manage hierarchical documents at scale with guaranteed Kubernetes API compatibility, while giving you the freedom to use what you want for problems that don't fit the native way, without losing Cloud-Native advantages.


## 🧭 What Is HariKube's Identity

**HariKube is an open-core platform for shared, versioned resource state through Kubernetes APIs, with Kafka integration for asynchronous event streams.**

### What It Does  

It gives applications a common resource model across configured database backends. Resource versioning supports change tracking, but retention, history access, and consistency must be evaluated for the deployment.

#### Imagine a Webshop on HariKube:  

An order can be represented as a resource with application-defined transitions such as Created > Paid > Shipped. Controllers or functions react to observed updates; an Kafka connector could deliver selected changes to asynchronous consumers. The application still owns workflow correctness, retries, and external side effects.

### Why It Matters

* **The Big Picture:** Standard Kubernetes breaks when forced to handle massive business state because consensus and memory have hard ceilings. HariKube replaces etcd with heavy-duty database engines, turning Kubernetes into a massive, resilient and scalable state platform.
* **For Operators:** You manage drastically fewer clusters and infrastructure layers because HariKube handles your scale in well-known databases, eliminating cluster sprawl and operational overhead.
* **For Developers:** It solves the trade-off between monoliths and microservices:
  * *Shared-state simplicity:* A common resource model across services, subject to documented consistency and retention limits.
  * *Independent services:* Kubernetes-native coordination, with Kafka integration for asynchronous delivery.
* **For Your Business:** By unifying your business data and infrastructure into a single state engine, HariKube eliminates the custom integration code and sync pipelines that usually delay launches, letting you ship new features in days instead of months.

> ✅ HariKube isn't a Kubernetes-inspired API or a custom control plane that happens to look like Kubernetes. It is designed to preserve Kubernetes API semantics and has passed the Kubernetes conformance test suite. Test it today.

## 👷 How it looks like in action

Well, the Kafka connectors are on the way, [dev build](https://github.com/HariKube/harikube/releases/tag/dev-v0.16.4-0) is available. Otherwise you can start using HariKube today by deploying our [Open-Core Edition](https://github.com/HariKube/harikube/releases/tag/release-v0.16.3) (limited to one database) or selecting an [Enterprise Edition](/editions/).

**You are just one Helm install away of the now.**

{{< code bash >}}helm install harikube oci://quay.io/harikube/harikube \
  --version 0.16.3 \
  --create-namespace \
  --namespace harikube \
  --set vcluster.exportKubeConfig.server=https://harikube.harikube:443
kubectl wait -n harikube --for=jsonpath='{.status.readyReplicas}'=1 statefulset/harikube --timeout=5m
{{< /code >}}

## 🎯 Where this architecture shines

- **Application Platforms:** Reuse Kubernetes RBAC, resource schemas, and watches instead of recreating those foundations in every service. Kafka delivery is a separate integration.
- **Event-Driven AI Agents:** Coordinate agents through resource updates and reconciliation, testing visibility delays and capacity with representative workloads.
- **Streaming Applications:** Explore Kafka ingestion and publication in an build, verifying delivery and authorization semantics at each boundary.
- **Edge & Multi-Region Control Planes:** Run lightweight, stateless Kubernetes endpoints near edge workloads without taking on full multi-cluster management overhead.

## 🏁 Final Thought: How I Imagine a System Like This

The architectural direction combines Kubernetes resource access and storage-side filtering with Kafka connectors. It can reduce some integration layers, but does not remove application logic, consistency requirements, or the need to operate the surrounding systems.

1. **The End of "Glue" Code**
The goal is to reduce repeated integration work by reusing resource APIs and routing. Experimental connectors could move some Kafka ingestion and publication into the platform, but services still own transformations, idempotency, external side effects, and recovery requirements.

2. **Kubernetes as the Universal Operating System**
Instead of using Kubernetes purely to manage pod lifecycles, **it becomes the universal declarative runtime**:

- **CRDs** act as the schema definition and query syntax ⚠️
- **Kafka** is the asynchronous event-delivery path in the connector design
- **TiDB/CockroachDB** acts as the persistent storage layer
- **AI Agents** act as active processes within the system, treating CRDs as their environment and state updates as their sensory inputs.
- **HariKube acts as a revision mapper**; because under the hood it has this simple role; **it maps individual database revisions into a monotonically increasing global revision number.** We can track `9,223,372,036,854,775,807` changes of your state, and history retention still depends on storage capacity, configuration, and operational policy.

3. **True Event-Driven Convergence**
In the design, an AI agent's Kafka message could be mapped into resource state, after which a controller or function reacts when it observes the change. Processing is asynchronous: test visibility latency, retries, ordering, and how validation and authorization apply along the connector path. Do not assume one atomic transaction across Kafka, the database, and Kubernetes clients.

> ⚠️ We know there are more complex use cases like deep joins, transactions, strong consistency. We started to create a reference [Aggregation API extension](https://github.com/HariKube/api-extension), to demonstrate how easy it is to achieve those in a different layer of the architecture. For example, the Kubernetes API doesn't support counting: drop the extension in, and you can count any objects.

**HariKube turns Kubernetes from an infrastructure orchestrator into a distributed, real-time reactive application engine.** And if 20-22 databases are not enough, you can still have multiple HariKube clusters.

---

That’s it! The future of Cloud-Native data streaming and hyper-scale AI workloads is here, and it runs right on top of the Kubernetes APIs you already know. Test out HariKube, take on our [performance challenge](https://github.com/HariKube/kubernetes-performance-challenge/blob/main/README.md), and help us shape the next evolution of HariKube.

### What else you can imagine?

Please tell us what you think, or what idea we inspired, share with us in the [Community Forum](https://github.com/HariKube/harikube/discussions).

<pre>Going further join to the development of HariKube!</pre>

---

**If you are interested in HariKube's business impact, follow the link.** [[→]](/blog/the-great-architectural-cycle-and-the-next-wave-just-hit/)
