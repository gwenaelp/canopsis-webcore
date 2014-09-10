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
    'ember'
], function(Ember) {

    Ember.Handlebars.helper('tooltip', function(text) {
    var tooltip;

    tooltip = '<a href="#" class="tooltiptable hint--rounded hint--top" data-hint=%@>';
    tooltip += '<i class="fa fa-info-circle"></i></a>';
    tooltip = tooltip.fmt(text);

    return new Ember.Handlebars.SafeString(tooltip);
    });

});