---
title: "Start Kubernetes prepared for huge data handling"
date: 2025-08-15
author: "Richard Kovacs"
description: "Unlock a new level of Kubernetes scalability with HariKube."
categories: ["Infrastructure"]
tags: ["kubernetes", "devops", "scalability", "infrastructure"]
featured_image: "/images/blog/start-kubernetes-prepared-for-huge-data-handling.png"
---

{{< toc >}}

## 👷 Building a Custom Kubernetes Cluster with Kind and HariKube

This tutorial walks you through setting up a Kubernetes cluster using [Kind](https://kind.sigs.k8s.io) (Kubernetes in Docker), but with a twist: you’ll use custom Kubernetes images and an external [HariKube](/) middleware for storage. This approach is ideal for developers and operators who want to test new Kubernetes versions or integrate with a different storage backend.

> *Large dataset support based on storage-side filtering is not available in vanilla Kubernetes. Follow this post for instructions to running a custom version of Kubernetes.

## 🚀 Running HariKube Middleware

First, let’s set up your HariKube data store. Normally, Kubernetes relies on [ETCD](https://etcd.io/) as its primary database. Instead of letting Kind run its own embedded ETCD instance, you’ll launch a custom "middleware" container that provides an ETCD API endpoint-powered by HariKube.

> ⚠️ HariKube images aren’t public yet. If you’d like to try them, request a free trial version on the [Open Beta invitation](/beta-invitation/) page.

Start by authenticating your local Docker client with the private registry at `registry.harikube.info`. This step is essential for pulling images from the registry.

{{< code bash >}}docker login registry.harikube.info
{{< /code >}}

Now, run the HariKube middleware container:

{{< code bash >}}docker run -d \
  --name harikube_middleware \
  --stop-timeout=-1 \
  -e TOPOLOGY_CONFIG=secret://default/topology-config \
  -e ENABLE_TELEMETRY_PUSH=true \
  -v harikube_db:/db \
  -p 2369:2379 \
  registry.harikube.info/harikube/middleware:beta-v1.0.0-19 \
  --endpoint='multi://sqlite:///db/main.db?_journal=WAL&cache=shared'
{{< /code >}}

## 🔨 Configuring and Creating the Kind Cluster

Next, let’s configure Kind to use your custom HariKube backend. The `kind-config.yaml` file tells Kind how to build the cluster and connect to your middleware.

{{< code yaml "kind-config.yaml" >}}kind: Cluster
apiVersion: kind.x-k8s.io/v1alpha4
featureGates:
  "CustomResourceFieldSelectors": true
  "WatchList": true
  "WatchListClient": true
nodes:
- role: control-plane
  image: kindest/node:v1.34.0
  kubeadmConfigPatches:
  - |
    kind: ClusterConfiguration
    apiServer:
        extraArgs:
          watch-cache: "false"
          etcd-servers: "http://172.17.0.1:2369"
          runtime-config: "admissionregistration.k8s.io/v1beta1=true"
          max-requests-inflight: "900"
          max-mutating-requests-inflight: "300"
{{< /code >}}

To spin up your cluster, run:

{{< code bash >}}kind create cluster --name harikube-cluster --config kind-config.yaml
{{< /code >}}

This command uses your configuration file to create a new Kubernetes cluster named `harikube-cluster`, with HariKube as the storage backend.

### Accessing Custom Kubernetes Images (Optional, but Recommended)

If you want true large dataset support, you’ll need to use HariKube’s pre-built Kubernetes images from our public registry. This step is optional for basic setups, but highly recommended for production or heavy workloads.

> For production clusters we strongly recommend of using [vCluster](https://www.vcluster.com) based separation of infrastructure and application APIs. For more info please follow the documentation [installation](/docs/installation/#-setup-and-start-kubernetes) section.

First, pull the custom images:

{{< code bash >}}docker pull quay.io/harikube/kube-apiserver:v1.34.0
docker pull quay.io/harikube/kube-controller-manager:v1.34.0
{{< /code >}}

Then, load the images into your Kind node:

{{< code bash >}}kind load docker-image -n harikube-cluster quay.io/harikube/kube-apiserver:v1.34.0
kind load docker-image -n harikube-cluster quay.io/harikube/kube-controller-manager:v1.34.0
{{< /code >}}

Finally, update the component manifests to use your custom images:

{{< code bash >}}docker exec harikube-cluster-control-plane sed -i 's|registry.k8s.io/kube-apiserver:v1.34.0|quay.io/harikube/kube-apiserver:v1.34.0|' /etc/kubernetes/manifests/kube-apiserver.yaml
docker exec harikube-cluster-control-plane sed -i 's|registry.k8s.io/kube-controller-manager:v1.34.0|quay.io/harikube/kube-controller-manager:v1.34.0|' /etc/kubernetes/manifests/kube-controller-manager.yaml
{{< /code >}}

Wait for your Kubernetes cluster to restart and come back online with the custom images. You’re now ready to handle huge datasets with confidence!

---

**Ready for the next step? Learn how to deploy the HariKube operator to manage dynamic database topology.** [[→]](/blog/deploying-harikube-operator-to-manage-dynamic-database-topology/)

---

That’s it! You’ve just built a Kubernetes cluster that’s **ready for serious data handling**. With HariKube, you can design your own data topology and take advantage of **lower latency, higher throughput, true data isolation, virtually unlimited storage, and a much simpler development experience**. HariKube supports both flat and hierarchical topologies, so you can organize your databases like leaves on a tree.

Thank you for following along! If you have questions or ideas, please share them-we’d love to hear from you.
