---
title: "Monitoring & Health Checks"
layout: "simple"
description: "Track the health and performance of your HariKube deployment using standard Kubernetes tools and observability practices."
prevTitle: "Automation"
prevLink: "/docs/automation/"
nextTitle: "Future Plans"
nextLink: "/docs/future-plans/"
---

{{< ld-docs >}}

{{< toc >}}

## 📡 Metrics Exposure

HariKube exposes operational insights and health indicators through its middleware, enabling platform teams to track performance, detect issues early, and integrate seamlessly with existing monitoring stacks.

This guide walks you through how to monitor HariKube, understand its key metrics, and implement health checks in your Kubernetes environment.

HariKube exposes Prometheus-compatible metrics on a configurable HTTP endpoint.

### Default Metrics Endpoint

- **URL**: `http://<hariKube-service>:8080/metrics`
- **Format**: Prometheus exposition format

Configuration options:
 - `--metrics-bind-address`: The address the metric endpoint binds to. Default `:8080`, set 0 to disable metrics serving
 - `--metrics-enable-profiling`: Enables Go performance profiling via net/http/pprof on the metrics bind address. Default is false

This approach enables **seamless integration** with tools like Prometheus, Grafana, or OpenTelemetry and **faster troubleshooting**, since metrics like revision throughput, cache hits, and queue depth are always available in the same structure.

## 🔧 Process and Go Metrics

HariKube exposes standard Golang runtime and process-level metrics out of the box, making it easy to monitor the health and performance of the middleware using your existing observability stack.

This approach enables **early detection** of performance bottlenecks in revision tracking or database routing.

{{< details >}}
{
    "details": [
        {
            "title": "Exposed Metrics",
            "file": "docs/details/exposed-metrics-golang"
        }
    ]
}
{{< /details >}}

## 📊 GRPC Server Metrics

HariKube exposes standard gRPC server metrics out of the box, providing full visibility into API-level performance and request behavior across your middleware layer.

This approach enables **insights into request throughput, latency, and error rates** across revision and status endpoints.

{{< details >}}
{
    "details": [
        {
            "title": "Exposed Metrics",
            "file": "docs/details/exposed-metrics-grpc"
        }
    ]
}
{{< /details >}}

## 🛢️ Database Metrics

Each database backend and metadata mapper instance in HariKube exposes a consistent set of performance metrics, ensuring seamless observability across all configurations and environments.

This approach enables **uniform monitoring dashboards**, regardless of whether you're using ETCD, MySQL, or any other supported database.

### ETCD

HariKube exposes standard gRPC client-side metrics, with each request labeled by endpoint, giving you full visibility into downstream communication patterns and performance.

This approach enables **latency, error, and retry tracking** for each remote interaction — ideal for diagnosing slow or unreliable dependencies.

Each database is assigned a unique label based on `db=endpoints` to simplify metric identification and filtering.

{{< details >}}
{
    "details": [
        {
            "title": "Exposed Metrics",
            "file": "docs/details/exposed-metrics-etcd"
        }
    ]
}
{{< /details >}}

### SQL

HariKube uses Go’s standard `database/sql` package to interact with supported databases, ensuring compatibility, stability, and extensibility across a wide range of SQL backends.

This approach enables **leverage of mature connection pooling, error handling, and driver compatibility** built into the Go ecosystem.

Each database is assigned a unique label to simplify metric identification and filtering.

 - Each database (including Metadata mappers) is assigned a unique label based on `db=endpoint` to simplify metric identification and filtering.
 - The `harikube_sql_*` metrics are custom-built metrics designed to provide a clear overview of all database connections.
 
{{< details >}}
{
    "details": [
        {
            "title": "Exposed Metrics",
            "file": "docs/details/exposed-metrics-sql"
        }
    ]
}
{{< /details >}}

### BBolt

HariKube exposes custom metrics for BBolt, with each metric labeled by endpoint, giving you full visibility into usage and performance.

Each database is assigned a unique label based on `db=endpoint` to simplify metric identification and filtering.

{{< details >}}
{
    "details": [
        {
            "title": "Exposed Metrics",
            "file": "docs/details/exposed-metrics-bbolt"
        }
    ]
}
{{< /details >}}

## 📟 Metadata Mapper Cache

HariKube exposes detailed metrics to monitor the cache efficiency of each metadata mapper, including cache hit and miss rates, helping teams understand and optimize lookup performance.

This approach enables **real-time visibility** into how effectively revision metadata is being served from memory.

{{< details >}}
{
    "details": [
        {
            "title": "Exposed Metrics",
            "file": "docs/details/exposed-metrics-mapper"
        }
    ]
}
{{< /details >}}

## ✅ Liveness and Readiness Probes

HariKube runs outside the Kubernetes cluster, so it does not support Kubernetes-native liveness or readiness probes directly. However, basic and advanced health information can still be obtained using external tools.

### Readiness Check

You can check whether the HariKube gRPC service is running and accepting HTTP/2 connections with:

{{< code bash >}}curl --http2-prior-knowledge -I http://<hariKube-service>:2379
{{< /code >}}

This confirms that the gRPC endpoint is up and reachable via h2c (HTTP/2 over plaintext).

#### [<-- Automation](/docs/automation/) | [Future Plans -->](/docs/future-plans/)