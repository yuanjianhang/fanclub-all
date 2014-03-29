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
		<a href="#" class="fr fan_add_btn">添加MV</a>
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
	<!-- MV 列表 -->
	<div class="mv_box fan_mvlist">
		<ul class="mv_list">
			<!-- 选择当前的加上类 mv_list_cur  选中后要删除的类 mv_list_del -->
			<li class="list mv_list_cur">
				<div class="mv_pic">
					<a target="_blank" class="pic" href="http://v.yinyuetai.com/video/797751">
						<img width="120" height="67" alt=""
						     src="/v2/images/file/index_02.jpg">
						<span class="shdIco">超清</span>
						<span class="ico_mv_check">选择当前MV</span>
					</a>

					<h4 class="title"><a href="#">画出我世界 官方版</a></h4>

					<p class="name"><span class="c_9">艺人：</span><a href="#" class="c_6">尚雯婕</a></p>
				</div>
				<!-- 当前MV操作 -->
				<div class="fan_manag_oper">
					<p class="fl">
						<input type="checkbox" value="" class="fan_checkbox" name="">
						<label>全选</label>
					</p>

					<div class="fr c_9">
                        <span class="fl lineh">
                           已选择<span class="f18 c_f76812">1</span>首MV，你可以：
                        </span>
						<label class="fl c_3">复制到：</label>

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
						<label class="fl c_3">移动到：</label>

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
						<a href="#">删除</a>
					</div>
				</div>
			</li>
			<li class="list">
				<div class="mv_pic">
					<a target="_blank" class="pic" href="http://v.yinyuetai.com/video/797751">
						<img width="120" height="67" alt=""
						     src="/v2/images/file/index_02.jpg">
						<span class="shdIco">超清</span>
						<span class="ico_mv_check">选择当前MV</span>
					</a>

					<h4 class="title"><a href="#">画出我世界 官方版</a></h4>

					<p class="name"><span class="c_9">艺人：</span><a href="#" class="c_6">尚雯婕</a></p>
				</div>
			</li>
			<li class="list">
				<div class="mv_pic">
					<a target="_blank" class="pic" href="http://v.yinyuetai.com/video/797751">
						<img width="120" height="67" alt=""
						     src="/v2/images/file/index_02.jpg">
						<span class="shdIco">超清</span>
						<span class="ico_mv_check">选择当前MV</span>
					</a>

					<h4 class="title"><a href="#">画出我世界 官方版</a></h4>

					<p class="name"><span class="c_9">艺人：</span><a href="#" class="c_6">尚雯婕</a></p>
				</div>
			</li>
			<li class="list">
				<div class="mv_pic">
					<a target="_blank" class="pic" href="http://v.yinyuetai.com/video/797751">
						<img width="120" height="67" alt=""
						     src="/v2/images/file/index_02.jpg">
						<span class="shdIco">超清</span>
						<span class="ico_mv_check">选择当前MV</span>
					</a>

					<h4 class="title"><a href="#">画出我世界 官方版</a></h4>

					<p class="name"><span class="c_9">艺人：</span><a href="#" class="c_6">尚雯婕</a></p>
				</div>
			</li>
			<li class="list">
				<div class="mv_pic">
					<a target="_blank" class="pic" href="http://v.yinyuetai.com/video/797751">
						<img width="120" height="67" alt=""
						     src="/v2/images/file/index_02.jpg">
						<span class="shdIco">超清</span>
						<span class="ico_mv_check">选择当前MV</span>
					</a>

					<h4 class="title"><a href="#">画出我世界 官方版</a></h4>

					<p class="name"><span class="c_9">艺人：</span><a href="#" class="c_6">尚雯婕</a></p>
				</div>
			</li>

			<li class="mv_list_cur mv_list_del">
				<div class="mv_pic">
					<a target="_blank" class="pic" href="http://v.yinyuetai.com/video/797751">
						<img width="120" height="67" alt=""
						     src="/v2/images/file/index_02.jpg">
						<span class="shdIco">超清</span>
						<span class="ico_mv_check">选择当前MV</span>
					</a>

					<h4 class="title"><a href="#">画出我世界 官方版</a></h4>

					<p class="name"><span class="fl c_9">艺人：</span><a href="#"
					                                                  class="c_6">尚雯婕尚雯婕尚雯婕尚雯婕尚雯婕尚雯婕</a></p>
				</div>
			</li>
		</ul>
	</div>
	<!-- End MV 列表 -->
</div>
<!-- End 右列 -->
</div>
</div>
<jsp:include page="../include/footer.jsp"/>

</body>
</html>