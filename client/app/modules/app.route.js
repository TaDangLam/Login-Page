angular.module('myApp')
.config(['$routeProvider', ($routeProvider) => {
    $routeProvider
      .when('/login', {
        templateUrl: 'app/views/login.html',
        controller: 'LoginController',
      })
      .when('/register', {
        templateUrl: 'app/views/register.html',
        controller: 'RegisterController',
      })
      .when('/otp', {
        templateUrl: 'app/views/otp.html',
        controller: 'OtpController'
      })
      .otherwise({
        redirectTo: '/login'  
      });
}]);

