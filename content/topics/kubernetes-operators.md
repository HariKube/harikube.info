---
title: "Kubernetes Operators and Custom APIs Guide"
layout: "simple"
weight: 2
description: "Follow a four-part Kubernetes operator tutorial covering custom resources, Kubebuilder controllers, full-text search, and custom aggregation APIs."
---

Build a task service by extending the Kubernetes API, then add reconciliation logic and custom endpoints. This learning path separates the roles of custom resources, controllers, and the API aggregation layer so you can choose the right extension mechanism for your application.

## Before You Start

You should be comfortable with Go, container images, and basic Kubernetes resources. The tutorials use Kubebuilder and include manifests and commands for a development environment. Read the setup instructions in Part 1 before running later examples; the search example is a demonstration, not a production-ready search service.

## Follow the Four-Part Tutorial

1. [Kubernetes Operators: Custom Resources - Part 1](/blog/create-microservice-with-operator/): understand desired state, define your task resource, and prepare the project.
2. [Build a Kubernetes Operator Controller - Part 2](/blog/create-microservice-with-operator-2/): implement reconciliation, update resource state, and publish Kubernetes events.
3. [Kubernetes API Aggregation: Full-Text Search - Part 3](/blog/create-microservice-with-operator-3/): register an APIService and build a demonstration search endpoint for indexed resources.
4. [Build Custom Kubernetes Aggregation APIs - Part 4](/blog/create-microservice-with-operator-4/): add handlers for namespaced and cluster-scoped APIs with application-specific behavior.

## Choose Your Next Step

These tutorials provide foundations for a cloud-native application platform: resource schemas, reconciliation, and custom APIs. For another event-driven pattern, see [resource changes triggering HTTP functions](/blog/introducing-serverless-kube-watch-trigger-declarative-event-triggers-for-kubernetes/). If your application also needs Kafka delivery, review the [streaming architecture](/features/event-streaming/); watches and Kafka have different delivery and recovery behavior.

If you already operate an HTTP API, read [Turn Any of Your APIs into a Kubernetes-Native Citizen](/blog/turn-any-of-your-apis-into-a-kubernetes-native-citizen/) for another approach to API integration.

For HariKube-specific configuration, see [creating your first custom resource](/docs/custom-resource/) and [automating database topology](/docs/automation/). If resource volume becomes a concern, use the [Kubernetes scaling guide](/topics/kubernetes-scaling/) to plan an evaluation.

Return to [all Kubernetes learning paths](/topics/) or browse the [engineering blog](/blog/).
