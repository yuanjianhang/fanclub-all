<%@ page session="false" contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="cms" uri="/buysou-cms" %>
<%response.setHeader("Cache-Control", "no-store");%>
<cms:set var="userId" value="$userId"/>
<cms:beanmethod var="fanClubs" beanName="FanMemberManager" methodName="getRecentlyVisitedFanclubList" parametersString=""/>
<div class="fan_wo_tab" id="fansTab">
	<cms:if test="fanClubs.size()>0">
		<a href="javascript:;" class="cur" data-type="visit">我常去的饭团<span class="arrow"></span></a>
	</cms:if>
	<a href="javascript:;"<cms:if test="fanClubs.size()<=0"> class="cur"</cms:if> data-type="join">我加入的饭团<span class="arrow"></span></a>
	<a href="javascript:;" data-type="manage">我管理的饭团<span class="arrow"></span></a>
</div>
<cms:if test="fanClubs.size()<=0">
	<cms:set var="type" value="join"/>
	<cms:beanmethod var="fanClubs" beanName="FanMemberManager" methodName="getIJoinedFanClubList" parametersString="0;10"/>
</cms:if>
<div class="fan_wo_list" id="fansList">
	<jsp:include page="../include/fans.jsp"/>
</div>