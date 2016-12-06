(function(){
	angular.module('app').directive('drMenu', ['$templateCache', function($templateCache){
		function drMenuLink($scope, $element, $attrs, $timeout){}

		return {
			link: drMenuLink,
			restrict: 'AEC',
			scope: {},
			template: $templateCache.get('drMenu/drMenu.html'),
			controller: drMenuCtrl,
			controllerAs: 'm',
			bindToController: {}
		};
	}]);

	class drMenuCtrl{
		constructor($scope, $timeout, drFiledFactory, drFieldService){
			this.drFiledFactory = drFiledFactory;
			this.drFieldService = drFieldService;
		}

		newGame(e, size){
			e.preventDefault();
			e.stopPropagation();
			this.drFiledFactory.size = size;
			this.drFieldService.createNewArr(size);
			this.drFieldService.reset();
		}
	}

	drMenuCtrl.$inject = ['$scope', '$timeout', 'drFiledFactory', 'drFieldService'];
})();