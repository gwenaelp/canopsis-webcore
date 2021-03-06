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
    'ember'
], function(Ember) {

    var get = Ember.get,
        set = Ember.set;


    var component = Ember.Component.extend({
        model: function() {
            var model = get(this, 'content.model.options.model');

            var typekeySplit = model.split('.');
            var typekey = typekeySplit[typekeySplit.length - 1].capitalize();

            return typekey;
        }.property('content.model.options.model'),

        newModelSelected: function() {
            var model = get(this, 'selectedModel');
            console.log('Select record:', model);

            set(this, 'content.value', get(model, 'id'));
        }.observes('selectedModel'),

        availableModels: function() {
            var store = get(this, 'componentDataStore');
            var model = get(this, 'model');

            return store.findAll(model);
        }.property('model'),

        init: function() {
            this._super.apply(this, arguments);

            var store = DS.Store.create({
                container: get(this, "container")
            });

            set(this, "componentDataStore", store);

            var selectedId = get(this, 'content.value');
            var promise;
            var me = this;

            if(selectedId) {
                console.log('Select model instance:', selectedId);

                var model = get(this, 'model');
                promise = store.find(model, selectedId);

                promise.then(function(record) {
                    set(me, 'selectedModel', record);
                });
            } else {
                console.log('Select first available model');
                promise = get(this, 'availableModels');

                promise.then(function(result) {
                    var first = result.content[0];

                    set(me, 'selectedModel', first);
                });
            }
        }
    });


    Ember.Application.initializer({
        name:"component-modelselect",
        initialize: function(container, application) {
            application.register('component:component-modelselect', component);
        }
    });

    return component;
});
