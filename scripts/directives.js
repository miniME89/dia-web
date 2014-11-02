app.directive("stencil", function () {
    return {
        restrict: "C",
        link: function (scope, element, attributes) {
            var init = function()
            {
                var graph = new joint.dia.Graph;
                var paper = new joint.dia.Paper({
                    el: element,
                    model: graph,
                    gridSize: 1,
                    interactive: false
                });

                graph.addCell(scope.stencil);
                scope.stencil.set({
                    position: {x: 1, y: 1}
                });
                paper.fitToContent({
                    padding: 1
                });

                element.draggable({
                    helper: "clone",
                    zIndex: 100000,
                    //appendTo: $("#editor").parent(),
                    start: $.proxy(dragStart, element),
                    stop: $.proxy(dragStop, scope.stencil)
                });

                element.popover({
                    container: "body",
                    trigger: "hover"
                });
            }

            var intersect = function(draggable, droppable)
            {
                var posDraggable = draggable.offset();
                var x1 = posDraggable.left, x2 = x1 + draggable.width(), y1 = posDraggable.top, y2 = y1 + draggable.height();

                var posDroppable = droppable.offset();
                var l = posDroppable.left, r = l + droppable.width(), t = posDroppable.top, b = t + droppable.height();

                return (l < x1 + (draggable.width() / 2) && 
                        x2 - (draggable.width() / 2) < r && 
                        t < y1 + (draggable.height() / 2) && 
                        y2 - (draggable.height() / 2) < b);
            }

            var dragStart = function(e, ui)
            {
                this.popover("hide");
            }

            var dragStop = function(e, ui)
            {
                var editorScope = angular.element($("#editor")).scope();
                var editor = $("#editor");
                var graph = editorScope.graph;
                var paper = editorScope.paper;
                var svg = $(paper.svg);
                var helper = $(ui.helper);

                //element dropped on editor SVG?
                if (intersect(helper, svg))
                {
                    var posEditor = editor.offset();
                    var pos = {
                        x: ((ui.offset.left - posEditor.left) / editor.width()) * editorScope.view.size.width,
                        y: ((ui.offset.top - posEditor.top) / editor.height()) * editorScope.view.size.height
                    };

                    pos.x = g.snapToGrid(pos.x, editorScope.view.grid);
                    pos.y = g.snapToGrid(pos.y, editorScope.view.grid);

                    var clone = this.clone();
                    clone.prop("data/someProperty", "someValue");
                    clone.prop("data/someOtherValue", 1);
                    clone.prop("data/someList", ["a", "b", "c"]);
                    clone.set({
                        position: {
                            x: pos.x,
                            y: pos.y
                        }
                    });
                    graph.addCell(clone);
                    clone.toFront();
                }
            }

            init();
        }
    };
});

app.directive("properties", function () {
    return {
        restrict: "C",
        link: function (scope, element, attributes) {
            var changeFocus = function() {
                if (scope.view.selectionFocus)
                {
                    element.html("<pre>" + JSON.stringify(scope.view.selectionFocus.prop("data"), null, 2) + "</pre>");
                    element.show();
                }
                else
                {
                    element.hide();
                }
            }

            scope.$watchCollection("view.selectionFocus", changeFocus);
        }
    };
});

app.directive("overlay", function () {
    return {
        restrict: "C",
        link: function (scope, element, attributes) {
            var menuElement = element.find(".menu");
            var transformElement = element.find(".transform");
            var selectionElement = element.find(".selection");

            var actions = {
                removeElement: function(e, scope, element)
                {
                    bootbox.confirm("Do you want to <strong>delete</strong> the selected element?", function(result) {
                        if (result)
                        {
                            scope.removeSelection(element);
                            element.remove();
                        }
                    });
                },
                cloneElement: function(e, scope, element)
                {
                    var clone = element.clone();
                    clone.translate(20, 20);

                    scope.graph.addCell(clone);

                    scope.clearSelection();
                    scope.addSelection(clone);
                    scope.setFocus(clone);
                },
                removeLinks: function(e, scope, element)
                {
                    bootbox.confirm("Do you want to <strong>remove all transitions</strong> of the selected element?", function(result) {
                        if (result)
                        {

                        }
                    });
                },
                createLink: function(e, scope, element)
                {
                    var paper = scope.paper;
                    var paperElement = $(paper.el);
                    var graph = scope.graph;

                    var link = new joint.shapes.statemachine.Arrow({
                        source: {id: element.id},
                        target: {x: 0, y: 0},
                        attrs: {}
                    });

                    graph.addCell(link);

                    var linkView = paper.findViewByModel(link);

                    var editor = $("#editor");
                    var posPaperElement = paperElement.offset();
                    var pos = {
                        x: ((e.pageX - posPaperElement.left) / editor.width()) * scope.view.size.width,
                        y: ((e.pageY - posPaperElement.top) / editor.height()) * scope.view.size.height
                    };
                    linkView.startArrowheadMove("target");
                    linkView.pointermove(e, pos.x, pos.y);

                    var drag = function(e) {
                        var pos = {
                            x: ((e.pageX - posPaperElement.left) / editor.width()) * scope.view.size.width,
                            y: ((e.pageY - posPaperElement.top) / editor.height()) * scope.view.size.height
                        };

                        pos.x = g.snapToGrid(pos.x, scope.view.grid);
                        pos.y = g.snapToGrid(pos.y, scope.view.grid);

                        linkView.pointermove(e, pos.x, pos.y);
                    }

                    var release = function(e) {
                        var posPaperElement = paperElement.offset();
                        linkView.pointerup(e);

                        paperElement.off("mousemove", drag);
                        paperElement.off("mouseup", release);
                    }

                    paperElement.on("mousemove", drag);
                    paperElement.on("mouseup", release);
                }
            };

            var actionTrigger = function(e)
            {
                e.stopPropagation();

                var action = actions[$(this).attr("data-action")];
                if (action)
                {
                    action(e, scope, scope.view.selectionFocus);
                }
            }

            var transformApply = {
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
            };

            var transformStart = function(e)
            {
                e.stopPropagation();

                var direction = $(this).attr("class");
                var selectionFocus = scope.view.selectionFocus;

                transformData = {
                    x: e.pageX,
                    y: e.pageY,
                    startPosition:{
                        x: selectionFocus.attributes.position.x,
                        y: selectionFocus.attributes.position.y
                    },
                    startSize: {
                        width: selectionFocus.attributes.size.width,
                        height: selectionFocus.attributes.size.height
                    },
                    transformApply: transformApply[direction]
                }

                var body = $("body");
                body.on("mousemove", transform);
                body.on("mouseup", transformEnd);
                body.css("cursor", $(this).css("cursor"));
                body.disableSelection();
            }

            var transformEnd = function(e)
            {
                var body = $("body");
                body.off("mousemove", transform);
                body.off("mouseup", transformEnd);
                body.css("cursor", "");
                body.enableSelection();
            }

            var transform = function(e)
            {
                var diff = {
                    x: g.snapToGrid((1 / scope.view.scale) * (transformData.x - e.pageX), scope.view.grid),
                    y: g.snapToGrid((1 / scope.view.scale) * (transformData.y - e.pageY), scope.view.grid)
                };

                var transform = transformData.transformApply(diff);

                var selectionFocus = scope.view.selectionFocus;

                selectionFocus.resize(transform.width, transform.height);
                selectionFocus.position(transform.x, transform.y);
            }

            var changeSelection = function()
            {
                if (scope.view.selectionElements.length > 0)
                {
                    selectionElement.show();
                }
                else
                {
                    selectionElement.hide();
                }

                update();
            }

            var changeFocus = function() {
                if (scope.view.selectionFocus instanceof joint.dia.Element)
                {
                    menuElement.find("[data-toggle=tooltip]").tooltip();
                    menuElement.show();
                    transformElement.show();
                }
                else
                {
                    menuElement.hide();
                    transformElement.hide();
                }

                update();
            }

            var update = function()
            {
                if (scope.view.selectionFocus instanceof joint.dia.Element)
                {
                    updateMenu();
                    updateTransform();
                }

                if (scope.view.selectionElements.length > 0)
                {
                    updateSelection();
                }
            }

            var updateMenu = function()
            {
                menuElement.css({
                    fontSize: scope.view.scale + "em",
                    left: scope.view.scale * scope.view.selectionFocus.attributes.position.x,
                    top: scope.view.scale * (scope.view.selectionFocus.attributes.position.y - 24),
                    width: scope.view.scale * scope.view.selectionFocus.attributes.size.width
                });
            }

            var updateTransform = function()
            {
                transformElement.css({
                    fontSize: scope.view.scale + "em",
                    left: scope.view.scale * scope.view.selectionFocus.attributes.position.x,
                    top: scope.view.scale * scope.view.selectionFocus.attributes.position.y,
                    width: scope.view.scale * scope.view.selectionFocus.attributes.size.width,
                    height: scope.view.scale * scope.view.selectionFocus.attributes.size.height
                });
            }

            var updateSelection = function()
            {
                var bbox = scope.graph.getBBox(scope.view.selectionElements);
                selectionElement.css({
                    left: scope.view.scale * bbox.x - 5,
                    top: scope.view.scale * bbox.y - 5,
                    width: scope.view.scale * bbox.width + 10,
                    height: scope.view.scale * bbox.height + 10
                });
            }

            transformElement.on("mousedown", "div", transformStart);
            menuElement.on("mousedown", "a", actionTrigger);

            scope.graph.on("change:position change:size", update);
            scope.$watch("view.scale", update);
            scope.$watchCollection("view.selectionElements", changeSelection);
            scope.$watch("view.selectionFocus", changeFocus);
        }
    };
});

app.directive("editor", function () {
    return {
        restrict: "C",
        controller: "EditorController",
        link: function (scope, element, attributes) {
            var dragElementStart = function(cellView, evt, x, y)
            {
                var cell = cellView.model;

                if (cell instanceof joint.dia.Element)
                {
                    dragElementData = {
                        startPosition: {
                            x: cell.attributes.position.x,
                            y: cell.attributes.position.y
                        },
                        startPositions: []
                    };

                    for (var i = 0; i < scope.view.selectionElements.length; i++)
                    {
                        dragElementData.startPositions.push(scope.view.selectionElements[i].attributes.position);
                    }

                    draggedElement = false;
                }
            }

            var dragElementEnd = function(cellView, evt, x, y)
            {
                var cell = cellView.model;

                if (cell instanceof joint.dia.Element)
                {
                    if (!evt.ctrlKey && !draggedElement)
                    {
                        scope.clearSelection();
                    }

                    scope.addSelection(cell);
                    scope.setFocus(cell);
                }
            }

            var dragElement = function(cellView, evt, x, y)
            {
                var cell = cellView.model;

                if (cell instanceof joint.dia.Element)
                {
                    draggedElement = true;

                    if (scope.view.selectionElements.length > 1)
                    {
                        for (var i = 0; i < scope.view.selectionElements.length; i++) {
                            if (scope.view.selectionElements[i].id != cell.id)
                            {
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

            var unembedElement = function(cellView, evt, x, y)
            {
                var cell = cellView.model;

                if (cell instanceof joint.dia.Element)
                {
                    //Show the dragged element above all the other cells (except when the element is a parent).
                    if (!cell.get("embeds") || cell.get("embeds").length === 0)
                    {
                        cell.toFront();
                    }

                    if (cell.get("parent"))
                    {
                        scope.graph.getCell(cell.get("parent")).unembed(cell);
                    }
                }
            }

            var embedElement = function(cellView, evt, x, y)
            {
                var cell = cellView.model;

                if (cell instanceof joint.dia.Element)
                {
                    //embed cell into cell below
                    var cellViewsBelow = scope.paper.findViewsFromPoint(cell.getBBox().center());
                    if (cellViewsBelow.length > 0)
                    {
                        //Note that the findViewsFromPoint() returns the view for the `cell` itself.
                        var cellViewBelow = _.find(cellViewsBelow, function(c) { return c.model.id !== cell.id });

                        //Prevent recursive embedding.
                        if (cellViewBelow && cellViewBelow.model.get("parent") !== cell.id)
                        {
                            cellViewBelow.model.embed(cell);
                        }
                    }
                }
            }

            var dragLinkStart = function(cellView, evt, x, y)
            {
                var cell = cellView.model;

                if (cell instanceof joint.dia.Link)
                {
                    scope.clearSelection();

                    draggedLink = false;
                }
            }

            var dragLinkEnd = function(cellView, evt, x, y)
            {
                var cell = cellView.model;

                if (cell instanceof joint.dia.Link)
                {
                    if (!draggedLink)
                    {
                        scope.setFocus(cell);
                    }
                }
            }

            var dragLink = function(cellView, evt, x, y)
            {
                var cell = cellView.model;

                if (cell instanceof joint.dia.Link)
                {
                    draggedLink = true;
                }
            }

            var dragPaperStart = function(e)
            {
                scope.clearSelection();

                dragPaperData = {
                    scrollContainer: $("#editor").parent(),
                    x: e.pageX,
                    y: e.pageY
                };

                var body = $("body");
                body.on("mousemove", dragPaper);
                body.css("cursor", "move");
                body.disableSelection();
            }

            var dragPaperEnd = function(e)
            {
                var body = $("body");
                body.off("mousemove", dragPaper);
                body.css("cursor", "");
                body.enableSelection();
            }

            var dragPaper = function(e)
            {
                dragPaperData.scrollContainer.scrollLeft(dragPaperData.scrollContainer.scrollLeft() - (e.pageX - dragPaperData.x));
                dragPaperData.scrollContainer.scrollTop(dragPaperData.scrollContainer.scrollTop() - (e.pageY - dragPaperData.y));

                dragPaperData.x = e.pageX;
                dragPaperData.y = e.pageY;
            }

            var createGridBackground = function()
            {
                var gridSize = scope.view.scale * scope.view.grid;
                var gridVisible = scope.view.gridVisible;

                if (!gridVisible || gridSize < 10)
                {
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
            }

            var updateSize = function()
            {
                $("#editor").css({
                    width: scope.view.size.width * scope.view.scale,
                    height: scope.view.size.height * scope.view.scale
                });
            }

            var updateScale = function()
            {
                scope.paper.scale(scope.view.scale, scope.view.scale);
            }

            var updateGrid = function()
            {
                scope.paper.options.gridSize = scope.view.grid;

                $("#editor").css("backgroundImage", createGridBackground());
            }

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
            scope.paper.on("cell:pointerdown", dragElementStart);
            scope.paper.on("cell:pointerup", dragElementEnd);
            scope.paper.on("cell:pointermove", dragElement);
            scope.paper.on("cell:pointerdown", unembedElement);
            scope.paper.on("cell:pointerup", embedElement);

            //link actions
            scope.paper.on("cell:pointerdown", dragLinkStart);
            scope.paper.on("cell:pointerup", dragLinkEnd);
            scope.paper.on("cell:pointermove", dragLink);

            //paper actions
            scope.paper.on("blank:pointerdown", dragPaperStart);
            scope.paper.on("blank:pointerup", dragPaperEnd);
        }
    };
});
