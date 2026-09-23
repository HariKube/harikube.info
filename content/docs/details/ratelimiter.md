---
title: "Ratelimiter"
layout: "simple"
---

The built-in ratelimiter provides an adaptive rate limiter designed to protect database backends from overload. It dynamically scales allowed throughput (requests per second) based on observed query execution latencies using an Exponentially Weighted Moving Average (EWMA).

When latencies are low, the limiter allows operations up to a configured maximum rate. If observed latencies rise due to backend stress, the limiter dynamically throttles incoming traffic down to a minimum rate to allow the database to recover.

### How to Disable the Rate Limiter

To completely disable rate limiting and allow all operations without latency tracking, set max open connections to 0 in the Config.