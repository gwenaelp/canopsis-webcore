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
    'app/lib/factories/mixin'
], function(Ember, Mixin) {

    var get = Ember.get,
        set = Ember.set;


    /**
     * Implements configuration management for controllers
     * @mixin
     */
    var mixin = Mixin('configurable', {
        init: function() {
            console.log("init");
            this.refreshConfiguration();
            this._super.apply(this, arguments);
        },

        refreshConfiguration: function() {
            console.log("refreshConfiguration");

            var me = this;
            try{
                this.store.findQuery("account", { filter: { "firstname" : "Cano" } }).then(function(queryResult) {
                    console.log("results found", queryResult);
                    set(me, "configuration", queryResult.get("content")[0]);
                });
            } catch (e) {
                console.error(e.message, e.stack);
            }
        }
    });

    return mixin;
});
