'use strict';

angular.module('tweetabaseApp')
.controller('AdminCtrl', ['$scope', 'localStorageService', '$http', 'socket', 'admin', function ($scope, localStorageService, $http, socket, admin) {

	$scope.init = function() {
		var lastReads = 0,lastWrites = 0,newReads = 0,newWrites = 0;

		$scope.reads = lastReads;
		$scope.writes = lastWrites;

		// retrieve stats
		statInterval = setInterval(function()	{
			admin.retrieveStats(function(response)	{
        // console.log('/api/retrieveStats response: ' + response.stats);
        if (response && response.status === 'Ok' && response.stats !== undefined)	{

        	var rawStats = response.stats.toString().split(";");

					for (var i = 0; i < rawStats.length; i++)  {
	        	// console.log(rawStats[i]);
	        	if (rawStats[i].indexOf("stat_read_reqs") != -1 && rawStats[i].indexOf("stat_read_reqs_xdr") == -1)	{
	        		newReads = parseInt(rawStats[i].substring(rawStats[i].indexOf("=")+1));
		        	// console.log(newReads);
		        	if (i>0) {
								$scope.reads = newReads - lastReads;
		        	}
							lastReads = newReads;
	        	}
	        	if (rawStats[i].indexOf("stat_write_reqs") != -1 && rawStats[i].indexOf("stat_write_reqs_xdr") == -1)	{
	        		newWrites = parseInt(rawStats[i].substring(rawStats[i].indexOf("=")+1));
		        	// console.log(newWrites);
		        	if (i>0) {
								$scope.writes = newWrites - lastWrites;
		        	}
							lastWrites = newWrites;
	        	}
					}
        }
			});

		}, 1000);
	};

}]);


// statistics	cluster_size=1 admin.js:23
// cluster_key=479ACF8E49D3B2F admin.js:23
// cluster_integrity=true admin.js:23
// objects=104432 admin.js:23
// total-bytes-disk=0 admin.js:23
// used-bytes-disk=0 admin.js:23
// free-pct-disk=0 admin.js:23
// total-bytes-memory=8589934592 admin.js:23
// used-bytes-memory=12506751 admin.js:23
// data-used-bytes-memory=5785952 admin.js:23
// index-used-bytes-memory=6683648 admin.js:23
// sindex-used-bytes-memory=37151 admin.js:23
// free-pct-memory=99 admin.js:23
// stat_read_reqs=34574 admin.js:23
// stat_read_reqs_xdr=0 admin.js:23
// stat_read_success=3098 admin.js:23
// stat_read_errs_notfound=31476 admin.js:23
// stat_read_errs_other=0 admin.js:23
// stat_write_reqs=906771 admin.js:23
// stat_write_reqs_xdr=0 admin.js:23
// stat_write_success=906771 admin.js:23
// stat_write_errs=0 admin.js:23
// stat_xdr_pipe_writes=0 admin.js:23
// stat_xdr_pipe_miss=0 admin.js:23
// stat_delete_success=400088 admin.js:23
// stat_rw_timeout=0 admin.js:23
// udf_read_reqs=0 admin.js:23
// udf_read_success=0 admin.js:23
// udf_read_errs_other=0 admin.js:23
// udf_write_reqs=1 admin.js:23
// udf_write_success=1 admin.js:23
// udf_write_err_others=0 admin.js:23
// udf_delete_reqs=0 admin.js:23
// udf_delete_success=0 admin.js:23
// udf_delete_err_others=0 admin.js:23
// udf_lua_errs=0 admin.js:23
// udf_scan_rec_reqs=0 admin.js:23
// udf_query_rec_reqs=0 admin.js:23
// udf_replica_writes=0 admin.js:23
// stat_proxy_reqs=0 admin.js:23
// stat_proxy_reqs_xdr=0 admin.js:23
// stat_proxy_success=0 admin.js:23
// stat_proxy_errs=0 admin.js:23
// stat_cluster_key_trans_to_proxy_retry=0 admin.js:23
// stat_cluster_key_transaction_reenqueue=0 admin.js:23
// stat_slow_trans_queue_push=0 admin.js:23
// stat_slow_trans_queue_pop=0 admin.js:23
// stat_slow_trans_queue_batch_pop=0 admin.js:23
// stat_cluster_key_regular_processed=0 admin.js:23
// stat_cluster_key_prole_retry=0 admin.js:23
// stat_cluster_key_err_ack_dup_trans_reenqueue=0 admin.js:23
// stat_cluster_key_partition_transaction_queue_count=0 admin.js:23
// stat_cluster_key_err_ack_rw_trans_reenqueue=0 admin.js:23
// stat_expired_objects=400088 admin.js:23
// stat_evicted_objects=0 admin.js:23
// stat_deleted_set_objects=0 admin.js:23
// stat_evicted_set_objects=0 admin.js:23
// stat_evicted_objects_time=0 admin.js:23
// stat_zero_bin_records=0 admin.js:23
// stat_nsup_deletes_not_shipped=400088 admin.js:23
// err_tsvc_requests=0 admin.js:23
// err_out_of_space=0 admin.js:23
// err_duplicate_proxy_request=0 admin.js:23
// err_rw_request_not_found=0 admin.js:23
// err_rw_pending_limit=0 admin.js:23
// err_rw_cant_put_unique=0 admin.js:23
// fabric_msgs_sent=0 admin.js:23
// fabric_msgs_rcvd=0 admin.js:23
// paxos_principal=BB9A20404D10602 admin.js:23
// migrate_msgs_sent=0 admin.js:23
// migrate_msgs_recv=0 admin.js:23
// migrate_progress_send=0 admin.js:23
// migrate_progress_recv=0 admin.js:23
// migrate_num_incoming_accepted=0 admin.js:23
// migrate_num_incoming_refused=0 admin.js:23
// queue=0 admin.js:23
// transactions=8945759 admin.js:23
// reaped_fds=205 admin.js:23
// tscan_initiate=4 admin.js:23
// tscan_pending=0 admin.js:23
// tscan_succeeded=2 admin.js:23
// tscan_aborted=0 admin.js:23
// batch_initiate=0 admin.js:23
// batch_queue=0 admin.js:23
// batch_tree_count=0 admin.js:23
// batch_timeout=0 admin.js:23
// batch_errors=0 admin.js:23
// info_queue=0 admin.js:23
// proxy_initiate=0 admin.js:23
// proxy_action=0 admin.js:23
// proxy_retry=0 admin.js:23
// proxy_retry_q_full=0 admin.js:23
// proxy_unproxy=0 admin.js:23
// proxy_retry_same_dest=0 admin.js:23
// proxy_retry_new_dest=0 admin.js:23
// write_master=906771 admin.js:23
// write_prole=0 admin.js:23
// read_dup_prole=0 admin.js:23
// rw_err_dup_internal=0 admin.js:23
// rw_err_dup_cluster_key=0 admin.js:23
// rw_err_dup_send=0 admin.js:23
// rw_err_write_internal=0 admin.js:23
// rw_err_write_cluster_key=0 admin.js:23
// rw_err_write_send=0 admin.js:23
// rw_err_ack_internal=0 admin.js:23
// rw_err_ack_nomatch=0 admin.js:23
// rw_err_ack_badnode=0 admin.js:23
// client_connections=5 admin.js:23
// waiting_transactions=0 admin.js:23
// tree_count=0 admin.js:23
// record_refs=104432 admin.js:23
// record_locks=0 admin.js:23
// migrate_tx_objs=0 admin.js:23
// migrate_rx_objs=0 admin.js:23
// ongoing_write_reqs=0 admin.js:23
// err_storage_queue_full=0 admin.js:23
// partition_actual=8192 admin.js:23
// partition_replica=0 admin.js:23
// partition_desync=0 admin.js:23
// partition_absent=0 admin.js:23
// partition_object_count=104432 admin.js:23
// partition_ref_count=8192 admin.js:23
// system_free_mem_pct=88 admin.js:23
// system_sindex_data_memory_used=37151 admin.js:23
// sindex_gc_locktimedout=0 admin.js:23
// sindex_ucgarbage_found=0 admin.js:23
// system_swapping=false admin.js:23
// err_replica_null_node=0 admin.js:23
// err_replica_non_null_node=0 admin.js:23
// err_sync_copy_null_node=0 admin.js:23
// err_sync_copy_null_master=0 admin.js:23
// storage_defrag_corrupt_record=0 admin.js:23
// storage_defrag_wait=0 admin.js:23
// err_write_fail_prole_unknown=0 admin.js:23
// err_write_fail_prole_generation=0 admin.js:23
// err_write_fail_unknown=0 admin.js:23
// err_write_fail_key_exists=0 admin.js:23
// err_write_fail_generation=0 admin.js:23
// err_write_fail_generation_xdr=0 admin.js:23
// err_write_fail_bin_exists=0 admin.js:23
// err_write_fail_parameter=0 admin.js:23
// err_write_fail_incompatible_type=0 admin.js:23
// err_write_fail_noxdr=0 admin.js:23
// err_write_fail_prole_delete=0 admin.js:23
// err_write_fail_not_found=0 admin.js:23
// err_write_fail_key_mismatch=0 admin.js:23
// stat_duplicate_operation=0 admin.js:23
// uptime=8375667 admin.js:23
// stat_write_errs_notfound=0 admin.js:23
// stat_write_errs_other=0 admin.js:23
// heartbeat_received_self=0 admin.js:23
// heartbeat_received_foreign=0 admin.js:23
// query_reqs=4 admin.js:23
// query_success=4 admin.js:23
// query_fail=0 admin.js:23
// query_abort=0 admin.js:23
// query_avg_rec_count=0 admin.js:23
// query_short_queue_full=0 admin.js:23
// query_long_queue_full=0 admin.js:23
// query_short_running=4 admin.js:23
// query_long_running=0 admin.js:23
// query_tracked=0 admin.js:23
// query_agg=1 admin.js:23
// query_agg_success=1 admin.js:23
// query_agg_err=0 admin.js:23
// query_agg_abort=0 admin.js:23
// query_agg_avg_rec_count=1 admin.js:23
// query_lookups=3 admin.js:23
// query_lookup_success=3 admin.js:23
// query_lookup_err=0 admin.js:23
// query_lookup_abort=0 admin.js:23
// query_lookup_avg_rec_count=0
