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
          views: [true, true, false, false, false, false, false],
          closed: false
        },
        right: {
          views: [false, false, true, true, true, true, true],
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
