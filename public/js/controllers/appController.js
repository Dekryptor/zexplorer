(function() {

    var app = angular.module('zexplorer');

    app.controller('appController', ['$scope', '$rootScope',
    function($scope, $rootScope) {
        
        var unbind = $rootScope.$on('user.loggedIn', function(ev) {
            
        });

        $scope.$on('$destroy', unbind);
    }]);

})();
