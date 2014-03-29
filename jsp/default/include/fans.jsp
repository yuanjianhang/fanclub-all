<%@ page session="false" contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="cms" uri="/buysou-cms" %>
<cms:if test="fanClubs.size()>0">
	<ul class="clearfix">
		<cms:iterator value="fanClubs" var="it" status="row">
			<cms:if test="(type=='join'||type=='manage') && row.index==9">
				<li class="more">
					<a href="${homeSite}/${userId}/fan/${type}" target="_blank">更多…</a>
				</li>
			</cms:if>
			<cms:else>
				<li>
					<a href="${fanSite}/${it.id}" class="pic J_fancard" data-fan-id="${it.id}" target="_blank">
						<img src="${it.headImg}" width="110" height="110"/>
						<cms:if test="it.updated">
							<span class="ico_fan_news"></span>
						</cms:if>
					</a>
					<h4><a href="${fanSite}/${it.id}" class="name J_fancard" data-fan-id="${it.id}" target="_blank">${it.title}</a></h4>
				</li>
			</cms:else>
		</cms:iterator>
	</ul>
</cms:if>
<cms:else>
	<div class="no_result">
		<span class="ico_exp01"></span>

		<div class="no_result_right">
			<cms:if test="type.equals('manage')">
				<h3 class="no_result_sorry">你还没有管理饭团哦！</h3>

				<p>饭团管理员可是声望很高的哦！嗯！</p>
			</cms:if>
			<cms:elseif test="type.equals('join')">
				<h3 class="no_result_sorry">你还没有加入饭团哦！</h3>

				<p class="c_6">去逛一逛音悦Tai 里那些好玩的饭团吧！</p>

				<p><a href="${fanSite}" target="_blank" class="special">饭团由此去</a></p>
			</cms:elseif>
		</div>
	</div>
</cms:else>