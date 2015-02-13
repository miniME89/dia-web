app.directive("dataflowEditor", function() {
  return {
    restrict: "A",
    replace: true,
    scope: {
      dataflows: '='
    },
    templateUrl: 'partials/dataflow-editor.html',
    controller: function($scope) {
      $scope.add = function() {
        $scope.dataflows.push({
          source: '',
          from: 'output',
          to: 'input'
        });
      };

      $scope.remove = function(index) {
        $scope.dataflows.splice(index, 1);
      };
    }
  };
});
