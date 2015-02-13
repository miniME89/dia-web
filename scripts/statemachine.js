joint.shapes.statemachine = {};

joint.shapes.statemachine.menuActions = {
  removeElement: function(e, scope, element) {
    bootbox.confirm("Do you want to <strong>delete</strong> the selected element?", function(result) {
      if (result) {
        scope.removeSelection(element);
        element.remove();
      }
    });
  },
  cloneElement: function(e, scope, element) {
    var clone = element.clone();
    clone.translate(20, 20);

    scope.graph.addCell(clone);

    scope.clearSelection();
    scope.addSelection(clone);
    scope.setFocus(clone);
  },
  removeLinks: function(e, scope, element) {
    bootbox.confirm("Do you want to <strong>remove all transitions</strong> of the selected element?", function(result) {
      if (result) {

      }
    });
  },
  createTransition: function(e, scope, element) {
    var paper = scope.paper;
    var paperElement = $(paper.el);
    var graph = scope.graph;

    var link = new joint.shapes.statemachine.Transition({
      source: {
        id: element.id
      },
      target: {
        x: 0,
        y: 0
      },
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

joint.shapes.statemachine.initial = joint.dia.Element.extend({

  markup: '<g class="rotatable"><g class="scalable"><circle/></g></g>',

  defaults: joint.util.deepSupplement({

    type: "statemachine.initial",
    size: {
      width: 20,
      height: 20
    },
    attrs: {
      circle: {
        transform: "translate(10, 10)",
        r: 10,
        fill: "black"
      }
    },
    resizable: false,
    menu: [{
      visible: true,
      icon: "fa fa-times fa-lg",
      title: "Delete",
      action: joint.shapes.statemachine.menuActions.removeElement
    }, {
      visible: true,
      icon: "fa fa-unlink fa-lg",
      title: "Delete Transitions",
      action: joint.shapes.statemachine.menuActions.removeLinks
    }]

  }, joint.dia.Element.prototype.defaults)
});

joint.shapes.statemachine.final = joint.dia.Element.extend({

  markup: '<g class="rotatable"><g class="scalable"><circle class="outer"/><circle class="inner"/></g></g>',

  defaults: joint.util.deepSupplement({

    type: "statemachine.final",
    size: {
      width: 20,
      height: 20
    },
    attrs: {
      ".outer": {
        transform: "translate(10, 10)",
        r: 10,
        fill: "#FFFFFF",
        stroke: "black"
      },

      ".inner": {
        transform: "translate(10, 10)",
        r: 6,
        fill: "#000000"
      }
    },
    resizable: false,
    menu: [{
      visible: true,
      icon: "fa fa-times fa-lg",
      title: "Delete",
      action: joint.shapes.statemachine.menuActions.removeElement
    }, {
      visible: true,
      icon: "fa fa-unlink fa-lg",
      title: "Delete Transitions",
      action: joint.shapes.statemachine.menuActions.removeLinks
    }]

  }, joint.dia.Element.prototype.defaults)
});

joint.shapes.statemachine.composite = joint.dia.Element.extend({

  markup: '<g class="rotatable"><g class="scalable"><polygon class="outer"/></g><text/></g>',

  defaults: joint.util.deepSupplement({

    type: "statemachine.composite",
    size: {
      width: 100,
      height: 60
    },
    attrs: {
      ".outer": {
        fill: "#dddddd",
        stroke: "#AAAAAA",
        "stroke-width": 1,
        points: "100,0 100,60 0,60 0,0"
      },
      text: {
        text: "Composite",
        ref: ".outer",
        "ref-x": .5,
        "ref-y": .5,
        "x-alignment": "middle",
        "y-alignment": "middle"
      },
    },
    resizable: true,
    menu: [{
      visible: true,
      icon: "fa fa-times fa-lg",
      title: "Delete",
      action: joint.shapes.statemachine.menuActions.removeElement
    }, {
      visible: true,
      icon: "fa fa-plus-square-o fa-lg",
      title: "Clone",
      action: joint.shapes.statemachine.menuActions.cloneElement
    }, {
      visible: true,
      icon: "fa fa-unlink fa-lg",
      title: "Delete Transitions",
      action: joint.shapes.statemachine.menuActions.removeLinks
    }]

  }, joint.dia.Element.prototype.defaults)
});

joint.shapes.statemachine.parallel = joint.dia.Element.extend({

  markup: '<g class="rotatable"><g class="scalable"><polygon class="outer"/></g><text/></g>',

  defaults: joint.util.deepSupplement({

    type: "statemachine.parallel",
    size: {
      width: 100,
      height: 60
    },
    attrs: {
      ".outer": {
        fill: "#dddddd",
        stroke: "#AAAAAA",
        "stroke-width": 1,
        points: "100,0 100,60 0,60 0,0"
      },
      text: {
        text: "Parallel",
        ref: ".outer",
        "ref-x": .5,
        "ref-y": .5,
        "x-alignment": "middle",
        "y-alignment": "middle"
      },
    },
    resizable: true,
    menu: [{
      visible: true,
      icon: "fa fa-times fa-lg",
      title: "Delete",
      action: joint.shapes.statemachine.menuActions.removeElement
    }, {
      visible: true,
      icon: "fa fa-plus-square-o fa-lg",
      title: "Clone",
      action: joint.shapes.statemachine.menuActions.cloneElement
    }, {
      visible: true,
      icon: "fa fa-unlink fa-lg",
      title: "Delete Transitions",
      action: joint.shapes.statemachine.menuActions.removeLinks
    }, {
      visible: true,
      icon: "fa fa-link fa-lg",
      title: "Create Transition",
      action: joint.shapes.statemachine.menuActions.createTransition
    }]

  }, joint.dia.Element.prototype.defaults)
});

joint.shapes.statemachine.invoke = joint.dia.Element.extend({

  markup: '<g class="rotatable"><g class="scalable"><polygon class="outer"/></g><text/></g>',

  defaults: joint.util.deepSupplement({

    type: "statemachine.invoke",
    size: {
      width: 100,
      height: 60
    },
    attrs: {
      ".outer": {
        fill: "#dddddd",
        stroke: "#AAAAAA",
        "stroke-width": 1,
        points: "100,0 100,60 0,60 0,0"
      },
      text: {
        text: "Invoke",
        ref: ".outer",
        "ref-x": .5,
        "ref-y": .5,
        "x-alignment": "middle",
        "y-alignment": "middle"
      },
    },
    resizable: true,
    menu: [{
      visible: true,
      icon: "fa fa-times fa-lg",
      title: "Delete",
      action: joint.shapes.statemachine.menuActions.removeElement
    }, {
      visible: true,
      icon: "fa fa-plus-square-o fa-lg",
      title: "Clone",
      action: joint.shapes.statemachine.menuActions.cloneElement
    }, {
      visible: true,
      icon: "fa fa-unlink fa-lg",
      title: "Delete Transitions",
      action: joint.shapes.statemachine.menuActions.removeLinks
    }]

  }, joint.dia.Element.prototype.defaults)
});

joint.shapes.statemachine.Transition = joint.dia.Link.extend({
  arrowheadMarkup: [
    '<g class="marker-arrowhead-group marker-arrowhead-group-<%= end %>">',
    '<circle class="marker-arrowhead" end="<%= end %>" r="7"/>',
    '</g>'
  ].join(''),
  defaults: joint.util.deepSupplement({
    type: "statemachine.Transition",
    attrs: {
      ".marker-target": {
        d: "M 10 0 L 0 5 L 10 10 z"
      }
    },
    //router: { name: 'manhattan' },
    connector: {
      name: 'rounded'
    }
  }, joint.dia.Link.prototype.defaults)
});

joint.dia.Graph.prototype.toJSONTree = function() {
  var cells = this.toJSON().cells;
  var root = [];
  for (var i = 0; i < cells.length; i++) {
    //transition
    if (cells[i].type == 'statemachine.Transition') {
      //find source
      for (var j = 0; j < cells.length; j++) {
        if (cells[i].source.id === cells[j].id) {
          cells[j].transitions = cells[j].transitions || [];
          cells[j].transitions.push(cells[i]);
        }
      }
    }
    //state with parent
    else if (cells[i].parent) {
      //find parent
      for (var j = 0; j < cells.length; j++) {
        if (cells[i].parent === cells[j].id) {
          cells[j].children = cells[j].children || [];
          cells[j].children.push(cells[i]);
        }
      }
    }
    //root state
    else {
      root.push(cells[i]);
    }
  }

  return root;
}
