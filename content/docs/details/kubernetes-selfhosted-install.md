---
title: "Kubernetes Self Hosted Install"
layout: "simple"
---

Kubernetes is compatible with `HariKube` by default. However, due to architectural constraints in ETCD-its underlying storage system-it is not optimized for handling very large datasets. To enable support for high-volume data workloads, modifications to specific Kubernetes components (such as the API server) are required and shipped.

Start by authenticating your local Docker client with the private registry at `registry.harikube.info`. This step is essential for pulling images from the registry.

{{< code bash >}}docker login registry.harikube.info
{{< /code >}}

{{< code bash >}}docker run -d \
  --stop-timeout=-1 \
  -e TOPOLOGY_CONFIG=file:///topology.yaml \
  -v $(pwd)/topology.yaml:/topology.yaml \
  -v harikube_db:/db \
  -p 2379:2379 \
  registry.harikube.info/harikube/middleware:{{ .Site.Params.middlewareVersion }} \
  --endpoint=multi://http://<default.database.server:2379>
{{< /code >}}

### Using HariKube with pre-built images

For users requiring a completely isolated and dedicated Kubernetes cluster, HariKube supports the deployment of standalone Kubernetes environments.

To facilitate this, we provide pre-built multi architecture images that are optimized and ready for configuration via `Kubeadm` or any other orchestration tools.

{{< code bash >}}docker pull quay.io/harikube/kube-apiserver:{{ .Site.Params.kubernetesVersion }}
docker pull quay.io/harikube/kube-controller-manager:{{ .Site.Params.kubernetesVersion }}
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