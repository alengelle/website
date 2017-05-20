var $ = require('../jquery')

module.exports = function(myAppModule) {
    myAppModule.controller('pageCtrl', function($scope, $rootScope, $routeParams) {
        $rootScope.page = $routeParams.page
        $scope.$root = $rootScope
    })
}