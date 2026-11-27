---
title: "FAQ"
description: "Frequently asked questions about HariKube, Kubernetes integration, database routing, migration, and editions."
layout: "company"
---

{{< faq >}}
{
    "title": "Common Questions",
    "description": "Learn where HariKube fits, how it works with your cluster, and what to consider before adopting it.",
    "questions": [
        {
            "question": "What problem does HariKube solve, and when should I use it?",
            "answer": "HariKube helps teams use the Kubernetes API to manage large custom resource datasets and application state without putting all of that data in a single etcd store. Its middleware routes selected resources to databases such as PostgreSQL or MySQL. It is useful for custom-resource-based services, multi-tenant platforms, and workloads that need separate storage or more capacity than a single backend provides. See the [overview](/docs/overview/) for common use cases."
        },
        {
            "question": "Does HariKube replace Kubernetes or etcd?",
            "answer": "HariKube does not replace Kubernetes. It adds a middleware layer between the Kubernetes API server and the storage backends. You choose which resources go to which database through routing policies. Resources that do not match a policy go to the configured default backend, which can be etcd. You do not have to move every resource to an external SQL database."
        },
        {
            "question": "Do I need to change my applications, CRDs, or operators?",
            "answer": "Applications and operators continue to work through the Kubernetes API rather than connecting directly to the underlying databases. Changing where resources are stored does not itself require rewriting their CRDs or adding database access code to your application. However, the cluster needs HariKube-specific components and configuration, and you should test your operators and workloads against the supported Kubernetes version before migrating. See the [installation guide](/docs/installation/) for requirements."
        },
        {
            "question": "Can I install HariKube on my existing Kubernetes cluster?",
            "answer": "The recommended Helm deployment creates a HariKube-backed virtual Kubernetes cluster inside your existing cluster, without replacing the host cluster's control plane. The Helm guide requires cert-manager. For a standalone deployment, the self-hosted and Rancher guides describe the required control-plane images and settings, including pointing the API server at the middleware. Direct integration therefore requires control over those components; it is not just an application installed into an otherwise unchanged control plane. Start with the [installation options](/docs/installation/)."
        },
        {
            "question": "What happens to existing data when I enable or change routing?",
            "answer": "HariKube does not automatically migrate existing resources when you add or change a routing policy. If a new rule sends requests to a different backend, previously stored records can become inaccessible through the API until they are migrated correctly. Plan and test the migration, and back up your data before changing routing. The documented runtime configuration update support is limited to appending rules at the bottom of the configuration. Read the [routing configuration guidance](/docs/installation/) before making changes."
        },
        {
            "question": "Which databases are supported, and does support vary by edition?",
            "answer": "HariKube supports multiple storage backends, including PostgreSQL, MySQL, and SQLite, with additional options such as TiDB, CockroachDB, and YugabyteDB available in selected editions. Backend availability and the number of databases you can configure depend on your edition. Check the [database support overview](/docs/overview/) for backend capabilities and the [edition comparison](/editions/) for what is included in each plan."
        },
        {
            "question": "Can I isolate data by tenant, namespace, or resource type?",
            "answer": "Yes. Routing policies can direct resources to separate databases by namespace, resource type, key prefix, or custom resource group and kind. Rules are evaluated from top to bottom, and the first match selects the backend. For tenant-per-namespace designs, this lets you separate tenant storage. Storage separation is one part of a multi-tenant design, not a replacement for access controls, network security, or compliance review. See the [routing examples](/docs/installation/)."
        },
        {
            "question": "What Kubernetes compatibility requirements and limitations should I know about?",
            "answer": "HariKube retains the Kubernetes API as the application interface, but deployment requires specific Kubernetes components and settings. The self-hosted guide lists supported versions and requires JSON storage with the API server watch cache disabled; Kubernetes encryption-provider integration is not supported in that setup. Using a SQL backend also does not turn the Kubernetes API into a relational query interface: joins and multi-resource ACID transactions are not provided. Review the [self-hosted requirements](/docs/details/install-kubeadm/) and [documented limitations](/docs/overview/) against your workload before adopting HariKube."
        },
        {
            "question": "How does HariKube affect performance, and how can I evaluate it?",
            "answer": "HariKube can reduce contention by distributing resource data across databases and applying supported label and field selectors at the storage layer. Results depend on your workload, backend capacity, topology, and network latency; adding databases is not a guarantee of a particular speedup. Use the [published performance examples](/features/performance/) as a starting point, then test representative resource sizes, read/write rates, list/watch traffic, latency, and error rates in your own environment."
        },
        {
            "question": "What is included in the open-source edition, and when do I need a paid edition?",
            "answer": "The Open-Source Edition supports one database, PostgreSQL, MySQL, or SQLite backends, storage-side filtering, basic monitoring, and community support. Paid editions add capabilities such as multiple databases, automatic database configuration, and additional support options; backend availability and metadata shard limits vary by edition. Compare the current [editions](/editions/) to choose a starting point, or [contact us](/contact-us/) to discuss your deployment requirements."
        }
    ]
}
{{< /faq >}}