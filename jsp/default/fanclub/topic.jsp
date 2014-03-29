<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="cms" uri="/buysou-cms" %>
<%response.setHeader("Cache-Control", "public, max-age=180");%>
<cms:set var="fid" value="$fid"/>
<cms:beanmethod var="todayHotTopics" beanName="FanTopicManager" methodName="getTodayHotTopicIdList" parametersString="%fid"/>
<!DOCTYPE HTML>
<html lang="zh-cmn-Hans">
<head>
	<meta charset="UTF-8">
	<title>${siteName} -- ${siteTitle}</title>
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
		<div class="main">
			<div class="fan_subnav" id="fan_categories">
				<ul class="fl J_categories_item-ctn">
				</ul>
				<a href="javascript:;" class="fr special J_manager" style="display: none">分类管理</a>
			</div>
			<!-- Start 帖子 -->
			<div class="fan_posts" id="fan_posts">
				<p class="fan_sel_all J_manager" style="display: none">
					<label class="select"><input name="" class="fan_checkbox" type="checkbox" value="">全选</label></p>

				<div class="fan_posts_list_loading fan-loading J_fan_posts_loading"></div>
				<ul class="fan_posts_list J_fan_posts_list J_fan_edit_list">
				</ul>
				<div id="fan_page_group"></div>
			</div>
			<!-- End 帖子 -->
		</div>
		<!--Start 右列 -->
		<div class="side">
			<!-- 今日热帖 -->
			<div class="sd_title mr_t20">
				<h3 class="f16">今日热帖</h3>
			</div>
			<ul class="sd_link sd_fan_posts">
				<cms:iterator value="todayHotTopics" var="topic" status="raw">
					<li><span class="num cor1">${raw.index}</span>
						<a href="/fanclub/topic-detail/${topic.id}" title="${topic.topicTitle}" target="_blank">${topic.topicTitle}</a></li>
				</cms:iterator>
			</ul>
			<a href="#" class="sd_fan_pic">
				<img src="/v2/images/file/index_01.jpg" width="260" height="150" alt=""/>
				<span class="title">#性感锁骨大赛#</span>
			</a>
		</div>
		<!--End 右列 -->
	</div>
</div>
<jsp:include page="../include/footer.jsp"/>

<script typle="text/javascript">
	require(['app/fan/fanclub/topic'], function(topic) {
		topic.init();
	});
</script>
</body>
</html>