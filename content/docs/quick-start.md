---
title: "Quick Start: Create, Watch, and Update Shared State"
seo_title: "Kubernetes Shared-State Quick Start"
layout: "simple"
description: "Deploy a disposable HariKube evaluation, create a custom resource, observe updates with Kubernetes watches, and clean up safely."
applies_to: "HariKube Helm chart 0.16.3, a disposable virtual cluster, and standard Kubernetes custom resources."
nextTitle: "Architecture and fit"
nextLink: "/docs/overview/"
---

{{< ld-docs >}}

{{< toc >}}

## 🧭 1. Choose a starting pattern {#choose-a-pattern}

Start with **shared application state**: create a Shirt resource, read it through the Kubernetes API, and observe an update through a watch. The same resource-and-watch model can support services, controllers, and AI agents.

This is a small **API smoke test**, not a performance benchmark or a complete business application. It uses the default SQLite backend and does not require Kafka. For other goals, follow the [scaling](/topics/kubernetes-scaling/), [operators and application platform](/topics/kubernetes-operators/), or [AI infrastructure](/topics/ai-infrastructure/) learning path. [Event streaming](/features/event-streaming/) is and has a separate evaluation path.

## ✅ Before you begin

Use a **disposable host cluster**, not your production cluster. You need:

- Cluster-admin access, `kubectl`, OCI-capable Helm, and the [vCluster CLI](https://www.vcluster.com/docs/vcluster/manage/accessing-vcluster).
- A host Kubernetes version compatible with the pinned chart (chart 0.16.3 declares Kubernetes **1.34 or newer**); verify your cluster and chart compatibility before installing.
- cert-manager already installed and healthy, plus working persistent-volume provisioning. The example requests persistent storage for the middleware and virtual cluster.
- A valid HariKube license, including the free Starter Edition, and registry credentials. [Choose an edition](/editions/) or [ask for evaluation access](/get-started/).
- Outbound access to the chart registry, container registries, and the linked CRD manifest.

The commands below use Bash and pin chart **0.16.3**, matching the published installation example. They are not a promise of compatibility with every host distribution. Read the [installation guide](/docs/installation/) for topology, credentials, and deployment alternatives.

## 🚀 2. Deploy a disposable evaluation {#deploy-an-evaluation}

First confirm and record the **host** context. Keep this value for cleanup; do not install into a context you have not checked.

{{< code bash >}}HOST_CONTEXT=$(kubectl config current-context)
printf 'Host context: %s\n' "$HOST_CONTEXT"
kubectl cluster-info
{{< /code >}}

Set `LICENSE_KEY`, `REGISTRY_USER`, and `REGISTRY_PASSWORD` in your shell using your issued credentials. Avoid saving secrets in shell history or committing a values file. The parameter checks below stop the Helm command if a credential is missing.

{{< code bash >}}kubectl apply -f https://raw.githubusercontent.com/HariKube/harikube-helm-charts/refs/heads/release-v0.16.3/operator-crd.yaml

helm install harikube oci://quay.io/harikube/harikube \
  --version 0.16.3 --create-namespace --namespace harikube \
  --set-string enterprise.key="${LICENSE_KEY:?Set LICENSE_KEY}" \
  --set-string enterprise.user="${REGISTRY_USER:?Set REGISTRY_USER}" \
  --set-string enterprise.password="${REGISTRY_PASSWORD:?Set REGISTRY_PASSWORD}" \
  --set middleware.endPoint.url="multi://sqlite:///db/main.db?_journal_mode=WAL&_busy_timeout=30000&_synchronous=NORMAL&_txlock=immediate&_stmt_cache_size=20&cache=shared" \
  --set operator.create=true \
  --set vcluster.exportKubeConfig.server=https://harikube.harikube:443

kubectl wait -n harikube --for=jsonpath='{.status.readyReplicas}'=1 \
  deployment/harikube-operator-deploy --timeout=2m
kubectl wait -n harikube --for=jsonpath='{.status.readyReplicas}'=1 \
  deployment/harikube-middleware-deploy --timeout=2m
kubectl wait -n harikube --for=jsonpath='{.status.readyReplicas}'=1 \
  statefulset/harikube --timeout=5m

vcluster connect harikube -n harikube
{{< /code >}}

**Expected:** Helm reports a deployment and all three waits succeed. Connecting with vCluster selects the virtual cluster; Helm installation alone does not switch your context. Keep the vCluster connection active. If it occupies your terminal, use another terminal for the remaining commands and retain the original host-context name for cleanup.

Verify the selected context **before creating resources**:

{{< code bash >}}EVAL_CONTEXT=$(kubectl config current-context)
printf 'Evaluation context: %s\n' "$EVAL_CONTEXT"
kubectl get namespaces
{{< /code >}}

Stop if these commands still target the host cluster. Do not apply a mixed-database topology just to run this example: its endpoints must be configured for your environment, and routing changes do not migrate existing data automatically.

## 👕 3. Create and read application state {#create-application-state}

Apply the [Kubernetes project's Shirt CRD](https://kubernetes.io/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/) to the **virtual** cluster, wait for API registration, and create an isolated example namespace:

{{< code bash >}}kubectl apply -f https://raw.githubusercontent.com/kubernetes/website/main/content/en/examples/customresourcedefinition/shirt-resource-definition.yaml
kubectl wait --for=condition=Established crd/shirts.stable.example.com --timeout=60s
kubectl create namespace hk-quickstart

kubectl apply -n hk-quickstart -f - <<'YAML'
apiVersion: stable.example.com/v1
kind: Shirt
metadata:
  name: demo-shirt
spec:
  color: blue
  size: M
YAML

kubectl get shirts -n hk-quickstart
{{< /code >}}

**Expected:** the resource is readable through the same Kubernetes API clients you already use:

{{< output text >}}NAME         COLOR   SIZE
demo-shirt   blue    M
{{< /output >}}

## 👀 4. Observe a change {#observe-a-change}

In a second terminal connected to the **same virtual cluster**, start a watch:

{{< code bash >}}kubectl config current-context
kubectl get shirts -n hk-quickstart --watch
{{< /code >}}

In your first working terminal, update the resource:

{{< code bash >}}kubectl patch shirt demo-shirt -n hk-quickstart \
  --type=merge -p '{"spec":{"color":"green"}}'
kubectl get shirt demo-shirt -n hk-quickstart -o jsonpath='{.spec.color}{"\n"}'
{{< /code >}}

**Expected:** the read returns `green`, and the watch prints an updated row. Stop the watch with **Ctrl+C**. You have exercised resource creation, reads, updates, and change observation—not exactly-once processing or cross-component transaction guarantees.

A controller or agent could now reconcile work from that state. To continue, build an [operator controller](/blog/create-microservice-with-operator-2/) or explore the [separately installed watch-to-HTTP trigger](/blog/introducing-serverless-kube-watch-trigger-declarative-event-triggers-for-kubernetes/). Those integrations need their own configuration, permissions, and delivery validation; they are not installed by this smoke test.

## 🛠️ If something does not work

| Symptom | What to check |
| --- | --- |
| Helm cannot pull images or the chart | Registry access, issued credentials, license, and the pinned chart version. Use a protected Helm values file if your secrets contain Helm-special characters such as commas. |
| A wait times out | On the host, inspect `kubectl get pods,pvc -n harikube`, pod events, storage provisioning, and cert-manager health. Do not continue until the deployment is ready. |
| `shirts` is not a recognized resource | Verify the virtual-cluster context, CRD apply result, and `Established` condition. |
| The watch shows no update | Confirm both terminals use the same context and `hk-quickstart` namespace; read the object directly and restart the watch if needed. |
| You want to add database routing | Read the [routing warnings](/docs/installation/) and [automation sequencing](/docs/automation/) first; do not change routing under existing resources without a migration plan. |

## 🧹 5. Clean up the evaluation {#clean-up}

**These commands delete data.** Use them only for the dedicated evaluation you just created. While still connected to the virtual cluster:

{{< code bash >}}kubectl --context "${EVAL_CONTEXT:?Set EVAL_CONTEXT to your verified virtual-cluster context}" delete namespace hk-quickstart
# Only if this evaluation is the sole user of the Shirt CRD:
kubectl --context "${EVAL_CONTEXT:?Set EVAL_CONTEXT to your verified virtual-cluster context}" delete crd shirts.stable.example.com
vcluster disconnect
{{< /code >}}

If you changed terminals, set `EVAL_CONTEXT` to the verified virtual-cluster context before deleting its resources. For host cleanup, set `HOST_CONTEXT` to the original host-context name you recorded in step 2. The commands below target that context explicitly rather than relying on a context switch.

{{< code bash >}}# Every destructive command explicitly targets the recorded host context.
kubectl --context "${HOST_CONTEXT:?Set HOST_CONTEXT to your recorded host context}" cluster-info &&
helm --kube-context "$HOST_CONTEXT" uninstall harikube -n harikube &&
kubectl --context "$HOST_CONTEXT" delete namespace harikube
{{< /code >}}

Deleting the namespace removes its retained namespaced claims; underlying volume deletion depends on the storage reclaim policy. The host-wide `topologyconfigs.harikube.info` CRD is intentionally left in place because another installation may use it. Remove it only after confirming that no other installation depends on it. Leave shared cert-manager installations untouched.

## 📚 Where to go next

- [Understand the architecture and limitations](/docs/overview/) before expanding the evaluation.
- [Configure resources and routing](/docs/custom-resource/) for your own application model.
- [Measure performance and latency](/features/performance/) using your own workload, topology, and failure cases.
