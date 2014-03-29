<%@ page session="false" contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="cms" uri="/buysou-cms" %>
<%response.setHeader("Cache-Control", "no-store");%>
<cms:beanmethodjsonpaged var="topics" beanName="FanTopicManager" countMethodName="getFanTopicCountByFanIdAndCategoryId" listMethodName="getFanTopicsByFanIdAndCategoryIdOrderByPinned" pageNum="$page" pageSize="20" parametersString="$fid;$cid"/>
${topics}