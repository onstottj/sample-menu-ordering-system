/**
 * A service for CRUD operations on Orders using REST
 * @author Jon Onstott
 * @since 11/3/2015
 */
posModule.service('orderPersistence', function ($http, $q) {
    function addItemToOrder(orderId, itemId) {
        $http.post(baseUrl + "orders/" + orderId + "/items?itemId=" + itemId);
    }

    return {
        /**
         * @returns a promise that is resolved with the new order's ID
         */
        createOrder: function (initialItem) {
            return $q(function (resolve, reject) {
                var newOrder = {id: null, orderNumber: null, items: []};
                $http.post(baseUrl + "orders", newOrder)
                    .then(function (response) {
                        var orderId = response.data;
                        addItemToOrder(orderId, initialItem.id);
                        resolve(orderId);
                    }, function () {
                        reject("The new order's ID couldn't be retrieved");
                    });
            });
        },
        addItemToOrder: addItemToOrder,
        removeItemFromOrder: function (orderId, itemId) {
            $http.delete(baseUrl + "orders/" + orderId + "/items/" + itemId);
        },
        assignOrderNumber: function (orderId) {
            return $http.get(baseUrl + "orders/" + orderId + "/assignOrderNumber");
        },
        recordPayment: function (orderId, amountTendered, changeDue) {
            var tenderRecord = {
                orderId: orderId,
                amountTendered: amountTendered,
                changeDue: changeDue
            };
            $http.post(baseUrl + "orders/" + orderId + "/tender", tenderRecord);
        }
    };
});