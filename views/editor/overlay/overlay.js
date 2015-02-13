app.directive("overlay", function() {
  return {
    restrict: "C",
    templateUrl: 'views/editor/overlay/overlay.html',
    link: function(scope, element, attributes) {
      var menuElement = element.find(".menu");
      var transformElement = element.find(".transform");
      var selectionElement = element.find(".selection");
      var selectionBounds = null;

      var init = function() {
        //transform buttons
        transformElement.on("mousedown", "div", transform.start);

        //events
        scope.graph.on("change:position", changePosition);
        scope.graph.on("change:size", changeSize);
        scope.$watch("view.scale", changeScale);
        scope.$watch("view.selectionFocus", changeFocus);
        scope.$watchCollection("view.selectionElements", changeSelection);
      };

      var transform = {
        transformApply: {
          tl: function(diff) {
            return {
              width: transformData.startSize.width + diff.x,
              height: transformData.startSize.height + diff.y,
              x: transformData.startPosition.x - diff.x,
              y: transformData.startPosition.y - diff.y
            };
          },
          tr: function(diff) {
            return {
              width: transformData.startSize.width - diff.x,
              height: transformData.startSize.height + diff.y,
              x: transformData.startPosition.x,
              y: transformData.startPosition.y - diff.y,
            };
          },
          bl: function(diff) {
            return {
              width: transformData.startSize.width + diff.x,
              height: transformData.startSize.height - diff.y,
              x: transformData.startPosition.x - diff.x,
              y: transformData.startPosition.y,
            };
          },
          br: function(diff) {
            return {
              width: transformData.startSize.width - diff.x,
              height: transformData.startSize.height - diff.y,
              x: transformData.startPosition.x,
              y: transformData.startPosition.y,
            };
          }
        },
        start: function(e) {
          e.stopPropagation();

          var direction = $(this).attr("class");
          var selectionFocus = scope.view.selectionFocus;

          transformData = {
            x: e.pageX,
            y: e.pageY,
            startPosition: {
              x: selectionFocus.attributes.position.x,
              y: selectionFocus.attributes.position.y
            },
            startSize: {
              width: selectionFocus.attributes.size.width,
              height: selectionFocus.attributes.size.height
            },
            transformApply: transform.transformApply[direction]
          }

          var body = $("body");
          body.on("mousemove", transform.drag);
          body.on("mouseup", transform.end);
          body.css("cursor", $(this).css("cursor"));
        },
        end: function(e) {
          var body = $("body");
          body.off("mousemove", transform.drag);
          body.off("mouseup", transform.end);
          body.css("cursor", "");
        },
        drag: function(e) {
          var diff = {
            x: g.snapToGrid((1 / scope.view.scale) * (transformData.x - e.pageX), scope.view.grid),
            y: g.snapToGrid((1 / scope.view.scale) * (transformData.y - e.pageY), scope.view.grid)
          };

          var transform = transformData.transformApply(diff);

          var selectionFocus = scope.view.selectionFocus;

          selectionFocus.position(transform.x, transform.y);
          selectionFocus.resize(transform.width, transform.height);
        }
      };

      var changeScale = function() {
        changeSize();
        changePosition(scope.view.selectionFocus);
      };

      var changeFocus = function() {
        if (scope.view.selectionFocus instanceof joint.dia.Element) {
          menuElement.find("[data-toggle=tooltip]").tooltip();
          menuElement.show();
          transformElement.show();
        } else {
          menuElement.hide();
          transformElement.hide();
        }

        changeSize();
        changePosition(scope.view.selectionFocus);
      };

      var changeSelection = function() {
        if (scope.view.selectionElements.length > 0) {
          selectionElement.show();
        } else {
          selectionElement.hide();
        }

        changeSize();
        changePosition(scope.view.selectionFocus);
      };

      var changeSize = function() {
        if (scope.view.selectionFocus instanceof joint.dia.Element) {
          selectionBounds = scope.graph.getBBox(scope.view.selectionElements);

          if (scope.view.selectionFocus instanceof joint.dia.Element) {
            selectionBounds.startPosition = {
              x: scope.view.selectionFocus.attributes.position.x,
              y: scope.view.selectionFocus.attributes.position.y
            };
          }

          changePosition(scope.view.selectionFocus);
        }
      };

      var changePosition = function(cell) {
        if (!scope.view.selectionFocus || !cell) {
          return;
        }

        if (cell.id != scope.view.selectionFocus.id) {
          return;
        }

        if (scope.view.selectionFocus instanceof joint.dia.Element) {
          //update menu
          menuElement.css({
            fontSize: scope.view.scale + "em",
            left: scope.view.scale * scope.view.selectionFocus.attributes.position.x,
            top: scope.view.scale * (scope.view.selectionFocus.attributes.position.y - 24),
            width: scope.view.scale * scope.view.selectionFocus.attributes.size.width
          });

          //update transform
          transformElement.css({
            fontSize: scope.view.scale + "em",
            left: scope.view.scale * scope.view.selectionFocus.attributes.position.x,
            top: scope.view.scale * scope.view.selectionFocus.attributes.position.y,
            width: scope.view.scale * scope.view.selectionFocus.attributes.size.width,
            height: scope.view.scale * scope.view.selectionFocus.attributes.size.height
          });
        }

        if (scope.view.selectionElements.length > 0) {
          var diff = {
            x: (selectionBounds.startPosition.x - scope.view.selectionFocus.attributes.position.x),
            y: (selectionBounds.startPosition.y - scope.view.selectionFocus.attributes.position.y)
          };

          //update selection
          selectionElement.css({
            left: scope.view.scale * (selectionBounds.x - diff.x) - 5,
            top: scope.view.scale * (selectionBounds.y - diff.y) - 5,
            width: scope.view.scale * selectionBounds.width + 10,
            height: scope.view.scale * selectionBounds.height + 10
          });
        }
      };

      init();
    }
  };
});
