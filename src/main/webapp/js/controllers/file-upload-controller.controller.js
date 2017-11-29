(function () {
	'use strict';
	angular.module('posApp')
		.controller('FileUploadController', FileUploadController);

	/**
	 * FileUploadController controller
	 *
	 * Angular file upload code adapted from http://jsfiddle.net/danialfarid/0mz6ff9o/135/
	 */
	FileUploadController.$inject = ['$scope', 'Upload', '$timeout'];
	function FileUploadController($scope, Upload, $timeout) {
		var vm = this;

		vm.uploadFiles = uploadFiles;

		function uploadFiles(file, errFiles) {
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
						// TODO: it'd be better to make an items service that holds all items, and we'd be able to trigger a refresh of item data instead
						location.reload();
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
	}
})();
