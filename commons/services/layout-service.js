app.service('LayoutService', function(localStorageService) {
  var service = {};

  service.loadDefault = function() {
    return {
      sidebar: {
        left: {
          views: ['elements', 'statemachine'],
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
