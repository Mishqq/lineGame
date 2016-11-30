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
			checkHRep(arr, type, repeatTypes);
			checkVRep(arr, size, type, repeatTypes);

			if(repeatTypes.length) type = returnAnotherType(repeatTypes);

			arr.push({
				type: type,
				state: 'default'
			})
		}

		/**
		 * Проверка на горизонтальное повторение
		 */
		function checkHRep(arr, type, repeatTypes){
			if(arr[arr.length-1] && arr[arr.length-2] &&
				arr[arr.length-1].type === type && arr[arr.length-2].type === type){
				repeatTypes.push(type)
			}
		}

		/**
		 * Проверка на вертикальное повторение
		 */
		function checkVRep(arr, size, type, repeatTypes){
			if((arr[arr.length-size] && arr[arr.length-size*2] &&
				arr[arr.length-size].type === type && arr[arr.length-size*2].type === type)){
				repeatTypes.push(type);
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
			}, 200)
		}
	}]);
})();