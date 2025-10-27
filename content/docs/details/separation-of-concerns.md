---
title: "Separation of Concerns"
layout: "simple"
---

- Configuration data can be stored in ETCD or any supported database
- Microservice-related data is routed to databases that are best suited to the specific workload characteristics
- Optimizes performance and reduces risk of ETCD overload
- Achieves strong data isolation by enabling the use of dedicated databases per resource type, service, or namespace
- It enhances data security, access control, and fault containment across workloads