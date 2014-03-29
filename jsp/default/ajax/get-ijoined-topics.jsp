<%@ page session="false" contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="cms" uri="/buysou-cms" %>
<%response.setHeader("Cache-Control", "no-store");%>
<cms:beanmethodjson var="topics" beanName="FanTopicManager" methodName="getFanTopicByIJoinedFans" parametersString="0;10"/>
${topics}