/*
 * This custom plugin allows to add a single paragraph format in the dropdown. By default,
 * elements in the Paragraph Format dropdown can have several HTML tags, but THERE HAS TO BE
 * A <P> TAG FOR IT TO WORK.
 *
 * This custom plugins eliminates that requirement and allows the richtext to work without
 * it. This is usefull for richtext that are used for headers only.
 *
 * @version 1.0
 * @since 06-21-2013
 *
 */

/**
 * @class CQ.form.rte.plugins.ParagraphFormatPlugin
 * @extends CQ.form.rte.plugins.Plugin
 * <p>This class implements paragraph formats (h1, h2, p, etc.)  as a plugin.</p>
 * <p>The plugin ID is "<b>paraformat</b>".</p>
 * <p><b>Features</b></p>
 * <ul>
 *   <li><b>paraformat</b> - adds a format selector (formats will always be applied on block
 *     scope).</li>
 * </ul>
 */
CQ.form.rte.plugins.ParagraphFormatPlugin = CQ.Ext.extend(CQ.form.rte.plugins.Plugin, {

    /**
     * @cfg {Object/Object[]} formats
     * <p>Defines the block formats (p, h1, h2, h3, ...) that are applicable to paragraphs.
     * </p>
     * <p>You can choose a deliberate (but unique) property name for each format, if you
     * chosoe to provide an Object rather than a Object[]. Each element (of the Array) or
     * property value (if choosing the Object representation) must have the following
     * properties:</p>
     * <ul>
     *   <li><code>tag</code> : String<br>
     *     The name of the tag that represents the block format (for example: "p", "h1",
     *     "h2", ...)</li>
     *   <li><code>description</code> : String<br>
     *     The text that represents the paragraph format in the format selector</li>
     * </uL>
     * <p>Note that this configuration only takes effect if the
     * {@link CQ.form.rte.plugins.ParagraphFormatPlugin "paraformat" plugin} is enabled.
     * Also note that you can't set additional DOM attributes using the "paraformat"
     * plugin.</p>
     * <p>Defaults to:</p>
<pre>
[
    {
        "tag": "p",
        "description": CQ.I18n.getMessage("Paragraph")
    }, {
        "tag": "h1",
        "description": CQ.I18n.getMessage("Heading 1")
    }, {
        "tag": "h2",
        "description": CQ.I18n.getMessage("Heading 2")
    }, {
        "tag": "h3",
        "description": CQ.I18n.getMessage("Heading 3")
    }
]
</pre>
     * @since 5.3
     */

    /**
     * @private
     */
    cachedFormats: null,

    /**
     * @private
     */
    formatUI: null,

    constructor: function(editorKernel) {
        CQ.form.rte.plugins.ParagraphFormatPlugin.superclass.constructor.call(this,
                editorKernel);
    },

    getFeatures: function() {
        return [ "customparaformat" ];
    },

    /**
     * @private
     */
    getFormatId: function(dom) {
        var tagName = dom.tagName.toLowerCase();
        var formats = this.getFormats();
        var formatCnt = formats.length;
        for (var f = 0; f < formatCnt; f++) {
            var formatDef = formats[f];
            if (formatDef.tag && (formatDef.tag == tagName)) {
                return formatDef.tag;
            }
        }
        return null;
    },

    getFormats: function() {
        var com = CQ.form.rte.Common;
        if (this.cachedFormats == null) {
            this.cachedFormats = this.config.formats || { };
            com.removeJcrData(this.cachedFormats);
            this.cachedFormats = com.toArray(this.cachedFormats, "tag", "description");
        }
        return this.cachedFormats;
    },

    getFormatById: function(formats, id) {
        var formatCnt = formats.length;
        for (var f = 0; f < formatCnt; f++) {
            if (formats[f].tag == id) {
                return formats[f];
            }
        }
        return null;
    },

    initializeUI: function(tbGenerator) {
        var plg = CQ.form.rte.plugins;
        var ui = CQ.form.rte.ui;
        if (this.isFeatureEnabled("customparaformat")) {
            this.formatUI = new ui.TbParaFormatter("customparaformat", this, null,
                    this.getFormats());
            tbGenerator.addElement("customparaformat", plg.Plugin.SORT_PARAFORMAT, this.formatUI,
                    10);
        }
    },

    notifyPluginConfig: function(pluginConfig) {
        pluginConfig = pluginConfig || { };
        var defaults = {
            "formats": [ {
                    "tag": "p",
                    "description": CQ.I18n.getMessage("Paragraph")
                }, {
                    "tag": "h1",
                    "description": CQ.I18n.getMessage("Heading 1")
                }, {
                    "tag": "h2",
                    "description": CQ.I18n.getMessage("Heading 2")
                }, {
                    "tag": "h3",
                    "description": CQ.I18n.getMessage("Heading 3")
                }
            ]
        };
        // remove predefined formats if userdefined formats are specified; otherwise both
        // would get merged
        if (pluginConfig.formats) {
            delete defaults.formats;
        }
        CQ.Util.applyDefaults(pluginConfig, defaults);
        this.config = pluginConfig;
    },

    execute: function(cmd) {
        if (this.formatUI) {
            var formatId = this.formatUI.getSelectedFormat();
            if (formatId) {
                this.editorKernel.relayCmd("format", this.getFormatById(this.getFormats(),
                        formatId));
            }
        }
    },

    updateState: function(selDef) {
        if (!this.formatUI || !this.formatUI.getExtUI()) {
            return;
        }
        var com = CQ.form.rte.Common;
        var dpr = CQ.form.rte.DomProcessor;
        var formatToSelect = null;
        var nodeList = selDef.nodeList;
        var nodeToCheck = nodeList.commonAncestor;
        var hasParentFormat = false;
        var formats = { };
        var noFormatCnt = 0;
        var formatCnt = 0;
        var auxRoot = null;
        while (nodeToCheck) {
            if (nodeToCheck.nodeType == 1) {
                formatToSelect = this.getFormatId(nodeToCheck);
                if (formatToSelect) {
                    formats[formatToSelect] = true;
                    hasParentFormat = true;
                    formatCnt++;
                    break;
                } else if (com.isTag(nodeToCheck, dpr.AUXILIARY_ROOT_TAGS)) {
                    if (auxRoot == null) {
                        auxRoot = nodeToCheck;
                    }
                }
            }
            nodeToCheck = nodeToCheck.parentNode;
        }
        // check first level nodes also, if no parent format has been detected
        if (!hasParentFormat) {
            var nodeCnt = nodeList.nodes.length;
            for (var nodeIndex = 0; nodeIndex < nodeCnt; nodeIndex++) {
                nodeToCheck = nodeList.nodes[nodeIndex];
                if (nodeToCheck.dom.nodeType == 1) {
                    var newFormat = this.getFormatId(nodeToCheck.dom);
                    if (newFormat) {
                        if (!formats[newFormat]) {
                            formats[newFormat] = true;
                            formatCnt++;
                        }
                        if (formatToSelect == null) {
                            formatToSelect = newFormat;
                        }
                    } else {
                        noFormatCnt++;
                    }
                } else {
                    noFormatCnt++;
                }
            }
        }
        var indexToSelect = -1;
        var selectorDom = this.formatUI.getExtUI().dom;
        var options = selectorDom.options;
        // Ignore the absence of the <p> tag and do not disable the dropdown
        for (var optIndex = 0; optIndex < options.length; optIndex++) {
            var optionToCheck = options[optIndex];
            if (optionToCheck.value == formatToSelect) {
                indexToSelect = optIndex;
                break;
            }
        }
        selectorDom.selectedIndex = indexToSelect;
    }

});


// register plugin
CQ.form.rte.plugins.PluginRegistry.register("customparaformat",
        CQ.form.rte.plugins.ParagraphFormatPlugin);
        