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
        set = Ember.set,
        isNone = Ember.isNone;

    /**
      Implements criticity levels in ArrayControllers

      You should define on the ArrayController:
          - the `findOptions` property
          - the `findItems()` method

    */
    var mixin = Mixin('criticitylevels', {

        init:function () {


            var mixinsOptions = get(this, 'content.mixins');

            if(mixinsOptions) {
                var criticitylevelsOptions = get(this, 'content.mixins').findBy('name', 'criticitylevels');
                this.mixinOptions.criticitylevels = criticitylevelsOptions;
            }

            this._super();

            set(this, 'warn_value', get(this, 'mixinOptions.criticitylevels.warn_value'));
            set(this, 'crit_value', get(this, 'mixinOptions.criticitylevels.crit_value'));
            set(this, 'unit_or_percent', get(this, 'mixinOptions.criticitylevels.unit_or_percent'));
            set(this, 'background_color', get(this, 'mixinOptions.criticitylevels.background_color'));
            set(this, 'warn_color', get(this, 'mixinOptions.criticitylevels.warn_color'));
            set(this, 'critic_color', get(this, 'mixinOptions.criticitylevels.critic_color'));
            set(this, 'label_align', get(this, 'mixinOptions.criticitylevels.label_align'));
            set(this, 'label_display', get(this, 'mixinOptions.criticitylevels.label_display'));
            set(this, 'label_width', get(this, 'mixinOptions.criticitylevels.label_width'));
            set(this, 'label_unit', get(this, 'mixinOptions.criticitylevels.label_unit'));
            set(this, 'show_value', get(this, 'mixinOptions.criticitylevels.show_value'));

            if(isNone(get(this, 'background_color'))){
                set(this, 'background_color', '#3c8dbc');
            }
            if(isNone(get(this, 'warn_color'))){
                set(this, 'warn_color', '#f39c12');
            }
            if(isNone(get(this, 'critic_color'))){
                set(this, 'critic_color', '#f56954');
            }

            if(isNone(get(this, 'label_align'))){
                set(this, 'label_align', 'left');
            }
            if(isNone(get(this, 'label_display'))){
                set(this, 'label_display', false);
            }
            if(isNone(get(this, 'show_value'))){
                set(this, 'show_value', false);
            }

            if(isNone(get(this, 'label_width'))){
                set(this, 'label_width', 0);
            }
            if(isNone(get(this, 'label_unit'))){
                set(this, 'lbael_unit', '%');
            }

        }
    });

    return mixin;
});
