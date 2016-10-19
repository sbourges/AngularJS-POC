var Utilities=function() {
    this.setCheckbox = function (fieldModel, val) {
        fieldModel.isSelected().then(function checked(checked) {
            if ((val && checked) || (!val && !checked)) {
                //Already to proper value.
            } else {
                fieldModel.click();
            }
        });
    };
    this.setSelectedValue = function (fieldModel, value) {
        fieldModel.click();
        fieldModel.all(by.css('option[value="' + value + '"]')).click();
        //fieldModel.$('[value="' + stype + '"]').click();
    };
    this.setSelectedText = function (fieldModel, text) {
        fieldModel.click();
        fieldModel.all(by.cssContainingText('option', text)).click();
    };
    this.getSelectedValue = function (fieldModel) {
        return fieldModel.$('option:checked').getValue();
    }
    this.checkErrorIsPresent = function (id, expected) {
        var msg = element(by.id(id));
        if (expected === true) {
            expect(msg.isDisplayed()).toBe(true);
        } else {
            expect(msg.isDisplayed()).toBe(false);
        }
    };
};
module.exports = Utilities;