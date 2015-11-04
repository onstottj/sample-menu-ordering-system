/**
 * @author Jon Onstott
 * @since 11/3/2015
 */
posModule.controller('OrderListController', function ($scope, viewManager) {
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
});