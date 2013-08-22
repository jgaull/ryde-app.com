function trackpage(id)
{
	console.log('window', window);
	console.log("start trackpage: " + id);
	console.log("end trackpage: " + id);
}

window.fbAsyncInit = function() {
	Parse.initialize("GtW060KQQ2rmEyFqKXMqjyexpqJ5DvH7tm8rf3e7", "UoCaXIRVOhc7X6Ep9DNQ9WDkmuZCnAaJK3OGvvY4");
	// init the FB JS SDK
	Parse.FacebookUtils.init({
		appId      : '101998946674227',                        // App ID from the app dashboard
		channelUrl : '//ryde-app.com/channel.html', // Channel file for x-domain comms
		status     : true, // check login status
		cookie     : true, // enable cookies to allow Parse to access the session
		xfbml      : true  // parse XFBML
	});
}
(function(angular) {
	var ng = angular.module('ng');
	var rydeapp = angular.module('rydeapp', ['ng']);

	rydeapp.run(function($rootScope) {
		console.log("App Launching");
	});

	ng.factory('getLocal', ['connectivity', function(connectivity){
		return function(key) {
			var value = $.jStorage.get(key);
			if(value === null)
				return value;
			else if(value.hasOwnProperty('expiration') && value.expiration < Date.now())
			{
				if(!connectivity.status) // not connected, so use what you have
					return value;
				else
					return null;
			} else
				return value;
		};
	}]);

	ng.factory('getFile', ['$window', function($window) {
		return function factory(id) {
			if ($window.XMLHttpRequest)
				request = new XMLHttpRequest();
			else
				request = new ActiveXObject("Microsoft.XMLHTTP");

			if (request) {
				request.open("GET", id, false);
				request.send(null);
				return request.responseText;
			} else {
				return false;
			}
		};
	}]);

}(angular));
