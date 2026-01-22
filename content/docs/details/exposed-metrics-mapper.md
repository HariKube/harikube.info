---
title: "Commonly Exposed Metrics"
layout: "simple"
---

{{< code text >}}# HELP kine_mapper_cache_hits_total Total number of cache hits
# TYPE kine_mapper_cache_hits_total counter
kine_mapper_cache_hits_total{cache_name="local-mapper-cache"} 2876
# HELP kine_mapper_cache_misses_total Total number of cache misses
# TYPE kine_mapper_cache_misses_total counter
kine_mapper_cache_misses_total{cache_name="local-mapper-cache"} 62
{{< /code >}}
