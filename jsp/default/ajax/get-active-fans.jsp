<%@ page session="false" contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="cms" uri="/buysou-cms" %>
<%response.setHeader("Cache-Control", "public, max-age=180");%>
<cms:beanmethod var="fanClubs" beanName="FanClubManager" methodName="getFansByMemberAndTopicCount" parametersString="0;10"/>
<jsp:include page="../include/fans.jsp"/>