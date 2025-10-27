---
title: "Docker Building Stand-alone Binaries"
layout: "simple"
---

{{< code bash >}}export KUBE_FASTBUILD=true # false for cross compiling
export KUBE_GIT_TREE_STATE=clean
export KUBE_GIT_VERSION={{ .Site.Params.kubernetesVersion }}
./build/run.sh make WHAT=cmd/kube-apiserver
./build/run.sh make WHAT=cmd/kube-controller-manager
{{< /code >}}

Find the compiled binaries in `_output/dockerized/bin/linux/amd64` folder.