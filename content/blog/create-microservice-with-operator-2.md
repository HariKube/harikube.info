---
title: "A Quick Dive into Kubernetes Operators - Services"
date: 2025-08-19
author: "Richard Kovacs"
description: "This post provides a comprehensive overview of Kubernetes operators."
categories: ["Microservice"]
tags: ["kubernetes", "custom resource", "development"]
featured_image: "/images/blog/create-microservice-with-operator.png"
prevTitle: "Part 1"
prevLink: "/blog/create-microservice-with-operator/"
nextTitle: "Part 3"
nextLink: "/blog/create-microservice-with-operator-3/"
---

---

**Before diving in, make sure you have finished part 1 of the series.** [[→]](/blog/create-microservice-with-operator/)

---

{{< toc >}}

## Implement Your Business Logic: The Controller

Now that you've completed the first part of this series, you're ready to implement your core business logic within the controller. Your `kubebuilder` command has already generated a controller stub for you; all you need to do is edit the `internal/controller/task_controller.go` file. In this section, you'll learn how to react to different events within your cluster and create new events in Kubernetes to signal important state changes.

{{< code golang "task_controller.go" >}}package controller

import (
	"context"

	corev1 "k8s.io/api/core/v1"
	apierrors "k8s.io/apimachinery/pkg/api/errors"
	"k8s.io/apimachinery/pkg/runtime"
	krand "k8s.io/apimachinery/pkg/util/rand"
	ctrl "sigs.k8s.io/controller-runtime"
	"sigs.k8s.io/controller-runtime/pkg/client"
	"sigs.k8s.io/controller-runtime/pkg/controller/controllerutil"

	examplev1 "example.com/my-project/api/v1"
)

// TaskReconciler reconciles a Task object
type TaskReconciler struct {
	client.Client
	Scheme *runtime.Scheme
}

// +kubebuilder:rbac:groups=example.example.com,resources=tasks,verbs=get;list;watch;create;update;patch;delete
// +kubebuilder:rbac:groups=example.example.com,resources=tasks/status,verbs=get;update;patch
// +kubebuilder:rbac:groups=example.example.com,resources=tasks/finalizers,verbs=update

// +kubebuilder:rbac:groups="",resources=events,verbs=create

// Reconcile is part of the main kubernetes reconciliation loop which aims to
// move the current state of the cluster closer to the desired state.
func (r *TaskReconciler) Reconcile(ctx context.Context, req ctrl.Request) (ctrl.Result, error) {
	task := examplev1.Task{}
	if err := r.Get(ctx, req.NamespacedName, &task); err != nil {
		if apierrors.IsNotFound(err) {
			return ctrl.Result{}, nil
		}

		return ctrl.Result{}, err
	}

	event := corev1.Event{
		ObjectMeta: ctrl.ObjectMeta{
			Name:      krand.String(40),
			Namespace: task.Namespace,
		},
		InvolvedObject: corev1.ObjectReference{
			Kind:            task.Kind,
			Name:            task.Name,
			Namespace:       task.Namespace,
			UID:             task.UID,
			APIVersion:      examplev1.GroupVersion.String(),
			ResourceVersion: task.ResourceVersion,
		},
	}

	switch {
	case task.Generation == 1:
		event.Reason = "TaskCreated"
		event.Message = "Task has been created"
		event.Type = corev1.EventTypeNormal
	case task.DeletionTimestamp.IsZero():
		event.Reason = "TaskUpdated"
		event.Message = "Task has been updated"
		event.Type = corev1.EventTypeNormal
	case !controllerutil.ContainsFinalizer(&task, "example.example.com/finalizer"):
		return ctrl.Result{}, nil
	default:
		event.Reason = "TaskDeleted"
		event.Message = "Task has been deleted"
		event.Type = corev1.EventTypeWarning

		controllerutil.RemoveFinalizer(&task, "example.example.com/finalizer")
		if err := r.Update(ctx, &task); err != nil {
			return ctrl.Result{}, err
		}
	}

	if err := r.Create(ctx, &event); err != nil {
		return ctrl.Result{}, err
	}

	return ctrl.Result{}, nil
}

// SetupWithManager sets up the controller with the Manager.
func (r *TaskReconciler) SetupWithManager(mgr ctrl.Manager) error {
	return ctrl.NewControllerManagedBy(mgr).
		For(&examplev1.Task{}).
		Named("task").
		Complete(r)
}
{{< /code >}}

Once you finished editing files, you can build your OCI image by executing the following command.

{{< code bash >}}export IMG=controller:dev
make docker-build
{{< /code >}}

In the next step you have to make the image available on Kubernetes cluster.

{{< code bash >}}../bin/kind load docker-image $IMG
{{< /code >}}

And finally deploy the application to the cluster.

{{< code bash >}}make deploy
kubectl delete pod -n my-project-system -l control-plane=controller-manager
{{< /code >}}

Create your `Task`, update it and finally delete the resource.

{{< code bash >}}cat | kubectl apply -f - <<EOF
apiVersion: example.example.com/v1
kind: Task
metadata:
  name: task-sample-2
  labels:
    example.example.com/priority: "2"
    example.example.com/deadline: "1755615135"
  finalizers:
  - example.example.com/finalizer
spec:
  priority: 2
  details: Sample task details
  deadline: "2025-08-19T16:52:15Z"
EOF
kubectl patch tasks task-sample-2 --type='json' -p='[{"op":"replace", "path":"/spec/taskState", "value":"Finished"}]'
kubectl delete tasks task-sample-2
{{< /code >}}

Validate business logic by fetching events of the `Task` object.

{{< code bash >}}kubectl get events \
--field-selector involvedObject.kind=Task,involvedObject.name=task-sample-2
{{< /code >}}

{{< output >}}LAST SEEN   TYPE     REASON        OBJECT               MESSAGE
<unknown>   Normal    TaskCreated   task/task-sample-2   Task has been created
<unknown>   Normal    TaskUpdated   task/task-sample-2   Task has been updated
<unknown>   Warning   TaskDeleted   task/task-sample-2   Task has been deleted
{{< /output >}}

Awesome! Now that you've finished your first simple controller, you've seen how to implement the core logic of an Operator. While this was just a basic example, it's a huge first step and the foundation for building more complex applications. You're now ready to move on to more advanced topics, like validating or mutation your resources.

## Custom Validation of Resources via Webhook

While the Kubernetes API has built-in validators for its core and custom resources, these are often not enough to enforce the complex business logic and custom constraints required by your applications, which is why you sometimes need to write a custom validator.

{{< code bash >}}../bin/kubebuilder create webhook --group example --version v1 --kind Task --programmatic-validation --defaulting
{{< /code >}}

Now you can implement your custom validation at `internal/webhook/v1/task_webhook.go` file.

{{< code golang "task_webhook.go" >}}// ValidateCreate implements webhook.CustomValidator so a webhook will be registered for the type Task.
func (v *TaskCustomValidator) ValidateCreate(_ context.Context, obj runtime.Object) (admission.Warnings, error) {
	task, ok := obj.(*examplev1.Task)
	if !ok {
		return nil, fmt.Errorf("expected a Task object but got %T", obj)
	}

	// TODO(user): fill in your validation logic upon object creation.

	return nil, nil
}

// ValidateUpdate implements webhook.CustomValidator so a webhook will be registered for the type Task.
func (v *TaskCustomValidator) ValidateUpdate(_ context.Context, oldObj, newObj runtime.Object) (admission.Warnings, error) {
	task, ok := newObj.(*examplev1.Task)
	if !ok {
		return nil, fmt.Errorf("expected a Task object for the newObj but got %T", newObj)
	}

	// TODO(user): fill in your validation logic upon object update.

	return nil, nil
}

// ValidateDelete implements webhook.CustomValidator so a webhook will be registered for the type Task.
func (v *TaskCustomValidator) ValidateDelete(ctx context.Context, obj runtime.Object) (admission.Warnings, error) {
	task, ok := obj.(*examplev1.Task)
	if !ok {
		return nil, fmt.Errorf("expected a Task object but got %T", obj)
	}

	// TODO(user): fill in your validation logic upon object deletion.

	return nil, nil
}
{{< /code >}}

## Mutating Resources via Webhook

A mutation webhook is a powerful Kubernetes mechanism for automatically changing or injecting resources before they are persisted, perfect for adding default values or make any conversion before they are written to the database.

Open the same `internal/webhook/v1/task_webhook.go` file to implement your mutation logic.

{{< code golang "task_webhook.go" >}}// Default implements webhook.CustomDefaulter so a webhook will be registered for the Kind Task.
func (d *TaskCustomDefaulter) Default(_ context.Context, obj runtime.Object) error {
	task, ok := obj.(*examplev1.Task)
	if !ok {
		return fmt.Errorf("expected an Task object but got %T", obj)
	}

	if task.Labels == nil {
		task.Labels = make(map[string]string)
	}

	task.Labels["example.example.com/priority"] = strconv.Itoa(int(task.Spec.Priority))
	task.Labels["example.example.com/deadline"] = strconv.Itoa(int(task.Spec.Deadline.Unix()))

	if task.Generation == 0 {
		controllerutil.AddFinalizer(task, "example.example.com/finalizer")
	}

	return nil
}
{{< /code >}}

If you recall, the `Task` custom resource we created earlier included labels for filtering and a finalizer to control object deletion. Now, with this simple mutation webhook, you can automate the process of adding these fields, so users don't have to.

## Deploying Webhooks

First you have to deploy `cert-manager` to enable automatic certificate generation of the webhooks.

{{< code bash >}}kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.16.3/cert-manager.yaml
{{< /code >}}

Ucomment the following lines in `config/crd/kustomization.yaml` file.

{{< code yaml "kustomization.yaml" >}}configurations:
- kustomizeconfig.yaml
{{< /code >}}

Ucomment the following lines in `config/default/kustomization.yaml` file.

{{< code yaml "kustomization.yaml" >}}- ../certmanager
{{< /code >}}

{{< code yaml "kustomization.yaml" >}}replacements:
{{< /code >}}

{{< code yaml "kustomization.yaml" >}}- source: # Uncomment the following block if you have any webhook
    kind: Service
    version: v1
    name: webhook-service
    fieldPath: .metadata.name # Name of the service
  targets:
    - select:
        kind: Certificate
        group: cert-manager.io
        version: v1
        name: serving-cert
      fieldPaths:
        - .spec.dnsNames.0
        - .spec.dnsNames.1
      options:
        delimiter: '.'
        index: 0
        create: true
- source:
    kind: Service
    version: v1
    name: webhook-service
    fieldPath: .metadata.namespace # Namespace of the service
  targets:
    - select:
        kind: Certificate
        group: cert-manager.io
        version: v1
        name: serving-cert
      fieldPaths:
        - .spec.dnsNames.0
        - .spec.dnsNames.1
      options:
        delimiter: '.'
        index: 1
        create: true
{{< /code >}}

{{< code yaml "kustomization.yaml" >}}- source: # Uncomment the following block if you have a ValidatingWebhook (--programmatic-validation)
    kind: Certificate
    group: cert-manager.io
    version: v1
    name: serving-cert # This name should match the one in certificate.yaml
    fieldPath: .metadata.namespace # Namespace of the certificate CR
  targets:
    - select:
        kind: ValidatingWebhookConfiguration
      fieldPaths:
        - .metadata.annotations.[cert-manager.io/inject-ca-from]
      options:
        delimiter: '/'
        index: 0
        create: true
- source:
    kind: Certificate
    group: cert-manager.io
    version: v1
    name: serving-cert
    fieldPath: .metadata.name
  targets:
    - select:
        kind: ValidatingWebhookConfiguration
      fieldPaths:
        - .metadata.annotations.[cert-manager.io/inject-ca-from]
      options:
        delimiter: '/'
        index: 1
        create: true
{{< /code >}}

{{< code yaml "kustomization.yaml" >}}- source: # Uncomment the following block if you have a DefaultingWebhook (--defaulting )
    kind: Certificate
    group: cert-manager.io
    version: v1
    name: serving-cert
    fieldPath: .metadata.namespace # Namespace of the certificate CR
  targets:
    - select:
        kind: MutatingWebhookConfiguration
      fieldPaths:
        - .metadata.annotations.[cert-manager.io/inject-ca-from]
      options:
        delimiter: '/'
        index: 0
        create: true
- source:
    kind: Certificate
    group: cert-manager.io
    version: v1
    name: serving-cert
    fieldPath: .metadata.name
  targets:
    - select:
        kind: MutatingWebhookConfiguration
      fieldPaths:
        - .metadata.annotations.[cert-manager.io/inject-ca-from]
      options:
        delimiter: '/'
        index: 1
        create: true
{{< /code >}}

Re-deploy the application.

{{< code bash >}}make docker-build
../bin/kind load docker-image $IMG
make deploy
kubectl delete pod -n my-project-system -l control-plane=controller-manager
{{< /code >}}

Create your `Task` without metadata.

{{< code bash >}}cat | kubectl apply -f - <<EOF
apiVersion: example.example.com/v1
kind: Task
metadata:
  name: task-sample-3
spec:
  priority: 5
  details: Sample task details
  deadline: "2025-08-19T16:52:15Z"
EOF
{{< /code >}}

Validate mutation webhook by fetching details of the `Task` object.

{{< code bash >}}kubectl get tasks task-sample-3 -o yaml
{{< /code >}}

{{< output >}}apiVersion: example.example.com/v1
kind: Task
metadata:
  annotations:
    kubectl.kubernetes.io/last-applied-configuration: |
      {"apiVersion":"example.example.com/v1","kind":"Task","metadata":{"annotations":{},"name":"task-sample-3","namespace":"default"},"spec":{"deadline":"2025-08-19T16:52:15Z","details":"Sample task details","priority":5}}
  creationTimestamp: "2025-08-19T17:02:47Z"
  finalizers:
  - example.example.com/finalizer
  generation: 1
  labels:
    example.example.com/deadline: "1755622335"
    example.example.com/priority: "5"
  name: task-sample-3
  namespace: default
  resourceVersion: "8867"
  uid: 7b4649e5-4f0d-4929-880a-516ede0bdde6
spec:
  deadline: "2025-08-19T16:52:15Z"
  details: Sample task details
  priority: 5
  taskState: Pending
{{< /output >}}

The controller handles the core business logic, reconciling the desired state, while webhooks provide a way to enforce rules and automatically modify resources. This combination of reconciliation and admission control is what truly elevates an operator from a simple manager to a robust, self-managing application.

---

**Ready for the next step? Learn how to implement advanced data filtering in controller.** [[→]](/blog/create-microservice-with-operator-3/)

---

Imagine your own data topology and enhance your Kubernetes experience. **Enjoy lower latency, higher throughput, data isolation, virtually unlimited storage, and simplified development.** HariKube supports both flat and hierarchical topologies, allowing you to organize your databases like leaves on a tree.

Thank you for reading, and feel free to share your thoughts.