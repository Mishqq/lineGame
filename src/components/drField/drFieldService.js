(function(){
	angular.module('app').service('drFieldService', ['drFiledFactory', '$timeout', function(drFiledFactory, $timeout){
		/**
		 * =================================================================== private methods ===========================================================
		 */
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

			next: for(let i=0; i<repeatTypes.length; i+=1){
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
		function setCoordsToElements(arr, size){
			for(let i=0; i<arr.length; i+=1){
				arr[i].col = i%size;
				arr[i].row = Math.floor(i/size);
			}
		}

		/**
		 * Функция принимает массив, в который добавляет новый элемент.
		 * При добавлении выполняет две проверки:
		 * - если типы двух предыдущих объект равны текущему сгенерированному типу, то генерируем новый
		 * - если типы двух объектов над текузим равны текущему сгенерированному типу, то генерируем новый
		 * @param arr
		 */
		function createElement(arr, size){
			let type = returnRandElement(drFiledFactory.types);

			let repeatTypes = [];

			// Проверки на горизонтальные и вертикальные совпадения при генерации
			checkHRep(arr, size, repeatTypes);
			checkVRep(arr, size, repeatTypes);

			if(repeatTypes.length) type = returnAnotherType(repeatTypes);

			arr.push({
				type: type,
				state: 'default'
			})
		}

		/**
		 * Проверка на горизонтальное повторение
		 */
		function checkHRep(arr, size, repeatTypes){
			let colIdx = arr.length % size;
			if(colIdx > 1){
				if(arr[arr.length - 2].type === arr[arr.length - 1].type){
					repeatTypes.push(arr[arr.length - 1].type)
				}
			}
		}

		/**
		 * Проверка на вертикальное повторение
		 */
		function checkVRep(arr, size, repeatTypes){
			let rowIdx = Math.floor(arr.length/size);
			if(rowIdx > 1){
				if(arr[arr.length - size].type === arr[arr.length - size*2].type){
					repeatTypes.push(arr[arr.length - size].type)
				}
			}
		}


		/**
		 * =================================================================== public methods ===========================================================
		 */

		/**
		 * Метод сервиса возвращает новый массив длиной size*size
		 */
		this.createNewArr = function (size) {
			let arr = [];

			for(let i=0; i<size*size; i++)
				createElement(arr, size);

			setCoordsToElements(arr, size);

			return arr;
		};

		/**
		 * Задаем состояние ближайшим элементам от выделенного
		 */
		this.markClosestCell = function(arr, size, idx, state){
			if(arr[idx-size]) arr[idx-size].state = state;
			if(arr[idx+size]) arr[idx+size].state = state;
			if(arr[idx-1]) arr[idx-1].state = state;
			if(arr[idx+1]) arr[idx+1].state = state;
		};

		/**
		 * Меняем местами ячейки. Алгоритм:
		 * - сначала меняем параментры col/row (для анимаци).
		 * - после по таймауту меняем данные объектов в самом массиве (фигуру)
		 */
		this.replaceElements = function(arr, idx1, idx2){
			let elem1 = {col: arr[idx1].col, row: arr[idx1].row, type: arr[idx1].type, state: arr[idx1].state};
			let elem2 = {col: arr[idx2].col, row: arr[idx2].row, type: arr[idx2].type, state: arr[idx2].state};

			arr[idx1].col = elem2.col;
			arr[idx1].row = elem2.row;

			arr[idx2].col = elem1.col;
			arr[idx2].row = elem1.row;

			/**
			 * Время таймаута - время анимации движения элементов во время смены позиций
			 */
			$timeout(()=>{
				let copyEl = angular.copy(arr[idx1]);
				arr[idx1] = arr[idx2];
				arr[idx2] = copyEl;

				this.checkRowElements(arr);
			}, 200)
		};

		/**
		 * Удаляем объекты одинакового типа, если их больше трёх в строке или в колонке
		 */
		this.checkRowElements = function(arr){
			let result = [];
			let size = drFiledFactory.size;

			// next: for(let i=0; i<arr.length; i+=1){
			// 	let colIdx = i%size;
			// 	let rowIdx = Math.floor(i/size);
			// 	let countInRow = 1;
			// 	let countInCol = 1;
			// 	let currentType = arr[i].type;
			//
			// 	for(let j=1; j<(size-colIdx); j+=1){
			// 		if(arr[i+j].type !== currentType) break;
			// 		countInRow++;
			// 	}
			// 	if(countInRow > 2) {
			// 		let tempArr = [];
			// 		for(let s=1; s<=countInRow; s+=1) tempArr.push(i+s)
			// 		result.push({
			// 			length: countInRow,
			// 			type: currentType,
			// 			idxArr: tempArr
			// 		});
			// 	}
			//
			// 	for(let k=1; k<(size-rowIdx); k+=1){
			// 		if(arr[i+size*k].type !== currentType) break;
			// 		countInCol++;
			// 	}
			// 	if(countInCol > 2) {
			// 		let tempArr = [];
			// 		for(let s=0; s<countInCol; s+=1) tempArr.push(i+size*s)
			// 		result.push({
			// 			length: countInCol,
			// 			type: currentType,
			// 			idxArr: tempArr
			// 		});
			// 	}
			//
			// 	countInRow = countInCol = 0;
			// }

			countRepeatInRow(arr, result, size);
			countRepeatInCol(arr, result, size);

			console.log('---=== result ===---', result);
		};

		function countRepeatInRow(arr, result, size){
			next: for(let i=0; i<arr.length; i+=1){
				let colIdx = i%size;
				let countInRow = 1;
				let currentType = arr[i].type;

				for(let j=1; j<(size-colIdx); j+=1){
					if(arr[i+j].type !== currentType) break;
					countInRow++;
				}
				if(countInRow > 2) {
					let tempArr = [];
					for(let s=1; s<=countInRow; s+=1) tempArr.push(i+s)
					result.push({
						length: countInRow,
						type: currentType,
						idxArr: tempArr
					});
					i+= countInRow-1;
					countInRow = 0;
					continue next;
				}
				countInRow = 0;
			}
		}

		function countRepeatInCol(arr, result, size){
			next: for(let count=0,i=0; i<arr.length; i+=size){
				let rowIdx = Math.floor(i/size);
				let countInCol = 1;
				let currentType = arr[i].type;

				console.log('---=== i ===---', i);

				for(let j=0; j<(size-rowIdx); j+=1){
					// if(arr[i+size*j].type !== currentType) break;
					// countInCol++;
				}
				// if(countInCol > 2) console.log('---=== countInCol ===---', countInCol);
				// if(countInCol > 2) {
				// 	let tempArr = [];
				// 	for(let s=1; s<=countInCol; s+=1) tempArr.push(i+s)
				// 	result.push({
				// 		length: countInCol,
				// 		type: currentType,
				// 		idxArr: tempArr
				// 	});
				// 	i+= countInCol-1;
				// 	countInCol = 0;
				// 	continue next;
				// }
				countInCol = 0;

				// Шагаем вертикально
				if(Math.floor(i/size)+1 === size) {
					count++;
					i=count-size;
				}
			}

			// next: for(let i=0; i<arr.length; i+=1){
			// 	let rowIdx = Math.floor(i/size);
			// 	let countInCol = 1;
			// 	let currentType = arr[i].type;
			//
			// 	for(let k=1; k<(size-rowIdx); k+=1){
			// 		if(arr[i+size*k].type !== currentType) break;
			// 		countInCol++;
			// 	}
			// 	if(countInCol > 2) {
			// 		let tempArr = [];
			// 		for(let s=0; s<countInCol; s+=1) tempArr.push(i+size*s)
			// 		result.push({
			// 			length: countInCol,
			// 			type: currentType,
			// 			idxArr: tempArr
			// 		});
			// 	}
			// 	countInCol = 0;
			// }
		}
	}]);
})();