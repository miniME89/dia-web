var SMDLTransformation = {
  toSMDL: function(statemachine) {
    var encode = {
      children: function(element, parentNode) {
        var children = element.children;
        if (children) {
          var childrenNode = document.createElement('childs');

          for (var i = 0; i < children.length; i++) {
            var childElement = children[i];
            var type = childElement.type.replace(/^statemachine\./, '');

            var childElementNode = encode[type](childElement, parentNode);

            if (childElementNode) {
              encode['input'](childElement, childElementNode);
              encode['output'](childElement, childElementNode);
              encode['dataflows'](childElement, childElementNode);
              encode['transitions'](childElement, childElementNode);
              encode['children'](childElement, childElementNode)

              childrenNode.appendChild(childElementNode);
            }
          }

          parentNode.appendChild(childrenNode);
        }
      },
      transitions: function(element, node) {
        var transitions = element.transitions;
        if (transitions) {
          var transitionsNode = document.createElement('transitions');

          for (var i = 0; i < transitions.length; i++) {
            var transition = transitions[i];
            var transitionNode = document.createElement('transition');

            var eventAttribute = document.createAttribute('event');
            eventAttribute.value = transition.event || '';
            transitionNode.setAttributeNode(eventAttribute);

            var conditionAttribute = document.createAttribute('condition');
            conditionAttribute.value = transition.condition || '';
            transitionNode.setAttributeNode(conditionAttribute);

            var targetAttribute = document.createAttribute('target');
            targetAttribute.value = transition.target.id;
            transitionNode.setAttributeNode(targetAttribute);

            transitionsNode.appendChild(transitionNode);
          }

          node.appendChild(transitionsNode);
        }
      },
      input: function(element, node) {
        var input = element.parameters.input;
        if (input) {
          var inputNode = document.createElement('input');

          for (var key in input) {
            inputNode.appendChild(encode['values'](input[key], input[key].name));
          }

          node.appendChild(inputNode);
        }
      },
      output: function(element, node) {
        var output = element.parameters.output;
        if (output) {
          var outputNode = document.createElement('output');

          for (var key in output) {
            outputNode.appendChild(encode['values'](output[key], output[key].name));
          }

          node.appendChild(outputNode);
        }
      },
      dataflows: function(element, node) {
        var dataflows = element.dataflows;
        if (dataflows) {
          var dataflowsNode = document.createElement('dataflows');

          for (var i = 0; i < dataflows.length; i++) {
            var dataflow = dataflows[i];
            var dataflowNode = document.createElement('dataflow');

            var sourceAttribute = document.createAttribute('source');
            sourceAttribute.value = dataflow.source || '';
            dataflowNode.setAttributeNode(sourceAttribute);

            var fromAttribute = document.createAttribute('from');
            fromAttribute.value = dataflow.from || '';
            dataflowNode.setAttributeNode(fromAttribute);

            var toAttribute = document.createAttribute('to');
            toAttribute.value = dataflow.to || '';
            dataflowNode.setAttributeNode(toAttribute);

            dataflowsNode.appendChild(dataflowNode);
          }

          node.appendChild(dataflowsNode);
        }

        return dataflowsNode;
      },
      values: function(obj, key) {
        var valueNode = document.createElement('value');

        if (typeof key !== 'undefined') {
          var nameAttribute = document.createAttribute('name');
          nameAttribute.value = key;
          valueNode.setAttributeNode(nameAttribute);
        }

        var typeAttribute = document.createAttribute('type');
        typeAttribute.value = obj.type;
        valueNode.setAttributeNode(typeAttribute);

        if (typeAttribute.value === 'Array') {
          for (var i = 0; i < obj.value.length; i++) {
            valueNode.appendChild(encode['values'](obj.value[i]));
          }
        }
        else if (typeAttribute.value === 'Object') {
          for (var key in obj.value) {
            valueNode.appendChild(encode['values'](obj.value[key], obj.value[key].name));
          }
        }
        else {
          var textNode = document.createTextNode(obj.value);
          valueNode.appendChild(textNode);
        }

        return valueNode;
      },
      statemachine: function(element, parentNode) {
        var node = document.createElement('statemachine');

        var idAttribute = document.createAttribute('id');
        idAttribute.value = element.id;
        node.setAttributeNode(idAttribute);

        return node;
      },
      composite: function(element, parentNode) {
        var node = document.createElement('composite');

        var idAttribute = document.createAttribute('id');
        idAttribute.value = element.id;
        node.setAttributeNode(idAttribute);

        return node;
      },
      parallel: function(element, parentNode) {
        var node = document.createElement('parallel');

        var idAttribute = document.createAttribute('id');
        idAttribute.value = element.id;
        node.setAttributeNode(idAttribute);

        return node;
      },
      invoke: function(element, parentNode) {
        var node = document.createElement('invoke');

        var idAttribute = document.createAttribute('id');
        idAttribute.value = element.id;
        node.setAttributeNode(idAttribute);

        var endpointNode = document.createElement('endpoint');
        for (var key in element.endpoint) {
          endpointNode.appendChild(encode['values'](element.endpoint[key], element.endpoint[key].name));
        }
        node.appendChild(endpointNode);

        var bindingAttribute = document.createAttribute('binding');
        bindingAttribute.value = element.binding;
        endpointNode.setAttributeNode(bindingAttribute);

        return node;
      },
      initial: function(element, parentNode) {
        var transitions = element.transitions;
        if (transitions && transitions.length > 0) {
          var initialAttribute = document.createAttribute('initial');
          initialAttribute.value = transitions[0].target.id;
          parentNode.setAttributeNode(initialAttribute);
        }
      },
      final: function(element, parentNode) {
        var node = document.createElement('final');

        var idAttribute = document.createAttribute('id');
        idAttribute.value = element.id;
        node.setAttributeNode(idAttribute);

        return node;
      }
    };

    console.log(statemachine)
    var smdl = document.createElement("statemachine");

    encode['children'](statemachine, smdl);

    return smdl;
  },
  fromSMDL: function() {

  }
}