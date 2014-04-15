
/* Custom widget that defines several fields for data input in a single widget:
 *   - Dropdown menu.
 *   - Path field.
 *   - Text field.
 */
customWidget = CQ.Ext.extend(CQ.form.CompositeField, {

    /**
     * @private
     * @type CQ.Ext.form.TextField
     */
    hiddenField: null,

    /**
     * @private
     * @type CQ.Ext.form.ComboBox
     */
    linkTypeField: null,
     
    /**
     * @private
     * @type CQ.form.PathField
     */
    linkField: null,
    
    /**
     * @private
     * @type CQ.Ext.form.TextField
     */
    labelField: null,
    
    
    constructor: function(config) {
        config = config || { };
        var defaults = {
            "border": false,
            "layout": "table",
            "columns": 4
        };
        config = CQ.Util.applyDefaults(config, defaults);
        customWidget.superclass.constructor.call(this, config);
    },

    // overriding CQ.Ext.Component#initComponent
    initComponent: function() {
        customWidget.superclass.initComponent.call(this);
        this.hiddenField = new CQ.Ext.form.Hidden({
            name: this.name
        });
        this.add(this.hiddenField);
        
        // Dropdown field
        this.add(new CQ.Ext.form.Label({
            cls: "x-form-item",
            text: "Type:",
            margins: "{top:0, right:0, bottom:0, left:10}",
            style: {
                marginRight: '10px'
            },
            width: 30
        }));
        this.linkTypeField = new CQ.form.Selection({
            type:"select",
            width: 140, 
            listeners: {
                selectionchanged: {
                    scope:this,
                    fn: this.updateHidden
                }
            },
            optionsProvider: Prodigious.CQWidgets.dropdownOptions,
        });
        this.add(this.linkTypeField);
        
        
        // Path field
        this.add(new CQ.Ext.form.Label({
            cls: "x-form-item",
            text: "Link:",
            margins: "{top:0, right:0, bottom:0, left:10}",
            style: {
                marginLeft: '10px'
            },
            width: 40
        }));
        this.linkField = new CQ.form.PathField({
            rootPath: "/content",
            allowBlank: false,
            showTitlesInTree: false,
            width: 300,
            listeners: {
                dialogselect: {
                    scope:this,
                    fn:this.updateHidden
                },
                search: {
                    scope:this,
                    fn:this.updateHidden
                }
            }
        });
        this.add(this.linkField);
        
        
        // Text field
        this.add(new CQ.Ext.form.Label({
            cls: "x-form-item",
            text: "Text:",
            margins: "{top:0, right:0, bottom:0, left:10}", 
            style: {
                marginLeft: '10px', 
                marginRight: '10px'
            }
        }));
        this.labelField = new CQ.Ext.form.TextField({
            allowBlank: true,
            width: 200, 
            listeners: {
                change: {
                    scope:this,
                    fn:this.updateHidden
                }
            }
        });
        this.add(this.labelField);
    },

    // overriding CQ.form.CompositeField#processPath
    processPath: function(path) {
        this.linkTypeField.processPath(path);
    },

    // overriding CQ.form.CompositeField#processRecord
    processRecord: function(record, path) {
        this.linkTypeField.processRecord(record, path);
    },

    // overriding CQ.form.CompositeField#setValue
    setValue: function(value) {
        var parts = value.split("\t");
        this.linkTypeField.setValue(parts[0]);
        this.linkField.setValue(parts[1]);
        this.labelField.setValue(parts[2]);
        this.hiddenField.setValue(value);
    },

    // overriding CQ.form.CompositeField#getValue
    getValue: function() {
        return this.getRawValue();
    },

    // overriding CQ.form.CompositeField#getRawValue
    getRawValue: function() {
        if (!this.linkTypeField) {
            return null;
        }
        var linkType = this.linkTypeField.getValue();
        var link = this.linkField.getValue();
        var label = this.labelField.getValue();
        return linkType + "\t" + link + "\t" + label;
    },

    // private
    updateHidden: function() {
        this.hiddenField.setValue(this.getValue());
    }
});

// register xtype
CQ.Ext.reg('customwidget', customWidget);