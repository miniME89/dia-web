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

    scope.editor.graph.addCell(clone);

    scope.clearSelection();
    scope.addSelection(clone);
    scope.setFocus(clone);
  },
  createTransition: function(e, scope, element) {
    var paper = scope.editor.paper;
    var paperElement = $(paper.el);
    var graph = scope.editor.graph;

    var link = new joint.shapes.statemachine.transition({
      source: {
        id: element.id
      },
      target: {
        x: 0,
        y: 0
      },
      event: '',
      condition: ''
    });

    graph.addCell(link);

    var linkView = paper.findViewByModel(link);

    var editor = $("#editor");
    var posPaperElement = paperElement.offset();
    var pos = {
      x: ((e.pageX - posPaperElement.left) / editor.width()) * scope.editor.size.width,
      y: ((e.pageY - posPaperElement.top) / editor.height()) * scope.editor.size.height
    };
    linkView.startArrowheadMove("target");
    linkView.pointermove(e, pos.x, pos.y);

    var drag = function(e) {
      var pos = {
        x: ((e.pageX - posPaperElement.left) / editor.width()) * scope.editor.size.width,
        y: ((e.pageY - posPaperElement.top) / editor.height()) * scope.editor.size.height
      };

      pos.x = g.snapToGrid(pos.x, scope.editor.grid);
      pos.y = g.snapToGrid(pos.y, scope.editor.grid);

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
  markup: '<g class="rotatable">' +
            '<g class="scalable">' +
              '<circle cx="10" cy="10" r="10" />' +
            '</g>' +
          '</g>',
  defaults: joint.util.deepSupplement({
    type: "statemachine.initial",
    size: {
      width: 20,
      height: 20
    },
    resizable: false,
    menu: [{
      visible: true,
      icon: "fa fa-times fa-lg",
      title: "Delete",
      action: joint.shapes.statemachine.menuActions.removeElement
    }, {
      visible: true,
      icon: "fa fa-link fa-lg",
      title: "Create Transition",
      action: joint.shapes.statemachine.menuActions.createTransition
    }]
  }, joint.dia.Element.prototype.defaults)
});

joint.shapes.statemachine.final = joint.dia.Element.extend({
  markup: '<g class="rotatable">' +
            '<g class="scalable">' +
              '<circle cx="10" cy="10" r="10" fill="#fff" stroke="#000" stroke-width="2" />' +
              '<circle cx="10" cy="10" r="7" />' +
            '</g>' +
          '</g>',
  defaults: joint.util.deepSupplement({
    type: "statemachine.final",
    size: {
      width: 20,
      height: 20
    },
    resizable: false,
    menu: [{
      visible: true,
      icon: "fa fa-times fa-lg",
      title: "Delete",
      action: joint.shapes.statemachine.menuActions.removeElement
    }]
  }, joint.dia.Element.prototype.defaults)
});

joint.shapes.statemachine.composite = joint.dia.Element.extend({
  markup: '<g class="rotatable">' +
            '<g class="scalable">' +
              '<rect width="1" height="1" />' +
            '</g>' +
            '<image width="30" height="30" xlink:href="images/state-composite.png" />' +
            '<text font-weight="bold" y="15">Composite</text>' +
          '</g>',
  defaults: joint.util.deepSupplement({
    type: "statemachine.composite",
    size: {
      width: 100,
      height: 70
    },
    attrs: {
      image: {
        ref: 'rect',
        'ref-x': .5,
        'ref-y': .5,
        'y-alignment': 'middle',
        'x-alignment': 'middle'
      },
      text: {
        ref: 'rect',
        'ref-x': .5,
        'x-alignment': 'middle'
      }
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
      icon: "fa fa-link fa-lg",
      title: "Create Transition",
      action: joint.shapes.statemachine.menuActions.createTransition
    }]
  }, joint.dia.Element.prototype.defaults)
});

joint.shapes.statemachine.parallel = joint.dia.Element.extend({
  markup: '<g class="rotatable">' +
            '<g class="scalable">' +
              '<rect width="1" height="1" />' +
            '</g>' +
            '<image width="30" height="30" xlink:href="images/state-parallel.png" />' +
            '<text font-weight="bold" y="15">Parallel</text>' +
          '</g>',
  defaults: joint.util.deepSupplement({
    type: "statemachine.parallel",
    size: {
      width: 100,
      height: 70
    },
    attrs: {
      image: {
        ref: 'rect',
        'ref-x': .5,
        'ref-y': .5,
        'y-alignment': 'middle',
        'x-alignment': 'middle'
      },
      text: {
        ref: 'rect',
        'ref-x': .5,
        'x-alignment': 'middle'
      }
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
      icon: "fa fa-link fa-lg",
      title: "Create Transition",
      action: joint.shapes.statemachine.menuActions.createTransition
    }]
  }, joint.dia.Element.prototype.defaults)
});

joint.shapes.statemachine.invoke = joint.dia.Element.extend({
  markup: '<g class="rotatable">' +
            '<g class="scalable">' +
              '<rect width="1" height="1" />' +
            '</g>' +
            '<image width="25" height="25" xlink:href="images/state-invoke.png" />' +
          '</g>',
  defaults: joint.util.deepSupplement({
    type: "statemachine.invoke",
    size: {
      width: 62,
      height: 40
    },
    attrs: {
      image: {
        ref: 'rect',
        'ref-x': .5,
        'ref-y': .5,
        'y-alignment': 'middle',
        'x-alignment': 'middle'
      },
      text: {
        ref: 'rect',
        'ref-x': .5,
        'x-alignment': 'middle'
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
      icon: "fa fa-plus-square-o fa-lg",
      title: "Clone",
      action: joint.shapes.statemachine.menuActions.cloneElement
    }, {
      visible: true,
      icon: "fa fa-link fa-lg",
      title: "Create Transition",
      action: joint.shapes.statemachine.menuActions.createTransition
    }]
  }, joint.dia.Element.prototype.defaults)
});

joint.shapes.statemachine.transition = joint.dia.Link.extend({
  arrowheadMarkup:'<g class="marker-arrowhead-group marker-arrowhead-group-<%= end %>">' +
                    '<circle class="marker-arrowhead" end="<%= end %>" r="7"/>' +
                  '</g>',
  defaults: joint.util.deepSupplement({
    type: "statemachine.transition",
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
  var root = {};
  root.children = [];
  for (var i = 0; i < cells.length; i++) {
    //transition
    if (cells[i].type == 'statemachine.transition') {
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
      root.children.push(cells[i]);
    }
  }

  return root;
}

//hack to prevent adding vertices on links through user interaction
joint.dia.LinkView.prototype.addVertex = function() {};
joint.dia.LinkView.prototype.pointermoveOriginal = joint.dia.LinkView.prototype.pointermove;
joint.dia.LinkView.prototype.pointermove = function(evt, x, y) {
  if (this._action === 'vertex-move') {
    this._action = '';
  }
  this.pointermoveOriginal(evt, x, y);
};
