define(function(require, exports, module) {
	var ajax = require('ajax');

	var Topic = Backbone.Model.extend({
		isNew: function() {
			return true;
		},
		attributes : {
			id : 0
		}
	});

	var Topics = Backbone.Collection.extend({
		model : Topic,
		url : "/ajax/topic/get-list",
		cid : 0,
		page : 0,
		initialize : function(config) {
			this.config = config || {};
		},
		fetch : function(cid, page) {
			var self = this;
			if ( cid != this.cid ) {
				this.isSamePage = false;
			} else {
				if ( typeof page == "undefined" || page == this.page ) {
					this.isSamePage = true;
				} else {
					this.isSamePage = false;
				}
			}
			(typeof cid !== "undefined") && (this.cid = cid);
			(typeof page !== "undefined") && (this.page = page);
			this.trigger("fetchStart");
			ajax.ajax({
				url : this.config.url || this.url,
				data : this.config.data || "fid=" + $config.fid + "&cid=" + this.cid + "&page=" + this.page,
				success : function(result) {
					self.trigger("fetchOver");
					self.processServerData(result);
				}
			});
		},
		processServerData : function(result) {
			var result = result || "{}",
					data = $.parseJSON(result);
			this.data = data;
			this.trigger("dataComing");
			var topics = data.topics || (data.length && data) || [],
				listIndex = 0;
			_.each(topics, function(topic) {
				topic.listIndex = listIndex++;
			});
			if ( this.isSamePage ) {
				this.set(topics);
				return;
			}
			this.reset(topics);
		},
		managed: function() {
			return this.where({isManaging: true});
		}
	});

	/*
	 调用fetch的传入fid参数。
	 */
	module.exports = Topics;
});