---
title: "Step-by-Step Installation"
layout: "simple"
description: "Get started with installing HariKube on your Kubernetes cluster in minutes."
prevTitle: "Overview"
prevLink: "/docs/overview/"
nextTitle: "Custom Resource"
nextLink: "/docs/custom-resource/"
---

{{< ld-docs >}}

{{< toc >}}

## 🗂️ Create database topology config file

HariKube determines data locality using the object key structure and applies routing based on configurable policies,
such as matching by resource type, namespace, key prefix, or custom resource definition.

Routing configurations are evaluated in order from top to bottom, and the first matching rule determines the data's target database. Once a match is found, subsequent rules are ignored for that resource.

> Routing policies must be carefully designed, as adding or changing a policy for resource types that already have stored data can result in the existing records becoming inaccessible. HariKube does not migrate previously stored resources to the new target automatically, so any change in routing may lead to apparent data loss unless migration handled manually.

> During runtime the middleware monitors configuration changes and applies new configuration, but only adding new configuration to the bottom is supported.

> Names and endpoints must be unique in the configuration. If you have to change `endpoint`, first ensure all data exists on the new endpoint, and then restart the middleware. If you have to change `name`, restart the middleware and all services - including Kubernetes - which depends on historical data.

> Update your endpoints, because the example uses Docker bridge IP!

{{< code yaml "topology.yaml" >}}backends:
- name: rbac
  endpoint: http://172.17.0.1:2579
  regexp:
    prefix: (clusterrolebindings|clusterroles|rolebindings|roles|serviceaccounts)
    key: (clusterrolebindings|clusterroles|rolebindings|roles|serviceaccounts)
- name: kube-system
  endpoint: mysql://root:passwd@tcp(172.17.0.1:3306)/kube_system
  namespace:
    namespace: kube-system
- name: pods
  endpoint: postgres://postgres:passwd@172.17.0.1:5432/pods
  prefix:
    prefix: pods
- name: shirts
  endpoint: sqlite://./db/shirts.db?_journal=WAL&cache=shared
  customresource:
    group: stable.example.com
    kind: shirts
{{< /code >}}

### Routing Configuration Explained

- **ETCD** with regular expression routing:
  Routes Kubernetes RBAC resources to an ETCD store.
  
- **MySQL** endpoint with namespace matching:
  All objects in the `kube-system` namespace are routed to a MySQL backend.

    > If you want only a selected list of resources, you can configure them via `kinds` field. For custom resources you have to create a separate policy, because both given types and custom resources are not supported in the same time.
{{< code yaml "topology.yaml" >}}- name: kube-system
  endpoint: mysql://root:passwd@tcp(172.17.0.1:3306)/kube_system
  namespace:
    namespace: kube-system
    kinds:
    - pods
    - deployments
{{< /code >}}

- **PostgreSQL** endpoint with prefix matching:
  All `pods` resources - except `pods` in `kube-system` namespace - are routed to a PostgreSQL backend.

- **SQLite** endpoint for specific custom resources:
  Routes all resources of type `shirts` in the group `stable.example.com` to a lightweight embedded SQLite database.

- Rest of the objects are stored in the default database.

{{< details >}}
{
    "title": "Advanced Configuration Options",
    "details": [
        {
            "title": "TLS Configuration Per Routing",
            "file": "docs/details/tls-config"
        },
        {
            "title": "Connection Pool Configuration Per Routing",
            "file": "docs/details/connection-pool-config"
        },
        {
            "title": "Compact Related Settings",
            "file": "docs/details/compact-config"
        },
        {
            "title": "Hierarchical Topology",
            "file": "docs/details/hierarchical-topology"
        }
    ]
}
{{< /details >}}

## 📘 Metadata Store Configuration

HariKube includes an internal metadata store that maintains mapping information about the underlying databases. It keeps track of which database is responsible for each data segment, ensuring consistency and fast lookups without querying every backend directly. The metadata store is central to HariKube’s ability to provide dynamic data placement, multi-database support, and high-performance routing across flat or hierarchical topologies. To configure metadata store you have to set environment variable(s) for the middleware. Default Metadata store is `bbolt`.

- `REVISION_MAPPER_CACHE_EVICTION`: Eviction policy [LFU, LRU, MRU, FIFO]. Default FIFO
- `REVISION_MAPPER_CACHE_CAPACITY`: Capacity of the in-memory cache. Default `10000`

{{< details >}}
{
    "details": [
        {
            "title": "Configuring BBolt Metadata Store",
            "file": "docs/details/bbolt-mapper"
        },
        {
            "title": "Configuring SQLite Metadata Store",
            "file": "docs/details/sqlite-mapper"
        }
    ]
}
{{< /details >}}

## 🔌 Middleware Configuration

> ⚠️ HariKube images aren’t public yet. If you’d like to try them, request a free trial version on the [Open Beta invitation](/beta-invitation/) page.

The middleware is designed to operate seamlessly in both containerized and traditional environments. It can be executed within a Kubernetes cluster (e.g., as a Pod or Deployment) or deployed external to the cluster. All operational configuration files and parameters are standardized and require no modification based on the deployment location.

{{< details >}}
{
    "details": [
        {
            "title": "Configuration Options",
            "file": "docs/details/middleware-flags"
        },
        {
            "title": "Help Us Improve by Enabling Telemetry",
            "file": "docs/details/telemetry"
        }
    ]
}
{{< /details >}}

## 🚀 Setup and start Kubernetes

### Kubernetes Configuration

HariKube requires specific Kubernetes configuration to enable custom resource routing and external data store integration.

| Mandatory | Category | Option | Description |
|-|-|-|-|
| ✅ | Feature Gate | `CustomResourceFieldSelectors=true` | Enables CR field selectors |
| ✅ | Feature Gate | `WatchList=true` | Enables watch list support |
| ✅ | Feature Gate | `WatchListClient=true` | Enables watch list client feature |
| ✅ | API Server Flag | `--encryption-provider-config=""` | Encryption not supported |
| ✅ | API Server Flag | `--etcd-servers=http(s)://middleware.service:2379` | Sets the middleware as the ETCD backend |
| ➖ | API Server Flag | `--watch-cache=false` | Disables watch cache (recommended for large data) |
| ➖ | API Server Flag | `--max-mutating-requests-inflight=400` | Increases concurrency for mutating requests |
| ➖ | API Server Flag | `--max-requests-inflight=800` | Increases concurrency for all requests |
| ➖ | API Server Flag | `--enable-garbage-collector=false` | On case all databases use automatic GC |
| ➖ | Controller Manager Flag | `--enable-garbage-collector=false` | On case all databases use automatic GC |

Supported versions are:

| Major version | Patch versions | Architecures |
|-|-|-|
| v1.33 | v1.33.0, v1.33.1, v1.33.2, v1.33.3, v1.33.4, v1.33.5 | linux\amd64, linux\arm64, linux\ppc64le, linux\s390x |
| v1.34 | v1.34.0, v1.34.1 | linux\amd64, linux\arm64, linux\ppc64le, linux\s390x |

{{< details >}}
{
    "title": "Installation Options",
    "details": [
        {
            "title": "HariKube with vCluster - recommended",
            "file": "docs/details/kubernetes-vcluster-install"
        },
        {
            "title": "HariKube on Self-Hosted Kubernetes",
            "file": "docs/details/kubernetes-selfhosted-install"
        }
    ]
}
{{< /details >}}

#### [<-- Overview](/docs/overview/) | [Custom Resource -->](/docs/custom-resource/)
