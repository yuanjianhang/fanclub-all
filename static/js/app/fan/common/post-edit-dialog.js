define(function(require, exports, module) {

	var Dialog = require("dialog"),
		AjaxForm = require("ajaxform"),
		ajax = require("ajax"),
		strUtil = require('modules/util/str'),
		alertify = require('alertify'),
		user = require('user'),
		ueditor = require("modules/yinyuetai/ueditor/ueditor"),
		juicer = require('juicer');

	var dialogTempl = '' +
	'<div id="common_topic_post_dialog">' +
	'<form action="/update-fan-topic-reply" method="post">' +
		'<input type="hidden" name="fanId" value="{{fid}}"/>' +
		'<input type="hidden" name="fanTopicReplyId" value="{{id}}"/>' +
		'<input type="hidden" name="topicId" value="{{id}}"/>' +

		'<div class="popup_release">' +
			'<div class="editor">' +
				'<textarea name="replContent"></textarea>' +
			'</div>' +
			'<div class="toolkit">' +
				'<input type="submit" value="确 定" class="submit fr ico_ct_release">' +

				'<p class="sharemyhome">' +
				'<label class="c_6"><input type="checkbox" {@if isSynI == \"on\"} checked="checked" {@/if} class="fan_checkbox" name="isSynI">同时发布到个人日志</label>' +
				'</p>' +
			'</div>' +
		'</div>' +
	'</form>' +
	'</div>';

	var PostDialog = Backbone.View.extend({
		show: function(config, settings) {
			this.config = config;
			this.settings = settings;
			this.setElements();
			this.createComponents();
			this.processConfig();
			this.processFormUrl();
		},
		setElements: function() {
			this.elems = {
				form: this.$("form")
			};
		},
		createComponents: function() {
			this.createEditor();
			this.createAjaxForm();
		},
		createEditor: function() {
			var editorId = 'myEditor' + new Date().getTime();
			this.$('[name=replContent]').attr('id', editorId);
			this.elems.editor = ueditor.create(editorId, this.editorConfig);
		},
		editorConfig: {
			initialContent: "",
			initialFrameHeight : 165,
			zIndex: 9999
		},
		createAjaxForm: function() {
			var self = this;
			new AjaxForm(this.elems.form, {
				onRequest : function() {
					if ( !self.validateForm() ) {
						return false;
					}
					alertify.loading('正在保存，请稍候……');
					return true;
				},
				onComplete : function(result) {
					self.processServerResult(result);
				}
			});
		},
		validateForm: function() {
			if ( this.validateEditor() ) {
				return true;
			}
			return false;
		},
		validateEditor: function() {
			var contentLength = strUtil.getLength($.trim(this.elems.editor.getContent()));
			if (contentLength < 20 * 2) {
				alertify.error("抱歉，话题内容不能低于20个汉字！");
				this.elems.editor.focus();
				return false;
			}
			return true;
		},
		processServerResult: function(result) {
			var self = this;
			alertify.hide();
			if (result.error) {
				alertify.error(result.message);
			} else {
				dialog.hide();
				alertify.success(result.message || '您的操作已经成功！', function() {
					self.settings.success && self.settings.success(result);
				});
			}
		},
		processConfig: function() {
			this.config.replContent && this.processEditorContent();
		},
		processEditorContent: function() {
			var self = this;
			this.elems.editor.addListener( 'ready', function() {
				self.elems.editor.execCommand("cleardoc");
				self.elems.editor.execCommand("inserthtml", self.config.replContent);
			});
		},
		processFormUrl: function() {
			this.settings.url && this.elems.form.attr("action", this.settings.url);
		}
	});

	/*
	调用show方法时的参数配置：
	 config : {
		 dialogTitle: "",
		 fid: "",
		 userId: "",
		 topicType: "",
		 content: "<p><img src="http://szdaily.sznews.com/res/1/1/2009-07/02/14/res03_attpic_brief.jpg"/></p>",
		 isSynI: on
	 }
	 */
	var dialog;
	module.exports = {
		show: function(config, settings) {
			var config = _.extend({
				isSynI: "off"
			}, config);
			dialog = new Dialog(juicer(dialogTempl, config), {
				title: config.dialogTitle || "编辑回复",
				width: 640,
				onShow: function() {
					(new PostDialog({el: this})).show(config, settings||{});
				}
			});
		}
	};
});