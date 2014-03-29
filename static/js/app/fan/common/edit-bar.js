define(function(require, exports, module) {
	var BarView = Backbone.View.extend({
		tagName: "div",
		className: "fan_manager_edit_bar",
		destroy : function() {
			this.$el.remove();
			this.hasInstance = false;
		},
		create : function($target, config) {
			if ( !(this.$target = $target) ) {
				return;
			}
			this.hasInstance = true;
			this.config = _.extend({
				offset: "",
				className: "",
				$tmpl: ""
			}, config);
			this.$el.addClass(this.config.className);
			this.config.$tmpl.appendTo(this.$el);
			this.$el.appendTo($("body"));
			this.updatePosition();
		},
		updatePosition : function(offset) {
			this.hasInstance && this.$el.css(offset || this.config.offset || this.$target.offset());
		}
	});

	var barView = new BarView;

	module.exports = {
		create: function($target, config) {
			barView.create($target, config);
		},
		destroy: function() {
			barView.destroy();
		},
		update: function(offset) {
			barView.updatePosition(offset);
		},
		isRunning: function() {
			return barView.hasInstance;
		}
	};
});