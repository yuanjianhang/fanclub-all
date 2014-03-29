define(function(require, exports, module) {
	var ajax = require('ajax');

	var Category = Backbone.Model.extend();
	var Categories = Backbone.Collection.extend({
		model: Category,
		currentId: 0,
		url: "/ajax/topic/get-categories",
		fetch: function() {
			var self = this;
			ajax.ajax({
				url: this.url,
				data: "fid="+$config.fid,
				success: function(result) {
					self.processServerData(result);
				}
			});
		},
		processServerData: function(result) {
			var result = result || "[]", cates = $.parseJSON(result), defaultCate = {
				categoryName: "全部",
				id: 0
			};
			cates.unshift(defaultCate);
			this.reset(cates);
		}
	});

	/*
	 调用fetch的传入fid参数。
	 */
	module.exports = Categories;
});