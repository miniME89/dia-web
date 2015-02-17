app.directive("stateSelection", function() {
  return {
    restrict: "A",
    scope: {
      state: '=stateSelection'
    },
    link: function(scope, element, attrs) {
      //select state
      element.on('click', function() {
        scope.$parent.editor.selectionDisable = true;
        $('body').addClass('state-selection');

        var select = true;
        scope.$parent.editor.paper.once('cell:pointerup', function(cellView, evt, x, y) {
          if (select) {
            var cell = cellView.model;
            scope.state = cell.id;
          }
        });

        $(document).one('mouseup', function() {
          scope.$parent.editor.selectionDisable = false;
          $('body').removeClass('state-selection');
          select = false;
        });
      });

      //highlight selected state on hover
      element.hover(function() {
        var state = $("[model-id*='" + scope.state + "']");
        if (state.length) {
          state.attr('class', state.attr('class') + ' highlight');
        }
      },
      function() {
        var state = $("[model-id*='" + scope.state + "']");
        if (state.length) {
          state.attr('class', state.attr('class').replace('highlight', ''));
        }
      });
    }
  };
});
