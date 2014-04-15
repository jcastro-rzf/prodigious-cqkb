package com.tmobile.wem.services.osgi;

import java.io.IOException;
import java.util.Enumeration;

import javax.jcr.Node;
import javax.jcr.Session;
import javax.servlet.ServletException;

import org.apache.felix.scr.annotations.Component;
import org.apache.felix.scr.annotations.Properties;
import org.apache.felix.scr.annotations.Property;
import org.apache.felix.scr.annotations.Service;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.servlets.SlingAllMethodsServlet;
import org.apache.sling.servlets.post.HtmlResponse;
import org.osgi.framework.Constants;

import com.day.text.Text;

/* 

    THIS IS THE SERVLET THAT HAS TO BE LOADED TO FELIX TO HANDLE DATA UPDATE IN THE GRID

 */
@Component(immediate = true, metatype = true, label = "Bulk Editor Servlet")
@Service
@Properties({
        @Property(name = "sling.servlet.paths", label = "Servlet Path", value = "/bin/custom/bulk"),
        @Property(name = Constants.SERVICE_VENDOR, value = "Razorfish") })
public class BulkEditorServlet extends SlingAllMethodsServlet {

    private static final long serialVersionUID = 3081998622354023650L;

    @Override
    protected void doGet(SlingHttpServletRequest request,
            SlingHttpServletResponse response) throws ServletException,
            IOException {
        processData(request, response);
    }

    @Override
    protected void doPost(SlingHttpServletRequest request,
            SlingHttpServletResponse response) throws ServletException,
            IOException {
        processData(request, response);
    }

    private void processData(SlingHttpServletRequest request, SlingHttpServletResponse response) {
        ResourceResolver resourceResolver = request.getResourceResolver();
        Session session = resourceResolver.adaptTo(Session.class);
        HtmlResponse htmlResponse = null;
        try {
            boolean updated = false;
            Enumeration<Object> names = request.getParameterNames();
            while (names.hasMoreElements()) {
                try {
                    String path = (String) names.nextElement();
                    if (path.startsWith("/") && path.contains("@Delete")) {
                        String nodePath = path.replaceAll("@Delete", "");
                        Resource nodeResource = resourceResolver.getResource(nodePath);
                        if (nodeResource != null) {
                            // Remove node
                            Node deletedNode = nodeResource.adaptTo(Node.class);
                            if (deletedNode != null ) {
                                deletedNode.remove();
                                updated = true;
                            }
                        }
                    } else if (path.startsWith("/")) {
                        String value = request.getParameter(path);
                        Resource r = resourceResolver.getResource(path);
                        String propertyName = Text.getName(path);
                        if (r == null) {
                            //resource does not exist. 2 cases:
                            // - maybe it is a non existing property? property has to be created
                            // - maybe it is a new row? node has to be created first
                            String rowPath = Text.getRelativeParent(path, 1);
                            Resource rowResource = resourceResolver.getResource(rowPath);
                            if (rowResource != null) {
                                //add property to node
                                Node rowNode = rowResource.adaptTo(Node.class);
                                if(rowNode != null ) {
                                    rowNode.setProperty(propertyName, value);
                                    updated = true;
                                }
                            } else {
                                //create node and add property
                                String parentPath = Text.getRelativeParent(path, 2);
                                Resource parentResource = resourceResolver.getResource(parentPath);
                                if (parentResource != null) {
                                    Node parentNode = parentResource.adaptTo(Node.class);
                                    if (parentNode != null) {
                                        String nodeToCreateName = Text.getName(rowPath);
                                        Node rowNode = parentNode.addNode(nodeToCreateName);
                                        rowNode.setProperty(propertyName,value);
                                        updated = true;
                                    }
                                }
                            }
                        } else {
                            //path should already be the property path
                            javax.jcr.Property p = r.adaptTo(javax.jcr.Property.class);
                            if (p != null) {
                                p.setValue(value);
                                updated = true;
                            }
                        }
                    }
                } catch (Exception e) {}
            }

            if (updated) {
                session.save();
            }
            
            htmlResponse = new HtmlResponse();
            htmlResponse.setStatus(200, "Data Saved");
            htmlResponse.setCreateRequest(true);
            //htmlResponse = HtmlStatusResponseHelper.createStatusResponse(true,
            //        "Data saved");
            
        } catch (Exception e) {
            htmlResponse.setStatus(500, "Error while saving data");
            htmlResponse.setCreateRequest(true);
            htmlResponse.setError(e);
            //htmlResponse = HtmlStatusResponseHelper.createStatusResponse(false,
            //        "Error while saving data", e.getMessage());
        }
        try {
            htmlResponse.send(response, true);
        } catch (IOException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
    }

}
