(function(rydeapp) {

	rydeapp.factory('selectConsumable', ['$rootScope', 'state', 'relations', 'consumables', function($rootScope, state, relations, consumables){
		return function selectConsumable(consumableName){
			console.log('select: ', consumableName);
			//cosumable
			state.consumableData = consumables.find(function(consumable){
				return consumable.get('name') === consumableName;
			});
			
			//relation
			var consumableRelations = state.consumableData.get('relations');
			var relationId = consumableRelations[state.dietData.id];
			if(relationId !== undefined)
				state.consumableRelation = relations.get(relationId).get('name');
			else
				state.consumableRelation = "??";

			//descs
			var descs = state.consumableData.get('desc');
			// if()
			state.consumableDesc = descs[state.dietData.id];

			//name
			state.consumableName = consumableName;

			//update view
			$("#search").addClass('active');
			$(".search-bar").blur();

			$rootScope.$digest();
		};
	}]);

	rydeapp.directive('search', ['getFile', function factory(getFile) {

		var temp = getFile('temp/search.html');

		return {
			restrict: 'E', /* E: Element, C: Class, A: Attribute M: Comment */
			transclude: true,
			template: temp,
			replace: true
		};
	}]);

	rydeapp.directive('searchBar', ['state', 'consumables', 'selectConsumable', function(state, consumables, selectConsumable){
		return {
			restrict: 'C',
			transclude: true,
			controller: function($scope, $rootScope, $element, state) {
				$scope.onfocus = function(e) {
					$("#search").removeClass('active');
					$($element).html("");
					state.consumableRelation = "";
					state.consumableDesc = "";
					state.consumableName = "";
					$rootScope.$digest();
				};
			},
			link: function($scope, $element, $attr, state) {
				// $element.on('keypress', $scope.keypress);
				var options = {
					source: consumables.names,
					items: 5,
					updater: selectConsumable
				};
				$element.typeahead(options);

				$element.focus($scope.onfocus);
			}
		};
	}]);

}(angular.module('rydeapp')));