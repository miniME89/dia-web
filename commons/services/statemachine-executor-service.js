app.service('StatemachineExecutorService', function($http) {
  var service = {};

  service.log = function(callback) {
    var index = 0;
    var call = function() {
      $http({
          url: 'http://localhost:7001/log',
          method: 'GET',
          headers: {
            'Push-Notification-Index': index
          }
        }).
        success(function(data, status, headers, config) {
          index = headers('Push-Notification-Index');
          if (callback(data)) {
            call();
          }
        }).
        error(function(data, status, headers, config) {
          if (status === 304)
          {
            call();
          }
          else
          {
            setTimeout(call, 2000);
          }
        });
    };

    call();
  };

  service.state = function(callback) {
    var index = 0;
    var call = function() {
      $http({
          url: 'http://localhost:7001/statemachine/state',
          method: 'GET',
          headers: {
            'Push-Notification-Index': index
          }
        }).
        success(function(data, status, headers, config) {
          index = headers('Push-Notification-Index');
          if (callback(data)) {
            call();
          }
        }).
        error(function(data, status, headers, config) {
          if (status === 304)
          {
            call();
          }
          else
          {
            setTimeout(call, 2000);
          }
        });
    };

    call();
  };

  service.start = function() {
    return $http.post('/executor/statemachine/start').then(function(response) {
      return response.data;
    });
  };

  service.stop = function() {
    return $http.post('/executor/statemachine/stop').then(function(response) {
      return response.data;
    });
  };

  service.load = function() {
    return $http.post('/executor/statemachine/load').then(function(response) {
      return response.data;
    });
  };

  service.unload = function() {
    return $http.post('/executor/statemachine/unload').then(function(response) {
      return response.data;
    });
  };

  service.event = function() {
    return $http.post('/executor/statemachine/unload').then(function(response) {
      return response.data;
    });
  };

  return service;
});
