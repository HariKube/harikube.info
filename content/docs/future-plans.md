---
title: "Future Plans"
layout: "simple"
description: "The current version of the software represents an MVP (Minimum Valuable Product), designed to validate the core concept and demonstrate the potential of the architecture in real-world scenarios. While it delivers the essential functionality and shows promising performance, there is still significant room for improvement across various areas-including automation, observability, performance, security, and advanced scaling features. This foundation provides a solid starting point for iterative enhancements based on user feedback and evolving use cases."
prevTitle: "Monitoring"
prevLink: "/docs/monitoring/"
---

{{< ld-docs >}}

{{< toc >}}

## 🔧 Planned Improvements and Enhancements

#### 1. Database Management

Implement robust tooling to deploy, manage, and back up multi-vendor databases (e.g., PostgreSQL, MySQL) across clusters and cloud providers. This includes automated provisioning, policy-driven lifecycle management, and seamless integration with existing infrastructure.

#### 2. Performance Tuning

Optimize performance across all critical system layers:

 - Watchers: Improve event-driven data synchronization and reduce latency.
 - Metadata Storage: Introduce optimized metadata storage mechanisms to improve system performance and responsiveness.
 - Table Partitions: Enable partitioning and sharding strategies to accelerate large-scale data operations.
 - Garbage Collection: Shift Kubernetes garbage collection logic to the database layer to enable more efficient cleanup of orphaned or expired resources, reduce API server load, and improve overall system performance.

#### 3. Database Support Expansion

Extend backend compatibility to support a broader range of relational and NoSQL databases. This enables users to choose the most suitable storage technology for their use case, while maintaining the same unified API and operational model.

#### 4. High Availability (HA)

Introduce high-availability features for the middleware layer, including:

 - Leader election and failover mechanisms
 - Stateful load balancing
 - Redundancy and replication strategies to prevent single points of failure

#### 5. Encryption Support

Support multiple encryption strategies for data in transit and at rest. This includes:

 - Implement support for Kubernetes Envelope Encryption to secure sensitive data at rest using external Key Management Systems (KMS)
 - Integration with 3rd party KMS solutions (e.g., Vault, AWS, GCP, Azure)

#### 6. Flexible API Server Deployment

In addition to the built-in API server, support the ability to deploy dedicated API servers per resource type or resource group. This enables isolated scaling, improved fault tolerance, and performance optimization for high-traffic or latency-sensitive resources.

#### [<-- Monitoring](/docs/monitoring/)