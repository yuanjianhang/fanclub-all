<%@ page session="false" contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="cms" uri="/buysou-cms" %>
<%response.setHeader("Cache-Control", "no-store");%>
<cms:beanmethod var="randomFanClubList" beanName="FanClubPromoManager" methodName="getRandomFanclubList" parametersString="5"/>
<cms:iterator var="fan" value="randomFanClubList">
	<li>
		<a href="${fanSite}/fan/${fan.id}" class="fl avatar J_fancard" data-fan-id="${fan.id}" target="_blank">
			<img src="${fan.headImg}" width="50" height="50">
		</a>

		<div class="fr content">
			<h4><a href="#" class="name special J_fancard" data-fan-id="${fan.id}" target="_blank">${fan.title}</a></h4>

			<p class="c_9">“${fan.reason}”</p>
		</div>
	</li>
</cms:iterator>