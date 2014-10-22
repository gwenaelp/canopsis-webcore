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
    'app/lib/factories/widget',
    'canopsis/uibase/widgets/canvas/controller'
], function(WidgetFactory) {

    var set = Ember.set,
        get = Ember.get;

    var widget = WidgetFactory('tabmanager', {
        init: function() {
            if(get(this, 'items.content').length >= 0 && !Ember.isEmpty(get(this, 'items.content')[0])) {
                console.log('init tabs', get(this, 'items.content')[0].get('widget'));
                this.send('selectTab', get(this, 'items.content')[0].get('widget'));
                set(get(this, 'items.content')[0], 'tabSelected', true);
            }

            this._super.apply(this, arguments);
        },

        actions: {
            selectTab: function(item) {
                console.info('select tab', item);
                if(get(this, 'selectedItem')) {
                    set(this, 'selectedItem.tabSelected', false);
                }
                set(item, 'tabSelected', true);
                set(this, 'selectedItem', item);
            }
        },

        partials: {
            titlebarsbuttons : ["titlebarbutton-minimize", "titlebarbutton-moveup","titlebarbutton-movedown"]
        }
    });

    return widget;
});
