angular.module('zexplorer')
.factory('authService', ['$http', '$cookies', '$q', '$rootScope',
function() {

    var constants = {
        guest: {
            username: "crazyshady",
            password: "zemitaqbomba"
        }
    };
    
    return constants;
}]);