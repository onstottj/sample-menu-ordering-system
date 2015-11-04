/**
 * @author Jon Onstott
 * @since 11/3/2015
 */
posModule.controller('OrderListController', function ($scope, $http, orderStatus, viewManager) {
    // Proxy some orderStatus values/functions.  Maybe there's a better way to do this (like wrapping these in an object)?
    $scope.isShowingList = viewManager.isShowingList;

    $scope.allOrders = [];

    $scope.ordersExist = function () {
        return $scope.allOrders.length > 0;
    };

    $scope.showInProgressOrders = false;
    $scope.showUnpaidOrders = false;
    $scope.showPaidOrders = false;

    $scope.toggleShowAll = function () {
        var newState = !$scope.areAllShown();
        $scope.showInProgressOrders = newState;
        $scope.showUnpaidOrders = newState;
        $scope.showPaidOrders = newState;
    };
    $scope.areAllShown = function () {
        return $scope.showInProgressOrders && $scope.showUnpaidOrders && $scope.showPaidOrders;
    };

    $scope.determineOrderStatus = function (order) {
        var status = "";
        if (!order.orderNumber) {
            status += "IN PROGRESS ";
        }
        if (order.tender) {
            status += "PAID ";
        } else {
            status += "UNPAID";
        }
        return status;
    };

    $scope.hasOrderNumber = function (order) {
        return order.orderNumber && isFinite(order.orderNumber);
    };

    // TODO: move this order retrieval code into its own service

    var orderRetrievalPromise;
    var retrieveAfterPromiseCompletes = false;

    /** @returns {boolean} true if there could be orders to display */
    function shouldLoadOrders() {
        return $scope.showInProgressOrders || $scope.showUnpaidOrders || $scope.showPaidOrders;
    }

    function retrieveOrders() {
        if (!orderRetrievalPromise) {
            // We're not loading order data at the moment

            if (!shouldLoadOrders()) {
                $scope.allOrders = [];
                retrieveAfterPromiseCompletes = false;
                return;
            }

            var filterOnOrderNumber = $scope.showInProgressOrders !== $scope.showUnpaidOrders;
            var filterOnTendered = $scope.showUnpaidOrders !== $scope.showPaidOrders;
            var hasOrderNumberParam = filterOnOrderNumber ? "hasOrderNumber=" + $scope.showUnpaidOrders : "";
            var isTenderedParam = filterOnTendered ? "isTendered=" + $scope.showPaidOrders : "";
            // TODO: remove '?' and '&' if we don't need them
            orderRetrievalPromise = $http.get(baseUrl + "orders?" + hasOrderNumberParam + "&" + isTenderedParam);
            orderRetrievalPromise.then(function (response) {
                orderRetrievalPromise = null;
                if (!retrieveAfterPromiseCompletes) {
                    $scope.allOrders = response.data;
                } else {
                    // The toggle buttons have changed so we need to reload the order data
                    retrieveAfterPromiseCompletes = false;
                    retrieveOrders();
                }
            });
        } else {
            // We're in the process of loading order data already
            retrieveAfterPromiseCompletes = true;
        }
    }

    // When the filters change, refresh the list of orders
    $scope.$watchGroup(['showInProgressOrders', 'showUnpaidOrders', 'showPaidOrders'], retrieveOrders);

    $scope.startNewOrder = function () {
        orderStatus.startNewOrder();
        viewManager.setIsShowingList(false);
    };

    $scope.openOrder = function (order) {
        orderStatus.editOrder(order);
        viewManager.setIsShowingList(false);
    };
});