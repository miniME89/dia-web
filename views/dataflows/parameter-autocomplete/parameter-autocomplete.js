app.directive("parameterAutocomplete", function() {
  return {
    restrict: "A",
    templateUrl: 'views/dataflows/parameter-autocomplete/parameter-autocomplete.html',
    replace: true,
    scope: {
      parameterPath: '=ngModel',
      state: '=parameterAutocomplete'
    },
    controller: function($scope) {
      var init = function() {
        $scope.suggestions = [];
        $scope.selected = 0;
      };

      $scope.autocomplete = function() {
        if (!$scope.state) {
          return;
        }

        var parameters = {
          value: [
            {
              name: 'input',
              value: $scope.state.attributes.parameters.input
            },
            {
              name: 'output',
              value: $scope.state.attributes.parameters.output
            }
          ]
        };
        var splitParameterPath = $scope.parameterPath.split('/');
        var last = splitParameterPath[splitParameterPath.length - 1];

        //find current parameter based on user input
        for (var i = 0; i < splitParameterPath.length; i++) {
          if (!angular.isArray(parameters.value)) {
            break;
          }

          if (parameters.type == 'Array') {
            var index = parseInt(splitParameterPath[i]);
            if (parameters.value[index]) {
              parameters = parameters.value[index];
            }
          }
          else {
            for (var j = 0; j < parameters.value.length; j++) {
              if (parameters.value[j].name == splitParameterPath[i]) {
                parameters = parameters.value[j];
                break;
              }
            }
          }
        }

        //find suggestions
        var suggestions = [];
        if (angular.isArray(parameters.value)) {
          for (var i = 0; i < parameters.value.length; i++) {
            if (parameters.value[i].name.indexOf(last) === 0 || last === '') {
              if (parameters.type === 'Array') {
                suggestions.push(i);
              }
              else {
                suggestions.push(parameters.value[i].name);
              }
            }
          }
        }

        $scope.selected = 0;
        $scope.suggestions = suggestions;
      };

      $scope.keydown = function(e) {
        //down
        if (e.keyCode === 40) {
          $scope.selected = ($scope.selected + 1 + $scope.suggestions.length) % $scope.suggestions.length;
          e.preventDefault();
        }
        //up
        else if (e.keyCode === 38) {
          $scope.selected = ($scope.selected - 1 + $scope.suggestions.length) % $scope.suggestions.length;
          e.preventDefault();
        }
        //enter
        else if (e.keyCode === 13) {
          var selected = $scope.suggestions[$scope.selected];
          if (selected !== undefined) {
            $scope.selectSuggestion(selected);
          }
          e.preventDefault();
        }
      };

      $scope.clearSuggestions = function() {
        $scope.suggestions = [];
      };

      $scope.selectSuggestion = function(suggestion) {
        var index = $scope.parameterPath.lastIndexOf('/');
        if (index > -1) {
          $scope.parameterPath = $scope.parameterPath.substr(0, index) + '/';
        }
        else {
          $scope.parameterPath = '';
        }

        $scope.parameterPath = $scope.parameterPath + suggestion + '/';
        $scope.autocomplete();
      };

      init();
    }
  };
});
