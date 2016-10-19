/**
 * Basic home page AngularJS view.
 * Currently using a static content.
 */
angular.module('pocHome', ['ngRoute'])
.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/home', {
        templateUrl: '/app/home/home.template.html',
        controller: 'HomeController'
    }
)
}])
.controller('HomeController', ['$scope', function HomeController($scope) {
}]);
