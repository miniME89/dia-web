joint.shapes.statemachine = {};

joint.shapes.statemachine.initial = joint.dia.Element.extend({

    markup: '<g class="rotatable"><g class="scalable"><circle/></g></g>',

    defaults: joint.util.deepSupplement({

        type: "statemachine.initial",
        size: { width: 20, height: 20 },
        attrs: {
            circle: {
                transform: "translate(10, 10)",
                r: 10,
                fill: "black"
            }
        },
        menu: [
            {
                visible: true,
                icon: "fa fa-times fa-lg",
                title: "Delete",
                action: "removeElement"
            },
            {
                visible: true,
                icon: "fa fa-unlink fa-lg",
                title: "Delete Transitions",
                action: "removeLinks"
            }
        ]

    }, joint.dia.Element.prototype.defaults)
});

joint.shapes.statemachine.initial.prototype.info = {
    name: "Initial",
    description: "some description some description some description some description some description"
}

joint.shapes.statemachine.final = joint.dia.Element.extend({

    markup: '<g class="rotatable"><g class="scalable"><circle class="outer"/><circle class="inner"/></g></g>',

    defaults: joint.util.deepSupplement({

        type: "statemachine.final",
        size: { width: 20, height: 20 },
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
        menu: [
            {
                visible: true,
                icon: "fa fa-times fa-lg",
                title: "Delete",
                action: "removeElement"
            },
            {
                visible: true,
                icon: "fa fa-unlink fa-lg",
                title: "Delete Transitions",
                action: "removeLinks"
            }
        ]

    }, joint.dia.Element.prototype.defaults)
});

joint.shapes.statemachine.final.prototype.info = {
    name: "Final",
    description: "some description some description some description some description some description"
}

joint.shapes.statemachine.composite = joint.dia.Element.extend({

    markup: '<g class="rotatable"><g class="scalable"><polygon class="outer"/></g><text/></g>',

    defaults: joint.util.deepSupplement({

        type: "statemachine.composite",
        size: { width: 100, height: 60 },
        attrs: {
            ".outer": {
                fill: "#dddddd", stroke: "#AAAAAA", "stroke-width": 1,
                points: "100,0 100,60 0,60 0,0"
            },
            text: {
                text: "Composite",
                ref: ".outer", "ref-x": .5, "ref-y": .5, "x-alignment": "middle", "y-alignment": "middle"
            },
        },
        menu: [
            {
                visible: true,
                icon: "fa fa-times fa-lg",
                title: "Delete",
                action: "removeElement"
            },
            {
                visible: true,
                icon: "fa fa-plus-square-o fa-lg",
                title: "Clone",
                action: "cloneElement"
            },
            {
                visible: true,
                icon: "fa fa-unlink fa-lg",
                title: "Delete Transitions",
                action: "removeLinks"
            }
        ]

    }, joint.dia.Element.prototype.defaults)
});

joint.shapes.statemachine.composite.prototype.info = {
    name: "Composite",
    description: "some description some description some description some description some description"
}

joint.shapes.statemachine.parallel = joint.dia.Element.extend({

    markup: '<g class="rotatable"><g class="scalable"><polygon class="outer"/></g><text/></g>',

    defaults: joint.util.deepSupplement({

        type: "statemachine.parallel",
        size: { width: 100, height: 60 },
        attrs: {
            ".outer": {
                fill: "#dddddd", stroke: "#AAAAAA", "stroke-width": 1,
                points: "100,0 100,60 0,60 0,0"
            },
            text: {
                text: "Parallel",
                ref: ".outer", "ref-x": .5, "ref-y": .5, "x-alignment": "middle", "y-alignment": "middle"
            },
        },
        menu: [
            {
                visible: true,
                icon: "fa fa-times fa-lg",
                title: "Delete",
                action: "removeElement"
            },
            {
                visible: true,
                icon: "fa fa-plus-square-o fa-lg",
                title: "Clone",
                action: "cloneElement"
            },
            {
                visible: true,
                icon: "fa fa-unlink fa-lg",
                title: "Delete Transitions",
                action: "removeLinks"
            },
            {
                visible: true,
                icon: "fa fa-link fa-lg",
                title: "Create Transition",
                action: "createLink"
            }
        ]

    }, joint.dia.Element.prototype.defaults)
});

joint.shapes.statemachine.parallel.prototype.info = {
    name: "Parallel",
    description: "some description some description some description some description some description"
}

joint.shapes.statemachine.Arrow = joint.dia.Link.extend({
    arrowheadMarkup: [
        '<g class="marker-arrowhead-group marker-arrowhead-group-<%= end %>">',
        '<circle class="marker-arrowhead" end="<%= end %>" r="7"/>',
        '</g>'
    ].join(''),
    defaults: joint.util.deepSupplement({
        type: "statemachine.Arrow",
        attrs: {
            ".marker-target": {
                d: "M 10 0 L 0 5 L 10 10 z"
            }
        },
    //router: { name: 'manhattan' },
    connector: { name: 'rounded' }
    }, joint.dia.Link.prototype.defaults)
});
