/*
 * Copyright 1997-2008 Day Management AG
 * Barfuesserplatz 6, 4001 Basel, Switzerland
 * All Rights Reserved.
 *
 * This software is the confidential and proprietary information of
 * Day Management AG, ("Confidential Information"). You shall not
 * disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into
 * with Day.
 */
/**
 * @class CQ.wcm.BulkEditor
 * @extends CQ.Ext.Panel
 * The BulkEditor provides a search engine and a grid to edit search results.<p>
 * The BulkEditor must be inserted in a HTML form (required by import functionality). This works
 * perfectly with a {@link CQ.Dialog}.
 * For the standalone version, see {@link CQ.wcm.BulkEditorForm}.</p>
 * @constructor
 * Creates a new BulkEditor
 * @param {Object} config The config object
 */
CQ.wcm.BulkEditor = CQ.Ext.extend(CQ.Ext.Panel, {

    /**
     * @cfg {String} rootPath
     * The search root path.
     */
    rootPath: null,

    /**
     * @cfg {String} queryParams
     * The search query.
     */
    queryParams: null,

    /**
     * @cfg {Boolean} contentMode
     * True to enable content mode: properties are read on jcr:content node and not on search result node (default is false).
     */
    contentMode: null,

    /**
     * @cfg {String[]} colsValue
     * The default searched properties. Values are the default values from {@link #colsSelection}.
     */
    colsValue: null,

    /**
     * @cfg {String[]} extraCols
     * Some extra searched properties, displayed in a textfield comma separated.
     */
    extraCols: null,

    /**
     * @cfg {Boolean} initialSearch
     * True to perform query on load (default is false).
     */
    initialSearch: false,

    /**
     * @cfg {String[]} colsSelection
     * The searched properties selection, displayed as checkboxes.
     */
    colsSelection: null,

    /**
     * @cfg {Boolean} showGridOnly
     * True to show only the grid and hide the search panel (default is false). To use with {@link initialSearch} set to true.
     */
    showGridOnly: false,

    /**
     * @cfg {Boolean} searchPanelCollapsed
     * True to collapse search panel on load (default is false).
     */
    searchPanelCollapsed: false,

    /**
     * @cfg {Boolean} hideRootPath
     * True to hide root path field (default is false).
     */
    hideRootPath: false,

    /**
     * @cfg {Boolean} hideQueryParams
     * True to hide query field (default is false).
     */
    hideQueryParams: false,

    /**
     * @cfg {Boolean} hideContentMode
     * True to hide content mode field (default is false).
     */
    hideContentMode: false,

    /**
     * @cfg {Boolean} hideColsSelection
     * True to hide columns selection field (default is false).
     */
    hideColsSelection: false,

    /**
     * @cfg {Boolean} hideExtraCols
     * True to hide extra columns field (default is false).
     */
    hideExtraCols: false,

    /**
     * @cfg {Boolean} hideSearchButton
     * True to hide search button (default is false).
     */
    hideSearchButton: false,

    /**
     * @cfg {Boolean} hideExportButton
     * True to hide export button (default is false).
     */
    hideExportButton: false,

    /**
     * @cfg {Boolean} hideImportButton
     * True to hide import button (default is true).
     */
    hideImportButton: true,

    /**
     * @cfg {Boolean} hideMoveButtons
     * True to hide move buttons - move up and move down - (default is true).
     */
    hideMoveButtons: true,

    /**
     * @cfg {Boolean} hideBulkEditButton
     * True to hide bulk edit button (default is true).
     */
    hideBulkEditButton: true,

    /**
     * @cfg {String} bulkEditDialogType
     * Force type of the dialog for bulkedition.
     * Dialog is retrieved from /libs/wcm/core/components/bulkeditor/bulkeditdialogs/"+type+"/dialog"
     * and a postToURLs param is add to dialog which refers to select entries in the grid.
     * Default content is loaded from /libs/wcm/core/components/bulkeditor/bulkeditdialogs/"+type+"_default_content"
     */
    bulkEditDialogType: null,

    /**
     * @cfg {String} bulkEditDialogPath
     * Path to the bulk edit dialog.
     * Default content is loaded from dialogPath +"_default_content"
     * @param config
     */
    bulkEditDialogPath: null,

    /**
     * @cfg {String} rowMovePostMode
     * Defines how row moves are sent to the save servlet (default is "newindex"). Property name is
     * jcr:path + @Order and value depends on this config :<ul>
     * <li><b>newindex</b> New index of the row in the grid is sent</li>
     * <li><b>slingorder</b> "Sling" style: before + path of new next row. Last if moved at the end of the grid</li>
     * </ul>
     */
    rowMovePostMode: null,

    /**
     * @cfg {Boolean} hideResultNumber
     * True to hide grid search result number text (default is false).
     */
    hideResultNumber: false,

    /**
     * @cfg {Boolean} hideSaveButton
     * True to hide save button (default is false).
     */
    hideSaveButton: false,

    /**
     * @cfg {Boolean} hideInsertButton
     * True to hide grid insert row button (default is false).
     */
    hideInsertButton: true,

    /**
     * @cfg {Boolean} hideDeleteButton
     * True to hide grid delete row button (default is false).
     */
    hideDeleteButton: true,

    /**
     * @cfg {Boolean} hidePathCol
     * True to hide grid jcr:path column (default is false).
     */
    hidePathCol: false,

    /**
     * @cfg {String} insertedResourceType
     * The resource type of the created nodes (inserted rows and save).
     */
    insertedResourceType: null,

    /**
     * @cfg {String} queryURL
     * The URL to get the query results.
     */
    queryURL: null,

    /**
     * @cfg {String} importURL
     * The URL to post imported file
     */
    importURL: null,

    /**
     * @cfg {String} exportURL
     * The URL to get export results
     */
    exportURL: null,

    /**
     * @cfg {String} saveURL
     * The URL to post modifications done to the grid
     */
    saveURL: null,
    
    /**
     * @cfg {Boolean} rowNumberer
     * True to hide grid jcr:path column (default is false).
     */
    rowNumberer: true,

    /**
     *
     */
    encoding:false,

    /**
     * @cfg {Object} colsMetadata
     * The metadata of the grid columns. colsMetadata["column name"] can contain the following configs: <ul>
     * <li><b>readOnly</b> True to define colunmn as read only, ie cells cannot be edited</li>
     * <li><b>headerCls</b> CSS class added to column header cell</li>
     * <li><b>headerStyle</b> CSS style added to column header cell</li>
     * <li><b>cellCls</b> CSS class added to column non-header cells</li>
     * <li><b>cellStyle</b> CSS style added to column non-header cells</li></ul>
     * <li><b>checkbox</b> True to define all cells of the column as checkboxes (true/false values)</li></ul>
     * <li><b>forcedPosition</b> Integer value to specify where column must be placed in grid (between 0 and nb cols-1)</li></ul>
     * <p>Sample config:</p>
     * <pre><code>
"colsMetadata": {
    "column1": {
        "headerCls": "column1HeaderCls",
        "cellCls": "column1CellCls",
        "checkbox": true
    }
    "column2": {
        "readOnly": true
        "headerStyle": "font-size: 12px;",
        "cellStyle": "background-color: #EDEDED;"
    }
}
    * </code></pre>
    **/
    colsMetadata: null,

    /**
     * Encode mapping table.
     * Contains a hash table with the char sequences to encode as keys and their encoded representation as a value
     */
    encodeMapping: null,

    constructor: function(config) {
        config = (!config ? {} : config);

        this.csvSeparator = (config["export"] && config["export"]["separator"] ? config["export"]["separator"] : null);

        var defaults = {
            "hideBorders": true,
            "border": false,
            "stateful": false,
            "autoHeight": true,
            "colsMetadata": {
                "jcr:path": {
                    "readOnly": true
                }
            },
            "bodyStyle": {
                "background-color": "#e8e8e8"
            },
            "encodeMapping": {
                "\\.": "_DOT_"
            }
        };

        this.gridPlugins = new Array();

        CQ.Util.applyDefaults(config, defaults);

        // init component by calling super constructor
        CQ.wcm.BulkEditor.superclass.constructor.call(this, config);

    },

    /**
     * Parses a string or Boolean to its Boolean value.
     * @param {Boolean/string} propertyValue Value to parse
     * @return {Boolean} True if propertyValue equals "true" or boolean true
     * @private
     */
    toBoolean: function(propertyValue) {
        return (propertyValue === true || propertyValue == "true");
    },

    // overriding CQ.Ext.Panel#initComponent
    initComponent : function() {
        CQ.wcm.BulkEditor.superclass.initComponent.call(this);

        if( this.showGridOnly ) {
            this.hideRootPath = true;
            this.hideQueryParams = true;
            this.hideContentMode = true;
            this.hideColsSelection = true;
            this.hideExtraCols = true;
            this.hideSearchButton = true;
            this.hideImportButton = true;
            this.hideResultNumber = true;
            this.hideInsertButton = true;
            this.hideDeleteButton = true;
        }

        this.initialSearch = this.toBoolean(this.initialSearch);
        this.hideRootPath = this.toBoolean(this.hideRootPath);
        this.hideQueryParams = this.toBoolean(this.hideQueryParams);
        this.hideContentMode = this.toBoolean(this.hideContentMode);
        this.hideColsSelection = this.toBoolean(this.hideColsSelection);
        this.hideExtraCols = this.toBoolean(this.hideExtraCols);
        this.hideSearchButton = this.toBoolean(this.hideSearchButton);
        this.hideImportButton = this.toBoolean(this.hideImportButton);
        this.hideResultNumber = this.toBoolean(this.hideResultNumber);
        this.hideSaveButton = this.toBoolean(this.hideSaveButton);
        this.hideInsertButton = this.toBoolean(this.hideInsertButton);
        this.hideDeleteButton = this.toBoolean(this.hideDeleteButton);
        this.hideExportButton = this.toBoolean(this.hideExportButton);
        this.hideMoveButtons = this.toBoolean(this.hideMoveButtons);
        this.hideBulkEditButton = this.toBoolean(this.hideBulkEditButton);
        this.hidePathCol = this.toBoolean(this.hidePathCol);
        this.searchPanelCollapsed = this.toBoolean(this.searchPanelCollapsed);
        this.rowNumberer = this.toBoolean(this.rowNumberer);

        this.addEvents(
            /**
             * @event beforeloadgrid
             * Fires before the grid is loaded. A handler can return false to cancel the load.
             * <b>Warning</b>: a grid load does not mean store load
             * @param {CQ.wcm.BulkEditor} this
             * @since 5.3
             */
            "beforeloadgrid",
            /**
             * @event loadgrid
             * Fires after the grid is loaded.
             * <b>Warning</b>: a grid load does not mean store load
             * @param {CQ.wcm.BulkEditor} this
             * @since 5.3
             */
            "loadgrid",

            /**
             * @event beforesave
             * Fires before the grid modifications are saved. A handler can return false to cancel the save.
             * @param {CQ.wcm.BulkEditor} this
             * @since 5.3
             */
            "beforesave",
            /**
             * @event save
             * Fires after the grid is saved.
             * @param {CQ.wcm.BulkEditor} this
             * @since 5.3
             */
            "save",

            /**
             * @event beforeinsertrow
             * Fires before a row is inserted in the grid. A handler can return false to cancel the insert.
             * @param {CQ.wcm.BulkEditor} this
             * @since 5.3
             */
            "beforeinsertrow",
            /**
             * @event insertrow
             * Fires after a row is inserted.
             * @param {CQ.wcm.BulkEditor} this
             * @since 5.3
             */
            "insertrow",

            /**
             * @event beforedeleterow
             * Fires before a row is deletd from the grid. A handler can return false to cancel the delete.
             * @param {CQ.wcm.BulkEditor} this
             * @since 5.3
             */
            "beforedeleterow",
            /**
             * @event deleterow
             * Fires after a row is deleted.
             * @param {CQ.wcm.BulkEditor} this
             * @since 5.3
             */
            "deleterow",

            /**
             * @event beforemovedown
             * Fires before a row is moved down in the grid. A handler can return false to cancel the move.
             * @param {CQ.wcm.BulkEditor} this
             * @since 5.3
             */
            "beforemovedown",
            /**
             * @event movedown
             * Fires after a row is moved down.
             * @param {CQ.wcm.BulkEditor} this
             * @since 5.3
             */
            "movedown",

            /**
             * @event beforemoveup
             * Fires before a row is moved up in the grid. A handler can return false to cancel the move.
             * @param {CQ.wcm.BulkEditor} this
             * @since 5.3
             */
            "beforemoveup",
            /**
             * @event moveup
             * Fires after a row is moved up.
             * @param {CQ.wcm.BulkEditor} this
             * @since 5.3
             */
            "moveup",

            /**
             * @event beforeexport
             * Fires before the grid is exported to a file. A handler can return false to cancel the export.
             * @param {CQ.wcm.BulkEditor} this
             * @since 5.3
             */
            "beforeexport",
            /**
             * @event export
             * Fires after the grid is exported.
             * @param {CQ.wcm.BulkEditor} this
             * @since 5.3
             */
            "export",

            /**
             * @event beforeimport
             * Fires before a file is imported. A handler can return false to cancel the import.
             * @param {CQ.wcm.BulkEditor} this
             * @since 5.3
             */
            "beforeimport",
            /**
             * @event import
             * Fires after a file is imported.
             * @param {CQ.wcm.BulkEditor} this
             * @since 5.3
             */
            "import",

            /**
             * @event beforeaddcolumntomodel
             * Fires before a column is added to the column model. A handler can return false to cancel the add.
             * @param {CQ.wcm.BulkEditor} this
             * @param {String} columnId Id of the column
             * @param {Object} colMetadata Column metadata config
             * @since 5.3
             */
            "beforeaddcolumntomodel",
            /**
             * @event addcolumntomodel
             * Fires after a column is added to the column model.
             * @param {CQ.wcm.BulkEditor} this
             * @param {String} columnId Id of the column
             * @param {Object} colMetadata Column metadata config
             * @since 5.3
             */
            "addcolumntomodel"
        );

        this.initSearchPanel();
        this.initGridPanel();

        //copy/paste hidden textarea
        this.clipboardArea = new CQ.Ext.form.TextArea({
            enableKeyEvents: true,
            "style": "opacity:0",
            "height": 1,
            "width": 1,
            "size": 1
        });
        this.add(this.clipboardArea);

        if(this.insertedResourceType) {
            this.add(new CQ.Ext.form.Hidden({
                "name": "insertedResourceType",
                "value": this.insertedResourceType,
                //false, otherwise value is deleted on dialog load
                "isFormField": false
            }));
        }
    },

    // overriding CQ.Ext.Panel#onRender
    onRender: function(ct, position) {
        CQ.wcm.BulkEditor.superclass.onRender.call(this, ct, position);

        if (this.initialSearch) {
            var parentDialog = this.findParentByType("dialog");
            if (parentDialog) {
                parentDialog.on("loadcontent", this.loadGrid, this);
            } else {
                //internal view may not be generated. Call to getView will do it.
                this.gridEditor.getView();
                this.gridEditor.on("render",this.loadGrid,this);
            }
        }
        this.gridEditor.on("render",this.initializeCheckboxSelection,this);
    },

    initSearchPanel: function() {
        this.searchPanel = new CQ.Ext.Panel(this.getSearchPanelConfig());
        this.add(this.searchPanel);
    },

    initGridPanel: function() {
        this.loadGrid(false);
        this.add(this.gridEditor);
    },

    initializeCheckboxSelection:function() {
        //if there is at least one checkbox column, modify context menu o have select all / select none menu items.
        if ( this.gridPlugins.length > 0 ) {
            var bulkeditor = this;

            this.selectAllItem = new CQ.Ext.menu.Item({
                "id": "select-all-" + this.gridEditor.id,
                "text": CQ.I18n.getMessage("Select All"),
                "cls": "x-menu-check-item x-menu-item-checked",
                handler: function(item,evt) {
                    var cm = bulkeditor.gridEditor.getColumnModel();
                    var col = bulkeditor.gridEditor.view.hdCtxIndex;
                    var ctxColumnId = cm.getColumnId(col);
                    var nbRows = bulkeditor.gridEditor.store.getCount();
                    for(var row=0;row<nbRows;row++) {
                        bulkeditor.gridEditor.startEditing(row,col);
                        var record = bulkeditor.gridEditor.store.getAt(row);
                        var initValue = record.data[ctxColumnId];
                        if( initValue === "false" || initValue === false){
                            record.set(ctxColumnId, true);
                            bulkeditor.gridEditor.stopEditing();
                            bulkeditor.handleEditedRecord(record, ctxColumnId, true, initValue);
                        }
                        record = null;
                    }
                    cm = null;
                }
            });

            this.selectNoneItem = new CQ.Ext.menu.Item({
                "id": "select-none-" + this.gridEditor.id,
                "text": CQ.I18n.getMessage("Select None"),
                "cls": "x-menu-check-item",
                "handler": function(item,evt) {
                    var cm = bulkeditor.gridEditor.getColumnModel();
                    var col = bulkeditor.gridEditor.view.hdCtxIndex;
                    var ctxColumnId = cm.getColumnId(col);
                    var nbRows = bulkeditor.gridEditor.store.getCount();
                    for(var row=0;row<nbRows;row++) {
                        bulkeditor.gridEditor.startEditing(row,col);
                        var record = bulkeditor.gridEditor.store.getAt(row);
                        var initValue = record.data[ctxColumnId];
                        if( initValue === "true" || initValue === true){
                            record.set(ctxColumnId, false);
                            bulkeditor.gridEditor.stopEditing();
                            bulkeditor.handleEditedRecord(record, ctxColumnId, false, initValue);
                        }
                        record = null;
                    }
                    cm = null;
                }
            });

            this.gridEditor.view.hmenu.on("beforeshow", function(a,b,c,d) {
                if( ! this.selectionAdded ) {
                    this.add("-", bulkeditor.selectAllItem,bulkeditor.selectNoneItem);
                    this.selectionAdded = true;
                }
                var ctxColumnId = bulkeditor.gridEditor.getColumnModel().getColumnId(bulkeditor.gridEditor.view.hdCtxIndex);
                var metadata = bulkeditor.getMetadata(ctxColumnId);
                if( metadata && (metadata["checkbox"] === "true" || metadata["checkbox"] === true)) {
                    bulkeditor.selectAllItem.enable();
                    bulkeditor.selectNoneItem.enable();
                } else {
                    bulkeditor.selectAllItem.disable();
                    bulkeditor.selectNoneItem.disable();
                }
            }, this.gridEditor.view.hmenu);
        }
    },

    /**
    * Returns the metadata of the given column id, {} if not found
     * @private
     */
    getMetadata: function(id) {
        var lookupId = id;
        if( id.indexOf(CQ.wcm.BulkEditor.JCR_CONTENT_NODE + "/") != -1) {
            lookupId = id.substring(CQ.wcm.BulkEditor.JCR_CONTENT_NODE.length + 1);
        }

        if( this.colsMetadata && this.colsMetadata[lookupId]) {
            return this.colsMetadata[lookupId];
        }
        return {};
    },

    /**
     * Returns an object containing the columns config.
     * @private
     */
    getColObject: function(recreate) {
        if( recreate || !this.currentColObject) {
            var cols = this.getColsValue();
            var extraCols = this.getExtraCols();
            var contentMode = this.getContentMode();

            var colObj = {};
            if(cols) {
                if (typeof cols == "string") {
                    cols = cols.split(",");
                }

                if (extraCols && typeof extraCols == "string") {
                    extraCols = extraCols.split(",");
                }

                if (cols instanceof Array) {
                    if (extraCols && extraCols instanceof Array) {
                        cols = cols.concat(extraCols);
                    }
                    colObj.headers = new Array();
                    colObj.values = new Array();
                    for (var i = 0; i < cols.length; i++) {
                        var v = cols[i];
                        if (v && v.length > 0) {
                            var h = v;
                            var index = v.indexOf(CQ.wcm.BulkEditor.JCR_CONTENT_NODE + "/");
                            if (contentMode && index == -1) {
                                v = CQ.wcm.BulkEditor.JCR_CONTENT_NODE + "/" + v;
                            } else {
                                if (index == 0) {
                                    h = v.substring(12, v.length);
                                    if (!contentMode) {
                                        v = h;
                                    }
                                }
                            }
                            var md = this.getMetadata(v);
                            if(md && md["headerText"]) {
                                h = md["headerText"];
                            }

                            if(colObj.values.indexOf(v)==-1) {
                                if(this.fireEvent("beforeaddcolumntomodel",this,v,md) !== false) {
                                    colObj.headers.push(h);
                                    colObj.values.push(v);
                                    this.fireEvent("addcolumntomodel",this,v,md);
                                }
                            }
                        }
                    }

                    //re-order arrays to match "forcedPosition" metadata
                    for(var i=0;i<colObj.values.length;i++) {
                        var md = this.getMetadata(colObj.values[i]);
                        var newIndex = i;
                        if( md ) {
                            var index = parseInt(md["forcedPosition"]);
                            if( !isNaN(index) && index < colObj.values.length && index != i) {
                                newIndex = index;
                            }
                        }
                        colObj.values = this.moveCell(colObj.values,i,newIndex);
                        colObj.headers = this.moveCell(colObj.headers,i,newIndex);
                    }
                }
            }
            this.currentColObject = colObj;
        }
        return this.currentColObject;
    },

    /**
     * Move cell from array from index fromA to index from toB
     * @param array
     * @param fromA
     * @param toB
     * @private
     */
    moveCell: function(array, fromA, toB) {
        if( array && toB < array.length && fromA < array.length && toB != fromA) {
            var i = 0;
            var newTab = new Array();
            while(i <array.length) {
                if( i == toB ) {
                    newTab.push(array[fromA]);
                    newTab.push(array[i]);
                    i++;
                } else {
                    if( i != fromA ) {
                        newTab.push(array[i]);
                    }
                    i++;
                }
            }
            return newTab;
        }
        return array;
    },

    /**
     * Builds the grid editor.
     * @private
     */
    loadGrid: function(loadStore) {
        if(this.fireEvent("beforeloadgrid") !== false) {
            this.modifiedItems = {};
            this.modifiedItems.count = 0;
            this.createdItems = {};
            this.createdItems.count = 0;
            this.deletedItems = {};
            this.deletedItems.count = 0;
            this.initialStoreData = null;
            this.movedItems = {};
            this.movedItems.count = 0;

            var path = this.getRootPath();

            this.buildGrid();

            this.checkSaveButtonStatus();

            if (loadStore != "false" && loadStore !== false) {
                if(this.hideRootPath || (path!=null && path != "")) {
                    this.gridEditor.store.load();
                } else {
                    CQ.Ext.MessageBox.alert(CQ.I18n.getMessage("Missing parameter"),
                            CQ.I18n.getMessage("Could not start search: no root path defined"));
                }
            }

            this.fireEvent("loadgrid");
        }
    },

    /**
    * Loads the grid.
     * @private
     * @deprecated Use {@link loadGrid}.
     */
    buildGridEditor: function(loadStore) {
        this.loadGrid(loadStore);
    },

    /**
     * Returns the column model.
     * @private
     */
    getColumnModel: function() {
        var colObj = this.getColObject(true);
        var colsObjects = new Array();
        // If true, add row numbers to the grid
        if (this.rowNumberer) {
            colsObjects.push(new CQ.Ext.grid.RowNumberer());
        }
        
        if (!this.hidePathCol) {
            colsObjects.push(
                    this.getColumnModelConfig(
                            CQ.wcm.BulkEditor.JCR_PATH,
                            "Path",
                            CQ.wcm.BulkEditor.JCR_PATH
                            )
                    );
        }

        for (var i = 0; i < colObj.values.length; i++) {
            colsObjects.push(
                this.getColumnModelConfig(
                        colObj.values[i],
                        colObj.headers[i],
                        this.encodeString(colObj.values[i])
                        )
                );
        }
        var columnModel = new CQ.Ext.grid.ColumnModel(colsObjects);

        //if move are not allowed, then columns are sortable
        if(!this.hideMoveButtons) {
            columnModel.defaultSortable = true;
        }
        return columnModel;
    },

    /**
     * Computes query url.
     * @param url
     * @param queryParams
     * @param path
     * @private
     */
    computeURL: function(url) {
        var path = this.getRootPath();
        if( !path ) {
            path = this.path;
        }
        var queryParams = this.getQueryParams();
        var query = "path:" + path + (queryParams ?  " " + queryParams : "");
        url = CQ.HTTP.addParameter(url, "query", query);
        url = CQ.HTTP.addParameter(url, "tidy", "true");
        var colObj = this.getColObject();
        if (colObj.values && colObj.values.length > 0) {
            url = CQ.HTTP.addParameter(url, "cols", "" + colObj.values);
        }
        //TODO use pathPrefix parameter?
        //url = CQ.HTTP.addParameter(url,"pathPrefix","jcr:content");
        return url;
    },

    /**
     *
     * @param url
     * @param queryParams
     * @param path
     */
    getStoreURL: function() {
        return this.computeURL(this.queryURL);
    },

    getExportURL: function() {
        var url = this.computeURL(this.exportURL);
        url = CQ.HTTP.addParameter(url, "separator", this.csvSeparator);
        return url;
    },

    /**
     * Returns the store.
     * @private
     */
    getStore: function() {
        var colObj = this.getColObject();
        var mappingsObjects = new Array();
        mappingsObjects.push({
            "name": CQ.wcm.BulkEditor.JCR_PATH
        });
        for (var i = 0; i < colObj.values.length; i++) {
            mappingsObjects.push({
                "name": this.encodeString(colObj.values[i])
            });
        }

        var currentObj = this;
        var config = {
            "proxy": new CQ.Ext.data.HttpProxy({
                "url":this.getStoreURL(),
                "method":"GET"
            }),
            "reader": new CQ.Ext.data.JsonReader(
                {
                    "totalProperty": "results",
                    "root":"hits"
                },
                mappingsObjects
            ),
            "sortInfo": {
                "field": CQ.wcm.BulkEditor.JCR_PATH,
                "direction":"ASC"
            },
            "listeners": {
                "datachanged": function() {
                    currentObj.updateResultNumberLabel();
                },
                "add": function() {
                    currentObj.updateResultNumberLabel();
                },
                "remove": function() {
                    currentObj.updateResultNumberLabel();
                }
            }
        };

        if(this.initialConfig && this.initialConfig.store) {
            config = CQ.Util.applyDefaults(CQ.Util.copyObject(this.initialConfig.store),config);
        }

        //if rows move allowed, then sorting in defined query order results
        if(!this.hideMoveButtons) {
            delete config["sortInfo"];
        }
        return new CQ.Ext.data.Store(config);
    },

    /**
     * Updates the "number of result" label from the grid.
     * @private
     */
    updateResultNumberLabel: function() {
        if(this.resultNumberLabel && this.gridEditor) {
            var storeSize = 0;
            if(this.gridEditor.store) {
                storeSize = this.gridEditor.store.getCount();
                storeSize = storeSize ? storeSize : 0;
            }
            var t = storeSize ? CQ.I18n.getMessage("{0} result(s)",storeSize) :
                    CQ.I18n.getMessage("No result");
            this.resultNumberLabel.text = t;
            this.resultNumberLabel.el.dom.innerHTML = t;
        }
    },

    /**
     * Builds the grid.
     * @param queryParams
     * @param path
     * @private
     */
    buildGrid : function() {
        if (!this.gridEditor) {
            // create the editor grid
            this.gridEditor = new CQ.Ext.grid.EditorGridPanel(this.getGridConfig());
            this.gridEditor.bulkeditor = this;
            this.gridEditor.on("afteredit", this.editionHandler, this);
        } else {
            this.gridEditor.stopEditing();
            this.gridEditor.reconfigure(this.getStore(), this.getColumnModel());
        }

        return this.gridEditor;
    },

    /**
     * Handles when a cell is edited.
     * @param evt
     * @private
     */
    editionHandler: function(evt) {
        this.handleEditedRecord(evt.record, evt.field, evt.value, evt.originalValue);
    },

    /**
     * Handles when a record is edited. Computes modification set.
     * @param record
     * @param field
     * @param newValue
     * @param originalValue
     * @private
     */
    handleEditedRecord: function(record, field, newValue, originalValue) {
        if (record.data[CQ.wcm.BulkEditor.JCR_PATH]) {
            var path = record.data[CQ.wcm.BulkEditor.JCR_PATH];
            if (this.modifiedItems[path]) {
                if (this.modifiedItems[path][field]) {
                    if (this.modifiedItems[path][field].originalValue == newValue) {
                        delete this.modifiedItems[path][field];
                        this.modifiedItems.count--;
                        if (CQ.Util.isEmptyObject(this.modifiedItems[path])) {
                            delete this.modifiedItems[path];
                        }

                    } else {
                        this.modifiedItems[path][field].newValue = newValue;
                    }
                } else {
                    this.modifiedItems[path][field] = {};
                    this.modifiedItems[path][field].originalValue = originalValue;
                    this.modifiedItems[path][field].newValue = newValue;
                }
            } else {
                this.modifiedItems[path] = {};
                this.modifiedItems[path][field] = {};
                this.modifiedItems[path][field].originalValue = originalValue;
                this.modifiedItems[path][field].newValue = newValue;
                this.modifiedItems.count++;
            }
        }

        this.checkSaveButtonStatus();
    },

    /**
     * Checks the save button: enables button if modifications in grid, otherwise disables it.
     * @private
     */
    checkSaveButtonStatus: function() {
        if (this.saveButton) {
            if(this.modifiedItems.count > 0 ||
               this.deletedItems.count > 0 ||
               this.createdItems.count > 0 ||
               this.movedItems.count > 0) {
                this.saveButton.enable();
            } else {
                this.saveButton.disable();
            }
        }
    },

    /**
     * Returns root path field config.
     * @private
     */
    getRootPathConfig: function() {
        var config = {
            "value": this.rootPath,
            "selectOnFocus":true,
            "name":"./rootPath",
            "fieldLabel":CQ.I18n.getMessage("Root Path"),
            "predicate":"nosystem",
            "fieldDescription": CQ.I18n.getMessage("Select root path for edition")
        };
        if(this.initialConfig && this.initialConfig.rootPathInput) {
            config = CQ.Util.applyDefaults(this.initialConfig.rootPathInput,config);
        }
        return config;
    },

    /**
     * Returns query param field config.
     * @private
     */
    getQueryParamsConfig: function() {
        var config = {
            "fieldLabel":CQ.I18n.getMessage("Query Parameters"),
            "name":"./queryParams",
            "value": this.queryParams,
            "fieldDescription": CQ.I18n.getMessage("Enter GQL query parameters")
        };
        if(this.initialConfig && this.initialConfig.queryParamsInput) {
            config = CQ.Util.applyDefaults(this.initialConfig.queryParamsInput,config);
        }
        return config;
    },

    /**
     * Returns content mode field config.
     * @private
     */
    getContentModeConfig: function() {
        var config = {
            "fieldLabel":CQ.I18n.getMessage("Content Mode"),
            "name":"./contentMode",
            "checked": this.contentMode,
            "boxLabel": "&nbsp;",
            "fieldDescription": CQ.I18n.getMessage("Read all properties in jcr:content sub node")
        };
        if(this.initialConfig && this.initialConfig.contentModeInput) {
            config = CQ.Util.applyDefaults(this.initialConfig.contentModeInput,config);
        }
        return config;
    },

    getColsSelectionOptions: function() {
        var cols = this.colsSelection;
        var defaultCols = this.colsValue;
        var options = new Array();
        if (cols) {
            if (typeof cols == "string") {
                cols = cols.split(",");
            }

            if (cols instanceof Array) {
                for (var i = 0; i < cols.length; i++) {
                    var v = cols[i];
                    if (v && v.length > 0) {
                        var h = v;
                        var md = this.getMetadata(v);
                        if (md && md["headerText"]) {
                            h = md["headerText"];
                        }
                        if (options.indexOf(v) == -1) {
                            options.push({
                                "boxLabel": h,
                                "name": v,
                                "value": v,
                                "checked": (defaultCols ? defaultCols.indexOf(v) != -1 : false)
                            });
                        }
                    }
                }
            }
        }

        return options;
    },

    /**
     * Returns columns selection field config.
     * @private
     */
    getColsSelectionConfig: function() {
        var options = this.getColsSelectionOptions();
        var nbCols = (options && options.length > 4 ? 3 : (options && options.length > 1 ? 2 : 1));

        var config = {
            "id": "cq-bulkeditor-colsselection",
            "columns": nbCols,
            "vertical": true,
            "fieldLabel":CQ.I18n.getMessage("Properties / Columns"),
            "name":"./colsSelection",
            "fieldDescription": CQ.I18n.getMessage("Select a list of properties to edit"),
            "items": options
        };
        if(this.initialConfig && this.initialConfig.colsSelectionInput) {
            config = CQ.Util.applyDefaults(this.initialConfig.colsSelectionInput,config);
        }
        return config;
    },

    /**
     * Returns extra columns field config.
     * @private
     */
    getExtraColsConfig: function() {
        var config = {
            "fieldLabel":CQ.I18n.getMessage("Custom Properties / Columns"),
            "name": "./extraCols",
            "value": this.extraCols,
            "fieldDescription": CQ.I18n.getMessage("Enter extra properties, separated by comma")
        };
        if(this.initialConfig && this.initialConfig.extraColsInput) {
            config = CQ.Util.applyDefaults(this.initialConfig.extraColsInput,config);
        }
        return config;
    },

    exportToFile: function() {
        if(this.fireEvent("beforeexport") !== false) {
            var exportAction = function() {
                var url = this.getExportURL();
                if (this.encoding) {
                    url = CQ.shared.HTTP.addParameter(url, "charset", "UTF-8");
                }
                CQ.shared.Util.open(url);
            };
            if (this.modifiedItems.count > 0) {
                CQ.Ext.MessageBox.confirm(CQ.I18n.getMessage("Export search result"),
                        CQ.I18n.getMessage("Save your modifications or they will not be exported. Do you still want to export?"),
                        exportAction, this);
            } else {
                exportAction.call(this);
            }
            this.fireEvent("export");
        }
    },

    importFile: function() {
        if(this.fireEvent("beforeimport") !== false) {
            var formPanel = this.findParentByType("form");

            if(formPanel==null) {
                formPanel = this.findParentByType("bulkeditorform");
            }
            if(formPanel!=null) {
                var form = formPanel.getForm();

                if (form.isValid()) {
                    form.el.dom["enctype"] = "multipart/form-data";
                    form.fileUpload = true;

                    var action = new CQ.form.SlingSubmitAction(form, {
                        "method": "POST",
                        "url": this.importURL,
                        success:function(form,action) {
                            form.el.dom["enctype"] = "";
                            delete form.fileUpload;

                            this.clearImportInput();

                            var msg = (action.result && action.result.Message ?
                                       action.result.Message :
                                       CQ.I18n.getMessage("No message"));
                            CQ.Notification.notify(CQ.I18n.getMessage("Data imported"),msg);

                            this.loadGrid();
                        },
                        failure:function(form, action) {
                            form.el.dom["enctype"] = "";
                            delete form.fileUpload;

                            this.clearImportInput();

                            var msg = (action.result && action.result.Message ?
                                       action.result.Message :
                                       CQ.I18n.getMessage("Unknown error"));
                            CQ.Notification.notify(CQ.I18n.getMessage("Import failed"),msg);

                            this.loadGrid();
                        },
                        scope:this
                    });
                    form.doAction(action);
                } else {
                    this.clearImportInput();
                    CQ.Notification.notify(CQ.I18n.getMessage("Validation failed"),
                            CQ.I18n.getMessage("Please select first a root path"));
                }
            } else {
                this.clearImportInput();
                CQ.Notification.notify(CQ.I18n.getMessage("Client page error"),
                        CQ.I18n.getMessage("No valid form found"));
            }
            this.fireEvent("export");
        } else {
            this.clearImportInput();
        }
    },

    openBulkEditDialog: function() {
        var postToURLs = [];

        if(this.gridEditor) {
            var sm = this.gridEditor.getSelectionModel();
            var cm = this.gridEditor.getColumnModel();
            var store = this.gridEditor.getStore();
            if(sm && cm && store) {
                var selectedCells = sm.getSortedSelections();
                if(selectedCells && selectedCells.length>0) {
                    var selectedRows = [];
                    for(var i=0;i<selectedCells.length;i++) {
                        var rowIndex = selectedCells[i][0];
                        if(selectedRows.indexOf(rowIndex) == -1) {
                            var field = cm.getColumnId(0/*path*/);
                            var record = store.getAt(rowIndex);
                            if(record) {
                                var path = record.get(field);
                                postToURLs.push(path);
                            }
                            selectedRows.push(rowIndex);
                        }
                    }
                } else {
                    //no selection, edit all
                    var count = store.getCount();
                    for(var i=0;i<count;i++) {
                        var field = cm.getColumnId(0/*path*/);
                        var record = store.getAt(i);
                        if(record) {
                            var path = record.get(field);
                            postToURLs.push(path);
                        }
                    }
                }
            }
        }

        if( postToURLs.length > 0) {
            var dialogPath = this.bulkEditDialogPath || null;

            if( !dialogPath) {
                var type = this.bulkEditDialogType || "default";
                var params = this.getQueryParams();
                if( !this.bulkEditDialogType && params && params.indexOf("type:") != -1) {
                    params += " ";
                    var reg = new RegExp("type:([a-z]*)\\s.*$", "ig");
                    type = params.replace(reg, "$1");
                    type = type.toLowerCase();
                }
                dialogPath = "/libs/wcm/core/components/bulkeditor/bulkeditdialogs/"+type+"/dialog";
            }

            var currentObj = this;
            var dlg = CQ.WCM.getDialog({
                "url": dialogPath,
                "success": function() {
                    currentObj.loadGrid();
                }
            });
            dlg.postToURLs = postToURLs;
            dlg.show();
            dlg.loadContent(dialogPath + "_default_content");
        }
    },

    /**
     * Returns search button config.
     * @private
     */
    getSearchButtonConfig: function() {
        var currentObj = this;
        var config = {
            "text": CQ.I18n.getMessage("Search"),
            "style" : "padding-right: 42px",
            "handler": function() {
                // trigger the data store load
                currentObj.loadGrid();
            }
        };
        if(this.initialConfig && this.initialConfig.searchButton) {
            config = CQ.Util.applyDefaults(this.initialConfig.searchButton,config);
        }
        return config;
    },

    /**
     * Returns save button config.
     * @private
     */
    getSaveButtonConfig: function() {
        var currentObj = this;
        var config = {
            "text": CQ.I18n.getMessage("Save"),
            "disabled": true,
            "handler": function() {
                //save modifications
                currentObj.saveGridModifications();
            }
        };
        if(this.initialConfig && this.initialConfig.saveButton) {
            config = CQ.Util.applyDefaults(this.initialConfig.saveButton,config);
        }
        return config;
    },

    /**
     * Returns export button config.
     * @private
     */
    getExportButtonConfig: function() {
        var currentObj = this;
        var config = {
            "text": CQ.I18n.getMessage("Export"),
            "handler": function() {
                currentObj.exportToFile();
            }
        };
        if(this.initialConfig && this.initialConfig.exportButton) {
            config = CQ.Util.applyDefaults(this.initialConfig.exportButton,config);
        }
        return config;
    },

    /**
     * Returns export encoding checkbox config.
     * @private
     */
    getExportEncodingConfig: function() {
        var currentObj = this;
        var config = {
            "boxLabel": CQ.I18n.getMessage("UTF-8"),
            "handler": function() {
                currentObj.encoding = !currentObj.encoding;
            }
        };
        if(this.initialConfig && this.initialConfig.exportEncoding) {
            config = CQ.Util.applyDefaults(this.initialConfig.exportEncoding,config);
        }
        return config;
    },

    /**
     * Returns bulkEdit button config.
     * @private
     */
    getBulkEditButtonConfig: function() {
        var currentObj = this;
        var config = {
            "text": CQ.I18n.getMessage("Bulk edit"),
            "handler": function() {
                currentObj.openBulkEditDialog();
            }
        };
        if(this.initialConfig && this.initialConfig.bulkEditButton) {
            config = CQ.Util.applyDefaults(this.initialConfig.bulkEditButton,config);
        }
        return config;
    },

    /**
     * Returns import button config.
     * @private
     */
    getImportButtonConfig: function() {
        var currentObj = this;
        var config = {
            "buttonText": CQ.I18n.getMessage("Import"),
            "buttonOnly": true,
            "hideLabel": true,
            "fieldWidth": "1",
            "name": "document",
            "listeners": {
                "fileselected": function() {
                    currentObj.importFile();
            }}
        };
        if(this.initialConfig && this.initialConfig.importButton) {
            config = CQ.Util.applyDefaults(this.initialConfig.importButton,config);
        }
        return config;
    },

    /**
     * Clears import input field.
     * @private
     */
    clearImportInput: function() {
        if(this.importButton) {
            this.importButton.fileInput.dom.value = "";
            this.importButton.setValue("");
        }
    },

    /**
     * Returns search panel config.
     * @private
     */
    getSearchPanelConfig: function() {
        var leftset = new Array();
        if(!this.hideRootPath) {
            this.rootPathInput = new CQ.form.PathField(this.getRootPathConfig());
            leftset.push(this.rootPathInput);
        } else {
            this.rootPathInput = new CQ.Ext.form.Hidden(this.getRootPathConfig());
            this.add(this.rootPathInput);
        }


        if(!this.hideQueryParams) {
            this.queryParamsInput = new CQ.Ext.form.TextField(this.getQueryParamsConfig());
            leftset.push(this.queryParamsInput);
        }

        if(!this.hideContentMode) {
            this.contentModeInput = new CQ.Ext.form.Checkbox(this.getContentModeConfig());
            leftset.push(this.contentModeInput);
        }

        if(!this.hideSearchButton || !this.hideImportButton) {
            var buttons = new Array();
            if(!this.hideSearchButton) {
                this.searchButton = new CQ.Ext.Button(this.getSearchButtonConfig());
                buttons.push(this.searchButton);
            }

            if(!this.hideImportButton) {
                this.importButton = new CQ.form.FileUploadField(this.getImportButtonConfig());
                buttons.push(this.importButton);
            }

            var buttonConfig = {
                "buttonAlign":"left",
                "border": false,
                "buttons": buttons
            };

            leftset.push(buttonConfig);
        }

        var rightset = new Array();

        if(!this.hideColsSelection) {
            this.colsSelectionInput = new CQ.Ext.form.CheckboxGroup(this.getColsSelectionConfig());
            rightset.push(this.colsSelectionInput);
        }

        if(!this.hideExtraCols) {
            this.extraColsInput = new CQ.Ext.form.TextField(this.getExtraColsConfig());
            rightset.push(this.extraColsInput);
        }

        this.leftSetId = CQ.Ext.id();
        this.rightSetId = CQ.Ext.id();

        var config = {
            "collapsible": true,
            "collapsed": this.searchPanelCollapsed,
            "title": CQ.I18n.getMessage("Search Filters"),
            "hidden":  this.showGridOnly,
            "autoEl":"div",
            "autoScroll": true,
            "height": 270,
            "anchor": "100%",
            "listeners": {
                "expand": function() {
                    this.doLayout();
                }
            },
            "bodyStyle": {
                "background-color": "#e8e8e8"
            },
            "defaults": {
                "labelWidth": 150
            },
            "border":true,
            "items": [{
                "layout": "column",
                "border": false,

                "defaults": {
                    "columnWidth": ".5",
                    "border": false,
                    "bodyStyle": {
                        "background-color": "#e8e8e8"
                    }
                },
                "bodyStyle": {
                    "background-color": "#e8e8e8"
                },
                "items": [{
                    "bodyStyle": {
                        "background-color": "#e8e8e8"
                    },
                    "items":
                    {
                        "xtype": "fieldset",
                        "id": this.leftSetId,
                        "autoHeight": true,
                        "border": false,
                        "bodyStyle": {
                            "background-color": "#e8e8e8",
                            "padding": "5px"
                        },
                        "defaults": {
                            "anchor": "97%",
                            "bodyStyle": {
                                "background-color": "#e8e8e8"
                            }
                        },
                        //items: here will come rootPathInput, queryParamsInput, contentModeInput and buttons
                        "items": leftset
                    }

                },{
                    "items":
                    {
                        "xtype": "fieldset",
                        "id": this.rightSetId,
                        "autoHeight": true,
                        "border": false,
                        "bodyStyle": {
                            "background-color": "#e8e8e8",
                            "padding": "5px"
                        },
                        "defaults": {
                            "anchor": "97%",
                            "bodyStyle": {
                                "background-color": "#e8e8e8"
                            }
                        },
                        //items: here will come colsSelectionInput, extraColsInput
                        "items": rightset
                    }

                }]
            }]
        };
        if(this.initialConfig && this.initialConfig.searchPanel) {
            if(this.initialConfig.searchPanel.defaults && this.initialConfig.searchPanel.defaults["xtype"]) {
                delete this.initialConfig.searchPanel.defaults["xtype"];
            }
            config = CQ.Util.applyDefaults(this.initialConfig.searchPanel,config);
        }
        return config;
    },

    getSearchPanelLeftFieldSet: function() {
        return CQ.Ext.getCmp(this.leftSetId);
    },

    getSearchPanelRightFieldSet: function() {
        return CQ.Ext.getCmp(this.rightSetId);
    },

    /**
     * Returns a string representation (tab separated) of the record.
     * @private
     */
    recordToString: function(record) {
        var buffer = "";
        if(record && this.gridEditor) {
            var cm = this.gridEditor.getColumnModel();
            if(cm) {
                var nb = cm.getColumnCount();
                if(nb > 0) {
                    buffer += record.get(cm.getColumnId(0));
                    for(var i=1;i<nb;i++) {
                        buffer += "\t" + record.get(cm.getColumnId(i));
                    }
                }
            }
        }
        return buffer;
    },

    /**
     * Returns a string value of the cell.
     * @private
     */
    cellToString: function(cell) {
        if(cell && cell.length == 2 && this.gridEditor) {
            var cm = this.gridEditor.getColumnModel();
            var store = this.gridEditor.getStore();
            if(cm && store) {
                var row = cell[0];
                var col = cell[1];
                if (row < 0 || row >= store.getCount()) return;
                if (col < 0 || col >= cm.getColumnCount()) return;
                var record = store.getAt(row);
                if(record) {
                    return record.get(cm.getColumnId(col));
                }
            }
        }
    },

    /**
     * Copies current grid selection to clipboard.
     * @private
     */
    copySelectionToClipboard: function() {
        var buffer = "";

        if(this.gridEditor) {
            var sm = this.gridEditor.getSelectionModel();
            if(sm) {
                var selectedCells = sm.getSelections();
                var nb = selectedCells.length;
                //copy a buffer of tab or separated values
                if(nb > 0) {
                    buffer += this.cellToString(selectedCells[0]);
                    for(var i=1;i<nb;i++) {
                        //not same row
                        if(selectedCells[i][0]!=selectedCells[i-1][0]) {
                            buffer += "\n";
                        } else {
                            buffer += "\t";
                        }
                        buffer += this.cellToString(selectedCells[i]);
                    }
                }
            }
        }

        this.clipboardArea.setValue(buffer);
        this.clipboardArea.el.dom.select();
    },

    /**
     * Pastes clipboard to current grid selection.
     * @private
     */
    pasteClipboardIntoSelection: function() {
        var pasted = this.clipboardArea.getValue();
        if(pasted && this.gridEditor) {
            var sm = this.gridEditor.getSelectionModel();
            var cm = this.gridEditor.getColumnModel();
            var store = this.gridEditor.getStore();
            if(sm && cm && store) {
                var selectedCells = sm.getSortedSelections();

                if(selectedCells && selectedCells.length>0) {
                        var lastIndex = pasted.lastIndexOf("\n");
                        if(lastIndex==pasted.length-1) {
                            //remove last \n
                            pasted = pasted.substring(0,pasted.length-1);
                        }
                        var bufferRows = pasted.split("\n");
                        var selectedCellsIndex = 0;
                        for(var i=0;i < bufferRows.length && selectedCellsIndex < selectedCells.length;i++) {
                            var cellToUpdate = selectedCells[i];
                            var bufferCols = bufferRows[i].split("\t");

                            if(bufferRows.length == bufferCols.length == 1) {
                                //special case: only one value pasted. Paste it into all selected cells
                                var newValue = bufferCols[0];
                                for(var j=0;j<selectedCells.length;j++) {
                                    var rowIndex = selectedCells[j][0];
                                    var colIndex = selectedCells[j][1];
                                    var field = cm.getColumnId(colIndex);
                                    var record = store.getAt(rowIndex);
                                    if(record) {
                                        var originalValue = record.get(field);
                                        record.set(field,newValue);
                                        this.handleEditedRecord(record, field, newValue, originalValue);
                                    }
                                }
                                return;
                            } else {
                                var lastRowIndex = (selectedCellsIndex>0?selectedCells[selectedCellsIndex-1][0]:-1);
                                var currentRowIndex = selectedCells[selectedCellsIndex][0];
                                if(lastRowIndex!=currentRowIndex) {
                                    for(var j=0;j < bufferCols.length && selectedCellsIndex < selectedCells.length;j++,selectedCellsIndex++) {
                                        var rowIndex = selectedCells[selectedCellsIndex][0];
                                        if(rowIndex == currentRowIndex) {
                                            var colIndex = selectedCells[selectedCellsIndex][1];
                                            var field = cm.getColumnId(colIndex);
                                            var record = store.getAt(rowIndex);
                                            if(record) {
                                                var originalValue = record.get(field);
                                                record.set(field,bufferCols[j]);
                                                this.handleEditedRecord(record, field, bufferCols[j], originalValue);
                                            }
                                        } else {
                                            CQ.Notification.notify(CQ.I18n.getMessage("Paste error"),
                                                    CQ.I18n.getMessage("Invalid pasted grid: format is different from grid selection"));
                                            return;
                                        }
                                    }
                                } else {
                                    CQ.Notification.notify(CQ.I18n.getMessage("Paste error"),
                                            CQ.I18n.getMessage("Invalid pasted grid: format is different from grid selection"));
                                    return;
                                }
                        }
                    }

                }
            }

        }
    },

    getToolBarButtons: function() {
        var tbarItems = new Array();
        if(!this.hideResultNumber) {
            this.resultNumberLabel = new CQ.Ext.form.Label(this.getResultNumberLabelConfig());
            tbarItems.push(" ");
            tbarItems.push(this.resultNumberLabel);
            tbarItems.push(" ");
            tbarItems.push("-");
        }

        if(!this.hideSaveButton) {
            this.saveButton = new CQ.Ext.Button(this.getSaveButtonConfig());
            tbarItems.push(this.saveButton);
        }

        if(!this.hideInsertButton) {
            tbarItems.push(this.getInsertButtonConfig());
        }

        if(!this.hideDeleteButton) {
            tbarItems.push(this.getDeleteButtonConfig());
        }

        if(!this.hideExportButton) {
            this.exportButton = new CQ.Ext.Button(this.getExportButtonConfig());
            this.exportEncoding = new CQ.Ext.form.Checkbox(this.getExportEncodingConfig());
            tbarItems.push(this.exportButton);
            tbarItems.push("&nbsp;&nbsp;");
            tbarItems.push(this.exportEncoding);
        }

        if(!this.hideBulkEditButton) {
            this.bulkEditButton = new CQ.Ext.Button(this.getBulkEditButtonConfig());
            tbarItems.push(this.bulkEditButton);
        }

        if(!this.hideMoveButtons) {
            tbarItems.push(this.getMoveDownButtonConfig());
            tbarItems.push(this.getMoveUpButtonConfig());
        }
        return tbarItems;
    },

    /**
     * Returns grid config.
     * @param queryParams
     * @param path
     * @private
     */
    getGridConfig: function() {
        var store = this.getStore();

        var currentObj = this;

        var tbarItems = this.getToolBarButtons();

        var rsm = new CQ.wcm.CustomCellSelectionModel();
        var config = {
            "store": store,
            "cm": this.getColumnModel(),
            "sm": rsm,
            "clicksToEdit":2,
            "height": 370,
            "stateful": false,
            "border": true,
            "plugins": this.gridPlugins,
            "tbar": tbarItems,
            "view": new CQ.Ext.grid.GridView({
                 "forceFit": true
            }),

            "listeners": {
                "keydown": function(e) {
                    if (e.ctrlKey && e.getCharCode() == 67) { // copy (ctrl + c)
                            currentObj.copySelectionToClipboard();
                    } else {
                        if (e.ctrlKey && e.getCharCode() == 86) { // copy (ctrl + v)
                            currentObj.clipboardArea.el.dom.select();
                            window.setTimeout(function() {
                                currentObj.pasteClipboardIntoSelection();
                            },100);
                        } else {
                            if (e.ctrlKey && e.getCharCode() == 65) { // copy (ctrl + a)
                                if(currentObj.gridEditor) {
                                    var sm = currentObj.gridEditor.getSelectionModel();
                                    if(sm) {
                                        sm.selectAll();
                                        e.stopEvent();
                                    }
                                }
                            }
                        }
                    }
            }}
        };

        if(this.initialConfig && this.initialConfig.grid) {
            config = CQ.Util.applyDefaults(CQ.Util.copyObject(this.initialConfig.grid),config);
        }
        return config;
    },

    /**
     * Returns "number of result" label config
     * @private
     */
    getResultNumberLabelConfig: function() {
        var currentObj = this;

        var config = {
            "text": CQ.I18n.getMessage("No result"),
            "textBase": CQ.I18n.getMessage("{0} result(s)"),
            "noValueText": CQ.I18n.getMessage("No result")
        };

        if(this.initialConfig && this.initialConfig.resultNumberLabel) {
            config = CQ.Util.applyDefaults(CQ.Util.copyObject(this.initialConfig.resultNumberLabel),config);
        }
        return config;

    },

    /**
     * Returns insert button config.
     * @private
     */
    getInsertButtonConfig: function() {
        var currentObj = this;

        var config = {
            text: CQ.I18n.getMessage("Insert row"),
            handler : function() {
                currentObj.addRow();
            }
        };

        if(this.initialConfig && this.initialConfig.insertButton) {
            config = CQ.Util.applyDefaults(CQ.Util.copyObject(this.initialConfig.insertButton),config);
        }
        return config;

    },

    /**
     * Returns move up button config.
     * @private
     */
    getMoveUpButtonConfig: function() {
        var currentObj = this;

        var config = {
            "text": CQ.I18n.getMessage("Move up"),
            "handler": function() {
                currentObj.moveUpSelection();
            }
        };

        if(this.initialConfig && this.initialConfig.moveUpButton) {
            config = CQ.Util.applyDefaults(CQ.Util.copyObject(this.initialConfig.moveUpButton),config);
        }
        return config;

    },

    /**
     * Returns move down button config.
     * @private
     */
    getMoveDownButtonConfig: function() {
        var currentObj = this;

        var config = {
            "text": CQ.I18n.getMessage("Move down"),
            "handler": function() {
                currentObj.moveDownSelection();
            }
        };

        if(this.initialConfig && this.initialConfig.moveDownButton) {
            config = CQ.Util.applyDefaults(CQ.Util.copyObject(this.initialConfig.moveDownButton),config);
        }
        return config;
    },

    /**
     * Returns delete button config.
     * @private
     */
    getDeleteButtonConfig: function() {
        var currentObj = this;

        var config = {
            text: CQ.I18n.getMessage("Delete row(s)"),
            handler : function() {
                currentObj.deleteSelectedRow();
            }
        };

        if(this.initialConfig && this.initialConfig.Button) {
            config = CQ.Util.applyDefaults(CQ.Util.copyObject(this.initialConfig.deleteButton),config);
        }
        return config;

    },

    /**
     * Adds a row to the grid.
     * @private
     */
    addRow: function() {
        if (this.gridEditor) {
            if(this.fireEvent("beforeinsertrow") !== false) {
                var sm = this.gridEditor.getSelectionModel();
                sm.clearSelections();

                var colObj = this.getColObject();
                var generatedPath = this.getRootPath() + "/" + new Date().getTime();

                var newRecord = {};
                newRecord[CQ.wcm.BulkEditor.JCR_PATH] = generatedPath;

                var mappingsObjects = new Array();
                mappingsObjects.push({
                    "name": CQ.wcm.BulkEditor.JCR_PATH
                });
                for (var i = 0; i < colObj.values.length; i++) {
                    mappingsObjects.push({
                        "name":colObj.values[i],
                        "type": "string"
                    });
                    newRecord[colObj.values[i]] = "";
                }

                var RecordObj = CQ.Ext.data.Record.create(mappingsObjects);

                this.gridEditor.stopEditing();
                this.gridEditor.store.insert(0, new RecordObj(newRecord));
                this.gridEditor.startEditing(0, 0);

                this.createdItems[generatedPath] = {};
                this.createdItems.count++;

                this.checkSaveButtonStatus();

                this.fireEvent("insertrow");
            }
        }
    },

    /**
     * Deletes selected rows.
     * @private
     */
    deleteSelectedRow: function() {
        if (this.gridEditor) {
            if(this.fireEvent("beforedeleterow") !== false) {
                //TODO manage multiple rows deletion
                var sm = this.gridEditor.getSelectionModel();
                var selections = sm.getSelections();
                if (selections) {
                    for (var i = selections.length - 1; i > -1; i--) {
                        var row = selections[i][0];
                        var rec = this.gridEditor.store.getAt(row);
                        if (rec) {
                            var path = rec.data[CQ.wcm.BulkEditor.JCR_PATH];
                            this.gridEditor.store.remove(rec);
                            if (this.createdItems[path] != undefined) {
                                delete this.createdItems[path];
                                this.createdItems.count--;
                            } else {
                                this.deletedItems[path] = {};
                                this.deletedItems.count++;
                            }
                            if (this.modifiedItems[path] != undefined) {
                                delete this.modifiedItems[path];
                                this.modifiedItems.count--;

                            }

                            this.checkSaveButtonStatus();
                        }
                    }

                    sm.clearSelections();
                }
                this.fireEvent("deleterow");
            }
        }
    },

    /**
     * Moves down each row of the selection of one position
     */
    moveDownSelection: function() {
        if(this.fireEvent("beforemovedown") !== false) {
            var sm = this.gridEditor.getSelectionModel();

            var selections = sm.getSortedSelections();
            if( selections ) {
                this.prepareRowMove();
                var nbRecords = this.gridEditor.store.getCount();
                //prepare re-selection
                var reSelections = [];

                //avoid move of all last continuous rows
                var lastBottomMoved = -1;
                var nextSelectedRowIndex = nbRecords;
                var nextNewRowIndex = nbRecords;
                for(var i=selections.length-1;i>-1;i--) {
                    var rowIndex = selections[i][0];
                    var colIndex = selections[i][1];
                    //2 cells of the same row can be selected.
                    if( rowIndex != nextSelectedRowIndex) {
                        var record = this.gridEditor.store.getAt(rowIndex);
                        var newIndex = rowIndex + 1;
                        if(newIndex > nbRecords - 1) {
                            //case of last row, do not move it
                            newIndex = nbRecords - 1;
                            lastBottomMoved = nbRecords - 1;
                        } else {
                            if( newIndex == lastBottomMoved) {
                                //do not move the last row
                                //and do not move the nbRecord - 2 row if last one is selected
                                //and do not move the nbRecord - 3 row if nbRecord - 2 is selected...
                                lastBottomMoved --;

                                //for re-selection
                                newIndex --;
                            } else {
                                //before move next record is required to track changes
                                //beforeMoveNextRecord is null only for last row.
                                var beforeMoveNextRecord = null;
                                if(rowIndex + 1 < nbRecords) {
                                    beforeMoveNextRecord = this.gridEditor.store.getAt(rowIndex + 1);
                                }

                                this.gridEditor.store.remove(record);
                                this.gridEditor.store.insert(newIndex, record);

                                //after move next record is required to track changes
                                //afterMoveNextRecord is null only for last row.
                                var afterMoveNextRecord = null;
                                if(newIndex + 1 < nbRecords) {
                                    afterMoveNextRecord = this.gridEditor.store.getAt(newIndex + 1);
                                }
                                this.handleRowMove(record,beforeMoveNextRecord,afterMoveNextRecord);
                            }
                        }
                        nextNewRowIndex = newIndex;
                        reSelections.push([newIndex,colIndex]);
                    } else {
                        //just re-select cell
                        reSelections.push([nextNewRowIndex,colIndex]);
                    }
                    nextSelectedRowIndex = rowIndex;
                }

                //reselect cells
                for(var i=0;i<reSelections.length;i++) {
                    sm.selectCell(reSelections[i],true);
                }
            }
            this.fireEvent("movedown");
        }
    },

    /**
     * Moves up each row of the selection of one position
     */
    moveUpSelection: function() {
        if(this.fireEvent("beforemoveup") !== false) {
            var sm = this.gridEditor.getSelectionModel();

            var selections = sm.getSortedSelections();
            if (selections) {
                this.prepareRowMove();
                var nbRecords = this.gridEditor.store.getCount();
                //prepare re-selection
                var reSelections = [];

                //avoid move of all first continuous rows
                var lastTopMoved = -1;
                var previousSelectedRowIndex = -1;
                var previousNewRowIndex = -1;
                for (var i = 0; i < selections.length; i++) {
                    var rowIndex = selections[i][0];
                    var colIndex = selections[i][1];
                    //2 cells of the same row can be selected.
                    if (rowIndex != previousSelectedRowIndex) {
                        var record = this.gridEditor.store.getAt(rowIndex);
                        var newIndex = rowIndex - 1;
                        if (newIndex < 0) {
                            //case of first row, do not move it
                            newIndex = 0;
                            lastTopMoved = 0;
                        } else {
                            if (newIndex == lastTopMoved) {
                                //do not move the first row
                                //and do not move the second row if first one is selected
                                //and do not move the thrid row if second one is selected...
                                lastTopMoved ++;

                                //for re-selection
                                newIndex ++;
                            } else {
                                //before move next record is required to track changes
                                //beforeMoveNextRecord is null only for last row.
                                var beforeMoveNextRecord = null;
                                if (rowIndex + 1 < nbRecords) {
                                    beforeMoveNextRecord = this.gridEditor.store.getAt(rowIndex + 1);
                                }

                                this.gridEditor.store.remove(record);
                                this.gridEditor.store.insert(newIndex, record);

                                //after move next record is required to track changes
                                //afterMoveNextRecord is null only for last row.
                                var afterMoveNextRecord = null;
                                if (newIndex + 1 < nbRecords) {
                                    afterMoveNextRecord = this.gridEditor.store.getAt(newIndex + 1);
                                }
                                this.handleRowMove(record, beforeMoveNextRecord, afterMoveNextRecord);
                            }
                        }
                        previousNewRowIndex = newIndex;
                        reSelections.push([newIndex,colIndex]);
                    } else {
                        //just re-select cell
                        reSelections.push([previousNewRowIndex,colIndex]);
                    }
                    previousSelectedRowIndex = rowIndex;
                }

                //reselect cells
                for (var i = 0; i < reSelections.length; i++) {
                    sm.selectCell(reSelections[i], true);
                }
            }
            this.fireEvent("movedown");
        }
    },

    prepareRowMove: function() {
        if(!this.initialStoreData) {
            var nbRecords = this.gridEditor.store.getCount();
            //initialize a copy of the store to track changes
            this.initialStoreData = new CQ.Ext.util.MixedCollection(false);
            this.initialStoreData.addAll([].concat(this.gridEditor.store.getRange(0,nbRecords)));
        }
    },

    /**
     * Manages move of a row
     * @param oldIndex
     * @param newIndex
     * @param record
     */
    handleRowMove: function(movedRecord,beforeMoveNextRecord,afterMoveNextRecord) {
        var path = movedRecord.data[CQ.wcm.BulkEditor.JCR_PATH];

        var beforeMoveNextPath = null;
        if( beforeMoveNextRecord ) {
            beforeMoveNextPath = beforeMoveNextRecord.data[CQ.wcm.BulkEditor.JCR_PATH];
        }

        var afterMoveNextPath = null;
        if( afterMoveNextRecord ) {
            afterMoveNextPath = afterMoveNextRecord.data[CQ.wcm.BulkEditor.JCR_PATH];
        }

        var currentIndex = this.gridEditor.store.indexOf(movedRecord);
        var initialIndex = this.initialStoreData.indexOf(movedRecord);
        if( currentIndex == initialIndex && this.movedItems[path] ) {
            //back to original place
            delete this.movedItems[path];
            this.movedItems.count --;
        } else {
            if( !this.movedItems[path] ) {
                this.movedItems[path] = {};
                //get initial next path
                var initialNextPath = null;
                if( initialIndex + 1 < this.initialStoreData.length) {
                    var initialNextRecord = this.initialStoreData.itemAt(initialIndex + 1);
                    initialNextPath = initialNextRecord.data[CQ.wcm.BulkEditor.JCR_PATH];
                }
                this.movedItems[path].initialNextPath = initialNextPath;
                this.movedItems[path].initialIndex = initialIndex;
                this.movedItems[path].newNextPath = afterMoveNextPath;
                this.movedItems[path].record = movedRecord;
                this.movedItems[path].newIndex = currentIndex;
                this.movedItems.count ++;
            } else {
                //movedRecord has already been moved once. Remove from movedItems if moved at initial place and initial next
                //row has not moved
                if( this.movedItems[path].initialNextPath == afterMoveNextPath && (!afterMoveNextPath || !this.movedItems[afterMoveNextPath])) {
                    delete this.movedItems[path];
                    this.movedItems.count --;
                } else {
                    this.movedItems[path].newNextPath = afterMoveNextPath;
                    this.movedItems[path].newIndex = currentIndex;
                }
            }
        }

        //check if current move has generated some other moved rows
        for(var p in this.movedItems) {
            if( p != "count") {
                var ci = this.gridEditor.store.indexOf(this.movedItems[p].record);
                var ii = this.initialStoreData.indexOf(this.movedItems[p].record);
                if( ci == ii) {
                    //back to original place
                    delete this.movedItems[p];
                    this.movedItems.count --;
                } else {
                    if( p != path ) {
                        //this row was moved before and current moved row has been inserted
                        if(this.movedItems[p].newNextPath == path) {
                            this.movedItems[p].newNextPath = beforeMoveNextPath;
                        }
                        if(this.movedItems[p].newNextPath == afterMoveNextPath) {
                            this.movedItems[p].newNextPath = path;
                        }
                        if( this.movedItems[p].newIndex != ci) {
                            this.movedItems[p].newIndex = ci;
                        }
                    }
                }
            }
        }

        this.checkSaveButtonStatus();
    },

    /**
     * Returns column model config.
     * @param id
     * @param header
     * @param dataIndex
     * @param editor
     * @private
     */
    getColumnModelConfig: function(id,header,dataIndex) {
        var metadata = this.getMetadata(id);

        var checkbox = metadata["checkbox"] === true || metadata["checkbox"] === "true";
        var readOnly = metadata["readOnly"] === true || metadata["readOnly"] === "true";

        var config = {
            "id": id,
            "header": header,
            "dataIndex": dataIndex
        };

        config = CQ.Util.applyDefaults(metadata,config);

        if(this.initialConfig && this.initialConfig.colModel) {
            var w = this.initialConfig.colModel.width;
            if(w != undefined && typeof w == "string" && !isNaN(w)) {
                this.initialConfig.colModel.width = parseInt(w);
            }
            config = CQ.Util.applyDefaults(CQ.Util.copyObject(this.initialConfig.colModel),config);
        }

        if ( !config.width ) {
            //try to compute it
            if( this.rendered && this.getSize()) {
                var w = this.getSize().width;
                var cv = this.getColsValue();
                if( cv ) {
                    //do not know why (borders and rendering of other fields?) but figures are ok on FF3 and IE7
                    var borders = 65;
                    if( this.colsSelectionInput && this.colsSelectionInput.rendered) {
                        borders = 20;
                    }
                    var nbCols = cv.length + 1;
                    config.width = parseInt((parseInt(w) - borders) / nbCols);
                }
            } else {
                //really last default width
                config.width = "200";
            }
        }

        if ( checkbox ) {
            config["readOnly"] = readOnly;
            var cc = new CQ.wcm.BulkEditor.CheckColumn(config);
           this.gridPlugins.push(cc);
           return cc;
        } else {
            var editorConfig = {
                "xtype": "textfield",
                "readOnly": readOnly
            };
            if(metadata["editor"]) {
                editorConfig = CQ.Util.applyDefaults(metadata["editor"],editorConfig);
            }
            config["editor"] = CQ.Util.build(editorConfig);
            return config;
        }
    },

    /**
     * Returns root path field value.
     * @private
     */
    getRootPath: function() {
        if(this.rootPathInput) {
            return this.rootPathInput.getValue();
        }
        return this.rootPath;
    },

    /**
     * Returns query param field value.
     * @private
     */
    getQueryParams: function() {
        if(this.queryParamsInput) {
            return this.queryParamsInput.getValue();
        }
        return this.queryParams;
    },

    /**
     * Returns content mode field value.
     * @private
     */
    getContentMode: function() {
        if(this.contentModeInput && this.contentModeInput.rendered) {
            return this.contentModeInput.getValue();
        }
        return this.contentMode;
    },

    /**
     * Removes 'special' characters from a string
     * @param s String to encode
     * @return Encoded string
     * @private
     */
    encodeString: function(s) {
        for (var key in this.encodeMapping) {
            s = s.replace(new RegExp("(" + key + ")", "ig"), this.encodeMapping[key]);
        }
        return s;
    },

    /**
     * Restores 'special' characters from a string
     * @param s String to decode
     * @return Decoded string
     * @private
     */
    decodeString: function(s) {
        for (var key in this.encodeMapping) {
            s = s.replace(new RegExp("(" + this.encodeMapping[key] + ")", "ig"), key.replace(/\\/ig, ""));
        }
        return s;
    },

    /**
     * Returns columns field value.
     * @private
     */
    getColsValue: function() {
        if(this.colsSelectionInput && this.colsSelectionInput.rendered) {
            var values = new Array();
            if( this.colsSelectionInput && this.colsSelectionInput.items) {
                this.colsSelectionInput.items.each(function(c){
                    if(c.getValue()) {
                        values.push(c.getName());
                    }
                }, this);

            }
            this.colsValue = values;
        }
        if( this.colsValue ) {
            return this.colsValue;
        } else {
            //return the metadata columns.
            if(this.colsMetadata) {
                var cols = new Array();
                for(var c in this.colsMetadata) {
                    if( c != "xtype" && c !=CQ.wcm.BulkEditor.JCR_PRIMARYTYPE && c != CQ.wcm.BulkEditor.JCR_PATH) {
                        cols.push(c);
                    }
                }
                return cols;
            }
        }
        return null;
    },

    /**
     * Returns extra columns field value.
     * @private
     */
    getExtraCols: function() {
        if(this.extraColsInput) {
            return this.extraColsInput.getValue();
        }
        return this.extraCols;
    },

    /**
     * Saves grid modifications.
     * @private
     */
    saveGridModifications: function() {
        if(this.fireEvent("beforesave") !== false) {
            var errors = false;
            var params = {};
            var hasParam = false;

            if( !this.saveURL ) {
                this.saveURL = "/";
            }

            if (this.deletedItems && this.deletedItems.count > 0) {
                delete this.deletedItems["count"];

                for (var path in this.deletedItems) {
                    if(this.modifiedItems[path]) {
                        delete this.modifiedItems[path];
                    }

                    if(this.movedItems[path]) {
                        delete this.movedItems[path];
                    }

                    params[path + CQ.Sling.DELETE_SUFFIX] = "";
                    hasParam = true;
                }
            }

            if (this.modifiedItems && this.modifiedItems.count > 0) {
                delete this.modifiedItems["count"];
                for (var path in this.modifiedItems) {
                    for (var property in this.modifiedItems[path]) {
                        var value = this.modifiedItems[path][property].newValue;
                        if(value!== undefined) {
                            if(!value instanceof Array) {
                                value = [value];
                            }
                            params[path + "/" + this.decodeString(property)] = value;
                            hasParam = true;
                        }
                    }

                    if(this.createdItems[path] && this.insertedResourceType) {
                        params[path + "/" + CQ.wcm.BulkEditor.JCR_RESOURCETYPE] = this.insertedResourceType;
                    }
                }
            }

            if (this.movedItems && this.movedItems.count > 0) {
                delete this.movedItems["count"];
                var orderErrors = false;
                for (var path in this.movedItems) {
                    if(this.saveURL == "/") {
                        //TODO order command must be called in a certain "order" to reflect real row positions
                        //works only for basic moves

                        //currently sling does not support a unique POST on / to order
                        //so send a POST for each re-order
                        var orderParams = [];
                        var orderTo = "last";
                        if( this.movedItems[path].newNextPath ) {
                            var p = this.movedItems[path].newNextPath;
                            orderTo = "before " + p.substring(p.lastIndexOf('/') + 1,p.length);
                        }

                        orderParams[CQ.Sling.ORDER] = orderTo;
                        var response = CQ.HTTP.post(
                                path,
                                null,
                                orderParams);
                         if (!CQ.HTTP.isOk(response)) {
                             orderErrors = true;
                         }
                    } else {
                        var mode = "newindex";
                        if(this.rowMovePostMode) {
                            mode = this.rowMovePostMode;
                        }

                        switch(mode) {
                            case "slingorder": params[path + "@Order"] = (this.movedItems[path].newNextPath ? "before " + this.movedItems[path].newNextPath : "last");
                                             break;
                            default: params[path + "@Order"] = this.movedItems[path].newIndex;
                        }

                        hasParam = true;
                    }
                }

                if (orderErrors) {
                    CQ.Ext.MessageBox.alert(CQ.I18n.getMessage("Saving error"),
                        CQ.I18n.getMessage("Some re-ordering could not be saved."));
                }
            }

            if (hasParam) {
                params[CQ.Sling.CHARSET] = "utf-8";
                var response = CQ.HTTP.post(
                        this.saveURL,
                        null,
                        params);
                 if (!CQ.HTTP.isOk(response)) {
                     errors = true;
                 }
            }

            if (errors) {
                CQ.Ext.MessageBox.alert(CQ.I18n.getMessage("Saving error"),
                    CQ.I18n.getMessage("Some modifications or deletions could not be saved."));
            }

            this.fireEvent("save");

            this.loadGrid();
        }
    }
});

CQ.wcm.BulkEditor.JCR_PATH = "jcr:path";
CQ.wcm.BulkEditor.JCR_CONTENT_NODE = "jcr:content";
CQ.wcm.BulkEditor.JCR_PRIMARYTYPE = "jcr:primaryType";
CQ.wcm.BulkEditor.JCR_RESOURCETYPE = "sling:resourceType";

CQ.Ext.reg("custombulkeditor", CQ.wcm.BulkEditor);

CQ.wcm.BulkEditor.CheckColumn = function(config){
    CQ.Ext.apply(this, config);
    if(!this.id){
        this.id = CQ.Ext.id();
    }
    this.renderer = this.renderer.createDelegate(this);
};

CQ.wcm.BulkEditor.CheckColumn.prototype ={
    init : function(grid){
        this.grid = grid;
        this.grid.on('render', function(){
            var view = this.grid.getView();
            view.mainBody.on('mousedown', this.onMouseDown, this);
        }, this);
    },

    onMouseDown : function(e, t){
        if( this.readOnly !== true && this.readOnly !== "true") {
            if(t.className && t.className.indexOf('x-grid3-cc-'+this.id) != -1){
                e.stopEvent();
                var row = this.grid.getView().findRowIndex(t);
                var record = this.grid.store.getAt(row);
                record.set(this.dataIndex, !record.data[this.dataIndex]);
                this.grid.bulkeditor.handleEditedRecord(record, this.dataIndex, record.data[this.dataIndex], !record.data[this.dataIndex]);
            }
        }
    },

    renderer : function(v, p, record){
        //required because string "false" is true.
        v = record.data[this.dataIndex] === "true" || record.data[this.dataIndex] === true;
        record.data[this.dataIndex] = v;
        p.css += ' x-grid3-check-col-td';
        return '<div class="x-grid3-check-col'+(v?'-on':'')+' x-grid3-cc-'+this.id+'">&#160;</div>';
    }
};