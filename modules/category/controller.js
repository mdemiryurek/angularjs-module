angular.module('Category')

.controller('CategoryController', ['$scope', '$rootScope', '$routeParams', '$http', '$location', '$filter', 'Helpers',
    function ($scope, $rootScope, $routeParams, $http, $location, $filter, Helpers) {
    $scope.categoryId = $routeParams.id;

    //Kategori bilgisini getir
    $http.get('/data/categories.json')
            .then(function (response) {
                $scope.categoryInfo = Helpers.findFirstDataByKey(response.data.categories, 'id', $scope.categoryId);
            });

    //Ürünleri getir
    $scope.messageShow = false;
    $scope.message = "";
    $http.get('/data/products.json')
            .then(function (response) {
                $scope.products = Helpers.findAllDataByKey(response.data.products, 'categoryId', $scope.categoryId);
                if ($scope.products.length === 0) {
                    $scope.messageShow = true;
                    $scope.message = "Listelenecek ürün bulunmamaktadır.";
                }
            });
}]);