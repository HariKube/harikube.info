---
title: "The Hidden Infrastructure Challenge Behind AI Agents"
date: 2026-06-03
author: "Andras Szanto"
description: "AI agents are shifting the infrastructure conversation beyond GPUs. As AI systems become more autonomous, Kubernetes control-plane scalability and coordination may become just as important as compute."
categories: ["AI"]
tags: ["kubernetes", "AI"]
featured_image: "/images/blog/the_hidden_infrastructure_challenge_behind_ai_agents_harikube.png"
---

The AI infrastructure conversation is dominated by compute.

Every week brings a new announcement about GPUs, training clusters, inference optimization, or model performance. Organizations are investing heavily in the hardware required to build and deploy AI systems, while investors are trying to understand how much infrastructure will be needed to support the next wave of adoption.

These discussions are important. But they focus primarily on one side of the equation.

As enterprises move from AI assistants toward AI agents, a different challenge is emerging. The problem is no longer just generating responses. It is coordinating actions.

An AI agent rarely operates in isolation. It accesses tools, retrieves information, triggers workflows, updates records, communicates with other systems, and often collaborates with additional agents. A single business process may involve dozens of interconnected actions. At enterprise scale, those actions can number in the millions.

This creates a new infrastructure requirement. Not more intelligence, but more coordination.

## Kubernetes Has Become the Operating System for AI

The rise of AI has reinforced Kubernetes' position as the default platform for modern infrastructure.

According to the [CNCF Annual Cloud Native Survey](https://www.cncf.io/announcements/2026/01/20/kubernetes-established-as-the-de-facto-operating-system-for-ai-as-production-use-hits-82-in-2025-cncf-annual-cloud-native-survey/), 66% of organizations running Generative AI workloads already use Kubernetes for inference. The same report found that 82% of container users run Kubernetes in production.

The reasons are straightforward. Kubernetes provides workload scheduling, resilience, portability, resource management, and a mature ecosystem. Most organizations already understand how to operate it. Extending Kubernetes to support AI is often easier than introducing an entirely new platform.

As a result, AI is increasingly being built on top of existing Kubernetes foundations.

This trend brings significant advantages. It also introduces new challenges that traditional cloud-native applications rarely encounter.

## AI Agents Generate Different Infrastructure Patterns

Most enterprise applications are relatively predictable.

A customer visits a website. An API receives a request. A backend service processes information and returns a response. Scaling generally means adding more replicas, more nodes, or more compute capacity.

AI agents behave differently.

They continuously interact with their environment. They monitor changes. They update state. They trigger events. They launch additional tasks. They make decisions based on new information.

From an infrastructure perspective, agentic systems create a far more dynamic environment.

Every agent execution can generate multiple actions:

- Creating workloads
- Updating resources
- Writing state
- Triggering events
- Reacting to external signals
- Initiating additional workflows

Unlike traditional applications, which may spend most of their lifetime serving requests, agentic systems spend a significant portion of their lifetime coordinating activity.

This trend is already visible across the industry. According to [Portworx's State of Kubernetes and AI report](https://portworx.com/the-state-of-kubernetes-ai/), 90% of organizations expect AI and machine learning workloads on Kubernetes to grow, while nearly half anticipate cluster growth exceeding 50% within a year.

Growth alone is not the challenge.

The challenge is the increasing number of interactions that growth creates.

## The Most Important Part of Kubernetes Is Often the Least Discussed

When engineers discuss Kubernetes, they typically focus on worker nodes, containers, networking, autoscaling, or service meshes.

Far less attention is given to the control plane.

Yet the control plane is responsible for nearly everything that makes Kubernetes work.

It maintains cluster state. It processes updates. It manages object lifecycles. It distributes information to controllers. It ensures that the actual state of the system matches the desired state defined by users and applications.

Every deployment, service, configuration change, event, secret, custom resource, and status update passes through this layer.

In effect, the control plane acts as the coordination engine of Kubernetes.

This matters because AI agents create coordination-heavy workloads.

A traditional application may run for months with relatively stable infrastructure definitions. An agentic platform may continuously create, modify, observe, and react to resources throughout the day.

The amount of coordination activity grows much faster than the amount of compute activity.

As systems scale, managing state efficiently becomes increasingly important.

Research on Kubernetes environments has shown that the performance characteristics of etcd, the datastore used by Kubernetes, can significantly influence orchestration performance. This is not a criticism of etcd. It reflects a broader reality: the more dynamic a system becomes, the more important state management becomes.

For many organizations, this remains invisible.

For large-scale AI platforms, it is becoming increasingly difficult to ignore.

## The Industry Has Already Started Responding

The good news is that the industry is not discovering this challenge for the first time.

Large cloud providers have spent years dealing with control-plane scalability.

Amazon Web Services has introduced [Provisioned Control Plane](https://docs.aws.amazon.com/eks/latest/userguide/eks-provisioned-control-plane.html) capabilities within EKS to support larger and more demanding Kubernetes environments. The existence of these offerings reflects an important reality: at sufficient scale, control-plane performance becomes a business concern.

Google's approach is perhaps even more revealing.

Google has publicly described how [GKE supports very large clusters](https://cloud.google.com/blog/products/containers-kubernetes/gke-65k-nodes-and-counting) by implementing an etcd-compatible API over a Spanner-backed storage system. Google explained that this helps maintain compatibility while improving scale and reliability.

This is not because Kubernetes is broken.

It is because success changes requirements.

As organizations push Kubernetes into larger and more complex environments, the architecture supporting cluster state must evolve alongside it.

The same pattern has appeared repeatedly throughout computing history. Systems that succeed eventually encounter workloads their original designers never anticipated.

AI agents may represent the next such workload.

## More Clusters Are Not Always the Answer

Historically, the most common answer to scale has been partitioning.

When a cluster becomes too large, create another cluster.

The approach works. It remains an important tool for platform teams.

However, partitioning introduces its own challenges.

Every new cluster increases operational complexity. Teams must manage additional upgrades, networking configurations, observability pipelines, access controls, compliance requirements, and security policies.

The infrastructure becomes larger. The coordination problem does not disappear.

It simply moves to a different layer.

There is also a financial consideration.

Managed Kubernetes platforms typically include control-plane costs independent of workload consumption. [Amazon EKS pricing](https://aws.amazon.com/eks/pricing/) includes per-cluster control-plane charges, and larger provisioned control-plane tiers add further hourly costs.

As a result, many platform engineering teams are beginning to ask different questions.

Instead of focusing solely on workload distribution, they are examining how cluster state itself should evolve.

Can Kubernetes APIs remain unchanged while storage architectures become more scalable?

Can orchestration systems become more aware of where data lives?

Can state be distributed more intelligently without forcing developers to change how they build applications?

These questions are increasingly relevant as AI workloads continue to grow.

## The Next AI Infrastructure Conversation

The first phase of AI infrastructure focused on models.

The second phase focused on compute.

The next phase will likely focus on coordination.

Organizations deploying large numbers of AI agents will need infrastructure capable of managing continuous streams of events, state changes, workflows, and interactions. The challenge will not simply be generating intelligence. It will be managing the systems that allow intelligence to operate at scale.

This does not diminish the importance of GPUs.

It expands the conversation beyond them.

The future of AI infrastructure will require advances across the entire stack, from silicon and networking to orchestration and state management.

The organizations that recognize this shift early will be better positioned to build scalable AI platforms rather than isolated AI deployments.

## Where HariKube Fits

HariKube was created around a simple observation.

Kubernetes has won.

Its API model, ecosystem, extensibility, and developer experience have become foundational to modern infrastructure. Most organizations are not looking for a replacement.

What they need is a path forward as scale, complexity, and workload patterns continue to evolve.

AI agents are accelerating that evolution.

HariKube explores an architectural approach that preserves the Kubernetes experience while enabling more flexible state management and data distribution underneath it. The goal is not to change how developers interact with Kubernetes. The goal is to expand what Kubernetes can support as new workload patterns emerge.

Today, those workload patterns are being driven by AI agents.

Tomorrow, they may come from entirely different sources.

The underlying challenge remains the same.

As distributed systems become more dynamic, more event-driven, and more interconnected, coordination becomes increasingly important.

For the last decade, infrastructure discussions have focused primarily on compute.

The next decade may be defined by how effectively we coordinate everything that compute enables.

---

## Learn More

Curious how HariKube approaches state management at Kubernetes scale?

- [Download the HariKube White Paper](/whitepapers/transforming_kubernetes_from_infrastructure_to_application_platform_v1/)
- [Read: The Future of Kubernetes PaaS and Kubernetes-Native Service Development Is Here](/blog/the-future-of-kubernetes-paas-and-kubernetes-native-service-development-is-here/)
- [Explore HariKube](/docs/overview/)

---

## Sources

1. [CNCF Annual Cloud Native Survey 2025](https://www.cncf.io/announcements/2026/01/20/kubernetes-established-as-the-de-facto-operating-system-for-ai-as-production-use-hits-82-in-2025-cncf-annual-cloud-native-survey/)
2. [Portworx State of Kubernetes and AI](https://portworx.com/the-state-of-kubernetes-ai/)
3. [Impact of etcd Deployment on Kubernetes Performance](https://arxiv.org/abs/2004.00372)
4. [Google: GKE supports 65,000-node clusters](https://cloud.google.com/blog/products/containers-kubernetes/gke-65k-nodes-and-counting)
5. [Learnk8s: Why etcd breaks at scale in Kubernetes](https://learnkube.com/etcd-breaks-at-scale)
6. [Amazon EKS Pricing](https://aws.amazon.com/eks/pricing/)
7. [Amazon EKS Provisioned Control Plane](https://docs.aws.amazon.com/eks/latest/userguide/eks-provisioned-control-plane.html)
