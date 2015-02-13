app.controller("ElementsController", function($rootScope, $scope, ApplicationDiscoveryService) {
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
    ApplicationDiscoveryService.getApplications().then(function(applications) {
      for (var i = 0; i < applications.length; i++) {
        var state = new joint.shapes.statemachine.invoke({
          name: applications[i].name,
          description: applications[i].description,
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
      $scope.groups[name].elements = [];
    }
  };

  $scope.removeGroup = function(name) {
    delete $scope.groups[name];
  };

  $scope.addElement = function(group, element) {
    $scope.getGroup(group).elements.push(element);
  };

  init();
});
