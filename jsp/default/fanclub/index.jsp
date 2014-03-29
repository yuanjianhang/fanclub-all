<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="cms" uri="/buysou-cms" %>
<%response.setHeader("Cache-Control", "public, max-age=180");%>
<cms:set var="fid" value="$fid"/>
<cms:beanmethod var="fanclub" beanName="FanClubManager" methodName="getFanClubSingleViewModel" parametersString="$fid"/>
<cms:beanmethod var="fanVideos" beanName="FanVideoManager" methodName="getVideoListByFanId" parametersString="$fid;0;4"/>
<cms:beanmethod var="activeFanMembers" beanName="FanMemberManager" methodName="getActiveFanMembers" parametersString="3"/>
<cms:beanmethod var="friendFans" beanName="FriendFanManager" methodName="getFriendFanList" parametersString="$fid;0;5"/>
<cms:beanmethod var="friendLinks" beanName="FriendLinkManager" methodName="getFriendLinksByFanclubId" parametersString="$fid;0;5"/>
<cms:beanmethod var="fanManagers" beanName="FanManagerManager" methodName="getAllEnabledManagerUsers" parametersString="$fid"/>
<!DOCTYPE HTML>
<html lang="zh-cmn-Hans">
<head>
	<meta charset="UTF-8">
	<title>${siteName} -- ${siteTitle}</title>
	<link href="${urlStatic}/v2/css/common.css" rel="stylesheet" type="text/css">
	<link href="${urlStatic}/v2/css/app/fan/fan.css" rel="stylesheet" type="text/css">
	<link href="${urlStatic}/v2/css/modules/imgareaselect-default.css" rel="stylesheet" type="text/css">
	<jsp:include page="../include/js_common.jsp" />
	<cms:include value="../include/fan-body-bg.jsp" />
</head>
<body>
<cms:include value="../include/topbar.jsp">
	<cms:param name="tab" value="fan"/>
</cms:include>
<div class="w_auto" id="wAuto">
	<cms:include value="../include/fan-nav.jsp">
		<cms:param name="tab" value="index"/>
	</cms:include>
	<div class="wrap fan clearfix">
		<div class="main">
			<!--Start 饭团公告 -->
			<div class="fan_ann" id="fan_ann">
				<h3 class="fl ico_fan_ann">饭团公告 </h3>
				<a href="javascript:;" class="edit special J_manager J_edit_notice" style="display: none"><span class="ico_fan_edit1"></span>编辑</a>

				<p class="info">${fanclub.notice}</p>
			</div>
			<!--End 饭团公告 -->
			<!--Start 饭团最新MV-->
			<div class="fan_newmv">
				<div class="fan_title">
					<h3 class="fl f18">饭团最新MV</h3>
					<a href="/fanclub/mv-all/${fid}" class="fr special">查看更多</a>
				</div>

				<ul class="fan_newmv_list">
					<cms:iterator value="fanVideos" var="video">
						<li class="list">
							<div class="mv_pic">
								<a target="_blank" class="pic play_pic6" href="${vSite}/video/${video.id}">
									<img width="160" height="90" src="${video.bigHeadImg}" alt="${video.filterTitle}"/>

									<span class="ico_play">播放</span>
								</a>
								<h4 class="title">
									<a href="${vSite}/video/${video.id}" target="_blank" title="${video.filterTitle}">${video.filterTitle}</a>
								</h4>

								<a href="${mainSite}/artist/${video.artistId}" class="name special" title="${video.artistName}">${video.artistName}</a>

								<p class="c_9">播放<span class="c_3">${video.totalViews}</span></p>
							</div>
						</li>
					</cms:iterator>
				</ul>
			</div>
			<!--End 饭团最新MV -->
			<!-- Start 最新帖子 -->
			<div class="fan_posts">
				<div class="fan_title">
					<h3 class="fl f18">饭团最新帖子</h3>
					<a href="/fanclub/topics/${fid}" class="fr special">查看更多</a>
				</div>
				<div id="fan_posts">
					<div class="fan_posts_list_loading fan-loading J_fan_posts_loading"></div>
					<ul class="fan_posts_list J_fan_posts_list J_fan_edit_list">
					</ul>
				</div>
			</div>
			<!-- End 最新帖子 -->
		</div>
		<!--Start 右列 -->
		<div class="side">
			<!-- 修改大头图 -->
			<div class="fan-bigHeadImg" id="fan_bigHeadImg">
				<a href="javascript:void(0);"><span class="ico_fan_edit_bigHeadImg"></span>编辑头图</a>
			</div>
			<!-- 修改大头图over -->
			<!-- 饭团艺人 -->
			<div class="sd_fan_user" id="sd_fan_user">
				<div href="/fanclub/${fid}" class="fl avatar">
					<img width="66" height="66" src="${fanclub.headImg}" class="J_avatar"/>
					<a class="ico_fan_edit2 J_manager J_edit_avatar" href="javascript:;" style="display: none">更换头像</a>
				</div>
				<a href="${fanSite}/fanclub/${fanclub.id}" class="name f18">${fanclub.title}的饭团</a>
				<ul class="sd_user_name mr_t5">
					<li>
						<a target="_blank" href="/fanclub/mv-all/${fid}"><span class="c_c pd_lf0">MV</span><strong>20</strong></a>
					</li>
					<li>
						<a target="_blank" href="#"><span class="c_c">团员</span><strong><em>|</em>231</strong></a>
					</li>
					<li>
						<a target="_blank" href="/fanclub/topics/${fid}"><span class="c_c">帖子</span><strong><em>|</em>1</strong></a>
					</li>
				</ul>

				<p class="area"><a href="${fanSite}/fanTop" class="fr special">查看全部排名</a>
					<span class="c_9">${fanclub.areaDescription}地区排名：</span>${fanclub.fanClubRank} </p>
				<span class="sd_fan_user_bg"></span>
			</div>
			<!-- 饭团团长 -->
			<div class="sd_title pd_t70">
				<h3 class="f16">饭团团长</h3>
			</div>
			<ul class="sd_follow">
				<cms:iterator value="fanManagers" var="manager">
					<li>
						<a href="${homeSite}/${manager.id}" target="_blank" class="fl avatar J_usercard" data-user-id="${manager.id}">
							<img width="50" height="50" src="${manager.headImg}" alt=""/>
						</a>
						<h4 class="name">
							<a href="${homeSite}/${manager.id}" target="_blank" class="special J_usercard" data-user-id="${manager.id}">${manager.userName}</a>
						</h4>

						<div class="user_button">
							<a class="fl ico_card_follow J_follow" href="javascript:;" data-user-id="${manager.id}">加关注</a>
							<a class="fl ico_card_letter J_letter" href="javascript:;" data-user-id="${manager.id}" data-user-name="${manager.userName}">发私信</a>
						</div>
					</li>
				</cms:iterator>
			</ul>
			<cms:if test="activeFanMembers.size()>0">
				<!-- 饭团活跃成员 -->
				<div class="sd_title mr_t20">
					<h3 class="fl f16">饭团活跃成员</h3>
					<a href="#" class="fr mr_t5 special">查看全部成员</a>
				</div>
				<ul class="sd_follow">
					<cms:iterator value="activeFanMembers" var="member">
						<li>
							<a href="${homeSite}/${member.id}" target="_blank" class="fl avatar J_usercard" data-user-id="${member.id}">
								<img width="50" height="50" src="${member.headImg}" alt=""/></a>
							<h4 class="name">
								<a href="${homeSite}/${member.id}" class="special J_usercard" data-user-id="${member.id}">${member.userName}</a>
							</h4>

							<div class="user_button">
								<a class="fl ico_card_follow J_follow" href="javascript:;" data-user-id="${member.id}">加关注</a>
								<a class="fl ico_card_letter J_at" href="javascript:;" data-user-id="${member.id}" data-user-name="${member.userName}">@
									Ta</a>
							</div>
						</li>
					</cms:iterator>
				</ul>
			</cms:if>
			<!-- 饭团最热MV -->
			<div class="sd_title mr_t20">
				<h3 class="f16">饭团最热MV</h3>
			</div>
			<div class="sd_fan_mv">
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
			</div>
			<!-- 友情饭团 -->
			<div class="sd_title">
				<h3 class="f16">友情饭团</h3>
			</div>
			<ul class="sd_follow">
				<cms:iterator value="friendFans" var="friendFan">
					<li>
						<a href="${fanSite}/${friendFan.fanId}" class="fl avatar J_fancard" data-fan-id="${friendFan.fanId}" target="_blank">
							<img width="50" height="50" src="${friendFan.headImg}" alt=""/></a>
						<h4 class="name">
							<a href="${fanSite}/${friendFan.fanId}" class="special J_fancard" title="${friendFan.fanTitle}" data-fan-id="${friendFan.fanId}" target="_blank">${friendFan.fanTitle}</a>
						</h4>

						<p class="c_9"><strong class="c_6">${friendFan.topicNum}</strong>帖子 |
							<strong class="c_6">${friendFan.totalFanNum}</strong>成员</p>
					</li>
				</cms:iterator>
			</ul>
			<cms:if test="friendLinks.size()>0">
				<!-- 饭团重要链接 -->
				<div class="sd_title mr_t20">
					<h3 class="f16">朴有天饭团重要链接</h3>
				</div>
				<ul class="sd_link">
					<cms:iterator value="friendLinks" var="friendLink">
						<li><a href="${friendLink.url}" title="${friendLink.title}" target="_blank">${friendLink.title}</a></li>
					</cms:iterator>
				</ul>
			</cms:if>
		</div>
		<!--End 右列 -->
	</div>
</div>
<jsp:include page="../include/footer.jsp"/>
<script type="text/html" id="edit_notice_tpl">
	<form action="/update-fan-club-notice" method="post">
		<div class="p_letter com_area_box clearfix">
			<input type="hidden" name="fanId" value="${fid}"/>
			<textarea class="com_area f14" name="notice">{{notice}}</textarea>
			<input class="fr ico_ct_cancel J_close" value="取消" type="button">
			<input name="" class="fr ico_ct_release" value="确定" type="submit">
		</div>
	</form>
</script>
<script typle="text/javascript">
	require(['app/fan/fanclub/index', 'app/fan/fanclub/topic'], function(app, topic) {
		app.init({
			fid : "${fid}"
		});
		topic.initPostsCategory();
		topic.initTopics({
			url : "/ajax/fanclub/get-home-topics",
			data : {
				fid : "${fid}"
			}
		});
		topic.initPostsList();
		topic.initPostsListPage();
		topic.getTopics().fetch();
		topic.bindUserLoginedEvents();
	});
</script>
</body>
</html>