---
title: "Commonly Exposed Metrics"
layout: "simple"
---

{{< code text >}}# HELP harikube_mapper_cache_hits_total Total number of cache hits
# TYPE harikube_mapper_cache_hits_total counter
harikube_mapper_cache_hits_total{cache_name="local-mapper-cache"} 2876
# HELP harikube_mapper_cache_misses_total Total number of cache misses
# TYPE harikube_mapper_cache_misses_total counter
harikube_mapper_cache_misses_total{cache_name="local-mapper-cache"} 62
{{< /code >}}
