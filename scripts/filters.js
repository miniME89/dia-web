var previous = {};

app.filter("stencils", function() {
    return function(groups, filter) {
        if (!filter)
        {
            return groups;
        }

        if (filter == previous.filter)
        {
            return previous.groupsFiltered;
        }

        var regex = new RegExp(filter, "i");

        var groupsFiltered = [];
        angular.forEach(groups, function(group)
        {
            var stencils = [];
            angular.forEach(group.stencils, function(stencil)
            {
                if (stencil.info)
                {
                    if (stencil.info.name.search(regex) > -1 || stencil.info.description.search(regex) > -1)
                    {
                        stencils.push(stencil);
                    }
                }
            });

            if (stencils.length > 0)
            {
                groupsFiltered.push({
                    name: group.name,
                    stencils: stencils
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
