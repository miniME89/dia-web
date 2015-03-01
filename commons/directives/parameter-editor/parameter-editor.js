app.directive("parameterEditor", function($compile) {
  return {
    restrict: "A",
    templateUrl: 'commons/directives/parameter-editor/parameter-editor.html',
    replace: true,
    scope: {
      value: '=parameterEditor'
    },
    controller: function($scope) {
      var init = function() {
        $scope.parameter = {
          value: $scope.value
        };

        $scope.$watch('value', function(newValue, oldValue) {
          $scope.parameter = {
            value: newValue
          };
        });
      };

      $scope.add = function(scope) {
        if (!angular.isArray(scope.parameter.value)) {
          scope.parameter.value = [];
        }

        scope.parameter.value.push({
          type: 'String',
          name: 'name',
          value: ''
        });
      };

      $scope.remove = function(scope) {
        scope.remove();
      };

      $scope.focusInputName = function(element) {
        setTimeout(function() {
          $(element.target).parent().next().find('input').focus();
        }, 100);
      };

      init();
    }
  };
});
