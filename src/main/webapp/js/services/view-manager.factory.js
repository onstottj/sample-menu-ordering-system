(function () {
	'use strict';
	angular.module('posApp')
		.factory('viewManager', viewManager);

	/**
	 * viewManager service
	 */
	viewManager.$inject = [];
	function viewManager() {
		var service = {
			isShowingList: false
		};
		return service;
	}

})();
