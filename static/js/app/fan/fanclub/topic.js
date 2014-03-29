define(function(require, exports, module) {
	var usercard = require('modules/yinyuetai/user/usercard'),
			ajax = require("ajax"),
			alertify = require('alertify'),
			user = require('user'),
			ueditor = require("modules/yinyuetai/ueditor/ueditor"),
			juicer = require('juicer'),
			PageWidget = require("page"),
			fanRoleModel = require("app/fan/common/fan-role-model"),
			Topics = require("app/fan/common/topics-collection"),
			TopicIssueButton = require("app/fan/common/topic-issue-button"),
			topicOperator = require("app/fan/common/topic-operator"),
			topicEditBar = require("app/fan/common/edit-bar");

	var topics;

	var documentRouter;

	var categories, categoriesView;

	var Categories = require("app/fan/common/topic-categories-collection");
	var CategoryView = Backbone.View.extend({
		tagName : "li",
		template : function(data) {
			var html = '|<a href="http://fan.yinyuetai.com/fanclub/topics/'+$config.fid+'/{{id}}" data-category-id="{{id}}">{{categoryName}}</a>';
			return juicer(html, data || {});
		},
		render : function() {
			this.$el.html(this.template(this.model.toJSON()));
			return this;
		}
	});
	var CategoriesView = Backbone.View.extend({
		currentClass : "cur",
		initialize : function() {
			this.elems = {
				itemCtn : this.$(".J_categories_item-ctn"),
				manager : this.$(".J_manager")
			};
			this.listenTo(categories, "reset", this.resetView);
			this.listenTo(fanRoleModel, "change:role", this.setManager);
		},
		resetView : function() {
			this.addAll();
			this.setCurrentCategory(categories.currentId);
		},
		addAll : function() {
			this.elems.itemCtn.empty();
			categories.each(this.addOne, this);
		},
		addOne : function(category) {
			var categoryView = new CategoryView({model : category});
			this.elems.itemCtn.append(categoryView.render().el);
		},
		setManager : function() {
			if (fanRoleModel.get("role") == "manager") {
				this.elems.manager.show();
				return;
			}
			this.elems.manager.hide();
		},
		events : {
			"click ul a" : "setCategory"
		},
		setCategory : function(e) {
			var $target = $(e.currentTarget),
					cid = $target.attr("data-category-id");
			if ( history.pushState ) {
				e.preventDefault();
			}
			if (cid == categories.currentId) {
				return;
			}
			categories.currentId = cid;
			this.setCurrentCategory(cid);
			topicEditBar.destroy();
			pageModel.trigger("goPage", 1);
		},
		setCurrentCategory : function(cid) {
			this.elems.itemCtn.find("a").removeClass(this.currentClass);
			this.elems.itemCtn.find("a[data-category-id=" + cid + "]").addClass(this.currentClass);
		}
	});

	var topicsView, topicsManager;

	var TopicView = Backbone.View.extend({
		template : function(data) {
			var html = '<input class="fl fan_checkbox J_manager J_manager_edit_topic" type="checkbox" {@if !manager}style="display: none"{@/if} >' +
					'<a href="' + Y.domains.homeSite +
					'/{{userId}}" class="fl avatar J_usercard" data-user-id="{{userId}}" target="_blank">' +
					'<img width="50" height="50" src="{{userHeadImg}}" alt=""/></a>' +

					'<div class="fl info">' +
					'<h4 class="title fan-post-list-title clearfix J_fan_post_list_title">' +
					'{@if fanTopicType=="newsLog"}<span class="fan-icons topic-icon-type topic-icon-type-news"></span>{@/if}' +
					'{@if fanTopicType=="vote"}<span class="fan-icons topic-icon-type topic-icon-type-vote"></span>{@/if}' +
					'<a href="/fanclub/topic-detail/{{id}}" title="{{title}}" target="_blank" {@if highlighted} class="topic-icon-property-light"{@/if}>' +
					'{{title}}' +
					'</a>' +
					'<span class="fan-icons topic-icon-property topic-icon-property-top" {@if grade == "toTop"}style="display:block"{@else}style="display:none"{@/if}></span>' +
					'<span class="fan-icons topic-icon-property topic-icon-property-marrow" {@if fined}style="display:block"{@else}style="display:none"{@/if}></span>' +
					'</h4>' +

					'<p class="c_9 fan_nowrap_elli">' +
					'楼主：<a href="' + Y.domains.homeSite +
					'/{{userId}}" class="special J_usercard" data-user-id="{{userId}}" target="_blank">{{userName}}</a>' +
					'&nbsp;<span class="pd_r20">{{regdateString}}</span>' +
					'最后回复：<a href="' + Y.domains.homeSite +
					'/{{lastReplyUserId}}" class="special J_usercard" data-user-id="{{lastReplyUserId}}" target="_blank">{{lastReplyUserName}}</a>' +
					'&nbsp;{{lastReplyTimeYMD}}' +
					'</p>' +
					'</div>' +
					'<div class="fr num">' +
					'<p class="c_9 fan_nowrap_elli" title="{{totalViews}} 个浏览"><strong class="c_6">{{totalViews}}</strong> 个浏览</p>' +

					'<p class="c_9 fan_nowrap_elli" title="{{replyNum}} 条回复"><strong class="c_690">{{replyNum}}</strong> 条回复</p>' +
					'</div>';
			return juicer(html, data || {});
		},
		tagName : "li",
		className : "list",
		initialize: function() {
			this.listenTo(this.model, "change:isManaging", this.changeCheckStatus);
			this.listenTo(this.model, "change:highlighted", this.changeTitleStatus);
			this.listenTo(this.model, "change:fined", this.changeFinedStatus);
			this.listenTo(this.model, "destroy", this.removeItem);
			this.listenTo(this.model, "change:listIndex", this.renderElBg);
		},
		changeCheckStatus: function() {
			if ( this.model.get("isManaging") ) {
				this.$(".J_manager_edit_topic").prop("checked", true);
				return;
			}
			this.$(".J_manager_edit_topic").prop("checked", false);
		},
		changeTitleStatus: function() {
			if ( this.model.get("highlighted") ) {
				this.$(".J_fan_post_list_title").find("a").addClass("topic-icon-property-light");
				return;
			}
			this.$(".J_fan_post_list_title").find("a").removeClass("topic-icon-property-light");
		},
		changeFinedStatus: function() {
			if ( this.model.get("fined") ) {
				this.$(".topic-icon-property-marrow").show();
				return;
			}
			this.$(".topic-icon-property-marrow").hide();
		},
		render : function() {
			var data = _.extend(this.model.toJSON(), {
				manager : fanRoleModel.get("role") == "manager"
			});
			this.$el.html(this.template(data));
			this.renderElBg();
			return this;
		},
		removeItem: function() {
			var self = this;
			this.$el.slideUp(400, function() {
				self.remove();
			});
		},
		renderElBg: function() {
			if (this.model.get("listIndex") % 2 == 0) {
				this.$el.addClass("bg_cor");
				return;
			}
			this.$el.removeClass("bg_cor");
		},
		events: {
			"change .J_manager_edit_topic": "processStatus"
		},
		processStatus: function(e) {
			var $target = $(e.currentTarget);
			if ( $target.prop("checked") ) {
				this.model.set("isManaging", true);
			} else {
				this.model.set("isManaging", false);
			}
			topicsManager.setDialog($target);
		}
	});

	var TopicsView = Backbone.View.extend({
		initialize : function() {
			this.elems = {
				itemCtn : this.$(".J_fan_posts_list"),
				loading : this.$(".J_fan_posts_loading")
			};
			this.listenTo(topics, "fetchStart", this.fetchStart);
			this.listenTo(topics, "fetchOver", this.fetchOver);
			this.listenTo(topics, "reset", this.resetView);
			this.listenTo(fanRoleModel, "change:role", this.setManager);
			this.listenTo(topics, "add", function(model) {
				if ( !model ) return;
				this.addOne(model);
			});
			this.listenTo(topics, "removeTopics", function() {
				if ( topics.length != 0 ) {
					topics.fetch(categories.currentId, pageModel.currentPage);
					return;
				}
				if ( pageModel.maxPage == 1 ) {
					topics.reset([]);
					return;
				}
				if ( pageModel.currentPage == pageModel.maxPage ) {
					pageModel.trigger("goPage", pageModel.currentPage-1);
					return;
				}
				topics.fetch(categories.currentId, pageModel.currentPage);
			});
		},
		fetchStart : function() {
			if ( topics.isSamePage ) return;
			this.elems.itemCtn.empty();
			this.elems.loading.show();
		},
		fetchOver : function() {
			this.elems.loading.hide();
		},
		resetView : function() {
			if (topics.length == 0) {
				this.setEmptyViewVisible(true);
				return;
			}
			this.setEmptyViewVisible(false);
			this.addAll();
		},
		setManager : function() {
			if (fanRoleModel.get("role") == "manager") {
				this.elems.itemCtn.find(".J_manager").show();
				return;
			}
			this.elems.itemCtn.find(".J_manager").hide();
		},
		setEmptyViewVisible : function(visible) {
			if (visible) {
				this.emptyView = $('<div class="fan_posts_list_empty"></div>').text("当前没有帖子可显示！");
				this.emptyView.insertBefore(this.elems.itemCtn);
				return;
			}
			this.emptyView && this.emptyView.remove();
		},
		addAll : function() {
			topics.each(this.addOne, this);
		},
		addOne : function(topic) {
			var topicView = new TopicView({model : topic});
			this.elems.itemCtn.append(topicView.render().el);
		}
	});

	var TopicsManager = Backbone.View.extend({
		tmpl: '<label class="fl select"><input class="fan_checkbox J_topic_select_all" type="checkbox" />全选</label>' +
				'<div class="fr operate">' +
				'<span class="c_9">已选择<em class="f18 num J_topic_count">1</em>条话题，您可以：</span>' +
				'<a href="javascript:;" class="J_topic_edit">编辑</a>' +
				'<a href="javascript:;" class="J_topic_delete">删除</a>' +

				'<a href="javascript:;" class="J_topic_top">置顶</a>' +
				'<a href="javascript:;" class="J_topic_cancel_top">取消置顶</a>' +
				'<a href="javascript:;" class="J_topic_light">高亮</a>' +
				'<a href="javascript:;" class="J_topic_cancel_light">取消高亮</a>' +
				'<a href="javascript:;" class="J_topic_marrow">精华</a>' +
				'<a href="javascript:;" class="J_topic_cancel_marrow">取消精华</a>' +
				'<a href="javascript:;" class="J_topic_up">上升</a>' +
				'<a href="javascript:;" class="J_topic_cancel_up">取消上升</a>' +
				'<a href="javascript:;" class="J_topic_down">下沉</a>' +
				'<a href="javascript:;" class="J_topic_cancel_down">取消下沉</a>' +
				'</div>',
		tagName: "div",
		initialize: function() {
			var self = this;
			$(window).resize(_.throttle(function() {
				if ( !topicEditBar.isRunning() ) return;
				var offset = self.$target.offset();
				topicEditBar.update({
					left: offset.left - 10 + "px",
					top: offset.top + 19 + "px"
				});
			}, 200));
		},
		setDialog: function($target) {
			var managedModels = topics.managed();
			this.$target = $target;
			if ( managedModels.length > 0 ) {
				var offset = $target.offset();
				if ( !topicEditBar.isRunning() ) {
					this.$el.html(this.tmpl);
					topicEditBar.create($target, {
						$tmpl: this.$el
					});
					this.setElements();
					this.bindEvents();
				}
				topicEditBar.update({
					left: offset.left - 10 + "px",
					top: offset.top + 19 + "px"
				});
				this.setStatus();
			} else {
				topicEditBar.destroy();
			}

		},
		setElements : function() {
			this.elems = {
				selectAll: this.$(".J_topic_select_all"),
				count : this.$(".J_topic_count"),
				editTopic : this.$(".J_topic_edit"),
				deleteTopic : this.$(".J_topic_delete"),

				topTopic : this.$(".J_topic_top"),
				lightTopic : this.$(".J_topic_light"),
				marrowTopic : this.$(".J_topic_marrow"),
				upTopic : this.$(".J_topic_up"),
				downTopic : this.$(".J_topic_down"),

				cancelTop : this.$(".J_topic_cancel_top"),
				cancelLight : this.$(".J_topic_cancel_light"),
				cancelMarrow : this.$(".J_topic_cancel_marrow"),
				cancelUp : this.$(".J_topic_cancel_up"),
				cancelDown : this.$(".J_topic_cancel_down")
			};
		},
		setStatus : function() {
			var managedModels = topics.managed();
			this.$(".operate a").hide();
			if (managedModels.length == 1) {
				this.setSingleSelectedStatus(managedModels);
			} else {
				this.setMultipleSelectedStatus(managedModels);
			}
			if (managedModels.length == topics.length) {
				this.elems.selectAll.prop("checked", true);
			} else {
				this.elems.selectAll.prop("checked", false);
			}
			this.elems.count.text(managedModels.length);
		},
		setSingleSelectedStatus : function(managedModels) {
			var topic = managedModels[0].toJSON();
			if (topic.fanTopicType !== "vote" && user.get("userId") == topic.userId) {
				this.elems.editTopic.show();
			}
			this.elems.deleteTopic.show();
			topic.grade == "toTop" ? this.elems.cancelTop.show() : this.elems.topTopic.show();
			topic.highlighted ? this.elems.cancelLight.show() : this.elems.lightTopic.show();
			topic.fined ? this.elems.cancelMarrow.show() : this.elems.marrowTopic.show();
			topic.grade == "goUp" ? this.elems.cancelUp.show() : this.elems.upTopic.show();
			topic.grade == "goDown" ? this.elems.cancelDown.show() : this.elems.downTopic.show();
		},
		setMultipleSelectedStatus : function() {
			var managedMarrow = topics.where({"fined": true, isManaging: true}).length,
					managedLight = topics.where({"highlighted": true, isManaging: true}).length,
					managedTop = topics.where({"grade": "toTop", isManaging: true}).length,
					managedUp = topics.where({"grade": "goUp", isManaging: true}).length,
					managedDown = topics.where({"grade": "goDown", isManaging: true}).length,
					fullChecked = topics.managed().length;
			this.elems.deleteTopic.show();
			managedLight == 0 ? this.elems.lightTopic.show() : managedLight == fullChecked && this.elems.cancelLight.show();
			managedMarrow == 0 ? this.elems.marrowTopic.show() : managedMarrow == fullChecked && this.elems.cancelMarrow.show();
			managedUp == 0 ? this.elems.upTopic.show() : managedUp == fullChecked && this.elems.cancelUp.show();
			managedDown == 0 ? this.elems.downTopic.show() : managedDown == fullChecked && this.elems.cancelDown.show();
			managedTop == 0 ? this.elems.topTopic.show() : managedTop == fullChecked && this.elems.cancelTop.show();
		},
		bindEvents: function() {
			var self = this;
			this.elems.selectAll.on("click", function(e) {self.checkAll(e);});
			this.elems.editTopic.on("click", function() {self.editTopic();});
			this.elems.deleteTopic.on("click", function() {self.deleteTopic();});
			this.elems.topTopic.on("click", function() {self.topTopic();});
			this.elems.lightTopic.on("click", function() {self.lightTopic();});
			this.elems.marrowTopic.on("click", function() {self.marrowTopic();});
			this.elems.upTopic.on("click", function() {self.upTopic();});
			this.elems.downTopic.on("click", function() {self.downTopic();});
			this.elems.cancelTop.on("click", function() {self.cancelTop();});
			this.elems.cancelLight.on("click", function() {self.cancelLight();});
			this.elems.cancelMarrow.on("click", function() {self.cancelMarrow();});
			this.elems.cancelUp.on("click", function() {self.cancelUp();});
			this.elems.cancelDown.on("click", function() {self.cancelDown();});
		},
		serializeIds : function() {
			var managedModels = topics.managed(),
				ids = _.pluck(managedModels, "id");
			return ids.join("&topicId=");
		},
		checkAll : function(e) {
			if ($(e.target).prop("checked")) {
				topics.each(function(topicModel) {
					topicModel.set({isManaging: true});
				});
				this.elems.count.text(topics.length);
				this.setStatus();
			} else {
				topics.each(function(topicModel) {
					topicModel.set({isManaging: false});
				});
				topicEditBar.destroy();
			}
		},
		editTopic : function() {
			var data = topics.find(function(model) {
						return model.get("isManaging", true);
					});
			topicOperator.editTopic(data.toJSON(), function() {
				topics.fetch();
				topicEditBar.destroy();
			});
		},
		deleteTopic : function() {
			var self = this, serializeIds=this.serializeIds();
			alertify.loading("帖子删除中...");
			topicOperator.deleteTopic(serializeIds, function(result) {
				if ( !result.error ) {
					self._removeTopics(serializeIds);
					topics.trigger("removeTopics");
					topicEditBar.destroy();
					alertify.success(result.message || "删除帖子成功！");
					return;
				}
				alertify.error(result.message || "删除帖子失败！");
			});
		},
		_removeTopics: function(serializeIds) {
			var ids = serializeIds.split("&topicId=");
			_.each(ids, function(id) {
				topics.get(id).destroy();
			});
		},
		topTopic : function() {
			var self = this;
			topicOperator.topTopic(this.serializeIds(), function(result) {
				self.operateCompleteAndJudgeRefresh(result);
			});
		},
		lightTopic : function() {
			var self = this, ids = this.serializeIds();
			_.each(topics.managed(), function(model) {
				model.set({
					highlighted: true,
					isManaging: false
				});
			});
			topicOperator.lightTopic(ids, function(result) {
				self.operateComplete(result);
			});
			topicEditBar.destroy();
		},
		marrowTopic : function() {
			var self = this, ids = this.serializeIds();
			_.each(topics.managed(), function(model) {
				model.set({
					fined: true,
					isManaging: false
				});
			});
			topicOperator.marrowTopic(ids, function(result) {
				self.operateComplete(result);
			});
			topicEditBar.destroy();
		},
		upTopic : function() {
			var self = this;
			topicOperator.upTopic(this.serializeIds(), function(result) {
				self.operateCompleteAndJudgeRefresh(result);
			});
		},
		downTopic : function() {
			var self = this;
			topicOperator.downTopic(this.serializeIds(), function(result) {
				self.operateCompleteAndJudgeRefresh(result);
			});
		},
		cancelTop : function() {
			var self = this;
			topicOperator.cancelTop(this.serializeIds(), function(result) {
				self.operateCompleteAndJudgeRefresh(result);
			});
		},
		cancelLight : function() {
			var self = this, ids = this.serializeIds();
			_.each(topics.managed(), function(model) {
				model.set({
					highlighted: false,
					isManaging: false
				});
			});
			topicOperator.cancelLight(ids, function(result) {
				self.operateComplete(result);
			});
			topicEditBar.destroy();
		},
		cancelMarrow : function() {
			var self = this, ids = this.serializeIds();
			_.each(topics.managed(), function(model) {
				model.set({
					fined: false,
					isManaging: false
				});
			});
			topicOperator.cancelMarrow(ids, function(result) {
				self.operateComplete(result);
			});
			topicEditBar.destroy();
		},
		cancelUp : function() {
			var self = this;
			topicOperator.cancelUp(this.serializeIds(), function(result) {
				self.operateCompleteAndJudgeRefresh(result);
			});
		},
		cancelDown : function() {
			var self = this;
			topicOperator.cancelDown(this.serializeIds(), function(result) {
				self.operateCompleteAndJudgeRefresh(result);
			});
		},
		operateComplete : function(result) {
			if (!result.error) {
				alertify.success(result.message || "操作成功！");
				return;
			}
			alertify.error(result.message || "当前操作失败");
		},
		operateCompleteAndJudgeRefresh: function(result) {
			if ( !result.error ) {
				topics.fetch();
				topicEditBar.destroy();
				alertify.success(result.message || "操作成功！");
				return;
			}
			alertify.error(result.message || "操作失败！");
		}
	});

	var pageModel;
	var PageModel = Backbone.Model.extend({
		initialize: function() {
			this.listenTo(topics, "dataComing", this.processData);
		},
		processData: function() {
			var data = topics.data;
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
			this.listenTo(this.model, "dataComing", this.render);
			this.listenTo(topics, "fetchStart", this.setGetTopicsStatus);
			this.listenTo(this.model, "goPage", function(page) {
				this.goPage(page);
			});
		},
		render : function() {
			this.$el.html(this.page.render(this.model.maxPage, this.model.currentPage));
		},
		setGetTopicsStatus : function() {
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
		goPage: function(page) {
			documentRouter.navigate($config.fid + "/" + categories.currentId + "/" + page, {
				trigger: true
			});
		}
	});

	var DocumentRouter = Backbone.Router.extend({
		initialize : function() {
			this.route(/#?(\d*)?\/?(\d*)?\/?(\d*)?/, "loadResources");
		},
		loadResources : function(urlfid, cid, page) {
			var urlfid = urlfid || 1, cid = cid || 0, page = page || 1;
			if (urlfid != $config.fid) {
				$config.fid = urlfid;
				categories.currentId = null;
				pageModel.currentPage = null;
				categories.fetch();
				fanRoleModel.fetch();
			}
			categories.currentId = cid;
			pageModel.currentPage = page;
			categoriesView.setCurrentCategory(categories.currentId);
			topics.fetch(categories.currentId, pageModel.currentPage);
		}
	});

	function initTopics(config) {
		topics = new Topics(config);
	}

	function initPostsList() {
		topicsView = new TopicsView({
			el : $("#fan_posts")
		});
		topicsManager = new TopicsManager;
	}

	function initPostsCategory() {
		categories = new Categories();
		categoriesView = new CategoriesView({
			el : $("#fan_categories")
		});
	}

	function initPostsListPage() {
		pageModel = new PageModel;
		new PageView({
			el : $("#fan_page_group"),
			model: pageModel
		});
	}

	function initDocumentRouter() {
		documentRouter = new DocumentRouter();
		Backbone.history.start({
			pushState : true,
			hashChange: false,
			root : "/fanclub/topics/"
		});
	}

	function initIssueButton() {
		new TopicIssueButton({
			el : $("#fan_publish")
		}, {
			success : function(data) {
				if (typeof data.categoryId != "undefined" && (topics.cid == 0 || data.categoryId == topics.cid)) {
					topicEditBar.destroy();
					topics.fetch();
				}
			}
		});
	}

	function bindUserLoginedEvents() {
		user.logined(function() {
			fanRoleModel.fetch()
		});
	}

	function init() {
		initTopics();
		initPostsList();
		initPostsCategory();
		initPostsListPage();
		initIssueButton();
		initDocumentRouter();
		bindUserLoginedEvents();
	}

	module.exports = {
		init : init,
		initTopics : initTopics,
		initPostsList : initPostsList,
		getTopics : function() {
			return topics;
		},
		bindUserLoginedEvents: bindUserLoginedEvents,
		initPostsCategory: initPostsCategory,
		initPostsListPage: initPostsListPage
	};
});