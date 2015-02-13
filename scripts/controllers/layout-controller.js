app.controller("LayoutController", function($scope, LayoutService) {
  var init = function() {
    $scope.loadLayout();
  }

  $scope.loadDefaultLayout = function() {
    $scope.layout = LayoutService.loadDefault();
  };

  $scope.loadLayout = function() {
    $scope.layout = LayoutService.load();
  };

  $scope.saveLayout = function() {
    LayoutService.save($scope.layout);
  };

  $scope.saveXml = function() {
    var parse = {
      children: function(children) {
        var node = document.createElement('childs');
        if (children) {
          for (var i = 0; i < children.length; i++) {
            var type = children[i].type.replace(/^statemachine\./, '');

            node.appendChild(parse[type](children[i]));
          }
        }

        return node;
      },
      transitions: function(transitions) {
        var node = document.createElement('transitions');
        if (transitions) {
          for (var i = 0; i < transitions.length; i++) {
            var transitionNode = document.createElement('transition');

            var eventAttribute = document.createAttribute('event');
            eventAttribute.value = transitions[i].event || '';
            transitionNode.setAttributeNode(eventAttribute);

            var targetAttribute = document.createAttribute('target');
            targetAttribute.value = transitions[i].target.id;
            transitionNode.setAttributeNode(targetAttribute);

            node.appendChild(transitionNode);
          }
        }

        return node;
      },
      statemachine: function(element) {
        var node = document.createElement('statemachine');
        var id = element.id;

        node.appendChild(parse['children'](element.children));
        node.appendChild(parse['transitions'](element.transitions));

        return node;
      },
      composite: function(element) {
        var node = document.createElement('composite');
        var id = element.id;

        node.appendChild(parse['children'](element.children));
        node.appendChild(parse['transitions'](element.transitions));

        return node;
      },
      parallel: function(element) {
        var node = document.createElement('parallel');
        var id = element.id;

        node.appendChild(parse['children'](element.children));
        node.appendChild(parse['transitions'](element.transitions));

        return node;
      },
      invoke: function(element) {
        var node = document.createElement('invoke');
        var id = element.id;

        node.appendChild(parse['children'](element.children));
        node.appendChild(parse['transitions'](element.transitions));

        return node;
      },
      initial: function(element) {
        var node = document.createElement('initial');
        var id = element.id;

        node.appendChild(parse['children'](element.children));
        node.appendChild(parse['transitions'](element.transitions));

        return node;
      },
      final: function(element) {
        var node = document.createElement('final');
        var id = element.id;

        node.appendChild(parse['children'](element.children));
        node.appendChild(parse['transitions'](element.transitions));

        return node;
      }
    };

    var cells = $scope.graph.toJSONTree();
    var xml = document.createElement("statemachine");
    xml.appendChild(parse['children'](cells));
    console.log(xml);
  };

  $scope.$watch('layout', function(newValue, oldValue) {
    $scope.saveLayout(newValue);
  }, true);

  init();
});
