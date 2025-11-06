---
title: "Introducing Serverless Kube Watch Trigger: Declarative Event Triggers for Kubernetes"
date: 2025-10-18
author: "Richard Kovacs"
description: "Learn how to Kubernetes as source of serverless functions."
categories: ["Microservice", "Open-Source"]
tags: ["kubernetes", "serverless", "microservice"]
featured_image: "/images/blog/introducing-serverless-kube-watch-trigger-declarative-event-triggers-for-kubernetes.png"
---

{{< toc >}}

Today we’re releasing something small, simple, open-source, and surprisingly powerful: [serverless-kube-watch-trigger](https://github.com/HariKube/serverless-kube-watch-trigger), a Kubernetes Custom Resource Definition that turns cluster events into HTTP calls — directly and declaratively.

No glue scripts. No extra brokers. No complex controllers. Just YAML.

## ❓ Why We Built It

When working on **HariKube**, we realized a missing piece: while Kubernetes could scale and orchestrate workloads, there was no *simple, built-in way* to react to events without writing Go code. Operators work great for stateful loops, but not every use case needs a controller.

We wanted a native, minimal way to say:

> “When this Deployment changes, send an HTTP request.”

That’s what `serverless-kube-watch-trigger` does.

## 🔌 What It Does

`serverless-kube-watch-trigger` listens to changes in Kubernetes resources and performs HTTP requests when those changes match defined filters.

You describe **what to watch**, **what to send**, and **where to send it**.

That’s all.

Here’s the full example:

{{< code yaml "full-httptrigger-example.yaml" >}}apiVersion: triggers.example.com/v1
kind: HTTPTrigger
metadata:
  name: full-httptrigger-example
  namespace: default
spec:
  resource:
    apiVersion: apps/v1
    kind: Deployment
  namespaces:
    - default
    - kube-system
  labelSelectors:
    - app=frontend
    - tier=prod
  fieldSelectors:
    - metadata.name=my-deployment
  eventTypes:
    - ADDED
    - MODIFIED
    - DELETED
  eventFilter: 'ne .status.availableReplicas 0'
  concurrency: 5
  sendInitialEvents: false
  url:
    static: "https://example.com/hook"
    # template: "https://example.com/hook/{{ "{{ .metadata.name }}" }}"
    # service:
    #   name: webhook-svc
    #   namespace: default
    #   portName: http
    #   scheme: http
    #   uri:
    #     template: "/hook/{{ "{{ .metadata.name }}" }}"
  method: POST
  auth:
    basicAuth:
      user: ci-bot
      secretKeyRef:
        name: webhook-pass
        key: password
    tls:
      caRef:
        name: webhook-ca
        key: ca.crt
      certRef:
        name: webhook-cert
        key: tls.crt
      keyRef:
        name: webhook-cert
        key: tls.key
      insecureSkipVerify: false
  headers:
    static:
      X-Static-Token: "fixed-token-value"
      X-Cluster-ID: "cluster-001"
    template:
      X-Resource-Name: "{{ "{{ .metadata.name }}" }}"
      X-Resource-Namespace: "{{ "{{ .metadata.namespace }}" }}"
    fromSecretRef:
      X-Api-Key:
        name: api-secret
        key: api-key
      X-Other-Token:
        name: extra-secrets
        key: token
  body:
    contentType: application/json
    template: |
      {{ "{{ toJson . }}" }}
    signature:
      header: X-Signature
      keySecretRef:
        name: sig-key
        key: key
      hmac:
        hashType: SHA512
  delivery:
    timeout: 30s
    retries: 5
{{< /code >}}

Install the controller.

{{< code bash >}}kubectl apply -f https://github.com/HariKube/serverless-kube-watch-trigger/releases/download/beta-v1.0.0-6/bundle.yaml
{{< /code >}}

Configure RBAC and enable deployments for the operator.

{{< code yaml "full-httptrigger-rbac.yaml" >}}apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: serverless-kube-watch-trigger-deployment-rolebinding
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: serverless-kube-watch-trigger-deployment-role
subjects:
- kind: ServiceAccount
  name: serverless-kube-watch-trigger-controller-manager
  namespace: serverless-kube-watch-trigger-system
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: serverless-kube-watch-trigger-deployment-role
rules:
- apiGroups:
  - "apps"
  resources:
  - deployments
  verbs:
  - get
  - list
  - watch
{{< /code >}}

Finally apply the custom resource, and whenever a Deployment’s replica count changes, Kubernetes will POST its event as JSON to your endpoint.

## ⚡ How It Fits Into HariKube

Within the **HariKube** ecosystem, `serverless-kube-watch-trigger` acts as the simplest way to build event-driven systems:

- It connects **Kubernetes watches** directly to **functions** or **APIs**.
- It works out of the box with **OpenFaaS**, **Knative**, or any HTTP endpoint.
- It uses **no custom controller logic** — just Kubernetes’ built-in reconciliation.

This aligns with HariKube’s philosophy: let Kubernetes *be the platform*.

Instead of bolting on more systems, reuse what already exists — RBAC, namespaces, CRDs, and event streams — and keep logic outside the cluster.

## 🧠 Final Thoughts

Kubernetes has grown into the universal runtime for everything from batch jobs to databases. With HariKube’s data fabric and serverless-kube-watch-trigger’s declarative event hooks, it’s now also becoming the runtime for **events and automation**.

Small building blocks. Clear contracts. Native integration.

That’s the direction we’re heading.

If you want to try it or contribute, the [README](https://github.com/HariKube/serverless-kube-watch-trigger/blob/main/README.md) in the repository has all the details.

## 🙏 Share Feedback and Report Issues

Your feedback is invaluable in helping us improve this operator. If you encounter any issues, have a suggestion for a new feature, or simply want to share your experience, we want to hear from you!

- Report Bugs: If you find a bug, please open a [GitHub Issue](https://github.com/HariKube/serverless-kube-watch-trigger/issues). Include as much detail as possible, such as steps to reproduce the bug, expected behavior, and your environment (e.g., Kubernetes version).
- Request a Feature: If you have an idea for a new feature, open a [GitHub Issue](https://github.com/HariKube/serverless-kube-watch-trigger/issues) and use the `enhancement` label. Describe the use case and how the new feature would benefit the community.
- Ask a Question: For general questions or discussions, please use the [GitHub Discussions](https://github.com/HariKube/serverless-kube-watch-trigger/discussions).

---

**Sounds interesting? Learn how HariKube unifies different service design strategies into a single hybrid architecture.** [[→]](/blog/harikube-the-hybrid-paas-blueprint-for-kubernetes/)

---

That's the message! serverless-kube-watch-trigger is a **Kubernetes Custom Resource** that declaratively turns **cluster events** (watches) into **HTTP calls**, enabling simple, no-code automation. This lets you connect Kubernetes resource changes directly to **OpenFaaS, Knative, or any webhook**, aligning with HariKube's goal of making Kubernetes the core, event-driven platform without requiring complex operators or external brokers.

Thank you for following along! If you have questions or ideas, please share them—we’d love to hear from you.
