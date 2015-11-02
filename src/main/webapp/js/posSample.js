/**
 * @author Jon Onstott
 * @since 11/1/2015
 */

// In a real app, we wouldn't have globals hanging around like this
var baseUrl = "http://localhost:8080/api/";
// This sales tax is about 6%
var salesTaxRate = 0.059446733372;

var posModule = angular.module('posApp', ['ui.bootstrap', 'ngFileUpload']);

posModule.service('orderStatusService', function () {
    // A dictionary of the items in the order; see http://stackoverflow.com/questions/11985863/how-to-use-ng-repeat-for-dictionaries-in-angularjs
    var itemsInOrder = {};
    return {
        itemsInOrder : itemsInOrder
    };
});

posModule.controller('OrderEntryController', function ($scope, $http, $uibModal, orderStatusService) {
    $scope.allItems = [];
    $scope.itemsInOrder = orderStatusService.itemsInOrder;
    $scope.selectedItem = null;
    $scope.amountTendered = 0;

    $scope.addItem = function (item) {
        var itemName = item.name;

        var existingItem = orderStatusService.itemsInOrder[itemName];

        var newItem = existingItem || {item: item, quantity: 0};
        newItem.quantity++;

        orderStatusService.itemsInOrder[itemName] = newItem;
    };

    $scope.selectItem = function (item) {
        $scope.selectedItem = item;
    };

    $scope.getSubtotal = function () {
        var subtotal = 0;
        angular.forEach(orderStatusService.itemsInOrder, function (entry) {
            subtotal += entry.quantity * entry.item.price;
        });
        return subtotal;
    };

    $scope.getSalesTax = function () {
        return $scope.getSubtotal() * salesTaxRate;
    };

    $scope.getGrandTotal = function () {
        return $scope.getSubtotal() + $scope.getSalesTax();
    };

    $scope.voidSelectedItem = function () {
        var item = $scope.selectedItem;
        delete orderStatusService.itemsInOrder[item.name];
        $scope.selectedItem = null;
    };

    $scope.getChangeDue = function () {
        var amountTendered = $scope.amountTendered;
        if (amountTendered && isFinite(amountTendered)) {
            var change = amountTendered - $scope.getGrandTotal();
            if (change > 0) {
                return change;
            }
        }
        return "-----";
    };

    $scope.isPaymentValid = function () {
        return isFinite($scope.getChangeDue());
    };

    $scope.startPaying = function () {
        // TODO: use different controller?
        $uibModal.open({
            animation: true,
            templateUrl: 'tenderPaymentDialog.html',
            controller: 'OrderEntryController'
        });
    };

    $scope.submitPayment = function () {
        // TODO

        $uibModalInstance.close();
    };

    $scope.cancelPayment = function () {
        $scope.amountTendered = 0;

        $uibModalInstance.dismiss('cancel');
    };

    // Load the list of menu items
    $http.get(baseUrl + 'items').success(function (data) {
        $scope.allItems = data;
    });
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