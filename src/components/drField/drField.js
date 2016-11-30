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
		constructor(drFieldService, $scope, $timeout){
			this.drFieldService = drFieldService;
			if(this.size) this.drFieldService.size = this.size;
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
				this.drFieldService.markClosestCell(this.cells, this.size, idx, 'passive');
			} else if(cell.state === 'passive'){
				// Клик по ячейке с пассивным статусом
				this.drFieldService.replaceElements(this.cells, this.activeCellIdx, idx);
				this.$timeout(()=>{
					for(let i=0; i<this.cells.length; i+=1) this.cells[i].state = 'default';
					// this.activeCell = cell;
					// this.activeCell.state = 'active';
					// this.activeCellIdx = idx;
					// this.drFieldService.markClosestCell(this.cells, this.size, idx, 'passive');
				}, 200);
			} else if(cell.state === 'active'){
				// Клик по ячейке с активным статусом. Снимаем активность с неё и ближайших
				cell.state = 'default';
				this.activeCell = undefined;
				this.activeCellIdx = undefined;
				this.drFieldService.markClosestCell(this.cells, this.size, idx, 'default');
			}
		}
	}

	drFieldCtrl.$inject = ['drFieldService', '$scope', '$timeout'];
})();