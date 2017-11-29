(function () {
	'use strict';
	angular.module('posApp')
		.factory('orderPersistence', orderPersistence);

	/**
	 * orderPersistence service
	 *
	 * A service for CRUD operations on Orders using REST
	 */
	orderPersistence.$inject = ['$http', '$q'];

	function orderPersistence($http, $q) {
		var service = {
			addItemToOrder: addItemToOrder,
			assignOrderNumber: assignOrderNumber,
			createOrder: createOrder,
			recordPayment: recordPayment,
			removeItemFromOrder: removeItemFromOrder
		};
		return service;

		function addItemToOrder(orderId, itemId) {
			$http.post(baseUrl + "orders/" + orderId + "/items?itemId=" + itemId);
		}

		function createOrder(initialItem) {
			return $q(function (resolve, reject) {
				var newOrder = {id: null, orderNumber: null};
				$http.post(baseUrl + "orders", newOrder)
					.then(function (response) {
						var orderId = response.data;
						addItemToOrder(orderId, initialItem.id);
						resolve(orderId);
					}, function () {
						reject("The new order's ID couldn't be retrieved");
					});
			});
		}

		function removeItemFromOrder(orderId, itemId) {
			$http.delete(baseUrl + "orders/" + orderId + "/items/" + itemId);
		}

		function assignOrderNumber(orderId) {
			return $http.get(baseUrl + "orders/" + orderId + "/assignOrderNumber");
		}

		function recordPayment(orderId, amountTendered, changeDue) {
			var tenderRecord = {
				orderId: orderId,
				amountTendered: amountTendered,
				changeDue: changeDue
			};
			$http.post(baseUrl + "orders/" + orderId + "/tender", tenderRecord);
		}
	}
})();
