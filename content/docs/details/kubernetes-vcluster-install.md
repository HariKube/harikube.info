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

> 🔓 For access control, the vCluster setup keeps things simple: It is only configured to copy your `ServiceAccount` resources to the underlying (host) cluster. This means you should create all of your RBAC (Role-Based Access Control) policies (like `Roles` and `RoleBindings`) directly on your virtual cluster. Your deployed workloads on the host can then use the synchronized `ServiceAccount` on the host cluster, ensuring they have the correct permissions.

### Create deployment with workload capabilities

{{< code bash >}}kubectl apply -f https://harikube.info/manifests/harikube-middleware-vcluster-workload-{{ .Site.Params.middlewareVersion }}.yaml
{{< /code >}}

{{< code bash >}}vcluster connect harikube
{{< /code >}}

### Create your custom virtual cluster configuration

{{< code bash >}}kubectl apply -f https://harikube.info/manifests/harikube-middleware-deployment-{{ .Site.Params.middlewareVersion }}.yaml
{{< /code >}}

> Find the detailed configuration guide on the [documentation](https://www.vcluster.com/docs/vcluster/configure/vcluster-yaml).

{{< code yaml "vcluster-config-workload.yaml" >}}controlPlane:
  distro:
    k8s:
      enabled: true
      image:
        registry: quay.io
        repository: harikube/kubernetes
        # tag: v1.34.1
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
        enabled: true
  coredns:
    enabled: true
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
      enabled: true
    secrets:
      enabled: true
    configMaps:
      enabled: true
    services:
      enabled: true
    endpoints:
      enabled: true
    persistentVolumeClaims:
      enabled: true
    ingresses:
      enabled: true
    networkPolicies:
      enabled: true
    persistentVolumes:
      enabled: true
    volumeSnapshots:
      enabled: true
    storageClasses:
      enabled: true
    serviceAccounts:
      enabled: true
    podDisruptionBudgets:
      enabled: true
    priorityClasses:
      enabled: true
  fromHost:
    secrets:
      enabled: true
      mappings:
        byName:
          "harikube/topology-config": "harikube/topology-config"
{{< /code >}}

> If you want to run your services inside the visrtual cluster instead of the host, you can do it simply by enabling `scheduler`, `codedns` and all the necessary synchronizations. Alternatively you can add worker nodes to your virtual cluster.

To create your virtual cluster and automatically configure your local environment for access, execute the following command:

{{< code bash >}}vcluster create vcluster-config-workload -n vcluster-config-workload -f vcluster-config-workload.yaml
{{< /code >}}

---

## Immediate Access

vCluster simplifies the operational workflow by automatically updating your local environment.

 - KUBECONFIG Update: Upon successful creation or connection of the virtual cluster, vCluster automatically updates your local $KUBECONFIG file to include a new context pointing directly to the virtual cluster's API server.
 - Ready for Use: This means you are immediately ready to interact with the new virtual cluster. You can verify connectivity and begin deployment using standard Kubernetes tools.
