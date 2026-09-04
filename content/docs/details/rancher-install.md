---
title: "Rancher Install"
layout: "simple"
---

You have two options. If you would like to let Rancher itself uses HariKube.

### Standalone install

In this setup you get a fully featured Rancher with HariKube control-plane to scale workloads but enjoying Rancher experience.

First run your HariKube instance:

> ⚠️ A valid license is required to proceed - at least free Starter Edition. We invite you to explore our various licensing tiers on our [Editions](/editions/) page.

Start by authenticating your local Docker client with the private registry at `registry.harikube.info`. This step is essential for pulling images from the registry.

{{< code bash >}}docker login registry.harikube.info
{{< /code >}}

{{< code bash >}}docker run -d \
  --stop-timeout=-1 \
  -e LICENSE_KEY_FILE=/license \
  -e TOPOLOGY_CONFIG=file:///topology.yaml \
  -e ENABLE_TELEMETRY_PUSH=true \
  -v ${PWD}/license:/license:ro \
  -v $(pwd)/topology.yaml:/topology.yaml \
  -v harikube_db:/db \
  -p 2379:2379 \
  registry.harikube.info/harikube/middleware:{{ .Site.Params.middlewareVersion }} \
  --endpoint=multi://http://<default.database.server:2379>
{{< /code >}}

Change your Rancher `/etc/rancher/rke2/config.yaml`:

{{< code bash >}}kube-apiserver-image: "quay.io/harikube/kube-apiserver:v1.36.2"
kube-apiserver-arg:
- "feature-gates=WatchList=true,WatchListClient=true,VolumeAttributesClass=true,MutatingAdmissionPolicy=true,CustomResourceFieldSelectors=true"
- "runtime-config=admissionregistration.k8s.io/v1beta1=true,admissionregistration.k8s.io/v1=true"
- "storage-media-type=application/json"
- "encryption-provider-config="
- "encryption-provider-config-automatic-reload=false"
- "max-requests-inflight=900"
- "max-mutating-requests-inflight=300"
- "watch-cache=false"
- "etcd-servers=http://172.17.0.1:2369"

kube-controller-manager-image: "quay.io/harikube/kube-controller-manager:v1.36.2"
kube-controller-manager-arg:
- "feature-gates=WatchList=true,WatchListClient=true,VolumeAttributesClass=true,MutatingAdmissionPolicy=true,CustomResourceFieldSelectors=true"
- "kube-api-burst=90"
- "kube-api-qps=60"
- "node-cidr-mask-size-ipv4=23"
- "terminated-pod-gc-threshold=1000"
{{< /code >}}

And install your cluster just like normaly:

{{< code bash >}}curl -sfL https://get.rke2.io | INSTALL_RKE2_VERSION=v1.36.2+rke2r1 sh -
{{< /code >}}

The recommended, most effective, and simple architectural approach for deploying services within a HariKube environment is by leveraging virtual clusters. This strategy uses tools like [vCluster](https://www.vcluster.com) to create lightweight, isolated Kubernetes environments that operate inside a larger, physical host cluster.

This model provides clear separation between services and the underlying infrastructure orchestration, delivering significant operational and security benefits.

 - Works Seamlessly on Cloud and Bare-metal
 - Decoupled Infrastructure Management
 - Enhanced Multi-Tenancy and Isolation
 - Independent Scaling and Configuration
 - Fine-Grained Resource Synchronization between host and virtual clusters

Start by bringing your favorite Kubernetes deployment.

### Helm install

Please follow the Helm install seciotn of documentation.

Please visit Helm install method in documentation.
