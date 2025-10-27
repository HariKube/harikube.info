---
title: "Kubernetes vCluster Install"
layout: "simple"
---

The recommended, most effective, and simple architectural approach for deploying services within a HariKube environment is by leveraging virtual clusters. This strategy uses tools like [vCluster](https://www.vcluster.com) to create lightweight, isolated Kubernetes environments that operate inside a larger, physical host cluster.

This model provides clear separation between services and the underlying infrastructure orchestration, delivering significant operational and security benefits.

 - Works Seamlessly on Cloud and Bare-metal
 - Decoupled Infrastructure Management
 - Enhanced Multi-Tenancy and Isolation
 - Independent Scaling and Configuration
 - Fine-Grained Resource Synchronization between host and virtual clusters

Start by bringing your favorite Kubernetes deployment.

Next step is authenticating your local registry client with the private registry at `registry.harikube.info`. This step is essential for pulling images from the registry.

{{< code bash >}}kubectl create namespace harikube
kubectl create secret docker-registry harikube-registry-secret \
--docker-server=registry.harikube.info \
--docker-username=<oci-user> \
--docker-password='<my$secure@password>' \
--namespace=harikube
{{< /code >}}

Store your previously created topology config, or create configs on the fly with our [automation](/docs/automation/) tool.

{{< code bash >}}kubectl create secret generic --namespace harikube topology-config --from-file=$(pwd)/topology.yaml
{{< /code >}}

The last step depends on your personal taste!

### Create an API only deployment

{{< code bash >}}kubectl apply -f https://harikube.info/manifests/harikube-middleware-vcluster-api-{{ .Site.Params.middlewareVersion }}.yaml
{{< /code >}}

{{< code bash >}}vcluster connect harikube
{{< /code >}}

### Create deployment with workload capabilities

{{< code bash >}}kubectl apply -f https://harikube.info/manifests/harikube-middleware-vcluster-workload-{{ .Site.Params.middlewareVersion }}.yaml
{{< /code >}}

{{< code bash >}}vcluster connect harikube
{{< /code >}}

### Create your custom virtual cluster configuration

{{< code bash >}}kubectl apply -f https://harikube.info/manifests/harikube-middleware-deployment-{{ .Site.Params.middlewareVersion }}.yaml
{{< /code >}}

> Find the detailed configuration guide on the [documentation](https://www.vcluster.com/docs/vcluster/configure/vcluster-yaml).

{{< code yaml "my-api-only.yaml" >}}controlPlane:
  distro:
    k8s:
      enabled: true
      image:
        registry: quay.io
        repository: harikube/kubernetes
        tag: {{ .Site.Params.kubernetesVersion }}
      imagePullPolicy: IfNotPresent
      apiServer:
        enabled: true
        extraArgs:
        - --feature-gates=WatchList=true,WatchListClient=true,VolumeAttributesClass=true,MutatingAdmissionPolicy=true
        - --watch-cache=false
        - --etcd-servers=http://harikube-middleware-svc.harikube:2379
        - --runtime-config=admissionregistration.k8s.io/v1beta1=true
        - --max-requests-inflight=900
        - --max-mutating-requests-inflight=300
      controllerManager:
        enabled: true
      scheduler:
        enabled: false
  coredns:
    enabled: false
  backingStore:
    etcd:
      deploy:
        enabled: false
    database:
      embedded:
        enabled: false
  statefulSet:
    highAvailability:
      replicas: 1

sync:
  toHost:
    pods:
      enabled: false
    secrets:
      enabled: false
    configMaps:
      enabled: false
    services:
      enabled: false
    endpoints:
      enabled: false
    persistentVolumeClaims:
      enabled: false
  fromHost:
    events:
      enabled: false
    nodes:
      enabled: false
    secrets:
      enabled: true
      mappings:
        byName:
          "": "harikube"
{{< /code >}}

> If you want to run your services inside the visrtual cluster instead of the host, you can do it simply by enabling `scheduler`, `codedns` and all the necessary synchronizations. Alternatively you can add worker nodes to your virtual cluster.

To create your virtual cluster and automatically configure your local environment for access, execute the following command:

{{< code bash >}}vcluster create my-api-only -n my-api-only -f my-api-only.yaml
{{< /code >}}

---

## Immediate Access

vCluster simplifies the operational workflow by automatically updating your local environment.

 - KUBECONFIG Update: Upon successful creation or connection of the virtual cluster, vCluster automatically updates your local $KUBECONFIG file to include a new context pointing directly to the virtual cluster's API server.
 - Ready for Use: This means you are immediately ready to interact with the new virtual cluster. You can verify connectivity and begin deployment using standard Kubernetes tools.
