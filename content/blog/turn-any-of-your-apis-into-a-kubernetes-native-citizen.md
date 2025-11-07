---
title: "Turn any of your APIs into a Kubernetes-native citizen"
date: 2025-11-06
author: "Richard Kovacs"
description: "This Open-source tool helps you implementing Kubernetes Agrregation APIs."
categories: ["Open-Source", "Microservice"]
tags: ["kubernetes", "microservice", "development"]
featured_image: "/images/blog/turn-any-of-your-apis-into-a-kubernetes-native-citizen.png"
---

{{< toc >}}

## ⚡ Transforming APIs into Kubernetes-Native Citizens

The power of Kubernetes lies in its unified control plane and its resource model. But what if you could make any of your existing APIs or services behave like a native Kubernetes resource—complete with `kubectl` compatibility, cluster-level governance, and seamless integration?

Developing extensions via the **Kubernetes Aggregation Layer** has traditionally been a highly complex task, demanding deep knowledge of internal API structures, serialization, and resource handling. This steep learning curve often prevents developers from extending Kubernetes as much as they'd like.

This post introduces the [kubernetes-aggregator-framework](https://github.com/HariKube/kubernetes-aggregator-framework), an open-source tool designed to drastically simplify this process. We'll show you how this framework hides the complexity of the Kubernetes API server internals, allowing you to rapidly turn existing microservices or custom data sources into Kubernetes-native citizens.

## ❓ What the Kubernetes Aggregation Layer Gives You

The [Kubernetes Aggregation Layer](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/) allows you to extend the core Kubernetes API with your own custom APIs. Think of it as a gateway that lets you add new types of resources to your cluster that behave just like native Kubernetes objects (like pods or services).

## 🤹 The Difficulty of Developing an API Server Without Frameworks

Building a custom API server for Kubernetes from scratch is a complex and challenging task. It requires a deep understanding of the Kubernetes API's internals, including:

This level of detail makes it very difficult to develop an API server without extensive, in-depth knowledge of Kubernetes' inner workings.

## 💡 How This Framework Simplifies the Process

Recognizing these challenges, our framework provides a straightforward solution to make building custom Kubernetes API servers easy and accessible. It hides away much of the complex, low-level work, allowing you to focus on your core logic.

## 🔌 How to Use It

> Kubernetes uses `HTTPS` by default, so you need a certificate for the service. The most common way to automate this step is installing [Cert-Manager](https://cert-manager.io) to the cluster.

In the first step create an `APIService` and the related service manifests. Edit your Deployment to mount certificate.

{{< code yaml "apis-service.yaml" >}}apiVersion: apiregistration.k8s.io/v1
kind: APIService
metadata:
  name: v1.custom-api.example.com # This has a stict format
  annotations:
    cert-manager.io/inject-ca-from: v1-custom-api-service/defaultyour service
spec:
  group: custom-api.example.com
  version: v1
  groupPriorityMinimum: 1000
  versionPriority: 10
  service:
    name: v1-custom-api-service
    namespace: default
    port: 443
  caBundle: ""
---
apiVersion: cert-manager.io/v1
kind: Certificate
metadata:
  name: v1-custom-api-service-cert
  namespace: system
spec:
  secretName: v1-custom-api-service-tls
  issuerRef:
    name: v1-custom-api-service-ca
  commonName: v1-custom-api-service/default.svc
  dnsNames:
  - v1-custom-api-service/default.svc
  - v1-custom-api-service/default.svc.cluster.local
---
apiVersion: v1
kind: Service
metadata:
  name: v1-custom-api-service
spec:
  ports:
    - port: 443
      protocol: TCP
      targetPort: 7443
  selector:
    app: custom-api.example.com
{{< /code >}}

### Creating raw endpoints, without any Kubernetes behaviour dependency

{{< code golang "api-service.go" >}}server := *kaf.NewServer(kaf.ServerConfig{
    Port:     port,
    CertFile: certFile,
    KeyFile:  keyFile,
    Group:    "custom-api.example.com",
    Version:  "v1",
    APIKinds: []kaf.APIKind{
        {
            ApiResource: metav1.APIResource{
                Name:  "foo",
                Verbs: []string{"get"},
            },
            RawEndpoints: map[string]http.HandlerFunc{
                "": func(w http.ResponseWriter, r *http.Request) {
                    ...
                },
                "/bar": func(w http.ResponseWriter, r *http.Request) {
                    ...
                },
            },
        },
    },
}),

_ := server.Start(context.Background())
{{< /code >}}

Call API via `kubectl`.

{{< code bash >}}kubectl get --raw /apis/custom-api.example.com/v1/foo
kubectl get --raw /apis/custom-api.example.com/v1/foo/bar
{{< /code >}}

---

### Create fully customized API endpoints for cluster and namespace scoped custom resource

{{< code golang "api-service.go" >}}kaf.APIKind {
    ApiResource: metav1.APIResource{
        Name:  "clustertasks",
        Kind:  "ClusterPod",
        Verbs: []string{"get", "list", "watch", "create", "update", "delete"},
    },
    CustomResource: &kaf.CustomResource{
        CreateHandler: func(namespace, name string, w http.ResponseWriter, r *http.Request) {
            w.Header().Set("Content-Type", "application/json; charset=utf-8")
        },
        GetHandler: func(namespace, name string, w http.ResponseWriter, r *http.Request) {
            w.Header().Set("Content-Type", "application/json; charset=utf-8")
        },
        ListHandler: func(namespace, name string, w http.ResponseWriter, r *http.Request) {
            w.Header().Set("Content-Type", "application/json; charset=utf-8")
        },
        ReplaceHandler: func(namespace, name string, w http.ResponseWriter, r *http.Request) {
            w.Header().Set("Content-Type", "application/json; charset=utf-8")
        },
        DeleteHandler: func(namespace, name string, w http.ResponseWriter, r *http.Request) {
            w.Header().Set("Content-Type", "application/json; charset=utf-8")
        },
        WatchHandler: func(namespace, name string, w http.ResponseWriter, r *http.Request) {
            w.Header().Set("Content-Type", "application/json; charset=utf-8")
        },
    },
},
kaf.APIKind {
    ApiResource: metav1.APIResource{
        Name:       "customtasks",
        Namespaced: true,
        Kind:       "CustomPod",
        Verbs:      []string{"get", "list", "watch", "create", "update", "delete"},
    },
    CustomResource: &kaf.CustomResource{
        CreateHandler: func(namespace, name string, w http.ResponseWriter, r *http.Request) {
            w.Header().Set("Content-Type", "application/json; charset=utf-8")
        },
        GetHandler: func(namespace, name string, w http.ResponseWriter, r *http.Request) {
            w.Header().Set("Content-Type", "application/json; charset=utf-8")
        },
        ListHandler: func(namespace, name string, w http.ResponseWriter, r *http.Request) {
            w.Header().Set("Content-Type", "application/json; charset=utf-8")
        },
        ReplaceHandler: func(namespace, name string, w http.ResponseWriter, r *http.Request) {
            w.Header().Set("Content-Type", "application/json; charset=utf-8")
        },
        DeleteHandler: func(namespace, name string, w http.ResponseWriter, r *http.Request) {
            w.Header().Set("Content-Type", "application/json; charset=utf-8")
        },
        WatchHandler: func(namespace, name string, w http.ResponseWriter, r *http.Request) {
            w.Header().Set("Content-Type", "application/json; charset=utf-8")
        },
    },
},
{{< /code >}}

Call API via `kubectl`.

{{< code bash >}}kubectl create --raw /apis/custom-api.example.com/v1/clustertasks/foo -f clustertask.yaml
kubectl replace --raw /apis/custom-api.example.com/v1/clustertasks/foo -f clustertask.yaml
kubectl get clustertasks
kubectl get clustertasks foo
kubectl get clustertasks -w
kubectl get clustertasks foo -w
kubectl delete clustertasks foo
{{< /code >}}

{{< code bash >}}kubectl create --raw /apis/custom-api.example.com/v1/namespaces/default/customtasks/foo -f customtask.yaml
kubectl replace --raw /apis/custom-api.example.com/v1/namespaces/default/customtasks/foo -f clustertask.yaml
kubectl get customtasks
kubectl get customtasks foo
kubectl get customtasks -w
kubectl get customtasks foo -w
kubectl delete customtasks foo
{{< /code >}}

---

### Create and API extending Kubernetes API capabilities, for example collecting events of Pods

{{< code golang "api-service.go" >}}type CombinedPod struct {
	metav1.TypeMeta   `json:",inline"`
	metav1.ObjectMeta `json:"metadata,omitempty"`

	Spec   corev1.PodSpec    `json:"spec,omitempty"`
	Status corev1.PodStatus  `json:"status,omitempty"`
}

type CombinedPodList struct {
	metav1.TypeMeta `json:",inline"`
	metav1.ListMeta `json:"metadata,omitempty"`
	Items           []CombinedPod `json:"items"`
}
{{< /code >}}

{{< code golang "api-service.go" >}}kubeClient, _ := client.New(ctrl.GetConfigOrDie(), client.Options{
  Scheme: scheme,
})

dynamicKubeClient, _ := dynamic.NewForConfig(ctrl.GetConfigOrDie())

Server: *kaf.NewServer(kaf.ServerConfig{
    KubeClient: kubeClient,
    DynamicKubeClient: dynamicKubeClient,
    ...
{{< /code >}}

{{< code golang "api-service.go" >}}kaf.APIKind {
    ApiResource: metav1.APIResource{
        Name:       "combinedpods",
        Namespaced: true,
        Kind:       "CombinedPod",
        Verbs:      []string{"get", "list", "watch"},
    },
    Resource: &kaf.Resource{
        CreateNew: func() (schema.GroupVersionResource, client.Object) {
            return corev1.GroupVersion.WithResource("pods"), &corev1.Pod{}
        },
        CreateNewList: func() (schema.GroupVersionResource, client.ObjectList) {
            return corev1.GroupVersion.WithResource("podlist"), &corev1.PodList{}
        },
        ListCallback: func(ctx context.Context, namespace, _ string, objList client.ObjectList) (any, error) {
            podList, ok := objList.(*corev1.PodList)
            if !ok {
              return nil, fmt.Errorf("failed to convert podlist for: %s", objList.GetObjectKind().GroupVersionKind().String())
            }

            // Do what you want

            combinedPods := CombinedPodList{
              TypeMeta: metav1.TypeMeta{
                Kind:       "CombinedPodList",
                APIVersion: Group + "/" + Version,
              },
              ListMeta: metav1.ListMeta{
                ResourceVersion:    podList.ResourceVersion,
                Continue:           podList.Continue,
                RemainingItemCount: podList.RemainingItemCount,
              },
              Items: []CombinedPod{},
            }

            for _, t := range items {
              pod := t.(*corev1.Pod)

              ct := CombinedPod{
                TypeMeta: metav1.TypeMeta{
                  Kind:       "CombinedPod",
                  APIVersion: Group + "/" + Version,
                },
                ObjectMeta: pod.ObjectMeta,
                Spec:       pod.Spec,
              }

              combinedPods.Items = append(combinedPods.Items, ct)
            }

            return combinedPods, nil
          },
          WatchCallback: func(ctx context.Context, _, _ string, unstructuredObj *unstructured.Unstructured) (any, error) {
            pod := corev1.Pod{}
            if err := runtime.DefaultUnstructuredConverter.FromUnstructured(unstructuredObj.Object, &pod); err != nil {
              return nil, fmt.Errorf("failed to convert unstructured: %v", err)
            }

            // Do what you want

            cp := CombinedPod{
              TypeMeta: metav1.TypeMeta{
                Kind:       "CombinedPod",
                APIVersion: Group + "/" + Version,
              },
              ObjectMeta: pod.ObjectMeta,
              Spec:       pod.Spec,
            }

            return cp, nil
          },
      },
},
{{< /code >}}

Call API via `kubectl`.

{{< code bash >}}kubectl get combinedtasks -A
kubectl get combinedtasks -n default
kubectl get combinedtasks -n default foo
kubectl get combinedtasks -n default foo -o yaml
{{< /code >}}

## 🧠 Final Thoughts

We've explored how the kubernetes-aggregator-framework dramatically simplifies the complex world of the Kubernetes Aggregation Layer. The ability to expose any of your existing APIs as native Kubernetes Custom Resources is a game-changer.

By abstracting away the heavy lifting—like handling API registration, request routing, serialization, and proper Kubernetes API conventions—the framework allows you to focus purely on your core business logic. You gain the best of both worlds: the **simplicity of standard API development** coupled with the **powerful, unified control plane** that Kubernetes offers.

This framework is not just about making development easier; it’s about enhancing your cluster’s capabilities. You can now enforce consistent security policies, leverage standard tooling like kubectl, and achieve genuine **Kubernetes-native integration** for every microservice you build.

We hope this tool empowers you to unlock new levels of performance and simplicity within your data topology. Don't let the complexity of Kubernetes API extensions hold you back any longer.

## 🙏 Share Feedback and Report Issues

Your feedback is invaluable in helping us improve this framework. If you encounter any issues, have a suggestion for a new feature, or simply want to share your experience, we want to hear from you!

- Report Bugs: If you find a bug, please open a [GitHub Issue](https://github.com/HariKube/kubernetes-aggregator-framework/issues). Include as much detail as possible, such as steps to reproduce the bug, expected behavior, and your environment (e.g., Kubernetes version, Go version).
- Request a Feature: If you have an idea for a new feature, open a [GitHub Issue](https://github.com/HariKube/kubernetes-aggregator-framework/issues) and use the feature request label. Describe the use case and how the new feature would benefit the community.
- Ask a Question: For general questions or discussions, please use the [GitHub Discussions](https://github.com/HariKube/kubernetes-aggregator-framework/discussions).

---

**This project is part of our journey to transform Kubernetes into a true Platform-as-a-Service. We not just dream about this but built for you. Read details here:** [[→]](/blog/the-future-of-kubernetes-paas-and-kubernetes-native-service-development-is-here/).

---

That’s it! You've seen how the kubernetes-aggregator-framework **completely removes the friction** from extending your Kubernetes control plane. It's time to stop treating your APIs as external services and start integrating them as **first-class Kubernetes resources**.

Thank you for reading, and feel free to share your thoughts.