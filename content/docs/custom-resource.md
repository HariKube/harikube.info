---
title: "Create Your First Custom Resource"
layout: "simple"
description: "Learn how to define and deploy your first custom resource using HariKube."
prevTitle: "Installation"
prevLink: "/docs/installation/"
nextTitle: "Automation"
nextLink: "/docs/automation/"
---

{{< ld-docs >}}

{{< toc >}}

## 📦 Create Your First Custom Resource

{{< code bash >}}kubectl apply -f https://raw.githubusercontent.com/kubernetes/website/main/content/en/examples/customresourcedefinition/shirt-resource-definition.yaml
{{< /code >}}

By default, the Kubernetes Controller Manager caches every resource to support background operations such as garbage collection and internal indexing.
To reduce memory usage and improve performance in high-volume environments, you can label specific resources with `skip-controller-manager-metadata-caching=true` to exclude them from being cached. That means Kubernetes can't clean-up resources by `ownerReference`. Select a database which automatic GC is supported, or you have to do garbage collection on your own.

{{< code bash >}}cat | kubectl apply -f - <<EOF
---
apiVersion: stable.example.com/v1
kind: Shirt
metadata:
  name: example1
  labels:
    skip-controller-manager-metadata-caching: "true"
spec:
  color: blue
  size: S
---
apiVersion: stable.example.com/v1
kind: Shirt
metadata:
  name: example2
  labels:
    skip-controller-manager-metadata-caching: "true"
spec:
  color: blue
  size: M
---
apiVersion: stable.example.com/v1
kind: Shirt
metadata:
  name: example3
  labels:
    skip-controller-manager-metadata-caching: "true"
spec:
  color: green
  size: M
EOF
{{< /code >}}

#### [<-- Installation](/docs/installation/) | [Automation -->](/docs/automation/)