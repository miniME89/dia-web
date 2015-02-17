app.directive("element", function() {
  return {
    restrict: "A",
    templateUrl: 'views/elements/element/element.html',
    replace: true,
    scope: {
      element: "="
    },
    link: function(scope, element, attributes) {
      var init = function() {
        var graph = new joint.dia.Graph;
        var paper = new joint.dia.Paper({
          el: element,
          model: graph,
          gridSize: 1,
          interactive: false
        });

        graph.addCell(scope.element);
        scope.element.set({
          position: {
            x: 1,
            y: 1
          }
        });
        paper.fitToContent({
          padding: 1
        });

        element.draggable({
          helper: "clone",
          zIndex: 100000,
          start: $.proxy(dragStart, element),
          stop: $.proxy(dragStop, scope.element)
        });

        element.popover({
          container: "body",
          trigger: "hover"
        });
      };

      var intersect = function(draggable, droppable) {
        var posDraggable = draggable.offset();
        var x1 = posDraggable.left, x2 = x1 + draggable.width(), y1 = posDraggable.top, y2 = y1 + draggable.height();

        var posDroppable = droppable.offset();
        var l = posDroppable.left, r = l + droppable.width(), t = posDroppable.top, b = t + droppable.height();

        return (l < x1 + (draggable.width() / 2) && x2 - (draggable.width() / 2) < r && t < y1 + (draggable.height() / 2) && y2 - (draggable.height() / 2) < b);
      };

      var dragStart = function(e, ui) {
        this.popover("hide");
      };

      var dragStop = function(e, ui) {
        var scope = angular.element($("#editor")).scope();
        var editor = $("#editor");
        var graph = scope.graph;
        var paper = scope.editor.paper;
        var svg = $(paper.svg);
        var helper = $(ui.helper);

        //element dropped on editor SVG?
        if (intersect(helper, svg)) {
          var posEditor = editor.offset();
          var pos = {
            x: ((ui.offset.left - posEditor.left) / editor.width()) * scope.editor.size.width,
            y: ((ui.offset.top - posEditor.top) / editor.height()) * scope.editor.size.height
          };

          pos.x = g.snapToGrid(pos.x, scope.editor.grid);
          pos.y = g.snapToGrid(pos.y, scope.editor.grid);

          var cell = this.clone();
          cell.set({
            position: {
              x: pos.x,
              y: pos.y
            }
          });
          graph.addCell(cell);
          cell.toFront();
          scope.clearSelection();
          scope.addSelection(cell);
          scope.setFocus(cell);

          //embed cell into cell below
          var cellViewsBelow = scope.editor.paper.findViewsFromPoint(cell.getBBox().center());
          if (cellViewsBelow.length > 0) {
            //find first element under this element
            var cellViewBelow = null;
            var foundSelf = false;
            for (var i = cellViewsBelow.length - 1; i >= 0; i--) {
              if (cellViewsBelow[i].model.id === cell.id) {
                foundSelf = true;
              }
              else if (foundSelf) {
                cellViewBelow = cellViewsBelow[i];
                break;
              }
            }

            //prevent recursive embedding
            if (cellViewBelow && cellViewBelow.model.get("parent") !== cell.id) {
              cellViewBelow.model.embed(cell);
            }
          }
        }
      };

      init();
    }
  };
});
