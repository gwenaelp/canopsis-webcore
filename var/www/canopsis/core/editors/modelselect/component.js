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
], function(Ember, Application) {
    var get = Ember.get,
        set = Ember.set;

    var component = Ember.Component.extend({
        model: Ember.computed.alias('content.model.options.model'),
        value: Ember.computed.alias('content.value'),

        availableModels: function() {
            var store = get(this, 'componentDataStore');
            var model = get(this, 'model');

            return store.findAll(model);
        }.property('content.model.options.model'),

        init: function() {
            this._super.apply(this, arguments);

            set(this, "componentDataStore", DS.Store.create({
                container: get(this, "container")
            }));
        }
    });

    Application.ComponentModelselectComponent = component;
    return component;
});