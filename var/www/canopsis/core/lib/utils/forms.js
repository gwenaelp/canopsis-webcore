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
    'app/lib/utils/routes',
    'app/lib/formsregistry'
], function(Ember, Application, routesUtils, formsregistry) {

    var set = Ember.set;

    var formUtils = {
        instantiateForm: function(formName, formContext, options) {
            void (formContext);
            console.log('try to instantiate form', formName, options.formParent);
            var classDict = options;

            options.formName = formName;
            classDict.target = routesUtils.getCurrentRouteController();
            classDict.container = Application.__container__;

            var formController = formsregistry.all[formName].EmberClass.create(classDict);
            formController.refreshPartialsList();
            return formController;
        },

        showInstance: function(formInstance) {
            formInstance.empty_validationFields();

            set(formsregistry.formwrapper, 'form.validateOnInsert', false);
            set(formsregistry.formwrapper, 'form', formInstance);
            set(formsregistry.formwrapper, 'formName', formInstance.formName);
        },

        showNew: function(formName, formContext, options) {
            if (options === undefined) {
                options = {};
            }

            if (formContext.get && Ember.isNone(formContext.get('crecord_type'))) {
                console.warn('There is no crecord_type in the given record. Form may not display properly.');
            }

            console.log("Form generation", formName);

            var formController = this.instantiateForm(formName, formContext, options);
            console.log("formController", formController);

            routesUtils.getCurrentRouteController().send('showEditFormWithController', formController, formContext, options);

            return formController;
        },

        editRecord: function(record) {
            var widgetWizard = formsUtils.showNew('modelform', record);
            console.log('widgetWizard', widgetWizard);

            widgetWizard.submit.then(function() {
                console.log('record saved');

                record.save();
                widgetWizard.trigger('hidePopup');
                widgetWizard.destroy();
            });

            return widgetWizard;
        },

        addRecord: function(record_type) {
            routesUtils.getCurrentRouteController().send('show_add_crecord_form', record_type);
        }
    };

    return formUtils;
});
