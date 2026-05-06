---
title: "Kubernetes Helm Install"
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

Deploy dependencies:

{{< code bash >}}kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.16.3/cert-manager.yaml
{{< /code >}}

> ⚠️ A valid license is required to proceed - at least free Starter Edition. We invite you to explore our various licensing tiers on our [Editions](/editions/) page.

Next step is authenticating your local registry client with the private registry at `registry.harikube.info`. This step is essential for pulling images from the registry.

{{< code bash >}}kubectl create namespace harikube
kubectl label namespace harikube harikube.info/middleware=enabled --overwrite
kubectl create secret generic -n harikube harikube-license --from-file=${PWD}/license
kubectl create secret docker-registry -n harikube harikube-registry-secret \
--docker-server=registry.harikube.info \
--docker-username=<oci-user> \
--docker-password='<my$secure@password>'
{{< /code >}}

Store your previously created topology config, or create configs on the fly with our [automation](/docs/automation/) tool. You can edit the secret any time, the middleware will apply the changes.

{{< code bash >}}kubectl create secret generic --namespace harikube topology-config --from-file=$(pwd)/topology.yaml
{{< /code >}}

### Install HariKube

> Please find configuration options in the Helm Chart repo: https://github.com/HariKube/harikube-helm-charts/blob/release-v1.0.4/harikube/values.yaml

{{< code bash >}}helm install harikube oci://quay.io/harikube/harikube-helm-charts \
  --version {{ replace .Site.Params.middlewareVersion "release-v" "" }} \
  --debug \
  --namespace harikube \
  --set middleware.monitoring.create=false \
  --set operator.monitoring.create=false
{{< /code >}}

### Create an API only deployment

> Please find configuration options in the Helm Chart repo: https://github.com/HariKube/harikube-helm-charts/blob/release-v1.0.4/harikube/vcluster/api-config.yaml

{{< code bash >}}helm install harikube-vcluster https://charts.loft.sh/charts/vcluster-0.32.1.tgz \
  --debug \
  --namespace harikube \
  --values harikube/vcluster/api-config.yaml
vcluster connect harikube-vcluster
{{< /code >}}

### Create deployment with workload capabilities

> Please find configuration options in the Helm Chart repo: https://github.com/HariKube/harikube-helm-charts/blob/release-v1.0.4/harikube/vcluster/workload-config.yaml

{{< code bash >}}helm install harikube-vcluster https://charts.loft.sh/charts/vcluster-0.32.1.tgz \
  --debug \
  --namespace harikube \
  --values harikube/vcluster/workload-config.yaml
vcluster connect harikube-vcluster
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