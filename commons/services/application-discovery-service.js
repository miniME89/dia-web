app.service('ApplicationDiscoveryService', function($http) {
  var service = {};

  service.getApplications = function() {
    return $http.get('/server/applications').then(function(response) {
      return response.data.applications;
    });
  };

  service.getApplication = function(applicationId) {
    return $http.get('/server/applications/' + applicationId).then(function(response) {
      return response.data;
    });
  };

  return service;
});
