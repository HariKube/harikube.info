---
title: "Configuring SQLite Metadata Store"
layout: "simple"
---

The SQLite Mapper provides a lightweight, embedded solution for storing revision metadata with minimal setup and no external dependencies. The SQLite Mapper maintains an in-memory cache of the latest revision data and writes to the SQLite database asynchronously. This means the mapper is always aware of the current logical state, but the on-disk database may temporarily lag behind.

- `REVISION_MAPPER=sqlite`: Type of metdata store
- `REVISION_MAPPER_SQLITE_O2G_PATHS`: Comma separated list of paths to the original-to-generated revision database directories. Default `./db`
- `REVISION_MAPPER_SQLITE_G2O_PATHS`: Comma separated list of paths to the generated-to-original revision database directories. Default `./db`
- `REVISION_MAPPER_SQLITE_LEASE_PATH`: Path to the lease database directory. Default `./db`
- `REVISION_MAPPER_SQLITE_SYNCHRONOUS`: Write mode of the database [`OFF`, `NORMAL`]. Default `OFF`
- `REVISION_MAPPER_SQLITE_CONN_LIFETIME`: Connection life time in seconds. Default 60
- `REVISION_MAPPER_SQLITE_CONCURRENT_WRITES`: Number of concurrent connections to the database. Default `50`

> Changing of database directories doesn't supported at the moment.

{{< feature
    title="Total execution time: 32s"
    description=""
    badge="5000 records creation on 60 threads"
    badgeColor="#2563eb"
    image="/images/docs/sqlite_gcp_compute_10_5000_1745242441.json_http_req_duration_chart.png"
    buttonText=""
    buttonLink=""
    features="Average response time: ~11 ms, Maximum response time: ~59 ms"
    imagePosition="left"
>}}