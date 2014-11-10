app.controller("StencilsController", function ($scope) {
    var init = function()
    {
        $scope.groups = [];

        //general elements
        var groupGeneral = $scope.addGroup("General");
        $scope.addElement(groupGeneral, new joint.shapes.statemachine.initial);
        $scope.addElement(groupGeneral, new joint.shapes.statemachine.final);
        $scope.addElement(groupGeneral, new joint.shapes.statemachine.composite);
        $scope.addElement(groupGeneral, new joint.shapes.statemachine.parallel);

        //state machine elements
        $scope.addGroup("Elements");

        //skill elements
        $scope.addGroup("State Machines");


    }

    $scope.addGroup = function(name)
    {
        var group = {
            name: name,
            stencils: []
        };

        $scope.groups.push(group);

        return group;
    }

    $scope.removeGroup = function(name)
    {
        var group = getGroup(name);
        var index = $scope.groups.indexOf(group);
        if (index > -1) {
            $scope.groups.splice(index, 1);
        }
    }

    $scope.getGroup = function(name)
    {
        for (var i = 0; i < $scope.groups.length; i++) {
            if ($scope.groups[i].name == name)
            {
                return $scope.groups[i];
            }
        }
    }

    $scope.addElement = function(group, element)
    {
        group.stencils.push(element);
    }

    init();
});

app.controller("ToolbarController", function ($scope) {
    var init = function()
    {
        $scope.scaleOptions = [0.25, 0.5, 1.0, 1.5, 2.0, 3.0];
    }

    init();
});

app.controller("EditorController", function ($scope) {
    var init = function()
    {
        $scope.debug = true;

        $scope.view = {
            selectionElements: [],
            selectionFocus: null,
            size: {
                width: 1000,
                height: 1000
            },
            scale: 1.0,
            gridVisible: true,
            grid: 10
        };

        $scope.graph = new joint.dia.Graph;
        $scope.graph.on("all", $scope.update);
    }

    $scope.addSelection = function(element)
    {
        for (var i = 0; i < $scope.view.selectionElements.length; i++) {
            if ($scope.view.selectionElements[i].id == element.id)
            {
                return;
            }
        }

        $scope.view.selectionElements.unshift(element);
    }

    $scope.removeSelection = function(element)
    {
        for (var i = 0; i < $scope.view.selectionElements.length; i++) {
            if ($scope.view.selectionElements[i].id == element.id)
            {
                $scope.view.selectionElements.splice(i, 1);

                if ($scope.view.selectionFocus.id == element.id)
                {
                    $scope.setFocus($scope.view.selectionElements[0]);
                }

                return;
            }
        }
    }

    $scope.clearSelection = function()
    {
        $scope.view.selectionElements = [];
        $scope.view.selectionFocus = null;
    }

    $scope.setFocus = function(cell)
    {
        $scope.view.selectionFocus = cell;
    }

    $scope.clearFocus = function()
    {
        $scope.view.selectionFocus = null;
    }

    $scope.update = function(eventName)
    {
        if(!$scope.$$phase && eventName != "change")
        {
            $scope.$apply();
        }
    }

    init();
});
