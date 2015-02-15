var SMDLTransformation = {
  toSMDL: function(statemachine) {
    var encode = {
      children: function(element) {
        var childrenNode = document.createElement('childs');
        var children = element.children;
        if (children) {
          for (var i = 0; i < children.length; i++) {
            var childElement = children[i];
            var type = childElement.type.replace(/^statemachine\./, '');

            var childElementNode = encode[type](childElement);

            childElementNode.appendChild(encode['input'](childElement));
            childElementNode.appendChild(encode['output'](childElement));
            childElementNode.appendChild(encode['dataflows'](childElement));
            childElementNode.appendChild(encode['transitions'](childElement));
            childElementNode.appendChild(encode['children'](childElement))

            childrenNode.appendChild(childElementNode);
          }
        }

        return childrenNode;
      },
      transitions: function(element) {
        var transitionsNode = document.createElement('transitions');
        var transitions = element.transitions;
        if (transitions) {
          for (var i = 0; i < transitions.length; i++) {
            var transition = transitions[i];
            var transitionNode = document.createElement('transition');

            var eventAttribute = document.createAttribute('event');
            eventAttribute.value = transition.event || '';
            transitionNode.setAttributeNode(eventAttribute);

            var targetAttribute = document.createAttribute('target');
            targetAttribute.value = transition.target.id;
            transitionNode.setAttributeNode(targetAttribute);

            transitionsNode.appendChild(transitionNode);
          }
        }

        return transitionsNode;
      },
      input: function(element) {
        var inputNode = document.createElement('input');
        var inputParameters = element.inputParameters;
        if (inputParameters) {
          for (var key in inputParameters) {
            inputNode.appendChild(encode['values'](inputParameters[key], key));
          }
        }

        return inputNode;
      },
      output: function(element) {
        var outputNode = document.createElement('output');
        var outputParameters = element.outputParameters;
        if (outputParameters) {
          for (var key in outputParameters) {
            outputNode.appendChild(encode['values'](outputParameters[key], key));
          }
        }

        return outputNode;
      },
      dataflows: function(element) {
        var dataflowsNode = document.createElement('dataflows');
        var dataflows = element.dataflows;
        if (dataflows) {
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
        var type = typeof obj;
        typeAttribute.value = (angular.isArray(obj) && 'Array') || (angular.isObject(obj) && 'Object') || type[0].toUpperCase() + type.slice(1);
        valueNode.setAttributeNode(typeAttribute);

        if (typeAttribute.value === 'Array') {
          for (var i = 0; i < obj.length; i++) {
            valueNode.appendChild(encode['values'](obj[i]));
          }
        }
        else if (typeAttribute.value === 'Object') {
          for (var key in obj) {
            valueNode.appendChild(encode['values'](obj[key], key));
          }
        }
        else {
          var textNode = document.createTextNode(obj);
          valueNode.appendChild(textNode);
        }

        return valueNode;
      },
      statemachine: function(element) {
        var node = document.createElement('statemachine');
        var id = element.id;

        var idAttribute = document.createAttribute('id');
        idAttribute.value = id;
        node.setAttributeNode(idAttribute);

        return node;
      },
      composite: function(element) {
        var node = document.createElement('composite');
        var id = element.id;

        var idAttribute = document.createAttribute('id');
        idAttribute.value = id;
        node.setAttributeNode(idAttribute);

        return node;
      },
      parallel: function(element) {
        var node = document.createElement('parallel');
        var id = element.id;

        var idAttribute = document.createAttribute('id');
        idAttribute.value = id;
        node.setAttributeNode(idAttribute);

        return node;
      },
      invoke: function(element) {
        var node = document.createElement('invoke');
        var id = element.id;

        var idAttribute = document.createAttribute('id');
        idAttribute.value = id;
        node.setAttributeNode(idAttribute);

        var endpointNode = document.createElement('endpoint'); 
        for (var key in element.endpoint) {
          endpointNode.appendChild(encode['values'](element.endpoint[key], key));
        }
        node.appendChild(endpointNode);

        return node;
      },
      initial: function(element) {
        var node = document.createElement('initial');
        var id = element.id;

        return node;
      },
      final: function(element) {
        var node = document.createElement('final');
        var id = element.id;

        return node;
      }
    };

    console.log(statemachine)
    var smdl = document.createElement("statemachine");
    smdl.appendChild(encode['children'](statemachine));

    return smdl;
  },
  fromSMDL: function() {

  }
}