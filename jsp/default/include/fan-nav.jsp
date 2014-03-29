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
<div class="fan_nav area">
	<div class="con">
		<div class="fl group_tab">
			<a href="/fanclub/${fid}"<%=selected("index", curTab)%>>主页</a>
			<span class="ico_line"></span>
			<a href="/fanclub/mv/${fid}"<%=selected("mv", curTab)%>>MV</a>
			<span class="ico_line"></span>
			<a href="/fanclub/topics/${fid}/0"<%=selected("topic", curTab)%>>帖子</a>
			<span class="ico_line"></span>
			<a href="/fanclub/albums/${fid}"<%=selected("photo", curTab)%>>照片</a>
			<span class="J_manager" style="display: none"><span class="ico_line"></span>
			<a href="/fanclub/manage/${fid}"<%=selected("manage", curTab)%>>饭团管理</a></span>
		</div>
	</div>
	<span class="bg"></span>
</div>