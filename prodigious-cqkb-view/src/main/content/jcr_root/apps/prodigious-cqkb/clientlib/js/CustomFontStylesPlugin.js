/*
 * This custom plugin that creates a new style dropdown based off of the 
 * built-in Styles plugin. This plugin also uses the TbCustomFontStyleSelector 
 * class (which overlays the TbStyleSelector class) to change the dropdown 
 * label.
 *
 * @version 1.0
 *
 */

/**
 * @class CQ.form.rte.plugins.StylesPlugin
 * @extends CQ.form.rte.plugins.Plugin
 * <p>This class implements styling text fragments with a CSS class (using "span" tags) as a
 * plugin.</p>
 * <p>The plugin ID is "<b>tmofontstyles</b>".</p>
 * <p><b>Features</b></p>
 * <ul>
 *   <li><b>styles</b> - adds a style selector (styles will be applied on selection scope)
 *     </li>
 * </ul>
 * <p><b>Additional config requirements</b></p>
 * <p>The following plugin-specific settings must be configured through the corresponding
 * {@link CQ.form.rte.EditorKernel} instance:</p>
 * <ul>
 *   <li>The stylesheets to be used must be provided through
 *     {@link CQ.form.RichText#externalStyleSheets}.</li>
 * </ul>
 */
CQ.form.rte.plugins.StylesPlugin = CQ.Ext.extend(CQ.form.rte.plugins.Plugin, {

    /**
     * @cfg {Object/Object[]} styles
     * <p>Defines CSS classes that are available to the user for formatting text fragments
     * (defaults to { }). There are two ways of specifying the CSS classes:</p>
     * <ol>
     *   <li>Providing styles as an Object: Use the CSS class name as property name.
     *   Specify the text that should appear in the style selector as property value
     *   (String).</li>
     *   <li>Providing styles as an Object[]: Each element has to provide "cssName" (the
     *   CSS class name) and "text" (the text that appears in the style selector)
     *   properties.</li>
     * </ol>
     * <p>Styling is applied by adding "span" elements with corresponding "class"
     * attributes appropriately.</p>
     * @since 5.3
     */

    /**
     * @private
     */
    cachedStyles: null,

    /**
     * @private
     */
    stylesUI: null,

    constructor: function(editorKernel) {
        CQ.form.rte.plugins.StylesPlugin.superclass.constructor.call(this, editorKernel);
    },

    getFeatures: function() {
        return [ "customfontstyles" ];
    },

    reportStyles: function() {
        return [ {
                "type": "text",
                "styles": this.getStyles()
            }
        ];
    },

    getStyles: function() {
        var com = CQ.form.rte.Common;
        if (!this.cachedStyles) {
            this.cachedStyles = this.config.styles || { };
            com.removeJcrData(this.cachedStyles);
            this.cachedStyles = com.toArray(this.cachedStyles, "cssName", "text");
        }
        return this.cachedStyles;
    },
    
    initializeUI: function(tbGenerator) {
        var plg = CQ.form.rte.plugins;
        var ui = CQ.form.rte.ui;
        if (this.isFeatureEnabled("customfontstyles")) {
            this.stylesUI = new ui.TbCustomFontStyleSelector("customfontstyles", this, this.getTooltip("customfontstyles"), this.getStyles());
            tbGenerator.addElement("customfontstyles", plg.Plugin.SORT_STYLES, this.stylesUI, 10);
        }
    },

    notifyPluginConfig: function(pluginConfig) {
        pluginConfig = pluginConfig || { };
        CQ.Util.applyDefaults(pluginConfig, {
            "styles": {
                // empty default value
            }
        });
        this.config = pluginConfig;
    },

    execute: function(cmdId) {
        if (!this.stylesUI) {
            return;
        }
        var cmd = null;
        var value = null;
        switch (cmdId.toLowerCase()) {
            case "customfontstyles":
                cmd = "applystyle";
                value = this.stylesUI.getSelectedStyle();
                break;
            case "tmofontstyles_remove":
                cmd = "removestyle";
                value = {
                    "styles": this.getStyles()
                };
                break;
        }
        if (cmd) {
            this.editorKernel.relayCmd(cmd, value);
        }
    },

    updateState: function(selDef) {
        if (!this.stylesUI || !this.stylesUI.getExtUI()) {
            return;
        }
        var com = CQ.form.rte.Common;
        var styles = selDef.styles;
        var actualStyles = [ ];
        var indexToSelect, s;
        var styleableObject = selDef.selectedDom;
        if (styleableObject) {
            if (!CQ.form.rte.Common.isTag(selDef.selectedDom,
                    CQ.form.rte.plugins.StylesPlugin.STYLEABLE_OBJECTS)) {
                styleableObject = null;
            }
        }
        var selectorDom = this.stylesUI.getExtUI().dom;
        var removeBtn = this.stylesUI.getRemoveButtonUI();
        var stylesDef = this.getStyles();
        var styleCnt = stylesDef.length;
        var optionFound = false;
        if (styleableObject) {
            for (s = 0; s < styleCnt; s++) {
                var styleName = stylesDef[s].cssName;
                if (com.hasCSS(styleableObject, styleName)) {
                    actualStyles.push({
                        "className": styleName
                    });
                }
            }
        } else {
            var checkCnt = styles.length;
            for (var c = 0; c < checkCnt; c++) {
                var styleToProcess = styles[c];
                for (s = 0; s < styleCnt; s++) {
                    if (stylesDef[s].cssName == styleToProcess.className) {
                        actualStyles.push(styleToProcess);
                        optionFound = true;
                        break;
                    }
                }
            }
        }
        if (actualStyles.length == 0) {
            indexToSelect = 0;
        } else if (actualStyles.length > 1) {
            indexToSelect = -1;
        } else {
            if (selDef.isContinuousStyle || styleableObject || optionFound) {
                var styleToSelect = actualStyles[0];
                var options = selectorDom.options;
                for (var optIndex = 0; optIndex < options.length; optIndex++) {
                    var optionToCheck = options[optIndex];
                    if (optionToCheck.value == styleToSelect.className) {
                        indexToSelect = optIndex;
                        break;
                    }
                }
            } else {
                indexToSelect = -1;
            }
        }
        selectorDom.selectedIndex = indexToSelect;
        if (styleableObject != null) {
            selectorDom.disabled = false;
            removeBtn.setDisabled(indexToSelect == 0);
        } else if (selDef.isSelection) {
            selectorDom.disabled = !((indexToSelect == 0) && this.getStyles());
            removeBtn.disable(true);
        } else {
            removeBtn.setDisabled(indexToSelect == 0);
            selectorDom.disabled = true;
        }
    }

});

/**
 * Array with tag names that define objects (like images) that are styleable when selected
 * @private
 * @static
 * @final
 * @type String[]
 */
CQ.form.rte.plugins.StylesPlugin.STYLEABLE_OBJECTS = [
    "img"
];


// register plugin
CQ.form.rte.plugins.PluginRegistry.register("customfontstyles", CQ.form.rte.plugins.StylesPlugin);
