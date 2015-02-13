app.controller("EditorController", function($scope) {
  var init = function() {
    $scope.debug = true;

    $scope.view = {
      selectionElements: [],
      selectionFocus: null,
      size: {
        width: 1000,
        height: 1000
      },
      scale: 1.0,
      gridVisible: true,
      grid: 10
    };

    $scope.graph = new joint.dia.Graph;
    $scope.graph.on("all", $scope.update);
  }

  $scope.addSelection = function(element) {
    for (var i = 0; i < $scope.view.selectionElements.length; i++) {
      if ($scope.view.selectionElements[i].id == element.id) {
        return;
      }
    }

    $scope.view.selectionElements.unshift(element);
  }

  $scope.removeSelection = function(element) {
    for (var i = 0; i < $scope.view.selectionElements.length; i++) {
      if ($scope.view.selectionElements[i].id == element.id) {
        $scope.view.selectionElements.splice(i, 1);

        if ($scope.view.selectionFocus.id == element.id) {
          $scope.setFocus($scope.view.selectionElements[0]);
        }

        return;
      }
    }
  }

  $scope.isSelected = function(element) {
    for (var i = 0; i < $scope.view.selectionElements.length; i++) {
      if ($scope.view.selectionElements[i].id == element.id) {
        return true;
      }
    }

    return false;
  }

  $scope.clearSelection = function() {
    $scope.view.selectionElements = [];
    $scope.view.selectionFocus = null;
  }

  $scope.setFocus = function(cell) {
    $scope.view.selectionFocus = cell;
  }

  $scope.clearFocus = function() {
    $scope.view.selectionFocus = null;
  }

  $scope.update = function(eventName) {
    if (!$scope.$$phase && eventName != "change") {
      $scope.$apply();
    }
  }

  init();
});
