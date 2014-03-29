<%@ page session="false" contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="cms" uri="/buysou-cms" %>
<%response.setHeader("Cache-Control", "public, max-age=180");%>
<cms:set var="type" value="$type"/>
<cms:if test="type==''||type.equals('all')">
	<cms:beanmethodjson var="topics" beanName="FanTopicManager" methodName="getNewestFanTopicList" parametersString="0;10"/>
</cms:if>
<cms:elseif test="type.equals('hot')">
	<cms:beanmethodjson var="topics" beanName="FanTopicManager" methodName="getHotFanTopicList" parametersString="0;10"/>
</cms:elseif>
${topics}