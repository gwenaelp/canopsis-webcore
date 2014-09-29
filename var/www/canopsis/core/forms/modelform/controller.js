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
    'app/lib/factories/form',
    'app/mixins/inspectableitem',
    'app/mixins/validation',
    'app/mixins/recordpreset',
    'app/lib/utils/slug',
    'app/lib/loaders/schemas'
], function(Ember, Application, FormFactory, InspectableitemMixin, ValidationMixin, RecordpresetMixin, slugUtils) {
    var set = Ember.set,
        get = Ember.get;

    var formOptions = {
        mixins: [
            InspectableitemMixin,
            ValidationMixin,
            RecordpresetMixin
        ]
    };

    /**
     * @class Generic form which dynamically generates its content by reading a model's schema
     */
    var form = FormFactory('modelform', {

        validationFields: Ember.computed(function() {return Ember.A();}),
        ArrayFields: Ember.A(),

        filterUserPreferenceCategory: function (category, keyFilters) {
            var keys = category.get('keys');
            set(category, 'keys', []);

            for (var i = 0, l = keys.length; i < l; i++) {
                console.log('key', keys[i]);

                if (this.get('userPreferencesOnly')) {
                    //isUserPreference is set to true in the key schema field.
                    if (keys[i].model && keys[i].model.options && keys[i].model.options.isUserPreference) {
                        get(category, 'keys').push(keys[i]);
                    }
                } else {
                    //Filter from form parameter
                    if (keyFilters[keys[i].field]) {
                        console.log('magic keys', keys[i]);
                        if (keyFilters[keys[i].field].readOnly) {
                            keys[i].model.options.readOnly = true;
                        }
                        get(category, 'keys').push(keys[i]);
                    }
                }
            }
            return category;
        },

        categories: function(){
            var res = get(this, 'categorized_attributes');
            var category_selection = [];
            if(res instanceof Array) {
                for(var i = 0; i < res.length; i++) {
                    var category = res[i];

                    category.slug = slugUtils(category.title);
                    console.log(category);
                    if (get(this, 'filterFieldByKey') || get(this, 'userPreferencesOnly')) {
                        //filter on user preferences fields only
                        //if (category)
                        category = this.filterUserPreferenceCategory(category, get(this, 'filterFieldByKey'));
                        if (category.keys.length) {
                            category_selection.push(res[i]);
                        }

                        console.log('category');
                        console.log(category);
                    } else {
                        //select all
                        category_selection.push(res[i]);
                    }
                }
                if (category_selection.length) {
                    set(category_selection[0], 'isDefault', true);
                }
                return category_selection;
            }
            else {
                return [];
            }
        }.property('categorized_attributes'),

        onePageDisplay: function () {
            //TODO search this value into schema
            return false;
        }.property(),

        inspectedDataItem: function() {
            return get(this, 'formContext');
        }.property('formContext'),

        inspectedItemType: function() {
            console.log('recompute inspectedItemType', get(this, 'formContext'));

            if (this.get('formContext.xtype')) {
                return get(this, 'formContext.xtype');
            } else {
                return get(this, 'formContext.crecord_type') || get(this, 'formContext.connector_type')  ;
            }

        }.property('formContext'),
/*
        updateArray: function() {
            var ArrayFields = this.get("ArrayFields");
            if (ArrayFields !== undefined) {
                for (var w = 0; w < this.ArrayFields.length; w++) {
                    console.log("ArrayFields  : ", this.ArrayFields[w]);
                    this.ArrayFields[w].onUpdate();
                }
            }
        },
*/
        actions: {
            submit: function() {
                if (this.validation !== undefined && !this.validation()) {
                    return;
                }

                console.log('submit action');

                var override_inverse = {};

                if(this.isOnCreate && this.modelname){

                    var stringtype = this.modelname.charAt(0).toUpperCase() + this.modelname.slice(1);
                    var model = Application.allModels[stringtype];

                    if(model) {
                        for(var fieldName in model){
                            if(model.hasOwnProperty(fieldName)) {
                                var field = model[fieldName];
                                if(field && field._meta &&  field._meta.options){
                                    var metaoptions = field._meta.options;
                                    if( 'setOnCreate' in metaoptions){
                                        var value = options.setOnCreate;
                                        set(this, 'formContext.' + fieldName, value);
                                    }
                                }
                            }
                        }
                    }
                }
                //will execute callback from options if any given
                var options = get(this, 'options');

                if(options && options.override_labels) {
                    for(var key in options.override_labels) {
                        override_inverse[options.override_labels[key]] = key;
                    }
                }

                var categories = get(this, 'categorized_attributes');

                console.log('setting fields');
                for (var i = 0, li = categories.length; i < li; i++) {
                    var category = categories[i];
                    for (var j = 0, lj = category.keys.length; j < lj; j++) {
                        var attr = category.keys[j];
                        var categoryKeyField = attr.field;
                        //set back overried value to original field
                        if (override_inverse[attr.field]) {
                            categoryKeyField = override_inverse[attr.field];
                        }
                        set(this, 'formContext.' + categoryKeyField, attr.value);
                    }
                }
                //Update value of array
              //  this.updateArray();

                console.log('this is a widget', get(this, 'formContext'));
                this._super(get(this, 'formContext'));
            }
        }
    },
    formOptions);

    return form;
});
