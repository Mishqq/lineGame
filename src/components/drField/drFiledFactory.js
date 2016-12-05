(function(){
	angular.module('app').factory('drFiledFactory', function(){
		let types = ['square', 'circle', 'triangle'];

		let states = ['default', 'active', 'passive', 'note'];

		let pointsMap = {
			square: 10,
			triangle: 20,
			circle: 30
		};

		let size = 5;

		return {
			types: types,
			states: states,
			size: size,
			pointsMap: pointsMap
		}
	});
})();