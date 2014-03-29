<%@ page session="false" contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="cms" uri="/buysou-cms" %>
<%response.setHeader("Cache-Control", "no-store");%>
<cms:set var="type" value="$type"/>
<cms:set var="userId" value="$userId"/>
<cms:if test="type.equals('join')">
	<cms:beanmethod var="fanClubs" beanName="FanMemberManager" methodName="getIJoinedFanClubList" parametersString="0;10"/>
</cms:if>
<cms:elseif test="type.equals('manage')">
	<cms:beanmethod var="fanClubs" beanName="FanManagerManager" methodName="getManagedFanclubIdsByUserId" parametersString="0;10"/>
</cms:elseif>
<cms:elseif test="type.equals('visit')">
	<cms:beanmethod var="fanClubs" beanName="FanMemberManager" methodName="getRecentlyVisitedFanclubList" parametersString=""/>
</cms:elseif>
<jsp:include page="../include/fans.jsp"/>