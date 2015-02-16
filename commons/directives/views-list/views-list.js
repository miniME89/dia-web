app.directive("viewsList", function() {
  return {
    restrict: "A",
    templateUrl: 'commons/directives/views-list/views-list.html',
    replace: true,
    scope: {
      views: '=viewsList'
    },
    controller: function($scope) {
      var init = function() {
        $scope.layout = $scope.$parent.layout;
      };

      $scope.isVisible = function(view) {
        return $scope.views.indexOf(view) > -1;
      };

      $scope.toggleVisible = function(view) {
        var index = $scope.views.indexOf(view);
        if (index > -1) {
          $scope.views.splice(index, 1);
        }
        else {
          $scope.views.push(view);
        }
      };

      init();
    }
  };
});
