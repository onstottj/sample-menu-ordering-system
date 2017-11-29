(function () {
	'use strict';
	angular.module('posApp')
		.controller('TenderPaymentController', TenderPaymentController);

	/**
	 * TenderPaymentController controller
	 */
	TenderPaymentController.$inject = ['$uibModalInstance', 'orderStatus', 'orderPersistence'];
	function TenderPaymentController($uibModalInstance, orderStatus, orderPersistence) {
		var vm = this;

		vm.amountTendered = 0;
		vm.cancelPayment = cancelPayment;
		vm.getChangeDue = getChangeDue;
		vm.getGrandTotal = orderStatus.getGrandTotal;
		vm.isPaymentValid = isPaymentValid;
		vm.submitPayment = submitPayment;

		function getChangeDue() {
			var amountTendered = vm.amountTendered;
			if (amountTendered && isFinite(amountTendered)) {
				var change = amountTendered - orderStatus.getGrandTotal();
				if (change > 0) {
					return change;
				}
			}
			return "-----";
		}

		function isPaymentValid() {
			return isFinite(getChangeDue());
		}

		function submitPayment() {
			var amountTendered = vm.amountTendered;
			var changeDue = getChangeDue();

			orderStatus.paymentResults.amountTendered = amountTendered;
			orderStatus.paymentResults.changeDue = changeDue;

			orderPersistence.recordPayment(orderStatus.getOrderId(), amountTendered, changeDue);

			$uibModalInstance.close();
		}

		function cancelPayment() {
			$uibModalInstance.dismiss('cancel');
		}
	}
})();
