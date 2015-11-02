/**
 * @author Jon Onstott
 * @since 11/1/2015
 */

// In a real app, we wouldn't have globals hanging around like this
var baseUrl = "http://localhost:8080/api/";
// This sales tax is about 6%
var salesTaxRate = 0.059446733372;

angular.module('posApp', ['ngFileUpload'])
    .controller('OrderEntryController', function ($scope, $http) {
        $scope.allItems = [];
        // A dictionary of the items in the order; see http://stackoverflow.com/questions/11985863/how-to-use-ng-repeat-for-dictionaries-in-angularjs
        $scope.itemsInOrder = {};
        $scope.selectedItem = null;

        $scope.addItem = function (item) {
            var itemName = item.name;

            var existingItem = $scope.itemsInOrder[itemName];

            var newItem = existingItem || {item: item, quantity: 0};
            newItem.quantity++;

            $scope.itemsInOrder[itemName] = newItem;
        };

        $scope.selectItem = function (item) {
            $scope.selectedItem = item;
        };

        $scope.getSubtotal = function () {
            var subtotal = 0;
            angular.forEach($scope.itemsInOrder, function (entry) {
                subtotal += entry.quantity * entry.item.price;
            });
            return subtotal;
        };

        $scope.getSalesTax = function () {
            return $scope.getSubtotal() * salesTaxRate;
        };

        $scope.getGrandTotal = function () {
            return $scope.getSubtotal() + $scope.getSalesTax();
        };

        $scope.voidSelectedItem = function () {
            var item = $scope.selectedItem;
            delete $scope.itemsInOrder[item.name];
            $scope.selectedItem = null;
        };

        // Load the list of menu items
        $http.get(baseUrl + 'items').success(function (data) {
            $scope.allItems = data;
        });
    })
    .controller('FileUploadController', ['$scope', 'Upload', '$timeout', function ($scope, Upload, $timeout) {
        // Angular file upload code adapted from http://jsfiddle.net/danialfarid/0mz6ff9o/135/
        $scope.uploadFiles = function (file, errFiles) {
            $scope.f = file;
            $scope.errFile = errFiles && errFiles[0];
            if (file) {
                file.upload = Upload.upload({
                    url: baseUrl + 'items/upload',
                    data: {file: file}
                });

                file.upload.then(function (response) {
                    $timeout(function () {
                        file.result = response.data;
                        $scope.uploadMessage = 'Items imported successfully';
                    });
                }, function (response) {
                    // There was an error
                    if (response.status > 0)
                        $scope.uploadMessage = 'HTTP ' + response.status + ': ' + response.data;
                }, function (evt) {
                    file.progress = Math.min(100, parseInt(100.0 *
                        evt.loaded / evt.total));
                });
            }
        }
    }]);