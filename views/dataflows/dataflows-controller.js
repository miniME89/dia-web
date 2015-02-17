app.controller('DataflowsController', function($scope) {
  var init = function() {
    $scope.dataflowSortableOptions = {
      zIndex: 100000
    };
  }

  $scope.add = function() {
    $scope.editor.selectionFocus.attributes.dataflows.push({
      source: '',
      from: 'output',
      to: 'input'
    });
  };

  $scope.remove = function(index) {
    $scope.editor.selectionFocus.attributes.dataflows.splice(index, 1);
  };

  init();
});
