/**
 * @author Jon Onstott
 * @since 11/3/2015
 */
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