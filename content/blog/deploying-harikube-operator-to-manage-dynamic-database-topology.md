---
title: "Deploying HariKube operator to manage dynamic database topology"
date: 2025-08-15
author: "Richard Kovacs"
description: "Step-by-step instructions how to deploy HariKube operator."
categories: ["Infrastructure"]
tags: ["kubernetes", "devops", "scalability"]
featured_image: "/images/blog/deploying-harikube-operator-to-manage-dynamic-database-topology.png"
---

---

**Before diving in, make sure you have a running Kubernetes cluster. If you need help setting one up, check out our tutorial.** [[→]](/blog/start-kubernetes-prepared-for-huge-data-handling/)

---

{{< toc >}}

## 🔌 Installing Essential Kubernetes Add-ons

To get started, let's install two popular open-source add-ons: [Cert-Manager](https://github.com/cert-manager/cert-manager) for automated certificate management, and the [Prometheus Operator](https://github.com/prometheus-operator/prometheus-operator) for monitoring and alerting. These add-ons are widely used and will help your cluster run smoothly.

{{< code bash >}}kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.16.3/cert-manager.yaml
kubectl apply -f https://github.com/prometheus-operator/prometheus-operator/releases/download/v0.77.1/stripped-down-crds.yaml
{{< /code >}}

## ✨ Deploying the HariKube Operator

> ⚠️ HariKube images aren’t public yet. If you’d like to try them, request a free trial version on the [Open Beta invitation](/beta-invitation/) page.

Start by authenticating your local Docker client with the private registry at `registry.harikube.info`. This step is essential for pulling images from the registry.

{{< code bash >}}docker login registry.harikube.info
{{< /code >}}

Next, pull the HariKube Operator image from our registry:

{{< code bash >}}docker pull registry.harikube.info/harikube/operator:beta-v1.0.0-2
{{< /code >}}

If you're using Kind for your cluster, load the image into your Kind node:

{{< code bash >}}kind load docker-image -n harikube-cluster registry.harikube.info/harikube/operator:beta-v1.0.0-2
{{< /code >}}

Now, deploy the HariKube Operator to your cluster. This operator will manage your custom database routing policies and automate topology changes.

{{< code bash >}}kubectl apply -f https://harikube.info/manifests/harikube-operator-beta-v1.0.0-2.yaml
{{< /code >}}

## 🔨 Configuring the Operator and Registering a Custom Resource

Let’s create your first topology configuration. This tells the HariKube Operator how to route data for a specific custom resource.

{{< code yaml "topology-shirts.yaml" >}}apiVersion: harikube.info/v1
kind: TopologyConfig
metadata:
  name: topologyconfig-shirts
  namespace: default
spec:
  targetSecret: default/topology-config
  backends:
  - name: shirts
    endpoint: sqlite:///db/shirts.db?_journal=WAL&cache=shared
    customresource:
      group: stable.example.com
      kind: shirts
{{< /code >}}

This `TopologyConfig` custom resource instructs the operator to manage all `shirts` resources, storing their data in a dedicated SQLite database (`shirts.db`) inside the HariKube Middleware container.

Apply the configuration:

{{< code bash >}}kubectl apply -f topology-shirts.yaml
{{< /code >}}

## 🚀 Defining and Deploying a New Application Resource

To see HariKube in action, let’s define a new custom resource type. We’ll use a simple example: a `Shirt` resource.

{{< code bash >}}kubectl apply -f https://raw.githubusercontent.com/kubernetes/website/main/content/en/examples/customresourcedefinition/shirt-resource-definition.yaml
{{< /code >}}

This command registers the `Shirt` custom resource definition (CRD) in your cluster. Now, Kubernetes can manage `Shirt` objects just like native resources.

Let’s create an actual `Shirt` instance:

{{< code bash >}}cat | kubectl apply -f - <<EOF
apiVersion: stable.example.com/v1
kind: Shirt
metadata:
  name: example1
  labels:
    # Disables Kubernetes Controller Manager operations on this instance
    # For more info please visit /docs/custom-resource page
    skip-controller-manager-metadata-caching: "true"
spec:
  color: blue
  size: S
EOF
{{< /code >}}

Once applied, the Kubernetes API server will accept the new `Shirt` object. The HariKube Middleware, guided by your `TopologyConfig`, will store this instance in the dedicated SQLite database. This demonstrates the full workflow: from defining a custom resource to automated, isolated database storage.

To verify everything is working, check the database for your new `Shirt` resource:

{{< code bash >}}docker run -it --rm -v harikube_db:/data alpine/sqlite /data/shirts.db "select name from kine"
{{< /code >}}

---

And that’s the final step! You’ve successfully deployed the **HariKube Operator** and configured a **dynamic database topology** for your custom resources. This setup gives you **data isolation, lower latency, and virtually unlimited storage** by offloading custom resource data from ETCD to dedicated backends like SQLite, truly turning Kubernetes into a scalable Platform-as-a-Service.

Thank you for reading! If you have questions or ideas, please share them-we’d love to hear from you.