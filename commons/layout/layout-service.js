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
            id: 'statemachine-control',
            name: 'Statemachine Control'
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
          views: ['elements', 'statemachine-control'],
          closed: false
        },
        right: {
          views: ['endpoint', 'parameters', 'dataflows', 'transition'],
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
