var Utilities = require('../utilities');
var OrderPage = function () {
    var util = new Utilities();
    var msg = element(by.id('pageMsg'));
    var msgRows = element.all(by.css('#pageMsgLst li'));
    var orderName = element(by.model('order.name'));
    var orderTest = element(by.model('order.test'));
    var orderShipTo = element(by.model('order.shipTo'));
    var orderDIS = element(by.model('order.dueInStoreDt'));
    var orderShipDt = element(by.model('order.estShipDt'));
    var addOrderButton = element(by.id('addOrderButton'));
    var saveOrderButton = element(by.id('orderSave'));
    var updateOrderButton = element(by.id('orderUpdate'));
    var deleteOrderButton = element(by.id('orderDelete'));
    var submitOrderButton = element(by.id('orderSubmit'));
    var approveOrderButton = element(by.id('orderApprove'));
    var rejectOrderButton = element(by.id('orderReject'));
    var shipOrderButton = element(by.id('orderShip'));
    var orderRows = element.all(by.css('#orderList tr'));

    var promoText = element(by.model('promotion.promoText'));
    var promoDIS = element(by.model('promotion.dueInStoreDt'));
    var promoShipTo = element(by.model('promotion.shipTo'));
    var promoShipDt = element(by.model('promotion.estShipDt'));
    var promoNotes = element(by.model('promotion.notes'));
    var addPromoButton = element(by.id('addPromoButton'));
    var savePromoButton = element(by.id('promoSave'));
    var updatePromoButton = element(by.id('promoUpdate'));
    var deletePromoButton = element(by.id('promoDelete'));
    var promoRows = element.all(by.css('#promoList tr'));

    var signType = element(by.model('sign.signType'));
    var signWidth = element(by.model('sign.width'));
    var signHeight = element(by.model('sign.height'));
    var signStock = element(by.model('sign.stock'));
    var signShipping = element(by.id('signShipTo'));
    var signNotes = element(by.model('sign.notes'));
    var addSignButton = element(by.id('addSignButton'));
    var saveSignButton = element(by.id('signSave'));
    var updateSignButton = element(by.id('signUpdate'));
    var deleteSignButton = element(by.id('signDelete'));
    var startSignButton = element(by.id('signStart'));
    var completeSignButton = element(by.id('signComplete'));
    var shipSignButton = element(by.id('signShip'));
    var signRows = element.all(by.css('#signList tr'));

    this.get = function () {
        browser.get('http://localhost:55597/#!/order');
    };
    this.getMsg = function () {
        return msg;
    };
    this.getMsgRows = function () {
        return msgRows;
    };
    this.getOrderRows = function () {
        return orderRows;
    };
    this.getLastCount = function () {
        rowCount;
    };
    this.getOrderName = function () {
        return orderName;
    };
    this.setOrderName = function (val) {
        orderName.clear();
        orderName.sendKeys(val);
    };
    this.getOrderTest = function () {
        return orderTest;
    };
    this.setOrderTest = function (val) {
        orderTest.getText().then(function success(response) {
            console.log("Checkbox value=" + response + " wanted value=" + val);
            if (response != val) {
                console.log("Checkbox clicked!");
                orderTest.click();
            }
        });
    };
    this.getOrderShipTo = function () {
        return orderShipTo;
    };
    this.getOrderShipToValue = function () {
        return util.getSelectedValue(orderShipTo);
    };
    this.setOrderShipTo = function (val) {
        util.setSelectedText(orderShipTo, val);
    };
    this.getOrderDIS = function () {
        return orderDIS;
    };
    this.setOrderDIS = function (val) {
        orderDIS.clear();
        orderDIS.sendKeys(val);
    };
    this.getOrderES = function () {
        return orderShipDt;
    };
    this.setOrderES = function (val) {
        orderShipDt.clear();
        orderShipDt.sendKeys(val);
    };
    this.getAddOrderButton = function () {
        return addOrderButton;
    };
    this.getSaveOrderButton = function () {
        return saveOrderButton;
    };
    this.getUpdateOrderButton = function () {
        return updateOrderButton;
    };
    this.getDeleteOrderButton = function () {
        return deleteOrderButton;
    };
    this.getSubmitOrderButton = function () {
        return submitOrderButton;
    };
    this.getApproveOrderButton = function () {
        return approveOrderButton;
    };
    this.getRejectOrderButton = function () {
        return rejectOrderButton;
    };
    this.getShipOrderButton = function () {
        return shipOrderButton;
    };
    this.getPromoRows = function () {
        return promoRows;
    };
    this.setPromoText = function (val) {
        promoText.clear();
        promoText.sendKeys(val);
    };
    this.getPromoText = function () {
        return promoText;
    };
    this.setPromoDIS = function (val) {
        promoDIS.clear();
        promoDIS.sendKeys(val);
    };
    this.getPromoDIS = function () {
        return promoDIS;
    };
    this.setPromoShipTo = function (val) {
        promoShipTo.clear();
        promoShipTo.sendKeys(val);
    };
    this.getPromoShipTo = function () {
        return promoShipTo;
    };
    this.setPromoShipDt = function (val) {
        promoShipDt.clear();
        promoShipDt.sendKeys(val);
    };
    this.getPromoShipDt = function () {
        return promoShipDt;
    };
    this.setPromoNotes = function (val) {
        promoNotes.clear();
        promoNotes.sendKeys(val);
    };
    this.getPromoNotes = function () {
        return promoNotes;
    };
    this.getAddPromoButton = function () {
        return addPromoButton;
    };
    this.getSavePromoButton = function () {
        return savePromoButton;
    };
    this.getUpdatePromoButton = function () {
        return updatePromoButton;
    };
    this.getDeletePromoButton = function () {
        return deletePromoButton;
    };
    this.getSignType = function () {
        return signType;
    };
    this.setSignType = function (val) {
        util.setSelectedText(signType, val);
    };
    this.getSignStock = function () {
        return signStock;
    };
    this.setSignStock = function (val) {
        util.setSelectedText(signStock, val);
    };
    this.getSignShipping = function () {
        return signShipping;
    };
    this.setSignShipping = function (val) {
        signShipping.all(by.tagName('button')).click();
        signShipping.all(by.cssContainingText('a', val)).click();
    };
    this.getSignWidth = function () {
        return signWidth;
    };
    this.setSignWidth = function (val) {
        signWidth.clear();
        signWidth.sendKeys(val);
    };
    this.getSignHeight = function () {
        return signHeight;
    };
    this.setSignHeight = function (val) {
        signHeight.clear();
        signHeight.sendKeys(val);
    };
    this.getSignNotes = function () {
        return signNotes;
    };
    this.setSignNotes = function (val) {
        signNotes.clear();
        signNotes.sendKeys(val);
    };
    this.getAddSignButton = function () {
        return addSignButton;
    };
    this.getSaveSignButton = function () {
        return saveSignButton;
    };
    this.getUpdateSignButton = function () {
        return updateSignButton;
    };
    this.getDeleteSignButton = function () {
        return deleteSignButton;
    };
    this.getStartSignButton = function () {
        return startSignButton;
    };
    this.getCompleteSignButton = function () {
        return completeSignButton;
    };
    this.getShipSignButton = function () {
        return shipSignButton;
    };
    this.getSignRows = function () {
        return signRows;
    };
};
module.exports = OrderPage;