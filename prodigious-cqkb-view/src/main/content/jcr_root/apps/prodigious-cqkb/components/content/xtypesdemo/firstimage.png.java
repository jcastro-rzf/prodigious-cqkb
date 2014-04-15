package apps.prodigious_002dcqwidgets.components.content.xtypesdemo;

import java.io.IOException;
import java.io.InputStream;

import javax.jcr.RepositoryException;
import javax.jcr.Property;
import javax.servlet.http.HttpServletResponse;

import com.day.cq.commons.ImageResource;
import com.day.cq.wcm.foundation.Image;
import com.day.cq.wcm.commons.RequestHelper;
import com.day.cq.wcm.commons.WCMUtils;
import com.day.cq.wcm.commons.AbstractImageServlet;
import com.day.cq.wcm.api.Page;
import com.day.cq.commons.SlingRepositoryException;
import com.day.image.Layer;
import org.apache.commons.io.IOUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.api.servlets.SlingSafeMethodsServlet;

/**
 * Renders an image
 */
public class firstimage_png extends AbstractImageServlet {

    protected Layer createLayer(ImageContext context) throws RepositoryException, IOException {
        return null;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    protected ImageResource createImageResource(Resource resource) {
        return new Image(resource);
    }

    protected void writeLayer(SlingHttpServletRequest request, SlingHttpServletResponse response, ImageContext context, Layer layer) throws IOException, RepositoryException {
        Image image = new Image(context.resource, "./firstimage");
        
        if (!image.hasContent()) {
            response.sendError(HttpServletResponse.SC_NOT_FOUND);
            return;
        }

        image.loadStyleData(context.style);

        layer = image.getLayer(false, false, false);
        boolean modified = false;

        if (layer != null) {
            modified = image.crop(layer) != null;
            modified |= image.resize(layer) != null;
            modified |= image.rotate(layer) != null;
            modified |= applyDiff(layer, context);
        }
        
        if (modified) {
            response.setContentType("image/png");
            layer.write("image/png", 1.0, response.getOutputStream());
        } else {
            Property data = image.getData();
            InputStream input = data.getStream();
            response.setContentLength((int) data.getLength());
            response.setContentType(image.getMimeType());
            IOUtils.copy(input, response.getOutputStream());
            input.close();
        }
        
        response.flushBuffer();
    }
    
}
