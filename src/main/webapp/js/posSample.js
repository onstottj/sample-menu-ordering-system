/**
 * @author Jon Onstott
 * @since 11/1/2015
 */

// In a real app, we wouldn't have globals hanging around like this
var baseUrl = "http://localhost:8080/api/";

var posModule = angular.module('posApp', ['ui.bootstrap', 'ngFileUpload']);

posModule.service('orderStatusService', function ($http) {
    // This is set once the order has been created in the backend
    var orderId;
    // A dictionary of the items in the order; see http://stackoverflow.com/questions/11985863/how-to-use-ng-repeat-for-dictionaries-in-angularjs
    var itemsInOrder = {};
    // When payment is processed, this becomes a JSON object with amountTendered and changeDue
    var paymentResults = {};

    function createOrder(initialItem) {
        // Create an empty order, retrieving the order ID from the AJAX call
        var newOrder = {id: null, orderNumber: null, items: []};
        $http.post(baseUrl + "orders", newOrder)
            .then(function (response) {
                orderId = response.data;

                // Now add the initial item to the order
                $http.post(baseUrl + "orders/" + orderId + "/items", {itemId: initialItem.id});
            });
    }

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
        itemsInOrder: itemsInOrder,
        addItem: function (item) {
            var itemName = item.name;

            var existingItem = itemsInOrder[itemName];

            var newItem = existingItem || {item: item, quantity: 0};
            newItem.quantity++;

            itemsInOrder[itemName] = newItem;

            // Update the backend as needed
            if (!orderId) {
                createOrder(item);
            }
        },
        removeItem: function (item) {
            delete itemsInOrder[item.name];
        },
        getSubtotal: getSubtotal,
        getSalesTax: getSalesTax,
        getGrandTotal: function () {
            return getSubtotal() + getSalesTax();
        },
        paymentResults: paymentResults
    };
});

posModule.controller('OrderEntryController', function ($scope, $http, $uibModal, orderStatusService) {
    // Proxy some orderStatusService values/functions
    $scope.itemsInOrder = orderStatusService.itemsInOrder;
    $scope.addItem = orderStatusService.addItem;
    $scope.getSubtotal = orderStatusService.getSubtotal;
    $scope.getSalesTax = orderStatusService.getSalesTax;
    $scope.getGrandTotal = orderStatusService.getGrandTotal;
    $scope.paymentResults = orderStatusService.paymentResults;

    $scope.allItems = [];
    $scope.selectedItem = null;

    $scope.selectItem = function (item) {
        $scope.selectedItem = item;
    };

    $scope.voidSelectedItem = function () {
        orderStatusService.removeItem($scope.selectedItem);
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

posModule.controller('TenderPaymentController', function ($scope, $uibModalInstance, orderStatusService) {
    // Proxy some orderStatusService values/functions
    $scope.getGrandTotal = orderStatusService.getGrandTotal;

    $scope.amountTendered = 0;

    $scope.getChangeDue = function () {
        var amountTendered = $scope.amountTendered;
        if (amountTendered && isFinite(amountTendered)) {
            var change = amountTendered - orderStatusService.getGrandTotal();
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
        orderStatusService.paymentResults.amountTendered = $scope.amountTendered;
        orderStatusService.paymentResults.changeDue = $scope.getChangeDue();

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