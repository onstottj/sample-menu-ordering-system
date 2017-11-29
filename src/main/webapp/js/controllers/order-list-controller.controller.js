(function () {
	'use strict';
	angular.module('posApp')
		.controller('OrderListController', OrderListController);

	/**
	 * OrderListController controller
	 */
	OrderListController.$inject = ['$scope', '$http', 'orderStatus', 'viewManager'];
	function OrderListController($scope, $http, orderStatus, viewManager) {
		var orderRetrievalPromise;
		var retrieveAfterPromiseCompletes = false;
		var vm = this;

		vm.allOrders = [];
		vm.areAllShown = areAllShown;
		vm.determineOrderStatus = determineOrderStatus;
		vm.hasOrderNumber = hasOrderNumber;
		vm.openOrder = openOrder;
		vm.ordersExist = ordersExist;
		vm.showInProgressOrders = false;
		vm.showPaidOrders = false;
		vm.showUnpaidOrders = false;
		vm.startNewOrder = startNewOrder;
		vm.toggleShowAll = toggleShowAll;
		vm.viewManager = viewManager;

		activate();

		function activate() {
			// When the filters change, refresh the list of orders
			$scope.$watchGroup(['showInProgressOrders', 'showUnpaidOrders', 'showPaidOrders'], retrieveOrders);

			// When the orders list is shown, refresh the list of orders
			// From http://www.bennadel.com/blog/2658-using-scope-watch-to-watch-functions-in-angularjs.htm
			$scope.$watch(function () {
				return viewManager.isShowingList;
			}, function () {
				if (viewManager.isShowingList) {
					retrieveOrders();
				}
			});

		}

		function startNewOrder() {
			orderStatus.startNewOrder();
			viewManager.setIsShowingList(false);
		}

		function openOrder(order) {
			orderStatus.editOrder(order);
			viewManager.setIsShowingList(false);
		}

		/** @returns {boolean} true if there could be orders to display */
		function shouldLoadOrders() {
			return vm.showInProgressOrders || vm.showUnpaidOrders || vm.showPaidOrders;
		}

		function retrieveOrders() {
			if (!orderRetrievalPromise) {
				// We're not loading order data at the moment

				if (!shouldLoadOrders()) {
					vm.allOrders = [];
					retrieveAfterPromiseCompletes = false;
					return;
				}

				var filterOnOrderNumber = vm.showInProgressOrders !== vm.showUnpaidOrders;
				var filterOnTendered = vm.showUnpaidOrders !== vm.showPaidOrders;
				var hasOrderNumberParam = filterOnOrderNumber ? "hasOrderNumber=" + vm.showUnpaidOrders : "";
				var isTenderedParam = filterOnTendered ? "isTendered=" + vm.showPaidOrders : "";
				// TODO: remove '?' and '&' if we don't need them
				orderRetrievalPromise = $http.get(baseUrl + "orders?" + hasOrderNumberParam + "&" + isTenderedParam);
				orderRetrievalPromise.then(function (response) {
					orderRetrievalPromise = null;
					if (!retrieveAfterPromiseCompletes) {
						vm.allOrders = response.data;
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

		function ordersExist() {
			return vm.allOrders.length > 0;
		}

		function toggleShowAll() {
			var newState = !vm.areAllShown();
			vm.showInProgressOrders = newState;
			vm.showUnpaidOrders = newState;
			vm.showPaidOrders = newState;
		}

		function areAllShown() {
			return vm.showInProgressOrders && vm.showUnpaidOrders && vm.showPaidOrders;
		}

		function determineOrderStatus(order) {
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
		}

		function hasOrderNumber(order) {
			return order.orderNumber && isFinite(order.orderNumber);
		}
	}
})();
