app.directive("editor", function(StatemachineExecutorService, localStorageService) {
  return {
    restrict: "C",
    link: function(scope, element, attributes) {
      var init = function() {
        //create paper
        scope.editor.paper = new joint.dia.Paper({
          el: element,
          width: "100%",
          height: "100%",
          model: scope.editor.graph,
          gridSize: 10
        });

        scope.$watchGroup(["editor.size", "editor.scale"], updateSize);
        scope.$watch("editor.scale", updateScale);
        scope.$watchGroup(["editor.grid", "editor.gridVisible", "editor.scale"], updateGrid);

        scope.editor.paper.on("all", scope.update);

        //statemachine changes
        StatemachineExecutorService.state(statemachineChanges);

        //element actions
        scope.editor.paper.on("cell:pointerdown", dragElement.start);
        scope.editor.paper.on("cell:pointerup", dragElement.end);
        scope.editor.paper.on("cell:pointermove", dragElement.drag);
        scope.editor.paper.on("cell:pointerdown", embedElement.unembed);
        scope.editor.paper.on("cell:pointerup", embedElement.embed);

        //link actions
        scope.editor.paper.on("cell:pointerdown", dragLink.start);
        scope.editor.paper.on("cell:pointerup", dragLink.end);
        scope.editor.paper.on("cell:pointermove", dragLink.drag);

        //paper actions
        scope.editor.paper.on("blank:pointerdown", dragPaper.start);
        scope.editor.paper.on("blank:pointerup", dragPaper.end);
      };

      /*
       * statemachine changes
       */
      var statemachineChanges = function(states) {
        for (var i = 0; i < states.length; i++) {
          var state = states[i];
          //statemachine
          if (state.action === 'statemachine') {
            //statemachine start
            if (state.change === 'start') {
              $('.editor [model-id]').each(function() {
                $(this).attr('class', $(this).attr('class').replace(' active', '').replace(' finish', ''));
              });
            }
            //statemachine stop
            else if (state.change === 'stop') {
              $('.editor [model-id]').each(function() {
                $(this).attr('class', $(this).attr('class').replace(' active', '').replace(' finish', ''));
              });
            }
          }
          //state
          else if (state.action === 'state') {
            var element = $('.editor [model-id="' + state.id + '"]');
            if (element.length === 1) {
              //state enter
              if (state.change === 'enter') {
                element.attr('class', element.attr('class').replace(' active', '').replace(' finish', '') + ' active');
              }
              //state exit
              else if (state.change === 'exit') {
                element.attr('class', element.attr('class').replace(' active', '').replace(' finish', ''));
              }
              //state finish
              else if (state.change === 'finish') {
                element.attr('class', element.attr('class').replace(' active', '').replace(' finish', '') + ' finish');
              }
            }
          }
          //transition
          else if (state.type === 'transition') {

          }
        }

        return true;
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

            for (var i = 0; i < scope.editor.selectionElements.length; i++) {
              dragElementData.startPositions.push(scope.editor.selectionElements[i].attributes.position);
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

            if (scope.editor.selectionElements.length > 1) {
              for (var i = 0; i < scope.editor.selectionElements.length; i++) {
                if (scope.editor.selectionElements[i].id != cell.id) {
                  var pos = {
                    x: dragElementData.startPositions[i].x - (dragElementData.startPosition.x - cell.attributes.position.x),
                    y: dragElementData.startPositions[i].y - (dragElementData.startPosition.y - cell.attributes.position.y)
                  };
                  scope.editor.selectionElements[i].position(pos.x, pos.y);
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
              scope.editor.graph.getCell(cell.get("parent")).unembed(cell);
            }
          }
        },
        //mouse up
        embed: function(cellView, evt, x, y) {
          var cell = cellView.model;

          if (cell instanceof joint.dia.Element) {
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
        var gridSize = scope.editor.scale * scope.editor.grid;
        var gridVisible = scope.editor.gridVisible;

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
          width: scope.editor.size.width * scope.editor.scale,
          height: scope.editor.size.height * scope.editor.scale
        });
      };

      var updateScale = function() {
        scope.editor.paper.scale(scope.editor.scale, scope.editor.scale);
      };

      var updateGrid = function() {
        scope.editor.paper.options.gridSize = scope.editor.grid;

        $("#editor").css("backgroundImage", createGridBackground());
      };

      init();
    }
  };
});
