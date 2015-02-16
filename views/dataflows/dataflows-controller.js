app.controller("DataflowsController", function($scope) {
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

  $scope.autocomplete = function() {
    console.log('autocomplete');
    var parameters = $scope.editor.selectionFocus.attributes.parameters;
    
  };
});
