---
title: "Ratelimiter"
layout: "simple"
---

The built-in ratelimiter provides an adaptive rate limiter designed to protect database backends from overload. It dynamically scales allowed throughput (requests per second) based on observed query execution latencies using an Exponentially Weighted Moving Average (EWMA).

When latencies are low, the limiter allows operations up to a configured maximum rate. If observed latencies rise due to backend stress, the limiter dynamically throttles incoming traffic down to a minimum rate to allow the database to recover.

Examples of automatic rate limit calculations based on database connection max open config.

| Pool Configuration | Max Open | Latency | Several Latency | Full Rate | Severe Rate | Burst |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Default / Unspecified** | 0 | - | - | - | - | - |
| **Small connection pool** | 10 | 6.3s | 19s | 100 | 1 | 200 |
| **Medium connection pool** | 100 | 2.6s | 8s | 200 | 3 | 400 |
| **Large connection pool** | 200 | 1.5s | 4.5s | 400 | 4 | 800 |
| **Very large connection pool** | 1000 | 100ms | 300ms | 2000 | 5 | 4000 |
