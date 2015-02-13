app.controller("LayoutController", function($scope, LayoutService) {
  var init = function() {
    $scope.sidebarSortableOptions = {
      containment: 'body',
      appendTo: 'body',
      connectWith: '.sortable',
      handle: '.view-header',
      helper: 'clone',
      zIndex: 100000
    };
    $scope.loadLayout();
  }

  $scope.loadDefaultLayout = function() {
    $scope.layout = LayoutService.loadDefault();
  };

  $scope.loadLayout = function() {
    $scope.layout = LayoutService.load();
  };

  $scope.saveLayout = function() {
    LayoutService.save($scope.layout);
  };

  $scope.$watch('layout', function(newValue, oldValue) {
    $scope.saveLayout(newValue);
  }, true);

  init();
});
