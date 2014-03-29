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

<!--  Start 分类帖子管理 弹出层 -->
<div class="dialog" style="width:260px;margin-left:250px; margin-top: 100px; display: block;">

	<div class="popup_sort">
		<p class="tc pd_b20">是否删除该分类？</p>

		<p class="tc">
			<a href="#" class="ico_but_group1 mr_r10">删除<span></span></a>
			<a href="#" class="ico_but_group">取消<span></span></a>
		</p>

		<a class="ico_close J_close" href="javascript:void(0);" hidefocus="true">关闭</a>
	</div>
</div>
<!--  End 分类帖子管理 弹出层 -->


<!--  Start 分类帖子管理 弹出层 -->
<div class="dialog" style="width:380px;margin-left:-250px; margin-top: 100px; display: block;">
	<h3 class="dialog_title">添加新的类名</h3>

	<div class="popup_sort">
		<div class="pd_tb">
			<label class="label">类型名称：</label>
			<input class="input_text " type="text" value="" name="keyword" placeholder="">
			<button class="ico_ct_release" type="submit">提交</button>
		</div>
		<a class="ico_close J_close" href="javascript:void(0);" hidefocus="true">关闭</a>
	</div>
</div>
<!--  End 分类帖子管理 弹出层 -->

<!--  Start 分类帖子管理 弹出层 -->
<div class="dialog" style="width:380px;margin-left:-250px; margin-top: -100px; display: block;">
	<h3 class="dialog_title">添加新的类名</h3>

	<div class="popup_sort">
		<div class="pd_tb">
			<label class="label">类型名称：</label>
			<input class="input_text " type="text" value="" name="keyword" placeholder="">
			<button class="ico_ct_release" type="submit">提交</button>
		</div>
		<a class="ico_close J_close" href="javascript:void(0);" hidefocus="true">关闭</a>
	</div>
</div>
<!--  End 分类帖子管理 弹出层 -->

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
			<a href="#" class="fr fan_add_btn">添加新类型</a>
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
			<ul class="fan_manag_list fan_manag_sort">
				<li class="title">
					<p class="fl select">
						<input name="" class="fan_checkbox" type="checkbox" value="">
						<label>全选</label>
					</p>

					<p class="fl name">类型名称</p>

					<p class="fl user">添加入</p>

					<p class="fl time">添加时间</p>

					<p class="fl last">最后更新人</p>

					<p class="fl lastime">最后更新时间</p>
				</li>

				<li class="list">

					<p class="fl select">
						<input name="" class="fan_checkbox" type="checkbox" value="">
					</p>

					<p class="fl name">灌水</p>

					<p class="fl user">樱桃小丸子</p>

					<p class="fl time">2013-10-16 19:23</p>

					<p class="fl last">樱桃小丸子</p>

					<p class="fl lastime">2013-10-16 19:23</p>

					<div class="fan_manag_oper">
						<p class="fr c_9">
							已选择<span class="f18 c_f76812">1</span>条话题，你可以：
							<a href="#" class="oper">编辑</a>
							<a href="#" class="oper">删除</a>
						</p>
						<input name="" class="fan_checkbox" type="checkbox" value="">
						<label>全选</label>
					</div>
				</li>
				<li class="list bg_cor">

					<p class="fl select">
						<input name="" class="fan_checkbox" type="checkbox" value="">
					</p>

					<p class="fl name">灌水</p>

					<p class="fl user">樱桃小丸子</p>

					<p class="fl time">2013-10-16 19:23</p>

					<p class="fl last">樱桃小丸子</p>

					<p class="fl lastime">2013-10-16 19:23</p>
				</li>
			</ul>
		</div>
		<!-- End 右列 -->
	</div>
</div>
<jsp:include page="../include/footer.jsp"/>

</body>
</html>