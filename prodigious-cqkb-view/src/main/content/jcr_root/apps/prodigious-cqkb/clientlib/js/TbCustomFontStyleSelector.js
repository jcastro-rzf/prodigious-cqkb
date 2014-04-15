/*
 * This extended class is used just to change the label next to the dropdown.
 *
 * @version 1.0
 *
 */

/**
 * @class CQ.form.rte.ui.TbCustomFontStyleSelector
 * @extends CQ.form.rte.ui.TbStyleSelector
 * @private
 * This class represents a TMO font style selecting element for use in
 * {@link CQ.form.rte.ui.ToolbarBuilder}.
 */
CQ.form.rte.ui.TbCustomFontStyleSelector = CQ.Ext.extend(CQ.form.rte.ui.TbStyleSelector, {

    constructor: function(id, plugin, tooltip, styles) {
        CQ.form.rte.ui.TbStyleSelector.superclass.constructor.call(this, id, plugin, false,
                tooltip);
        this.styles = styles;
    },

    addToToolbar: function(toolbar) {
        this.toolbar = toolbar;
        if (CQ.Ext.isIE) {
            // the regular way doesn't work for IE anymore with Ext 3.1.1, hence working
            // around
            var helperDom = document.createElement("span");
            helperDom.innerHTML = "<select class=\"x-font-select\">"
                    + this.createStyleOptions() + "</span>";
            this.styleSelector = CQ.Ext.get(helperDom.childNodes[0]);
        } else {
            this.styleSelector = CQ.Ext.get(CQ.Ext.DomHelper.createDom({
                tag: "select",
                cls: "x-font-select",
                html: this.createStyleOptions()
            }));
        }
        this.initializeSelector();
        toolbar.add(
            CQ.I18n.getMessage("Font Style"),
            " ",
            this.styleSelector.dom,
            this.getRemoveButton()
        );
    },

});