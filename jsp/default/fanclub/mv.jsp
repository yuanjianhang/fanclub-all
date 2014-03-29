<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="cms" uri="/buysou-cms" %>
<%response.setHeader("Cache-Control", "public, max-age=180");%>
<cms:set var="fid" value="$fid"/>
<!DOCTYPE HTML>
<html lang="zh-cmn-Hans">
<head>
	<meta charset="UTF-8">
	<title>${siteName} -- ${siteTitle}</title>
	<link href="${urlStatic}/v2/css/common.css" rel="stylesheet" type="text/css">
	<link href="${urlStatic}/v2/css/app/fan/fan.css" rel="stylesheet" type="text/css">
	<jsp:include page="../include/js_common.jsp"/>
	<cms:include page="../include/fan-body-bg.jsp" />
</head>
<body>
<cms:include value="../include/topbar.jsp">
	<cms:param name="tab" value="fan"/>
</cms:include>
<div class="w_auto" id="wAuto">
	<cms:include value="../include/fan-nav.jsp">
		<cms:param name="tab" value="mv"/>
	</cms:include>
	<div class="wrap fan clearfix">

	</div>
</div>
<jsp:include page="../include/footer.jsp"/>
</body>
</html>