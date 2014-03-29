<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="cms" uri="/buysou-cms" %>
<%response.setHeader("Cache-Control", "public, max-age=180");%>
<cms:beanmethod var="allFanCount" beanName="FanClubManager" methodName="getAllFanCount" parametersString=""/>
<cms:beanmethod var="allFanMemberCount" beanName="FanMemberManager" methodName="getAllFanMemberCount" parametersString=""/>
<cms:beanmethod var="pics" beanName="FanSlidePictureManager" methodName="getAllFanSlidePictures" parametersString=""/>
<cms:beanmethod var="recommendMvs" beanName="FanVideoManager" methodName="getRecommendFanVideos" parametersString="0;5"/>
<!DOCTYPE HTML>
<html lang="zh-cmn-Hans">
<head>
	<meta charset="UTF-8">
	<title>${siteName} -- ${siteTitle}</title>
	<link href="${urlStatic}/v2/css/common.css" rel="stylesheet" type="text/css">
	<link href="${urlStatic}/v2/css/app/fan/fan.css" rel="stylesheet" type="text/css">
	<jsp:include page="include/js_common.jsp"/>
</head>
<body>
<!-- Start topbar -->
<cms:include value="include/topbar.jsp">
	<cms:param name="tab" value="index"/>
</cms:include>
<!-- End topbar -->
<cms:include value="include/subnav.jsp">
	<cms:param name="tab" value="index"/>
</cms:include>
<div class="wrap fan">
	<!--Start 焦点图 -->
	<div class="fan_focus">
		<ul>
			<li>
				<cms:iterator var="pic" value="pics" status="rowStatus">
				<cms:if test="'bigPic'.equals(pic.resolution.name())">
					<a href="${pic.linkUrl}" class="w465" target="_blank">
						<img src="${pic.imgUrl}" width="465" height="268"/>

						<div class="info">
							<span class="title">${pic.title}</span>
							<span class="text2">${pic.text}</span>
						</div>
					</a>
				</cms:if>
				<cms:else>
					<a href="${pic.linkUrl}" class="w220" target="_blank">
						<cms:if test="pic.imgUrl!=''">
							<img src="${pic.imgUrl}" width="220" height="124"/>
						</cms:if>
						<div class="info"<cms:if test="pic.imgUrl==''"> style="display: block"</cms:if>>
							<span class="title">${pic.title}</span>
							<span class="text2">${pic.text}</span>
						</div>
					</a>
				</cms:else>
				<cms:if test="(rowStatus.index+1) % 5 == 0 && (rowStatus.index+1) != pics.size()"></li>
			<li></cms:if>
				</cms:iterator>
			</li>
		</ul>
		<div class="fan_focus_point J_nav"></div>
	</div>
	<!--End 焦点图 -->
	<div class="main">
		<!--Start 我的饭团 -->
		<div class="fan_wo clearfix" id="fansBox">
			<div class="fan_wo_tab" id="fansTab">
				<a href="javascript:;" class="J_logout cur" style="display: none" data-type="active">这些饭团很活跃<span class="arrow"></span></a>
			</div>
			<div class="fan_wo_list" id="fansList">
				<span class="ico_loading"></span>
			</div>
		</div>
		<!--End 我的饭团 -->
		<!-- Start 列表 -->
		<div class="fan_content" id="topicsBox">
			<div class="group_tab pd_tb">
				<a href="javascript:;" data-type="all">全部</a>
				<span class="ico_line"></span>
				<a href="javascript:;" data-type="hot">热门</a>
				<span class="ico_line J_logined" style="display: none;"></span>
				<a href="javascript:;" class="J_logined" data-type="ijoined" style="display: none;">我加入的</a>
			</div>
			<div class="topics_list_box">
				<span class="ico_loading"></span>
			</div>
		</div>
		<!-- End 列表 -->
	</div>
	<!--Start 右列 -->
	<div class="side">
		<div class="sd_fan_tips">
			这里叫做<span class="f20">“饭团”</span><br/>
			这里是<span class="f20">国内最大</span>的粉丝聚集地<br/>
			这里共有<span class="constantia">${allFanCount}</span>个饭团<br/>
			和<span class="constantia">${allFanMemberCount}</span>个粉丝与爱豆在一起
		</div>
		<div class="sd_title mr_t20">
			<h3 class="fl f18">这些饭团很好玩</h3>
			<a class="fr f14 mr_t5 ico20_exchange" href="javascript:;" id="fansExchange">换一换</a>
		</div>
		<div class="sd_fan_fun">
			<ul class="sd_fan_list" id="randomFans">
				<jsp:include page="ajax/get-random-fans.jsp"/>
			</ul>
		</div>
		<div class="sd_title mr_t20">
			<h3 class="f18">好多好看的MV</h3>
		</div>
		<div class="sd_fan_mv">
			<cms:iterator var="video" value="recommendMvs">
				<div class="mv_pic shadow">
					<a title="${video.filterTitle}" class="shadow play_pic2" href="${vSite}/video/${video.id}" target="_blank">
						<div class="pic">
							<img width="220" height="124" alt="" src="${video.bigHeadImg}">

							<div class="play_name">
								<p class="fb12 mr_t80">${video.filterTitle}</p>

								<p class="c_cf9">${video.artistName}</p>
							</div>
							<span class="ico_play">播放</span>
						</div>
					</a>
				</div>
			</cms:iterator>
		</div>
	</div>
	<!--End 右列 -->
</div>
<script type="text/html" id="topics_tpl">
	{@if topics&&topics.length}
	<ul class="fan_list">
		{@each topics as it,index}
		<li class="list">
			<a href="${fanSite}/{{it.artistId}}" class="avatar J_fancard" data-fan-id="{{it.artistId}}" target="_blank">
				<img src="{{it.headImg}}" width="50" height="50">
			</a>

			<div class="fan_list_con">
				<h4 class="name"><a href="${fanSite}/{{it.artistId}}" target="_blank"><span class="fan_name">{{it.fanTitle}}</span>
					<span class="arrow"></span></a></h4>
				<a href="${fanSite}/fanclub/topic-detail/{{it.id}}" class="special" target="_blank">{{it.title}}</a>

				<p class="text">{{it.contentForDescription}}</p>

				<div class="pic">
					{@if it.previewImages&&it.previewImages.length}
					{@each it.previewImages as img}
					<a href="${fanSite}/fanclub/topic-detail/{{it.id}}" target="_blank"><img src="{{img}}"></a>
					{@/each}
					{@/if}
				</div>
				<div class="time">
					<span class="fl c_9">{{it.dateString}}</span>
					<a href="${fanSite}/fanclub/topic-detail/{{it.id}}" target="_blank" class="fr ico_fan_comment">{{it.replyNum}}</a>
					<a href="" target="_blank" class="fr ico_fan_name">{{it.author.niceName}}</a>
				</div>
			</div>
		</li>
		{@/each}
	</ul>
	{@else}
	<div class="no_result">
		<span class="ico_exp01"></span>

		<div class="no_result_right">
			<h3 class="no_result_sorry">没有相关帖子！</h3>
		</div>
	</div>
	{@/if}
</script>
<jsp:include page="include/footer.jsp"/>
<script type="text/javascript">
	require(["app/fan/fanmass"]);
</script>
</body>
</html>