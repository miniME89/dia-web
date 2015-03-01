app.controller('DataflowsController', function($scope) {
  var init = function() {
    $scope.dataflowSortableOptions = {
      zIndex: 100000
    };
  }

  $scope.addDataflow = function() {
    $scope.editor.selectionFocus.attributes.dataflows.push({
      source: '',
      assigns: []
    });
  };

  $scope.removeDataflow = function(index) {
    $scope.editor.selectionFocus.attributes.dataflows.splice(index, 1);
  };

  $scope.addAssign = function(dataflow) {
    dataflow.assigns = dataflow.assigns || [];
    dataflow.assigns.push({
      from: '',
      to: ''
    });
  };

  $scope.removeAssign = function(dataflow, index) {
    dataflow.assigns.splice(index, 1);
  };

  init();
});
