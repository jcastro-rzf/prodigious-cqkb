
/* Custom multifield using several widgets to save data. */

/**
 * @class newMultifield
 * @extends CQ.form.CompositeField
 * This is a custom widget based on {@link CQ.form.CompositeField}.
 * @constructor
 * Creates a new CustomWidget.
 * @param {Object} config The config object
 */
newMultifield = CQ.Ext.extend(CQ.form.CompositeField, {

    /**
     * @private
     * @type CQ.Ext.form.TextField
     */
    ShopCategoriesLabel: null,
    ShopCategoryDetail: null,
    HighlightedProductsTitle: null,
    HighlightedProduct1: null,
    HighlightedProduct2: null,
    HighlightedProduct3: null,
    FeaturedDeal: null,
    ProductSelected: null,
   
    
    tempHighlightedProduct1: null,
    tempHighlightedProduct2: null,
    tempHighlightedProduct3: null,
    tempFeaturedDeal: null,
    
    constructor: function(config) {
        config = config || {};
        var defaults = {
            "border": true,
            "labelWidth": 150,
            "layout": "form"
            //"columns":6
        };
        config = CQ.Util.applyDefaults(config, defaults);
        newMultifield.superclass.constructor.call(this, config);
    },
    
    initComponent: function() {
        newMultifield.superclass.initComponent.call(this);
        
        // Hidden field
        this.hiddenField = new CQ.Ext.form.Hidden({
            name: this.name
        });
        this.add(this.hiddenField);

        this.ShopCategoriesLabel = new CQ.Ext.form.TextField({
            cls: "customwidget-1",
            fieldLabel: "Categories Label: ",
            maxLength: 50,
            width: 200,
            maxLengthText: "A maximum of 50 characters is allowed for the Shop Categories Label.",
            allowBlank: false,
            listeners: {
                change: {
                    scope: this,
                    fn: this.updateHidden
                }
            }
        });
        this.add(this.ShopCategoriesLabel);

        
        /*this.ShopCategoryDetail = new CQ.form.MultiField({
            fieldLabel: "Sub-category Detail",
            allowBlank: false,
            fieldConfig: {
                xtype: "tmolinktexturl"
             },
             listeners: {
                 
                beforeadd: function(list,component,index){
                    if (list.items.length>0) {
                        this.allowBlank = true;
                    }
                    
                    if(index==3){
                        CQ.Ext.Msg.show({title:'Validation Error',msg:'You cannot add more than 3 Details!',buttons:CQ.Ext.MessageBox.OK,icon:CQ.Ext.MessageBox.ERROR});
                        return false;
                    }
                },
                beforeremove: function(list,component,index){
                    if (list.items.length==2) {
                        this.allowBlank = false;
                    }
                },
                removeditem: {
                    scope: this,
                    fn: this.updateHidden
                },
                move: {
                    scope: this,
                    fn: this.updateHidden
                }
            }
        });
        this.add(this.ShopCategoryDetail);*/
        
        this.HighlightedProductsTitle = new CQ.Ext.form.TextField({
            cls: "customwidget-4",
            fieldLabel: "Highlighted Products Title: ",
            maxLength: 40,
            width: 200,
            maxLengthText: "A maximum of 300 characters is allowed for the Highlighted Products Title.",
            allowBlank: false,
            listeners: {
                change: {
                    scope: this,
                    fn: this.updateHidden
                }
            }
        });
        this.add(this.HighlightedProductsTitle);
        
        var randomnumber = Math.floor(Math.random()*1000);
        /*this.ProductSelected = new CQ.Ext.form.RadioGroup({
            fieldLabel: '',
            vertical: true,
            id:"productType"+eval(randomnumber),
            items: [
                {boxLabel: 'Highlighted Products', 
                        name: 'products-'+eval(randomnumber), 
                        inputValue: 'HP',
                        checked: true,
                        listeners: {
                             
                             check: function() {
                                if (!this.getValue()) {
                                    this.findParentByType(CQ.form.CompositeField).HighlightedProduct1.setVisible(false);
                                    this.findParentByType(CQ.form.CompositeField).HighlightedProduct2.setVisible(false);
                                    this.findParentByType(CQ.form.CompositeField).HighlightedProduct3.setVisible(false);
                                    this.findParentByType(CQ.form.CompositeField).tempHighlightedProduct1 = this.findParentByType(CQ.form.CompositeField).HighlightedProduct1.getValue();
                                    this.findParentByType(CQ.form.CompositeField).tempHighlightedProduct2 = this.findParentByType(CQ.form.CompositeField).HighlightedProduct2.getValue();
                                    this.findParentByType(CQ.form.CompositeField).tempHighlightedProduct3 = this.findParentByType(CQ.form.CompositeField).HighlightedProduct3.getValue();
                                    this.findParentByType(CQ.form.CompositeField).HighlightedProduct1.setValue("");
                                    this.findParentByType(CQ.form.CompositeField).HighlightedProduct2.setValue("");
                                    this.findParentByType(CQ.form.CompositeField).HighlightedProduct3.setValue("");
                                    this.findParentByType(CQ.form.CompositeField).HighlightedProduct1.allowBlank = true;
                                    this.findParentByType(CQ.form.CompositeField).FeaturedDeal.allowBlank = false;
                                }
                                else {
                                    this.findParentByType(CQ.form.CompositeField).HighlightedProduct1.setVisible(true);
                                    this.findParentByType(CQ.form.CompositeField).HighlightedProduct2.setVisible(true);
                                    this.findParentByType(CQ.form.CompositeField).HighlightedProduct3.setVisible(true);
                                    if (this.findParentByType(CQ.form.CompositeField).tempHighlightedProduct1!=null) {
                                        this.findParentByType(CQ.form.CompositeField).HighlightedProduct1.setValue(this.findParentByType(CQ.form.CompositeField).tempHighlightedProduct1);
                                    }
                                    if (this.findParentByType(CQ.form.CompositeField).tempHighlightedProduct2!=null) {
                                        this.findParentByType(CQ.form.CompositeField).HighlightedProduct2.setValue(this.findParentByType(CQ.form.CompositeField).tempHighlightedProduct2);
                                        
                                    }
                                    if (this.findParentByType(CQ.form.CompositeField).tempHighlightedProduct3!=null) {
                                        this.findParentByType(CQ.form.CompositeField).HighlightedProduct3.setValue(this.findParentByType(CQ.form.CompositeField).tempHighlightedProduct3);
                                        
                                    }
                                    this.findParentByType(CQ.form.CompositeField).HighlightedProduct1.allowBlank = false;
                                    this.findParentByType(CQ.form.CompositeField).FeaturedDeal.allowBlank = true;
                                    this.findParentByType(CQ.Ext.form.RadioGroup).items.items[1].setValue(false);
                                }
                                
                            }
                        }},
                {boxLabel: 'Featured Deal', 
                        name: 'deal-'+eval(randomnumber),  
                        inputValue: 'FD',
                        checked: false,
                        listeners: {
                            
                             check: function() {
                                if (!this.getValue()) {
                                    this.findParentByType(CQ.form.CompositeField).FeaturedDeal.setVisible(false);
                                    this.findParentByType(CQ.form.CompositeField).tempFeaturedDeal = this.findParentByType(CQ.form.CompositeField).FeaturedDeal.getValue();
                                    this.findParentByType(CQ.form.CompositeField).FeaturedDeal.setValue("");
                                    this.findParentByType(CQ.form.CompositeField).FeaturedDeal.allowBlank = true;
                                    this.findParentByType(CQ.form.CompositeField).HighlightedProduct1.allowBlank = false;
                                }
                                else {
                                    this.findParentByType(CQ.form.CompositeField).FeaturedDeal.setVisible(true);
                                    if (this.findParentByType(CQ.form.CompositeField).tempFeaturedDeal!=null) {
                                        this.findParentByType(CQ.form.CompositeField).FeaturedDeal.setValue(this.findParentByType(CQ.form.CompositeField).tempFeaturedDeal);
                                    }
                                    this.findParentByType(CQ.Ext.form.RadioGroup).items.items[0].setValue(false);
                                    this.findParentByType(CQ.form.CompositeField).FeaturedDeal.allowBlank = false;
                                    this.findParentByType(CQ.form.CompositeField).HighlightedProduct1.allowBlank = true;
                                }
                                
                            }
                        } }
            ]    

        });
        
        this.add(this.ProductSelected);*/
        
        /*this.ProductLabel = new CQ.Ext.form.Label({
            cls: "customwidget-label",
            text: "Highlighted Products"
        });*/
        
        this.HighlightedProduct1 = new CQ.form.PathField({
            cls: "customwidget-3",
            fieldLabel: "Product 1 URL: ",
            allowBlank: false,
            width: 325,
            maxLength: 255,
            rootPath: '/content/tmo-wem/en/index/test-base-page/products',
            validator: function(value) {
                var response = "The url is invalid";
                if (value!="") {
                    if (value.substring(0, 49) != "/content/tmo-wem/en/index/test-base-page/products") {
                        return response;
                    }
                    
                }
                return true;
            },
            listeners: {
                change: {
                    scope: this,
                    fn: this.updateHidden
                },
                dialogclose: {
                    scope: this,
                    fn: this.updateHidden
                }
            }
        });
        this.add(this.HighlightedProduct1);
        
        this.HighlightedProduct2 = new CQ.form.PathField({
            cls: "customwidget-3",
            fieldLabel: "Product 2 URL: ",
            allowBlank: true,
            width: 325,
            maxLength: 255,
            showTitlesInTree: false,
            rootPath: '/content/tmo-wem/en/index/test-base-page/products',
            validator: function(value) {
                var response = "The url is invalid";
                if (value!="") {
                    if (value.substring(0, 49) != "/content/tmo-wem/en/index/test-base-page/products") {
                        return response;
                    }
                    
                }
                return true;
            },
            listeners: {
                change: {
                    scope: this,
                    fn: this.updateHidden
                },
                dialogclose: {
                    scope: this,
                    fn: this.updateHidden
                }
            }
        });
        this.add(this.HighlightedProduct2);
        
        this.HighlightedProduct3 = new CQ.form.PathField({
            cls: "customwidget-3",
            fieldLabel: "Product 3 URL: ",
            allowBlank: true,
            width: 325,
            maxLength: 255,
            rootPath: '/content/tmo-wem/en/index/test-base-page/products/phones',
            validator: function(value) {
                var response = "The url is invalid";
                if (value!="") {
                    if (value.substring(0, 49) != "/content/tmo-wem/en/index/test-base-page/products") {
                        return response;
                    }
                    
                }
                return true;
            },
            listeners: {
                change: {
                    scope: this,
                    fn: this.updateHidden
                },
                dialogclose: {
                    scope: this,
                    fn: this.updateHidden
                }
            }
        });
        this.add(this.HighlightedProduct3);
        
        
        this.FeaturedDeal = new CQ.form.PathField({
            cls: "customwidget-3",
            fieldLabel: "Deal URL: ",
            allowBlank: true,
            width: 325,
            maxLength: 255,
            hidden: true,
            rootPath: '/content/tmo-wem/en/devices/phones/Deals',
            validator: function(value) {
                var response = "The url is invalid";
                if (value!="") {
                    if (value.substring(0, 40) != "/content/tmo-wem/en/devices/phones/Deals") {
                        return response;
                    }   
                }
                return true;
            },
            listeners: {
                change: {
                    scope: this,
                    fn: this.updateHidden
                },
                dialogclose: {
                    scope: this,
                    fn: this.updateHidden
                }
            }
        });
        this.add(this.FeaturedDeal);
    },
    
    processInit: function(path, record) {
        this.ShopCategoriesLabel.processInit(path, record); 
        //this.ShopCategoryDetail.processInit(path, record);
        this.HighlightedProductsTitle.processInit(path, record);
        this.HighlightedProduct1.processInit(path, record);
        this.HighlightedProduct2.processInit(path, record);
        this.HighlightedProduct3.processInit(path, record);
        this.FeaturedDeal.processInit(path, record);
            
    },
    
    setValue: function(value) {
        var jsonValue = JSON.parse(value);
        this.ShopCategoriesLabel.setValue(jsonValue.ShopCategoriesLabel);
        //this.ShopCategoryDetail.setValue(jsonValue.ShopCategoryDetail);
        this.HighlightedProductsTitle.setValue(jsonValue.HighlightedProductsTitle);
        this.HighlightedProduct1.setValue(jsonValue.HighlightedProduct1);
        this.HighlightedProduct2.setValue(jsonValue.HighlightedProduct2);
        this.HighlightedProduct3.setValue(jsonValue.HighlightedProduct3);
        this.FeaturedDeal.setValue(jsonValue.FeaturedDeal);
        this.hiddenField.setValue(value);
        
        if ((this.HighlightedProduct1.getValue()!=null && this.HighlightedProduct1.getValue()!="") || 
                (this.HighlightedProduct2.getValue()!=null && this.HighlightedProduct2.getValue()!="") || 
                (this.HighlightedProduct3.getValue()!=null && this.HighlightedProduct3.getValue()!="")) {
            this.ProductSelected.items.items[0].setValue(true);
        }
        else if (this.FeaturedDeal.getValue()!=null && this.FeaturedDeal.getValue()!="") {
            this.ProductSelected.items.items[1].setValue(true);
        }
        
        
    },
    
    getValue: function() {
        return this.getRawValue();
    },

    getRawValue: function() {
        var link = {
            "ShopCategoriesLabel": this.ShopCategoriesLabel.getValue(),
            //"ShopCategoryDetail": this.ShopCategoryDetail.getValue(),
            "HighlightedProductsTitle": this.HighlightedProductsTitle.getValue(),
            "HighlightedProduct1": this.HighlightedProduct1.getValue(),
            "HighlightedProduct2": this.HighlightedProduct2.getValue(),
            "HighlightedProduct3": this.HighlightedProduct3.getValue(),
            "FeaturedDeal": this.FeaturedDeal.getValue()
        };
        return JSON.stringify(link);
    },
    
    updateHidden: function() {
        this.hiddenField.setValue(this.getValue());
    }
    
});

// register xtype
CQ.Ext.reg('newmultifield', newMultifield);
