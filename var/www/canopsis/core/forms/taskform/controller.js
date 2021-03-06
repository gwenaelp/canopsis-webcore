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
    'app/lib/factories/form',
    'app/forms/modelform/controller',
    'app/lib/utils/forms'
], function(Ember, FormFactory, ModelFormController, formsUtils) {

    var get = Ember.get,
        set = Ember.set;

    var formOptions = {
        subclass: ModelFormController
    };

    var form = FormFactory('taskform', {
        title: 'Configure Job settings',
        scheduled: true,
        jobRecord: undefined,

        init: function() {
            this._super();

            if(this.scheduled === false) {
                this.partials.buttons = ["formbutton-next", "formbutton-cancel"];
            } else {
                this.partials.buttons = ["formbutton-cancel", "formbutton-submit"];
            }

            this.refreshPartialsList();
        },

        actions: {
            next: function() {
                console.group('configureTask');

                var formParent = get(this, 'formParent');
                var wizard;

                if(get(this, 'nextForm') === undefined) {
                    wizard = formsUtils.showNew('scheduleform', formParent.formContext, {
                        formParent: this,
                        title: 'Configure Schedule'
                    });

                    set(this, 'nextForm', wizard);
                } else {
                    wizard = get(this, 'nextForm');
                    console.log('nextForm', wizard);
                    formsUtils.showInstance(wizard);
                }

                console.groupEnd();
            },

            submit: function() {
                console.group('submitTask');

                console.groupEnd();

                this._super(arguments);
            }
        },

        partials: {
            buttons: ["formbutton-cancel", "formbutton-next"]
        },
    }, formOptions);

    return form;
});
