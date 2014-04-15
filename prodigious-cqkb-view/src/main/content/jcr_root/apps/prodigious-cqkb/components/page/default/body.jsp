<%--

  Default Page component.

  A simple test page with a parsys container used to drag-and-drop components.

--%>

<%@include file="/libs/foundation/global.jsp"%>
<%@page session="false" %>

<%
    // TODO add you code here
%>

<body>
    <img src="http://prodigious.cr/images/new_version/prodigious-logo.jpg" alt="Prodigious brand logistics&#8482;" ><br>
    <cq:includeClientLib js="prodigious.cqwidgets.dynamictabs"/>
    <h1 style="text-align:center; text-transform:uppercase;">
       Custom CQ Widgets - Demo Page
    </h1>
    <br>
    <div>
        <cq:include path="components" resourceType="foundation/components/parsys" />
    </div>
</body>