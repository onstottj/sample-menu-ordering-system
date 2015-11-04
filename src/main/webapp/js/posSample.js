/**
 * @author Jon Onstott
 * @since 11/1/2015
 */

// In a real app, we wouldn't have globals hanging around like this
var baseUrl = "http://localhost:8080/api/";

var posModule = angular.module('posApp', ['ui.bootstrap', 'ngFileUpload']);

// A service for CRUD operations on Orders using REST
posModule.service('orderPersistence', function ($http, $q) {
    function addItemToOrder(orderId, itemId) {
        $http.post(baseUrl + "orders/" + orderId + "/items?itemId=" + itemId);
    }

    return {
        /**
         * @returns a promise that is resolved with the new order's ID
         */
        createOrder: function (initialItem) {
            return $q(function (resolve, reject) {
                var newOrder = {id: null, orderNumber: null, items: []};
                $http.post(baseUrl + "orders", newOrder)
                    .then(function (response) {
                        var orderId = response.data;
                        addItemToOrder(orderId, initialItem.id);
                        resolve(orderId);
                    }, function () {
                        reject("The new order's ID couldn't be retrieved");
                    });
            });
        },
        addItemToOrder: addItemToOrder,
        removeItemFromOrder: function (orderId, itemId) {
            $http.delete(baseUrl + "orders/" + orderId + "/items/" + itemId);
        },
        assignOrderNumber: function (orderId) {
            return $http.get(baseUrl + "orders/" + orderId + "/assignOrderNumber");
        },
        recordPayment: function (orderId, amountTendered, changeDue) {
            var tenderRecord = {
                orderId: orderId,
                amountTendered: amountTendered,
                changeDue: changeDue
            };
            $http.post(baseUrl + "orders/" + orderId + "/tender", tenderRecord);
        }
    };
});

posModule.service('orderStatus', function ($http, orderPersistence) {
    // This is set once the order has been created in the backend
    var orderId;
    var orderNumber;
    // A dictionary of the items in the order; see http://stackoverflow.com/questions/11985863/how-to-use-ng-repeat-for-dictionaries-in-angularjs
    var itemsInOrder = {};
    // When payment is processed, this becomes a JSON object with amountTendered and changeDue
    var paymentResults = {};

    function getSubtotal() {
        var subtotal = 0;
        angular.forEach(itemsInOrder, function (entry) {
            subtotal += entry.quantity * entry.item.price;
        });
        return subtotal;
    }

    function getSalesTax() {
        // This sales tax is about 6%.  The rate could be made into a constant of some sort.
        return getSubtotal() * 0.059446733372;
    }

    return {
        getOrderId: function () {
            return orderId;
        },
        getOrderNumber: function () {
            return orderNumber;
        },
        setOrderNumber: function (newOrderNumber) {
            orderNumber = newOrderNumber;
        },
        itemsInOrder: itemsInOrder,
        addItem: function (item) {
            var itemName = item.name;

            var existingItem = itemsInOrder[itemName];

            var newItem = existingItem || {item: item, quantity: 0};
            newItem.quantity++;

            itemsInOrder[itemName] = newItem;

            // Update the backend
            if (!orderId) {
                orderPersistence.createOrder(item).then(function (id) {
                    orderId = id;
                });
            } else {
                orderPersistence.addItemToOrder(orderId, item.id);
            }
        },
        removeItem: function (item) {
            delete itemsInOrder[item.name];
            orderPersistence.removeItemFromOrder(orderId, item.id);
        },
        getSubtotal: getSubtotal,
        getSalesTax: getSalesTax,
        getGrandTotal: function () {
            return getSubtotal() + getSalesTax();
        },
        paymentResults: paymentResults
    };
});

posModule.controller('OrderEntryController', function ($scope, $http, $uibModal, orderStatus) {
    // Proxy some orderStatus values/functions.  Maybe there's a better way to do this (like wrapping these in an object)?
    $scope.getOrderNumber = orderStatus.getOrderNumber;
    $scope.itemsInOrder = orderStatus.itemsInOrder;
    $scope.addItem = orderStatus.addItem;
    $scope.getSubtotal = orderStatus.getSubtotal;
    $scope.getSalesTax = orderStatus.getSalesTax;
    $scope.getGrandTotal = orderStatus.getGrandTotal;
    $scope.paymentResults = orderStatus.paymentResults;

    $scope.hasOrderNumber = function () {
        return isFinite(orderStatus.getOrderNumber());
    };

    $scope.allItems = [];
    $scope.selectedItem = null;

    $scope.selectItem = function (item) {
        $scope.selectedItem = item;
    };

    $scope.voidSelectedItem = function () {
        orderStatus.removeItem($scope.selectedItem);
        $scope.selectedItem = null;
    };

    $scope.startPaying = function () {
        $uibModal.open({
            animation: true,
            templateUrl: 'tenderPaymentDialog.html',
            controller: 'TenderPaymentController'
        });
    };

    $scope.isPaymentComplete = function () {
        var paymentResults = $scope.paymentResults;
        return isFinite(paymentResults.amountTendered) && isFinite(paymentResults.changeDue);
    };

    // Load the list of menu items
    $http.get(baseUrl + 'items').success(function (data) {
        $scope.allItems = data;
    });
});

posModule.controller('TenderPaymentController', function ($scope, $uibModalInstance, orderStatus, orderPersistence) {
    // Proxy some orderStatus values/functions
    $scope.getGrandTotal = orderStatus.getGrandTotal;

    $scope.amountTendered = 0;

    $scope.getChangeDue = function () {
        var amountTendered = $scope.amountTendered;
        if (amountTendered && isFinite(amountTendered)) {
            var change = amountTendered - orderStatus.getGrandTotal();
            if (change > 0) {
                return change;
            }
        }
        return "-----";
    };

    $scope.isPaymentValid = function () {
        return isFinite($scope.getChangeDue());
    };

    $scope.submitPayment = function () {
        var amountTendered = $scope.amountTendered;
        var changeDue = $scope.getChangeDue();

        orderStatus.paymentResults.amountTendered = amountTendered;
        orderStatus.paymentResults.changeDue = changeDue;

        orderPersistence.recordPayment(orderStatus.getOrderId(), amountTendered, changeDue);

        // Assign the order number after we've created it in the backend
        orderPersistence.assignOrderNumber(orderStatus.getOrderId())
            .then(function (response) {
                orderStatus.setOrderNumber(response.data);
            });

        $uibModalInstance.close();
    };

    $scope.cancelPayment = function () {
        $uibModalInstance.dismiss('cancel');
    };

});

posModule.controller('FileUploadController', ['$scope', 'Upload', '$timeout', function ($scope, Upload, $timeout) {
    // Angular file upload code adapted from http://jsfiddle.net/danialfarid/0mz6ff9o/135/
    $scope.uploadFiles = function (file, errFiles) {
        $scope.f = file;
        $scope.errFile = errFiles && errFiles[0];
        if (file) {
            file.upload = Upload.upload({
                url: baseUrl + 'items/upload',
                data: {file: file}
            });

            file.upload.then(function (response) {
                $timeout(function () {
                    file.result = response.data;
                    $scope.uploadMessage = 'Items imported successfully';
                });
            }, function (response) {
                // There was an error
                if (response.status > 0)
                    $scope.uploadMessage = 'HTTP ' + response.status + ': ' + response.data;
            }, function (evt) {
                file.progress = Math.min(100, parseInt(100.0 *
                    evt.loaded / evt.total));
            });
        }
    }
}]);

// From http://stackoverflow.com/a/17648547/132374
posModule.filter('padWithLeadingZeros', function () {
    return function (n, len) {
        var num = parseInt(n, 10);
        len = parseInt(len, 10);
        if (isNaN(num) || isNaN(len)) {
            return n;
        }
        num = '' + num;
        while (num.length < len) {
            num = '0' + num;
        }
        return num;
    };
});