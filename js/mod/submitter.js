(function(rydeapp) {

	rydeapp.directive('submitter', ['getFile', function factory(getFile) {

		var temp = getFile('temp/submitter.html');

		return {
			restrict: 'E', /* E: Element, C: Class, A: Attribute M: Comment */
			// transclude: true,
			template: temp,
			replace: true,
			scope: true,
			controller: function($scope, $rootScope, $element) {
				$scope.saving = false;
				$scope.error = false;

				var userId = $.jStorage.get('userId');
				if(userId !== undefined && userId !== null && userId.length > 0)
					$scope.submitted = true;
				else
					$scope.submitted = false;

				//create a new entry
				$scope.submit = function(isFacebook) {
					var User = Parse.Object.extend("_User"),
					newUser;

					if($scope.emailAddress && $scope.emailAddress || isFacebook) {
						$scope.saving = true;
						$scope.error = false;
						newUser = new User(); //create a new object

						newUser.set("email", $scope.emailAddress);
						newUser.set("password", $scope.emailAddress);
						newUser.set("username", $scope.emailAddress);
						if(isFacebook) {
							facebookSignup(saveUser);
						} else {
							saveUser();
						}
					} else {
						alert('Oops, please enter your email!');
					}

					function saveUser() {
						newUser.save(null, {
							success: function(newUser) {
								console.log("The object was saved successfully.");
								$scope.submitted = true;
								$scope.saving = false;
								$scope.$digest();
								$.jStorage.set('userId', newUser.id);
							},
							error: function(newUser, error) {
								$scope.saving = false;
								$scope.error = true;
								var message = "There was a problem with your email, please try again.";
								// $scope.errorMessage = "There was a problem with your email, please try again.";
								alert(message);
								$scope.$digest();
								// error is a Parse.Error with an error code and description.
							}
						});
					}

					function facebookSignup(onSuccess) {
						if(!Parse.FacebookUtils.isLinked(newUser))
						{
							Parse.FacebookUtils.logIn(null, {
								success: function(user) {
									if (!user.existed()) {
										alert("User signed up and logged in through Facebook!");
										if(onSuccess)
											onSuccess();
									} else {
										alert("User logged in through Facebook!");
									}
								},
								error: function(user, error) {
									alert("User cancelled the Facebook login or did not fully authorize.");
								}
							});
						}
					}
				};

				//load existing entry
				$scope.resetForm = function() {
					$scope.emailAddress = '';
					$scope.submitted = false;
					$.jStorage.set('userId', '');
				};
			},
			link: function($scope, $element, $attr) {
			}
		};
	}]);

}(angular.module('rydeapp')));