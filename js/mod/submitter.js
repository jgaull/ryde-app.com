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
				if(userId !== undefined && userId !== null && userId.length > 0) {
					$scope.submitted = true;
					$('#confirmation').css('display', 'inherit');
					$('#submissionForm').css('display', 'none');
				} else {
					$scope.submitted = false;
					$('#confirmation').css('display', 'none');
					$('#submissionForm').css('display', 'inherit');
				}

				//create a new entry
				$scope.submit = function(isFacebook) {
					var User = Parse.Object.extend("_User");

					if($scope.emailAddress && $scope.emailAddress || isFacebook) {
						$scope.saving = true;
						$scope.error = false;
						if(isFacebook) {
							facebookSignup(saveUser);
						} else {
							saveUser(new User());
						}
					} else {
						alert('Please enter a valid email address.');
					}

					function saveUser(userToSave) {
						userToSave.set("email", $scope.emailAddress);
						userToSave.set("password", $scope.emailAddress);
						userToSave.set("username", $scope.emailAddress);
						userToSave.save(null, {
							success: function(savedUser) {
								console.log("The object was saved successfully.");
								$scope.submitted = true;
								$scope.saving = false;
								$('#confirmation').css('display', 'inherit');
								$('#submissionForm').css('display', 'inherit');
								$('.fadeOutLeft').removeClass('fadeOutLeft');
								$('.fadeInRight').removeClass('fadeInRight');

								$('#confirmation').addClass('animated fadeInRight');
								$('#submissionForm').addClass('animated fadeOutLeft');
								$scope.$digest();
								$.jStorage.set('userId', savedUser.id);
							},
							error: function(savedUser, error) {
								$scope.saving = false;
								$scope.error = true;
								var message = "Your email is not valid or you're already signed up.";
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
												onSuccess(user);
										});
									} else {
										console.log("User logged in through Facebook!");
									}
								},
								error: function(user, error) {
									alert("Error connecting to Facebook, please try again.");
								}
							});
						}
					}
				};

				//load existing entry
				$scope.resetForm = function() {
					$scope.emailAddress = '';
					$scope.submitted = false;
					$('#confirmation').css('display', 'inherit');
					$('#submissionForm').css('display', 'inherit');
					$('.fadeOutLeft').removeClass('fadeOutLeft');
					$('.fadeInRight').removeClass('fadeInRight');

					$('#submissionForm').addClass('animated fadeInRight');
					$('#confirmation').addClass('animated fadeOutLeft');
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