/*
# Copyright (c) 2014 "Capensis" [http://www.capensis.com]
#
# This file is part of Canopsis.
#
# Canopsis is free software: you can redistribute it and/or modify
# it under the terms of the GNU Affero General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# Canopsis is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
# GNU Affero General Public License for more details.
#
# You should have received a copy of the GNU Affero General Public License
# along with Canopsis. If not, see <http://www.gnu.org/licenses/>.
*/


//TODO implement auto check for mvct file existence and require them automatically

var componentsTemplates = [
    'actionbutton',
    'attributepreset',
    'arrayclassifiedcrecordselector',
    'checkbox',
    'classifiedcrecordselector',
    'classifieditemselector',
    'editor',
    'expandableaddbutton',
    'expandabletext',
    'filterclause',
    'flotchart',
    'progressbar',
    'renderer',
    'searchbar',
    'dictclassifiedcrecordselector',
    'stringclassifiedcrecordselector',
    'table',
    'tooltip',
    'filterclause',
    'checkbox',
    'searchbar',
    'flotchart',
    'progressbar',
    'templateselector',
    'wrapper',
    'typedvalue',
    'listtree',
    'eventkey'
];

var deps = ['ember'];
var jsDeps = [];
var depsSize = deps.length;

//generate deps
for (var i = 0, l = componentsTemplates.length; i < l; i++) {
    deps.push('text!app/components/' + componentsTemplates[i] + '/template.html');

    var componentJsUrl = 'app/components/' + componentsTemplates[i] + '/component';
    jsDeps.push(componentJsUrl);
}

for (i = 0; i < jsDeps.length; i++) {
    deps.push(jsDeps[i]);
}

define(deps, function(Ember) {
    console.tags.add('loader');

    console.log("load components", arguments);
    for (var i = 0, l = componentsTemplates.length; i < l; i++) {

        console.log('load component', componentsTemplates[i]);
        var templateName = 'components/component-' + componentsTemplates[i];

        Ember.TEMPLATES[templateName] = Ember.Handlebars.compile(arguments[i + depsSize]);
    }

    console.tags.remove('loader');
});
