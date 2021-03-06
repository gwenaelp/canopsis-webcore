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
    'jquery',
    'ember',
    'app/lib/utils/forms',
    'app/mixins/validationfield'
], function($, Ember, formsUtils, ValidationFieldMixin) {

    var get = Ember.get,
        set = Ember.set;


    var component = Ember.Component.extend(ValidationFieldMixin, {
        valueRefPath: "content.value",
        valuePath: "value",

        init: function() {
            this._super.apply(this, arguments);

            set(this, "componentDataStore", DS.Store.create({
                container: get(this, "container")
            }));

            var value = get(this,"content.value") || [];
            set(this, 'value', value);
            set(this, 'content.value', value);

            var values = get(this, 'value');

            var me = this;

            Ember.run(function() {
                set(me, 'arrayAttributes', Ember.A());

                if(values !== undefined) {
                    for (var i = 0, l = values.length; i < l; i++) {
                        get(me, 'arrayAttributes').pushObject(me.generateVirtualAttribute(i));
                    }
                }
            });
        },

        didInsertElement: function() {
            var sortableElements = this.$(".sortable");
            var componentArrayComponent = this;

            if(sortableElements.length >= 0) {
                this.$(".sortable").sortable({
                    items: '> tr',
                    handle: ".handle",
                    axis: "y",
                    // forceHelperSize: true,
                    // forcePlaceholderSize: true,
                    helper: function(e, tr) {
                        void (e);
                        var $originals = tr.children();
                        var $helper = tr.clone();
                        $helper.children().each(function(index) {
                            // Set helper cell sizes to match the original sizes
                            $(this).width($originals.eq(index).width());
                        });
                        return $helper;
                    },

                    start: function(event, ui) {
                        // creates a temporary attribute on the element with the old index
                        $(ui.item.context).attr('data-previndex', $(ui.item.context).index('tr'));
                    },

                    update: function(event, ui) {
                        console.log('update', ui.item);
                        console.log('update', $(ui.item.context));
                        var newIndex = $(ui.item.context).index('tr');
                        var oldIndex = parseInt($(ui.item.context).attr('data-previndex'), 10);

                        ui.item.remove();
                        componentArrayComponent.moveItem(oldIndex, newIndex);
                    }
                });
            }
        },

        itemEditorType: function(){
            var type = get(this, 'content.model.options.items.type');
            var role = get(this, 'content.model.options.items.role');
            console.log('editorType', get(this, 'content'), type, role);
            var editorName;

            if (role) {
                editorName = 'editor-' + role;
            } else {
                editorName = 'editor-' + type;
            }

            if (Ember.TEMPLATES[editorName] === undefined) {
                editorName = 'editor-defaultpropertyeditor';
            }

            return editorName;
        }.property('content.model.options.items.type', 'content.model.options.items.role'),

        /**
         * Generates a virtual attribute that will be used to manipulate the array item data
         */
        generateVirtualAttribute: function(itemIndex) {
            var values = get(this, 'value');
            var content = get(this, 'content.model.options.items');
            var componentArrayComponent = this;


            console.log('generateVirtualAttribute', itemIndex, values[itemIndex]);

            var currentGeneratedAttr = Ember.Object.create({
                parent: componentArrayComponent,
                index: itemIndex,
                value : values[itemIndex]
            });

            //apply options to virtual attribute
            set(currentGeneratedAttr, 'model', Ember.Object.create());
            set(currentGeneratedAttr, 'model.options', Ember.Object.create());

            for (var key in content) {
                if (key !== 'value') {
                    Ember.set(currentGeneratedAttr, 'model.options.' + key, content[key]);
                }
            }
            console.log("generateVirtualAttribute virtual attribute", currentGeneratedAttr);

            Ember.addObserver(currentGeneratedAttr, 'value', function(attr) {
                console.log('value changed', attr.value, attr.index);
                get(componentArrayComponent, 'value').removeAt(attr.index);
                get(componentArrayComponent, 'value').insertAt(attr.index, attr.value);
                console.log('content changed', componentArrayComponent.get('value'));
            });

            console.log("generateVirtualAttribute");

            return currentGeneratedAttr;
        },

        contentChanged: function() {
            console.log('recompute contentAttributeArray');
        },

        actions: {
            addItem: function() {
                console.log('addItem', get(this, 'value'));

                var values = get(this, 'value');
                var itemType = get(this, 'content.model.options.items.type');
                var model = get(this, 'content.model.options.items.model');
                var objDict = get(this, 'content.model.options.items.objectDict');

                if(model !== undefined) {
                    var store = get(this, 'componentDataStore');
                    var record = store.createRecord(model, {
                        xtype: model
                    });

                    values.pushObject(record);
                } else if(itemType === 'object') {
                    values.pushObject(Ember.Object.create(objDict));
                } else {
                    values.pushObject(undefined);
                }

                var newIndex = values.length - 1;
                var attr = this.generateVirtualAttribute(newIndex);
                get(this, 'arrayAttributes').pushObject(attr);

                this.validate();
            },
            editItem: function(item) {
                console.log('editItem', item, get(this, 'form'), formsUtils);

                formsUtils.showNew('arrayitemform', undefined, {formParent: get(this, 'form')});
            },
            removeItem: function(item) {
                console.log('removeItem', get(this, 'value'));

                var arrayAttributes = get(this, 'arrayAttributes');
                get(this, 'value').removeAt(item.index);
                arrayAttributes.removeAt(item.index);
                for (var i = item.index, l = arrayAttributes.length; i < l; i++) {
                    arrayAttributes.objectAt(i).set('index', arrayAttributes.objectAt(i).get('index') - 1);
                }
                this.validate();
            }
        },
        moveItem: function(oldIndex, newIndex) {
            console.log('moveItem', arguments);
            // get(this, 'arrayAttributes').moveElement(oldIndex, newIndex);

            //update virtual attributes
            var array = get(this, 'arrayAttributes');
            array.arrayContentWillChange(oldIndex, 1, 0);
            var oldIndex_value = array[oldIndex];
            array.splice(oldIndex, 1);
            array.splice(newIndex, 0, oldIndex_value);

            for (var i = 0, l = array.length; i < l; i++) {
                array[i].index = i;
            }

            array.arrayContentDidChange(newIndex, 0, 1);

            //update component value
            var array = get(this, 'value');
            array.arrayContentWillChange(oldIndex, 1, 0);
            var oldIndex_value = array[oldIndex];
            array.splice(oldIndex, 1);
            array.splice(newIndex, 0, oldIndex_value);

            array.arrayContentDidChange(newIndex, 0, 1);

        }
    });


    Ember.Application.initializer({
        name:"component-arrayeditor",
        initialize: function(container, application) {
            application.register('component:component-arrayeditor', component);
        }
    });

    return component;
});
