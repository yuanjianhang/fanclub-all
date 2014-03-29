<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="cms" uri="/buysou-cms" %>
<%response.setHeader("Cache-Control", "public, max-age=180");%>
<cms:set var="area" value="$area"/>
<cms:if test="area==null||area==''">
	<cms:set var="area" value="ML"/>
</cms:if>
<%--<cms:beanmethod var="categories" beanName="ProgramManager" methodName="getProgramCategoryModels"/>--%>
<cms:beanmethod var="fanRankList" beanName="FanClubManager" methodName="getFanclubRankList" parametersString="%area;0;19"/>
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
	<cms:param name="tab" value="top"/>
</cms:include>
<div class="wrap fan">
	<!--Start 左列导航 -->
	<div class="left">
		<div class="fan_sidebar">
			<ul>
				<li><a href="/top"<cms:if test="area.equals('ML')"> class="cur"</cms:if>>内地最热饭团</a></li>
				<li><a href="/top?area=HT"<cms:if test="area.equals('HT')"> class="cur"</cms:if>>港台最热饭团</a></li>
				<li><a href="/top?area=US"<cms:if test="area.equals('US')"> class="cur"</cms:if>>欧美最热饭团</a></li>
				<li><a href="/top?area=KR"<cms:if test="area.equals('KR')"> class="cur"</cms:if>>韩国最热饭团</a></li>
				<li><a href="/top?area=JP"<cms:if test="area.equals('JP')"> class="cur"</cms:if>>日本最热饭团</a></li>
			</ul>
			<div class="fan_top_info">
				<h3>饭团排行榜规则说明</h3>

				<p class="c_6">按一周内<strong>新增成员数</strong>，<strong>新增帖子数</strong>和<strong>新增照片数</strong>之和来计算排名。</p>

				<p class="c_9">发帖传照片，让你的饭团排名更高吧！</p>
			</div>
		</div>
	</div>
	<!--End 左列导航 -->
	<div class="right">
		<ul class="fan_masstop">
			<cms:iterator status="raw" var="fanRank" value="fanRankList">
				<li class="list">
					<cms:if test="fanRank.rank==1">
						<span class="fl ico_fan_masstop1">${fanRank.rank}</span>
					</cms:if>
					<cms:elseif test="fanRank.rank==2">
						<span class="fl ico_fan_masstop2">${fanRank.rank}</span>
					</cms:elseif>
					<cms:elseif test="fanRank.rank==3">
						<span class="fl ico_fan_masstop3">${fanRank.rank}</span>
					</cms:elseif>
					<cms:else>
						<span class="fl ico_fan_masstop">${fanRank.rank}</span>
					</cms:else>
					<div class="fl fan_masstop_star">
						<a href="${fanSite}/${fanRank.id}" class="fl avatar J_fancard" target="_blank" data-fan-id="${fanRank.id}">
							<img src="${fanRank.headImg}" width="110" height="110">
						</a>

						<div class="cont">
							<h4>
								<a href="${fanSite}/${fanRank.id}" class="f18 c_690 name J_fancard" target="_blank" data-fan-id="${fanRank.id}">${fanRank.title}</a>
							</h4>

							<p class="c_9">本周新增帖子数：<strong class="c_6">${fanRank.topicNum}</strong></p>

							<p class="c_9">本周新增粉丝数：<strong class="c_6">${fanRank.memberNum}</strong></p>

							<p class="c_9">本周新增照片数：<strong class="c_6">${fanRank.photoNum}</strong></p>

							<p class="c_9">区域：<strong class="c_6">${fanRank.areaDescription}</strong></p>
							<a href="javascript:;" class="f14 ico_but_group J_join" data-fan-id="${fanRank.id}">加入饭团<span></span></a>
						</div>
					</div>
					<div class="fl fan_masstop_name">
						<span class="fl c_9">团长：</span>
						<cms:iterator var="manager" value="fanRank.managers">
							<a href="${homeSite}/${manager.userId}" class="fl avatar J_usercard" target="_blank" data-user-id="${manager.userId}">
								<img src="${manager.headImg}" width="50" height="50" alt="${manager.userName}">
							</a>
						</cms:iterator>
						<ul class="info">
							<cms:iterator var="topic" value="fanRank.lastFanTopicList">
								<li><a href="${fanSite}/topic/${topic.id}" target="_blank">
									<span class="point">▪</span>${topic.topicTitle}</a></li>
							</cms:iterator>
						</ul>
					</div>
				</li>
			</cms:iterator>
		</ul>
	</div>
</div>
<jsp:include page="include/footer.jsp"/>
<script type="text/javascript">
	require(['modules/yinyuetai/fan/join', 'fancard', 'modules/yinyuetai/user/usercard'], function(join, fancard, usercard) {
		var $container = $('.fan_masstop');
		fancard($container);
		$container.on('click', '.J_join', function(e) {
			var $target = $(e.currentTarget), fanId = $target.data('fanId');
			if (fanId) {
				join.joinFan(fanId);
			}
		})
	})
</script>
</body>
</html>