define(function(require, exports, module) {
	var ajax = require('ajax');

	var FanModel = Backbone.Model.extend({
		fetch : function() {
			var self = this;
			ajax.getJSON(Y.domains.fanSite + '/check-join-fan', {'artistId' : $config.fid}, function(result) {
				if (!result.error) {
					self.setRole(result);
				}
			})
		},
		setRole : function(result) {
			if (result.isFanManager || result.isCManager) {
				this.set("role", "manager");
				return;
			}
			if (result.isFanUser) {
				this.set("role", "member");
			}
		}
	});

	var fanModel = new FanModel;
	/*
	 initialization的时候需要传入fid
	 */
	module.exports = fanModel;
});