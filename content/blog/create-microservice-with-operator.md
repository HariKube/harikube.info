---
title: "A Quick Dive into Kubernetes Operators - APIs"
date: 2025-08-18
author: "Richard Kovacs"
description: "This post provides a comprehensive overview of Kubernetes API."
categories: ["Microservice"]
tags: ["kubernetes", "custom resource", "development"]
featured_image: "/images/blog/create-microservice-with-operator.png"
nextTitle: "Part 2"
nextLink: "/blog/create-microservice-with-operator-2/"
---

{{< toc >}}

## ❓ What is Kubernetes and Why It's So Popular

Kubernetes is an open-source platform for **automating the deployment, scaling, and management of containerized applications**. It groups containers that make up an application into logical units for easy management and discovery. The popularity of Kubernetes stems from its ability to solve many of the challenges associated with managing modern, distributed applications. It provides a standardized way to handle container orchestration, ensuring applications are resilient, scalable, and portable across different cloud and on-premise environments. By abstracting the underlying infrastructure, Kubernetes allows developers to focus on writing code rather than worrying about operational complexities.

## 🪢 The Desired State and Controller Design Pattern

At the heart of Kubernetes is the concept of a **desired state**. This is a declarative model where you define the state you want your applications to be in, and Kubernetes works tirelessly to achieve and maintain that state. For example, you can declare that you want three replicas of a web server pod to be running at all times. A **controller** is a key component that implements this pattern. It's a control loop that continuously monitors the **current state** of the cluster and compares it to the **desired state** specified in the cluster's configuration. If there's a discrepancy (e.g., a pod crashes, so there are now only two replicas), the controller takes action to reconcile the two states (e.g., it starts a new pod). This design pattern is a fundamental reason for Kubernetes' self-healing capabilities.

## 🍮 Custom Resources and Operators

While Kubernetes has built-in resources like Pods, Services, and Deployments, it might not always have the perfect primitive for your specific application. This is where **Custom Resources** (CRs) come in. CRs are API extensions that allow you to define your own types of objects within the Kubernetes API. For example, if you're running a database, you could create a Database custom resource with fields for version, size, and user credentials.

An **Operator** is a specific type of controller that manages these custom resources. Operators encode the operational knowledge required to manage a complex application, like a database or a message queue. They extend the Kubernetes API by adding a new API type (the Custom Resource) and a controller that watches and manages that API type.

## ✨ Features Kubernetes Gives to Run Operators

Kubernetes provides a rich set of features that empower operators to extend its native functionality and manage complex applications. These features are the building blocks that an operator uses to achieve its desired state.

 - **Secrets and ConfigMaps**: Operators rely on Secrets and ConfigMaps to manage sensitive data (passwords, API keys) and configuration settings. They can watch for changes to these resources and automatically reconfigure the application as needed, without requiring a redeployment.

- **Role-Based Access Control (RBAC)**: This is a critical security feature that allows an operator to be granted fine-grained permissions to interact with specific resources. An operator needs an RBAC role to create, update, or delete resources. It also needs permission to manage its own Custom Resources. This principle of least privilege ensures that an operator can only perform the actions it needs to, limiting its blast radius in a security breach. For a human user to interact with the Kubernetes cluster using a tool like `kubectl`, they must first authenticate. The Kubernetes API server does not manage user accounts internally. Instead, it relies on external identity providers, such as:
  - **Client Certificates**: A user's certificate is signed by the cluster's Certificate Authority (CA), identifying them as a specific user.
  - **Authentication Webhooks**: The API server can be configured to use an external service (a webhook) to validate a bearer token, often from an Identity and Access Management (IAM) solution like Azure AD or Google IAM.
  - **OpenID Connect (OIDC)**: A popular standard that allows users to authenticate with an external identity provider and receive a token that the Kubernetes API server can validate.

 - **Admission Controllers**: Admission controllers are plugins that intercept requests to the Kubernetes API server before they are persisted. Operators can use Validating and Mutating Admission Webhooks to enforce policies on their custom resources. For example, a webhook could ensure that a user-provided database password meets certain complexity requirements.

 - **Aggregation Layer**: For more complex use cases, the Kubernetes Aggregation API allows an operator to act as an extension API server. This enables the operator to serve its own API, making its custom resources appear as if they were a native part of the Kubernetes API, complete with full support from `kubectl` and other standard tools.

 - **Network Policies**: Operators can define and manage Network Policies to control the traffic flow between the application's components. This allows an operator to create a secure network boundary, ensuring that only necessary communication is allowed (e.g., only the database pod can accept connections from the application pod).

 - **Ingress/Egress Controllers**: An operator for a web application can manage Ingress and Egress resources to expose the application to the outside world and control outbound traffic. This allows the operator to automate the configuration of routing, load balancing, and TLS termination.

 - **Service Mesh Integration**: For advanced networking, operators can integrate with a service mesh like Istio or Linkerd. An operator can automatically configure and manage the service mesh components for its application, enabling features like canary deployments, A/B testing, and fine-grained traffic shifting, which would be difficult to manage manually.

 - **Cloud-Native Landscape**: The cloud-native landscape is a massive and constantly growing ecosystem of projects and products, with over a thousand entries in the official Cloud-Native Computing Foundation ([CNCF](https://www.cncf.io/)) [landscape](https://landscape.cncf.io/) alone. The sheer breadth of this community-driven effort is one of its greatest strengths, as it ensures that there is a purpose-built tool for almost any operational challenge you might encounter. Some popular third-Party tools:

   - **Prometheus**: An industry-standard for monitoring, Prometheus provides a powerful time-series database and a query language (PromQL) to collect and analyze metrics from applications and infrastructure.
   - **Istio**: A feature-rich service mesh, Istio provides a transparent and automated way to manage traffic, security, and observability across microservices without requiring any code changes to the applications themselves.
   - **Argo CD**: A popular GitOps tool for Kubernetes, Argo CD automates the deployment of applications by continuously monitoring Git repositories and synchronizing the desired state with the cluster.
   - **Harbor**: An open-source, cloud-native container registry that secures images with vulnerability scanning, image signing, and policy checks.
   - **Tekton**: A powerful and flexible open-source framework for creating CI/CD systems, allowing developers to build, test, and deploy applications across various cloud platforms.
   - **Falco**: A cloud-native security tool that detects and alerts on suspicious behaviors in your cluster, such as a shell running in a container or a process spawning in an unusual location.

## ⁉️ The Downside of Kubernetes Operators

However, custom controllers face significant challenges when handling large volumes of data. Kubernetes relies on [ETCD](https://etcd.io/) for all data storage, which limits scalability, flexibility, and performance for complex or high-volume workloads. What are the main issues?

- ETCD is designed for configuration data, and cluster size is limited.
- ETCD’s consistency model means all members are full replicas, and Kubernetes only connects to the leader.
- ETCD cannot filter data at the storage level; the Kubernetes API server must fetch all records and filter them client-side.
- With a single ETCD instance, both cluster configuration and custom data are mixed. High-load custom services can block or delay normal cluster operations, risking overall cluster health.
- Kubernetes is multi-tenant with isolation methods, but ultimately all data is stored in a single database. A database outage affects the entire cluster, and a malicious attacker could potentially access everything.

These are some of the reasons why custom resources and controllers are used to solve infrastructure problems, and why high-volume data applications were often avoided ... **in the past**.

While Kubernetes provides powerful APIs for managing the state of applications, it's important to understand the inherent limitations of its architectural design.

| Limitation | Description |
|-|-|
| Eventual Consistency | Updates may not be immediately visible across the system |
| Non-Transactional | No support for ACID transactions |
| Relational Logic | Complex joins or relations between data entities are not supported |
| Limited Data Filtering | No advanced query engine included within Kubernetes |

> 💡 Don't worry, the Kubernetes API aggregation layer can help overcome the limitations of the core API server by allowing you to extend the API with custom APIs that are served by a separate backend, or extension API server. This setup enables you to implement specific logic and capabilities that aren't available in the core API.

## 🃏 Turn Kubernetes into a Real Platform-as-a-Service

It’s time to meet [HariKube](https://harikube.info). HariKube is a middleware that transparently distributes database load across multiple vendor-agnostic databases, delivering low latency, high throughput, and a true cloud-native development experience. It achieves exceptional performance through data distribution and optimized database routing. By offloading resource-intensive workloads from ETCD, HariKube ensures consistent responsiveness and operational efficiency at scale. It enables strict data separation across namespaces, resource types, or services-helping organizations meet security and compliance requirements without sacrificing scalability or performance. Additionally, HariKube simplifies developer workflows by abstracting infrastructure complexity. Developers can focus on data structures and business logic while the platform handles data routing and storage. HariKube is fully transparent; Kubernetes does not notice it is not communicating with an ETCD instance. You can use vanilla Kubernetes for development with limited data, and deploy HariKube in production to handle large datasets and distribute data across multiple backends.

HariKube supports multiple backends, each with different capabilities for data access and filtering. The table below outlines which storage engines are compatible and whether they support storage-side filtering for efficient querying. Find full list of databases [here](/docs/overview/#-supported-databases).

## 🧑‍🏭 Craft Your First Operator Based Microservice

You can develop operators in various programming languages, but some have more mature frameworks than others. The most popular language for operator development is [Go](https://go.dev/), primarily due to its strong type system and the existence of robust frameworks. Other languages with operator development capabilities include [C#](https://github.com/dotnet/dotnet-operator-sdk), [Python](https://github.com/nolar/kopf), [Java](https://github.com/operator-framework/java-operator-sdk), [Rust](https://github.com/kube-rs/kube), [Javascript](https://www.npmjs.com/package/@dot-i/k8s-operator) and increasing. However, the Go-based tools are generally considered the most mature and widely adopted within the Kubernetes community.

In this example you would use [Kubebuilder](https://github.com/kubernetes-sigs/kubebuilder) for development and [Kind](https://kind.sigs.k8s.io/) for testing. First of all please download dependencies.

{{< code bash >}}mkdir -p bin
curl -L https://github.com/kubernetes-sigs/kubebuilder/releases/download/v4.6.0/kubebuilder_linux_amd64 -o ./bin/kubebuilder
chmod +x ./bin/kubebuilder
curl -Lo ./bin/kind https://kind.sigs.k8s.io/dl/latest/kind-linux-amd64
chmod +x ./bin/kind
{{< /code >}}

In the next step you would initialize your operator.

{{< code bash >}}mkdir my-project
cd my-project
../bin/kubebuilder init --domain example.com --repo example.com/my-project
{{< /code >}}

The project structure looks like:

{{< code bash >}}.github # Integrated CI with Github
Dockerfile # Ready to run image builder
Makefile # Make targets (run, vet, lint, test, test-e2e, generate, ...)
PROJECT # Operator definition
config # Kubernetes manifests
test # E2E test framework
{{< /code >}}

At this point you should design your domain, a simple ToDo application in our case.

{{< code bash >}}../bin/kubebuilder create api --group example --version v1 --kind Task --resource=true --controller=true
{{< /code >}}

Edit the custom resource definition file at `api/v1/task_types.go`.

{{< code golang "task_types.go" >}}package v1

import (
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
)

type TaskState string

const (
	TaskStatePending  TaskState = "Pending"
	TaskStateFinished TaskState = "Finished"
)

// TaskSpec defines the desired state of Task.
type TaskSpec struct {
	// +kubebuilder:validation:Required
	// +kubebuilder:validation:Minimum=0
	// +kubebuilder:validation:Maximum=10
	Priority int `json:"priority,omitempty"`
	// +kubebuilder:validation:Optional
	Details string `json:"details,omitempty"`
	// +kubebuilder:validation:Required
	Deadline metav1.Time `json:"deadline,omitempty"`
	// +kubebuilder:default="Pending"
	// +kubebuilder:validation:Enum=Pending;Finished
	TaskState TaskState `json:"taskState,omitempty"`
}

// TaskStatus defines the observed state of Task.
type TaskStatus struct {
}

// +kubebuilder:object:root=true
// +kubebuilder:subresource:status
// +kubebuilder:printcolumn:name="Priority",type="string",JSONPath=".spec.priority"
// +kubebuilder:printcolumn:name="DeadLine",type="string",JSONPath=".spec.deadline"
// +kubebuilder:printcolumn:name="TaskState",type="string",JSONPath=".spec.taskState"
// +kubebuilder:selectablefield:JSONPath=.spec.priority
// +kubebuilder:selectablefield:JSONPath=.spec.taskState

// Task is the Schema for the tasks API.
type Task struct {
	metav1.TypeMeta   `json:",inline"`
	metav1.ObjectMeta `json:"metadata,omitempty"`

	Spec   TaskSpec   `json:"spec,omitempty"`
	Status TaskStatus `json:"status,omitempty"`
}

// +kubebuilder:object:root=true

// TaskList contains a list of Task.
type TaskList struct {
	metav1.TypeMeta `json:",inline"`
	metav1.ListMeta `json:"metadata,omitempty"`
	Items           []Task `json:"items"`
}

func init() {
	SchemeBuilder.Register(&Task{}, &TaskList{})
}
{{< /code >}}

Once you finished editing file, you can generate all the Kubernetes manifests and source codes by executing the following command.

{{< code bash >}}make manifests generate
{{< /code >}}

Start your Kubernetes cluster.

{{< code bash >}}../bin/kind create cluster
{{< /code >}}

Deploy your custom API into Kubernetes.

{{< code bash >}}make install
{{< /code >}}

Create your very first `Task`.

{{< code bash >}}cat | kubectl apply -f - <<EOF
apiVersion: example.example.com/v1
kind: Task
metadata:
  name: task-sample
  labels:
    example.example.com/priority: "3"
    example.example.com/deadline: "1755587875"
spec:
  priority: 3
  details: Sample task details
  deadline: "2025-08-19T09:17:55Z"
EOF
{{< /code >}}

You can filter the objects you want to interact with in Kubernetes by using [field selectors](https://kubernetes.io/docs/concepts/overview/working-with-objects/field-selectors/) and [label selectors](https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/). These are powerful mechanisms that allow you to narrow down your search from the entire cluster to a specific subset of resources. Label selectors are the more common and powerful of the two. A label is a key-value pair attached to a resource, like `example.example.com/priority=3` or `example.example.com/deadline>1755587874`. Field selectors, on the other hand, let you filter resources based on the values of their resource fields. In this example `spec.priority` and `spec.taskState` are the pre-defined field selectors. While useful, field selectors are more limited in their filtering capabilities compared to label selectors.

You can test selectors via `kubectl`, but almost all the popular programming languages have existing Kubernetes client library, so it is up to you how you connect to the cluster API.

{{< code bash >}}kubectl get tasks \
--selector "example.example.com/deadline>1755587874" \
--selector "example.example.com/priority=3" \
--field-selector "spec.priority=3" \
--field-selector "spec.taskState=Pending"
{{< /code >}}

{{< output >}}NAME          PRIORITY   DEADLINE               TASKSTATE
task-sample   3          2025-08-19T09:17:55Z   Pending
{{< /output >}}

The Operator pattern turns Kubernetes into a powerful platform, but its reliance on etcd can create a performance bottleneck for data-heavy applications. The solution? Decouple the data. With tools like HariKube transparently offloading custom resource data, you can build scalable, high-performance services that leverage the full power of Kubernetes without compromising on speed or stability. It’s the future of cloud-native development.

---

**Ready for the next step? Learn how to write your custom business logic via controller.** [[→]](/blog/create-microservice-with-operator-2/)

---

That's the foundation! The **Operator pattern** empowers you to extend Kubernetes with **Custom Resources** and build complex, domain-specific applications. By understanding the **declarative desired state** model and leveraging Custom Resources-while being aware of the **ETCD scaling limitations**-you're ready to create sophisticated, cloud-native services.

Thank you for reading, and feel free to share your thoughts.
