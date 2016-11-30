(function(){
	angular.module('app').directive('drCell', ['$templateCache', function($templateCache){
		function drCellLink($scope, $element, $attrs, $timeout){}

		return {
			link: drCellLink,
			restrict: 'AEC',
			scope: {},
			template: $templateCache.get('drCell/drCell.html'),
			controller: drCellCtrl,
			controllerAs: 'c',
			bindToController: {
				type: '@?',
				state: '@?',
			}
		};
	}]);

	class drCellCtrl{
		constructor($scope, $timeout){}


		/**
		 * Используем на вьюхе, возвращает css-классы для типа и состояния ячейки
		 */
		returnCellClass(){
			let type = 'cell_type-' + (this.type || 'square');
			let state = 'cell_state-' + (this.state || 'default');

			return [type, state];
		}
	}

	drCellCtrl.$inject = ['$scope', '$timeout'];
})();