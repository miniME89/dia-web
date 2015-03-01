app.service('LayoutService', function(localStorageService) {
  var service = {};

  service.loadDefault = function() {
    return {
      sidebar: {
        views: [
          {
            id: 'elements',
            name: 'Elements'
          },
          {
            id: 'statemachine-executor',
            name: 'Statemachine Executor'
          },
          {
            id: 'general',
            name: 'General'
          },
          {
            id: 'endpoint',
            name: 'Endpoint'
          },
          {
            id: 'parameters',
            name: 'Parameters'
          },
          {
            id: 'dataflows',
            name: 'Dataflows'
          },
          {
            id: 'transition',
            name: 'Transition'
          }
        ],
        left: {
          views: ['elements', 'statemachine-executor'],
          closed: false
        },
        right: {
          views: ['general', 'endpoint', 'parameters', 'dataflows', 'transition'],
          closed: false
        }
      },
      bottombar: {
        closed: false
      },
      bindings: ['ROS']
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
