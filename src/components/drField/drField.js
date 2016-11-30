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
		constructor(drFieldService){
			this.drFieldService = drFieldService;

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

			if(!this.activeCell) this.activeCell = cell;

			let state, currentState;

			if(cell.state === 'passive'){
				let coords_1 = {col: this.activeCell.col, row: this.activeCell.row};
				let coords_2 = {col: cell.col, row: cell.row};

				this.activeCell.col = coords_2.col;
				this.activeCell.row = coords_2.row;

				cell.col = coords_1.col;
				cell.row = coords_1.row;
				return;
			}

			if(this.activeCell == this.cells[idx]){
				// Клик по той же ячейке, меняем состояние на противоположное
				this.activeCell.state = (this.activeCell.state === 'active') ? 'default' : 'active';
				currentState = (this.activeCell.state === 'active');
			} else {
				// Клик по другой ячейке
				for(let i=0; i<this.cells.length; i+=1) this.cells[i].state = 'default';
				cell.state = 'active';
				currentState = (cell.state === 'active');
			}

			state = currentState ? 'passive' : 'default';
			this.drFieldService.markClosestCell(this.cells, this.size, idx, state);
			this.activeCell = cell;
		}
	}

	drFieldCtrl.$inject = ['drFieldService'];
})();