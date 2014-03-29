<%@ page session="false" contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="cms" uri="/buysou-cms" %>
<%response.setHeader("Cache-Control", "no-store");%>
<cms:beanmethodjson var="fanTopics" beanName="FanTopicManager" methodName="getAllFanTopicListByFanIdOrderByPinned" parametersString="$fid;0;20"/>
${fanTopics}