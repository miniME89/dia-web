var app = angular.module('app', ['ngRoute',
                                 'ui.bootstrap',
                                 'ui.sortable',
                                 'LocalStorageModule',
                                 'ui.tree']);

app.config(["$routeProvider", function($routeProvider) {
  $routeProvider.
    when("/editor", {
      templateUrl: "views/editor.html"
    }).
    otherwise({
      redirectTo: "/editor"
    });
}]);
