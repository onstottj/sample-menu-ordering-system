/**
 * @author Jon Onstott
 * @since 11/1/2015
 */

angular.module('posApp', ['ngFileUpload'])
    .controller('FileUploadController', ['$scope', 'Upload', '$timeout', function ($scope, Upload, $timeout) {
        // Adapted from http://jsfiddle.net/danialfarid/0mz6ff9o/135/
        $scope.uploadFiles = function (file, errFiles) {
            $scope.f = file;
            $scope.errFile = errFiles && errFiles[0];
            if (file) {
                file.upload = Upload.upload({
                    url: 'http://localhost:8080/api/items/upload',
                    data: {file: file}
                });

                file.upload.then(function (response) {
                    $timeout(function () {
                        file.result = response.data;
                    });
                }, function (response) {
                    if (response.status > 0)
                        $scope.errorMsg = response.status + ': ' + response.data;
                }, function (evt) {
                    file.progress = Math.min(100, parseInt(100.0 *
                        evt.loaded / evt.total));
                });
            }
        }
    }]);