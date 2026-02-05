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

> ⚠️ A valid license is required to proceed - at least free Starter Edition. We invite you to explore our various licensing tiers on our [Editions](/editions/) page.

Next step is authenticating your local registry client with the private registry at `registry.harikube.info`. This step is essential for pulling images from the registry.

{{< code bash >}}kubectl create namespace harikube
kubectl create secret generic -n harikube harikube-license --from-file=${PWD}/license
kubectl create secret docker-registry -n harikube harikube-registry-secret \
--docker-server=registry.harikube.info \
--docker-username=<oci-user> \
--docker-password='<my$secure@password>'
{{< /code >}}

Store your previously created topology config, or create configs on the fly with our [automation](/docs/automation/) tool.

{{< code bash >}}kubectl create secret generic --namespace harikube topology-config --from-file=$(pwd)/topology.yaml
{{< /code >}}

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

{{< code yaml "vcluster-config-custom.yaml" >}}controlPlane:
  distro:
    k8s:
      enabled: true
      image:
        registry: quay.io
        repository: harikube/kubernetes
        # tag: v1.35.0
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

To create your virtual cluster and automatically configure your local environment for access, execute the following command:

{{< code bash >}}vcluster create vcluster-config-custom -n vcluster-config-custom -f vcluster-config-custom.yaml
{{< /code >}}

---

The last step depends on your personal taste!

## Admin Access

> 🔓 vCluster simplifies the operational workflow by automatically updating your local environment. For more details how to disable this behaviour, or how to get config by service account for example please wisit the official docs` [Access and expose vCluster](https://www.vcluster.com/docs/vcluster/manage/accessing-vcluster) section.

 - KUBECONFIG Update: Upon successful creation or connection of the virtual cluster, vCluster automatically updates your local $KUBECONFIG file to include a new context pointing directly to the virtual cluster's API server.
 - Ready for Use: This means you are immediately ready to interact with the new virtual cluster. You can verify connectivity and begin deployment using standard Kubernetes tools.

## Service Access From Host

> 🔓 For service access from host, the vCluster setup keeps things simple: Create your ServiceAccount, generate a secret with the command below, and vCluster will sync the secret to the host cluster.

{{< code yaml >}}apiVersion: v1
kind: Secret
metadata:
  name: remote-your-service-account-name
  annotations:
    kubernetes.io/service-account.name: "your-service-account-name"
type: kubernetes.io/service-account-token
{{< /code >}}

Now you can mount the secret to your workload to talk with the virtual cluster.