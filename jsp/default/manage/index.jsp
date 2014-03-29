<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="cms" uri="/buysou-cms" %>
<%response.setHeader("Cache-Control", "public, max-age=180");%>
<cms:beanmethod var="allFanCount" beanName="FanClubManager" methodName="getAllFanCount" parametersString=""/>
<cms:beanmethod var="allFanMemberCount" beanName="FanMemberManager" methodName="getAllFanMemberCount"
                parametersString=""/>
<cms:beanmethod var="pics" beanName="FanSlidePictureManager" methodName="getAllFanSlidePictures" parametersString=""/>
<cms:beanmethod var="recommendMvs" beanName="FanVideoManager" methodName="getRecommendFanVideos"
                parametersString="0;5"/>
<!DOCTYPE HTML>
<html lang="zh-cmn-Hans">
<head>
	<meta charset="UTF-8">
	<title>${siteName} -- ${siteTitle}</title>
	<link href="${urlStatic}/v2/css/common.css" rel="stylesheet" type="text/css">
	<link href="${urlStatic}/v2/css/app/fan/fan.css" rel="stylesheet" type="text/css">
	<jsp:include page="../include/js_common.jsp"/>
</head>
<body>
<!-- Start topbar -->
<cms:include value="../include/topbar.jsp">
	<cms:param name="tab" value="index"/>
</cms:include>
<!-- End topbar -->
<cms:include value="../include/subnav.jsp">
	<cms:param name="tab" value="index"/>
</cms:include>

<!--  Start 设置管理 弹出层 -->
<div class="dialog" style="width:260px;margin-left:250px; margin-top: 100px; display: none;">
	<h3 class="dialog_title">已选择<span class="c_f76812 f16">1</span>篇回复,你可以</h3>

	<div class="popup_oper">
		<a href="#">[编辑]</a>
		<a href="#">[删除]</a>
		<a href="#">[警告]</a>
		<a href="#">[取消屏蔽]</a>

		<a class="ico_close J_close" href="javascript:void(0);" hidefocus="true">关闭</a>
	</div>
</div>
<!--  End 设置管理 弹出层 -->

<div class="w_auto">
	<div class="fan_nav area">
		<div class="con">
			<div class="fl group_tab">
				<a data-area="all" class="J_area cur" href="javascript:;">主页</a>
				<span class="ico_line"></span>
				<a data-area="ml" class="J_area" href="javascript:;">MV</a>
				<span class="ico_line"></span>
				<a data-area="ht" class="J_area" href="javascript:;">帖子</a>
				<span class="ico_line"></span>
				<a data-area="us" class="J_area" href="javascript:;">照片</a>
			</div>
			<div class="fr fan_publish">
				<a href="#" class="ico_fan_publish">发表新话题</a>
				<ul class="fan_publish_down" style="display: none;">
					<li><a href="#"><span class="ico_publish_release"></span> 发布话题</a></li>
					<li><a href="#"><span class="ico_publish_news"></span>发布新闻</a></li>
					<li><a href="#"><span class="ico_publish_vote"></span>发布投票</a></li>
				</ul>
			</div>
		</div>
		<span class="bg"></span>
	</div>
	<div class="wrap fan">
		<!-- Start 左列导航 -->
		<ul class="fl fan_menu">
			<li><a href="#">帖子管理</a></li>
			<li><a href="#">帖子分类管理</a></li>
			<li><a href="#">MV管理</a></li>
			<li><a href="#">MV分类管理</a></li>
			<li><a href="#">友情链接管理</a></li>
			<li><a href="#">成员管理</a></li>
			<li><a href="#">管理组管理</a></li>
			<li><a href="#">饭团设置</a></li>
		</ul>
		<!-- End 左列导航 -->
		<!-- Start 右列 -->
		<div class="fr fan_manag_right">
			<div class="fan_manag_inquiry">
				<label class="fl label">版块选择：</label>

				<div class="fl select_area">
					<a class="g_select " href="javascript:;">
						<span class="g_select_l"></span>
						<span class="con">主题管理</span>
						<span class="g_select_r"></span>
					</a>
					<ul class="select_area_down">
						<li><a href="javascript:;">设置精华</a></li>
						<li><a href="javascript:;">话题上升</a></li>
						<li><a href="javascript:;">话题下沉</a></li>
						<li><a href="javascript:;">推荐推荐</a></li>
						<li><a href="javascript:;">编辑话题</a></li>
						<li><a href="javascript:;">删除话题</a></li>
						<li><a href="javascript:;">置顶回复</a></li>
						<li><a href="javascript:;">设置高亮</a></li>
					</ul>
				</div>
				<label class="fl label mr">分类选择：</label>

				<div class="fl select_area">
					<a class="g_select " href="javascript:;">
						<span class="g_select_l"></span>
						<span class="con">主题管理</span>
						<span class="g_select_r"></span>
					</a>
					<ul class="select_area_down">
						<li><a href="javascript:;">设置精华</a></li>
						<li><a href="javascript:;">话题上升</a></li>
						<li><a href="javascript:;">话题下沉</a></li>
						<li><a href="javascript:;">推荐推荐</a></li>
						<li><a href="javascript:;">编辑话题</a></li>
						<li><a href="javascript:;">删除话题</a></li>
						<li><a href="javascript:;">置顶回复</a></li>
						<li><a href="javascript:;">设置高亮</a></li>
					</ul>
				</div>
				<div class="fr">
					<label class="fl label">关键词：</label>
					<input class="fl input_text " type="text" value="" name="keyword" placeholder="">
					<button class="ico_ct_cancel" action-type="search" type="submit">查 询</button>
				</div>
			</div>
			<ul class="fan_manag_list fan_manag_posts">
				<li class="title">
					<p class="fl select">
						<input name="" class="fan_checkbox" type="checkbox" value="">
						<label>全选</label>
					</p>

					<p class="fl name">类型</p>

					<p class="fl user">标题</p>

					<p class="fl time">作者</p>

					<p class="fl last">回复/点击</p>

					<p class="fl lastime">发表时间</p>
				</li>

				<li class="list">

					<p class="fl select">
						<input name="" class="fan_checkbox" type="checkbox" value="">
					</p>

					<p class="fl name">【灌水】</p>

					<p class="fl user">音悦台盛典二期即将开始！敬请期待</p>

					<p class="fl time">樱桃小丸子</p>

					<p class="fl last">123212313</p>

					<p class="fl lastime">2013-10-16</p>

					<div class="fan_manag_oper">
						<p class="fr c_9">
							已选择<span class="f18 c_f76812">1</span>条话题，你可以：
							<a href="#" class="oper">编辑</a>
							<a href="#" class="oper">删除</a>
							<a href="#" class="oper">置顶</a>
							<a href="#" class="oper">高亮</a>
							<a href="#" class="oper">精华</a>
							<a href="#" class="oper">上升</a>
							<a href="#" class="oper">下沉</a>
						</p>
						<input name="" class="fan_checkbox" type="checkbox" value="">
						<label>全选</label>
					</div>
				</li>
				<li class="list bg_cor">

					<p class="fl select">
						<input name="" class="fan_checkbox" type="checkbox" value="">
					</p>

					<p class="fl name">【灌水】</p>

					<p class="fl user">音悦台盛典二期即将开始！敬请期待</p>

					<p class="fl time">樱桃小丸子</p>

					<p class="fl last">123212313</p>

					<p class="fl lastime">2013-10-16</p>
				</li>
			</ul>
		</div>
		<!-- End 右列 -->
	</div>
</div>
<jsp:include page="../include/footer.jsp"/>

</body>
</html>