---
title: "Configuration Options"
layout: "simple"
---

 - `--listen-address`: Listen address of service. Default: `unix://kine.sock`
 - `--endpoint`: Defines the default fallback database used to store any data not explicitly routed by the topology configuration
 - `--ca-file`: Path to the Certificate Authority (CA) file used to establish trust for the default database connection
 - `--cert-file`: Path to the client certificate file used to authenticate with the default database during TLS handshake
 - `--key-file`: Path to the private key file used in conjunction with the client certificate to authenticate the default database connection
 - `--skip-verify`: Controls whether the TLS client performs server certificate verification
 - `--log-format`: Log format to use. Options are 'plain' or 'json'. Default 'plain'
 - `--metrics-bind-address`: The address the metric endpoint binds to. Default `:8080`, set 0 to disable metrics serving
 - `--server-cert-file`: Path to the TLS certificate used by the middleware to secure incoming client connections
 - `--server-key-file`: Path to the private key used by the middleware to establish secure TLS communication with etcd-compatible clients
 - `--datastore-max-idle-connections`: Maximum number of idle connections retained by default datastore. If value = 0, the system default will be used. If value < 0, idle connections will not be reused
 - `--datastore-max-open-connections`: Maximum number of open connections used by default datastore. If value <= 0, then there is no limit
 - `--datastore-connection-max-lifetime`: Maximum amount of time a default database connection may be reused. If value <= 0, then there is no limit
 - `--datastore-connection-max-idle-lifetime`: Maximum amount of time a default database idle connection may be reused. If value <= 0, then there is no limit
 - `--slow-sql-threshold`: The duration which SQL executed longer than will be logged. Default 1s, set <= 0 to disable slow SQL log
 - `--slow-sql-warning-threshold`: The duration which SQL executed longer than will be logged at level warn. Default 5s
 - `--metrics-enable-profiling`: Enables Go performance profiling via net/http/pprof on the metrics bind address. Default is false
 - `--watch-progress-notify-interval`: Interval between periodic watch progress notifications. Default is 5s
 - `--emulated-etcd-version`: The emulated etcd version to return on a call to the status endpoint. Defaults to 3.5.13, in order to indicate support for watch progress notifications
 - `--compact-interval`: Interval between automatic compaction. Default is 5m
 - `--compact-interval-jitter`: Percentage of jitter to apply to interval durations. A value of 10 will apply a jitter of +/-10 percent to the interval duration. It cannot be negative, and must be less than 100. Default is 0
 - `--compact-timeout`: Timeout for automatic compaction. Default is 5s
 - `--compact-min-retain`: Minimum number of revisions to retain when compacting. Default is 1000
 - `--compact-batch-size`: Number of revisions to compact in a single batch. Default is 1000
 - `--poll-batch-size`: Number of revisions to poll in a single batch. Default is 500
 - `--debug`: Enable debug logging

Environment variables:
 - `LICENSE_KEY_FILE`: File path for the license file
 - `TOPOLOGY_CONFIG`: File path for the topology configuration, which is continuously scanned for modifications, supported formats are:
  - `file://<file-path>`
  - `http(s)://<file-url>` - Polling interval is 1 minute
  - `secret://<namespace>/<name>` - Ensure this secret is stored at main database, and strongly suggested to add finalizer to prevent deletion.  Files are consumed in name order
    - `TOPOLOGY_CONFIG_TLS_DIR`: Directory path for storing TLS files provided by topology secret, Default `./db/tls`
 - `LIST_MAX_ITEMS`: Max items for list operations. Default 10000
 - `DISABLE_STORAGE_LEVEL_FILTERING`: Disable storage level filtering of the main database, Default: `false`
 - `ENABLE_TELEMETRY_PUSH`: Enables pushing anonym usage telemetry to HariKube central monitoring site `https://monitoring.harikube.info`
 - `CUSTOM_RESOURCE_DEFINITION_METADATA_FILE`: Locatin to store Custom Resource Definition metadata. Defaut: `./db/crds.json`
 - `DISABLE_GARBAGE_COLLECTION`: Disable storage level garbage-collection. Objects stored at SQL databases and labeled with `skip-controller-manager-metadata-caching` are managed. Default `false`
 - `GARBAGE_COLLECTION_DELETE_LOG_DIR`: Directory path for storing delete logs of storage side GC, Default `./db/delete_log`
 - `GARBAGE_COLLECTION_DELETE_LOG_EXIT_ON_ERROR`: What to do when delete log write fails. Setting to `false` should result orphan resources. Default `true`

> ⚠️ Garbage-collection only happens within a single middleware unit. If your system has multiple instances (hyerarchical topology), you must make sure that the relational data managed on the same specific instance. Otherwise, the records on other instances become orphan.
