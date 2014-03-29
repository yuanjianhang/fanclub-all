define(function(require, exports, module) {
	var usercard = require('modules/yinyuetai/user/usercard'),
			fancard = require('modules/yinyuetai/fan/fancard'),
			Dialog = require("dialog"),
			AjaxForm = require("ajaxform"),
			strUtil = require('modules/util/str'),
			alertify = require('alertify'),
			user = require('user'),
			follow = require("modules/yinyuetai/user/follow"),
			letter = require("modules/yinyuetai/user/letter"),
			guangbo = require("modules/yinyuetai/user/guangbo"),
			fanRoleModel = require("app/fan/common/fan-role-model");

	var fanImageUploadDialog = require("app/fan/common/upload-image-dialog");

	var NoticeView = Backbone.View.extend({
		events : {
			'click .J_edit_notice' : '_showNoticeDialog'
		},
		template : function(data) {
			return juicer(this.tpl, data || {});
		},
		initialize : function() {
			this.listenToOnce(fanRoleModel, "change:role", function() {
				if (fanRoleModel.get("role") == "manager") {
					this.elems = {
						content : this.$("p.info")
					};
					this.tpl = $('#edit_notice_tpl').html();
					this.model = {
						content : this.elems.content.text()
					};
					this.$(".J_edit_notice").show();
				}
			});
		},
		_showNoticeDialog : function() {
			var self = this;
			this.dialog = new Dialog(this.render(), {
				title : '编辑饭团公告',
				width : 406,
				height : 155,
				isAutoShow : true,
				onShow : function() {
					self._noticeDialogInit(this);
				}
			});
		},
		render : function() {
			return this.template({
				notice : this.model.content
			});
		},
		_noticeDialogInit : function(dialog) {
			var self = this, $form = dialog.find('form'), $notice = $form.find('textarea[name=notice]');
			new AjaxForm($form, {
				onRequest : function() {
					if (self._validateNoticeForm($form, $notice)) {
						self.model.content = $notice.val();
						alertify.loading('正在保存，请稍候……');
						return true;
					}
					return false;
				},
				onComplete : function(result) {
					self._processNoticeResult(result);
				}
			})
		},
		_validateNoticeForm : function($form, $notice) {
			if (!user.isLogined()) {
				user.login(function() {
					$form.submit();
				});
				return false;
			}
			if ($.trim($notice.val()) == '') {
				alertify.error("请输入公告内容哦~");
				$notice.focus();
				return false;
			}
			if (strUtil.getLength($.trim($notice.val())) > 500 * 2) {
				alertify.error("公告内容不能超过500个汉字哦~");
				$notice.focus();
				return false;
			}
			return true;
		},
		_processNoticeResult : function(result) {
			alertify.hide();
			if (result.error) {
				alertify.error(result.message);
			} else {
				alertify.success('操作成功！');
				this.dialog.hide();
				this.elems.content.text(this.model.content);
			}
		}
	});

	var HeadImgView = Backbone.View.extend({
		events : {
			'click .J_edit_avatar' : 'showDialog'
		},
		initialize : function() {
			this.listenToOnce(fanRoleModel, "change:role", function() {
				if (fanRoleModel.get("role") == "manager") {
					this.$(".J_edit_avatar").show();
					this.dialog = fanImageUploadDialog;
				}
			});
		},
		showDialog : function() {
			var self = this;
			this.dialog.show({
				title : "上传饭团头像",
				buttonText : "上传头像",
				imageTip : "支持5M以内的jpg、jpeg、png图片",
				fid : $config.fid,
				imgAreaSelect : true,
				redirectUrl : Y.domains.urlStatic + "/img-gateway",
				cmd : "[{saveOriginal:1, op:save, plan:fanAvatar, srcImg:img, belongId:" + $config.fid + "}]",
				complete : function(result) {
					self.processUploadImg(result || {});
				}
			});
		},
		processUploadImg : function(result) {
			if (!result.error) {
				this.setHeadImgSrc(result.headImg);
			}
		},
		setHeadImgSrc : function(imgUrl) {
			this.$(".J_avatar").attr("src", imgUrl);
		}
	});

	var BigHeadImgView = Backbone.View.extend({
		events : {
			'click a' : 'showDialog'
		},
		initialize : function() {
			this.listenToOnce(fanRoleModel, "change:role", function() {
				if (fanRoleModel.get("role") == "manager") {
					this.$el.show();
					this.dialog = fanImageUploadDialog;
				}
			});
		},
		showDialog : function() {
			var self = this;
			this.dialog.show({
				title : "上传饭团背景图",
				buttonText : "上传背景",
				imageTip : "支持5M以内的jpg、jpeg、png图片，<br>请至少上传1600*900以上图片",
				fid : $config.fid,
				redirectUrl : Y.domains.urlStatic + "/fanhome/change-bgimg",
				cmd : '[{"sizes":"1600x900", srcImg:img,"op":"scale", "uniform":1, "zoomUp":0},{saveOriginal:1, op:save, plan:fanAvatar, belongId:' +
						$config.fid + '}]',
				complete : function(result) {
					self.processUploadImg(result || {});
				}
			});
		},
		processUploadImg : function(result) {
			if (!result.error) {
				this.setBigHeadImgSrc(result.bgimg);
			}
		},
		setBigHeadImgSrc : function(imgUrl) {
			$("#wAuto").css("background", '#017AB1 url("' + imgUrl + '") no-repeat center 41px');
		}
	});

	var LetterAndAtView = Backbone.View.extend({
		events : {
			'click .J_letter' : 'letter',
			'click .J_at' : 'at'
		},
		letter : function(e) {
			var $target = $(e.currentTarget),
					userName = $target.data('userName'),
					userId = $target.data('userId');
			letter({'userName' : userName, 'userId' : userId});
		},
		at : function(e) {
			var $target = $(e.currentTarget),
					userName = $target.data('userName'),
					userId = $target.data('userId');
			guangbo({'userName' : userName, 'userId' : userId});
		}
	});

	function init(config) {
		$config.fid = config.fid;

		new NoticeView({
			el : $("#fan_ann")
		});

		new HeadImgView({
			el : $("#sd_fan_user")
		});

		new BigHeadImgView({
			el : $("#fan_bigHeadImg")
		});

		new LetterAndAtView({el : $('#wAuto')});
		follow.bind();

		fanRoleModel.fetch();
	}

	module.exports = {
		init : init
	};
});