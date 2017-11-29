(function () {
	'use strict';
	angular.module('posApp')
		.factory('orderStatus', orderStatus);

	/**
	 * orderStatus service
	 */
	orderStatus.$inject = ['$http', 'orderPersistence'];

	function orderStatus($http, orderPersistence) {
		// This is set once the order has been created in the backend
		var orderId;
		var orderNumber;
		var salesTaxRate;

		var service = {
			addItem: addItem,
			editOrder: editOrder,
			getGrandTotal: getGrandTotal,
			getOrderId: getOrderId,
			getOrderNumber: getOrderNumber,
			getSalesTax: getSalesTax,
			getSubtotal: getSubtotal,
			hasOrderNumber: hasOrderNumber,
			/** A dictionary of the items in the order; see http://stackoverflow.com/questions/11985863/how-to-use-ng-repeat-for-dictionaries-in-angularjs */
			itemsInOrder: {},
			removeItem: removeItem,
			/** When payment is processed, this becomes a JSON object with amountTendered and changeDue */
			paymentResults: {},
			setOrderNumber: setOrderNumber,
			startNewOrder: startNewOrder
		};
		activate();
		return service;

		function activate() {
			$http.get(baseUrl + "settings/salesTaxRate").then(function (response) {
				salesTaxRate = response.data;
			});
		}

		function startNewOrder() {
			orderId = null;
			orderNumber = null;
			clearItems();
			clearPaymentDetails();
		}

		function editOrder(order) {
			orderId = order.id;
			orderNumber = order.orderNumber;

			clearItems();
			angular.forEach(order.lineItems, function (lineItem) {
				var itemName = lineItem.item.name;
				service.itemsInOrder[itemName] = {
					item: lineItem.item,
					quantity: lineItem.quantity
				};
			});

			if (order.tender) {
				// Copy over the amountTendered and changeDue values
				angular.extend(service.paymentResults, order.tender);
			} else {
				clearPaymentDetails();
			}
		}

		function getOrderId() {
			return orderId;
		}

		function hasOrderNumber() {
			return orderNumber && isFinite(orderNumber);
		}

		function getOrderNumber() {
			return orderNumber;
		}

		function setOrderNumber(newOrderNumber) {
			orderNumber = newOrderNumber;
		}

		function addItem(item) {
			var itemName = item.name;

			var existingItem = service.itemsInOrder[itemName];

			var newItem = existingItem || {item: item, quantity: 0};
			newItem.quantity++;

			service.itemsInOrder[itemName] = newItem;

			// Update the backend
			if (!orderId) {
				orderPersistence.createOrder(item).then(function (id) {
					orderId = id;
				});
			} else {
				orderPersistence.addItemToOrder(orderId, item.id);
			}
		}

		function removeItem(item) {
			delete service.itemsInOrder[item.name];
			orderPersistence.removeItemFromOrder(orderId, item.id);
		}

		function clearItems() {
			angular.forEach(service.itemsInOrder, function (entry, key) {
				delete service.itemsInOrder[key];
			});
		}

		function clearPaymentDetails() {
			delete service.paymentResults.amountTendered;
			delete service.paymentResults.changeDue;
		}

		function getSubtotal() {
			var subtotal = 0;
			angular.forEach(service.itemsInOrder, function (entry) {
				subtotal += entry.quantity * entry.item.price;
			});
			return subtotal;
		}

		function getSalesTax() {
			return getSubtotal() * salesTaxRate;
		}

		function getGrandTotal() {
			return getSubtotal() + getSalesTax();
		}
	}
})();
