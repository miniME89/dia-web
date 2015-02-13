var previous = {};

app.filter("elementsFilter", function() {
  return function(groups, filter) {
    if (!filter) {
      return groups;
    }

    if (filter == previous.filter) {
      return previous.groupsFiltered;
    }

    var regex = new RegExp(filter, "i");

    var groupsFiltered = [];
    angular.forEach(groups, function(group) {
      var elements = [];
      angular.forEach(group.elements, function(element) {
        if (element.attributes.name && element.attributes.description) {
          if (element.attributes.name.search(regex) > -1 || element.attributes.description.search(regex) > -1) {
            elements.push(element);
          }
        }
      });

      if (elements.length > 0) {
        groupsFiltered.push({
          name: group.name,
          elements: elements
        });
      }
    });

    previous = {
      groupsFiltered: groupsFiltered,
      filter: filter
    }

    return groupsFiltered;
  };
});
