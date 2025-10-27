---
title: "TLS Configuration Per Routing"
layout: "simple"
---

{{< code yaml "topology.yaml" >}}backends:
- name: kube-system
  endpoint: https://172.17.0.1:2579
  namespace:
    namespace: kube-system
  backendTLS:
    caFile: /path/to/ca-file
    certFile: /path/to/cert-file
    keyFile: /path/to/key-file
    skipVerify: true
{{< /code >}}