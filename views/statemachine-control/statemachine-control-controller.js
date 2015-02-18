app.controller("StatemachineControlController", function($scope, StatemachineExecutorService) {
  $scope.saveXml = function() {
    var smdl = SMDLTransformation.toSMDL($scope.editor.graph.toJSONTree());
    console.log(smdl);
  };

  $scope.start = function() {
    console.log('start');
    StatemachineExecutorService.start();
  };

  $scope.stop = function() {
    console.log('stop');
    StatemachineExecutorService.stop();
  };

});
