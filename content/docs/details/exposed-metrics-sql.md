---
title: "Commonly Exposed Metrics"
layout: "simple"
---

{{< code text >}}# HELP go_sql_idle_connections The number of idle connections.
# TYPE go_sql_idle_connections gauge
go_sql_idle_connections{db_name="harikube"} 2
# HELP go_sql_in_use_connections The number of connections currently in use.
# TYPE go_sql_in_use_connections gauge
go_sql_in_use_connections{db_name="harikube"} 1
# HELP go_sql_max_idle_closed_total The total number of connections closed due to SetMaxIdleConns.
# TYPE go_sql_max_idle_closed_total counter
go_sql_max_idle_closed_total{db_name="harikube"} 0
# HELP go_sql_max_idle_time_closed_total The total number of connections closed due to SetConnMaxIdleTime.
# TYPE go_sql_max_idle_time_closed_total counter
go_sql_max_idle_time_closed_total{db_name="harikube"} 0
# HELP go_sql_max_lifetime_closed_total The total number of connections closed due to SetConnMaxLifetime.
# TYPE go_sql_max_lifetime_closed_total counter
go_sql_max_lifetime_closed_total{db_name="harikube"} 0
# HELP go_sql_max_open_connections Maximum number of open connections to the database.
# TYPE go_sql_max_open_connections gauge
go_sql_max_open_connections{db_name="harikube"} 90
# HELP go_sql_open_connections The number of established connections both in use and idle.
# TYPE go_sql_open_connections gauge
go_sql_open_connections{db_name="harikube"} 3
# HELP go_sql_wait_count_total The total number of connections waited for.
# TYPE go_sql_wait_count_total counter
go_sql_wait_count_total{db_name="harikube"} 0
# HELP go_sql_wait_duration_seconds_total The total time blocked waiting for a new connection.
# TYPE go_sql_wait_duration_seconds_total counter
go_sql_wait_duration_seconds_total{db_name="harikube"} 0
# HELP go_threads Number of OS threads created.
# TYPE go_threads gauge
go_threads 14
# HELP harikube_sql_time_seconds Length of time per SQL operation
# TYPE harikube_sql_time_seconds histogram
harikube_sql_time_seconds_bucket{error_code="",le="0.005"} 38
harikube_sql_time_seconds_bucket{error_code="",le="0.01"} 38
harikube_sql_time_seconds_bucket{error_code="",le="0.025"} 38
harikube_sql_time_seconds_bucket{error_code="",le="0.05"} 38
harikube_sql_time_seconds_bucket{error_code="",le="0.1"} 38
harikube_sql_time_seconds_bucket{error_code="",le="0.15"} 38
harikube_sql_time_seconds_bucket{error_code="",le="0.2"} 38
harikube_sql_time_seconds_bucket{error_code="",le="0.25"} 38
harikube_sql_time_seconds_bucket{error_code="",le="0.3"} 38
harikube_sql_time_seconds_bucket{error_code="",le="0.35"} 38
harikube_sql_time_seconds_bucket{error_code="",le="0.4"} 38
harikube_sql_time_seconds_bucket{error_code="",le="0.45"} 38
harikube_sql_time_seconds_bucket{error_code="",le="0.5"} 38
harikube_sql_time_seconds_bucket{error_code="",le="0.6"} 38
harikube_sql_time_seconds_bucket{error_code="",le="0.7"} 38
harikube_sql_time_seconds_bucket{error_code="",le="0.8"} 38
harikube_sql_time_seconds_bucket{error_code="",le="0.9"} 38
harikube_sql_time_seconds_bucket{error_code="",le="1"} 38
harikube_sql_time_seconds_bucket{error_code="",le="1.5"} 38
harikube_sql_time_seconds_bucket{error_code="",le="2"} 38
harikube_sql_time_seconds_bucket{error_code="",le="2.5"} 38
harikube_sql_time_seconds_bucket{error_code="",le="3"} 38
harikube_sql_time_seconds_bucket{error_code="",le="3.5"} 38
harikube_sql_time_seconds_bucket{error_code="",le="4"} 38
harikube_sql_time_seconds_bucket{error_code="",le="4.5"} 38
harikube_sql_time_seconds_bucket{error_code="",le="5"} 38
harikube_sql_time_seconds_bucket{error_code="",le="6"} 38
harikube_sql_time_seconds_bucket{error_code="",le="7"} 38
harikube_sql_time_seconds_bucket{error_code="",le="8"} 38
harikube_sql_time_seconds_bucket{error_code="",le="9"} 38
harikube_sql_time_seconds_bucket{error_code="",le="10"} 38
harikube_sql_time_seconds_bucket{error_code="",le="15"} 38
harikube_sql_time_seconds_bucket{error_code="",le="20"} 38
harikube_sql_time_seconds_bucket{error_code="",le="25"} 38
harikube_sql_time_seconds_bucket{error_code="",le="30"} 38
harikube_sql_time_seconds_bucket{error_code="",le="+Inf"} 38
harikube_sql_time_seconds_sum{error_code=""} 0.005915099
harikube_sql_time_seconds_count{error_code=""} 38
harikube_sql_time_seconds_bucket{error_code="SQL logic error",le="0.005"} 1
harikube_sql_time_seconds_bucket{error_code="SQL logic error",le="0.01"} 1
harikube_sql_time_seconds_bucket{error_code="SQL logic error",le="0.025"} 1
harikube_sql_time_seconds_bucket{error_code="SQL logic error",le="0.05"} 1
harikube_sql_time_seconds_bucket{error_code="SQL logic error",le="0.1"} 1
harikube_sql_time_seconds_bucket{error_code="SQL logic error",le="0.15"} 1
harikube_sql_time_seconds_bucket{error_code="SQL logic error",le="0.2"} 1
harikube_sql_time_seconds_bucket{error_code="SQL logic error",le="0.25"} 1
harikube_sql_time_seconds_bucket{error_code="SQL logic error",le="0.3"} 1
harikube_sql_time_seconds_bucket{error_code="SQL logic error",le="0.35"} 1
harikube_sql_time_seconds_bucket{error_code="SQL logic error",le="0.4"} 1
harikube_sql_time_seconds_bucket{error_code="SQL logic error",le="0.45"} 1
harikube_sql_time_seconds_bucket{error_code="SQL logic error",le="0.5"} 1
harikube_sql_time_seconds_bucket{error_code="SQL logic error",le="0.6"} 1
harikube_sql_time_seconds_bucket{error_code="SQL logic error",le="0.7"} 1
harikube_sql_time_seconds_bucket{error_code="SQL logic error",le="0.8"} 1
harikube_sql_time_seconds_bucket{error_code="SQL logic error",le="0.9"} 1
harikube_sql_time_seconds_bucket{error_code="SQL logic error",le="1"} 1
harikube_sql_time_seconds_bucket{error_code="SQL logic error",le="1.5"} 1
harikube_sql_time_seconds_bucket{error_code="SQL logic error",le="2"} 1
harikube_sql_time_seconds_bucket{error_code="SQL logic error",le="2.5"} 1
harikube_sql_time_seconds_bucket{error_code="SQL logic error",le="3"} 1
harikube_sql_time_seconds_bucket{error_code="SQL logic error",le="3.5"} 1
harikube_sql_time_seconds_bucket{error_code="SQL logic error",le="4"} 1
harikube_sql_time_seconds_bucket{error_code="SQL logic error",le="4.5"} 1
harikube_sql_time_seconds_bucket{error_code="SQL logic error",le="5"} 1
harikube_sql_time_seconds_bucket{error_code="SQL logic error",le="6"} 1
harikube_sql_time_seconds_bucket{error_code="SQL logic error",le="7"} 1
harikube_sql_time_seconds_bucket{error_code="SQL logic error",le="8"} 1
harikube_sql_time_seconds_bucket{error_code="SQL logic error",le="9"} 1
harikube_sql_time_seconds_bucket{error_code="SQL logic error",le="10"} 1
harikube_sql_time_seconds_bucket{error_code="SQL logic error",le="15"} 1
harikube_sql_time_seconds_bucket{error_code="SQL logic error",le="20"} 1
harikube_sql_time_seconds_bucket{error_code="SQL logic error",le="25"} 1
harikube_sql_time_seconds_bucket{error_code="SQL logic error",le="30"} 1
harikube_sql_time_seconds_bucket{error_code="SQL logic error",le="+Inf"} 1
harikube_sql_time_seconds_sum{error_code="SQL logic error"} 2.3106e-05
harikube_sql_time_seconds_count{error_code="SQL logic error"} 1
# HELP harikube_sql_total Total number of SQL operations
# TYPE harikube_sql_total counter
harikube_sql_total{error_code=""} 38
harikube_sql_total{error_code="SQL logic error"} 1
{{< /code >}}

> 📘 These metrics are supported across all HariKube-compatible SQL backends (MySQL, PostgreSQL, SQLite).