angular.module('Order')

.controller('OrderController', ['$scope', '$rootScope', '$routeParams', '$http', '$location', '$filter', 'Helpers',
    function ($scope, $rootScope, $routeParams, $http, $location, $filter, Helpers) {
    $scope.productId = $routeParams.id;
    $scope.isCompleted = false;
    if ($scope.productId) {

        //Ürün bilgilerini getir
        $http.get('/data/products.json')
                .then(function (response) {
                    $scope.productInfo = Helpers.findFirstDataByKey(response.data.products, 'id', $scope.productId);
                    if (angular.isUndefined($scope.productInfo))
                        $location.path('/');
                });

        //Şehir ve ilçeleri getir
        $http.get('/Data/CitiesDistricts.json')
                .then(function (response) {
                    $scope.citiesAndDistricts = response.data;
                });

        //İlçeleri doldur
        $scope.onChangeDistrict = function () {
            $scope.districts = Helpers.findAllDataByKey($scope.citiesAndDistricts, 'il', $scope.cityName);
        }

        //Sipariş formunu gönder
        $scope.orderFormSend = function () {
            $scope.isFormSubmiting = true;
            $http.get('/data/orders.json')
                .then(function (response) {
                    $scope.orders = response.data;
                    $scope.newOrderJson = {
                        "name": $scope.name,
                        "surname": $scope.surname,
                        "email": $scope.email,
                        "address": $scope.address,
                        "address2": $scope.address2,
                        "city": $scope.cityName,
                        "district": $scope.districtName,
                        "zip": $scope.zip,
                        "products": [
                            {
                                "id": $scope.productInfo.id,
                                "name": $scope.productInfo.name,
                                "price": $scope.productInfo.price,
                                "currency": $scope.productInfo.currency
                            }
                        ],
                        "orderDate": new Date()
                    }
                    $scope.orders.push($scope.newOrderJson);
                    $scope.isFormSubmiting = false;
                    $scope.isCompleted = true;
                });
        }
    }
    else
        $location.path('/');
}]);
