---
title: "Building OCI Container Images"
layout: "simple"
---

{{< code bash >}}export KUBE_FASTBUILD=true # false for cross compiling
export KUBE_GIT_TREE_STATE=clean
export KUBE_GIT_VERSION={{ .Site.Params.kubernetesVersion }}
export KUBE_DOCKER_REGISTRY=<your-registry.example.com/kubernetes>
make release-images
{{< /code >}}

Find the baked images at the local registry:

{{< code bash >}}docker image ls | grep -E 'kube-apiserver|kube-controller-manager' | grep $KUBE_GIT_VERSION
{{< /code >}}