<%@ page session="false" contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="cms" uri="/buysou-cms" %>
<%response.setHeader("Cache-Control", "no-store");%>
<cms:beanmethodjsonpaged var="posts" beanName="FanTopicManager" listMethodName="getTopicPosts" countMethodName="getTotalReplyNumByTopicId" parametersString="$topicId" pageSize="15" pageNum="$page"/>
${posts}