
/* This method verifies that the image has the exact width and height */
function validImageDimension(imageComponent, widths, heights) {
    validImageDimensionGeneral(imageComponent, widths, heights, false);
}

/* This method verifies that the width and height of the image are lower than 
   the specified values */
function validImageMaxDimension(imageComponent, widths, heights) {
    validImageDimensionGeneral(imageComponent, widths, heights, true);
}

/* This method verifies the image dimensions according to the boolean flag 
   'maxDimensions':
   1. The image has the exact width and height.
   2. The width and height of the image are lower than the specified values */
function validImageDimensionGeneral(imageComponent, widths, heights, 
                                    maxDimensions) {
    var width = imageComponent.originalRefImage.width;
    var height = imageComponent.originalRefImage.height;
    var length = Math.min(widths.length, heights.length);

    var w, h = null;
    var imageValid = false;
    var freeWidth = false;
    var freeHeight = false;
    for (var i = 0; i < length; i++) {
        w = widths[i];
        h = heights[i];
        
        if (w == 0) {
            freeWidth = true;
        }
        if (h == 0) {
            freeHeight = true;
        }

        if (maxDimensions) {
            if (( w >= width ) && ( h >= height )) {
                imageValid = true;
            }
        } else {
            if ((( w == width || w == 0 ) && ( h == height || h == 0 )) 
                || (freeWidth && freeHeight)) {
                imageValid = true;
            }
        }
    }

    if (!imageValid) {
        var sizes = "";
        for (var i = 0 ; i < length ; i++) {
            if (( i + 1 ) == length && i != 0) {
                sizes += " and ";
            } else {
                if (i != 0) {
                    sizes += ", ";
                }
            }
        
            if (!freeWidth && !freeHeight) {
                sizes += widths[i] + "x" + heights[i];
            } else if (freeHeight) {
                sizes += "must be " + widths[i] + " of width";
            } else if (freeWidth) {
                sizes += "must be " + heights[i] + " of height";
            }
        }

        var allowedDimensionsText = ' Allowed dimensions are: ';
        if (maxDimensions) {
            allowedDimensionsText = ' Allowed max dimensions are: ';
        }
        
        CQ.Ext.MessageBox.alert(CQ.I18n.getMessage("Invalid Image"), 
                CQ.I18n.getMessage('Image dimensions ' + width + 'x' + height 
                        + ' are not valid.' + allowedDimensionsText + sizes));

        imageComponent.reset();
        imageComponent.reset();
        imageComponent.reset();
    }
}
