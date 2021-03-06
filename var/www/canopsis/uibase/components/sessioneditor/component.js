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

define([
    'ember',
    'utils'
], function(Ember, cutils) {

    var get = Ember.get,
        set = Ember.set;


    var component = Ember.Component.extend({
        fieldValue: function() {
            var key = this.get('attr.model.options.valueFrom');
            var value = cutils.session[key];

            console.group('editor-session');
            console.log('key:', key);
            console.log('value:', value);
            console.groupEnd();

            return value;
        }.property('attr.field'),

        init: function() {
            this._super(arguments);

            if(get(this, 'attr.value') === undefined) {
                set(this, 'attr.value', get(this, 'fieldValue'));
            }
        },
        validate: function(){
            if(isRed(value))
                return true;
        }
    });


    Ember.Application.initializer({
        name:"component-sessioneditor",
        initialize: function(container, application) {
            application.register('component:component-sessioneditor', component);
        }
    });

    return component;
});
