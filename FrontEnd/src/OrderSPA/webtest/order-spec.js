var OrderPage = require('./pages/order-page.js');
var Utilities = require('./utilities.js');

describe('order page tests', function () {
    var orderp = new OrderPage();
    var util = new Utilities();
    var descObj = this;
    this.deleteLastOrders = function (nb2del) {
        //Clean up shop for next run by removing last 2 orders.
        var cnt = orderp.getOrderRows().count().then(function (cnt) {
            expect(cnt).toBeGreaterThan(nb2del - 1);
            for (index = 1; index <= nb2del; index++) {
                var row = orderp.getOrderRows().get(cnt - index); // Start at zero
                row.click();
                expect(orderp.getDeleteOrderButton().isDisplayed()).toBe(true);
                orderp.getDeleteOrderButton().click();
                expect(orderp.getMsg().getText()).toBe('Order deleted!');
            }
        });
    };
    it('check order field validations from Add', function () {
        orderp.get();
        orderp.getAddOrderButton().click();
        expect(orderp.getOrderName().getCssValue('border-color')).toBe('rgb(255, 165, 0)'); // Orange from required and invalid
        expect(orderp.getOrderDIS().getCssValue('border-color')).toBe('rgb(255, 165, 0)'); // Orange from required and invalid
        expect(orderp.getOrderShipTo().getCssValue('border-color')).toBe('rgb(255, 165, 0)'); // Orange from required and invalid

        // Order Name Field validations
        orderp.setOrderName('');
        util.checkErrorIsPresent('orderNameRequired', true); // Required
        orderp.setOrderName('Ab');
        util.checkErrorIsPresent('orderNameFormat', true); // Too small
        util.checkErrorIsPresent('orderNameRequired', false);
        orderp.setOrderName('Abc');
        util.checkErrorIsPresent('orderNameFormat', true); // Too small
        orderp.setOrderName('Abcd');
        util.checkErrorIsPresent('orderNameFormat', false); // Valid
        orderp.setOrderName('1bcdef');
        util.checkErrorIsPresent('orderNameFormat', false); // Valid
        util.checkErrorIsPresent('orderNameRequired', false);
        orderp.setOrderName('~Abcdef');
        util.checkErrorIsPresent('orderNameFormat', true); // Doesn't start with a letter or number
        orderp.setOrderName('0123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789');
        util.checkErrorIsPresent('orderNameFormat', false); // 100 character is ok, max is 100
        orderp.setOrderName('01234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890');
        util.checkErrorIsPresent('orderNameFormat', true); // 101 character is not ok, max is 100

        // Order Due In Store date validations
        orderp.setOrderDIS('10.20');
        util.checkErrorIsPresent('orderDISFormat', true); // Not of YYYY-MM-DD format
        util.checkErrorIsPresent('orderDISRequired', false); // Required
        orderp.setOrderDIS('10-20-2016');
        util.checkErrorIsPresent('orderDISFormat', true); // Not of YYYY-MM-DD format
        orderp.setOrderDIS('2016-10-20');
        util.checkErrorIsPresent('orderDISFormat', false); // Proper YYYY-MM-DD format and values
        orderp.setOrderDIS('0001-05-01');
        util.checkErrorIsPresent('orderDISFormat', false); // Proper YYYY-MM-DD format and values
        orderp.setOrderDIS('2016-10-33');
        util.checkErrorIsPresent('orderDISFormat', true); // DD is over 31.
        orderp.setOrderDIS('2016-13-20');
        util.checkErrorIsPresent('orderDISFormat', true); // DD is over 12.
        orderp.setOrderDIS('2016-03-00');
        util.checkErrorIsPresent('orderDISFormat', true); // DD is not between 01-31.
        orderp.setOrderDIS('2016-00-20');
        util.checkErrorIsPresent('orderDISFormat', true); // MM is not between 01-12.
        orderp.setOrderDIS('1-00-20');
        util.checkErrorIsPresent('orderDISFormat', true); // Year is not 4 digits.
        orderp.setOrderDIS('12-00-20');
        util.checkErrorIsPresent('orderDISFormat', true); // Year is not 4 digits.
        orderp.setOrderDIS('123-00-20');
        util.checkErrorIsPresent('orderDISFormat', true); // Year is not 4 digits.
        orderp.setOrderDIS('0000-05-01');
        util.checkErrorIsPresent('orderDISFormat', false); // Still valid.
        orderp.setOrderDIS('');
        util.checkErrorIsPresent('orderDISRequired', true); // Required

        // Order Estimated shipping date validations
        orderp.setOrderES('10.20');
        util.checkErrorIsPresent('orderESFormat', true); // Not of YYYY-MM-DD format
        orderp.setOrderES('10-20-2016');
        util.checkErrorIsPresent('orderESFormat', true); // Not of YYYY-MM-DD format
        orderp.setOrderES('2016-10-20');
        util.checkErrorIsPresent('orderESFormat', false); // Proper YYYY-MM-DD format and values
        orderp.setOrderES('0001-05-01');
        util.checkErrorIsPresent('orderESFormat', false); // Proper YYYY-MM-DD format and values
        orderp.setOrderES('2016-10-33');
        util.checkErrorIsPresent('orderESFormat', true); // DD is over 31.
        orderp.setOrderES('2016-13-20');
        util.checkErrorIsPresent('orderESFormat', true); // DD is over 12.
        orderp.setOrderES('2016-03-00');
        util.checkErrorIsPresent('orderESFormat', true); // DD is not between 01-31.
        orderp.setOrderES('2016-00-20');
        util.checkErrorIsPresent('orderESFormat', true); // MM is not between 01-12.
        orderp.setOrderES('1-00-20');
        util.checkErrorIsPresent('orderESFormat', true); // Year is not 4 digits.
        orderp.setOrderES('12-00-20');
        util.checkErrorIsPresent('orderESFormat', true); // Year is not 4 digits.
        orderp.setOrderES('123-00-20');
        util.checkErrorIsPresent('orderESFormat', true); // Year is not 4 digits.
        orderp.setOrderES('0000-05-01');
        util.checkErrorIsPresent('orderESFormat', false); // Still valid.
        orderp.setOrderES('');
        util.checkErrorIsPresent('orderESFormat', false); // Empty is valid
        //Before we Save, check that we see the Save and Delete buttons.
        expect(orderp.getSaveOrderButton().isDisplayed()).toBe(true);
        expect(orderp.getDeleteOrderButton().isDisplayed()).toBe(true);
        //The Update, Approve, Reject and Ship buttons are not there.
        expect(orderp.getUpdateOrderButton().isDisplayed()).toBe(false);
        expect(orderp.getSubmitOrderButton().isDisplayed()).toBe(false);
        expect(orderp.getApproveOrderButton().isDisplayed()).toBe(false);
        expect(orderp.getRejectOrderButton().isDisplayed()).toBe(false);
        expect(orderp.getShipOrderButton().isDisplayed()).toBe(false);
        //Not much to do on the Ship To select has it doesn't provide an empty option once initial one is selected.
        //So we populate everything but that one and try to save while nothing is selected and should get error
        orderp.setOrderName('1Test1Order');
        orderp.setOrderTest('true');
        orderp.setOrderDIS('2016-10-01'); // Probably should use JS to get current date+10 days.
        orderp.getSaveOrderButton().click();
        expect(orderp.getMsg().getText()).toBe('At least one field is invalid. Please look for red or orange fields and adjust.');
        //Buttons should still be only Save and Delete
        expect(orderp.getSaveOrderButton().isDisplayed()).toBe(true);
        expect(orderp.getDeleteOrderButton().isDisplayed()).toBe(true);
        expect(orderp.getUpdateOrderButton().isDisplayed()).toBe(false);
        expect(orderp.getSubmitOrderButton().isDisplayed()).toBe(false);
        expect(orderp.getApproveOrderButton().isDisplayed()).toBe(false);
        expect(orderp.getRejectOrderButton().isDisplayed()).toBe(false);
        expect(orderp.getShipOrderButton().isDisplayed()).toBe(false);
        orderp.getDeleteOrderButton().click();
        expect(orderp.getMsg().getText()).toBe('Order deleted!');
    });
    it('saving, updating and deleting new order', function () {
        orderp.get();
        orderp.getAddOrderButton().click();
        //Before we Save, check that we see the Save and Delete buttons.
        expect(orderp.getSaveOrderButton().isDisplayed()).toBe(true);
        expect(orderp.getDeleteOrderButton().isDisplayed()).toBe(true);
        //The Update, Approve, Reject and Ship buttons are not there.
        expect(orderp.getUpdateOrderButton().isDisplayed()).toBe(false);
        expect(orderp.getSubmitOrderButton().isDisplayed()).toBe(false);
        expect(orderp.getApproveOrderButton().isDisplayed()).toBe(false);
        expect(orderp.getRejectOrderButton().isDisplayed()).toBe(false);
        expect(orderp.getShipOrderButton().isDisplayed()).toBe(false);
        orderp.setOrderName('1Test1Order');
        orderp.setOrderDIS('2016-10-01'); // Probably should use JS to get current date+10 days.
        orderp.setOrderShipTo('Store'); // This represents Store since it uses value, not the text displayed.
        orderp.getSaveOrderButton().click();
        //Expecting the success message
        expect(orderp.getMsg().getText()).toBe('Order saved!');
        //Now that we saved the order, let see if Save is gone and we can Submit, Update or Delete
        expect(orderp.getSaveOrderButton().isDisplayed()).toBe(false);
        expect(orderp.getUpdateOrderButton().isDisplayed()).toBe(true);
        expect(orderp.getDeleteOrderButton().isDisplayed()).toBe(true);
        expect(orderp.getSubmitOrderButton().isDisplayed()).toBe(true);
        expect(orderp.getApproveOrderButton().isDisplayed()).toBe(false);
        expect(orderp.getRejectOrderButton().isDisplayed()).toBe(false);
        expect(orderp.getShipOrderButton().isDisplayed()).toBe(false);
        //Cleanup by deleting the order
        orderp.getDeleteOrderButton().click();
        expect(orderp.getMsg().getText()).toBe('Order deleted!');
    });
    it('check promo fields validations from Add', function () {
        orderp.get();
        // Create the order
        orderp.getAddOrderButton().click();
        orderp.setOrderName('1Test1Order');
        orderp.setOrderTest('true');
        orderp.setOrderDIS('2016-10-01'); // Probably should use JS to get current date+10 days.
        orderp.setOrderShipTo('Store'); // This represents Store since it uses value, not the text displayed.
        orderp.getSaveOrderButton().click();
        //Expecting the success message
        expect(orderp.getMsg().getText()).toBe('Order saved!');
        //Create the promo
        orderp.getAddPromoButton().click();
        expect(orderp.getPromoText().getCssValue('border-color')).toBe('rgb(255, 165, 0)'); // Orange from required and invalid
        //Promo Text validation. Needs to be at least 4 characters and start with a letter or a number. Maximum of 500.
        orderp.setPromoText('a');
        util.checkErrorIsPresent('promoTextFormat', true); // Required
        orderp.setPromoText('abc');
        util.checkErrorIsPresent('promoTextFormat', true); // Required
        orderp.setPromoText('abcd');
        util.checkErrorIsPresent('promoTextFormat', false); // Required
        orderp.setPromoText('3bcd');
        util.checkErrorIsPresent('promoTextFormat', false); // Required
        orderp.setPromoText('~bcd');
        util.checkErrorIsPresent('promoTextFormat', true); // Required
        orderp.setPromoText('');
        util.checkErrorIsPresent('promoTextRequired', true); // Required
        orderp.setPromoText('1stPromo');
        util.checkErrorIsPresent('promoTextFormat', false); // Required

        //Due In Store date format validation. Could use an eval method instead?!
        orderp.setPromoDIS('10.20');
        util.checkErrorIsPresent('promoDISFormat', true); // Not of YYYY-MM-DD format
        orderp.setPromoDIS('10-20-2016');
        util.checkErrorIsPresent('promoDISFormat', true); // Not of YYYY-MM-DD format
        orderp.setPromoDIS('2016-10-20');
        util.checkErrorIsPresent('promoDISFormat', false); // Proper YYYY-MM-DD format and values
        orderp.setPromoDIS('0001-05-01');
        util.checkErrorIsPresent('promoDISFormat', false); // Proper YYYY-MM-DD format and values
        orderp.setPromoDIS('2016-10-33');
        util.checkErrorIsPresent('promoDISFormat', true); // DD is over 31.
        orderp.setPromoDIS('2016-13-20');
        util.checkErrorIsPresent('promoDISFormat', true); // DD is over 12.
        orderp.setPromoDIS('2016-03-00');
        util.checkErrorIsPresent('promoDISFormat', true); // DD is not between 01-31.
        orderp.setPromoDIS('2016-00-20');
        util.checkErrorIsPresent('promoDISFormat', true); // MM is not between 01-12.
        orderp.setPromoDIS('1-00-20');
        util.checkErrorIsPresent('promoDISFormat', true); // Year is not 4 digits.
        orderp.setPromoDIS('12-00-20');
        util.checkErrorIsPresent('promoDISFormat', true); // Year is not 4 digits.
        orderp.setPromoDIS('123-00-20');
        util.checkErrorIsPresent('promoDISFormat', true); // Year is not 4 digits.
        orderp.setPromoDIS('0000-05-01');
        util.checkErrorIsPresent('promoDISFormat', false); // Still valid.
        orderp.setPromoDIS('');
        util.checkErrorIsPresent('promoDISFormat', false); // Empty is valid

        //Estimate Shipping date format validation. Could use an eval method instead?!
        orderp.setPromoShipDt('10.20');
        util.checkErrorIsPresent('promoESFormat', true); // Not of YYYY-MM-DD format
        orderp.setPromoShipDt('10-20-2016');
        util.checkErrorIsPresent('promoESFormat', true); // Not of YYYY-MM-DD format
        orderp.setPromoShipDt('2016-10-20');
        util.checkErrorIsPresent('promoESFormat', false); // Proper YYYY-MM-DD format and values
        orderp.setPromoShipDt('0001-05-01');
        util.checkErrorIsPresent('promoESFormat', false); // Proper YYYY-MM-DD format and values
        orderp.setPromoShipDt('2016-10-33');
        util.checkErrorIsPresent('promoESFormat', true); // DD is over 31.
        orderp.setPromoShipDt('2016-13-20');
        util.checkErrorIsPresent('promoESFormat', true); // DD is over 12.
        orderp.setPromoShipDt('2016-03-00');
        util.checkErrorIsPresent('promoESFormat', true); // DD is not between 01-31.
        orderp.setPromoShipDt('2016-00-20');
        util.checkErrorIsPresent('promoESFormat', true); // MM is not between 01-12.
        orderp.setPromoShipDt('1-00-20');
        util.checkErrorIsPresent('promoESFormat', true); // Year is not 4 digits.
        orderp.setPromoShipDt('12-00-20');
        util.checkErrorIsPresent('promoESFormat', true); // Year is not 4 digits.
        orderp.setPromoShipDt('123-00-20');
        util.checkErrorIsPresent('promoESFormat', true); // Year is not 4 digits.
        orderp.setPromoShipDt('0000-05-01');
        util.checkErrorIsPresent('promoESFormat', false); // Still valid.
        orderp.setPromoShipDt('');
        util.checkErrorIsPresent('promoESFormat', false); // Empty is valid

        //Clean up.
        descObj.deleteLastOrders(1);
    });
    it('check sign fields validations from Add', function () {
        orderp.get();
        // Create the order
        orderp.getAddOrderButton().click();
        orderp.setOrderName('1Test1Order');
        orderp.setOrderTest('true');
        orderp.setOrderDIS('2016-10-01'); // Probably should use JS to get current date+10 days.
        orderp.setOrderShipTo('Store'); // This represents Store since it uses value, not the text displayed.
        orderp.getSaveOrderButton().click();
        //Expecting the success message
        expect(orderp.getMsg().getText()).toBe('Order saved!');
        //Create the promo
        orderp.getAddPromoButton().click();
        orderp.setPromoText('SignTestPromo');
        orderp.getSavePromoButton().click();
        expect(orderp.getMsg().getText()).toBe('Promotion saved!');
        //Create the sign
        orderp.getAddSignButton().click();
        //SignType is also required and invalid, but not working so commeting out.
        expect(orderp.getSignType().getCssValue('border-color')).toBe('rgb(255, 165, 0)'); // Orange from required and invalid
        expect(orderp.getSignWidth().getCssValue('border-color')).toBe('rgb(255, 165, 0)'); // Orange from required and invalid
        expect(orderp.getSignHeight().getCssValue('border-color')).toBe('rgb(255, 165, 0)'); // Orange from required and invalid
        expect(orderp.getSignStock().getCssValue('border-color')).toBe('rgb(255, 165, 0)'); // Orange from required and invalid
        orderp.setSignWidth('5');
        util.checkErrorIsPresent('signWidthRequired', false); // Positive integer greather then 0 is a valid width
        util.checkErrorIsPresent('signWidthFormat', false); // Positive integer greather then 0 is a valid width
        orderp.setSignWidth('');
        util.checkErrorIsPresent('signWidthRequired', true); // Empty is invalid
        orderp.setSignWidth('a');
        util.checkErrorIsPresent('signWidthFormat', true); // Letters are invalid
        orderp.setSignWidth('1.1');
        util.checkErrorIsPresent('signWidthFormat', false); // Decimal value is valid
        orderp.setSignWidth('0');
        util.checkErrorIsPresent('signWidthFormat', true); // Zero is not valid
        orderp.setSignWidth('-1');
        util.checkErrorIsPresent('signWidthFormat', true); // Negative value is invalid
        orderp.setSignHeight('5');
        util.checkErrorIsPresent('signHeightRequired', false); // Positive integer greather then 0 is a valid width
        util.checkErrorIsPresent('signHeightFormat', false); // Positive integer greather then 0 is a valid width
        orderp.setSignHeight('');
        util.checkErrorIsPresent('signHeightRequired', true); // Empty is invalid
        orderp.setSignHeight('a');
        util.checkErrorIsPresent('signHeightFormat', true); // Letters are invalid
        orderp.setSignHeight('1.1');
        util.checkErrorIsPresent('signHeightFormat', false); // Decimal value is valid
        orderp.setSignHeight('0');
        util.checkErrorIsPresent('signHeightFormat', true); // Zero is not invalid
        orderp.setSignHeight('-1');
        util.checkErrorIsPresent('signHeightFormat', true); // Negative value is invalid

        descObj.deleteLastOrders(1);
    });
    it('full order creation and selection test', function () {
        orderp.get();
        orderp.getOrderRows().count().then(function success(orderCount) {

            // Create first Order
            orderp.getAddOrderButton().click();
            orderp.setOrderName('1Test1Order');
            orderp.setOrderTest('true');
            orderp.setOrderDIS('2016-10-01'); // Probably should use JS to get current date+10 days.
            orderp.setOrderShipTo('Store'); // This represents Store since it uses value, not the text displayed.
            orderp.getSaveOrderButton().click();
            //Expecting the success message
            expect(orderp.getMsg().getText()).toBe('Order saved!');
            // Create second Order
            orderp.getAddOrderButton().click();
            orderp.setOrderName('1Test2ndOrder');
            orderp.setOrderTest('true');
            orderp.setOrderDIS('2016-12-22'); // Probably should use JS to get current date+10 days.
            orderp.setOrderShipTo('Division'); // This represents Store since it uses value, not the text displayed.
            orderp.getSaveOrderButton().click();
            //Expecting the success message
            expect(orderp.getMsg().getText()).toBe('Order saved!');
            //Add a promo to the second order
            orderp.getAddPromoButton().click();
            orderp.setPromoText('Promo Test Text for 2nd order');
            orderp.setPromoDIS('2017-09-01');
            orderp.getSavePromoButton().click();
            //Go back to first order. The count is the #rows, the get() starts at zero, so no need to do +1 to get first new order.
            var rows = orderp.getOrderRows();
            var rowtd = rows.get(orderCount).all(by.tagName('td')).get(2);
            rowtd.click();
            expect(orderp.getUpdateOrderButton().isDisplayed()).toBe(true);
            expect(orderp.getSubmitOrderButton().isDisplayed()).toBe(true);
            expect(orderp.getDeleteOrderButton().isDisplayed()).toBe(true);
            expect(orderp.getSaveOrderButton().isDisplayed()).toBe(false);
            //Add two promo to the first order
            orderp.getAddPromoButton().click();
            orderp.setPromoText('Promo Test 1 Text for 1st order');
            orderp.setPromoDIS('2017-09-01');
            orderp.getSavePromoButton().click();
            expect(orderp.getMsg().getText()).toBe("Promotion saved!");
            orderp.getAddPromoButton().click();
            orderp.setPromoText('Promo Test 2 Text for 1st order');
            orderp.setPromoShipDt('2017-10-11');
            orderp.getSavePromoButton().click();
            expect(orderp.getMsg().getText()).toBe("Promotion saved!");
            //Add sign to second promo of firt order
            orderp.getAddSignButton().click();
            orderp.setSignType('Banner');
            orderp.setSignWidth('3');
            orderp.setSignHeight('2');
            orderp.setSignStock('.020 White');
            orderp.setSignShipping('Tampa');
            orderp.getSaveSignButton().click();
            expect(orderp.getMsg().getText()).toBe('Sign saved!');
            // Click back on the order and try to submit
            rows = orderp.getOrderRows();
            rows.count(function success(cnt) {
                console.log('order count:' + cnt);
            });
            rowtd = rows.get(orderCount).all(by.tagName('td')).get(2);
            rowtd.click();
            expect(orderp.getUpdateOrderButton().isDisplayed()).toBe(true);
            expect(orderp.getSubmitOrderButton().isDisplayed()).toBe(true);
            expect(orderp.getDeleteOrderButton().isDisplayed()).toBe(true);
            expect(orderp.getSaveOrderButton().isDisplayed()).toBe(false);
            orderp.getSubmitOrderButton().click();
            expect(orderp.getMsg().getText()).toBe("Got errors submitting order! See below.");
            //Go back to first promo and add signs.
            //First row is the header, so take second rows as our first promo.
            //First two columns are for the caret indicator toggle on or off so might not be visible, so go to the third column to click. 
            rows = orderp.getPromoRows();
            rowtd= rows.get(1).all(by.tagName('td')).get(2);
            rowtd.click();
            expect(orderp.getUpdatePromoButton().isDisplayed()).toBe(true);
            expect(orderp.getDeletePromoButton().isDisplayed()).toBe(true);
            expect(orderp.getSavePromoButton().isDisplayed()).toBe(false);
            orderp.getAddSignButton().click(); 
            orderp.setSignType('Window Banner Sml');
            orderp.setSignWidth('5');
            orderp.setSignHeight('3');
            orderp.setSignStock('.020 Transparent');
            orderp.setSignNotes('Keep the white border.');
            orderp.setSignShipping('Manhatan');
            orderp.getSaveSignButton().click();
            expect(orderp.getMsg().getText()).toBe('Sign saved!');
            orderp.getAddSignButton().click();
            orderp.setSignType('Banner');
            orderp.setSignWidth('15');
            orderp.setSignHeight('8');
            orderp.setSignStock('.020 White');
            orderp.setSignNotes('Round up top corners.');
            orderp.setSignShipping('Clearwater');
            orderp.getSaveSignButton().click();
            expect(orderp.getMsg().getText()).toBe('Sign saved!');
            // Click back on the order and try to submit
            rows = orderp.getOrderRows();
            rowtd = rows.get(orderCount).all(by.tagName('td')).get(2);
            rowtd.click();
            expect(orderp.getUpdateOrderButton().isDisplayed()).toBe(true);
            expect(orderp.getSubmitOrderButton().isDisplayed()).toBe(true);
            expect(orderp.getDeleteOrderButton().isDisplayed()).toBe(true);
            expect(orderp.getShipOrderButton().isDisplayed()).toBe(false);
            expect(orderp.getSaveOrderButton().isDisplayed()).toBe(false);
            orderp.getSubmitOrderButton().click();
            expect(orderp.getMsg().getText()).toBe("Order Submitted!");
            expect(orderp.getUpdateOrderButton().isDisplayed()).toBe(true);
            expect(orderp.getApproveOrderButton().isDisplayed()).toBe(true);
            expect(orderp.getDeleteOrderButton().isDisplayed()).toBe(true);
            expect(orderp.getSubmitOrderButton().isDisplayed()).toBe(false);
            expect(orderp.getSaveOrderButton().isDisplayed()).toBe(false);

            // Confirm that we can still do updates during approval phase
            rows = orderp.getPromoRows();
            rowtd = rows.get(1).all(by.tagName('td')).get(2);
            rowtd.click();
            expect(orderp.getUpdatePromoButton().isDisplayed()).toBe(true);
            expect(orderp.getDeletePromoButton().isDisplayed()).toBe(true);
            expect(orderp.getSavePromoButton().isDisplayed()).toBe(false);
            //expect(orderp.getPromoText().getText()).toBe('Promo Test 1 Text for 1st order');
            orderp.setPromoText('Promo Test 1 Text for 1st order - Updated');
            orderp.getUpdatePromoButton().click();
            expect(orderp.getMsg().getText()).toBe("Promotion updated!");
            // Click back on the order and try to Approve
            rows = orderp.getOrderRows();
            rowtd = rows.get(orderCount).all(by.tagName('td')).get(2);
            rowtd.click();
            expect(orderp.getUpdateOrderButton().isDisplayed()).toBe(true);
            expect(orderp.getApproveOrderButton().isDisplayed()).toBe(true);
            expect(orderp.getDeleteOrderButton().isDisplayed()).toBe(true);
            expect(orderp.getShipOrderButton().isDisplayed()).toBe(false);
            expect(orderp.getSubmitOrderButton().isDisplayed()).toBe(false);
            expect(orderp.getSaveOrderButton().isDisplayed()).toBe(false);
            orderp.getApproveOrderButton().click();
            expect(orderp.getDeleteOrderButton().isDisplayed()).toBe(true);
            expect(orderp.getShipOrderButton().isDisplayed()).toBe(true);
            expect(orderp.getUpdateOrderButton().isDisplayed()).toBe(false);
            expect(orderp.getApproveOrderButton().isDisplayed()).toBe(false);
            expect(orderp.getSubmitOrderButton().isDisplayed()).toBe(false);
            expect(orderp.getSaveOrderButton().isDisplayed()).toBe(false);
            //Try to ship any signs that are completed. Should receive a 0 count
            orderp.getShipOrderButton().click();
            expect(orderp.getMsg().getText()).toBe("0 completed signs shipped!");

            //Complete a few signs from different promotions
            rows = orderp.getPromoRows();
            rowtd = rows.get(1).all(by.tagName('td')).get(2);
            rowtd.click();
            expect(orderp.getUpdatePromoButton().isDisplayed()).toBe(false);
            expect(orderp.getDeletePromoButton().isDisplayed()).toBe(false);
            expect(orderp.getSavePromoButton().isDisplayed()).toBe(false);
            //Test the ship from order
            rows = orderp.getSignRows();
            rowtd = rows.get(1).all(by.tagName('td')).get(4); // Get the status column
            rowtd.click();
            expect(orderp.getStartSignButton().isDisplayed()).toBe(true);
            expect(orderp.getCompleteSignButton().isDisplayed()).toBe(false);
            expect(orderp.getShipSignButton().isDisplayed()).toBe(false);
            orderp.getStartSignButton().click();
            expect(orderp.getMsg().getText()).toBe("Sign started!");
            expect(rowtd.getText()).toBe('Started');
            expect(orderp.getStartSignButton().isDisplayed()).toBe(false);
            expect(orderp.getCompleteSignButton().isDisplayed()).toBe(true);
            expect(orderp.getShipSignButton().isDisplayed()).toBe(false);
            orderp.getCompleteSignButton().click();
            expect(orderp.getMsg().getText()).toBe("Sign completed!");
            expect(rowtd.getText()).toBe('Completed');
            expect(orderp.getStartSignButton().isDisplayed()).toBe(false);
            expect(orderp.getCompleteSignButton().isDisplayed()).toBe(false);
            expect(orderp.getShipSignButton().isDisplayed()).toBe(true);

            rows = orderp.getPromoRows();
            rowtd = rows.get(2).all(by.tagName('td')).get(2);
            rowtd.click();
            rows = orderp.getSignRows();
            rowtd = rows.get(1).all(by.tagName('td')).get(4); // Get the status column
            rowtd.click();
            expect(orderp.getStartSignButton().isDisplayed()).toBe(true);
            expect(orderp.getCompleteSignButton().isDisplayed()).toBe(false);
            expect(orderp.getShipSignButton().isDisplayed()).toBe(false);
            orderp.getStartSignButton().click();
            expect(orderp.getMsg().getText()).toBe("Sign started!");
            expect(rowtd.getText()).toBe('Started');
            expect(orderp.getStartSignButton().isDisplayed()).toBe(false);
            expect(orderp.getCompleteSignButton().isDisplayed()).toBe(true);
            expect(orderp.getShipSignButton().isDisplayed()).toBe(false);
            orderp.getCompleteSignButton().click();
            expect(orderp.getMsg().getText()).toBe("Sign completed!");
            expect(rowtd.getText()).toBe('Completed');
            expect(orderp.getStartSignButton().isDisplayed()).toBe(false);
            expect(orderp.getCompleteSignButton().isDisplayed()).toBe(false);
            expect(orderp.getShipSignButton().isDisplayed()).toBe(true);

            rows = orderp.getOrderRows();
            rowtd = rows.get(orderCount).all(by.tagName('td')).get(2);
            rowtd.click();
            orderp.getShipOrderButton().click();
            expect(orderp.getMsg().getText()).toBe("2 completed signs shipped!");
            //Complete and Ship the rest of the signs
            rows = orderp.getPromoRows();
            rowtd = rows.get(1).all(by.tagName('td')).get(2);
            rowtd.click();
            rows = orderp.getSignRows();
            rowtd = rows.get(2).all(by.tagName('td')).get(4); // Get the status column
            rowtd.click();
            orderp.getStartSignButton().click();
            expect(orderp.getMsg().getText()).toBe("Sign started!");
            expect(rowtd.getText()).toBe('Started');
            orderp.getCompleteSignButton().click();
            expect(orderp.getMsg().getText()).toBe("Sign completed!");
            expect(rowtd.getText()).toBe('Completed');
            orderp.getShipSignButton().click();
            expect(orderp.getMsg().getText()).toBe("Sign shipped!");
            expect(rowtd.getText()).toBe('Shipped');
            //Verify order is completed
            rows = orderp.getOrderRows();
            rowtd = rows.get(orderCount).all(by.tagName('td')).get(4);
            rowtd.click();
            expect(rowtd.getText()).toBe('Completed');

            //Cleanup
            descObj.deleteLastOrders(2);
        });
    });
});