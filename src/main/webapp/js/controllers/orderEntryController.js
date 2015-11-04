/**
 * @author Jon Onstott
 * @since 11/1/2015
 */
posModule.controller('OrderEntryController', function ($scope, $http, $uibModal, viewManager, orderStatus, orderPersistence) {
    // Proxy some orderStatus values/functions.  Maybe there's a better way to do this (like wrapping these in an object)?
    $scope.isShowingList = viewManager.isShowingList;
    $scope.setIsShowingList = viewManager.setIsShowingList;
    $scope.hasOrderNumber = orderStatus.hasOrderNumber;
    $scope.getOrderNumber = orderStatus.getOrderNumber;
    $scope.itemsInOrder = orderStatus.itemsInOrder;
    $scope.addItem = orderStatus.addItem;
    $scope.getSubtotal = orderStatus.getSubtotal;
    $scope.getSalesTax = orderStatus.getSalesTax;
    $scope.getGrandTotal = orderStatus.getGrandTotal;
    $scope.paymentResults = orderStatus.paymentResults;

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
        // Assign the order number now that the user is ready to do payment
        orderPersistence.assignOrderNumber(orderStatus.getOrderId())
            .then(function (response) {
                orderStatus.setOrderNumber(response.data);
            });

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