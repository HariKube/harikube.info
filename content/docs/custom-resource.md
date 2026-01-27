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
            "title": "Ensure skip-controller-manager-metadata-caching Label on resources without owners",
            "file": "docs/details/mutation-admission-policy-controller-manager-skip-ownerless"
        },
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

### 🔼 Custom Resource Versioning & Storage Migration

HariKube supports storage-side filtering by persisting resource field selectors directly in the database. To maintain accuracy, HariKube tracks the storage version of each resource, ensuring that saved selectors always match the current storage schema.

When you update a Custom Resource definition, the required action depends on whether the storage version or the selector logic has changed:

| Scenario | Impact | Action Required |
|-|-|-|
| **New CR version** (Storage version unchanged) | Metadata change only | **Nothing** |
| **New Storage version** (Selectors unchanged) | Schema version bump only | **Nothing** |
| **New Storage version + New Selectors** | Selectors are now out of sync | **Migration Needed** |

#### 🛠 Migration Strategies

If a migration is required, you can choose a strategy based on your dataset size and uptime requirements.

> ℹ️ Why it's easy: Because HariKube persists fields in JSON format, you can use standard SQL JSON functions to update thousands of records with a single command.

{{< code sql >}}SELECT * FROM kine_fields;
{{< /code >}}
{{< output >}}...
424|/registry/stable.example.com/shirts/default/example1|shirts.stable.example.com/v1|{"metadata_name":"example1","metadata_namespace":"default","spec_color":"blue","spec_size":"S"}
...
{{< /output >}}

##### 🛸 On the fly migrations

These strategies allow your service to stay online, though they may impact performance during the transition. Temporarily disable storage-side filtering. Toggle the `disableStorageLevelFiltering` flag to `true` in your backend configuration. Disabling storage filtering forces the database to return the entire dataset to the API server, which significantly increases memory and latency for large datasets.

> 💡 Best for small datasets or services where brief slowness is acceptable.

 - **Native Kubernetes Re-apply**: Perform a standard paginated GET and UPDATE cycle via the Kubernetes API. Safest approach; utilizes native Kubernetes logic without any custom development.
 - **SQL Migration**: Execute a custom SQL script directly against the underlying database to update selectors in bulk while the system is running.

##### 🛑 Offline migrations

Temporarily disable services that depend on the resource to prevent errors caused by mismatched selectors. Deploy new version of Custom Resource Definition, then start migration of the data.

> 💡 Best for large datasets where you can afford a brief maintenance window to ensure data integrity.

 - **Native Kubernetes Re-apply**: Perform a standard paginated GET and UPDATE cycle via the Kubernetes API. Safest approach; utilizes native Kubernetes logic without any custom development.
 - **SQL Migration**: Execute a custom SQL script directly against the underlying database to update selectors in bulk.

#### [<-- Installation](/docs/installation/) | [Automation -->](/docs/automation/)