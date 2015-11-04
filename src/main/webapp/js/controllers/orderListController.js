/**
 * @author Jon Onstott
 * @since 11/3/2015
 */
posModule.controller('OrderListController', function ($scope, $http, viewManager) {
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
        if (order.orderNumber) {
            status += "IN PROGRESS ";
        }
        if (order.tender) {
            status += "PAID ";
        } else {
            status += "UNPAID";
        }
        return status;
    };

    var orderRetrievalPromise;
    var retrieveAfterPromiseCompletes = false;

    /** @returns {boolean} true if there could be orders to display */
    function shouldLoadOrders() {
        return $scope.showInProgressOrders || $scope.showUnpaidOrders || $scope.showPaidOrders;
    }

    function retrieveOrders() {
        if (!orderRetrievalPromise) {
            if (!shouldLoadOrders()) {
                $scope.allOrders = [];
                retrieveAfterPromiseCompletes = false;
                return;
            }

            // We're not loading order data yet

            var filterOnOrderNumber = $scope.showInProgressOrders !== $scope.showUnpaidOrders;
            var filterOnTendered = $scope.showUnpaidOrders !== $scope.showPaidOrders;
            var requireOrderNumberParam = filterOnOrderNumber ? "requireOrderNumber=" + $scope.showUnpaidOrders : "";
            var requireIsTenderedParam = filterOnTendered ? "requireIsTendered=" + $scope.showPaidOrders : "";
            // TODO: remove '?' and '&' if we don't need them
            orderRetrievalPromise = $http.get(baseUrl + "orders?" + requireOrderNumberParam + "&" + requireIsTenderedParam);
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
});