/**
 * @author Jon Onstott
 * @since 11/1/2015
 */
posModule.service('orderStatus', function ($http, orderPersistence) {
    // This is set once the order has been created in the backend
    var orderId;
    var orderNumber;
    // A dictionary of the items in the order; see http://stackoverflow.com/questions/11985863/how-to-use-ng-repeat-for-dictionaries-in-angularjs
    var itemsInOrder = {};
    var salesTaxRate;
    // When payment is processed, this becomes a JSON object with amountTendered and changeDue
    var paymentResults = {};

    // TODO: there could be a better way of loading this value from the server
    $http.get(baseUrl + "settings/salesTaxRate").then(function (response) {
        salesTaxRate = response.data;
    });

    function getSubtotal() {
        var subtotal = 0;
        angular.forEach(itemsInOrder, function (entry) {
            subtotal += entry.quantity * entry.item.price;
        });
        return subtotal;
    }

    function getSalesTax() {
        return getSubtotal() * salesTaxRate;
    }

    return {
        getOrderId: function () {
            return orderId;
        },
        getOrderNumber: function () {
            return orderNumber;
        },
        setOrderNumber: function (newOrderNumber) {
            orderNumber = newOrderNumber;
        },
        itemsInOrder: itemsInOrder,
        addItem: function (item) {
            var itemName = item.name;

            var existingItem = itemsInOrder[itemName];

            var newItem = existingItem || {item: item, quantity: 0};
            newItem.quantity++;

            itemsInOrder[itemName] = newItem;

            // Update the backend
            if (!orderId) {
                orderPersistence.createOrder(item).then(function (id) {
                    orderId = id;
                });
            } else {
                orderPersistence.addItemToOrder(orderId, item.id);
            }
        },
        removeItem: function (item) {
            delete itemsInOrder[item.name];
            orderPersistence.removeItemFromOrder(orderId, item.id);
        },
        getSubtotal: getSubtotal,
        getSalesTax: getSalesTax,
        getGrandTotal: function () {
            return getSubtotal() + getSalesTax();
        },
        paymentResults: paymentResults
    };
});
