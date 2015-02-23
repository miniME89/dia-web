app.controller("StatemachineExecutorController", function($scope, StatemachineExecutorService, localStorageService) {
  $scope.save = function() {
    localStorageService.set('statemachine', $scope.editor.graph.toJSON());
    var smdl = SMDLTransformation.toSMDL($scope.editor.graph.toJSONTree());
    console.log(smdl);
    var xml = new XMLSerializer().serializeToString(smdl);
    StatemachineExecutorService.load({
      encoding: 'SMDL/XML',
      data: xml
    });
  };

  $scope.start = function() {
    StatemachineExecutorService.start();
  };

  $scope.stop = function() {
    StatemachineExecutorService.stop();
  };

  $scope.trigger = function() {
    StatemachineExecutorService.event({
      event: $scope.event
    });
  };

});
