---
title: "Kubernetes is HariKube's query language, control protocol, and application interface for managing data streams"
date: 2026-09-01
author: "Richard Kovacs"
description: "I am genuinely thrilled to share the next major architectural evolution of HariKube"
categories: ["AI", "Microservice", "Infrastructure", "DataStreaming"]
tags: ["kubernetes", "agentic ai", "microservice", "infrastructure", "data streaming"]
featured_image: "/images/blog/kubernetes is harikubes-query-language-control-protocol-and-application-interface-for-managing-data-streams.png"
---

{{< toc >}}

Building production-grade microservices has meant wrestling with legacy anti-patterns, dealing with tightly coupled databases, managing complex service meshes, and **burning 20 to 40 percent of our development cycles purely on repetitive infrastructure boilerplate**. We have all felt the steep learning curves and the constant headache of trying to faithfully reproduce production environments locally. We **all had scary nigths scaling Control-Plane** or watching memory filling up with unused resources **for too long...**

Today, we are turning the page. **HariKube is stepping forward as a true Cloud-Native hyper-scaler and Platform-as-a-Service** designed to transform your services into first-class Cloud-Native citizens and ready to run huge amounts of AI workloads. In this deep dive, we are pulling back the curtain on our upcoming major feature set:

<pre>"Zero" Overhead Kafka in and out streaming.</pre>

## 🔎 Let's analyze the title!

- **Query Language**: By leveraging Custom Resource Definitions (CRDs) and storage-side filtering directly against distributed databases like TiDB or CockroachDB, **the Kubernetes API schema effectively functions as the data query language**. These storage-side optimizations turn CRDs into a widely used representation layer for most workloads.

- **Control Protocol**: The horizontally scalable control plane manages state synchronization, resource-based data sharding, and real-time event routing at extreme scales. **Serverless functions, Operators, other services, or Aggregation APIs can react immediately to any change of state** to do what needs to be done; the size of the dataset isn't limited by the software anymore.

- **Application Interface**: Developers and AI workloads interact with a unified ecosystem where APIs are well known, rules are clear, schema migration is built-in, secure by design, and they can implement any custom business logic to manage the state of their application. **Different service designs can speak the same Cloud-Native language, and they can interact with each other via a single API endpoint.** Any service can join the party as long as it speaks HTTP and is authorized to join.

- **Managing Data Streams**: If this story wasn't interesting enough, let's meet the real beast. I know this is very ambitious, and we are just working on the first experimental version, but wait! HariKube is a middleware - **what if you could register Kafka producers and consumers directly into the middleware layer?** For the price of sending or receiving messages:
    - **you can update your application state by streaming data directly into the database**
    - Kubernetes or services running on it can react to these changes, just like they were created across the API server
    - **every state change will flow out right after it has been achieved**
    - all controlled by your own WASI plugin, if you do not prefer the built-in ones

> We are running a [competition](https://github.com/HariKube/kubernetes-performance-challenge/blob/main/README.md) to find out where the limits of Kubernetes are. Join the elite group of Kubernetes hyper-scalers.

## 📎 How it looks on paper

Whether you are orchestrating CRDs, streamlining microservice workflows, or hosting millions of AI agents and secure sandboxes, this release fundamentally changes what is possible on Kubernetes. Time to break down the architecture that makes it all happen (I ❤️‍🔥 diagrams, click for big view).

<a href="/images/harikube-architecture-overview.png" target="_blank"><img src="/images/harikube-architecture-overview.png" alt="Harikube Architecture Overview" /></a>

**HariKube acts as a Single Source of Truth for the entire state of your application** - a Document Warehouse, if you prefer that terminology. Kubernetes acts as the frontend, and your services can react to state changes or change the state in real time.

> 💡 I know you may think about Kubernetes API design limitations; my short answer is: that's where Aggregation APIs come into the picture.

**Kafka acts as an alternative message delivery system on top of Kubernetes' built-in event bus**, which updates the same state Kubernetes serves to your business logic. The options are unlimited; each service can select the best path to receive or send status updates. Just to give one example: watchers waiting for "ready" status should use a Kafka stream to let you run heavier business logic based on the API server. The same service can send write intensive data to another Kafka topic with battle-tested delivery guarantees. After finishing the job, it can trigger a serverless function to send an email by creating a custom resource via the API.

## 🧠 What is HariKube

It's hard to tell - not because we don't know how it works, or because we introduced something that didn't exist before. But **fixing the scalability of Kubernetes fundamentally changed everything**, and like peeling an onion, we found new options week by week. HariKube depends on well-known, widely adopted tools; we just connected the right dots to unlock the full potential of the system.

### Kubernetes Hyper-scaler

**By turning the API server stateless, you aren't limited to 3–5 instances of the API server.** You aren't faced with stale reads or long startup times. The control plane uses your resources to serve actual requests, it has `O(1)` memory model. You can run it standalone to achieve massive scaling of your services or AI agents. You can also run it in a vCluster to provide a high-scale API to your clients/applications.

### Cloud Native Platform-as-a-Service

By making the API server scalable, **next-gen services can rely on built-in API server functions like API routing, data streaming, RBAC, auditing, schema validation/migration**, etc. They can focus purely on business logic. **Time-to-Market shrinks**, developers have less cognitive load, and you can achieve True Separation of Concerns where devs and ops are doing what they like and are good at.

### Home for Millions of AI Agents and Sandboxes

Now you have everything you need to **run large amounts of AI workloads** (plus sandboxing and federation agents with their own sandboxes), and your workloads no longer run in silos. **They are Cloud-Native citizens:** they can trigger actions or share data with other citizens, regardless of whether they are serverless functions, operators, Aggregation APIs, other agents consuming a Kafka stream, or watching the Kubernetes API. You have one living entity.

### Data Lake with Kubernetes frontend/control

I have already covered most of this. The center of the architecture is your data. Kubernetes is just the frontend, and Kafka is the highway to the future. Unlike traditional setups where you need multiple clusters to serve requests, **HariKube cuts costs by replacing multi-cluster management with multi-database management featuring real data isolation.**

### Murder of Service Mesh XD

This is just a joke, but every good joke has a kernel of truth. Without going into too much detail, if you think about it: your communication isn't low-level anymore. Services don't (can, but don't necessarily have to) talk directly to each other; **they update the state of the application over already-managed TLS.** If your Git is fast enough, you can even version-control your webshop orders. A pod in cluster A doesn't need to reach a pod in cluster B. If you can share your API, they are part of your ecosystem.

> 🫶 Of course synchronous Service-to-Service communication still needs the extra care of meshes.

So **Service Mesh is not dead - you just need less of it.** That is the beauty of this architecture: it gives you all the tools to manage hierarchical documents at scale with guaranteed Kubernetes API compatibility, while giving you the freedom to use what you want for problems that don't fit the native way, without losing Cloud-Native advantages.

### What else you can imagine?

Please tell us what you think, or what idea we inspired, share with us in the [Community Forum](https://github.com/HariKube/harikube/discussions).

<pre>Going further join to the development of HariKube!</pre>

## 👷 What it looks like in action

Well, the Kafka connectors are on the way, but you can try HariKube today by deploying our [Open-Core Edition](https://github.com/HariKube/harikube/releases/tag/release-v0.16.3) (limited to one database) or selecting an [Enterprise Edition](/editions/).

**You are just one Helm install away of the now.**

{{< code bash >}}helm install harikube oci://quay.io/harikube/harikube \
  --version 0.16.3 \
  --dependency-update \
  --create-namespace \
  --namespace harikube
kubectl wait -n harikube --for=jsonpath='{.status.readyReplicas}'=1 statefulset/harikube --timeout=5m
{{< /code >}}

## 🎯 Where this architecture shines

- **Development Speed**: Engineering teams—from small startups to enterprise platforms - spend time building custom auth systems, REST endpoints, database schemas, and event queues. **HariKube provides built-in RBAC, OpenAPI validation, schema migrations, and event streaming out of the box** - letting a 3-person team launch features that typically require an enterprise platform crew.
- **Distributed AI Agent Swarms:** **Milliseconds-level state sync across thousands of isolated sandboxes** without flooding etcd or burning cycles on API pollers.
- **Event-Sourced Microservices:** Stream high-throughput transactional events directly into your distributed database via Kafka, while maintaining native Kubernetes RBAC and CRD-based management.
- **Edge & Multi-Region Control Planes:** Run lightweight, stateless Kubernetes endpoints near edge workloads without taking on full multi-cluster management overhead.

## 🏁 Final Thought: How I Imagine a System Like This

When you combine a stateless Kubernetes API server, storage-side filtering, and direct Kafka streaming into state, you aren't just scaling Kubernetes - **you are fundamentally collapsing the traditional 3-tier enterprise stack into a single unified control plane.**

1. **The End of "Glue" Code**
In traditional cloud architectures, half your microservice code is glue: running Kafka consumers, serializing objects, calling database drivers, and managing connection pools. In this system, **HariKube turns your infrastructure layer into the database client itself.** Your service code shrinks down to pure, deterministic business logic - or even lightweight WASI modules - because state persistence and streaming ingress are handled transparently at the platform level.

2. **Kubernetes as the Universal Operating System**
Instead of using Kubernetes purely to manage pod lifecycles, **it becomes the universal declarative runtime**:

- **CRDs** act as the schema definition and query syntax ⚠️
- **Kafka** acts as the high-throughput memory bus
- **TiDB/CockroachDB** acts as the persistent storage layer
- **AI Agents** act as active processes within the system, treating CRDs as their environment and state updates as their sensory inputs.
- **HariKube acts as a revision mapper**; because under the hood it has this simple role; **it maps individual database revisions into a monotonically increasing global revision number.** We can track `9,223,372,036,854,775,807` changes of your state, and because Kubernetes memory usage isn't an issue any more, you can keep historycal data forever in your database.

3. **True Event-Driven Convergence**
The boundary between transactional processing (OLTP) and event streaming dissolves. **A payload emitted by an AI agent into Kafka immediately updates the application state**, which instantly triggers a Kubernetes controller or serverless function - all validated by native OpenAPI schemas and protected by K8s RBAC.

> ⚠️ We know there are more complex use cases like deep joins, transactions, strong consistency. We started to create a reference [Aggregation API extension](https://github.com/HariKube/api-extension), to demonstrate how easy it is to achieve those in a different layer of the architecture. For example, the Kubernetes API doesn't support counting: drop the extension in, and you can count any objects.

**HariKube turns Kubernetes from an infrastructure orchestrator into a distributed, real-time reactive application engine.** And if 20-22 databases are not enough, you can still have multiple HariKube clusters.

---

That’s it! The future of Cloud-Native data streaming and hyper-scale AI workloads is here, and it runs right on top of the Kubernetes APIs you already know. Test out HariKube, take on our [performance challenge](https://github.com/HariKube/kubernetes-performance-challenge/blob/main/README.md), and help us shape the next evolution of HariKube.

Thank you for reading, and feel free to [share your thoughts](https://github.com/HariKube/harikube/discussions).