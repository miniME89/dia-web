app.controller("ViewController", function($scope) {
  var init = function() {
    $scope.sortableOptions = {
      containment: 'body',
      appendTo: 'body',
      connectWith: '.sortable',
      handle: '.view-header',
      helper: 'clone',
      zIndex: 100000
    };
  }

  init();
});
