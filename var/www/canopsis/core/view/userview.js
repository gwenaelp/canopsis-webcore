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
    'app/lib/utils/test'
], function(Ember, testUtils) {

    var get = Ember.get,
        set = Ember.set,
        isNone = Ember.isNone;

    var view = Ember.View.extend({
        actions: {
            refreshView: function() {
                this.rerender();
            }
        },

        hookRegistered: false,

        //Controller -> View Hooks
        registerHooks: function() {
            if (!get(this, 'hookRegistered')) {
                get(this, 'controller').on('refreshView', this, this.rerender);
                this.set('hookRegistered', true);
            }
        },

        unregisterHooks: function() {
            get(this, 'controller').off('refreshView', this, this.rerender);
            this.set('hookRegistered', false);
        },

        rerender: function() {
            console.info('refreshing view', this);
            if (get(this, 'state') === 'destroying') {
                console.warn('view is being destroying, cancel refresh');
                return;
            }
            this._super.apply(this, arguments);
            this.registerHooks();
        },

        didInsertElement : function() {
            console.log("inserted view", this);

            this.registerHooks();
            return this._super.apply(this, arguments);
        },

        willClearRender: function() {
            this.unregisterHooks();
            return this._super.apply(this, arguments);
        }
    });


    loader.register('view:userview', view);

    return view;
});
