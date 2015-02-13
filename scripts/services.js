app.service('ServerService', function($http) {
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

app.service('LayoutService', function(localStorageService) {
  var service = {};

  service.loadDefault = function() {
    return {
      sidebar: {
        left: {
          views: ['elements'],
          closed: false
        },
        right: {
          views: ['endpoint', 'input-parameters', 'output-parameters', 'dataflows'],
          closed: false
        }
      },
      bottombar: {
        closed: false
      }
    };
  };

  service.load = function() {
    return localStorageService.get('layout') || service.loadDefault();
  };

  service.save = function(layout) {
    localStorageService.set('layout', layout);
  }

  return service;
});
