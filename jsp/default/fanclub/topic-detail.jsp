<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="cms" uri="/buysou-cms" %>
<%response.setHeader("Cache-Control", "public, max-age=180");%>
<cms:beanmethod var="fanclub" beanName="FanClubManager" methodName="getFanClubSingleViewModel" parametersString="%fid"/>
<!DOCTYPE HTML>
<html lang="zh-cmn-Hans">
<head>
	<title>【论坛】${fanTopic.title} --${fanclub.title}_论坛_BBS-${siteName} - ${siteTitle}</title>
	<meta charset="UTF-8">
	<meta name="keywords" content="${fanclub.title}论坛,${fanclub.title}BBS">
	<meta name="description" content='${fanTopic.contentForDescription}'>
	<link href="${urlStatic}/v2/css/common.css" rel="stylesheet" type="text/css">
	<link href="${urlStatic}/v2/css/app/fan/fan.css" rel="stylesheet" type="text/css">
	<jsp:include page="../include/js_common.jsp"/>
	<cms:include page="../include/fan-body-bg.jsp" />
</head>
<body>
<cms:include value="../include/topbar.jsp">
	<cms:param name="tab" value="fan"/>
</cms:include>
<div class="w_auto" id="wAuto">
	<cms:include value="../include/fan-nav.jsp">
		<cms:param name="tab" value="topic"/>
	</cms:include>
	<div class="wrap fan clearfix">
		<div class="fan_publish" id="fan_publish">
			<a href="javascript:;" class="ico_fan_publish J_publish_action">发表新话题</a>
			<ul class="fan_publish_down J_publish_sub_menu" style="display: none;">
				<li><a href="javascript:;" class="J_sub_publish_action" data-type="topic"><span class="ico_publish_release"></span>发布话题</a>
				</li>
				<li><a href="javascript:;" class="J_sub_publish_action" data-type="newsLog"><span class="ico_publish_news"></span>发布新闻</a>
				</li>
				<li><a href="javascript:;" class="J_sub_publish_action" data-type="vote"><span class="ico_publish_vote"></span>发布投票</a></li>
			</ul>
		</div>
		<div class="fan_details_title clearfix" id="fan_detail_title">
			<span class="fl fan-icons topic-icon-type topic-icon-type-news topic-type-and-model J_topic_icon_news"></span>
			<span class="fl fan-icons topic-icon-type topic-icon-type-vote topic-type-and-model J_topic_icon_vote"></span>
			<h3 class="fl f16 J_topic_title"></h3>
			<span class="fl fan-icons topic-icon-property topic-icon-property-top topic-type-and-model J_topic_icon_top"></span>
			<span class="fl fan-icons topic-icon-property topic-icon-property-marrow topic-type-and-model J_topic_icon_marrow"></span>

			<div class="fr J_topic_toolkit" style="display: none;">
				<span class="fl f14 c_9">本话题共有 <span class="J_topic_replay_total"></span> 楼</span>
				<a href="javascript:void(0);" class="fl ico_ct_release J_share">分享</a>
				<a href="javascript:void(0);" class="fl ico_ct_release J_reply">回复</a>

				<div class="fl select_area J_topic_manager_area" id="topic_manager_area" style="display: none">
					<a class="g_select J_topic_manager" href="javascript:void(0);">
						<span class="g_select_l"></span>
						<span class="con">主题管理</span>
						<span class="g_select_r"></span>
					</a>
					<ul class="select_area_down J_topic_manager_drop_menu">
						<li><a href="javascript:void(0);" class="J_topic_edit">编辑</a></li>
						<li><a href="javascript:void(0);" class="J_topic_delete">删除</a></li>
						<li><a href="javascript:void(0);" class="J_topic_top">置顶</a></li>
						<li><a href="javascript:void(0);" class="J_topic_cancel_top">取消置顶</a></li>
						<li><a href="javascript:void(0);" class="J_topic_marrow">精华</a></li>
						<li><a href="javascript:void(0);" class="J_topic_cancel_marrow">取消精华</a></li>
						<li><a href="javascript:void(0);" class="J_topic_light">高亮</a></li>
						<li><a href="javascript:void(0);" class="J_topic_cancel_light">取消高亮</a></li>
						<li><a href="javascript:void(0);" class="J_topic_up">上升</a></li>
						<li><a href="javascript:void(0);" class="J_topic_cancel_up">取消上升</a></li>
						<li><a href="javascript:void(0);" class="J_topic_down">下沉</a></li>
						<li><a href="javascript:void(0);" class="J_topic_cancel_down">取消下沉</a></li>
						<li style="display: block;"><a href="javascript:void(0);" class="J_topic_set_reply">设置回复</a></li>
					</ul>
				</div>
			</div>
		</div>
		<div class="fan_details_topic" id="fan_details_topic" style="display: none;"></div>
		<div class="fan-details-loading" id="fan_details_loading">
			<div class="fan-loading"></div>
		</div>
		<ul class="fan_details" id="fan_details_container">
		</ul>
		<div class="fan-details-page" id="fan_details_page"></div>
		<div class="fan_details_editor" id="fan_details_editor">
			<form action="/create-fan-topic-reply" method="post">
				<input type="hidden" name="topicId" value=""/>
				<input type="hidden" name="repliedId" value=""/>
				<input type="hidden" name="quotedContent" value=""/>
				<input type="hidden" name="replContent" value=""/>

				<div class="editor" id="editor_container" name="totalContent" style="height: 300px"></div>

				<div class="release release-submit" style="display: none;">
					<a class="ico_ct_release J_submit" href="javascript:void(0);">发 表</a>
					<input id="for_my_home" name="isSynI" type="checkbox" value="1">
					<label for="for_my_home">分享到我的家</label>
				</div>

				<div class="release release-loading">
					<div class="fan-loading"></div>
				</div>

			</form>
		</div>
	</div>
</div>
<jsp:include page="../include/footer.jsp"/>
<script type="text/template" id="vote_item">
	<!-- Start 话题投票 -->
	<div class="fan_vote">
		{@if viewVoter}
			<p class="f14">当前共有{{voteUserCount}}人参与投票。投票正在进行中。{@if voteUserCount>0}<a href="javascript:void(0);" class="special J_view_voter">查看投票人</a>{@/if}</p>
		{@/if}
		<p class="fb14 mr_t10"><span class="ico_v_vote"></span>{{title}}</p>
		<ul class="fan_vote_con J_vote_items_container">
		</ul>
		<div class="fan-vote-items-submit-area">
			<div class="fan-loading J_submit_loading"></div>
			<a class="ico_ct_release fan-vote-items-submit J_submit_vote" href="javascript:void(0);">投票</a>
		</div>
	</div>
	<!-- End 话题投票 -->
</script>
<script type="text/template" id="topic_item">
	<div class="fl fan_details_l">
		<a href="${homeSite}/{{userId}}" target="_blank" class="avatar J_usercard" data-user-id="{{userId}}">
			<img src="{{userBigHeadImg}}" width="100" height="100"/>
		</a>
		<a href="#" class="name">{{userName}}</a>

		<p class="c_9">帖子：<span class="c_690">{{totalTopics}}</span></p>

		<p class="c_9">粉丝：<span class="c_690">{{myFollowerCount}}</span></p>
		<a class="ico_card_follow mr_t5 J_follow" href="javascript:;" data-user-id="{{userId}}">加关注</a>
	</div>
	<div class="fl fan_details_r">
		<p class="floor c_9">楼主</p>

		<div class="info" style="display:block">
			<!-- Start 回复正文 -->
			<div class="text">
				<div>{{{content}}}</div>
			</div>
			<!-- End 回复正文 -->
			<div class="fan-detail-vote" id="fan_detail_vote_container">
			</div>
		</div>

		<p class="oper">
			<span class="c_9">{{regdateString}}</span>
			{@if userId == authorId && fanTopicType != "vote"}
				<a href="javascript:void(0);" class="special J_modify">编辑</a>
			{@else}
			<a href="javascript:void(0);" class="special J_quote">引用</a>
			<a href="javascript:void(0);" class="special J_reply">回复</a>
			{@/if}
		</p>

		<p class="c_9">{{signature}}</p>
	</div>
</script>
<script type="text/template" id="post_item">
	<div class="fl fan_details_l">
		<a href="${homeSite}/{{userId}}" target="_blank" class="avatar J_usercard" data-user-id="{{userId}}">
			<img src="{{headImg180}}" width="100" height="100"/>
		</a>
		<a href="#" class="name">{{userName}}</a>

		<p class="c_9">帖子：<span class="c_690">{{totalTopics}}</span></p>

		<p class="c_9">粉丝：<span class="c_690">{{myFollowerCount}}</span></p>
		<a class="ico_card_follow mr_t5 J_follow" href="javascript:;" data-user-id="{{userId}}">加关注</a>
	</div>
	<div class="fl fan_details_r">
		<p class="floor c_9 J_floor_content">{{floor}}</p>

		<div class="shield_info J_shield_content" {@if shield} style="display:block"{@/if}>
			该用户言论已被屏蔽：（
		</div>
		<div class="info J_info_content" {@if !shield} style="display:block"{@/if}>
			<!-- Start 回复引用 -->
			{{{quotedContent}}}
			<!-- End 回复引用 -->

			<!-- Start 回复正文 -->
			<div class="text J_content_area">
				<div>{{{content}}}</div>
			</div>
			<!-- End 回复正文 -->
		</div>

		<p class="oper">
			<span class="c_9">{{regdateString}}</span>
			{@if userId == authorId}
				<a href="javascript:void(0);" class="special J_modify">编辑</a>
			{@else}
				{@if !shield}
					<a href="javascript:void(0);" class="special J_quote">引用</a>
				{@/if}
				<a href="javascript:void(0);" class="special J_reply">回复</a>
			{@/if}
			<span class="J_manage_container" style="display:none;">
				<input type="checkbox" class="mr_l10 J_manage" id="manage_topic_{{id}}"/>
				<label class="c_6" for="manage_topic_{{id}}">管理</label>
			</span>
		</p>

		<p class="c_9">{{signature}}</p>
	</div>
</script>
<!--  Start 查看投票人 弹出层 -->
<script type="text/html" id="voter_tpl">
	<h3 class="dialog_title">查看投票人</h3>

	<div class="popup_release popup_view">
		<div style="height: 25px;">
			<label class="fl label c_6">投票选项：</label>
			<div class="fl select_area" style="width: 440px;">
				<a class="g_select J_select" href="javascript:;">
					<span class="g_select_l"></span>
					<span class="con J_select_con" title="{{voteItems[0].itemName}}" data-id="{{voteItems[0].id}}">{{voteItems[0].itemName}}</span>
					<span class="g_select_r"></span>
				</a>
				<ul class="select_area_down view_voter_select_area_down J_select_items" style="display: none;">
					{@each voteItems as item,index}
						<li><a href="javascript:void(0);" title="{{item.itemName}}" data-id="{{item.id}}"><span>{{item.itemName}}</span></a></li>
					{@/each}
				</ul>
			</div>
		</div>
		<div class="fan-loading J_loading" style="display:block;margin:75px auto 0;"></div>
		<ul class="popup_view_list J_voters_list" style="display:none;">
		</ul>
		<div class="page_view_voters_page J_voters_page" style="display:none;"></div>
		<a class="ico_close J_close" href="javascript:void(0);" hidefocus="true">关闭</a>
	</div>
</script>
<!--  End 查看投票人 弹出层 -->
<!--  Start 设置回复 弹出层 -->
<script type="text/html" id="reply_setting_tpl">
	<h3 class="dialog_title">设置帖子的回复操作</h3>
	<div class="popup_release popup_setup">
		<label class="fl label c_9">设置回复：</label>

		<div class="fl select_area J_select_area" style="width: 120px;">
			<a class="g_select J_select" data-status="normal" href="javascript:void(0);">
				<span class="g_select_l"></span>
				<span class="con">正常回复</span>
				<span class="g_select_r"></span>
			</a>
			<ul class="select_area_down J_select_area_down" style="display: none;">
				<li><a href="javascript:void(0);" data-status="normal">正常回复</a></li>
				<li><a href="javascript:void(0);" data-status="hidden">隐藏回复信息</a></li>
				<li><a href="javascript:void(0);" data-status="disabled">不可回复</a></li>
			</ul>
		</div>

		<div class="toolkit pd_t10">
			<p class="sharemyhome">
				<label class="fl label c_9">通知作者：</label>
				<input type="checkbox" checked="checked" id="reply_set_checked" class="fan_checkbox" />
				<label class="c_6" for="reply_set_checked">站内短信通知作者</label>
			</p>
			<input type="submit" value="确 定" class="ico_ct_release J_reply_set_submit" />
		</div>

		<a class="ico_close J_close" href="javascript:void(0);" hidefocus="true">关闭</a>
	</div>
</script>
<!--  End 设置回复 弹出层 -->
<!--  Start 发布话题 弹出层 -->
<script type="text/html" id="posts_setting_prompt_tpl">
	<h3 class="dialog_title">已选择<span class="c_f76812 f16">{{total}}</span>篇回复</h3>

	<div class="popup_release">
		<label class="c_9">请输入{{typeString}}理由</label>
		<textarea class="com_area f14 J_content"></textarea>

		<div class="toolkit">
			<div class="fan-loading fr posts-setting-prompt-loading J_loading"></div>
			<input type="submit" value="确 定" class="submit fr ico_ct_release J_submit">

			<p class="sharemyhome">
				<input type="checkbox" checked="checked" class="fan_checkbox" id="posts_setting_prompt_notify" />
				<label class="c_6" for="posts_setting_prompt_notify">站内短信通知作者</label>
			</p>
		</div>

		<a class="ico_close J_close" href="javascript:void(0);" hidefocus="true">关闭</a>
	</div>
</script>
<!--  End 发布话题 弹出层 -->
<!--  Start 设置管理 弹出层 -->
<script type="text/html" id="posts_setting_tpl">
	<div class="dialog posts_setting_container" id="posts_setting_container">
		<h3 class="dialog_title">已选择<span class="c_f76812 f16 J_total"></span>篇回复,你可以</h3>
		<div class="popup_oper">
			<a href="javascript:void(0);" class="J_delete">[删除]</a>
			<span class="J_delete_loading" style="display:none;">[删除中...]</span>
			<a href="javascript:void(0);" class="J_warn">[警告]</a>
			<a href="javascript:void(0);" class="J_shield">[屏蔽]</a>
			<a href="javascript:void(0);" class="J_cancel_shield" style="display:none;">[取消屏蔽]</a>
		</div>
		<a class="ico_close J_setting_close" href="javascript:void(0);" hidefocus="true">关闭</a>
	</div>
</script>
<!--  End 设置管理 弹出层 -->
<script type="text/javascript">
	require(['app/fan/fanclub/topic-detail'], function(app) {
		app.init("${fanclub.id}");
	});
</script>
</body>
</html>