---
title: "Build Your Kubernetes Platform-as-a-Service Today"
date: 2025-11-06
author: "Richard Kovacs"
description: "Learn how to crush the biggest scalability bottlenecks in Kubernetes with open-source."
categories: ["Open-Source", "Infrastructure", "Microservice"]
tags: ["kubernetes", "scalability", "infrastructure", "microservice"]
featured_image: "/images/blog/build-your-kubernetes-platform-as-a-service-today.png"
---

{{< toc >}}

## 💡 Our Mission at HariKube: Unlocking Kubernetes' True Potential

The promise of **Kubernetes** was simple: to become the universal operating system for the cloud. Yet, for all its power, it hit a wall at enterprise scale-specifically, the limitations of **ETCD** and a fragmented application development experience. The result? A fantastic container orchestrator, but a **broken Platform-as-a-Service (PaaS)**.

We believe that the Kubernetes API should be the single, scalable, and language-agnostic foundation for every cloud-native workload-from event-driven nanoservices to complex stateful microservices and classic REST APIs. Read the full article [[→]](/blog/the-future-of-kubernetes-paas-and-kubernetes-native-service-development-is-here/)

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

1. [Modified Kine](https://github.com/HariKube/kine) (Kine is not etcd)

Kine is an existing etcd-shim (a compatibility layer) that translates the Kubernetes API server's native ETCD API calls into standard SQL queries for backends like SQLite, Postgres, or MySQL. It allows Kubernetes to use these databases instead of ETCD.

Our Modifications:
 - The HariKube version of Kine contains crucial enhancements that implement storage-side filtering logic. When the Kubernetes API server issues a request that typically requires client-side filtering (like a label selector), our modified Kine translates that request into an optimized SQL WHERE clause. This offloads the filtering work to the efficient SQL database, drastically cutting down on the amount of data transferred and processed by the API server, directly solving the client-side filtering performance bottleneck.
 - The other feature is storage-side garbage collection. Add a label `skip-controller-manager-metadata-caching=true` to any of your resources to enable storage-side GC. You can automate the label creation with Mutation Admission Policy.

{{< code yaml "skip-controller-manager-metadata-caching.yaml" >}}apiVersion: admissionregistration.k8s.io/v1beta1
kind: MutatingAdmissionPolicy
metadata:
  name: "skip-controller-manager-metadata-caching"
spec:
  matchConstraints:
    resourceRules:
    - apiGroups:   ["stable.example.com"]
      apiVersions: ["v1"]
      operations:  ["CREATE"]
      resources:   ["shirts"]
  matchConditions:
    - name: label-does-not-exist
      expression: >
          !has(object.metadata.labels) ||
          !('skip-controller-manager-metadata-caching' in object.metadata.labels)
  failurePolicy: Fail
  reinvocationPolicy: IfNeeded
  mutations:
    - patchType: JSONPatch
      jsonPatch:
        expression: >
          has(object.metadata.labels)
          ? [
              JSONPatch{
                op: "add",
                path: "/metadata/labels/skip-controller-manager-metadata-caching",
                value: "true"
              }
            ]
          : [
              JSONPatch{
                op: "add",
                path: "/metadata/labels",
                value: {}
              },
              JSONPatch{
                op: "add",
                path: "/metadata/labels/skip-controller-manager-metadata-caching",
                value: "true"
              }
            ]
---
apiVersion: admissionregistration.k8s.io/v1beta1
kind: MutatingAdmissionPolicyBinding
metadata:
  name: "skip-controller-manager-metadata-caching"
spec:
  policyName: "skip-controller-manager-metadata-caching"
  matchResources:
    resourceRules:
    - apiGroups:   ["stable.example.com"]
      apiVersions: ["v1"]
      operations:  ["CREATE"]
      resources:   ["shirts"]
{{< /code >}}

2. Modified [Kubernetes Control Plane](https://github.com/HariKube/kubernetes-patches)

While Kine handles the data access layer, to fully leverage the performance gains, we also provide a small set of targeted modifications to the Kubernetes API Server and Controller Manager themself.

The Changes:
 - These modifications enhance the way the API server constructs requests to its storage layer (our modified Kine). Specifically, they ensure that the server-side filters (like the label selectors and field selectors) are correctly passed down and translated by Kine into the SQL query, rather than being handled as an afterthought in memory.
 - Controller Manager skips caching resources labeled with `skip-controller-manager-metadata-caching=true` to avoid filling memory with resources garbage collected by the storage.

The Result: This coupling of the modified Kine and the modified Kubernetes Control Plane provides a transparent, drop-in replacement for the standard ETCD setup, enabling a huge leap in scalability and query performance for clusters that choose to adopt a SQL backend.

3. [vCluster](https://github.com/HariKube/kine/blob/master/hack/vcluster/api-config.yaml) Integration (Isolation and Scalability)

While it is entirely possible to run a standalone instance of this setup, for real-world production use, we **strongly suggest** utilizing the **vCluster** version of the toolset.

What is vCluster? vCluster (Virtual Cluster) is an open-source tool that provisions lightweight, isolated Kubernetes control planes (the virtual cluster) running inside a regular Kubernetes namespace (the host cluster).

The Benefit: Deploying our modified control plane and Kine setup inside a vCluster provides critical advantages:

- **Separation of Concerns**: It cleanly separates the underlying infrastructure data (the host cluster) from the application and service data (the virtual cluster), enhancing stability and security.
- **Easier Deployment and Management**: Virtual clusters are simple to provision and manage declaratively, just like any other Kubernetes resource.
- **Individual Scalability**: Each virtual cluster gets its own Kubernetes API server and isolated Kine/SQL backend, meaning its scalability and performance are independent of all other clusters and the host clusters, making it the ideal pattern for deploying multiple scalable services.

By using this open-source toolset, developers can immediately start building more data-intensive microservices and operators without worrying about the looming scalability wall of a standard ETCD deployment.

## ⚙️ Step 1: Bring Your Cluster

The power of the HariKube open-source toolset lies in its agnosticism-it is designed to work with any existing Kubernetes distribution you use today. There is no vendor lock-in and no need to migrate to a specific cloud provider or distribution.

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
- **Storage-Side Garbage-Collection**: Optionally you can push garbage-collection to the storage side.
- **Isolation**: The control plane is separated into its own namespace via vCluster.

To execute this, simply run the following command:

{{< code bash >}}kubectl apply -f https://github.com/HariKube/kine/releases/download/release-v0.14.6/vcluster-kine-sqlite-release-v0.14.6.yaml
{{< /code >}}

> 🔓 For access control, the vCluster setup keeps things simple: It is only configured to copy your `ServiceAccount` resources to the underlying (host) cluster. This means you should create all of your RBAC (Role-Based Access Control) policies (like `Roles` and `RoleBindings`) directly on your virtual cluster. Your deployed workloads on the host can then use the synchronized `ServiceAccount` on the host cluster, ensuring they have the correct permissions.

Once the virtual cluster is running, you can connect to it directly using the vCluster CLI:

{{< code bash >}}kubectl wait -n kine --for=jsonpath='{.status.readyReplicas}'=1 statefulset/kine --timeout=5m
vcluster connect kine
{{< /code >}}

You are now connected to a highly performant, isolated control plane that is no longer limited by ETCD or client-side filtering. Congratulations on taking the first step towards truly scalable cloud-native development!

Once connected, vCluster changes your current local `KUBECONFIG` file to point directly to the virtual control plane. This is seamless for developers and means all subsequent kubectl commands will interact with your new, scalable instance. When you are finished working on the virtual cluster, you can easily swap back to your host cluster by running the command `vcluster disconnect`.

> vCluster simplifies the operational workflow by automatically updating your local environment. For more details how to disable this behaviour, or how to get config by service account for example please wisit the official docs` [Access and expose vCluster](https://www.vcluster.com/docs/vcluster/manage/accessing-vcluster) section.

Now, create your first custom resource. Apply the definition file:

{{< code bash >}}kubectl apply -f https://raw.githubusercontent.com/kubernetes/website/main/content/en/examples/customresourcedefinition/shirt-resource-definition.yaml
{{< /code >}}

Then add a few resources:

{{< code bash >}}cat | kubectl apply -f - <<EOF
apiVersion: stable.example.com/v1
kind: Shirt
metadata:
  name: example1
  labels:
    color: blue
spec:
  color: blue
  size: S
---
apiVersion: stable.example.com/v1
kind: Shirt
metadata:
  name: example2
  labels:
    color: blue
spec:
  color: blue
  size: M
---
apiVersion: stable.example.com/v1
kind: Shirt
metadata:
  name: example3
  labels:
    color: green
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

Once again these resources are only exists on the virtual cluster, and they backed by the SQLite database which supports storage side filtering, so you can get for example green shirts without moving all shirts from the database to Kubernetes API server.

{{< code bash >}}kubectl get shirts -l color=green
{{< /code >}}
{{< output >}}NAME       COLOR   SIZE
example3   green   M
{{< /output >}}

> We strongly recommend to read the [Custom Resources](/docs/custom-resource/) section of our documentation, because you could find more detailed information about serving huge amount of custom resources efficiently.

## 📈 Scaling the Open Source Edition

If you are running the Open Source version of HariKube, you are restricted to one logical database connection. However, "one database" does not mean "one bottleneck." By using industry-standard layering, you can scale your control plane to handle massive workloads.

 - **Database Partitioning** (Inside the Shard): Before adding more servers, optimize the one you have. HariKube is designed to work perfectly with native SQL partitioning. Create your schema and partitions manually. When HariKube pushes a query down to the DB, the SQL engine only scans the relevant partition. You get the speed of a sharded system within the simplicity of a single database connection.
 - **Upgrading to a Distributed Database** (The "Drop-In" Scale): The most powerful way to scale the Open Source edition is to replace a standalone MySQL/Postgres instance with a Distributed SQL Engine like TiDB or CockroachDB. To HariKube, TiDB looks like a single MySQL database. You provide one connection string. Behind that single connection, TiDB distributes your data across dozens of nodes.
 - **Introducing a Smart Load Balancer** (Read/Write Splitting): To maximize throughput, you can place a State-Aware Proxy (like ProxySQL, MaxScale, Pgpool-II, or Pgcat) between HariKube and your database cluster. The Load Balancer identifies "Write" operations and routes them to the Database Leader/Primary. The Load Balancer identifies "Read" operations (GET, LIST) and distributes them across multiple Read Replicas. This offloads heavy "Watch" and "List" traffic from your primary database, ensuring that write operations remain lightning-fast and uncontended.

If you have implemented partitioning, moved to a distributed backend, and introduced smart load balancing, but your growth is still outpacing your infrastructure, you have reached the summit of single-cluster scaling. At this stage, it is time to [call us](/contact-us/) for the HariKube Enterprise Edition. You will gain the ability to repeat these same proven strategies across a multi-database matrix, unlocking true horizontal infinity for your control plane.

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