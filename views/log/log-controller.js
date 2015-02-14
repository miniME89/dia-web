app.controller("LogController", function($scope, StatemachineExecutorService) {
  var init = function() {
    $scope.levels = ['Info', 'Warning', 'Error', 'Fatal', 'Debug'];
    $scope.maxLogs = 500;
    $scope.countLogs = 0;
    $scope.logs = [];

    $scope.filterLogReset();

    StatemachineExecutorService.log(function(log) {
      $scope.addLog(log);

      return true;
    });
  };

  $scope.addLog = function(log) {
    $scope.logs.unshift(log);
    $scope.countLogs++;

    if ($scope.logs.length > $scope.maxLogs) {
      $scope.logs.pop();
    }
  };

  $scope.clearLog = function() {
    $scope.countLogs = 0;
    $scope.logs = [];
  };

  $scope.filterLogReset = function() {
    $scope.filter = {
      levels: [true, true, true, true, true],
      scope: '',
      message: ''
    };
  }

  $scope.filterLog = function(log) {
    if (!$scope.filter.levels[log.level]) {
      return false;
    }

    if ($scope.filter.scope && log.scope.indexOf($scope.filter.scope) == -1) {
      return false;
    }

    if ($scope.filter.message && log.message.indexOf($scope.filter.message) == -1) {
      return false;
    }

    return true;
  };

  init();
});
