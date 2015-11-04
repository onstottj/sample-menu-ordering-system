/**
 * @author Jon Onstott
 * @since 11/3/2015
 */
posModule.controller('OrderListController', function ($scope, viewManager) {
    // Proxy some orderStatus values/functions.  Maybe there's a better way to do this (like wrapping these in an object)?
    $scope.isShowingList = viewManager.isShowingList;
});