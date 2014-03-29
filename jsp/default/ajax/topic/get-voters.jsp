<%--
  Created by IntelliJ IDEA.
  User: Administrator
  Date: 14-3-4
  Time: 下午4:31
  To change this template use File | Settings | File Templates.
--%>
<%@ page session="false" contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="cms" uri="/buysou-cms" %>
<cms:beanmethodjsonpaged var="voters" beanName="FanVoteManager" listMethodName="getVoteUserListByVoteItemId"
                         countMethodName="getVoteUserCountByVoteItemId" pageNum="$page" pageSize="30" parametersString="$voteItemId"/>
${voters}
