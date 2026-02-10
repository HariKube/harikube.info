---
title: "Configuring BBolt Metadata Store"
layout: "simple"
---

The BBolt Mapper provides a lightweight, embedded solution for storing revision metadata with minimal setup and no external dependencies. Under the hood it leverages BBolt’s memory‑mapped, ACID‑compliant key/value store, while keeping an in‑memory cache of the latest revision data and batching writes to the BBolt’s file asynchronously. This means the mapper always reflects the current logical state in your application, even if the on‑disk BBolt’s file may briefly lag behind during high‑throughput writes.

- `REVISION_MAPPER=bbolt`: Type of metdata store - Optional
- `REVISION_MAPPER_BBOLT_SYNC_PERIOD`: Database sync to filesystem period. Default: `0s` (instant)
- `REVISION_MAPPER_BBOLT_BATCH_SIZE`: Size of batch write operation. Default `8`
- `REVISION_MAPPER_BBOLT_CONCURRENT_WRITES`: Number of concurrent connections to the database. Default `8`
- `REVISION_MAPPER_BBOLT_O2G_PATHS`: Comma separated list of paths to the original-to-generated revision database directories. Default `./db`
- `REVISION_MAPPER_BBOLT_G2O_PATHS`: Comma separated list of paths to the generated-to-original revision database directories. Default `./db`
- `REVISION_MAPPER_BBOLT_LEASE_PATH`: Path to the lease database directory. Default `./db`

> Changing of database directories doesn't supported at the moment.

{{< feature
    title="Total execution time: 30s"
    description=""
    badge="5000 records creation on 60 threads"
    badgeColor="#16a34a"
    image="/images/docs/bbolt_gcp_compute_10_5000_1745320783.json_http_req_duration_chart.png"
    buttonText=""
    buttonLink=""
    features="Average response time: ~10 ms, Maximum response time: ~75 ms"
    imagePosition="left"
>}}