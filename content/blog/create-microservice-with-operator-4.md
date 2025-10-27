---
title: "A Quick Dive into Kubernetes Operators - Custom APIs"
date: 2025-09-05
author: "Richard Kovacs"
description: "This post provides a simple solution to implement fully custom APIs in Kubernetes. "
categories: ["Microservice"]
tags: ["kubernetes", "custom resource", "development"]
featured_image: "/images/blog/create-microservice-with-operator.png"
prevTitle: "Part 3"
prevLink: "/blog/create-microservice-with-operator-3/"
---

---

**Before diving in, make sure you have finished part 3 of the series.** [[→]](/blog/create-microservice-with-operator-3/)

---

{{< toc >}}

In the previous parts of this series, we built the foundation for a Kubernetes operator, explored how to expose and manage custom resources and implememnted a custom search API. Now, let’s take the next step: **implementing fully custom APIs inside Kubernetes**. This allows you to present complex, aggregated, or domain-specific custom logic directly through the Kubernetes API.

## Implement a Fully Customized API

Sometimes, the built-in API and operator capabilities aren't enough, especially when dealing with complex data relationships or when you need fine-grained control over the data retrieval process. In these cases, you can implement fully customized services using an **aggregation API**.

When Simple Solutions Fall Short

Traditional solutions like eager loading work well for one-to-one or one-to-many relationships, but they can become inefficient or unwieldy when you have:

 - Many-to-many relationships
 - Complex data transformations
 - Deeply nested relationships

By using an aggregation API, you decouple the frontend from the complex backend logic. This approach gives you full control over the data retrieval process, allowing you to optimize performance, reduce network chatter, and tailor the data precisely for each client's specific requirements.

In this example you'll create a cluster scope `ClusterTask` and a namespaced scope `CustomTask` service. Bring your own implementation.

{{< code golang "task_search.go" >}}{
  ApiResource: metav1.APIResource{
    Name:  "clustertasks",
    Kind:  "ClusterTask",
    Verbs: []string{"get", "list", "watch", "create", "update", "delete"},
  },
  CustomResources: []kaf.CustomResource{
    {
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
},
{
  ApiResource: metav1.APIResource{
    Name:       "customtasks",
    Namespaced: true,
    Kind:       "CustomTask",
    Verbs:      []string{"get", "list", "watch", "create", "update", "delete"},
  },
  CustomResources: []kaf.CustomResource{
    {
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
},
{{< /code >}}

Re-deploy the application.

{{< code bash >}}export IMG=controller:dev
make docker-build
../bin/kind load docker-image $IMG
make deploy
kubectl delete pod -n my-project-system -l control-plane=controller-manager
{{< /code >}}

{{< code bash >}}kubectl create --raw /apis/search.task.example.example.com/v1/clustertasks/foo -f clustertask.yaml
kubectl replace --raw /apis/search.task.example.example.com/v1/clustertasks/foo -f clustertask.yaml
kubectl get clustertasks
kubectl get clustertasks foo
kubectl get clustertasks -w
kubectl get clustertasks foo -w
kubectl delete clustertasks foo
{{< /code >}}

{{< code bash >}}kubectl create --raw /apis/search.task.example.example.com/v1/namespaces/default/customtasks/foo -f customtask.yaml
kubectl replace --raw /apis/search.task.example.example.com/v1/namespaces/default/customtasks/foo -f clustertask.yaml
kubectl get customtasks
kubectl get customtasks foo
kubectl get customtasks -w
kubectl get customtasks foo -w
kubectl delete customtasks foo
{{< /code >}}

## Extending Built-in Resources with Aggregated Endpoints

The next service extends the Kubernetes API by creating a new combinedtasks endpoint. This endpoint behaves like any other Kubernetes resource (get, list, and watch), but instead of returning a plain Task, it provides a richer view that includes:

- The Task itself — with its metadata and spec fields (priority, deadline, details, etc.).
- All related Events — collected by label selector and attached under the status.events field.

In other words, a CombinedTask is a merged resource that combines the task object and its lifecycle history.

This design is useful because developers don’t need to manually query both tasks and events to understand what’s happening. By fetching combinedtasks, you immediately see the business object (Task) together with the operational signals (Events) in one unified response.

First you have to add new permissions to fetch events at `internal/apiserver/task_search.go` file header.

{{< code golang "task_search.go" >}}// +kubebuilder:rbac:groups="",resources=events,verbs=get;list
{{< /code >}}

You’ll continue by defining a CombinedTask resource that aggregates a Task with its related Events.

{{< code golang "task_search.go" >}}type TaskStatus struct {
	Events []corev1.Event `json:"events"`
}

type CombinedTask struct {
	metav1.TypeMeta   `json:",inline"`
	metav1.ObjectMeta `json:"metadata,omitempty"`

	Spec   examplev1.TaskSpec `json:"spec,omitempty"`
	Status TaskStatus         `json:"status,omitempty"`
}

type CombinedTaskList struct {
	metav1.TypeMeta `json:",inline"`
	metav1.ListMeta `json:"metadata,omitempty"`
	Items           []CombinedTask `json:"items"`
}
{{< /code >}}

Update function signature, because new endpoint has to reach Kubernetes API.

{{< code golang "task_search.go" >}}func New(kubeClient client.Client, dynamicKubeClient *dynamic.DynamicClient, port, certFile, keyFile, dataDir string) *searchAPIServer {
{{< /code >}}

Pass Kubernetes client to `kaf.ServerConfig`.

{{< code golang "task_search.go" >}}Server: *kaf.NewServer(kaf.ServerConfig{
  KubeClient:        kubeClient,
  DynamicKubeClient: dynamicKubeClient,
{{< /code >}}

Add service implementation to `kaf.ServerConfig.APIKInds`.

{{< code golang "task_search.go" >}}{
  ApiResource: metav1.APIResource{
    Name:       "combinedtasks",
    Namespaced: true,
    Kind:       "CombinedTask",
    Verbs:      []string{"get", "list", "watch"},
  },
  Resources: []kaf.Resource{
    {
      CreateNew: func() (schema.GroupVersionResource, client.Object) {
        return examplev1.GroupVersion.WithResource("tasks"), &examplev1.Task{}
      },
      CreateNewList: func() (schema.GroupVersionResource, client.ObjectList) {
        return examplev1.GroupVersion.WithResource("tasklist"), &examplev1.TaskList{}
      },
      ListCallback: func(ctx context.Context, namespace, _ string, objList client.ObjectList) (any, error) {
        taskList, ok := objList.(*examplev1.TaskList)
        if !ok {
          return nil, fmt.Errorf("failed to convert tasklist for: %s", objList.GetObjectKind().GroupVersionKind().String())
        }

        combinedTasks := CombinedTaskList{
          TypeMeta: metav1.TypeMeta{
            Kind:       "CombinedTaskList",
            APIVersion: Group + "/" + Version,
          },
          ListMeta: metav1.ListMeta{
            ResourceVersion:    taskList.ResourceVersion,
            Continue:           taskList.Continue,
            RemainingItemCount: taskList.RemainingItemCount,
          },
          Items: []CombinedTask{},
        }

        rawLabelSelector := "example.example.com/task-uid=" + string(taskList.Items[0].UID)
        if len(taskList.Items) > 1 {
          taskUIDs := make([]string, 0, len(taskList.Items))
          for _, t := range taskList.Items {
            taskUIDs = append(taskUIDs, string(t.UID))
          }

          rawLabelSelector = "example.example.com/task-uid in (" + strings.Join(taskUIDs, ",") + ")"
        }

        eventLabelSelector, _ := labels.Parse(rawLabelSelector)

        events := corev1.EventList{}
        if err := kubeClient.List(ctx, &events, &client.ListOptions{
          Namespace:     namespace,
          LabelSelector: eventLabelSelector,
        }); err != nil {
          return nil, fmt.Errorf("failed to list events: %v", err)
        }

        eventsByUID := map[string][]corev1.Event{}
        for _, e := range events.Items {
          uid := e.Labels["example.example.com/task-uid"]
          if _, ok := eventsByUID[uid]; !ok {
            eventsByUID[uid] = []corev1.Event{}
          }
          eventsByUID[uid] = append(eventsByUID[uid], e)
        }

        items, err := meta.ExtractList(objList)
        if err != nil {
          return nil, fmt.Errorf("failed to extract list: %v", err)
        }

        for _, t := range items {
          task := t.(*examplev1.Task)

          ct := CombinedTask{
            TypeMeta: metav1.TypeMeta{
              Kind:       "CombinedTask",
              APIVersion: Group + "/" + Version,
            },
            ObjectMeta: task.ObjectMeta,
            Spec:       task.Spec,
            Status: TaskStatus{
              Events: eventsByUID[string(task.UID)],
            },
          }

          combinedTasks.Items = append(combinedTasks.Items, ct)
        }

        return combinedTasks, nil
      },
      WatchCallback: func(ctx context.Context, _, _ string, unstructuredObj *unstructured.Unstructured) (any, error) {
        task := examplev1.Task{}
        if err := runtime.DefaultUnstructuredConverter.FromUnstructured(unstructuredObj.Object, &task); err != nil {
          return nil, fmt.Errorf("failed to convert unstructured: %v", err)
        }

        ct := CombinedTask{
          TypeMeta: metav1.TypeMeta{
            Kind:       "CombinedTask",
            APIVersion: Group + "/" + Version,
          },
          ObjectMeta: task.ObjectMeta,
          Spec:       task.Spec,
        }

        eventLabelSelector, _ := labels.Parse("example.example.com/task-uid=" + string(task.UID))

        events := corev1.EventList{}
        if err := kubeClient.List(ctx, &events, &client.ListOptions{
          Namespace:     task.Namespace,
          LabelSelector: eventLabelSelector,
        }); err != nil {
          return nil, fmt.Errorf("failed to list events: %v", err)
        }

        ct.Status = TaskStatus{
          Events: events.Items,
        }

        return ct, nil
      },
    },
  },
},
{{< /code >}}

Change API initialization at `cmd/main.go` file.

{{< code golang "main.go" >}}kubeClient, err := client.New(ctrl.GetConfigOrDie(), client.Options{
  Scheme: scheme,
})
if err != nil {
  setupLog.Error(err, "unable to create kube client")
  os.Exit(1)
}

dynamicKubeClient, err := dynamic.NewForConfig(ctrl.GetConfigOrDie())
if err != nil {
  setupLog.Error(err, "unable to create dynamic kube client")
  os.Exit(1)
}

if err := mgr.Add(apiserver.New(kubeClient, dynamicKubeClient, apiServerPort, apiServerCertFile, apiServerKeyFile, apiServerDataDir)); err != nil {
  setupLog.Error(err, "unable to add API server to manager")
  os.Exit(1)
}
{{< /code >}}

To associate events with tasks and avoiding N+1 query problem, the controller must label them with the task UID. Update your controller to set index label on the created events at `internal/controller/task_controller.go`.

{{< code golang "task_controller.go" >}}event := corev1.Event{
  ObjectMeta: ctrl.ObjectMeta{
    Name:      krand.String(40),
    Namespace: task.Namespace,
    Labels: map[string]string{
      "example.example.com/task-uid": string(task.UID),
    },
  },
...
{{< /code >}}

Re-deploy the application.

{{< code bash >}}make docker-build
../bin/kind load docker-image $IMG
make deploy
kubectl delete pod -n my-project-system -l control-plane=controller-manager
{{< /code >}}

Create your `Task` object.

{{< code bash >}}cat | kubectl apply -f - <<EOF
apiVersion: example.example.com/v1
kind: Task
metadata:
  name: task-sample-5
spec:
  priority: 2
  details: Sample task details
  deadline: "2025-08-19T16:52:15Z"
EOF
{{< /code >}}

Validate business logic via `kubectl` for simplicity, fetch the `combinedtasks` in all namespaces.

{{< code bash >}}kubectl get combinedtasks -A
{{< /code >}}

{{< output >}}NAMESPACE   NAME             AGE
default     task-sample-1   45h
default     task-sample-2    2d5h
default     task-sample-3    45h
default     task-sample-4    45h
default     task-sample-5    3s
{{< /output >}}

Fetch the `combinedtasks` in default namespace.

{{< code bash >}}kubectl get combinedtasks -n default
{{< /code >}}

{{< output >}}NAMESPACE   NAME             AGE
default     task-sample-1   45h
default     task-sample-2    2d5h
default     task-sample-3    45h
default     task-sample-4    45h
default     task-sample-5    5s
{{< /output >}}

Fetch a `combinedtask` by name in default namespace.

{{< code bash >}}kubectl get combinedtasks -n default task-sample-5
{{< /code >}}

{{< output >}}NAME            AGE
task-sample-5   8s
{{< /output >}}

Validate `combinedtask` contains events.

{{< code bash >}}kubectl get combinedtasks -n default task-sample-5 -o yaml
{{< /code >}}

{{< output >}}apiVersion: v1
items:
- apiVersion: search.task.example.example.com/v1
  kind: CombinedTask
  metadata:
    ...
    name: task-sample-5
    namespace: default
  spec:
    deadline: "2025-08-19T16:52:15Z"
    details: Sample task details for task-sample-4
    priority: 3
    taskState: Pending
  status:
    events:
    - eventTime: null
      firstTimestamp: null
      involvedObject:
        apiVersion: example.example.com/v1
        kind: Task
        name: task-sample-5
        namespace: default
        resourceVersion: "128025"
        uid: 21e694cb-4735-45a5-91c4-198b0cf01311
      lastTimestamp: null
      message: Task has been updated
      ...
      reason: TaskUpdated
      reportingComponent: ""
      reportingInstance: ""
      source: {}
      type: Normal
    - eventTime: null
      firstTimestamp: null
      involvedObject:
        apiVersion: example.example.com/v1
        kind: Task
        name: task-sample-5
        namespace: default
        resourceVersion: "128025"
        uid: 21e694cb-4735-45a5-91c4-198b0cf01311
      lastTimestamp: null
      message: Task has been created
      metadata:
        ...
      reason: TaskCreated
      reportingComponent: ""
      reportingInstance: ""
      source: {}
      type: Normal
kind: List
metadata:
  resourceVersion: "128025"
{{< /output >}}

Kubernetes is a powerful platform, but its native API has limitations for complex, domain-specific logic. By using the API Aggregation Layer, you can create fully customized APIs that extend Kubernetes' functionality and address these challenges. This approach allows you to implement specialized endpoints.

---

**Ready to run your application in production? Learn how to prepare your Kubernetes to use HariKube as underlaying storage.** [[→]](/blog/start-kubernetes-prepared-for-huge-data-handling/)

---

That's the takeaway! By using the **Kubernetes API Aggregation Layer**, you gain the power to define and serve **fully custom APIs and composite resources** like CombinedTask directly through kubectl. This is how you extend Kubernetes to handle complex data relationships and domain-specific logic, decoupling your presentation from your core data storage.

Thank you for reading, and feel free to share your thoughts.