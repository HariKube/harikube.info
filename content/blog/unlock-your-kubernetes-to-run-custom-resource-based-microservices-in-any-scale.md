---
title: "Unlock your Kubernetes to run custom resource based microservices in any scale"
date: 2025-05-24
author: "Richard Kovacs"
description: "Learn about how to distributes Kubernetes database load across multiple databases."
categories: ["Infrastructure", "Microservice"]
tags: ["kubernetes", "custom resource", "scalability", "infrastructure", "microservice"]
featured_image: "/images/blog/unlock-your-kubernetes-to-run-custom-resource-based-microservices-in-any-scale.png"
---

{{< toc >}}

## 🌅 The Rise of Custom Resources and Their Challenges

I don't need to introduce Kubernetes in this post, as it is the de facto standard for running microservices at scale. Kubernetes provides a robust infrastructure not only for running workloads, but also for exposing services, securing applications, configuring authorization, and much more. The introduction of [custom defined resources](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/) extended Kubernetes’ capabilities, enabling developers to implement custom services and controllers without worrying about the underlying infrastructure. This innovation promised faster development and portability. Over the past few years, custom resources and operators/controllers have become increasingly popular. [Crossplane](https://www.crossplane.io/) marked another significant shift, allowing management of resources outside the cluster.

However, custom controllers face significant challenges when handling large volumes of data. Kubernetes relies on [ETCD](https://etcd.io/) for all data storage, which limits scalability, flexibility, and performance for complex or high-volume workloads. What are the main issues?

- ETCD is designed for configuration data, and cluster size is limited.
- ETCD’s consistency model means all members are full replicas, and Kubernetes only connects to the leader.
- ETCD cannot filter data at the storage level; the Kubernetes API server must fetch all records and filter them client-side.
- With a single ETCD instance, both cluster configuration and custom data are mixed. High-load custom services can block or delay normal cluster operations, risking overall cluster health.
- Kubernetes is multi-tenant with isolation methods, but ultimately all data is stored in a single database. A database outage affects the entire cluster, and a malicious attacker could potentially access everything.

These are some of the reasons why custom resources and controllers are used to solve infrastructure problems, and why high-volume data applications are often avoided.

We are not without hope...

## ✨ The Future of Data Management on Kubernetes

Before discussing the solution, let’s highlight the limitations of custom resource controllers in Kubernetes.

| Limitation | Description |
|-|-|
| Eventual Consistency | Updates may not be immediately visible across the system |
| Non-Transactional | No support for ACID transactions |
| Relational Logic | Complex joins or relations between data entities are not supported |
| Limited Data Filtering | No advanced query engine included within Kubernetes |

> 💡 Don't worry, the Kubernetes API aggregation layer can help overcome the limitations of the core API server by allowing you to extend the API with custom APIs that are served by a separate backend, or extension API server. This setup enables you to implement specific logic and capabilities that aren't available in the core API.

It’s time to meet [HariKube](https://harikube.info). HariKube is a middleware that transparently distributes database load across multiple vendor-agnostic databases, delivering low latency, high throughput, and a true cloud-native development experience. It achieves exceptional performance through data distribution and optimized database routing. By offloading resource-intensive workloads from ETCD, HariKube ensures consistent responsiveness and operational efficiency at scale. It enables strict data separation across namespaces, resource types, or services-helping organizations meet security and compliance requirements without sacrificing scalability or performance. Additionally, HariKube simplifies developer workflows by abstracting infrastructure complexity. Developers can focus on data structures and business logic while the platform handles data routing and storage. HariKube is fully transparent; Kubernetes does not notice it is not communicating with an ETCD instance. You can use vanilla Kubernetes for development with limited data, and deploy HariKube in production to handle large datasets and distribute data across multiple backends.

HariKube supports multiple backends, each with different capabilities for data access and filtering. The table below outlines which storage engines are compatible and whether they support storage-side filtering for efficient querying. Find full list of databases [here](/docs/overview/#-supported-databases).

## 👷 Getting Started

First, configure your databases in `docker-compose.yaml`.

{{< code yaml "docker-compose.yaml" >}}version: '3.8'
services:
  etcd2479:
    image: bitnamilegacy/etcd:3.6.4
    container_name: etcd2379
    network_mode: "host"
    command: etcd

  mysql3306:
    image: linuxserver/mariadb:10.11.8
    container_name: mysql3306
    network_mode: "host"
    environment:
      - MYSQL_ROOT_PASSWORD=passwd

  pgsql5432:
    image: postgres:17-alpine3.20
    container_name: pgsql5432
    network_mode: "host"
    environment:
      - POSTGRES_PASSWORD=passwd
{{< /code >}}

Run the following command to start the databases.

{{< code yaml "docker-compose.yaml" >}}docker compose up -d
{{< /code >}}

Next, create a data routing configuration file called `topology.yaml`.

> Update your endpoints, because the example uses Docker bridge IP!

{{< code yaml "topology.yaml" >}}backends:
- name: rbac
  endpoint: http://172.17.0.1:2379
  regexp:
    prefix: events/
    key: events/
- name: kube-system
  endpoint: mysql://root:passwd@tcp(172.17.0.1:3306)/kube_system
  namespace:
    namespace: kube-system
- name: pods
  endpoint: postgres://postgres:passwd@172.17.0.1:5432/pods
  prefix:
    prefix: pods
- name: shirts
  endpoint: sqlite:///db/shirts.db?_journal=WAL&cache=shared
  customresource:
    group: stable.example.com
    kind: shirts
{{< /code >}}

**Routing Configuration Explained:**

- **ETCD with regular expression routing**: Routes events to an ETCD store.
- **MySQL endpoint with namespace matching**: All objects in the `kube-system` namespace are routed to a MySQL backend.
- **PostgreSQL endpoint with prefix matching**: All pod resources-except pods in the `kube-system` namespace-are routed to a PostgreSQL backend.
- **SQLite endpoint for specific custom resources**: Routes all resources of type `shirts` in the group `stable.example.com` to a lightweight embedded SQLite database.
- **All other objects** are stored in the default SQLite database.

After preparing the environment, start the middleware.

> ⚠️ A valid license is required to proceed. We invite you to explore our various licensing tiers on our [Pricing](/pricing/) page.

Start by authenticating your local Docker client with the private registry at `registry.harikube.info`. This step is essential for pulling images from the registry.

{{< code bash >}}docker login registry.harikube.info
{{< /code >}}

{{< code bash >}}docker run -d \
  --name harikube_middleware \
  --net=host \
  -e LICENSE_KEY_FILE=/license \
  -e TOPOLOGY_CONFIG=/topology.yaml \
  -e ENABLE_TELEMETRY_PUSH=true \
  -v ${PWD}/license:/license:ro \
  -v $(pwd)/topology.yaml:/topology.yaml \
  -v harikube_db:/db \
  registry.harikube.info/harikube/middleware:release-v1.0.0 \
  --listen-address=0.0.0.0:2369 --endpoint='multi://sqlite:///db/main.db?_journal=WAL&cache=shared'
{{< /code >}}

The final step is to start the Kubernetes cluster. As mentioned, HariKube is transparent to Kubernetes and works out of the box. However, supporting large datasets requires recompiling the Kubernetes API Server and Controller Manager. You can follow the guide [here](/docs/installation/#-setup-and-start-kubernetes), but for simplicity, this tutorial uses [Kind](https://kind.sigs.k8s.io) with vanilla Kubernetes.

Create a Kind config in `kind-config.yaml`.

{{< code yaml "kind-config.yaml" >}}kind: Cluster
apiVersion: kind.x-k8s.io/v1alpha4
featureGates:
  "CustomResourceFieldSelectors": true
  "WatchList": true
  "WatchListClient": true
nodes:
- role: control-plane
  image: kindest/node:v1.35.0
  kubeadmConfigPatches:
  - |
    kind: ClusterConfiguration
    apiServer:
        extraArgs:
          etcd-servers: "http://172.17.0.1:2369"
{{< /code >}}

Start the cluster with:

{{< code bash >}}kind create cluster --name harikube-cluster --config kind-config.yaml
{{< /code >}}

You can validate that HariKube has distributed your data according to the topology configuration:

{{< code bash >}}# Default database for other objects
docker run -it --rm -v harikube_db:/data alpine/sqlite /data/main.db "select name from kine"
# Kubernetes events only
etcdctl --endpoints=http://172.17.0.1:2379 get / --prefix --keys-only
# Objects in the `kube-system` namespace
docker exec -t mysql3306 mysql -uroot -ppasswd -Dkube_system -e "select name from kine"
# All pods except those in `kube-system`
docker exec -it pgsql5432 su postgres -c "psql -d pods -c 'select name from kine'"
{{< /code >}}

Now, create your first custom resource. Apply the definition file:

{{< code bash >}}kubectl apply -f https://raw.githubusercontent.com/kubernetes/website/main/content/en/examples/customresourcedefinition/shirt-resource-definition.yaml
{{< /code >}}

Then add a few resources:

{{< code bash >}}cat | kubectl apply -f - <<EOF
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

You can verify that HariKube has stored all `shirts` in the selected SQLite database:

{{< code bash >}}# All three `shirts` you created
docker run -it --rm -v harikube_db:/data alpine/sqlite /data/shirts.db "select name from kine"
{{< /code >}}

---

That’s it! Imagine your own data topology and enhance your Kubernetes experience. **Enjoy lower latency, higher throughput, data isolation, virtually unlimited storage, and simplified development.** HariKube supports both flat and hierarchical topologies, allowing you to organize your databases like leaves on a tree.

Thank you for reading, and feel free to share your thoughts.