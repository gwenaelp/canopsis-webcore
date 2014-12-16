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


var deps = [];
if (!isIE) {
    deps.push('consolejs');
}

define(deps, function() {

    delete console.init;

    if(!isIE) {
        console.group('init');
        console.tags.add('init');
    }

    console.log = function(){};
    console.info = function(){};
    console.error = function(){};
    console.group = function(){};
    console.groupEnd = function(){};
    console.warn = function(){};
    Ember.warn = function(){};
    Ember.deprecate = function(){};
    console.debug = console.log;

    return console;
});
