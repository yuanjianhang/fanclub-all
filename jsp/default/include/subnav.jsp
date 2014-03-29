<%@ page session="false" contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="cms" uri="/buysou-cms" %>
<%
	String curTab = request.getParameter("tab");
	if (curTab == null) {
		curTab = "index";
	}
%>
<%!
	String selected(String tab, String curTab) {
		if (tab.equals(curTab)) {
			return " class=\"cur\"";
		}
		return "";
	}
%>
<!--Start 二级通用导航 -->
<div class="area subnav_pd subnav">
	<h2 class="fl subnav_title">饭团</h2>

	<div class="fr group_tab pd_tb">
		<a href="/fanMass"<%=selected("index", curTab)%>>饭团广场</a>
		<span class="ico_line"></span>
		<a href="/fanTop"<%=selected("top", curTab)%>>爬行榜</a>
		<span class="ico_line"></span>
		<a href="/fanAll"<%=selected("all", curTab)%>>全部饭团</a>
	</div>
</div>