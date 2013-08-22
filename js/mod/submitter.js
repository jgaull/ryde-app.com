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
						if(isFacebook) {
							facebookSignup(saveUser);
						} else {
							saveUser();
						}
					} else {
						alert('Oops, please enter your email!');
					}

					function saveUser() {
						newUser.set("email", $scope.emailAddress);
						newUser.set("password", $scope.emailAddress);
						newUser.set("username", $scope.emailAddress);
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
						if(!Parse.FacebookUtils.isLinked(Parse.User.current()))
						{
							Parse.FacebookUtils.logIn('email, user_location', {
								success: function(user) {
									if (!user.existed()) {
										console.log("User signed up and logged in through Facebook!");
										FB.api('/me', function(response) {
											$scope.emailAddress = response.email;
											if(onSuccess)
												onSuccess();
										});
									} else {
										console.log("User logged in through Facebook!");
									}
								},
								error: function(user, error) {
									alert("Uh oh, looks like you cancelled the Facebook login or it did not fully authorize.");
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
				$scope.unlinkFacebook = function() {
					if(Parse.User.current() !== null) {
						Parse.FacebookUtils.unlink(Parse.User.current(), {
							success: function(user) {
								alert("Facebook disconnected!");
							},
							error: function(user, error) {
								alert("Facebook disconnect failed!");
							}
						});
					} else {
						alert('no current user');
					}
				};
			},
			link: function($scope, $element, $attr) {
			}
		};
	}]);

}(angular.module('rydeapp')));