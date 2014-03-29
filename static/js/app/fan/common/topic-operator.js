define(function(require, exports, module) {
	var ajax = require('ajax');
	var postDialog = require("app/fan/common/topic-post-dialog");

	var Operator = Backbone.Model.extend({
		editTopic : function(topic, complete) {
			var config = _.extend({dialogTitle : "编辑话题"}, topic);
			postDialog.show(config, {
				url : "/update-fan-topic",
				type: "POST",
				success : function() {
					complete && complete();
				}
			});
		},
		deleteTopic : function(ids, complete) {
			this.operateTopic(ids, "/fanhome/deleted-fan-topic", "reason=&isSendMessage=false", complete);
		},
		topTopic : function(ids, complete) {
			this.operateTopic(ids, "/fanhome/set-fan-topic-grade", "grade=30", complete);
		},
		lightTopic : function(ids, complete) {
			this.operateTopic(ids, "/fanhome/set-fan-topic-highlighted", "isHighlighted=true", complete);
		},
		marrowTopic : function(ids, complete) {
			this.operateTopic(ids, "/fanhome/set-fan-topic-fined", "isFined=true", complete);
		},
		upTopic : function(ids, complete) {
			this.operateTopic(ids, "/fanhome/set-fan-topic-grade", "grade=20", complete);
		},
		downTopic : function(ids, complete) {
			this.operateTopic(ids, "/fanhome/set-fan-topic-grade", "grade=0", complete);
		},
		cancelTop : function(ids, complete) {
			this.operateTopic(ids, "/fanhome/set-fan-topic-grade", "grade=10", complete);
		},
		cancelLight : function(ids, complete) {
			this.operateTopic(ids, "/fanhome/set-fan-topic-highlighted", "isHighlighted=false", complete);
		},
		cancelMarrow : function(ids, complete) {
			this.operateTopic(ids, "/fanhome/set-fan-topic-fined", "isFined=false", complete);
		},
		cancelUp : function(ids, complete) {
			this.operateTopic(ids, "/fanhome/set-fan-topic-grade", "grade=10", complete);
		},
		cancelDown : function(ids, complete) {
			this.operateTopic(ids, "/fanhome/set-fan-topic-grade", "grade=10", complete);
		},
		operateTopic : function(ids, url, param, complete) {
			ajax.ajax({
				url : url,
				type: "POST",
				data : "topicId=" + ids + "&" + param,
				success : function(result) {
					var result = result || {};
					complete && complete(result);
				}
			});
		}
	});

	module.exports = new Operator;
});