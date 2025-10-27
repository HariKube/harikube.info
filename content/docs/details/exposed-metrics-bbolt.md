---
title: "Commonly Exposed Metrics"
layout: "simple"
---

{{< code text >}}# TYPE harikube_mapper_bbolt_free_alloc gauge
harikube_mapper_bbolt_free_alloc{db="bolt://db/gen_to_orig.db"} 8192
harikube_mapper_bbolt_free_alloc{db="bolt://db/lease.db"} 8192
harikube_mapper_bbolt_free_alloc{db="bolt://db/orig_to_gen.db"} 8192
# HELP harikube_mapper_bbolt_free_page_number Number of free pages in the bbolt database
# TYPE harikube_mapper_bbolt_free_page_number gauge
harikube_mapper_bbolt_free_page_number{db="bolt://db/gen_to_orig.db"} 0
harikube_mapper_bbolt_free_page_number{db="bolt://db/lease.db"} 0
harikube_mapper_bbolt_free_page_number{db="bolt://db/orig_to_gen.db"} 1
# HELP harikube_mapper_bbolt_pending_page_number Number of pending pages in the bbolt database
# TYPE harikube_mapper_bbolt_pending_page_number gauge
harikube_mapper_bbolt_pending_page_number{db="bolt://db/gen_to_orig.db"} 2
harikube_mapper_bbolt_pending_page_number{db="bolt://db/lease.db"} 2
harikube_mapper_bbolt_pending_page_number{db="bolt://db/orig_to_gen.db"} 1
# HELP harikube_mapper_bbolt_transaction_cursor_count Number of cursors in the bbolt database transaction
# TYPE harikube_mapper_bbolt_transaction_cursor_count gauge
harikube_mapper_bbolt_transaction_cursor_count{db="bolt://db/gen_to_orig.db"} 0
harikube_mapper_bbolt_transaction_cursor_count{db="bolt://db/lease.db"} 0
harikube_mapper_bbolt_transaction_cursor_count{db="bolt://db/orig_to_gen.db"} 0
# HELP harikube_mapper_bbolt_transaction_node_count Number of nodes in the bbolt database transaction
# TYPE harikube_mapper_bbolt_transaction_node_count gauge
harikube_mapper_bbolt_transaction_node_count{db="bolt://db/gen_to_orig.db"} 0
harikube_mapper_bbolt_transaction_node_count{db="bolt://db/lease.db"} 0
harikube_mapper_bbolt_transaction_node_count{db="bolt://db/orig_to_gen.db"} 0
# HELP harikube_mapper_bbolt_transaction_node_deref Number of dereferenced nodes in the bbolt database transaction
# TYPE harikube_mapper_bbolt_transaction_node_deref gauge
harikube_mapper_bbolt_transaction_node_deref{db="bolt://db/gen_to_orig.db"} 0
harikube_mapper_bbolt_transaction_node_deref{db="bolt://db/lease.db"} 0
harikube_mapper_bbolt_transaction_node_deref{db="bolt://db/orig_to_gen.db"} 0
# HELP harikube_mapper_bbolt_transaction_number Number of open transactions in the bbolt database
# TYPE harikube_mapper_bbolt_transaction_number gauge
harikube_mapper_bbolt_transaction_number{db="bolt://db/gen_to_orig.db"} 0
harikube_mapper_bbolt_transaction_number{db="bolt://db/lease.db"} 0
harikube_mapper_bbolt_transaction_number{db="bolt://db/orig_to_gen.db"} 0
# HELP harikube_mapper_bbolt_transaction_page_alloc Page allocation in the bbolt database transaction
# TYPE harikube_mapper_bbolt_transaction_page_alloc gauge
harikube_mapper_bbolt_transaction_page_alloc{db="bolt://db/gen_to_orig.db"} 0
harikube_mapper_bbolt_transaction_page_alloc{db="bolt://db/lease.db"} 0
10harikube_mapper_bbolt_transaction_page_alloc{db="bolt://db/orig_to_gen.db"} 0
0 # HELP harikube_mapper_bbolt_transaction_page_count Number of pages in the bbolt database transaction
 1# TYPE harikube_mapper_bbolt_transaction_page_count gauge
53kharikube_mapper_bbolt_transaction_page_count{db="bolt://db/gen_to_orig.db"} 0
  harikube_mapper_bbolt_transaction_page_count{db="bolt://db/lease.db"} 0
  harikube_mapper_bbolt_transaction_page_count{db="bolt://db/orig_to_gen.db"} 0
0 # HELP harikube_mapper_bbolt_transaction_rebalance Number of rebalance operations in the bbolt database transaction
 # TYPE harikube_mapper_bbolt_transaction_rebalance gauge
harikube_mapper_bbolt_transaction_rebalance{db="bolt://db/gen_to_orig.db"} 0
harikube_mapper_bbolt_transaction_rebalance{db="bolt://db/lease.db"} 0
harikube_mapper_bbolt_transaction_rebalance{db="bolt://db/orig_to_gen.db"} 0
# HELP harikube_mapper_bbolt_transaction_rebalance_time Time spent on rebalance operations in the bbolt database transaction
15# TYPE harikube_mapper_bbolt_transaction_rebalance_time gauge
3kharikube_mapper_bbolt_transaction_rebalance_time{db="bolt://db/gen_to_orig.db"} 0
  harikube_mapper_bbolt_transaction_rebalance_time{db="bolt://db/lease.db"} 0
  harikube_mapper_bbolt_transaction_rebalance_time{db="bolt://db/orig_to_gen.db"} 0
0  # HELP harikube_mapper_bbolt_transaction_spill Number of spill operations in the bbolt database transaction
 # TYPE harikube_mapper_bbolt_transaction_spill gauge
  harikube_mapper_bbolt_transaction_spill{db="bolt://db/gen_to_orig.db"} 0
0 harikube_mapper_bbolt_transaction_spill{db="bolt://db/lease.db"} 0
 4harikube_mapper_bbolt_transaction_spill{db="bolt://db/orig_to_gen.db"} 0
# HELP harikube_mapper_bbolt_transaction_spill_timet Time spent on spill operations in the bbolt database transaction
7.# TYPE harikube_mapper_bbolt_transaction_spill_timet gauge
6Mharikube_mapper_bbolt_transaction_spill_timet{db="bolt://db/gen_to_orig.db"} 0
  harikube_mapper_bbolt_transaction_spill_timet{db="bolt://db/lease.db"} 0
  harikube_mapper_bbolt_transaction_spill_timet{db="bolt://db/orig_to_gen.db"} 0
 # HELP harikube_mapper_bbolt_transaction_split Number of split operations in the bbolt database transaction
 0# TYPE harikube_mapper_bbolt_transaction_split gauge
 harikube_mapper_bbolt_transaction_split{db="bolt://db/gen_to_orig.db"} 0
--harikube_mapper_bbolt_transaction_split{db="bolt://db/lease.db"} 0
:-harikube_mapper_bbolt_transaction_split{db="bolt://db/orig_to_gen.db"} 0
-:-# HELP harikube_mapper_bbolt_transaction_write Number of write operations in the bbolt database transaction
- # TYPE harikube_mapper_bbolt_transaction_write gauge
--harikube_mapper_bbolt_transaction_write{db="bolt://db/gen_to_orig.db"} 0
:-harikube_mapper_bbolt_transaction_write{db="bolt://db/lease.db"} 0
-:harikube_mapper_bbolt_transaction_write{db="bolt://db/orig_to_gen.db"} 0
--# HELP harikube_mapper_bbolt_transaction_write_time Time spent on write operations in the bbolt database transaction
 -# TYPE harikube_mapper_bbolt_transaction_write_time gauge
-:harikube_mapper_bbolt_transaction_write_time{db="bolt://db/gen_to_orig.db"} 0
--harikube_mapper_bbolt_transaction_write_time{db="bolt://db/lease.db"} 0
:-harikube_mapper_bbolt_transaction_write_time{db="bolt://db/orig_to_gen.db"} 0
{{< /code >}}
