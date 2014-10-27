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
    'app/lib/wrappers/bootstrap'
], function(Ember, Application) {

    var get = Ember.get,
        set = Ember.set;


    var DragNDrop = Ember.Namespace.create();

    DragNDrop.Dragable = Ember.Mixin.create({
        attributeBindings: 'draggable',
        draggable: 'true',
        dragStart: function(event) {

            console.log('drag started !');

            var dataTransfer = event.originalEvent.dataTransfer;

            dataTransfer.setData('elementId', get(this,'elementId'));

            this.send('dragStarted', get(this,'content'));
        }
    });


    var component = Ember.Component.extend(DragNDrop.Dragable, {

        didInsertElement: function() {

        }
    });

    Application.ComponentDraggablebuttonComponent = component;

    return component;
});