angular.module('Authentication')

.controller('LoginController', ['$scope', '$routeParams', '$route', '$http', '$location', '$cookieStore', '$rootScope', '$timeout', 'AuthenticationService',
    function ($scope, $routeParams, $route, $http, $location, $cookieStore, $rootScope, $timeout, AuthenticationService) {

    //Kullanıcı girişi yapma
    $scope.errorShow = false;
    $scope.loginStatus = false;
    $scope.loginMessage = "";
    $scope.loginMe = function () {
        $scope.isFormSubmiting = true;
        $timeout(function () {
            $http.get('/data/members.json')
                .then(function (response) {
                    $scope.isFormSubmiting = false;
                    angular.forEach(response.data.members, function (value) {
                        if (value.email === $scope.email &&
                            value.password === $scope.password) {
                            $scope.loginStatus = true;
                            AuthenticationService.login($scope.email, $scope.password);
                            $location.path('/');
                            return;
                        }
                    });

                    if (!$scope.loginStatus) {
                        $scope.errorShow = true;
                        $scope.loginMessage = "Giriş yapılamadı, tekrar deneyin!";
                    }
                })
                .catch(function () {
                    $scope.errorShow = true;
                    $scope.loginStatus = false;
                    $scope.loginMessage = "Beklenmeyen bir hata oluştu!";
                });
        }, 2000);
    }
}])

.controller('LogoutController', ['$scope', '$route', '$rootScope', '$location', '$cookieStore', 'AuthenticationService',
    function ($scope, $route, $rootScope, $location, $cookieStore, AuthenticationService) {
    AuthenticationService.clearCredentials();
    $location.path('/');
}]);