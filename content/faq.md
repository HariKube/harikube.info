---
title: "FAQ"
description: "Frequently Asked Question"
layout: "company"
---

{{< faq >}}
{
    "title": "Common Questions",
    "description": "Find answers to frequently asked questions about our pricing plans and features.",
    "questions": [
        {
            "question": "What is HariKube and how does it differ from standard Kubernetes?",
            "answer": "HariKube is a Kubernetes-native middleware platform that offloads custom resource and microservice data from ETCD to scalable databases like MySQL, PostgreSQL and TiDB. It enhances Kubernetes with better performance, data isolation, and horizontal scalability."
        },
        {
            "question": "Do I need to change my application code to use HariKube?",
            "answer": "No. HariKube operates transparently beneath the Kubernetes API. Your application continues to use standard Kubernetes CRDs and APIs without any code changes."
        },
        {
            "question": "Is HariKube suitable for production environments?",
            "answer": "Yes. HariKube is designed for production-grade Kubernetes clusters, providing scalability, reliability, and compliance-friendly data isolation out of the box."
        },
        {
            "question": "What kind of databases can HariKube work with?",
            "answer": "HariKube supports pluggable backends, including MySQL, PostgreSQL, TiDB. For more information please visit the full list of [databases](/docs/overview/#-supported-databases) page."
        },
        {
            "question": "Does HariKube support multi-tenancy?",
            "answer": "Yes. It enables per-namespace and per-resource-type database isolation, making it ideal for secure, multi-tenant Kubernetes platforms."
        },
        {
            "question": "How is data routed to the correct database?",
            "answer": "HariKube uses a middleware to handle workload-aware routing based on resource type, namespace, or key-level rules."
        },
        {
            "question": "Can I use HariKube in a development environment?",
            "answer": "While it’s possible, HariKube is optimized for production use. Developers can continue using stock Kubernetes in development, as HariKube integrates seamlessly at deployment time."
        },
        {
            "question": "Does HariKube support Kubernetes-native features like RBAC or admission webhooks?",
            "answer": "Yes. HariKube fully respects Kubernetes-native mechanisms such as RBAC, admission webhooks, events, and policies, maintaining full compatibility with your existing cluster setup."
        }
    ]
}
{{< /faq >}}