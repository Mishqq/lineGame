(function(){
	angular.module('app').directive('drDashboard', ['$templateCache', function($templateCache){
		function drDashboardLink($scope, $element, $attrs, $timeout){}

		return {
			link: drDashboardLink,
			restrict: 'AEC',
			scope: {},
			template: $templateCache.get('drDashboard/drDashboard.html'),
			controller: drDashboardCtrl,
			controllerAs: 'db',
			bindToController: {}
		};
	}]);

	class drDashboardCtrl{
		constructor($scope, $timeout, drFieldService){
			this.points = drFieldService.points;
		}
	}

	drDashboardCtrl.$inject = ['$scope', '$timeout', 'drFieldService'];
})();