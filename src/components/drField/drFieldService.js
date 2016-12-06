(function(){
	angular.module('app').service('drFieldService', ['drFiledFactory', '$timeout', function(drFiledFactory, $timeout){
		/**
		 * =================================================================== private methods ===========================================================
		 */
		let _self = this;
		this.matrixModel = [];
		let _mm = this.matrixModel;
		this.points = {
			lastDel: [],
			lastPoints: 0,
			allPoints: 0,
		};

		this.reset = function(){
			this.points.lastDel.length = 0;
			this.points.lastPoints = 0;
			this.points.allPoints = 0;
		};

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
		function returnTypeForNewElement(idx){
			// Проверки на горизонтальные и вертикальные совпадения при генерации
			let repeatTypes = checkDupe(idx);

			let type = (repeatTypes.length) ?
				returnAnotherType(repeatTypes) :
				returnRandElement(drFiledFactory.types);

			return type || 'square';
		}

		/**
		 * Проверка на повторение
		 */
		function checkDupe(idx){
			let s = _self.size;
			let result = [];

			let colIdx = _mm.length % s;
			if(colIdx > 1){
				if(_mm[_mm.length - 2].type === _mm[_mm.length - 1].type){
					result.push(_mm[_mm.length - 1].type)
				}
			}

			let rowIdx = Math.floor(_mm.length/s);
			if(rowIdx > 1){
				if(_mm[_mm.length - s].type === _mm[_mm.length - s*2].type){
					result.push(_mm[_mm.length - s].type)
				}
			}

			// Если минимум третий элемент в строке
			if((idx - Math.floor(idx/s)*s) > 1){
				//Если предыдущие два элемента в строке существуют и их типы совпадают, то исключаем тип
				if(_mm[idx-1] && _mm[idx-2] && _mm[idx-1].type === _mm[idx-2].type) result.push(_mm[idx-1].type)
			}
			// Если за ним есть минимум два элемента в строке
			if((Math.ceil(idx/s)*s - idx) > 1){
				//Если следующие два элемента в строке существуют и их типы совпадают, то исключаем тип
				if(_mm[idx+1] && _mm[idx+2] && _mm[idx+1].type === _mm[idx+2].type) result.push(_mm[idx+1].type)
			}
			// Если сверху над ним есть минимум два элемента в столбце
			if(Math.ceil(idx/s) > 2){
				//Если два элемента сверху в столбце существуют и их типы совпадают, то исключаем тип
				if(_mm[idx-s] && _mm[idx-s*2] && _mm[idx-s].type === _mm[idx-s*2].type) result.push(_mm[idx-s].type)
			}
			// Если снизу под ним есть минимум два элемента в столбце
			if((s - Math.ceil(idx/s)) > 2){
				//Если два элемента снизу в столбце существуют и их типы совпадают, то исключаем тип
				if(_mm[idx+s] && _mm[idx+s*2] && _mm[idx+s].type === _mm[idx+s*2].type) result.push(_mm[idx+s].type)
			}
			// Если минимум второй и минимум предпоследний элемент
			if((idx - Math.floor(idx/s)*s) > 0 && (Math.ceil(idx/s)*s - idx) > 0){
				// Если типы элементов перед ним и за ним совпадают
				if(_mm[idx-1] && _mm[idx+1] && _mm[idx-1].type === _mm[idx+1].type) result.push(_mm[idx-1].type)
			}
			// Если над ним и под ним есть элементы
			if(Math.ceil(idx/s) > 1 && (s - Math.ceil(idx/s)) > 1){
				// Если типы элементов под ним и над ним совпадают
				if(_mm[idx-s] && _mm[idx+s] && _mm[idx-s].type === _mm[idx+s].type) result.push(_mm[idx-s].type)
			}

			return result;
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
		 *  Меняем местами два элемента массива по их индексам
		 */
		function shiftToEl(idx1, idx2){
			let temp = {
				col1: _mm[idx1].col,
				row1: _mm[idx1].row,
				col2: _mm[idx2].col,
				row2: _mm[idx2].row
			};

			_mm[idx1].col = temp.col2;
			_mm[idx1].row = temp.row2;

			$timeout(()=>{
				_mm[idx2].col = temp.col1;
				_mm[idx2].row = temp.row1;
			}, 200);
		}

		/**
		 * Генерируем новые элементы
		 */
		function generateNewEl(){
			for(let i=0; i<_mm.length; i+=1){
				if(_mm[i].type === 'empty'){
					_mm[i].type = returnTypeForNewElement(i);
					_mm[i].state = 'new';
					$timeout(()=>{
						_mm[i].state = 'default'
					}, 500)
				}
			}
		}

		/**
		 * Рекурсивное удаление строк и столбцов одинаковых элементов
		 */
		function recurDeleteEl(){
			let result = [];

			countRepeatInRow(result);
			countRepeatInCol(result);

			if(result && result.length > 1) checkCrossingLines(result);

			for (let j = 0; j < _mm.length; j += 1)
				_mm[j].state = 'default';

			if(!result.length) {
				let marker = false;
				for(let i=0; i<_mm.length; i+=1){
					if(_mm[i].type === 'empty'){
						marker = true;
						break;
					}
				}
				if(marker){
					$timeout(()=>{
						generateNewEl();
						$timeout(()=>{
							_mm.sort(sortArrByRowCol);

							recurDeleteEl();
						}, 500);
					}, 500);
				}
				return false;
			}

			$timeout(()=>{
				markDeleteEl(result);

				calculatePointsInfo(result);

				$timeout(()=>{
					deleteElements(result);

					moveTopEl();

					_mm.sort(sortArrByRowCol);

					recurDeleteEl();
				}, 500);
			}, 250);
		}

		/**
		 * Задаем статус удаляемым элементам
		 */
		function markDeleteEl(result){
			for (let i = 0; i < result.length; i += 1) {
				let obj = result[i];
				for (let j = 0; j < obj.idxArr.length; j += 1) {
					_mm[obj.idxArr[j]].state = 'delete';
				}
			}
		}

		/**
		 * Рассчет очков за ход
		 */
		function calculatePointsInfo(result){
			_self.points.lastDel.length = 0;
			for(let i=0; i<result.length; i+=1){
				let type = result[i].type;
				let points = drFiledFactory.pointsMap[type] * result[i].length;
				_self.points.lastPoints = points;
				_self.points.allPoints += points;
				_self.points.lastDel.push(result[i].length + ' ' + type);
			}
		}

		/**
		 * Если над пустыми местами остались фигуры - опускаем их
		 * Алгоритм:
		 * - берём столбец и перебираем его снизу
		 * - если попадаем на пустой элемент, задаём ему позицию .row = shiftCount и увеличиваем счетчик shiftCount
		 * т.е. если первый пустой элемент - он займет первую строку в стоблце, если второй - вторую и т.д.
		 * - если попадается не пустой элемент - перемещаем его вниз на shiftCount
		 */
		function moveTopEl(){
			let size = _self.size;

			for(let i=0, shiftCount=0; i<size; i+=1) {
				next: for (let j = size-1; j >= 0; j -= 1) {
					if (_mm[i + j * size].type === 'empty') {
						_mm[i + j * size].toRow = shiftCount;
						_mm[i + j * size].row = shiftCount;
						shiftCount++;
						continue next;
					}
					if(shiftCount>0) _mm[i + j * size].row += +shiftCount;
				}
				shiftCount = 0;
			}
		}

		/**
		 * Удаляем объекты одинакового типа, если их больше трёх в строке или в колонке
		 */
		function deleteElements(delArr){
			for(let i=0; i<delArr.length; i+=1){
				let line = delArr[i];

				// удаляемым ячейкам присваиваем тип "empty"
				for(let j=0; j<line.idxArr.length; j+=1)
					_mm[ line.idxArr[j] ].type = 'empty';

				// Устанавливаем им статус "default"
				for(let j=0; j<_mm.length; j+=1)
					_mm[j].state = 'default';
			}
		}

		/**
		 * Проверка на пересекающиеся строки/столбцы. Приоритет
		 * - строка/столбец с большей длинной
		 * - горизонтальная строка (при раверстве длины пересекающихся строки и столбца)
		 */
		function checkCrossingLines(result){
			next: for (let i=0; i<result.length; i+=1) {
				let line = result[i], length = line.length;

				for(let j=0; j<line.idxArr.length; j+=1){
					let idx = line.idxArr[j];

					if(i < result.length-1){
						for (let k=i+1; k<result.length; k+=1) {
							let line2 = result[k], length2 = line2.length;

							if(!~line2.idxArr.indexOf(idx)){
								if(length > length2){
									result.splice(k, 1);
								} else if(length < length2){
									result.splice(i, 1);
									i--;
									continue next;
								} else if(length === length2){
									result.splice(k, 1);
								}
							}
						}
					}
				}
			}
		}

		function getIndexByRowCol(row, col){
			return row*_self.size + col;
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

			for(let i=0; i<size*size; i++){
				let type = returnTypeForNewElement();
				_mm.push({
					id: i,
					type: type,
					state: 'default'
				})
			}

			setCoordsToElements();

			return _mm;
		};

		/**
		 * Задаем состояние ближайшим элементам от выделенного
		 */
		this.setActiveCell = function(idx, state){
			for(let i=0; i<_mm.length; i+=1) _mm[i].state = 'default';

			_mm[idx].state = state ? 'active' : 'default';

			let row = Math.floor(idx/_self.size);
			let col = idx - Math.floor(idx/_self.size)*_self.size;

			let cState = (state) ? 'passive' : 'default';

			if(col > 0 && col < _self.size-1){
				_mm[idx - 1].state = cState;
				_mm[idx + 1].state = cState;
			} else if(col === 0){
				_mm[idx + 1].state = cState;
			} else if(col === _self.size-1){
				_mm[idx - 1].state = cState;
			}

			if(row > 0 && row < _self.size-1){
				_mm[idx - _self.size].state = cState;
				_mm[idx + _self.size].state = cState;
			} else if(row === 0){
				_mm[idx + _self.size].state = cState;
			} else if(row === _self.size-1){
				_mm[idx - _self.size].state = cState;
			}
		};

		/**
		 * Меняем местами ячейки. Алгоритм:
		 * - сначала меняем параментры col/row (для анимаци).
		 * - после по таймауту меняем данные объектов в самом массиве (фигуру)
		 */
		this.replaceElements = function(idx1, idx2){
			shiftToEl(idx1, idx2);

			$timeout(()=>{
				_mm.sort(sortArrByRowCol);

				recurDeleteEl();
			}, 200);
		};
	}]);
})();