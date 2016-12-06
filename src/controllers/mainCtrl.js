(function(){
	'use strict';

	angular
		.module('app')
		.controller('mainCtrl', mainCtrl);

	function mainCtrl($scope, $http, $state, $stateParams, $timeout, drFiledFactory, drFieldService){
		this.$scope = $scope;
		this.$http = $http;
		this.$state = $state;

		this.drFieldService = drFieldService;
		this.points = drFieldService.points;
		this.drFiledFactory = drFiledFactory;

		this.cellState = 'square';

		this.init();
	}

	mainCtrl.prototype.init = function(){

	};

	mainCtrl.$inject = ['$scope', '$http', '$state', '$stateParams', '$timeout', 'drFiledFactory', 'drFieldService'];
})();