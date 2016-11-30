(function(){
	angular.module('app').factory('drFiledFactory', function(){
		let types = ['square', 'circle', 'triangle'];

		let states = ['default', 'active', 'passive', 'note'];

		return {
			types: types,
			states: states
		}
	});
})();