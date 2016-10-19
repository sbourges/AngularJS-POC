angular.module('pocApp', ['ngRoute', 'pocOrder','pocHome','angularjs-datetime-picker','angularjs-dropdown-multiselect'])
.config(['$locationProvider', '$routeProvider', function ($locationProvider, $routeProvider) {
    $locationProvider.hashPrefix("!");
    $routeProvider.otherwise({ redirectTo: '/home' });
}])
.provider('staticData', function () {
    console.log('staticData constructor');
    this.$get = function ($http) {
        return {
            wsurl: 'http://localhost:49769/api'
        }
    }
});
