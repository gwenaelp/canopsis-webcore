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
    'app/application',
    'canopsis/uibase/components/stringclassifiedcrecordselector/component'
], function(Ember, Application) {

    var get = Ember.get,
        set = Ember.set;


    var component = Ember.Component.extend({
        init: function() {
            this._super(arguments);

            set(this, "componentDataStore", DS.Store.create({
                container: get(this, "container")
            }));

            var typekey = get(this, 'content.model.options.model');
            var typekeySplit = typekey.split('.');

            var modelname = typekeySplit[typekeySplit.length - 1];
            var model = Application[modelname.capitalize()].proto();
            console.log('Fetch model:', modelname, model);

            var item = {};
            var me = this;

            console.group('Create virtual attributes for serieitem:');

            model.eachAttribute(function(name, attr) {
                var contentKey = 'content.value.' + name;
                var itemKey = 'item.' + name + '.value';

                var val = get(me, contentKey);
                var defaultVal = get(attr, 'options.defaultValue');

                item[name] = Ember.Object.create({
                    value: val || defaultVal,
                    model: attr
                });

                me.addObserver(itemKey, function() {
                    var val = get(me, itemKey);
                    set(me, contentKey, val);
                });

                console.log(name, val, defaultVal, item[name]);
            });

            console.groupEnd();

            set(this, 'item', Ember.Object.create(item));
        }
    });


    Ember.Application.initializer({
        name:"component-metricitemeditor",
        initialize: function(container, application) {
            application.register('component:component-metricitemeditor', component);
        }
    });

    return component;
});
