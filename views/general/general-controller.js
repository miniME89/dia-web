app.controller("GeneralController", function($scope) {
  var init = function() {
    $scope.$watch('editor.selectionFocus.attributes.position', function(newValue, oldValue) {
      if (newValue) {
        $scope.position = {
          x: newValue.x,
          y: newValue.y
        };
      }
    });

    $scope.$watch('position', function(newValue, oldValue) {
      if (newValue && $scope.editor.selectionFocus) {
        var diff = {
          dx: newValue.x - $scope.editor.selectionFocus.attributes.position.x,
          dy: newValue.y - $scope.editor.selectionFocus.attributes.position.y
        };
        if (diff.dx !== 0 || diff.dy !== 0) {
          $scope.editor.selectionFocus.translate(diff.dx, diff.dy);
        }
      }
    }, true);

    $scope.$watch('editor.selectionFocus.attributes.size', function(newValue, oldValue) {
      if (newValue) {
        $scope.size = {
          width: newValue.width,
          height: newValue.height
        };
      }
    });

    $scope.$watch('size', function(newValue, oldValue) {
      if (newValue) {
        $scope.editor.selectionFocus.resize(newValue.width, newValue.height);
      }
    }, true);
  };

  init();
});
