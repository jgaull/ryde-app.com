(function(rydeapp) {

	rydeapp.directive('selector', ['state', 'getFile', 'diets', function factory(state, getFile, diets) {

		var temp = getFile('temp/selector.html');

		return {
			restrict: 'E', /* E: Element, C: Class, A: Attribute M: Comment */
			transclude: true,
			template: temp,
			controller: function($scope, $rootScope, $element, diets) {
				$scope.state = state;
				$scope.setSelection = function(diet) {
					console.log('setting selection:', diet.get('name'));
					state.dietData = diet;
				};
			},
			link: function($scope, $element, $attr) {
				$scope.diets = diets;
				state.dietData = "Slow Carb";
			},
			replace: true
		};
	}]);

}(angular.module('rydeapp')));