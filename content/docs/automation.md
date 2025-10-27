---
title: "Automation"
layout: "simple"
description: "Configuring a dynamic database topology under Kubernetes is boring and painful. HariKube makes it easy by automating Kubernetes configuration. This documentation provides step-by-step guidance to help you leverage HariKube for seamless, scalable, and reliable database operations in your Kubernetes environment."
prevTitle: "Custom Resource"
prevLink: "/docs/custom-resource/"
nextTitle: "Monitoring"
nextLink: "/docs/monitoring/"
---

{{< ld-docs >}}

{{< toc >}}

> There are multiple ways to update topology config on the go. You can store configurations in a file and update it's content, or you can use a webserver as a source of the configurations. An other option is using Kubernetes secret as a source of truth. This documentation is focusing on using HariKube operator to merge multiple configuration sources into the final tree of topology configs.

## 🔧 Configure Kubernetes with HariKube

Start by installing HariKube and configuring its middleware in your Kubernetes cluster. This will enable the platform to route database requests to different databases, based on configuration.

For installation instruction, please follow the [documentation](/docs/custom-resource/).

> For `TOPOLOGY_CONFIG` environment variable, please use `secret://<namespace>/<name>` format, and ensure the secret is empty during the initial cluster start.

## 🛢️ Setup Database Operators

HariKube works alongside existing database operators (e.g., MySQL, PostgreSQL) to provision and manage actual database instances. Install your favorite operators in your cluster for example:

 - **KubeDB**: https://github.com/kubedb/installer
 - **MySQL Operator**: https://github.com/mysql/mysql-operator
 - **Percona Operator**: https://github.com/percona/percona-server-mysql-operator
 - **Presslabs MySQL operator**: https://github.com/kuberlogic/presslabs-mysql-operator
 - **CloudNativePG**: https://github.com/cloudnative-pg/cloudnative-pg
 - **PGO**: https://github.com/CrunchyData/postgres-operator
 - **StackGres**: https://github.com/ongres/stackgres

Once installation has finished, create your database instances themselves. Please follow the operator's manual, how to do it properly.

## 🔌 Deploy HariKube Operator

Next step is configuring and deploying HariKube Operator. The operator is a standard Kubernetes operator, so if you are familiar with operators, you are good to go.

> Images are not public, please ask for registry user via info@inspirnation.eu or follow [get started](/get-started/) page.

{{< code bash >}}kubectl apply -f https://harikube.info/manifests/harikube-operator-{{ .Site.Params.operatorVersion }}.yaml
{{< /code >}}

## 🗂️ Create your first routing configuration

The operator provides a custom resource type for routing configurations called `topologyconfigs.harikube.info`. You can bundle `TopologyConfig` custom resource with your microservice manifests, the operator would fetch all the configs and merge them into a final config for the middleware. The global order of configs are based on the `TopologyConfig.Status.DeployOrder` field of resources. Each microservice can declare how its data should be partitioned, what database backend to use, and whether to reuse or isolate instances.

> In this example, the database endpoint and TLS configuration are presented in plain text for simplicity. To securely define your data, use the secret://<namespace>/<name>/<key> format.

{{< code yaml "topologyconfig-sample.yaml" >}}apiVersion: harikube.info/v1
kind: TopologyConfig
metadata:
  name: topologyconfig-sample
spec:
  # Defines the namespaced name of the merged configuration
  targetSecret: <namespace>/<name>
  # Defines list of routing configurations
  backends:
  - name: namespace-sample
    endpoint: mysql://<user>:<password>@tcp(<ip>:<port>)/<namespace_database>
    namespace:
        namespace: <namespace>
  - name: custom-resource-sample
    endpoint: postgres://<user>:<password>@<ip>:<port>/<crd_database>
    customresource:
        group: <group>
        kind: <kind>
{{< /code >}}

>**!!! Custom resource reconciliation, topology config validation and secret update takes some time. Please make sure the `status.deployStatus` of the custom resource is `Active` before you create any resource affected by the policy. Error reason is stored at `status.deployStatusReason`. Creating resources before the policy has been applied will lead to "data loss" (more specifically they would stuck in the main database, and the middleware never fetch them again).**

By automating these steps, HariKube transforms Kubernetes into a true Platform-as-a-Service solution, because HariKube provides full control of data isolation and distributes database requests based on the customer's needs.

#### [<-- Custom Resource](/docs/custom-resource/) | [Monitoring -->](/docs/monitoring/)