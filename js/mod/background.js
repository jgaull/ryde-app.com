(function(rydeapp) {

	rydeapp.directive('background', ['state', 'getFile', function factory(state, getFile) {

		var temp = getFile('temp/background.html');

		return {
			restrict: 'E', /* E: Element, C: Class, A: Attribute M: Comment */
			transclude: true,
			template: temp,
			controller: function($scope, $rootScope, $element) {
				console.log('background');
			},
			link: function($scope, $element, $attr) {
				$scope.state = state;
			},
			replace: true
		};
	}]);

}(angular.module('rydeapp')));