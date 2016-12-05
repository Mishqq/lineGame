(function(){
	angular.module('app').directive('drField', ['$templateCache', function($templateCache){
		function drFieldLink($scope, $element, $attrs, $timeout){}

		return {
			link: drFieldLink,
			restrict: 'AEC',
			scope: {},
			template: $templateCache.get('drField/drField.html'),
			controller: drFieldCtrl,
			controllerAs: 'cf',
			bindToController: {
				cellClick: '=?',
				size: '=?',
				ctx: '=?'
			}
		};
	}]);

	class drFieldCtrl{
		constructor(drFieldService, drFiledFactory, $scope, $timeout){
			this.drFieldService = drFieldService;
			this.drFiledFactory = drFiledFactory;
			if(this.size) this.drFiledFactory.size = this.size;
			this.$scope = $scope;
			this.$timeout = $timeout;

			this.init();
		}

		/**
		 * При инциализации создаем массив
		 */
		init(){
			this.cells = this.drFieldService.createNewArr(this.size);
		}

		/**
		 * Клик по ячейке
		 * == событие, ячейка, индекс в массиве ==
		 */
		cellCLick(e, cell, idx){
			e.preventDefault();
			e.stopPropagation();

			if(cell.state === 'default'){
				// Клик по ячейке с дефолтным статусом. Делаем её активной и выделяем пассивом ближайшие ячейки
				for(let i=0; i<this.cells.length; i+=1) this.cells[i].state = 'default';
				this.activeCell = cell;
				this.activeCell.state = 'active';
				this.activeCellIdx = idx;
				this.drFieldService.markClosestCell(idx, 'passive');
			} else if(cell.state === 'passive'){
				// Клик по ячейке с пассивным статусом
				this.drFieldService.replaceElements(this.activeCellIdx, idx);
				this.$timeout(()=>{
					// this.drFieldService
					// TODO: по таймауту реализовать слудеющее поведение: перещенный активный элемент остаётся активным на новом месте
					// TODO: выделить новые пассивные элементы
				}, 200);
			} else if(cell.state === 'active'){
				// Клик по ячейке с активным статусом. Снимаем активность с неё и ближайших
				cell.state = 'default';
				this.activeCell = undefined;
				this.activeCellIdx = undefined;
				this.drFieldService.markClosestCell(idx, 'default');
			}
		}
	}

	drFieldCtrl.$inject = ['drFieldService', 'drFiledFactory', '$scope', '$timeout'];
})();