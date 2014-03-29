define(function(require, exports, module) {

	var user = require("user");

	var topicIssueDialog = require("app/fan/common/topic-post-dialog");

	var TopicIssueButton = Backbone.View.extend({
		initialize: function(defaults, config) {
			this.config = config || {};
			this.elems = {
				actionButton: this.$(".J_publish_action"),
				subMenu: this.$(".J_publish_sub_menu")
			};
		},
		events: {
			"click .J_publish_action": "toggleSubMenu",
			"click .J_sub_publish_action": "issueComing"
		},
		toggleSubMenu: function() {
			this.elems.subMenu.slideToggle(200);
		},
		issueComing: function(e) {
			var self = this;
			this.toggleSubMenu();
			user.login(function() {
				self.showDialog($(e.currentTarget).attr("data-type"));
			});
		},
		showDialog: function(topicType) {
			var self = this;
			topicIssueDialog.show({
				topicType: topicType
			}, {
				success: function(data) {
					self.config.success && self.config.success(data);
				}
			});
		}
	});

	module.exports = TopicIssueButton;
});