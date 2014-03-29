define(function(require, exports, module) {

	var Dialog = require("dialog"),
		AjaxForm = require("ajaxform"),
		ajax = require("ajax"),
		strUtil = require('modules/util/str'),
		alertify = require('alertify'),
		user = require('user'),
		ueditor = require("modules/yinyuetai/ueditor/ueditor"),
		juicer = require('juicer');

	var TopicCategories = require("app/fan/common/topic-categories-collection");
	var topicCategories;

	var dialogTempl = '' +
	'<div id="common_topic_post_dialog">' +
	'<form action="{@if topicType==\"vote\"}/create-fan-vote-topic{@else}/create-fan-topic{@/if}" method="post">' +
		'<input type="hidden" name="fanId" value="{{fid}}"/>' +
		'<input type="hidden" name="userId" value=""/>' +
		'<input type="hidden" name="topicId" value="{{id}}"/>' +
		'<input type="hidden" name="categoryId" value=""/>' +
		'<input type="hidden" name="fanTopicTypeName" {@if topicType} value="{{topicType}}" {@else} value="topic" {@/if} />' +

		'<div class="popup_release">' +
			'<div class="fl select_area">' +
				'<a class="g_select J_select" href="javascript:;">' +
					'<span class="g_select_l"></span>' +
					'<span class="con">选择话题分类</span><span class="g_select_r"></span>' +
				'</a>' +
				'<ul class="select_area_down J_select_list" style="display: none;">' +
					'<li><span>分类获取中，请稍后...</span></li>' +
				'</ul>' +
			'</div>' +
			'<input class="fl input_text" type="text" value="" name="title" placeholder="请输入帖子标题" value="{{title}}">' +
			'{@if topicType==\"vote\"}' +
				'<div class="popup_addition J_vote_container">' +
					'<div class="fl addition_l">' +
						'<p class="fr">' +
							'<label class="c_9"><input type="checkbox" {@if maxChoiceCount == 1} checked="checked"{@/if} class="fan_checkbox J_single">单选框模式</label>' +
						'</p>' +
						'<span class="c_9">选项：最多可填写20个选项</span>' +

						'<div class="addition_list_box">' +
							'<ul class="addition_list J_vote_list">' +
								'<li>' +
									'<input class="fl input_text" type="text" name="voteItem" value="">' +
									'<a class="ico_close J_del_vote" href="javascript:void(0);">关闭</a>' +
								'</li>' +
								'<li>' +
									'<input class="fl input_text" type="text" name="voteItem" value="">' +
									'<a class="ico_close J_del_vote" href="javascript:void(0);">关闭</a>' +
								'</li>' +
								'<li>' +
									'<input class="fl input_text" type="text" name="voteItem" value="">' +
									'<a class="ico_close J_del_vote" href="javascript:void(0);">关闭</a>' +
								'</li>' +
							'</ul>' +
						'</div>' +
						'<p><a class="special J_add_vote" href="javascript:void(0);">+增加一项</a></p>' +
					'</div>' +
					'<div class="fl addition_r">' +
						'<p class="pd_b10">' +
						'最多可选<input class="input_text fan_checkbox" readonly="true" type="text" name="maxChoiceCount" value="{{maxChoiceCount}}">项</p>' +

						'<p class="pd_b10">计票天数<input class="input_text fan_checkbox" type="text" name="voteDays" value="{{voteDays}}">天</p>' +

						'<p class="pd_b10">' +
							'<label class="c_9"><input type="checkbox" {@if viewResult == \"on\"}checked="checked"{@/if} class="fan_checkbox" name="viewResult">投票后结果可见</label>' +
						'</p>' +

						'<p><label class="c_9"><input type="checkbox" {@if viewVoter == \"on\"}checked="checked"{@/if} class="fan_checkbox" name="viewVoter">公开投票参与人</label>' +
						'</p>' +
					'</div>' +
				'</div>' +

			'{@/if}' +
			'<div class="editor">' +
				'<textarea name="content"></textarea>' +
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

	var VoteView = Backbone.View.extend({
		initialize: function() {
			this.elems = {
				single: this.$(".J_single"),
				list: this.$(".J_vote_list"),
				choiceCount: this.$("input[name=maxChoiceCount]"),
				days: this.$("input[name=voteDays]"),
				result: this.$("input[name=viewResult]"),
				viewVoter: this.$("input[name=viewVoter]")
			};
			this.singlable = !!this.elems.single.prop("checked");
		},
		validate: function() {
			var voteItems = this.elems.list.find("input"), intNumRegexp = /^\d+$/,
					maxVal = $.trim(this.elems.choiceCount.val()), daysVal = $.trim(this.elems.days.val()),
					allVoteValueOk = true;
			_.each(voteItems, function(input, index) {
				var val = $.trim( $(input).val() );
				if ( val == "" ) {
					allVoteValueOk = false;
					return true;
				}
			});

			if ( !allVoteValueOk ) {
				alertify.error('投票选项内容不能为空哦~');
				return false;
			}

			if ( maxVal=="" ) {
				alertify.error('请输入最多可选项目哦~~');
				return false;
			}

			if ( !this.singlable &&  !intNumRegexp.test(maxVal) && maxVal == 0 ) {
				alertify.error('最多可选项目数必须是大于0的整数~~');
				return false;
			}

			if ( !this.singlable &&  maxVal>voteItems.length ) {
				alertify.error('最多可选项目数不能超过投票项总数~');
				return false;
			}

			if ( daysVal=="" ) {
				alertify.error('请输入计票天数哦~~');
				return false;
			}

			if ( !intNumRegexp.test(daysVal) || daysVal == 0 ) {
				alertify.error('计票天数必须是大于0的整数~~');
				return false;
			}

			return true;
		},
		events: {
			"click .J_add_vote": "addVoteItem",
			"click .J_del_vote": "deleteVoteItem",
			"change .J_single": "changeChoiceInputStatus"
		},
		addVoteItem: function(itemValue) {
			var voteItems = this.elems.list.find("li");
			if ( voteItems.length >= 20 ) {
				alertify.error('抱歉，投票选项最多可设置20个哦~');
				return;
			}
			var item = '<li>'+
					'<input class="fl input_text" type="text" name="voteItem" value="">'+
					'<a class="ico_close J_del_vote" href="javascript:void(0);">关闭</a>'+
					'</li>',
				$item = $(item);
			$item.appendTo(this.elems.list);
			this.elems.list.find(".J_del_vote").show();
			if (typeof itemValue !== "object") {            //防止鼠标单击调用默认传入的event对象
				$item.find("input").val(itemValue);
			}
		},
		deleteVoteItem: function(e) {
			$(e.currentTarget).parents("li").remove();
			var voteItems = this.elems.list.find("li");
			if ( voteItems.length == 2 ) {
				this.elems.list.find(".J_del_vote").hide();
			}
		},
		changeChoiceInputStatus: function(e) {
			var target = $(e.currentTarget);
			if ( target.prop("checked") ) {
				this.singlable = true;
				this.elems.choiceCount.val("1").prop("readonly", true);
			} else {
				this.singlable = false;
				this.elems.choiceCount.prop("readonly", false);
			}
		},
		processData: function(data) {
			var items = this.elems.list.find("input");
			if ( data.items ) {
				for(var i=0,len=data.items.length; i<len; i++) {
					if ( items.eq(i).length > 0 ) {
						items.eq(i).val(data.items[i]);
						continue;
					}
					this.addVoteItem(data.items[i]);
				}
			}
		}
	});

	var TopicDialog = Backbone.View.extend({
		show: function(config, settings) {
			this.config = config;
			this.settings = settings;
			topicCategories = new TopicCategories();
			this.setElements();
			this.createComponents();
			this.processConfig();
			this.processFormUrl();
		},
		setElements: function() {
			this.elems = {
				categoriesTitle: this.$(".J_select"),
				categoriesList: this.$(".J_select_list"),
				categoriesInput: this.$("input[name=categoryId]"),
				form: this.$("form"),
				userIdInput: this.$("input[name=userId]"),
				titleInput: this.$("input[name=title]")
			};
		},
		createComponents: function() {
			this.createEditor();
			this.createAjaxForm();

			this.votable = this.config.topicType=="vote" ? true : false;

			if ( this.votable ) {
				this.vote = new VoteView({
					el: this.$(".J_vote_container")
				});
			}
		},
		createEditor: function() {
			var editorId = 'myEditor' + new Date().getTime();
			this.$('[name=content]').attr('id', editorId);
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
			if ( this.validateTopicType() &&
					this.validateTopicTitle() &&
					(this.votable ? this.vote.validate() : true) &&   //不是投票帖子，不用检查投票相关的表单
					this.validateEditor() ) {
				return true;
			}
			return false;
		},
		validateTopicType: function() {
			if ( this.elems.categoriesInput.val() !== "" ) {
				return true;
			}
			alertify.error("请选择话题分类：（");
			return false;
		},
		validateTopicTitle: function() {
			var title = this.$("input[name=title]"),
					titleLength = strUtil.getLength($.trim(title.val()));
			if (titleLength < 4 * 2) {
				alertify.error("抱歉，话题标题不能低于4个汉字：（");
				return false;
			}
			if (titleLength > 30 * 2) {
				alertify.error("抱歉，话题标题不能多于30个汉字：（");
				title.addClass('err_input');
				return false;
			}
			title.removeClass('err_input');
			return true;
		},
		validateEditor: function() {
			var contentLength = strUtil.getLength($.trim(this.elems.editor.getContent()));
			if (contentLength < 20 * 2) {
				alertify.error("抱歉，话题内容不能低于20个汉字：（");
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
				alertify.success(result.message || '您的帖子已发布，谢谢：）', function() {
					self.settings.success && self.settings.success(_.extend(result, {
						categoryId: self.elems.categoriesInput.val()
					}));
				});
			}
		},
		processConfig: function() {
			this.elems.userIdInput.val(user.get("userId"));
			this.processCategories();
			this.config.title && this.elems.titleInput.val(this.config.title);
			if ( this.config.maxChoiceCount && this.votable ) {
				this.vote.processData({
					voteItems: this.config.voteItems,
					maxChoiceCount: this.config.maxChoiceCount,
					voteDays: this.config.voteDays,
					viewResult: this.config.viewResult,
					viewVoter: this.config.viewVoter
				});
			}
			this.config.content && this.processEditorContent();
		},
		processCategories: function() {
			if ( this.config.categories && this.config.categories.length > 0 ) {
				this.renderCategories(this.config.categories);
			} else {
				this.listenTo(topicCategories, "reset", function() {
					this.renderCategories(topicCategories.toJSON());
				});
				topicCategories.fetch(this.config.fid);
			}
		},
		renderCategories: function(categories) {
			var html = '{@each categories as cate}'+
					'<li><a href="javascript:;" class="J_category" data-category-id="{{cate.id}}">{{cate.categoryName}}</a></li>'+
					'{@/each}';
			this.elems.categoriesList.html(juicer(html, {
				categories: categories
			}));
			typeof this.config.categoryId !== "undefined" && this.setCurrentCategory({
				id: this.config.categoryId,
				name: this.config.categoryName
			});
		},
		processEditorContent: function() {
			var self = this;
			this.elems.editor.addListener( 'ready', function() {
				self.elems.editor.execCommand("cleardoc");
				self.elems.editor.execCommand("inserthtml", self.config.content);
			} );
		},
		processFormUrl: function() {
			this.settings.url && this.elems.form.attr("action", this.settings.url);
		},
		events: {
			"click .J_select": "toggleCategoriesState",
			"click .J_select_list a": "selectCategory"
		},
		toggleCategoriesState: function() {
			this.elems.categoriesList.slideToggle(400);
		},
		selectCategory: function(e) {
			var target = $(e.currentTarget);
			this.toggleCategoriesState();
			this.setCurrentCategory({
				name: target.text(),
				id: target.attr("data-category-id")
			});
		},
		setCurrentCategory: function(category) {
			this.elems.categoriesTitle.find(".con").text(category.name || "全部");
			this.elems.categoriesInput.val(category.id);
		}
	});

	/*
	调用show方法时的参数配置：
	 config : {
		 dialogTitle: "",
		 fid: "",
		 userId: "",
		 topicType: "",
		 categoryId: "",
		 categoryName: "",
		 categories: [],        可选项
		 topicType: "vote",
		 title: "",
		 voteItem: "",
		 voteItem: "",
		 maxChoiceCount: 1,
		 voteDays: 10,
		 viewResult: on,
		 viewVoter: on,
		 content: "<p><img src="http://szdaily.sznews.com/res/1/1/2009-07/02/14/res03_attpic_brief.jpg"/></p>",
		 isSynI: on
	 }
	 */
	var dialog;
	module.exports = {
		show: function(config, settings) {
			var config = _.extend({
				isSynI: "on",
				maxChoiceCount: 1,
				viewResult: "on",
				viewVoter: "on",
				fid: $config.fid
			}, config);
			dialog = new Dialog(juicer(dialogTempl, config), {
				title: config.dialogTitle || "发表新话题",
				width: 640,
				onShow: function() {
					(new TopicDialog({el: this})).show(config, settings||{});
				}
			});
		}
	};
});