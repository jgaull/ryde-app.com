(function(rydeapp) {

	rydeapp.directive('answer', ['state', 'getFile', 'relations', function factory(state, getFile, relations) {

		var temp = getFile('temp/answer.html');

		return {
			restrict: 'E', /* E: Element, C: Class, A: Attribute M: Comment */
			transclude: true,
			template: temp,
			controller: function($scope, $rootScope, $element, relations) {
				console.log('relations:', relations);
			},
			link: function($scope, $element, $attr) {
				$scope.state = state;
			},
			replace: true
		};
	}]);

}(angular.module('rydeapp')));