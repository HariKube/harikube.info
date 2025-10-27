---
title: "Compact Related Settings"
layout: "simple"
---

{{< code yaml "topology.yaml" >}}backends:
- name: kube-system
  endpoint: mysql://root:passwd@tcp(172.17.0.1:3306)/kube_system
  namespace:
    namespace: kube-system
  compactInterval: 5m
  compactIntervalJitter: 0
  compactTimeout: 5s
  compactMinRetain: 1000
  compactBatchSize: 1000
{{< /code >}}