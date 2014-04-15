<%--

  Simple Text.

  A simple text component created to depict the use of the cq:emptyText 
  property and other properties.

--%>

<%@page contentType="text/html" pageEncoding="utf-8"%>
<%@include file="/libs/foundation/global.jsp"%>

<%
    String text = properties.get("./text", String.class);
    if (text == null) {
        // This will cause to show the value of the "cq:emptyText" property
        editContext.getEditConfig().setEmpty(true);
    } else {
        %> <cq:text property="text" tagClass="text"/> <%
    }
%>

