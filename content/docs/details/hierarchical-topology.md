---
title: "Hierarchical Topology"
layout: "simple"
---

You can deploy multiple instances of the middleware, where each instance can be configured to delegate to another middleware as its backend. This enables the construction of a multi-layered, hierarchical topology, where data access requests can propagate through multiple layers of the middleware.

Initialize your primary middleware instance to act as the entry point for Kubernetes by launching it with the following configuration. This instance will serve as the top-level interface for Kubernetes API server requests, abstracting the underlying data storage layer while maintaining full compatibility with the etcd API.

{{< code yaml main-topology.yaml >}}backends:
- name: kube-system
  endpoint: http://<kube-system.middleware.server:2379>
  namespace:
    namespace: kube-system
{{< /code >}}

##### Routing Configuration Explained

- **ETCD** endpoint with namespace matching:
  All objects in the `kube-system` namespace are routed to a ETCD backend.

- Rest of the objects are stored in the default database.

As shown, this middleware connects to a backing etcd server to store and retrieve objects within the kube-system namespace. However, instead of connecting directly to etcd, you can deploy another middleware that listens on kube-system.etcd.server:2379. This allows you to insert an additional routing layer between Kubernetes and the storage backend - enabling advanced behaviors, all while preserving the etcd-compatible API surface.

> Update your endpoints, because the example uses Docker bridge IP!

{{< code yaml kube-system-topology.yaml >}}backends:
backends:
- name: pods
  endpoint: http://172.17.0.1:2579
  prefix:
    prefix: pods
- name: secrets
  endpoint: mysql://root:passwd@tcp(172.17.0.1:3306)/pods
  prefix:
    prefix: secrets
- name: configmaps
  endpoint: postgres://postgres:passwd@172.17.0.1:5432/configmaps
  prefix:
    prefix: configmaps
- name: deployments
  endpoint: sqlite://./db/deployments.db?_journal=WAL&cache=shared
  prefix:
    prefix: deployments
{{< /code >}}

##### Routing Configuration Explained

- **ETCD** endpoint with prefix matching:
  All `pods` resources are routed to an ETCD store.
  
- **MySQL** endpoint with prefix matching:
  All `secrets` resources are routed to a MySQL backend.

- **PostgreSQL** endpoint with prefix matching:
  All `configmaps` resources are routed to a PostgreSQL backend.

- **SQLite** endpoint with prefix matching:
  All `deployments` resources are routed to a SQLite backend.

- Rest of the objects are stored in the default database.
