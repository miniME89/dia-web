app.controller("StencilsController", function($scope, ServerService) {
  var init = function() {
    $scope.groups = {};

    //general elements
    $scope.addElement('General', new joint.shapes.statemachine.initial({
      name: 'Initial',
      description: 'description...'
    }));
    $scope.addElement('General', new joint.shapes.statemachine.final({
      name: 'Final',
      description: 'description...'
    }));
    $scope.addElement('General', new joint.shapes.statemachine.composite({
      name: 'Composite',
      description: 'description...'
    }));
    $scope.addElement('General', new joint.shapes.statemachine.parallel({
      name: 'Parallel',
      description: 'description...'
    }));

    $scope.update();
  };

  $scope.update = function() {
    ServerService.getApplications().then(function(applications) {
      for (var i = 0; i < applications.length; i++) {
        var state = new joint.shapes.statemachine.invoke();
        state.prop('info', {
          name: applications[i].name,
          description: applications[i].description
        });
        state.prop('properties', {
            general: {
            },
            endpoint: applications[i].endpoint,
            inputParameters: applications[i].inputParameters,
            outputParameters: applications[i].outputParameters,
            dataflows: []
        });
        $scope.addElement(applications[i].category, state);
      }
    });
  };

  $scope.getGroup = function(name) {
    if (!$scope.groups[name]) {
      $scope.addGroup(name);
    }

    return $scope.groups[name];
  };

  $scope.addGroup = function(name) {
    if (!$scope.groups[name]) {
      $scope.groups[name] = [];
      $scope.groups[name].name = name;
      $scope.groups[name].stencils = [];
    }
  };

  $scope.removeGroup = function(name) {
    delete $scope.groups[name];
  };

  $scope.addElement = function(group, element) {
    $scope.getGroup(group).stencils.push(element);
  };

  init();
});

app.controller("ToolbarController", function($scope) {
  var init = function() {
    $scope.scaleOptions = [0.25, 0.5, 1.0, 1.5, 2.0, 3.0];
  }

  init();
});

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
