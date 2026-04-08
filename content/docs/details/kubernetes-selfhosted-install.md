---
title: "Kubernetes Self Hosted Install"
layout: "simple"
---

Kubernetes is compatible with `HariKube` by default. However, due to architectural constraints in ETCD-its underlying storage system-it is not optimized for handling very large datasets. To enable support for high-volume data workloads, modifications to specific Kubernetes components (such as the API server) are required and shipped.

## 🚀 Setup and start Kubernetes

### Kubernetes Configuration

HariKube requires specific Kubernetes configuration to enable custom resource routing and external data store integration.

| Mandatory | Category | Option | Description |
|-|-|-|-|
| ✅ | Feature Gate | `CustomResourceFieldSelectors=true` | Enables CR field selectors |
| ✅ | Feature Gate | `WatchList=true` | Enables watch list support |
| ✅ | Feature Gate | `WatchListClient=true` | Enables watch list client feature |
| ✅ | API Server Flag | `--encryption-provider-config=""` | Encryption not supported |
| ✅ | API Server Flag | `--storage-media-type=application/json` | Only JSON storage type is supported |
| ✅ | API Server Flag | `--etcd-servers=http(s)://middleware.service:2379` | Sets the middleware as the ETCD backend |
| ✅ | API Server Flag | `--watch-cache=false` | Disables watch cache |
| ➖ | API Server Flag | `--max-mutating-requests-inflight=400` | Increases concurrency for mutating requests |
| ➖ | API Server Flag | `--max-requests-inflight=800` | Increases concurrency for all requests |

Supported versions are:

| Major version | Patch versions | Architecures |
|-|-|-|
| v1.35 | .0, .1, .2, .3 | linux\amd64, linux\arm64, linux\ppc64le, linux\s390x |

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

### Using HariKube with pre-built images

For users requiring a completely isolated and dedicated Kubernetes cluster, HariKube supports the deployment of standalone Kubernetes environments.

To facilitate this, we provide pre-built multi architecture images that are optimized and ready for configuration via [Kubeadm](https://kubernetes.io/docs/reference/setup-tools/kubeadm/) or any other orchestration tools.

{{< code bash >}}docker pull quay.io/harikube/kube-apiserver:{{ .Site.Params.kubernetesVersion }}
docker pull quay.io/harikube/kube-controller-manager:{{ .Site.Params.kubernetesVersion }}
{{< /code >}}

#### Kubeadm config

Set your InitConfiguration to look for patches in a local directory (e.g., patches/):

{{< code yaml >}}apiVersion: kubeadm.k8s.io/v1beta4
kind: InitConfiguration
patches:
  directory: patches
{{< /code >}}

Inside the `patches` directory, create a file to override the default images for the API Server and Controller Manager:

{{< code yaml >}}apiVersion: v1
kind: Pod
spec:
  containers:
    - name: kube-apiserver
      image: quay.io/harikube/kube-apiserver:{{ .Site.Params.kubernetesVersion }}
---
apiVersion: v1
kind: Pod
spec:
  containers:
    - name: kube-controller-manager
      image: quay.io/harikube/kube-controller-manager:{{ .Site.Params.kubernetesVersion }}
{{< /code >}}

### Comipiling Kubernetes From Source Code (optional)

For detailed information about how to build Kubernetes please follow {{< param-link prefix="https://github.com/kubernetes/kubernetes/blob/" param="kubernetesVersion" sufix="/build/README.md" text="official documentation" >}}. But here are some simple steps to compile it.

{{< code bash >}}git clone https://github.com/kubernetes/kubernetes.git
cd kubernetes
git checkout {{ .Site.Params.kubernetesVersion }}
{{< /code >}}

Download the {{< param-link prefix="https://raw.githubusercontent.com/HariKube/kubernetes-patches/refs/heads/main/kubernetes-" param="kubernetesVersion" sufix=".patch" text="patch file" >}} and apply.

{{< code bash >}}git apply kubernetes-{{ .Site.Params.kubernetesVersion }}.patch
{{< /code >}}

{{< details >}}
{
    "title": "Building Options",
    "details": [
        {
            "title": "Building Stand-alone Binaries",
            "file": "docs/details/building-standalone-binaries"
        },
        {
            "title": "Docker Building Stand-alone Binaries",
            "file": "docs/details/docker-building-standalone-binaries"
        },
        {
            "title": "Building OCI Container Images",
            "file": "docs/details/building-oci-container-images"
        }
    ]
}
{{< /details >}}