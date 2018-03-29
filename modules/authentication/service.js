angular.module('Authentication')

.factory('AuthenticationService', ['Base64', '$http', '$cookieStore', '$rootScope', '$timeout', function (Base64, $http, $cookieStore, $rootScope, $timeout) {
    
    var service = {};

    service.login = function (email, password) {
        var authdata = Base64.encode(email + ":" + password);
        $rootScope.globals = {
            currentUser: {
                email: email,
                authdata: authdata
            }
        };

        $http.defaults.headers.common['Authorization'] = 'Basic ' + authdata;
        var expireDate = new Date();
        expireDate.setMinutes(expireDate.getMinutes() + 1);
        $cookieStore.put('globals', $rootScope.globals, { expires: expireDate });
    };

    service.clearCredentials = function () {
        $rootScope.globals = {};
        $cookieStore.remove('globals');
        $http.defaults.headers.common.Authorization = 'Basic ';
    };

    return service;
}]);