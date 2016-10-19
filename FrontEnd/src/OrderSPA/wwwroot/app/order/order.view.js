angular.module('pocOrder', ['ngRoute','pocApp'])
.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/order', {
        templateUrl: '/app/order/order.template.html',
        controller: 'OrderController',
        resolve: {
            'data': 'staticData'
        }
    });
}])
.controller('OrderController', ['$scope', '$http', '$location','data', function ($scope,$http,$location,data) {
    console.log('initializing order');
    $scope.orders = [{}];
    $scope.order = {};
    $scope.promotion = {};
    $scope.sign = {};
    // Would normally do $http calls to get information from DB. If the info is used in more then one place or might be in the future, a service should provide it instead of a direct call to $http.
    // For this demo, we 'hard code' the values.
    $scope.data = {
        msg: 'Loading orders!',
        msgList: [],
        shipLst: [{ value: 1, text: 'HQ' }, { value: 2, text: 'Division' }, { value: 4, text: 'Store' }],
        signTypeLst: [{ value: 1, text: 'Banner' }, { value: 2, text: 'Danlger' }, { value: 3, text: 'Door Banner Sml' }, { value: 4, text: 'Door Banner Med' }, { value: 5, text: 'Door Banner Lrg' }, { value: 6, text: 'Window Banner Sml' }, { value: 7, text: 'Window Banner Med' }, { value: 8, text: 'Window Banner Lrg' }, { value: 9999, text: 'Miscellianeous' }],
        stockLst: [{ value: 1, text: '.012 White' }, { value: 2, text: '.020 White' }, { value: 3, text: '.012 Transparent' }, { value: 4, text: '.020 Transparent' }, { value: 5, text: '.020 Magnet' }, { value: 6, text: '.040 Magnet' }],
        storeLst: [{ value: 1, text: 'Tampa' }, { value: 2, text: 'Clearwater' }, { value: 100, text: 'Manhatan' }, { value: 101, text: 'New-Jersey' }, { value: 200, text: 'San-Francisco' }, { value: 201, text: 'Oakland' }],
        divisionLst: [{ value: 1, text: 'Tampa Area' }, { value: 2, text: 'NY Area' }, { value: 3, text: 'San-Francisco Area' }],
        hqLst: [{ value: 1, text: 'Tampa HQ' }]
    };
    $scope.signShipToSettings = { displayProp: 'text', idProp: 'value', externalIdProp: 'shipValue' };
    // Get the list of orders of the customer for initial display
    $http({
        method: 'GET',
        url: data.wsurl + '/Order/All?customerId=1'
    }).then(function success(response) {
        $scope.orders = response.data;
        $scope.sendMessage('');
    }, function errors(response) {
        $scope.data.msg = "Got errors fetching orders!" + response.status;
    });
    // Function to get fields to validate for the 3 different sections
    $scope.getOrderFieldLst=function() {
        return [$scope.orderform.ordername, $scope.orderform.orderdis, $scope.orderform.ordershipTo, $scope.orderform.orderestship];
    };
    $scope.getPromoFieldLst = function () {
        return [$scope.orderform.promotext, $scope.orderform.promodis, $scope.orderform.promoshipTo, $scope.orderform.promoestship, $scope.orderform.promonotes];
    };
    $scope.getSignFieldLst = function () {
        return [$scope.orderform.signType, $scope.orderform.signWidth, $scope.orderform.signHeight, $scope.orderform.stock];
    };
    // Wrapper to send message to user. Centralizes the code and make it easy to change how the message is delivered.
    $scope.sendMessage = function (msg) {
        $scope.data.msg = msg;
        if (msg === '') $scope.data.msgList = [];
    };
    // Get text from list as per above $scope.data.xxxLst format (value and text attributes)
    $scope.getSelectText = function (value, lst) {
        for (index in lst) {
            if (lst[index].value == value) return lst[index].text;
        }
        return "Unknown";
    };
    // Get text from value of ship to. It uses the $scope.data.shipLst array to make the match.
    $scope.getShipText = function (value) {
        return $scope.getSelectText(value, $scope.data.shipLst);
    };
    // Get text from value of Sign Type. It uses the $scope.data.signTypeLst array to make the match.
    $scope.getSignText = function (value) {
        return $scope.getSelectText(value, $scope.data.signTypeLst);
    };
    // Resets the list of fields to an unchanged status
    $scope.clearFieldIndicators = function (fieldList) {
        for (index in fieldList) {
            fieldList[index].$setPristine();
        }
    };
    // Show message if a field is invalid
    $scope.checkForInvalid=function(fieldList) {
        for (index in fieldList) {
            if (fieldList[index].$invalid) {
                $scope.sendMessage('At least one field is invalid. Please look for red or orange fields and adjust.');
                return true;
            }
        }
        return false;
    };
    // Adds an unsaved order to the list
    $scope.addOrder = function () {
        $scope.order = { 'name': 'New', 'isNew': 'true', 'status':'Draft','promotions': [], 'isLoaded':'false','customerId':'1'};
        $scope.orders.push($scope.order);
        $scope.sign = {};
        $scope.promotion = {};
        $scope.sendMessage('');
        $scope.clearFieldIndicators($scope.getOrderFieldLst());
    };
    // Saves an order. Note that from WS called, we only save the order information, not the underlying promotion and/or signs.
    $scope.saveOrder = function () {
        var fieldList = $scope.getOrderFieldLst();
        if ($scope.checkForInvalid(fieldList)) return false;
        $scope.sendMessage('');
        $http({
            method: 'POST',
            url: data.wsurl + '/Order',
            data: $scope.order
        }).then(function success(response) {
            $scope.sendMessage("Order saved!");
            $scope.order.isNew = 'false';
            $scope.order.id = response.data.id;
            $scope.clearFieldIndicators($scope.getOrderFieldLst());
        }, function errors(response) {
            $scope.sendMessage("Got errors saving order! " + response.status);
        });
    };
    // Updates an order. Note that from WS called, we only save the order information, not the underlying promotion and/or signs.
    $scope.updateOrder = function () {
        var fieldList = $scope.getOrderFieldLst();
        if ($scope.checkForInvalid(fieldList)) return false;
        $scope.sendMessage('');
        $http({
            method: 'PUT',
            url: data.wsurl + '/Order',
            data: $scope.order
        }).then(function success(response) {
            $scope.sendMessage("Order updated!");
            $scope.order.isNew = 'false';
            $scope.clearFieldIndicators($scope.getOrderFieldLst());
        }, function errors(response) {
            $scope.sendMessage("Got errors updating order! " + response.status);
        });
    };
    // Select the order, grab order information from WS and indicate that no promotion or signs were selected (i.e. restarting selections).
    $scope.selectOrder = function (selectedOrder) {
        $scope.order = selectedOrder;
        $scope.promotion = {};
        $scope.sign = {};
        $scope.sendMessage('');
        if (!(selectedOrder.isNew && selectedOrder.isNew=='true')) {
            $http({
                method: 'GET',
                url: data.wsurl + '/Order/GetWithPromo?id=' + $scope.order.id
            }).then(function success(response) {
                $scope.order = response.data;
                $scope.order.isNew = 'false';
                $scope.sendMessage('');
                var index = $scope.orders.indexOf(selectedOrder);
                $scope.orders[index] = $scope.order;
                $scope.clearFieldIndicators($scope.getOrderFieldLst());
            }, function errors(response) {
                $scope.sendMessage("Got errors fetching orders!" + response.status);
            });
        }
    };
    // Deletes an order and indicate that no promotion or signs were selected (i.e. restarting selections).
    $scope.deleteOrder = function () {
        $scope.sendMessage('');
        $http({
            method: 'DELETE',
            url: data.wsurl + '/Order',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json, text/plain'
            },
            data: $scope.order
        }).then(function success(response) {
            $scope.sendMessage("Order deleted!");
            var index = $scope.orders.indexOf($scope.order);
            $scope.orders.splice(index, 1);
            $scope.order = {};
            $scope.promotion = {};
            $scope.sign = {};
            $scope.clearFieldIndicators($scope.getOrderFieldLst());
        }, function errors(response) {
            $scope.sendMessage("Got errors deleting order! " + response.statusText);
        });
    };
    // Submits the order for approval
    $scope.submitOrder = function () {
        $scope.sendMessage('');
        $http({
            method: 'POST',
            url: data.wsurl + '/Order/Submit',
            data: $scope.order
        }).then(function success(response) {
            $scope.sendMessage("Order Submitted!");
            $scope.order.status = response.data.status;
        }, function errors(response) {
            if (response.status === 404) {
                $scope.sendMessage("Got errors submitting order! See below.");
                //alert(response.data);
                $scope.data.msgList = response.data;
            } else {
                $scope.sendMessage("Got errors submitting order! " + response.status);
            }
        });
    };
    // Approves the order and starts production in facility
    $scope.approveOrder = function () {
        $scope.sendMessage('');
        $http({
            method: 'POST',
            url: data.wsurl + '/Order/Approve',
            data: $scope.order
        }).then(function success(response) {
            $scope.sendMessage("Order Approved!");
            $scope.order.status = response.data.status;
        }, function errors(response) {
            $scope.sendMessage("Got errors approving order! " + response.status);
        });
    };
    // Approves the order and starts production in facility
    $scope.rejectOrder = function () {
        $scope.sendMessage('');
        $http({
            method: 'POST',
            url: data.wsurl + '/Order/Reject',
            data: $scope.order
        }).then(function success(response) {
            $scope.sendMessage("Order Rejected!");
            $scope.order.status = response.data.status;
        }, function errors(response) {
            $scope.sendMessage("Got errors rejecting order! " + response.status);
        });
    };
    // Ship all completed signs
    $scope.shipOrder = function () {
        $scope.sendMessage('');
        $http({
            method: 'POST',
            url: data.wsurl + '/Order/Ship',
            data: $scope.order
        }).then(function success(response) {
            console.log('Order Ship:' + response.data);
            $scope.sendMessage(response.data + ' completed signs shipped!');
        }, function errors(response) {
            console.log('Order Ship Error:' + response.data);
            $scope.sendMessage("Got errors shipping order signs! " + response.status);
        });
    };
    // Adds an unsaved promotion to the order
    $scope.addPromo = function () {
        $scope.promotion = { 'name': 'New', 'isNew': 'true','signs':[],'shipTo':$scope.order.shipTo,'orderid':$scope.order.id };
        $scope.order.promotions.push($scope.promotion);
        $scope.clearFieldIndicators($scope.getPromoFieldLst());
        $scope.sendMessage('');
    };
    // Selects a promotion, grab promotion information from WS and indicates no signs were selected
    $scope.selectPromotion = function (selectedPromo) {
        $scope.promotion = selectedPromo;
        $scope.sign = {};
        $scope.sendMessage('');
        if (!(selectedPromo.isNew && selectedPromo.isNew=='true')) {
            $http({
                method: 'GET',
                url: data.wsurl + '/Order/PromoWithSign?id=' + $scope.promotion.id
            }).then(function success(response) {
                $scope.promotion = response.data;
                $scope.promotion.isNew = 'false';
                $scope.sendMessage('');
                $scope.clearFieldIndicators($scope.getPromoFieldLst());
            }, function errors(response) {
                $scope.sendMessage("Got errors fetching orders!" + response.status);
            });
        }
    };
    // Saves the promotion by calling the WS. Clears the visual indicator of changes
    $scope.savePromotion = function () {
        $scope.promotion.orderid = $scope.order.id;
        console.log('Saving Promo with orderid=' + $scope.promotion.orderid);
        var fieldList = $scope.getPromoFieldLst();
        if ($scope.checkForInvalid(fieldList)) return false;
        $scope.sendMessage('');
        $http({
            method: 'POST',
            url: data.wsurl + '/Order/Promo',
            data: $scope.promotion
        }).then(function success(response) {
            console.log('Promotion Saved!');
            $scope.sendMessage("Promotion saved!");
            $scope.promotion.isNew = 'false';
            $scope.promotion.id = response.data.id;
            $scope.clearFieldIndicators($scope.getPromoFieldLst());
        }, function errors(response) {
            $scope.sendMessage("Got errors saving order! " + response.status);
        });
    };
    // Updates the promotion by calling the WS. Clears the visual indicator of changes
    $scope.updatePromotion = function () {
        $scope.promotion.orderid = $scope.order.id;
        var fieldList = $scope.getPromoFieldLst();
        if ($scope.checkForInvalid(fieldList)) return false;
        $scope.sendMessage('');
        $http({
            method: 'PUT',
            url: data.wsurl + '/Order/Promo',
            data: $scope.promotion
        }).then(function success(response) {
            $scope.sendMessage("Promotion updated!");
            $scope.promotion.isNew = 'false';
            $scope.clearFieldIndicators($scope.getPromoFieldLst());
        }, function errors(response) {
            $scope.sendMessage("Got errors saving order! " + response.status);
        });
    };
    // Deletes a promotion from the order and indicates that no promotion or sign is selected.
    $scope.deletePromotion = function () {
        $scope.promotion.orderid = $scope.order.id;
        $scope.sendMessage('');
        $http({
            method: 'DELETE',
            url: data.wsurl + '/Order/Promo',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json, text/plain'
            },
            data: $scope.promotion
        }).then(function success(response) {
            $scope.sendMessage("Promotion deleted!");
            $scope.promotion.isNew = 'false';
            var index = $scope.order.promotions.indexOf($scope.promotion);
            $scope.order.promotions.splice(index, 1);
            $scope.promotion = {};
            $scope.sign = {};
            $scope.clearFieldIndicators($scope.getPromoFieldLst());
        }, function errors(response) {
            $scope.sendMessage("Got errors saving order! " + response.status);
        });
    };
    // Adds an unsaved sign the the promotion
    $scope.addSign = function () {
        var shipType = $scope.promotion.shipType;
        if (!(shipType) || shipType==0) shipType = $scope.order.shipTo;
        $scope.sign = { 'id':'','signType': '','status':'Draft', 'isNew': 'true', 'shippings':[], 'shipTo':shipType,'promoid': $scope.promotion.id };
        $scope.promotion.signs.push($scope.sign);
        $scope.clearFieldIndicators($scope.getSignFieldLst());
        $scope.sendMessage('');
    };
    // Selects a sign and get the sign information from WS
    $scope.selectSign = function (selectedSign) {
        $scope.sign = selectedSign;
        $scope.sendMessage('');
        if (!(selectedSign.isNew && selectedSign.isNew=='true')) {
            $http({
                method: 'GET',
                url: data.wsurl + '/Order/Sign?id=' + $scope.sign.id
            }).then(function success(response) {
                $scope.sign = response.data;
                $scope.sign.isNew = 'false';
                $scope.sendMessage('');
                var index = $scope.promotion.signs.indexOf(selectedSign);
                $scope.promotion.signs[index] = response.data;
                $scope.clearFieldIndicators($scope.getSignFieldLst());
            }, function errors(response) {
                $scope.sendMessage("Got errors fetching orders!" + response.status);
            });
        }
    };
    // Saves a sign using the WS
    $scope.saveSign = function () {
        $scope.sign.promoid = $scope.promotion.id;
        var fieldList = $scope.getSignFieldLst();
        if ($scope.checkForInvalid(fieldList)) return false;
        if (!($scope.sign.shippings) || $scope.sign.shippings.length == 0) {
            $scope.sendMessage('Please select at least one place to ship the sign to!');
            return false;
        }
        $scope.sendMessage('');
        $http({
            method: 'POST',
            url: data.wsurl + '/Order/Sign',
            data: $scope.sign
        }).then(function success(response) {
            $scope.sendMessage("Sign saved!");
            $scope.sign.isNew = 'false';
            $scope.sign.id = response.data.id;
            $scope.clearFieldIndicators($scope.getSignFieldLst());
        }, function errors(response) {
            $scope.sendMessage("Got errors saving order! " + response.status);
        });
    };
    // Update a sign using the WS
    $scope.updateSign = function () {
        $scope.sign.promoid = $scope.promotion.id;
        var fieldList = $scope.getSignFieldLst();
        if ($scope.checkForInvalid(fieldList)) return false;
        $scope.sendMessage('');
        $http({
            method: 'PUT',
            url: data.wsurl + '/Order/Sign',
            data: $scope.sign
        }).then(function success(response) {
            $scope.sendMessage("Sign updated!");
            $scope.sign.isNew = 'false';
            $scope.clearFieldIndicators($scope.getSignFieldLst());
        }, function errors(response) {
            $scope.sendMessage("Got errors saving order! " + response.status);
        });
    };
    // Delete a sign from the promotion, calls the WS and indicate that no sign is selected.
    $scope.deleteSign = function () {
        $scope.sign.promoid = $scope.promotion.id;
        $scope.sendMessage('');
        $http({
            method: 'DELETE',
            url: data.wsurl + '/Order/Sign',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json, text/plain'
            },
            data: $scope.sign
        }).then(function success(response) {
            $scope.sendMessage("Sign deleted!");
            $scope.sign.isNew = 'false';
            var index = $scope.promotion.signs.indexOf($scope.promotion);
            $scope.promotion.signs.splice(index, 1);
            $scope.sign = {};
            $scope.clearFieldIndicators($scope.getSignFieldLst());
        }, function errors(response) {
            $scope.sendMessage("Got errors saving order! " + response.status);
        });
    };
    // Indicate that the sign has been started in production (can't delete from order anymore)
    $scope.startSign = function () {
        $scope.sendMessage('');
        $http({
            method: 'POST',
            url: data.wsurl + '/Order/Sign/Start',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json, text/plain'
            },
            data: $scope.sign
        }).then(function success(response) {
            //alert('Response:'+response.data.status);
            if (response.data.status && response.data.status == 'Started') {
                $scope.sign.status = response.data.status;
                $scope.sendMessage("Sign started!");
            } else {
                $scope.sendMessage("Sign couldn't be started!");
            }
        }, function errors(response) {
            $scope.sendMessage("Got errors starting sign! " + response.status);
        });
    };
    // Indicate that the sign is completed in production and waiting to be shipped.
    $scope.completeSign = function () {
        $scope.sendMessage('');
        $http({
            method: 'POST',
            url: data.wsurl + '/Order/Sign/Complete',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json, text/plain'
            },
            data: $scope.sign
        }).then(function success(response) {
            if (response.data.status && response.data.status == 'Completed') {
                $scope.sign.status = response.data.status;
                $scope.sendMessage("Sign completed!");
            } else {
                $scope.sendMessage("Sign couldn't be completed!");
            }
        }, function errors(response) {
            $scope.sendMessage("Got errors completing sign! " + response.status);
        });
    };
    // Indicates the completed sign is shipped
    $scope.shipSign = function () {
        $scope.sendMessage('');
        $http({
            method: 'POST',
            url: data.wsurl + '/Order/Sign/Ship',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json, text/plain'
            },
            data: $scope.sign
        }).then(function success(response) {
            $scope.sendMessage("Sign shipped!");
            $scope.sign.status = response.data.status;
            // Is this the last sign to be compeleted
            $http({
                method: 'GET',
                url: data.wsurl + '/Order/GetWithPromo?id=' + $scope.order.id
            }).then(function success(resp2) {
                $scope.order.status = response.data.status;
            }, function errors(resp2) {
                $scope.sendMessage("Unable to check order status! Please re-select.");
            });
        }, function errors(response) {
            if (response.status === 404) {
                $scope.sendMessage(response.data);
            } else {
                $scope.sendMessage("Got errors shipping sign! " + response.status);
            }
        });
    };
}]);