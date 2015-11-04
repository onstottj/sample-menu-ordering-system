/**
 * Angular file upload code adapted from http://jsfiddle.net/danialfarid/0mz6ff9o/135/
 *
 * @author Jon Onstott
 * @since 11/3/2015
 */
posModule.controller('FileUploadController', ['$scope', 'Upload', '$timeout', function ($scope, Upload, $timeout) {
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