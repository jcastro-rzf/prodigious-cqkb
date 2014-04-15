
//------------------------------------------------------------------------------
// Exercise 3: Toggle Tabs
//------------------------------------------------------------------------------

/**
 * Shows the tabs which IDs match the values of the specified fields.
 * @param {CQ.Ext.form.Field} field The list of tabs that will be displayed
 */
Prodigious.CQWidgets.x2.showMultipleTabs = function(field) {
    Prodigious.CQWidgets.x2.manageMultipleTabs(field.findParentByType('tabpanel'), field.getValue());
};

/**
 * Manages the tabs of the specified tab panel. The tabs with
 * the specified IDs will be shown, the others are hidden.
 * @param {CQ.Ext.TabPanel} tabPanel The tab panel
 * @param {String} tab the ID of the tab to show
 */
Prodigious.CQWidgets.x2.manageMultipleTabs = function(tabPanel, tab) {
    //var tabs = ['selection', 'tab1', 'tab2', 'tab3'];
    var tabs = Prodigious.CQWidgets.x2.getTabList(tabPanel);
    var selectedTabs = [];
    for (var j = 0; j != tabs.length; j++) {
        selectedTabs.push(-1);
    }
    for (var j = 0; j != tab.length; j++) {
        var currentTab = tab[j];
        var tabIndex = currentTab ? tabs.indexOf(currentTab) : -1;
        if (tabIndex > 0) {
            selectedTabs[tabIndex] = 1;
        }
    }
    for (var i = 1; i != selectedTabs.length; i++) {
        var index = selectedTabs[i];
        if (index > 0) {
            tabPanel.unhideTabStripItem(i);
        } else {
            tabPanel.hideTabStripItem(i);
        }
    }
    tabPanel.doLayout();
};

/**
 * Dynamically generates the list of current tabs in the dialog.
 * @param {CQ.Ext.Panel} tab The tab panel
 */
Prodigious.CQWidgets.x2.getTabList = function(tabPanel) {
    var tabList = tabPanel.findByType("panel", true);
    var dialogTabs = ["selection"];
    for (var i = 1; i != tabList.length; i++) {
        dialogTabs.push("tab" + i);
    }
    return dialogTabs;
};

