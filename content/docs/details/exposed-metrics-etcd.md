---
title: "Commonly Exposed Metrics"
layout: "simple"
---

{{< code text >}}# HELP grpc_client_handled_total Total number of RPCs completed by the client, regardless of success or failure.
# TYPE grpc_client_handled_total counter
grpc_client_handled_total{db="http://127.0.0.1:2479",grpc_code="OK",grpc_method="Range",grpc_service="etcdserverpb.KV",grpc_type="unary"} 1
# HELP grpc_client_handling_seconds Histogram of response latency (seconds) of the gRPC until it is finished by the application.
# TYPE grpc_client_handling_seconds histogram
grpc_client_handling_seconds_bucket{db="http://127.0.0.1:2479",grpc_method="Range",grpc_service="etcdserverpb.KV",grpc_type="unary",le="0.005"} 1
grpc_client_handling_seconds_bucket{db="http://127.0.0.1:2479",grpc_method="Range",grpc_service="etcdserverpb.KV",grpc_type="unary",le="0.01"} 1
grpc_client_handling_seconds_bucket{db="http://127.0.0.1:2479",grpc_method="Range",grpc_service="etcdserverpb.KV",grpc_type="unary",le="0.025"} 1
grpc_client_handling_seconds_bucket{db="http://127.0.0.1:2479",grpc_method="Range",grpc_service="etcdserverpb.KV",grpc_type="unary",le="0.05"} 1
grpc_client_handling_seconds_bucket{db="http://127.0.0.1:2479",grpc_method="Range",grpc_service="etcdserverpb.KV",grpc_type="unary",le="0.1"} 1
grpc_client_handling_seconds_bucket{db="http://127.0.0.1:2479",grpc_method="Range",grpc_service="etcdserverpb.KV",grpc_type="unary",le="0.25"} 1
grpc_client_handling_seconds_bucket{db="http://127.0.0.1:2479",grpc_method="Range",grpc_service="etcdserverpb.KV",grpc_type="unary",le="0.5"} 1
grpc_client_handling_seconds_bucket{db="http://127.0.0.1:2479",grpc_method="Range",grpc_service="etcdserverpb.KV",grpc_type="unary",le="1"} 1
grpc_client_handling_seconds_bucket{db="http://127.0.0.1:2479",grpc_method="Range",grpc_service="etcdserverpb.KV",grpc_type="unary",le="2.5"} 1
grpc_client_handling_seconds_bucket{db="http://127.0.0.1:2479",grpc_method="Range",grpc_service="etcdserverpb.KV",grpc_type="unary",le="5"} 1
grpc_client_handling_seconds_bucket{db="http://127.0.0.1:2479",grpc_method="Range",grpc_service="etcdserverpb.KV",grpc_type="unary",le="10"} 1
grpc_client_handling_seconds_bucket{db="http://127.0.0.1:2479",grpc_method="Range",grpc_service="etcdserverpb.KV",grpc_type="unary",le="+Inf"} 1
grpc_client_handling_seconds_sum{db="http://127.0.0.1:2479",grpc_method="Range",grpc_service="etcdserverpb.KV",grpc_type="unary"} 0.001252046
grpc_client_handling_seconds_count{db="http://127.0.0.1:2479",grpc_method="Range",grpc_service="etcdserverpb.KV",grpc_type="unary"} 1
# HELP grpc_client_msg_sent_total Total number of gRPC stream messages sent by the client.
# TYPE grpc_client_msg_sent_total counter
grpc_client_msg_sent_total{db="http://127.0.0.1:2479",grpc_method="Range",grpc_service="etcdserverpb.KV",grpc_type="unary"} 1
# HELP grpc_client_started_total Total number of RPCs started on the client.
# TYPE grpc_client_started_total counter
grpc_client_started_total{db="http://127.0.0.1:2479",grpc_method="Range",grpc_service="etcdserverpb.KV",grpc_type="unary"} 1
{{< /code >}}
