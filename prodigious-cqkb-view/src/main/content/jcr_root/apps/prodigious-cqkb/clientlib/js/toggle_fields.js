
//------------------------------------------------------------------------------
// Exercise 2: Toggle Fields
//------------------------------------------------------------------------------

/**
 * Toggles the field set on the same tab as the check box.
 * @param {CQ.Ext.form.Checkbox} box The check box
 */
Prodigious.CQWidgets.x2.toggleFieldSet = function(box) {
    var panel = box.findParentByType('panel');
    var fieldSet = panel.findByType('dialogfieldset')[0];
    var show = box.getValue()[0];
    if (show) {
        fieldSet.show();
        panel.doLayout();
    } else {
        fieldSet.hide();
        fieldSet.items.each(function(field) {
            try {
                field.setValue();
            } catch (e) {
                // Do nothing
            }
        });
    }
};
