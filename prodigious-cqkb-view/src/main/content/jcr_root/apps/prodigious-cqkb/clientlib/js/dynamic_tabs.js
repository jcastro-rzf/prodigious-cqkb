
//------------------------------------------------------------------------------
// Exercise 1: Dynamic Dialogs
//------------------------------------------------------------------------------

/**
 * Manages the tabs of the specified tab panel. The tab with
 * the specified ID will be shown, the others are hidden.
 * @param {CQ.Ext.TabPanel} tabPanel The tab panel
 * @param {String} tab the ID of the tab to show
 */
Prodigious.CQWidgets.x2.manageTabs = function(tabPanel, tab) {
    var tabs = ['selection', 'tab1', 'tab2', 'tab3'];
    var index = tab ? tabs.indexOf(tab) : -1;
    for (var i = 1; i != tabs.length; i++) {
        if (index == i) {
            tabPanel.unhideTabStripItem(i);
        } else {
            tabPanel.hideTabStripItem(i);
        }
    }
    tabPanel.doLayout();
};

/**
 * Hides the specified tab.
 * @param {CQ.Ext.Panel} tab The panel
 */
Prodigious.CQWidgets.x2.hideTab = function(tab) {
    var tabPanel = tab.findParentByType('tabpanel');
    var index = tabPanel.items.indexOf(tab);
    tabPanel.hideTabStripItem(index);
};

/**
 * Shows the tab which ID matches the value of the specified field.
 * @param {CQ.Ext.form.Field} field The field
 */
Prodigious.CQWidgets.x2.showTab = function(field) {
    Prodigious.CQWidgets.x2.manageTabs(field.findParentByType('tabpanel'), field.getValue());
};
