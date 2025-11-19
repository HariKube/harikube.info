---
title: "We make Kubernetes work at enterprise scale - no more ETCD limits"
date: 2025-10-06
author: "Richard Kovacs"
description: "HariKube unifies different service designs into a scalable hybrid architecture."
categories: ["Microservice"]
tags: ["kubernetes", "serverless", "custom resource", "scalability", "microservice"]
featured_image: "/images/blog/harikube-the-hybrid-paas-blueprint-for-kubernetes.png"
---

{{< toc >}}

**Imagine a world where Kubernetes itself becomes the platform** - not just for container orchestration, but for **functions, microservices, and APIs**. With HariKube’s dynamic data layer, serverless function triggers, operator loops, and the Kubernetes Aggregation API layer, that world is not only possible - it’s here.

This blog post explores how HariKube unifies these layers into a single hybrid architecture, enabling developers to build **nanoservices, microservices, and REST APIs** on the same platform - in any language they choose.

---

## 🌐 The Big Picture: Kubernetes as a Full PaaS Runtime

For years, Kubernetes has been the foundation of modern cloud infrastructure. But while it excels at scheduling, scaling, and managing workloads, its **application development experience has been fragmented**:

- Serverless functions live in Knative or OpenFaaS.
- Operators are built with Kubebuilder or Kopf for infrastructure related developments.
- REST APIs are bolted on via Ingress and separate application stacks.

HariKube changes this. By **replacing ETCD with a database-agnostic backend topology** and connecting Kubernetes watches to serverless runtimes, reconciliation loops, and custom APIs. It turns Kubernetes into a **true Cloud-Native Platform-as-a-Service**.

---

## 🧱 HariKube - Dynamic, Database-Agnostic Data Backend

HariKube replaces ETCD with a flexible middleware that routes different resource types to different databases - MySQL, Postgres, SQLite, or others. The Kubernetes API becomes a **scalable, modular data fabric**, decoupled from a single store.

> 🧠 Kubernetes stops being just a control plane store and becomes a **distributed, extensible data platform**.

---

## ⚡ Serverless - Nanoservice Layer

With a lightweight watch connector, every Custom Resource Definition (CRD) or core resource change can trigger a function running on OpenFaaS or Knative. The function layer provides **event-driven business logic** without requiring operators, custom APIs, or external event buses.

- Developers only need a CRD and a function image.
- Kubernetes acts as the event source (RBAC, namespaces included).
- The function focuses on **logic**, the platform handles everything else.

👉 `kubectl apply` → event → function trigger → database backend → **fully operational nanoservice**.

**Function languages:** Go, Python, Node.js/TypeScript, Java, C#/.NET, Ruby, PHP, Rust.

> In practice, any language that runs in a container and speaks HTTP works.

**We are happy to announce our open source tool to trigger serverless functions based on Kubernetes events. For more info please follow the blogpost.** [[→]](/blog/introducing-serverless-kube-watch-trigger-declarative-event-triggers-for-kubernetes/)

---

## 🔁 Operators - Microservice Layer

Operators remain the best way to handle **stateful, long-lived, or complex business logic**. With HariKube’s data fabric, operators behave like regular microservices without being bottlenecked by ETCD.

When you need reconcile loops, complex dependencies, or imperative operations - this is your layer.

**Operator languages:** Go, Python, Java, Node.js/TypeScript, Rust, C#/.NET.

**Are you interested in how to develop controller loop based services? Please read our series of blogposts about this topic.** [[→]](/blog/create-microservice-with-operator/)

---

## 🌐 Kubernetes Aggregation API Layer - Traditional REST API Layer

Some use cases don’t fit into serverless or operator patterns - for example, **classic REST APIs**, querying, or external integrations. Here, Kubernetes’ **Aggregation API layer** lets you embed a custom API server directly into the Kubernetes control plane.

**Typical REST/API languages:** Go, Python, Node.js/TypeScript, Java, C#/.NET, Rust, Ruby, PHP.

> In practice, any language that runs in a container and speaks HTTP works.

**We created a small library to make custom API development super easy. Please read the blogpost to learn how.** [[→]](/blog/create-microservice-with-operator-4/)

---

## 🧠 All Layers Combined: A Hybrid Architecture

When these layers come together:

> 🔥 **Kubernetes + HariKube + Serverless + Operators + Aggregation API = Cloud-Native PaaS**

| Functional need                             | Pattern  | Layer           | Typical languages                                              |
| ------------------------------------------- | -------- | --------------- | -------------------------------------------------------------- |
| Simple event-driven logic                   | Function | Serverless      | Go, Python, Node.js/TypeScript, Java, C#/.NET, Ruby, PHP, Rust |
| Stateful, multi-resource event driven logic | Operator | Controller      | Go, Python, Java, Node.js/TypeScript, Rust, C#/.NET           |
| Classic API, querying, integration          | REST     | Aggregation API | Go, Python, Node.js/TypeScript, Java, .NET, Rust, Ruby, PHP |

---

## 🚀 Strategic Impact

Current cloud platforms separate these domains:

- Functions → Knative / OpenFaaS
- Operators → Kubebuilder / controller-runtime
- APIs → Ingress + external apps

HariKube **brings them together** into a single architecture, centered on the Kubernetes API and powered by its dynamic backend. This hybrid model:

 - **Decouples development from infrastructure**, enabling faster iteration cycles. Infrastructure teams can focus on platform and scaling. Developers focus on business logic and data models. This clean split lowers cognitive overhead and onboarding time.
 - **Unifies three different development paradigms** on one platform. Functions, operators, and REST APIs are all exposed through the Kubernetes API. This simplifies observability, policy enforcement, and lifecycle management.
 - **Easier horizontal scaling**, multi-database routing prevents the traditional ETCD bottleneck, allowing control plane throughput to scale with workload size.
 - **Improves system performance** compared to single-database Kubernetes deployments, delivering higher throughput, lower latency, and reduced error rates through distributed, resource-type-specific data routing.
 - **Simplified maintenance**, each backend can be updated, scaled, or backed up independently, without cluster-wide downtime.
 - **Built-in multi-tenancy and isolation**, by assigning different backends to different resource groups or namespaces, you can enforce isolation boundaries without spinning up extra clusters.
 - **Reduces time to market**, because developers can focus entirely on business logic instead of building bespoke infrastructure layers.
 - **Cuts development costs**, by eliminating the need to maintain separate stacks for serverless, operators, and APIs.
 - **Lower learning curve**, developers don’t need to learn multiple frameworks or infrastructure stacks. They can pick the layer that matches their problem domain.
 - **Language freedom**, each layer supports a wide set of languages. Teams can use the language they’re strongest in without compromising platform integration.
 - **Consistent development workflow**, via functions, operators, and APIs all use the same CRD-based declarative model.
 - **Local-first development**, because HariKube is transparent, developers can run full stacks locally or in ephemeral dev environments without any dependencies.
 - **Easier regulatory compliance**, data placement policies make it easier to comply with GDPR, HIPAA, or financial regulations by physically separating data types and regions.
 - **Enables new business models**, platform teams can expose the underlying hybrid PaaS to internal or external customers, offering Functions, APIs, and Operators as products.
 - **Future-proof architecture**, as new backend technologies appear, HariKube can integrate them transparently without changing how developers build services.

---

## ✨ A New Platform Strategy

This is more than technical elegance - it’s a blueprint for the next generation of cloud platforms:

👉 Kubernetes as a **Function + Microservice + REST API runtime**  
👉 HariKube as a **database-agnostic, extensible data fabric**  
👉 Watch connectors as **event-bus-free serverless triggers**  
👉 Controller loops as **new way of microservice development**  
👉 Aggregation API as the **native API gateway**  
👉 Developers using Go, Python, Node.js, Java, .NET, Rust, Ruby, PHP, or even C++ - all on the same platform.

🚀 **HariKube transforms Kubernetes into a full hybrid PaaS** - flexible, language-agnostic, and built for the future.

---

**Ready to run your application in production? Learn how to prepare your Kubernetes to use HariKube as underlaying storage.** [[→]](/blog/start-kubernetes-prepared-for-huge-data-handling/)

---

That's the core message! By unifying **Serverless Functions, Operators, and Custom REST APIs** into a single platform powered by the **HariKube dynamic data layer**, you overcome ETCD limits and transform Kubernetes into a **full, scalable, and language-agnostic Hybrid PaaS**.

Thank you for reading, and feel free to share your thoughts.