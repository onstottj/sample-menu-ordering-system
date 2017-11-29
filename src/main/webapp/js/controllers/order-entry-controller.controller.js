(function () {
	'use strict';
	angular.module('posApp')
		.controller('OrderEntryController', OrderEntryController);

	/**
	 * OrderEntryController controller
	 */
	OrderEntryController.$inject = ['$http', '$uibModal', 'viewManager', 'orderStatus', 'orderPersistence'];
	function OrderEntryController($http, $uibModal, viewManager, orderStatus, orderPersistence) {
		var vm = this;

		vm.addItem = orderStatus.addItem;
		vm.allItems = [];
		vm.getGrandTotal = orderStatus.getGrandTotal;
		vm.getOrderNumber = orderStatus.getOrderNumber;
		vm.getSalesTax = orderStatus.getSalesTax;
		vm.getSubtotal = orderStatus.getSubtotal;
		vm.hasOrderNumber = orderStatus.hasOrderNumber;
		vm.isPaymentComplete = isPaymentComplete;
		vm.itemsInOrder = orderStatus.itemsInOrder;
		vm.paymentResults = orderStatus.paymentResults;
		vm.selectedItem = null;
		vm.selectItem = selectItem;
		vm.startPaying = startPaying;
		vm.viewManager = viewManager;
		vm.voidSelectedItem = voidSelectedItem;

		activate();

		function activate() {
			// Load the list of menu items
			$http.get(baseUrl + 'items').success(function (data) {
				vm.allItems = data;
			});
		}

		function startPaying() {
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
		}

		function isPaymentComplete() {
			return isFinite(vm.paymentResults.amountTendered) && isFinite(vm.paymentResults.changeDue);
		}

		function selectItem(item) {
			vm.selectedItem = item;
		}

		function voidSelectedItem() {
			orderStatus.removeItem(vm.selectedItem);
			vm.selectedItem = null;
		}
	}
})();
