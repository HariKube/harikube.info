---
title: "A Quick Dive into Kubernetes Operators - Services+"
date: 2025-08-28
author: "Richard Kovacs"
description: "This post provides a solution to unlocking data filtering in Kubernetes."
categories: ["Microservice"]
tags: ["kubernetes", "custom resource", "development"]
featured_image: "/images/blog/create-microservice-with-operator.png"
prevTitle: "Part 2"
prevLink: "/blog/create-microservice-with-operator-2/"
nextTitle: "Part 4"
nextLink: "/blog/create-microservice-with-operator-4/"
---

---

**Before diving in, make sure you have finished part 2 of the series.** [[→]](/blog/create-microservice-with-operator-2/)

---

{{< toc >}}

## The Challenge with Kubernetes Data

Kubernetes is an incredibly powerful container orchestration platform, but it has some limitations you should be aware of. One key challenge is its **limited data filtering capabilities**. While it excels at managing and scaling workloads, the platform doesn't include an advanced query engine out of the box. This means you can't easily perform complex, fine-grained searches or data manipulation directly within Kubernetes, which can be a roadblock when you need to find records based on **full text search** for example.

## Finding a Solution

Don't let this limitation discourage you! The good news is that there are many robust **alternatives for advanced data filtering** and full text search that integrate seamlessly with Kubernetes. These external solutions are specifically designed to handle the complex queries and data analysis that Kubernetes lacks. This blog post will explore how you can overcome this challenge, focusing on one powerful solution that will give you the flexibility and control you need to effectively filter your data.

The solution to a lack of advanced data filtering often leverages the [Kubernetes API Aggregation Layer](https://kubernetes.io/docs/tasks/extend-kubernetes/configure-aggregation-layer/). This layer acts as a proxy, sitting in front of the core Kubernetes API server. It enables you to build and run your own custom API servers that serve custom APIs. When a client like `kubectl` makes a request to a registered API path, the aggregation layer intercepts it and transparently forwards it to your custom API server. This powerful design pattern allows a custom API to handle data and business logic entirely independent of Kubernetes' core database, and the perfect solution for tasks like full-text search or complex data analysis that are not natively supported.

In this tutorial, you'll create a simple implementation. **Don't use this in production, this is only useful for demonstrating simplicity of Kubernetes API aggregation layer!** This implementation uses a metadata indexer to find the items for a given text search, which you can then use to filter the data in the second query. The main benefit of this solution is, it works seamlessly with all the supported databases.

<pre>
⚠️ This two-step process can be inefficient and slow down operations,
especially in clusters with a large number of resources. However, as
the developer of a custom API server, you have full control over the
data retrieval process. Instead of relying on a pre-retrieval filter,
you can implement a more performant solution directly within the API
server's logic. There are plenty of other options like:
 - Returning the objects directly, instead of the task-indexers only.
 - On case of SQL backend and Kubernetes API application/json
    storage-media-type, you can search directly in the database.
 - Lastly but not least, you can use custom logic to store and fetch
    these resources instead of relaying on Kubernetes API.
</pre>

## Prepare Server Manifests

By creating an [APIService](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.33/#apiservicespec-v1-apiregistration-k8s-io) object, you tell Kubernetes to route specific API requests to your own, purpose-built API server. This server can be designed to do anything, from collecting metrics (like the Metrics Server) to providing full-text search capabilities on your data. Because the data is stored and managed by your external service, you have complete control over how it is queried, filtered, and presented. This approach offers a seamless user experience, as the custom APIs are accessed with the same tools and authentication methods as the core Kubernetes APIs, but they are powered by a solution optimized for the task.

In the first step create an `APIService` manifest at `config/manager/task-apiservice.yaml`.

{{< code yaml "task-apiservice.yaml" >}}apiVersion: apiregistration.k8s.io/v1
kind: APIService
metadata:
  name: v1.search.task.example.example.com
  annotations:
    cert-manager.io/inject-ca-from: SERVICE_NAME/SERVICE_NAMESPACE
spec:
  group: search.task.example.example.com
  version: v1
  groupPriorityMinimum: 1000
  versionPriority: 10
  service:
    name: v1-search-task
    namespace: system
    port: 443
  caBundle: ""
{{< /code >}}

Next create the `Service` related manifests at `config/manager/task-search-service.yaml`.

{{< code yaml "task-search-service.yaml" >}}apiVersion: cert-manager.io/v1
kind: Issuer
metadata:
  name: v1-search-task-ca
  namespace: system
spec:
  selfSigned: {}
---
apiVersion: cert-manager.io/v1
kind: Certificate
metadata:
  name: v1-search-task-cert
  namespace: system
spec:
  secretName: v1-search-task-tls
  issuerRef:
    name: v1-search-task-ca
  commonName: v1-search-task.system.svc
  dnsNames:
  - SERVICE_NAME.SERVICE_NAMESPACE.svc
  - SERVICE_NAME.SERVICE_NAMESPACE.svc.cluster.local
---
apiVersion: v1
kind: Service
metadata:
  labels:
    app.kubernetes.io/name: my-project
    app.kubernetes.io/managed-by: kustomize
  name: v1-search-task
  namespace: system
spec:
  ports:
    - port: 443
      protocol: TCP
      targetPort: 7443
  selector:
    control-plane: controller-manager
    app.kubernetes.io/name: my-project
{{< /code >}}

Then add these two manifests to the `resources` section in the `config/manager/kustomization.yaml` file.

{{< code yaml "kustomization.yaml" >}}- task-search-service.yaml
- task-apiservice.yaml
{{< /code >}}

Create the `Deployment` patch file at `config/default/manager_apiservice_patch.yaml`.

{{< code yaml "manager_apiservice_patch.yaml" >}}- op: add
  path: /spec/template/spec/containers/0/args/-
  value: --apiserver-port=:7443

- op: add
  path: /spec/template/spec/containers/0/args/-
  value: --apiserver-data-dir=/data

- op: add
  path: /spec/template/spec/containers/0/volumeMounts/-
  value:
    mountPath: /data
    name: apiserver-data

- op: add
  path: /spec/template/spec/volumes/-
  value:
    name: apiserver-data
    emptyDir: {}

- op: add
  path: /spec/template/spec/containers/0/args/-
  value: --apiserver-cert-file=/tmp/k8s-apiserver-server/serving-certs/tls.crt

- op: add
  path: /spec/template/spec/containers/0/args/-
  value: --apiserver-key-file=/tmp/k8s-apiserver-server/serving-certs/tls.key

- op: add
  path: /spec/template/spec/containers/0/ports/-
  value:
    containerPort: 7443
    name: apiserver
    protocol: TCP

- op: add
  path: /spec/template/spec/containers/0/volumeMounts/-
  value:
    mountPath: /tmp/k8s-apiserver-server/serving-certs
    name: apiserver-certs
    readOnly: true

- op: add
  path: /spec/template/spec/volumes/-
  value:
    name: apiserver-certs
    secret:
      secretName: v1-search-task-tls
{{< /code >}}

> The patch contains a temporary directory. All data will lost between restarts! If you want to persist data, you have to create a [Persistent Volume](https://kubernetes.io/docs/concepts/storage/persistent-volumes/) or set `hostPath` instead of `emptyDir`.

Add the following lines in `config/default/kustomization.yaml` file to the `patches` section.

{{< code yaml "kustomization.yaml" >}}- path: manager_apiservice_patch.yaml
  target:
    kind: Deployment
{{< /code >}}

Add the lines below to the `replacements` section in `config/default/kustomization.yaml`.

{{< code yaml "kustomization.yaml" >}}- source:
    kind: Certificate
    group: cert-manager.io
    version: v1
    name: v1-search-task-cert
    fieldPath: .metadata.namespace
  targets:
    - select:
        kind: APIService
        group: apiregistration.k8s.io
        version: v1
        name: v1.search.task.example.example.com
      fieldPaths:
        - .metadata.annotations.[cert-manager.io/inject-ca-from]
      options:
        delimiter: /
        index: 0
- source:
    kind: Certificate
    group: cert-manager.io
    version: v1
    name: v1-search-task-cert
    fieldPath: .metadata.name
  targets:
    - select:
        kind: APIService
        group: apiregistration.k8s.io
        version: v1
        name: v1.search.task.example.example.com
      fieldPaths:
        - .metadata.annotations.[cert-manager.io/inject-ca-from]
      options:
        delimiter: /
        index: 1

- source:
    kind: Service
    version: v1
    name: v1-search-task
    fieldPath: .metadata.name
  targets:
    - select:
        kind: Certificate
        group: cert-manager.io
        version: v1
        name: v1-search-task-cert
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
    name: v1-search-task
    fieldPath: .metadata.namespace
  targets:
    - select:
        kind: Certificate
        group: cert-manager.io
        version: v1
        name: v1-search-task-cert
      fieldPaths:
        - .spec.dnsNames.0
        - .spec.dnsNames.1
      options:
        delimiter: '.'
        index: 1
        create: true
{{< /code >}}

## Implement Aggregation Server

It is time to write the aggregation service implementation itself. Create the file `internal/apiserver/task_search.go` with the following content.
The solution includes a tool that indexes data to make searching for task details easier and also has a raw endpoint to filter results.

{{< code golang "task_search.go" >}}package apiserver

import (
	"context"
	"errors"
	"fmt"
	"net/http"
	"strings"

	bleve "github.com/blevesearch/bleve/v2"
	kaf "github.com/HariKube/kubernetes-aggregator-framework/pkg/framework"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	logf "sigs.k8s.io/controller-runtime/pkg/log"
)

const (
	Group   = "search.task.example.example.com"
	Version = "v1"
)

var (
	tasksearchlog = logf.Log.WithName("task-search")

	Indexer bleve.Index
)

type Index struct {
	Namespace  string `json:"namespace"`
	Name       string `json:"name"`
	Generation int64  `json:"generation"`
	Details    string `json:"details"`
}

func New(port, certFile, keyFile, dataDir string) *searchAPIServer {
	sas := searchAPIServer{
		Server: *kaf.NewServer(kaf.ServerConfig{
			Port:     port,
			CertFile: certFile,
			KeyFile:  keyFile,
			Group:    Group,
			Version:  Version,
			APIKinds: []kaf.APIKind{
				{
					ApiResource: metav1.APIResource{
						Name:  "details",
						Verbs: []string{"get"},
					},
					RawEndpoints: map[string]http.HandlerFunc{
						"": func(w http.ResponseWriter, r *http.Request) {
							q := r.URL.Query().Get("q")
							if q == "" {
								w.WriteHeader(http.StatusBadRequest)
								w.Write([]byte("missing query parameter 'q'"))
								return
							}

							query := bleve.NewQueryStringQuery(q)
							searchResult, err := Indexer.Search(bleve.NewSearchRequest(query))
							if err != nil {
								w.WriteHeader(http.StatusInternalServerError)
								w.Write([]byte(err.Error()))
								return
							}

							if len(searchResult.Hits) > 100 {
								w.WriteHeader(http.StatusBadRequest)
								w.Write([]byte("too many results, please narrow down your query"))
								return
							}

							indexes := make([]string, 0, len(searchResult.Hits))
							for _, hit := range searchResult.Hits {
								indexes = append(indexes, hit.ID)
							}

							w.WriteHeader(http.StatusOK)
							w.Write([]byte(strings.Join(indexes, ",")))
						},
					},
				},
			},
		}),
		dataDir: dataDir,
	}

	return &sas
}

type searchAPIServer struct {
	kaf.Server
	dataDir string
}

func (s *searchAPIServer) Start(ctx context.Context) (err error) {
	docMapping := bleve.NewDocumentMapping()
	docMapping.AddFieldMappingsAt("details", bleve.NewTextFieldMapping())
	docMapping.AddFieldMappingsAt("namespace", bleve.NewTextFieldMapping())

	mapping := bleve.NewIndexMapping()
	mapping.AddDocumentMapping("mapping", docMapping)
	mapping.DefaultField = "details"

	Indexer, err = bleve.New(s.dataDir, mapping)
	if err != nil {
		if errors.Is(err, bleve.ErrorIndexPathExists) {
			Indexer, err = bleve.Open(s.dataDir)
			if err != nil {
				return fmt.Errorf("failed to open index: %w", err)
			}
		} else {
			return fmt.Errorf("failed to create index: %w", err)
		}
	}

	srvErr := s.Server.Start(ctx)

	indxErr := Indexer.Close()
	if indxErr != nil {
		tasksearchlog.Error(indxErr, "Failed to close indexer")
	}

	return errors.Join(srvErr, indxErr)
}
{{< /code >}}

Add new flags to the `cmd/main.go` file before the `flag.Parse()` call.

{{< code golang "main.go" >}}var apiServerPort string
var apiServerDataDir string
var apiServerCertFile string
var apiServerKeyFile string
flag.StringVar(&apiServerPort, "apiserver-port", ":7443", "The port the API server serves at. Default is 7443.")
flag.StringVar(&apiServerDataDir, "apiserver-data-dir", "./", "The data directory for the API server to use.")
flag.StringVar(&apiServerCertFile, "apiserver-cert-file", "", "The TLS cert file for the API server to use.")
flag.StringVar(&apiServerKeyFile, "apiserver-key-file", "", "The TLS key file for the API server to use.")
{{< /code >}}

Initialize API server in the same file before the `mgr.Start(ctrl.SetupSignalHandler())` call.

{{< code golang "main.go" >}}if err := mgr.Add(apiserver.New(apiServerPort, apiServerCertFile, apiServerKeyFile, apiServerDataDir)); err != nil {
  setupLog.Error(err, "unable to add API server to manager")
  os.Exit(1)
}
{{< /code >}}

Update your mutation webhook in `Default(context.Context, runtime.Object) error` function at `internal/webhook/v1/task_webhook.go` to index resources.

{{< code golang "task_webhook.go" >}}lastGen := task.Generation - 10
if !task.DeletionTimestamp.IsZero() {
  lastGen = task.Generation
} else if task.Spec.Details != "" {
  indexKey := fmt.Sprintf("%s.%s.%d", task.Namespace, task.Name, task.Generation+1)
  task.Labels["example.example.com/task-indexer"] = indexKey
  if err := apiserver.Indexer.Index(indexKey, apiserver.Index{
    Namespace:  task.Namespace,
    Name:       task.Name,
    Generation: task.Generation + 1,
    Details:    task.Spec.Details,
  }); err != nil {
    return fmt.Errorf("failed to index task details: %w", err)
  }
}

if lastGen > 0 {
  cleanupQuery := bleve.NewQueryStringQuery(fmt.Sprintf("+namespace:%s +name:%s +generation:<=%d", task.Namespace, task.Name, lastGen))
  searchResult, err := apiserver.Indexer.Search(bleve.NewSearchRequest(cleanupQuery))
  if err != nil {
    return fmt.Errorf("failed to compact task details: %w", err)
  }
  batch := apiserver.Indexer.NewBatch()
  for _, hit := range searchResult.Hits {
    batch.Delete(hit.ID)
  }
  if err := apiserver.Indexer.Batch(batch); err != nil {
    return fmt.Errorf("failed to compact task details: %w", err)
  }
}
{{< /code >}}

Update dependencies of the service.

{{< code bash >}}go mod tidy
{{< /code >}}

Re-deploy the application.

{{< code bash >}}export IMG=controller:dev
make docker-build
../bin/kind load docker-image $IMG
make deploy
kubectl delete pod -n my-project-system -l control-plane=controller-manager
{{< /code >}}

Create your `Task` object.

{{< code bash >}}cat | kubectl apply -f - <<EOF
apiVersion: example.example.com/v1
kind: Task
metadata:
  name: task-sample-4
spec:
  priority: 4
  details: Sample task details for task-sample-4
  deadline: "2025-08-19T16:52:15Z"
EOF
{{< /code >}}

Validate business logic by filtering tasks via aggregation api.

{{< code bash >}}kubectl get tasks --selector "example.example.com/task-indexer in ($(kubectl get --raw /apis/search.task.example.example.com/v1/details?q='%2Bdetails:task-sample-4 %2Bnamespace:default'))"
{{< /code >}}

{{< output >}}NAME            PRIORITY   DEADLINE               TASKSTATE
task-sample-4   4          2025-08-19T16:52:15Z   Pending
{{< /output >}}

You can read more about how to query the indexer in the official [docs](https://blevesearch.com/docs/Query-String-Query/).

While Kubernetes excels at orchestration, its native data filtering is limited. The Kubernetes API Aggregation Layer provides a powerful solution by allowing you to create custom API servers that sit in front of the core API. This gives you the ability to implement a purpose-built data search engine, such as the one in this post, which leverages a dedicated indexer to perform complex queries like full-text searches.

---

**Ready for the next step? Learn how to implement fully customized Aggregation API.** [[→]](/blog/create-microservice-with-operator-4/)

---

That's the approach! By using the Kubernetes API Aggregation Layer **you can unlock custom capabilities like advanced data filtering and full-text search, seamlessly integrating them into your cluster's API**. This pattern allows you to leverage specialized tools to solve problems that Kubernetes isn't natively designed for.

Thank you for reading, and feel free to share your thoughts.