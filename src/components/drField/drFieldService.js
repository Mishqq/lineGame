(function(){
	angular.module('app').service('drFieldService', ['drFiledFactory', function(drFiledFactory){
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
		function returnAnotherType(type){
			let newArr = angular.copy(drFiledFactory.types);

			for(let i=0; i<newArr.length; i+=1){
				if(newArr[i] === type) newArr.splice(i, 1);
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

			if(arr[arr.length-1] &&
				arr[arr.length-2] &&
				arr[arr.length-1].type === type &&
				arr[arr.length-2].type === type){
				type = returnAnotherType(type);
			} else if(arr[arr.length-size] &&
				arr[arr.length-size*2] &&
				arr[arr.length-size].type === type &&
				arr[arr.length-size*2].type === type){
				type = returnAnotherType(type);
			}

			arr.push({
				type: type,
				state: 'default'
			})
		}

		/**
		 * Метод сервиса возвращает новый массив длиной size*size
		 */
		this.createNewArr = function (size) {
			let arr = [];

			for(let i=0; i<size*size; i++){
				createElement(arr, size);
			}

			setCoordsToElements(arr, size);

			return arr;
		};

		this.markClosestCell = function(arr, size, idx, state){
			if(arr[idx-size]) arr[idx-size].state = state;
			if(arr[idx+size]) arr[idx+size].state = state;
			if(arr[idx-1]) arr[idx-1].state = state;
			if(arr[idx+1]) arr[idx+1].state = state;
		};
	}]);
})();