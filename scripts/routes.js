app.config(["$routeProvider", function($routeProvider) {
    $routeProvider.
    //
    when("/editor", {
        templateUrl: "views/editor.html"
    }).
    //default
    otherwise({
        redirectTo: "/editor"
    });
}]);
