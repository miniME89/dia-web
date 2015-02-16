app.directive("parameterEditor", function($compile) {
  return {
    restrict: "A",
    templateUrl: 'commons/directives/parameter-editor/parameter-editor.html',
    replace: true,
    scope: {
      key: '=',
      value: '=',
      parent: '='
    },
    controller: function($scope) {
      $scope.getType = function(element) {
        var value = element || $scope.value;
        var type = typeof value;

        return (angular.isArray(value) && 'Array') || (angular.isObject(value) && 'Object') || type[0].toUpperCase() + type.slice(1);
      };

      $scope.setType = function(type) {
        $scope.value = {Boolean: true, Number: 0, String: '', Array: [], Object: {}}[type];
      };

      $scope.setKey = function(newKey) {
        if (newKey === '') {
          $scope.newKey = $scope.key;
          return;
        }

        if (newKey !== $scope.key) {
          $scope.parent[newKey] = $scope.value;
          delete $scope.parent[$scope.key];
        }
      };

      $scope.setValue = function(newValue) {
        if ($scope.getType() == 'Boolean') {
          $scope.value = (newValue == 'true') ? true : false;
        }
        else if ($scope.getType() == 'Number') {
          $scope.value = parseFloat(newValue);
        }
        else {
          $scope.value = newValue;
        }
      };

      $scope.add = function() {
        if ($scope.getType() == 'Array') {
          $scope.value.push(0);
        }
        else if ($scope.getType() == 'Object') {
          var key = 'name';
          for (var i = 1; key in $scope.value; i++) {
            key = 'name_' + i;
          }
          $scope.value[key] = 0;
        }
      };

      $scope.remove = function() {
        if (angular.isArray($scope.parent)) {
          $scope.parent.splice($scope.key, 1);
        }
        else if (angular.isObject($scope.parent)) {
          delete $scope.parent[$scope.key];
        }
      };

      $scope.$watch('value', function(newValue, oldValue) {
        $scope.newValue = $scope.value + '';
      });

      $scope.$watch('key', function(newValue, oldValue) {
        $scope.newKey = $scope.key + '';
      });

      $scope.closed = true;
      $scope.editKey = false;
    },
    compile: function(element) {
      var contents = element.contents().remove();
      var compiledContents;
      return {
        //compiles and re-adds the contents
        post: function(scope, element){
          //compile the contents
          if(!compiledContents) {
              compiledContents = $compile(contents);
          }
          //re-add the compiled contents to the element
          compiledContents(scope, function(clone) {
              element.append(clone);
          });
        }
      };
    }
  };
});
