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

## 📦 Create Your First Custom Resource Definition

{{< code bash >}}kubectl apply -f https://raw.githubusercontent.com/kubernetes/website/main/content/en/examples/customresourcedefinition/shirt-resource-definition.yaml
{{< /code >}}

By default, the Kubernetes Controller Manager caches every resource to support background operations such as garbage collection and internal indexing.
To reduce memory usage and improve performance in high-volume environments, you can label specific resources with `skip-controller-manager-metadata-caching=true` to exclude them from being cached. That means Kubernetes can't clean-up resources by `ownerReference`. Select a database which automatic GC is supported, or you have to do garbage collection on your own.

### 💡 Ensure Label with Mutation Admission Webhook

MutatingAdmissionPolicies allow you to modify (or "mutate") incoming requests to the Kubernetes API.

However, if you only need a declarative policy to ensure a label on each resources, the `MutatingAdmissionPolicy` is a simpler and more effective choice. We've provided a simple example below, but for complete and detailed information, please refer to the following the link: [Mutating Admission Policy](https://kubernetes.io/docs/reference/access-authn-authz/mutating-admission-policy).

> ⚠️ To use the feature, enable the `MutatingAdmissionPolicy` feature gate (which is off by default) and set `--runtime-config=admissionregistration.k8s.io/v1beta1=true` on the `kube-apiserver`.

{{< details >}}
{
    "details": [
        {
            "title": "Ensure `skip-controller-manager-metadata-caching` Label on Shirts",
            "file": "docs/details/mutation-admission-policy-controller-manager-skip-shirts"
        },
        {
            "title": "Ensure `skip-controller-manager-metadata-caching` Label on Everything - vCluster",
            "file": "docs/details/mutation-admission-policy-controller-manager-skip-all"
        }
    ]
}
{{< /details >}}

## 👕 Create Your First Custom Resources

{{< code bash >}}cat | kubectl apply -f - <<EOF
---
apiVersion: stable.example.com/v1
kind: Shirt
metadata:
  name: example1
spec:
  color: blue
  size: S
---
apiVersion: stable.example.com/v1
kind: Shirt
metadata:
  name: example2
spec:
  color: blue
  size: M
---
apiVersion: stable.example.com/v1
kind: Shirt
metadata:
  name: example3
spec:
  color: green
  size: M
EOF
{{< /code >}}

Verify the resources are exists.

{{< code bash >}}kubectl get shirts
{{< /code >}}
{{< output >}}NAME       COLOR   SIZE
example1   blue    S
example2   blue    M
example3   green   M
{{< /output >}}

#### [<-- Installation](/docs/installation/) | [Automation -->](/docs/automation/)