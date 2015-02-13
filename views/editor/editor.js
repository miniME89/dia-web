app.directive("editor", function() {
  return {
    restrict: "C",
    link: function(scope, element, attributes) {
      var init = function() {
        //create paper
        scope.paper = new joint.dia.Paper({
          el: element,
          width: "100%",
          height: "100%",
          model: scope.graph,
          gridSize: 10
        });

        scope.$watchGroup(["view.size", "view.scale"], updateSize);
        scope.$watch("view.scale", updateScale);
        scope.$watchGroup(["view.grid", "view.gridVisible", "view.scale"], updateGrid);

        scope.paper.on("all", scope.update);

        //element actions
        scope.paper.on("cell:pointerdown", dragElement.start);
        scope.paper.on("cell:pointerup", dragElement.end);
        scope.paper.on("cell:pointermove", dragElement.drag);
        scope.paper.on("cell:pointerdown", embedElement.unembed);
        scope.paper.on("cell:pointerup", embedElement.embed);

        //link actions
        scope.paper.on("cell:pointerdown", dragLink.start);
        scope.paper.on("cell:pointerup", dragLink.end);
        scope.paper.on("cell:pointermove", dragLink.drag);

        //paper actions
        scope.paper.on("blank:pointerdown", dragPaper.start);
        scope.paper.on("blank:pointerup", dragPaper.end);
      };

      /*
       * drag element
       */
      var dragElement = {
        //mouse down
        start: function(cellView, evt, x, y) {
          var cell = cellView.model;

          if (cell instanceof joint.dia.Element) {
            dragElementData = {
              startPosition: {
                x: cell.attributes.position.x,
                y: cell.attributes.position.y
              },
              startPositions: []
            };

            for (var i = 0; i < scope.view.selectionElements.length; i++) {
              dragElementData.startPositions.push(scope.view.selectionElements[i].attributes.position);
            }

            draggedElement = false;

            if (!evt.ctrlKey && !scope.isSelected(cell)) {
              scope.clearSelection();
            }

            scope.addSelection(cell);
            scope.setFocus(cell);
          }
        },
        //mouse up
        end: function(cellView, evt, x, y) {
          var cell = cellView.model;

          if (cell instanceof joint.dia.Element) {

          }
        },
        //mouse move
        drag: function(cellView, evt, x, y) {
          var cell = cellView.model;

          if (cell instanceof joint.dia.Element) {
            draggedElement = true;

            if (scope.view.selectionElements.length > 1) {
              for (var i = 0; i < scope.view.selectionElements.length; i++) {
                if (scope.view.selectionElements[i].id != cell.id) {
                  var pos = {
                    x: dragElementData.startPositions[i].x - (dragElementData.startPosition.x - cell.attributes.position.x),
                    y: dragElementData.startPositions[i].y - (dragElementData.startPosition.y - cell.attributes.position.y)
                  };
                  scope.view.selectionElements[i].position(pos.x, pos.y);
                }
              }
            }
          }
        }
      };

      /*
       * embed element
       */
      var embedElement = {
        //mouse down
        unembed: function(cellView, evt, x, y) {
          var cell = cellView.model;

          if (cell instanceof joint.dia.Element) {
            cell.toFront({
              deep: true
            });

            if (cell.get("parent")) {
              scope.graph.getCell(cell.get("parent")).unembed(cell);
            }
          }
        },
        //mouse up
        embed: function(cellView, evt, x, y) {
          var cell = cellView.model;

          if (cell instanceof joint.dia.Element) {
            //embed cell into cell below
            var cellViewsBelow = scope.paper.findViewsFromPoint(cell.getBBox().center());
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
        }
      };

      /*
       * drag link
       */
      var dragLink = {
        //mouse down
        start: function(cellView, evt, x, y) {
          var cell = cellView.model;

          if (cell instanceof joint.dia.Link) {
            scope.clearSelection();

            draggedLink = false;
          }
        },
        //mouse up
        end: function(cellView, evt, x, y) {
          var cell = cellView.model;

          if (cell instanceof joint.dia.Link) {
            if (!draggedLink) {
              scope.setFocus(cell);
            }
          }
        },
        //mouse move
        drag: function(cellView, evt, x, y) {
          var cell = cellView.model;

          if (cell instanceof joint.dia.Link) {
            draggedLink = true;
          }
        }
      };

      /*
       * drag paper
       */
      var dragPaper = {
        //mouse down
        start: function(e) {
          scope.clearSelection();

          dragPaperData = {
            scrollContainer: $("#editor").parent(),
            x: e.pageX,
            y: e.pageY
          };

          var body = $("body");
          body.on("mousemove", dragPaper.drag);
          body.css("cursor", "move");
        },
        //mouse up
        end: function(e) {
          var body = $("body");
          body.off("mousemove", dragPaper.drag);
          body.css("cursor", "");
        },
        //mouse move
        drag: function(e) {
          dragPaperData.scrollContainer.scrollLeft(dragPaperData.scrollContainer.scrollLeft() - (e.pageX - dragPaperData.x));
          dragPaperData.scrollContainer.scrollTop(dragPaperData.scrollContainer.scrollTop() - (e.pageY - dragPaperData.y));

          dragPaperData.x = e.pageX;
          dragPaperData.y = e.pageY;
        }
      };

      var createGridBackground = function() {
        var gridSize = scope.view.scale * scope.view.grid;
        var gridVisible = scope.view.gridVisible;

        if (!gridVisible || gridSize < 10) {
          return "";
        }

        var canvas = $("<canvas/>", {
          width: gridSize,
          height: gridSize
        });
        canvas[0].width = gridSize;
        canvas[0].height = gridSize;

        var context = canvas[0].getContext("2d");
        context.strokeStyle = "#DFDFDF";
        context.moveTo(gridSize, 0);
        context.lineTo(0, 0);
        context.lineTo(0, gridSize);
        context.stroke();

        return "url(" + canvas[0].toDataURL("image/png") + ")";
      };

      var updateSize = function() {
        $("#editor").css({
          width: scope.view.size.width * scope.view.scale,
          height: scope.view.size.height * scope.view.scale
        });
      };

      var updateScale = function() {
        scope.paper.scale(scope.view.scale, scope.view.scale);
      };

      var updateGrid = function() {
        scope.paper.options.gridSize = scope.view.grid;

        $("#editor").css("backgroundImage", createGridBackground());
      };

      init();
    }
  };
});
