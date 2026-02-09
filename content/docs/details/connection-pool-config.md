---
title: "Connection Pool Configuration Per Routing"
layout: "simple"
---

{{< code yaml "topology.yaml" >}}backends:
- name: kube-system
  endpoint: mysql://root:passwd@tcp(172.17.0.1:3306)/kube_system
  namespace:
    namespace: kube-system
  connectionPool:
    maxIdle: 50
    maxOpen: 90
    maxLifeTime: 5m
    maxIdleLifeTime: 5m
{{< /code >}}