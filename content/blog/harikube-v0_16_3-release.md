---
title: "HariKube v0.16.3: Certified on Rancher & OpenShift, K8s 1.36.2 Upgrade, Adaptive Rate Limiting, and Scalable Control Planes"
date: 2026-09-23
author: "Richard Kovacs"
description: "HariKube reaches major ecosystem milestones, here are the details"
categories: ["Microservice", "Infrastructure"]
tags: ["kubernetes", "scalability", "infrastructure"]
featured_image: "/images/blog/harikube-v0_16_3-release.png"
---

{{< toc >}}

---

Today, we are taking a massive leap forward in making HariKube the ultimate high-scale state platform for production cloud-native environments. 

With the release of **HariKube v0.16.3**, we are bridging enterprise ecosystem validation with hyper-scaler performance updates. Whether you run your workloads on enterprise-grade platforms like **SUSE Rancher** or **Red Hat OpenShift**, or operate custom lightweight Kubernetes control planes, HariKube is now easier to deploy, safer under peak loads, and fully certified.

Here is everything packed into our newest milestone release!

---

## 🏷️ Standardized Versioning Scheme (Aligned with Kine)

First, an operational change: **we have officially adjusted our release versioning schema**. 

Because HariKube originated as a high-performance, storage-side filtering fork of the **Kine** project, aligning our version numbers directly with upstream Kine simplifies dependency tracking and architectural parity. 

* **New Version Baseline:** **v0.16.3**
* **Why it matters:** Engineers can now easily identify upstream compatibility while enjoying HariKube’s multi-database routing, storage-side CRD evaluation, and stateless control plane optimizations.

---

## 🤠 Certified on SUSE Rancher & Available in Rancher App Store

We are thrilled to announce that **HariKube is now officially certified on Rancher** and published directly in the **Rancher Application Marketplace**!

You can now provision high-throughput, etcd-less control planes directly inside your Rancher-managed clusters or leverage **RKE2** to run HariKube natively.

### Installing HariKube via Rancher / RKE2

To run HariKube as your backend state engine on RKE2, update your `/etc/rancher/rke2/config.yaml` to substitute the default Kubernetes control plane components with HariKube’s optimized images:

{{< code yaml >}}kube-apiserver-image: "quay.io/harikube/kube-apiserver:v1.36.2"
kube-apiserver-arg:
- "feature-gates=WatchList=true,WatchListClient=true,VolumeAttributesClass=true,MutatingAdmissionPolicy=true,CustomResourceFieldSelectors=true"
- "runtime-config=admissionregistration.k8s.io/v1beta1=true,admissionregistration.k8s.io/v1=true"
- "storage-media-type=application/json"
- "encryption-provider-config="
- "encryption-provider-config-automatic-reload=false"
- "max-requests-inflight=900"
- "max-mutating-requests-inflight=300"
- "watch-cache=false"
- "etcd-servers=http://172.17.0.1:2369"

kube-controller-manager-image: "quay.io/harikube/kube-controller-manager:v1.36.2"
kube-controller-manager-arg:
- "feature-gates=WatchList=true,WatchListClient=true,VolumeAttributesClass=true,MutatingAdmissionPolicy=true,CustomResourceFieldSelectors=true"
- "kube-api-burst=90"
- "kube-api-qps=60"
- "node-cidr-mask-size-ipv4=23"
- "terminated-pod-gc-threshold=1000"
{{< /code >}}

Then start or upgrade your RKE2 cluster using standard tooling:

{{< code bash >}}curl -sfL https://get.rke2.io | INSTALL_RKE2_VERSION=v1.36.2+rke2r1 sh -
{{< /code >}}

---

## 🔴 Certified on Red Hat OpenShift

Enterprise alignment doesn't stop with Rancher. **HariKube is officially certified on Red Hat OpenShift** and will be available via the OpenShift Ecosystem Catalog soon.

For enterprise platform teams running OpenShift across multi-region or hybrid-cloud infrastructures, HariKube provides a validated path to scale CRDs, custom controllers, and AI agent workloads without encountering etcd consensus bottlenecks or memory overhead.

---

## 🛡️ Built-in Adaptive Rate Limiter (EWMA)

Database backends under heavy API pressure can experience cascading degradation. In **v0.16.3**, HariKube introduces a **built-in adaptive rate limiter** designed to shield underlying distributed databases (TiDB, CockroachDB, PostgreSQL) from saturation.

### How it Works under the Hood:
* **Dynamic RPS Scaling:** The rate limiter continuously monitors query execution latencies on storage operations.
* **EWMA Calculation:** Using an **Exponentially Weighted Moving Average (EWMA)**, it tracks backend response trends in real time.
* **Proactive Load Shedding:**
  * **Low Latency:** Incoming requests run at peak throughput (up to the configured maximum RPS).
  * **High Latency / Database Stress:** The rate limiter dynamically throttles incoming API server traffic down to a baseline minimum, giving the database layer room to drain queues and recover before resuming full throughput.

This guarantees cluster stability even during sudden microbursts, controller re-sync loops, or massive AI agent state sync events.

---

## ⚡ Performance Boost: Accelerated Field Selector Filtering

Evaluating field selectors (e.g., `metadata.name`, custom CRD status fields) on massive object counts can choke standard control planes.

In this release, we pushed major **storage-side optimization updates for field selector filtering**. By pushing selector evaluations directly down to SQL database indices before returning records over the wire, HariKube dramatically reduces CPU utilization, payload sizes, and serialization overhead during heavy list/watch operations.

---

## ☸️ Upgraded to Kubernetes 1.36.2

HariKube v0.16.3 updates its core API server and controller manager baselines to **Kubernetes v1.36.2**. 

Enjoy full conformance with upstream Kubernetes APIs, enhanced feature gate controls (`WatchList`, `MutatingAdmissionPolicy`, `CustomResourceFieldSelectors`), and up-to-date security patches.

---

## 📦 Streamlined Helm Deployments & Control Plane Architecture

We have made running HariKube on bare Kubernetes or vCluster instances significantly simpler and more flexible.

### 1. Cert-Manager is Now Optional
`cert-manager` is no longer a strict prerequisite for installing HariKube via Helm. You can now choose to let HariKube manage its own TLS certificates or bring your own secret management workflow, removing unnecessary deployment friction in lightweight environments.

### 2. Built-in Scalable Control Plane Mode
Scaling the API layer used to require complex manual topology setups. The updated Helm chart now supports **built-in multi-instance control plane scaling**:
* **Single-Instance vCluster Mode:** Runs vCluster lightweight routing in single instance mode.
* **Scaled Out API & Controller Managers:** Helm can automatically spin up additional, stateless `kube-apiserver` and `kube-controller-manager` pods backed by HariKube's unified storage tier.

---

## 🚀 Get Started Today

Whether you are looking to scale out thousands of AI sandboxes, eliminate multi-cluster sprawl, or deploy on enterprise platforms like Rancher and OpenShift, **HariKube v0.16.3** is ready.

Deploy the latest version via Helm in seconds:

{{< code bash >}}helm install harikube oci://quay.io/harikube/harikube \
  --version 0.16.3 \
  --create-namespace \
  --namespace harikube \
  --set vcluster.exportKubeConfig.server=https://harikube.harikube:443
kubectl wait -n harikube --for=jsonpath='{.status.readyReplicas}'=1 statefulset/harikube --timeout=5m
{{< /code >}}

Have questions or feedback about our Rancher/OpenShift integrations or adaptive rate limiting? Join the discussion on our [GitHub Community Forum](https://github.com/HariKube/harikube/discussions)!