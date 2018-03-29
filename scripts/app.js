angular.module('Authentication', []);
angular.module('Home', []);
angular.module('Category', []);
angular.module('Order', []);

angular.module('BasicHttpAuthExample', [
    'Authentication',
    'Home',
    'Category',
    'Order',
    'ngRoute',
    'ngCookies'
])

.controller('HeaderController', ['$scope', '$http', '$rootScope', '$cookieStore', '$filter', '$timeout',
    function ($scope, $http, $rootScope, $cookieStore, $filter, $timeout) {

        //Kategorileri doldur
        if ($rootScope.globals && $rootScope.globals.currentUser) {
            console.log('aa');
        $http.get('/data/categories.json')
                .then(function (response) {
                    $scope.categories = response.data.categories;
                });
        }

        //Ürün arama
        $scope.searchMe = function () {
            if ($scope.searchText) {
                $http.get('/data/products.json')
                .then(function (response) {
                    $scope.searchedData = $filter('filter')(response.data.products, { name: $scope.searchText });
                    $scope.searchedShow = true;
                    if ($scope.searchedData.length === 0) {
                        $scope.searchMessageShow = true;
                        $scope.searchMessage = '\"' + $scope.searchText + '\" ile ilgili bir sonuç bulunamadı!"';
                    }
                    else
                        $scope.searchMessageShow = false;
                });
            }
            else {
                $scope.searchedShow = false;
            }
        }

        //searchText onchange
        $scope.onChangeSearchText = function () {
            if (!$scope.searchText) {
                $scope.searchedShow = false;
                $scope.searchedData = [];
                $scope.searchedShow = false;
                $scope.searchMessage = "";
            }
        }
}])

.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when('/login', {
            cache: false,
            controller: 'LoginController',
            templateUrl: 'modules/authentication/views/login.html'
        })
        .when('/logout', {
            cache: false,
            controller: 'LogoutController',
            templateUrl: 'modules/authentication/views/logout.html'
        })
        .when('/category/:id', {
            cache: false,
            controller: 'CategoryController',
            templateUrl: 'modules/category/views/category.html'
        })
        .when('/order/:id', {
            cache: false,
            controller: 'OrderController',
            templateUrl: 'modules/order/views/order.html'
        })
        .when('/', {
            cache: false,
            controller: 'HomeController',
            templateUrl: 'modules/home/views/home.html'
        })
        .otherwise({ redirectTo: '/login' });
}])

.run(['$rootScope', '$location', '$cookieStore', '$http', function ($rootScope, $location, $cookieStore, $http) {
    if (!angular.isUndefined($cookieStore.get('globals'))) {
        $rootScope.globals = $cookieStore.get('globals');
        if ($rootScope.globals.currentUser) {
            $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata;
            $rootScope.IsLogin = true;
        }
        else
            $rootScope.IsLogin = false;
    }
    else
        $rootScope.IsLogin = false;

    $rootScope.$on('$locationChangeStart', function (event, next, current) {
        if ($location.path() !== '/login' && angular.isUndefined($cookieStore.get("globals"))) {
            $location.path('/login');
        }
    });
}])

.factory('Base64', function () {
    var keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    return {
        encode: function (input) {
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;

            do {
                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);

                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;

                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }

                output = output +
                    keyStr.charAt(enc1) +
                    keyStr.charAt(enc2) +
                    keyStr.charAt(enc3) +
                    keyStr.charAt(enc4);
                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";
            } while (i < input.length);

            return output;
        },

        decode: function (input) {
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;

            // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
            var base64test = /[^A-Za-z0-9\+\/\=]/g;
            if (base64test.exec(input)) {
                window.alert("There were invalid base64 characters in the input text.\n" +
                    "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
                    "Expect errors in decoding.");
            }
            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

            do {
                enc1 = keyStr.indexOf(input.charAt(i++));
                enc2 = keyStr.indexOf(input.charAt(i++));
                enc3 = keyStr.indexOf(input.charAt(i++));
                enc4 = keyStr.indexOf(input.charAt(i++));

                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;

                output = output + String.fromCharCode(chr1);

                if (enc3 != 64) {
                    output = output + String.fromCharCode(chr2);
                }
                if (enc4 != 64) {
                    output = output + String.fromCharCode(chr3);
                }

                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";

            } while (i < input.length);

            return output;
        }
    };
})

.factory('Helpers', function () {
    var services = {};

    services.findFirstDataByKey = function (data, keyName, keyValue) {
        var returnValue;
        angular.forEach(data, function (value) {
            if (value[keyName].toString() === keyValue.toString()) {
                returnValue = value;
                return;
            }
        });
        return returnValue;
    };

    services.findAllDataByKey = function (data, keyName, keyValue) {
        var returnValues = [];
        angular.forEach(data, function (value) {
            if (value[keyName].toString() === keyValue.toString()) {
                returnValues.push(value);;
            }
        });
        return returnValues;
    };

    return services;
})

.filter('unique', function () {
    return function (collection, keyname) {
        var output = [];
        var keys = [];

        angular.forEach(collection, function (item) {
            var key = item[keyname];
            if (keys.indexOf(key) === -1) {
                keys.push(key);
                output.push(item);
            }
        });
        return output;
    };
});