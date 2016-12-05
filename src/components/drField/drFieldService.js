(function(){
	angular.module('app').service('drFieldService', ['drFiledFactory', '$timeout', function(drFiledFactory, $timeout){
		/**
		 * =================================================================== private methods ===========================================================
		 */
		let _self = this;
		this.matrixModel = [];
		let _mm = this.matrixModel;

		/**
		 * Возвращаем рандомный элемент массива
		 */
		function returnRandElement(arr){
			let idx = Math.floor(Math.random() * arr.length);
			return arr[idx];
		}

		/**
		 * Возвращаем рандомный элемент массива, исключая переданный в функцию
		 */
		function returnAnotherType(repeatTypes){
			let newArr = angular.copy(drFiledFactory.types);

			for(let i=0; i<repeatTypes.length; i+=1){
				for(let j=0; j<newArr.length; j+=1){
					if(repeatTypes[i] === newArr[j]) newArr.splice(j, 1);
				}
			}

			return returnRandElement(newArr);
		}

		/**
		 * Функция проставляет элементым массива координаты (поля "col", "row") в зависимости от
		 * второго параметра size (ширина массива)
		 */
		function setCoordsToElements(){
			for(let i=0; i<_mm.length; i+=1){
				_mm[i].col = i%_self.size;
				_mm[i].row = Math.floor(i/_self.size);
			}
		}

		/**
		 * Функция принимает массив, в который добавляет новый элемент.
		 * При добавлении выполняет две проверки:
		 * - если типы двух предыдущих объект равны текущему сгенерированному типу, то генерируем новый
		 * - если типы двух объектов над текузим равны текущему сгенерированному типу, то генерируем новый
		 */
		function createElement(idx){
			let type = returnRandElement(drFiledFactory.types);

			let repeatTypes = [];

			// Проверки на горизонтальные и вертикальные совпадения при генерации
			checkHRep(repeatTypes);
			checkVRep(repeatTypes);

			if(repeatTypes.length) type = returnAnotherType(repeatTypes);

			_mm.push({
				id: idx,
				type: type,
				state: 'default'
			})
		}

		/**
		 * Проверка на горизонтальное повторение
		 */
		function checkHRep(repeatTypes){
			let s = _self.size;
			let colIdx = _mm.length % s;
			if(colIdx > 1){
				if(_mm[_mm.length - 2].type === _mm[_mm.length - 1].type){
					repeatTypes.push(_mm[_mm.length - 1].type)
				}
			}
		}

		/**
		 * Проверка на вертикальное повторение
		 */
		function checkVRep(repeatTypes){
			let s = _self.size;
			let rowIdx = Math.floor(_mm.length/s);
			if(rowIdx > 1){
				if(_mm[_mm.length - s].type === _mm[_mm.length - s*2].type){
					repeatTypes.push(_mm[_mm.length - s].type)
				}
			}
		}

		/**
		 * Функция проверяет на горизонтальные совпадения
		 */
		function countRepeatInRow(result){
			let size = _self.size;

			for(let i=0; i<_mm.length; i+=size){
				let delIdxArr=[i], currentType = _mm[i].type;

				next: for(let j=1; j<size; j+=1){
					if(_mm[i+j].type === 'empty' || currentType !== _mm[i+j].type){
						if(delIdxArr.length > 2) break;
						delIdxArr.length = 0;
						delIdxArr.push(i+j);
						currentType = _mm[i+j].type;
						continue next;
					} else {
						delIdxArr.push(i+j);
					}
				}
				if(delIdxArr.length > 2){
					result.push({
						length: delIdxArr.length,
						type: currentType,
						idxArr: angular.copy(delIdxArr)
					});
				}
				delIdxArr.length = 0;
			}
		}

		/**
		 * Функция проверяет на вертикальные совпадения
		 */
		function countRepeatInCol(result){
			let size = _self.size;

			for(let i=0; i<size; i+=1) {
				let delIdxArr = [i], currentType = _mm[i].type;

				next: for (let j = 1; j < size; j += 1) {
					if (_mm[i + j * size].type === 'empty' || currentType !== _mm[i + j * size].type) {
						if (delIdxArr.length > 2) break;
						delIdxArr.length = 0;
						delIdxArr.push(i + j * size);
						currentType = _mm[i + j * size].type;
						continue next;
					} else {
						delIdxArr.push(i + j * size);
					}
				}
				if (delIdxArr.length > 2) {
					result.push({
						length: delIdxArr.length,
						type: currentType,
						idxArr: angular.copy(delIdxArr)
					});
				}
				delIdxArr.length = 0;
			}
		}

		/**
		 * =================================================================== public methods ===========================================================
		 */

		/**
		 * Метод сервиса возвращает новый массив длиной size*size
		 */
		this.createNewArr = function (size) {
			_mm.length = 0;
			this.size = size || drFiledFactory.size;

			for(let i=0; i<size*size; i++)
				createElement(i);

			setCoordsToElements();

			return _mm;
		};

		/**
		 * Задаем состояние ближайшим элементам от выделенного
		 */
		this.markClosestCell = function(idx, state){
			let size = _self.size;

			if(_mm[idx-size]) _mm[idx-size].state = state;
			if(_mm[idx+size]) _mm[idx+size].state = state;
			if(_mm[idx-1]) _mm[idx-1].state = state;
			if(_mm[idx+1]) _mm[idx+1].state = state;
		};

		/**
		 * Меняем местами ячейки. Алгоритм:
		 * - сначала меняем параментры col/row (для анимаци).
		 * - после по таймауту меняем данные объектов в самом массиве (фигуру)
		 */
		this.replaceElements = function(idx1, idx2){
			let temp = {
				col1: _mm[idx1].col,
				row1: _mm[idx1].row,
				col2: _mm[idx2].col,
				row2: _mm[idx2].row
			};

			_mm[idx1].col = temp.col2;
			_mm[idx1].row = temp.row2;

			_mm[idx2].col = temp.col1;
			_mm[idx2].row = temp.row1;

			_mm.sort(sortArrByRowCol);

			recurDeleteEl();


		};

		function recurDeleteEl(){

		}

		/**
		 * Проверяем на объекты одинакового типа в строках
		 */
		function recurDeleteEl(){
			let result = [];

			countRepeatInRow(result);
			countRepeatInCol(result);

			if(!result.length) return false;

			_self.deleteElements(result);

			_self.moveTopEl();

			_mm.sort(sortArrByRowCol);

			recurDeleteEl();
		}

		/**
		 * Удаляем объекты одинакового типа, если их больше трёх в строке или в колонке
		 */
		this.deleteElements = function(delArr){
			for(let i=0; i<delArr.length; i+=1){
				let line = delArr[i];

				// удаляемым ячейкам присваиваем тип "empty"
				for(let j=0; j<line.idxArr.length; j+=1)
					_mm[ line.idxArr[j] ].type = 'empty';

				// Устанавливаем им статус "default"
				for(let j=0; j<_mm.length; j+=1)
					_mm[j].state = 'default';
			}
		};

		/**
		 * Если над пустыми местами остались фигуры - опускаем их
		 */
		this.moveTopEl = function(){
			// Массив, который хранит индексы с пустыми элементами
			let size = drFiledFactory.size;

			next: for(let count=0,i=0,emptyCount=0, emptyStartIdx; i<_mm.length; i+=1){
				if(i > 0 && i%size === 0) {
					emptyStartIdx = undefined;
					emptyCount = 0;
					count++;
				}

				let rowIdx = (i%size)*size + count;

				if(_mm[rowIdx].type === 'empty') {
					if(!emptyStartIdx) emptyStartIdx = rowIdx;
					emptyCount++;
				}

				// Проверка на последний элемент в столбце
				if( i > 0 && (i+1)%size === 0 && emptyCount > 0 ){
					moveElements(emptyStartIdx, emptyCount)
				}
			}
		};

		function moveElements(emptyStartIdx, emptyCount){
			let size = drFiledFactory.size;
			// console.log('Работаем со столбцом ', count);
			let countOfMovableEl = Math.floor(emptyStartIdx/size);
			// console.log('Передвигаем ', countOfMovableEl, ' елементов в стоблце ', count);

			for(let i=0, c=emptyStartIdx; i<emptyCount; i+=1){
				_mm[c].row -= countOfMovableEl;
				c +=size;
			}
			for(let i=0, c=emptyStartIdx; i<countOfMovableEl; i+=1){
				c -= size;
				_mm[c].row += emptyCount;
			}

			// console.log('Генерируем ', emptyCount, ' новых элементов в стоблце ', count);
		}

		/**
		 * Сортировка массива по значения obj.row и obj.col элементов. Используется после перестановок и удалений
		 * (для синхронизации вьюхи и модели, т.к. на вьюхе при перемещении мы не меняли модель)
		 */
		function sortArrByRowCol(a, b){
			if(a.row !== b.row) {
				return a.row - b.row
			} else if(a.row === b.row){
				return a.col - b.col
			}
		}
	}]);
})();