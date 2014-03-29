define(function(require, exports, module) {
	var ajax = require("ajax"),
			user = require("user"),
			shareWidget = require("modules/widget/share"),
			Dialog = require("dialog"),
			usercard = require('modules/yinyuetai/user/usercard'),
			PageWidget = require("page"),
			ueditor = require("modules/yinyuetai/ueditor/ueditor"),
			AjaxForm = require("ajaxform"),
			alertify = require("alertify"),
			strUtil = require('modules/util/str'),
			follow = require("modules/yinyuetai/user/follow"),
			fanRoleModel = require("app/fan/common/fan-role-model"),
			TopicIssueButton = require("app/fan/common/topic-issue-button"),
			topicOperator = require("app/fan/common/topic-operator"),
			postDialog = require("app/fan/common/post-edit-dialog");

	var $window = $(window),
			$loading = $("#fan_details_loading");

	var topic, voteModel, voterModel, posts, postsManager, pageModel, issuePostModel;
	var documentRouter;

	var Topic = Backbone.Model.extend({
		url : "/ajax/topic/get",
		initialize : function() {
			this.on("change:id", this.fetch);
		},
		fetch : function() {
			var self = this;
			ajax.ajax({
				url : this.url,
				data : "topicId=" + this.id,
				success : function(result) {
					var result = result || "{}",
							data = $.parseJSON(result);
					self.set(data);
					self.trigger("attributesReady");
				}
			})
		}
	});
	var TopicTitle = Backbone.View.extend({
		initialize : function() {
			this.elems = {
				newsIcon: this.$(".J_topic_icon_news"),
				voteIcon: this.$(".J_topic_icon_vote"),
				topIcon: this.$(".J_topic_icon_top"),
				marrowIcon: this.$(".J_topic_icon_marrow"),
				topicTitle : this.$(".J_topic_title"),
				replyTotal : this.$(".J_topic_replay_total"),
				toolkit : this.$(".J_topic_toolkit"),
				manageDropMenu : this.$(".J_topic_manager_drop_menu"),
				manageArea : this.$(".J_topic_manager_area")
			};
			this.model = topic;
			this.initEvents();
		},
		initEvents : function() {
			this.listenTo(this.model, "attributesReady", this.render);
			this.listenTo(fanRoleModel, "change:role", function() {
				if (fanRoleModel.get("role") == "manager") {
					this.elems.manageArea.show();
					return;
				}
				this.elems.manageArea.hide();
			});
			this.listenTo(this.model,"change:grade", this.changeGradeStatus);
			this.listenTo(this.model,"change:highlighted", this.changeHighLightedStatus);
			this.listenTo(this.model,"change:fined", this.changeFined);
			this.listenTo(this.model, "change:replyNum", this.renderReplyTotal);
		},
		render : function() {
			var data = this.model.toJSON(),
				title = data.title || "";
			this.elems.topicTitle.text(title).prop("title", title);
			this.model.get("fanTopicType") == "newsLog" ? this.elems.newsIcon.show() : this.elems.newsIcon.hide();
			this.model.get("fanTopicType") == "vote" ? this.elems.voteIcon.show() : this.elems.voteIcon.hide();
			this.elems.toolkit.show();
			this.renderReplyTotal();
		},
		changeGradeStatus: function() {
			this.model.get("grade") == "toTop" ? this.elems.topIcon.show() : this.elems.topIcon.hide();
		},
		changeHighLightedStatus: function() {
			this.model.get("highlighted") ? this.elems.topicTitle.addClass("topic-icon-property-light") : this.elems.topicTitle.removeClass("topic-icon-property-light");
		},
		changeFined: function() {
			this.model.get("fined") ? this.elems.marrowIcon.show() : this.elems.marrowIcon.hide();
		},
		renderReplyTotal: function() {
			this.elems.replyTotal.text(this.model.get("replyNum")+1);
		},
		events : {
			"click .J_reply" : "replyPost",
			"click .J_share": "shareTopic",
			"click .J_topic_manager" : "manageTopic",
			"click .J_topic_manager_drop_menu" : "manageTopic"
		},
		replyPost : function() {
			issuePostModel.trigger("replyComing");
		},
		manageTopic : function() {
			this.elems.manageDropMenu.toggle();
		},
		shareTopic: function() {
			var shareItems = shareWidget.getShare({
				title: topic.get("title")+" - 音悦台 ",
				content: topic.get("contentForDescription")+" - 音悦台 ",
				url: location.href
			});
			new Dialog('<div class="topic-detail-share-dialog">'+shareItems+'</div>',{
				title: "分享帖子到：",
				width: 445,
				height: 100
			});
		}
	});

	var TopicView = Backbone.View.extend({
		tmpl: $("#topic_item").html(),
		initialize : function() {
			this.model = topic;
			this.initEvents();
		},
		initEvents : function() {
			this.listenTo(this.model, "attributesReady", this.render);
			this.listenTo(this.model, "switchAppDisplay", function(status) {
					status ? this.$el.show() : this.$el.hide();
			});
		},
		render : function() {
			this.$el.html(juicer(this.tmpl, _.extend(this.model.toJSON(), {
				authorId: user.get("userId")
			})));
		},
		events: {
			"click .J_modify": "editTopic",
			"click .J_quote": "quoteTopic",
			"click .J_reply": "replyTopic"
		},
		editTopic: function() {
			topicOperator.editTopic(topic.toJSON(), function() {
				topic.fetch();
			});
		},
		quoteTopic: function() {
			var content = this.model.get("contentForDescription");
			issuePostModel.trigger("quoteComing", {
				author : this.model.get("userName"),
				content : content.length > 200 ? content.slice(0, 200) + "..." : content,
				replyId : this.model.id
			});
		},
		replyTopic: function() {
			issuePostModel.trigger("replyComing", {
				author : this.model.get("userName"),
				floor : "楼主",
				replyId : this.model.id
			});
		}
	});

	var TopicManager = Backbone.View.extend({
		initialize : function() {
			this.elems = {
				edit : this.$(".J_topic_edit"),
				deleteTopic : this.$(".J_topic_delete"),

				top : this.$(".J_topic_top"),
				light : this.$(".J_topic_light"),
				marrow : this.$(".J_topic_marrow"),
				up : this.$(".J_topic_up"),
				down : this.$(".J_topic_down"),

				cancelTop : this.$(".J_topic_cancel_top"),
				cancelLight : this.$(".J_topic_cancel_light"),
				cancelMarrow : this.$(".J_topic_cancel_marrow"),
				cancelUp : this.$(".J_topic_cancel_up"),
				cancelDown : this.$(".J_topic_cancel_down")
			};
			this.listenTo(topic, "attributesReady", function() {
				this.initInterface(topic.toJSON());
			});
			this.listenTo(topic,"change:grade", this.changeGradeStatus);
			this.listenTo(topic,"change:highlighted", this.changeHighLightedStatus);
			this.listenTo(topic,"change:fined", this.changeFined);
		},
		changeGradeStatus: function() {
			var grade = topic.get("grade");
			if ( grade == "toTop" ) {
				this._setOperatorDisplay("top", "negative");
			} else {
				this._setOperatorDisplay("top", "positive");
			}
			if ( grade == "goUp" ) {
				this._setOperatorDisplay("up", "negative");
			} else {
				this._setOperatorDisplay("up", "positive");
			}
			if ( grade == "goDown" ) {
				this._setOperatorDisplay("down", "negative");
			} else {
				this._setOperatorDisplay("down", "positive");
			}
		},
		changeHighLightedStatus: function() {
			if ( topic.get("highlighted") ) {
				this._setOperatorDisplay("light", "negative");
			} else {
				this._setOperatorDisplay("light", "positive");
			}
		},
		changeFined: function() {
			if ( topic.get("fined") ) {
				this._setOperatorDisplay("marrow", "negative");
			} else {
				this._setOperatorDisplay("marrow", "positive");
			}
		},
		initInterface : function(topic) {
			if (topic.fanTopicType !== "vote" && user.get("userId") == topic.userId) {
				this.elems.edit.parent().show();
			}
			this.elems.deleteTopic.parent().show();
		},
		_setOperatorDisplay: function(type, status) {
			var firstLetterUpperType = type.substring(0,1).toUpperCase()+type.substring(1);
			if ( status == "positive" ) {
				this.elems["cancel"+firstLetterUpperType].parent().hide();
				this.elems[type].parent().show();
				return;
			}
			this.elems["cancel"+firstLetterUpperType].parent().show();
			this.elems[type].parent().hide();
		},
		events : {
			"click .J_topic_edit" : "editTopic",
			"click .J_topic_delete" : "deleteTopic",

			"click .J_topic_top" : "topTopic",
			"click .J_topic_light" : "lightTopic",
			"click .J_topic_marrow" : "marrowTopic",
			"click .J_topic_up" : "upTopic",
			"click .J_topic_down" : "downTopic",

			"click .J_topic_cancel_top" : "cancelTop",
			"click .J_topic_cancel_light" : "cancelLight",
			"click .J_topic_cancel_marrow" : "cancelMarrow",
			"click .J_topic_cancel_up" : "cancelUp",
			"click .J_topic_cancel_down" : "cancelDown",

			"click .J_topic_set_reply": "setReply"
		},
		editTopic : function() {
			topicOperator.editTopic(topic.toJSON(), function() {
				topic.fetch();
			});
		},
		deleteTopic : function() {
			topicOperator.deleteTopic(topic.id, function(result) {
				if (!result.error) {
					alertify.success(result.message || "删除成功！", function() {
						location.href = "/fanclub/topics/"+$config.fid;
					});
					return;
				}
				alertify.error(result.message || "删除失败！");
			});
		},
		topTopic : function() {
			var self = this;
			topic.set({
				grade: "toTop"
			});
			topicOperator.topTopic(topic.id, function(result) {
				self.operateComplete(result);
			});
		},
		lightTopic : function() {
			var self = this;
			topic.set({
				highlighted: true
			});
			topicOperator.lightTopic(topic.id, function(result) {
				self.operateComplete(result);
			});
		},
		marrowTopic : function() {
			var self = this;
			topic.set({
				fined: true
			});
			topicOperator.marrowTopic(topic.id, function(result) {
				self.operateComplete(result);
			});
		},
		upTopic : function() {
			var self = this;
			topic.set({
				grade: "goUp"
			});
			topicOperator.upTopic(topic.id, function(result) {
				self.operateComplete(result);
			});
		},
		downTopic : function() {
			var self = this;
			topic.set({
				grade: "goDown"
			});
			topicOperator.downTopic(topic.id, function(result) {
				self.operateComplete(result);
			});
		},
		cancelTop : function() {
			var self = this;
			topic.set({
				grade: "normal"
			});
			topicOperator.cancelTop(topic.id, function(result) {
				self.operateComplete(result);
			});
		},
		cancelLight : function() {
			var self = this;
			topic.set({
				highlighted: false
			});
			topicOperator.cancelLight(topic.id, function(result) {
				self.operateComplete(result);
			});
		},
		cancelMarrow : function() {
			var self = this;
			topic.set({
				fined: false
			});
			topicOperator.cancelMarrow(topic.id, function(result) {
				self.operateComplete(result);
			});
		},
		cancelUp : function() {
			var self = this;
			topic.set({
				grade: "normal"
			});
			topicOperator.cancelUp(topic.id, function(result) {
				self.operateComplete(result);
			});
		},
		cancelDown : function() {
			var self = this;
			topic.set({
				grade: "normal"
			});
			topicOperator.cancelDown(topic.id, function(result) {
				self.operateComplete(result);
			});
		},
		operateComplete : function(result) {
			if (!result.error) {
				alertify.success(result.message || "设置成功！");
				return;
			}
			alertify.error(result.message || "设置失败！");
		},
		replySetTmpl: function() {
			return $("#reply_setting_tpl").html();
		},
		setReply: function() {
			this.replySetDialog = new Dialog(this.replySetTmpl(), {
				width: 348,
				height: 186
			});
			this.replyDialogInit();
		},
		replyDialogInit: function() {
			var self = this;
			this.replyDialogElems = {
				selectArea: this.replySetDialog.$el.find(".J_select_area"),
				selectForm: this.replySetDialog.$el.find(".J_select"),
				selectAreaDown: this.replySetDialog.$el.find(".J_select_area_down"),
				checkForm: $("#reply_set_checked"),
				submitForm: this.replySetDialog.$el.find(".J_reply_set_submit")
			};
			self.replyDialogElems.selectArea.on("click", function() {
				self.replyDialogElems.selectAreaDown.toggle();
			});
			self.replyDialogElems.selectAreaDown.on("click", "a", function() {
				self.replyDialogElems.selectForm.attr("data-status", $(this).attr("data-status")).find("span.con").text($(this).text());
			});
			self.replyDialogElems.submitForm.on("click", function() {
				var status = self.replyDialogElems.selectForm.attr("data-status");
				self.replySetDialog.trigger("hide");
				ajax.ajax({
					url: "/fanhome/set-topic-reply-status",
					type: "POST",
					data: {
						topicId: topic.id,
						replyStatus: status,
						notify: self.replyDialogElems.checkForm.prop("checked")
					},
					success: function(result) {
						if ( !result.error ) {
							topic.set("replyStatus", status);
						}
						self.operateComplete(result);
					}
				});
			});
		}
	});

	var VoteModel = Backbone.Model.extend({
		checkedIds: [],
		initialize: function() {
			this.listenTo(topic, "attributesReady", function() {
				if ( topic.get("fanTopicType") == "vote" ) {
					new VoteView({
						el: $("#fan_detail_vote_container")
					});
					this.fetch();
				}
			});
		},
		fetch: function() {
			var self = this;
			ajax.ajax({
				url: "/ajax/topic/get-vote",
				data: "topicId="+topic.id,
				success: function(result) {
					var result = result || "{}",
						data = $.parseJSON(result);
					self.set(data);
					self.trigger("fetchComplete");
				}
			});
		},
		submitVotedIds: function() {
			var self = this;
			this.trigger("submitVoteIdStart");
			ajax.ajax({
				url: "/post-vote",
				type: "POST",
				data: "voteId="+this.id+"&itemId="+this.checkedIds.join("&itemId="),
				success: function(result) {
					self.trigger("submitVoteIdComplete", result);
				}
			})
		}
	});
	var VoteItem = Backbone.View.extend({
		tagName: "li",
		tmpl: {
			title: '<p class="title">{{itemName}}</p>',
			singer: '<input type="radio" name="vote_item" class="fl radio" value="1">',
			multiple: '<input type="checkbox" class="fl radio" value="1">',
			content: '<div class="fl bar"><span style="width:{{votePercent}};"></span></div><span class="fl c_6"><em class="c_9">{{votePercent}}</em>（{{voteCount}}票）</span>'
		},
		initialize: function(data, config) {
			this.model = data;
			this.config = config || {};
		},
		render: function() {
			var check = this.config.maxChoiceCount > 1 ? this.tmpl.multiple : this.tmpl.singer,
				tmpl = this.tmpl.title + check + this.tmpl.content;
			this.$el.html(juicer(tmpl, this.processData()));
			return this;
		},
		processData: function() {
			var votePercent = this.config.voteTotalCount == 0 ? "0%" : ((this.model.voteCount/this.config.voteTotalCount)*100).toFixed(1)+"%";
			return _.extend(this.model, {
				votePercent: votePercent
			});
		},
		events: {
			"change input": "processStatus"
		},
		processStatus: function(e) {
			var $target = $(e.currentTarget);
			if ( $target.prop("checked") ) {
				if ( this.config.maxChoiceCount == 1 ) {
					voteModel.checkedIds.length = 0;
				}
				voteModel.checkedIds.push(this.model.id);
			} else {
				voteModel.checkedIds = _.without(voteModel.checkedIds, this.model.id);
			}
		}
	});
	var VoteView = Backbone.View.extend({
		tmpl: $("#vote_item").html(),
		initialize: function() {
			this.model = voteModel;
			this.listenTo(this.model, "fetchComplete", function() {
				this.render();
				this.setElements();

				if ( this.model.get("viewVoter") && this.model.get("voteUserCount") > 0 ) {
					new VoterView({
						el: this.$(".J_view_voter")
					});
				}
			});
			this.listenTo(this.model, "submitVoteIdStart", this.voteStart);
			this.listenTo(this.model, "submitVoteIdComplete", this.voteComplete);
		},
		render: function() {
			var data = this.model.toJSON(),
				itemsContainer;
			this.$el.html(juicer(this.tmpl, _.extend(data, {
				title: topic.get("title")
			})));
			itemsContainer = this.$el.find(".J_vote_items_container");
			_.each(data.voteItems, function(item, _) {
				itemsContainer.append(new VoteItem(item, {
					maxChoiceCount: data.maxChoiceCount,
					voteTotalCount: data.voteTotalCount
				}).render().el);
			});
		},
		setElements: function() {
			this.elems = {
				submitLoading: this.$(".J_submit_loading"),
				submitButton: this.$(".J_submit_vote")
			}
		},
		events: {
			"click .J_submit_vote": "processVoteChecked"
		},
		processVoteChecked: function() {
			var self = this;
			user.login(function() {
				if ( self.model.checkedIds.length == 0 ) {
					return alertify.error("请选择您支持的条目！");
				}
				if ( self.model.checkedIds.length > self.model.get("maxChoiceCount") ) {
					return alertify.error("您最多只能选择"+self.model.get("maxChoiceCount")+"项条目哦！");
				}
				self.model.submitVotedIds();
			});
		},
		voteStart: function() {
			this.elems.submitButton.hide();
			this.elems.submitLoading.show();
		},
		voteComplete: function(result) {
			this.elems.submitButton.show();
			this.elems.submitLoading.hide();
			if ( !result.error ) {
				alertify.success(result.message||"投票成功！");
				this.model.fetch();
				return;
			}
			alertify.error(result.message||"投票失败！");
		}
	});

	var VoterModel = Backbone.Model.extend({
		url: "/ajax/topic/get-voters",
		initialize: function() {
			this.set({page: 1});
			this.on("change:id", function() {
				this.fetch();
			});
			this.on("change:page", function() {
				this.fetch();
			});
		},
		fetch: function() {
			var self = this;
			this.trigger("fetchStart");
			ajax.ajax({
				url : this.url,
				data : "voteItemId=" + this.id + "&page=" +this.get("page"),
				success : function(result) {
					var result = result || "{}",
							data = $.parseJSON(result);
					self.trigger("fetchComplete", data);
				}
			});
		}
	});
	var VoterView = Backbone.View.extend({
		tmpl: function() {
			return $("#voter_tpl").html();
		},
		votersItemsTmpl: '{@if voters.length == 0}'+
				'<li style="width: 550px;padding-top: 50px;">没有人为这一项投票</li>'+
				'{@else}'+
				'{@each voters as voter,index}'+
				'<li><a href="http://i.yinyuetai.com/{{voter.id}}" target="_blank">{{voter.niceName}}</a></li>'+
			'{@/each}'+
		'{@/if}',
		initialize: function() {
			this.model = new VoterModel;
			this.page = new PageWidget();
			this.listenTo(voterModel, "fetchStart", function() {
				this.elems.votersList.hide();
				this.elems.votersPage.hide();
				this.elems.loading.show();
			});
			this.listenTo(voterModel, "fetchComplete", function(data) {
				this.elems.loading.hide();
				this.elems.votersList.show();
				this.elems.votersPage.show();
				this.renderVoters({
					voters: data.voters
				});
				this.renderPages(data);
			});
		},
		events: {
			"click": "startApp"
		},
		startApp: function() {
			this.render();
			this.setElements();
			this.bindEvents();
			voterModel.set("id", voteModel.get("voteItems")[0].id);
		},
		render: function() {
			this.dialog = new Dialog(juicer(this.tmpl(), {
				voteItems: voteModel.get("voteItems")
			}),{
				width: 642,
				height: 334
			});
		},
		renderVoters: function(data) {
			this.elems.votersList.html(juicer(this.votersItemsTmpl, data));
		},
		renderPages: function(data) {
			this.elems.votersPage.html(this.page.render(Math.ceil(data.count/data.pageSize), data.pageNum));
		},
		setElements: function() {
			this.elems = {
				loading: this.dialog.$el.find(".J_loading"),
				selectTitle: this.dialog.$el.find(".J_select"),
				selectTitleCon: this.dialog.$el.find(".J_select_con"),
				selectItems: this.dialog.$el.find(".J_select_items"),
				votersList: this.dialog.$el.find(".J_voters_list"),
				votersPage: this.dialog.$el.find(".J_voters_page")
			};
		},
		bindEvents: function() {
			var self = this;
			this.elems.selectTitle.on("click", function() {
				self.elems.selectItems.toggle();
			});
			this.elems.selectItems.find("a").on("click", function() {
				self.elems.selectItems.toggle();
				self.elems.selectTitleCon.prop("title", $(this).text()).attr("data-id", $(this).attr("data-id")).text($(this).text());
				voterModel.set("id", $(this).attr("data-id"));
			});
			this.elems.votersPage.on("click", "a", function() {
				var page = $(this).attr("data-page");
				voterModel.set("page", page);
			});
		}
	});

	var Post = Backbone.Model.extend({
		isNew: function() {
			return true;
		}
	});
	var Posts = Backbone.Collection.extend({
		isSamePageModel: false,
		data : null,
		model : Post,
		url : "/ajax/topic/get-topic-posts",
		fetch : function(page) {
			var self = this;
			page==pageModel.currentPage ? this.isSamePageModel=true : this.isSamePageModel=false;
			this.trigger("fetchStart");
			ajax.ajax({
				type: "POST",
				url : this.url,
				data : "topicId=" + $config.topicId + "&page=" + page,
				success : function(result) {
					var result = result || "{}",
						data = $.parseJSON(result);
					self.trigger("fetchComplete");
					if (data.posts) {
						self.data = data;
						self.trigger("dataComing");
						topic.set({
							replyNum: data.count
						});
						if ( self.isSamePageModel ) {
							self.set(data.posts);
							return;
						}
						self.reset(data.posts);
					}
				}
			});
		},
		managed: function() {
			return this.where({isManaging: true});
		},
		getManagedIds: function() {
			var manageds = this.managed();
			return _.pluck(manageds, "id");
		}
	});

	var PostsView = Backbone.View.extend({
		initialize : function() {
			this.elems = {
				tmpl : $("#post_item").html()
			};
			this.collection = posts;
			this.initEvents();
		},
		initEvents : function() {
			this.listenTo(this.collection, "reset", this.render);
			this.listenTo(this.collection, "fetchStart", function() {
				if ( this.collection.isSamePageModel ) return;
				this.setEmpty();
				$loading.show();
			});
			this.listenTo(this.collection, "fetchComplete", function() {
				$loading.hide();
			});
			this.listenTo(topic, "change:replyStatus", function() {
				var status = topic.get("replyStatus");
				if ( status == "hidden" ) {
					this.$el.hide();
					return;
				}
				this.$el.show();
			});
			this.listenTo(this.collection, "add", function(model) {
				if ( !model ) return;
				this.renderOne(model);
			});
			this.listenTo(this.collection, "removePosts", function() {
				if ( this.collection.length != 0 ) {
					this.collection.fetch(pageModel.currentPage);
					return;
				}
				if ( pageModel.maxPage == 1 ) {
					this.collection.reset([]);
					return;
				}
				if ( pageModel.currentPage == pageModel.maxPage ) {
					pageModel.trigger("goPage", pageModel.currentPage-1);
					return;
				}
				this.collection.fetch(pageModel.currentPage);
			});
		},
		render : function() {
			if (this.collection.length == 0) {
				return;
			}
			_.each(this.collection.models, function(post) {
				this.renderOne(post);
			}, this);
		},
		renderOne : function(post) {
			var postView = new PostView({
				model : post,
				tmpl : this.elems.tmpl
			});
			this.$el.append(postView.render().$el);
		},
		setEmpty : function() {
			this.$el.empty();
		}
	});
	var PostView = Backbone.View.extend({
		tagName : "li",
		className : "list",
		initialize : function(config) {
			this.config = config || {};
			this.initEvents();
		},
		render : function() {
			var rendeData = _.extend(this.model.toJSON(), {
				authorId: user.get("userId")
			});
			this.$el.append(juicer(this.config.tmpl, rendeData));
			this.initElements();
			this.toggleManager();
			return this;
		},
		initEvents : function() {
			this.listenTo(fanRoleModel, "change:role", this.toggleManager);
			this.listenTo(this.model, "change:isManaging", function() {
				if ( !this.model.get("isManaging") ) {
					this.$(".J_manage").prop("checked", false);
				}
			});
			this.listenTo(this.model, "change:shield", function() {
				if ( this.model.get("shield") ) {
					this.elems.infoContent.hide();
					this.elems.shieldContent.show();
					return;
				}
				this.elems.shieldContent.hide();
				this.elems.infoContent.show();
			});
			this.listenTo(this.model, "change:content", function() {
				this.elems.content.html(this.model.get("content"));
			});
			this.listenTo(this.model, "destroy", this.removeItem);
			this.listenTo(this.model, "change:floor", this.renderFloor)
		},
		initElements : function() {
			this.elems = {
				manageContainer : this.$(".J_manage_container"),
				shieldContent: this.$(".J_shield_content"),
				infoContent: this.$(".J_info_content"),
				content: this.$(".J_content_area"),
				floor: this.$(".J_floor_content")
			};
		},
		toggleManager : function() {
			if (fanRoleModel.get("role") == "manager") {
				this.elems.manageContainer.show();
				return;
			}
			this.elems.manageContainer.hide();
		},
		removeItem: function() {
			var self = this;
			this.$el.slideUp(400, function() {
				self.remove();
			});
		},
		renderFloor: function() {
			this.elems.floor.text(this.model.get("floor"));
		},
		events : {
			"click .J_quote" : "quotePost",
			"click .J_reply" : "replyPost",
			"change .J_manage" : "managePost",
			"click .J_modify" : "modifyPost"
		},
		quotePost : function() {
			var content = this.model.get("trimHtmlContent");
			issuePostModel.trigger("quoteComing", {
				author : this.model.get("userName"),
				content : content.length > 200 ? content.slice(0, 200) + "..." : content,
				replyId : this.model.id
			});
		},
		replyPost : function() {
			issuePostModel.trigger("replyComing", {
				author : this.model.get("userName"),
				floor : this.model.get("floor"),
				replyId : this.model.id
			});
		},
		managePost : function(e) {
			var $target = $(e.currentTarget);
			if ( $target.prop("checked") ) {
				this.model.set("isManaging", true);
			} else {
				this.model.set("isManaging", false);
			}
			postsManager.setDialog($target);
		},
		modifyPost: function(e) {
			var self = this,
				$target = $(e.currentTarget);
			if ( $target.attr("data-first") ) {
				topicOperator.editTopic(topic.toJSON(), function() {
					topic.fetch();
				});
				return;
			}
			postDialog.show({
				fid: $config.fid,
				id: this.model.id,
				replContent: this.model.get("content")
			}, {
				success: function(result) {
					self.model.set({
						content: result.newContent
					});
				}
			});
		}
	});
	var PostsManager = Backbone.View.extend({
		el: "body",
		settingTmpl: $("#posts_setting_tpl").html(),
		promptTmpl: $("#posts_setting_prompt_tpl").html(),
		initialize: function() {
			var self = this;
			$(window).resize(_.throttle(function() {
				if ( !self.settingDialogContainer ) return;
				self.resetSettingPosition();
			}, 200));
		},
		setDialog: function($target) {
			this.$target = $target;
			if ( $target.prop("checked") ) {
				if ( !this.settingDialogContainer ) {
					this.$el.append(juicer(this.settingTmpl, {}));
					this.settingDialogContainer = $("#posts_setting_container");
					this.setElements();
				}
			}
			if ( posts.managed().length !== 0 ) {
				this.resetSettingPosition();
				this.resetTotal();
				this.resetShieldStatus();
			} else {
				this.closeSettingDialog();
			}
		},
		setElements: function() {
			this.elems = {
				deleteItem: this.settingDialogContainer.find(".J_delete"),
				deleteLoadingItem: this.settingDialogContainer.find(".J_delete_loading"),
				shield: this.settingDialogContainer.find(".J_shield"),
				cancelShield: this.settingDialogContainer.find(".J_cancel_shield")
			};
		},
		resetSettingPosition: function() {
			var tPos = this.$target.offset();
			this.settingDialogContainer.css({
				left: tPos.left-this.settingDialogContainer.innerWidth()/2-4+"px",
				top: tPos.top-this.settingDialogContainer.innerHeight()-10+"px"
			});
		},
		resetTotal: function() {
			this.settingDialogContainer.find(".J_total").text(posts.managed().length);
		},
		resetShieldStatus: function() {
			var managed = posts.managed(),
				shieldedNumber = 0;
			_.each(managed, function(model) {
				if ( model.get("shield") ) shieldedNumber++;
			});
			if ( managed.length == shieldedNumber ) {
				this.elems.shield.hide();
				this.elems.cancelShield.show();
				return;
			}
			if ( shieldedNumber == 0 ) {
				this.elems.cancelShield.hide();
				this.elems.shield.show();
				return;
			}
			this.elems.cancelShield.hide();
			this.elems.shield.hide();
		},
		showPrompt: function(data) {
			this.dialog = new Dialog(juicer(this.promptTmpl, data));
			this.promptData = data;
			this.promptElems = {
				loading: this.dialog.$el.find(".J_loading"),
				content: this.dialog.$el.find(".J_content"),
				submitButton: this.dialog.$el.find(".J_submit"),
				notifyCheck: $("#posts_setting_prompt_notify")
			};
			this.bindPromptEvents();
		},
		bindPromptEvents: function() {
			var self = this;
			this.promptElems.submitButton.on("click", function() {
				var value = $.trim(self.promptElems.content.val()),
					engLength = strUtil.getLength(value);
				if ( engLength > 100 * 2 ) {
					alertify.error("内容最多支持输入100个汉字");
					return;
				}
				self.promptElems.submitButton.hide();
				self.promptElems.loading.show();
				self.sendOperateDataToServer();
			});
		},
		sendOperateDataToServer: function() {
			var self = this, url, isShield = true, data = {
				topicReplyId: posts.getManagedIds().join(),
				notify: this.promptElems.notifyCheck.prop("checked"),
				content: $.trim(this.promptElems.content.val())
			};
			if ( this.promptData.type == "warn" ) {
				url = "/fanhome/set-topic-reply-warn";
			} else {
				url = "/fanhome/set-topic-reply-shield";
				if ( this.promptData.type == "cancelShield" ) isShield = false;
				data = _.extend(data, {
					isShield: isShield
				});
			}
			ajax.ajax({
				type: "POST",
				url: url,
				data: data,
				success: function(result) {
					self.processOperateDataFromServer(result);
				}
			});
		},
		processOperateDataFromServer: function(result) {
			this.promptElems.loading.hide();
			this.promptElems.submitButton.show();
			if ( !result.error ) {
				alertify.success(result.message||"操作成功！");
				this.updatePostsAttributes();
				this.dialog.trigger("hide");
				this.closeSettingDialog();
				return;
			}
			alertify.error(result.message||"操作失败！");
		},
		updatePostsAttributes: function() {
			var key, value = true;
			if ( this.promptData.type == "warn" ) {
				key = "warn";
			} else {
				key = "shield";
				if ( this.promptData.type == "cancelShield" ) value = false;
			}
			_.each(posts.getManagedIds(), function(id) {
				posts.get(id).set(key, value);
			});
		},
		events: {
			"click .J_setting_close": "closeSettingDialog",
			"click .J_delete": "deletePosts",
			"click .J_warn": "warnPosts",
			"click .J_shield": "shieldPosts",
			"click .J_cancel_shield": "cancelShieldPosts"
		},
		closeSettingDialog: function() {
			this.settingDialogContainer.remove();
			this.settingDialogContainer = null;
			_.each(posts.managed(), function(model) {
				model.set("isManaging", false);
			});
		},
		deletePosts: function() {
			var self = this;
			this.elems.deleteItem.hide();
			this.elems.deleteLoadingItem.show();
			var ids = _.pluck(posts.managed(), "id");
			ajax.ajax({
				type: "POST",
				url: "/fanhome/remove-fan-topic-reply",
				data: "fanTopicReplyId="+ids.join(),
				success: function(result) {
					var result = result || "{}",
							data = $.parseJSON(result);
					if ( !data.error ) {
						self.closeSettingDialog();
						alertify.success(data.message||"删除成功！");
						self.removePosts(ids);
						posts.trigger("removePosts", ids);
						return;
					}
					self.elems.deleteLoadingItem.hide();
					self.elems.deleteItem.show();
					alertify.error(data.message||"删除失败，请稍后再试！");
				}
			});
		},
		removePosts: function(ids) {
			_.each(ids, function(id) {
				posts.get(id).destroy();
			});
		},
		warnPosts: function() {
			this.showPrompt({
				type: "warn",
				typeString: "警告",
				total: posts.managed().length
			});
		},
		shieldPosts: function() {
			this.showPrompt({
				type: "shield",
				typeString: "屏蔽",
				total: posts.managed().length
			});
		},
		cancelShieldPosts: function() {
			this.showPrompt({
				type: "cancelShield",
				typeString: "取消屏蔽",
				total: posts.managed().length
			});
		}
	});

	var PageModel = Backbone.Model.extend({
		initialize : function() {
			this.listenTo(posts, "dataComing", this.processData);
			this.listenTo(posts, "fetchStart", function() {
				this.trigger("fetchStart");
			});
		},
		processData: function() {
			var data = posts.data;
			this.data = {
				count : data.count || 0,
				size : data.pageSize || 0,
				current : data.pageNum || 0
			};
			(this.maxPage = Math.ceil(this.data.count / this.data.size)) || (this.maxPage = 1);
			this.currentPage = this.data.current;
			this.trigger("dataComing");
		}
	});

	var PageView = Backbone.View.extend({
		initialize : function() {
			this.page = new PageWidget();
			this.listenTo(pageModel, "dataComing", function() {
				this.render();
				if ( pageModel.currentPage == 1 ) {
					topic.trigger("switchAppDisplay", true);
					return;
				}
				topic.trigger("switchAppDisplay", false);
			});
			this.listenTo(pageModel, "fetchStart", function() {
				this.setEmpty();
				topic.trigger("switchAppDisplay", false);
			});
			this.listenTo(pageModel, "goPage", function(page) {
				this.goPage(page);
			});
			this.listenTo(topic, "change:replyStatus", function() {
				var status = topic.get("replyStatus");
				if ( status == "hidden" ) {
					this.$el.hide();
					return;
				}
				this.$el.show();
			});
		},
		render : function() {
			this.$el.html(this.page.render(pageModel.maxPage, pageModel.data.current));
		},
		setEmpty : function() {
			this.$el.html("");
		},
		events : {
			"click a" : "changePage"
		},
		changePage : function(e) {
			var origin = $(e.currentTarget),
					page = origin.attr("data-page");
			this.goPage(page);
		},
		goPage : function(page) {
			documentRouter.navigate($config.topicId + "/" + page, {
				trigger : true
			});
			if ( !history.pushState ) {
				setTimeout(function() {
					location.href = "/fanclub/topic-detail/"+$config.topicId + "/" + page;
				},0);
			}
		}
	});


	var IssuePostModel = Backbone.Model.extend();
	var IssuePost = Backbone.View.extend({
		replyTmpl : '<p class="topic-post-submit-reply-content" style="padding: 10px;font-size: 12px;color:#999;">回复 {{floor}} {{author}} 的帖子</p>',
		quoteTmpl : '<p class="topic-post-submit-quote-content" style="margin: 10px;padding: 10px;border: 1px #e7e7e7 dashed;font-size: 12px;">' +
				'<span style="color: #999;padding-bottom: 10px;display: block;">引用 {{author}} 说的</span>' +
				'<span style="color: #666;">{{{content}}}</span>' +
				'</p>',
		initialize : function() {
			this.elems = {
				form : this.$("form"),
				topicIdInput : this.$("[name=topicId]"),
				repliedIdInput : this.$("[name=repliedId]"),
				quotedContentInput : this.$("[name=quotedContent]"),
				replyContentInput : this.$("[name=replContent]"),
				submitArea : this.$(".release-submit"),
				submit : this.$(".J_submit"),
				loading : this.$(".release-loading")
			};
			this.createEditor();
			this.createAndSetForm();
			this.initEvents();
		},
		initEvents : function() {
			var self = this;
			this.listenTo(topic, "attributesReady", function() {
				this.elems.topicIdInput.val(topic.id);
			});
			this.listenTo(issuePostModel, "quoteComing", function(data) {
				if (data) {
					this._createFormData(this.quoteTmpl, data);
				}
				this.setInEyesight();
			});
			this.listenTo(issuePostModel, "replyComing", function(data) {
				if (data) {
					this._createFormData(this.replyTmpl, data);
				}
				this.setInEyesight();
			});
			this.elems.submit.on("click", function() {
				user.login(function() {
					self.setReplyContent();
					self.elems.form.submit();
				});
			});
			this.listenTo(posts, "fetchStart", function() {
				this.$el.hide();
			});
			this.listenTo(posts, "fetchComplete", function() {
				var status = topic.get("replyStatus");
				if ( status == "disabled" ) {
					return;
				}
				this.$el.show();
			});
			this.editor.addListener('ready', function() {
				self.elems.submitArea.show();
			});
			this.editor.addListener('contentChange',function(){
				var content = self.getContent();
				if ( !/<p.*?class="topic-post-submit-quote-content".*?\/p>/ig.test(content) && !/<p.*?class="topic-post-submit-reply-content".*?\/p>/ig.test(content) ) {
					self.elems.quotedContentInput.val("");
				}
			});
			this.listenTo(topic, "change:replyStatus", function() {
				var status = topic.get("replyStatus");
				if ( status == "disabled" ) {
					this.$el.hide();
					return;
				}
				this.$el.show();
			});
		},
		_createFormData : function(tmpl, data) {
			var html = juicer(tmpl, data);
			this.elems.quotedContentInput.val(html);
			this.setContent(html + "<br>");
			this.elems.repliedIdInput.val(data.replyId);
		},
		setInEyesight : function() {
			$("html, body").animate({
				scrollTop : this.$el.offset().top - 41 + "px"
			}, 400);
		},
		createEditor : function() {
			this.editor = ueditor.create("editor_container", this.editorConfig);
		},
		editorConfig : {
			initialContent : "",
			initialFrameHeight : 300
		},
		createAndSetForm : function() {
			var self = this;
			this.form = new AjaxForm(this.elems.form, {
				onRequest : function() {
					if (!self.validateEditor()) {
						return false;
					}
					self.elems.submitArea.hide();
					self.elems.loading.show();
					return true;
				},
				onComplete : function(result) {
					self.processSeverResult(result);
				}
			});
		},
		convertContent : function(content) {
			var content = content || "";
			return content.replace(/<p.*?class="topic-post-submit-quote-content".*?\/p>/ig,
					"").replace(/<p.*?class="topic-post-submit-reply-content".*?\/p>/ig, "");
		},
		validateEditor : function() {
			var content = this.getContent(),
					convertContent = this.convertContent(content),
					contentLength = strUtil.getLength(convertContent);
			if (contentLength < 20 * 2) {
				alertify.error("抱歉，内容不能低于20个汉字！");
				this.editor.focus();
				return false;
			}
			return true;
		},
		processSeverResult : function(result) {
			var result = result || "";
			this.elems.loading.hide();
			this.elems.submitArea.show();
			if (!result.error) {
				this.emptyEditor();
				alertify.success("评论发表成功！");
				if (pageModel.currentPage == pageModel.maxPage) {
					posts.fetch(pageModel.currentPage);
					$window.scrollTop(0);
				}
				return;
			}
			alertify.error(result.message || "发布评论出错，请稍后再试！");
		},
		emptyEditor : function() {
			this.editor.execCommand("cleardoc");
		},
		setContent : function(content, isAppendTo) {
			this.editor && this.editor.setContent(content, isAppendTo);
		},
		getContent : function() {
			return this.editor && this.editor.getContent();
		},
		setReplyContent : function() {
			this.elems.replyContentInput.val(this.convertContent(this.getContent()));
		}
	});

	var DocumentRouter = Backbone.Router.extend({
		initialize : function() {
			this.route(/#?(\d*)?\/?(\d*)?/, "loadResources");
		},
		loadResources : function(topicId, page) {
			var page = page || 1;
			$config.topicId = topicId;
			topic.set("id", parseInt(topicId, 10));
			posts.fetch(page);
			$window.scrollTop(0);
		}
	});

	function initTopicComponent() {
		topic = new Topic();
		new TopicTitle({
			el : $("#fan_detail_title")
		});
		new TopicView({
			el : $("#fan_details_topic")
		});
		new TopicManager({
			el : $("#topic_manager_area")
		});
	}

	function initVote() {
		voteModel = new VoteModel;
	}

	function initVoter() {
		voterModel = new VoterModel;
	}

	function initTopicPosts() {
		posts = new Posts();
		new PostsView({
			el : $("#fan_details_container")
		});
	}

	function initPostsManager() {
		postsManager = new PostsManager();
	}

	function initTopicIssueButton() {
		new TopicIssueButton({
			el : $("#fan_publish")
		}, {
			success : function(data) {

			}
		});
	}

	function initPage() {
		pageModel = new PageModel;
		new PageView({
			el : $("#fan_details_page")
		});
	}

	function initIssuePost() {
		issuePostModel = new IssuePostModel;
		new IssuePost({
			el : $("#fan_details_editor")
		});
	}

	function initDocumentRouter() {
		documentRouter = new DocumentRouter();
		Backbone.history.start({
			pushState : true,
			hashChange: false,
			root : "/fanclub/topic-detail/"
		});
	}

	function bindUserLoginedEvents() {
		user.logined(function() {
			fanRoleModel.fetch()
		});
	}

	function init(fid) {
		$config.fid = fid;
		follow.bind();
		initTopicComponent();
		initVote();
		initVoter();
		initTopicPosts();
		initPostsManager();
		initTopicIssueButton();
		initPage();
		initIssuePost();
		initDocumentRouter();

		bindUserLoginedEvents();

		fanRoleModel.fetch();
	}

	module.exports = {
		init : init
	};
});