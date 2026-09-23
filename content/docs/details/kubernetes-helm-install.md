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

### Install HariKube

> 💡 Prerequisite: The target cluster must have cert-manager pre-installed.

> ⚠️ A valid license is required to proceed - at least free Starter Edition. We invite you to explore our various licensing tiers on our [Editions](/editions/) page.

#### Simple method

{{< code bash >}}kubectl apply -f https://raw.githubusercontent.com/HariKube/harikube-helm-charts/refs/heads/release-v0.16.3/operator-crd.yaml

helm install harikube oci://quay.io/harikube/harikube \
  --version 0.16.3 \
  --create-namespace \
  --namespace harikube \
  --set enterprise.key="<LICENSE_KEY>" \
  --set enterprise.user=<REGISTRY_USER> \
  --set enterprise.password="<REGISTRY_PASSWORD>" \
  --set operator.create=true \
  --set vcluster.exportKubeConfig.server=https://harikube.harikube:443
kubectl wait -n harikube --for=jsonpath='{.status.readyReplicas}'=1 deployment/harikube-operator-deploy --timeout=2m
kubectl wait -n harikube --for=jsonpath='{.status.readyReplicas}'=1 deployment/harikube-middleware-deploy --timeout=2m
kubectl wait -n harikube --for=jsonpath='{.status.readyReplicas}'=1 statefulset/harikube --timeout=5m
{{< /code >}}

#### Ready To Use Install

> For more details please follow the [release docs](https://github.com/HariKube/harikube-helm-charts/releases/tag/release-v0.16.3). Please find configuration options in the [Helm Chart](https://github.com/HariKube/harikube-helm-charts/blob/release-v0.16.3/harikube/values.yaml) repo.

{{< code bash >}}kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.16.3/cert-manager.yaml
kubectl apply -f https://github.com/prometheus-operator/prometheus-operator/releases/download/v0.77.1/stripped-down-crds.yaml
kubectl wait -n cert-manager --for=jsonpath='{.status.readyReplicas}'=1 deployment/cert-manager-webhook --timeout=2m

kubectl apply -f https://raw.githubusercontent.com/HariKube/harikube-helm-charts/refs/heads/release-v0.16.3/operator-crd.yaml

kubectl create namespace harikube
kubectl label namespace harikube harikube.info/harikube-middleware=enabled --overwrite
kubectl label namespace harikube harikube.info/harikube-apiserver=enabled --overwrite
kubectl label namespace harikube harikube.info/harikube-controllermanager=enabled --overwrite

helm install harikube oci://quay.io/harikube/harikube  \
  --version 0.16.3 \
  --namespace harikube \
  --set enterprise.key="<LICENSE_KEY>" \
  --set enterprise.user=<REGISTRY_USER> \
  --set enterprise.password="<REGISTRY_PASSWORD>" \
  --set middleware.monitoring.create=true \
  --set middleware.networkPolicy.create=true \
  --set operator.create=true \
  --set operator.monitoring.create=true \
  --set apiServer.create=true \
  --set apiServer.monitoring.create=true \
  --set apiServer.networkPolicy.create=true \
  --set controllerManager.create=true \
  --set controllerManager.monitoring.create=true \
  --set controllerManager.networkPolicy.create=true \
  --set vcluster.exportKubeConfig.server=https://harikube.harikube:443
kubectl wait -n harikube --for=jsonpath='{.status.readyReplicas}'=1 deployment/harikube-operator-deploy --timeout=2m
kubectl wait -n harikube --for=jsonpath='{.status.readyReplicas}'=1 deployment/harikube-middleware-deploy --timeout=2m
kubectl wait -n harikube --for=jsonpath='{.status.readyReplicas}'=1 statefulset/harikube --timeout=5m
{{< /code >}}

#### Post Install

Once the virtual cluster is running, you can Store your previously created topology config, or create configs on the fly with our [automation](/docs/automation/) tool. You can edit the secret any time, the middleware will apply the changes:

{{< code bash >}}kubectl wait -n harikube --for=jsonpath='{.status.readyReplicas}'=1 statefulset/harikube --timeout=5m
kubectl create secret generic --namespace harikube topology-config --from-file=$(pwd)/topology.yaml
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