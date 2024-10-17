const MyController = ($scope) => {
    $scope.greeting = 'Hello, AngularJS 1.8!';
    $scope.userName = 'John Doe';
    $scope.isLoggedIn = true; // Biến kiểu boolean
    $scope.items = ['Item 1', 'Item 212312312321', 'Item 33333'];
}

angular.module('myApp')
    .controller('MyController', MyController);
