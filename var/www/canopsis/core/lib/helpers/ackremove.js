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
    'app/lib/utils/dates'
], function(Ember, datesUtils) {

    var get = Ember.get,
        set = Ember.set,
        isNone = Ember.isNone;

    Ember.Handlebars.helper('ackremove', function(ackRemove, settable) {


        var timestamp = get(ackRemove, 'timestamp');
        var author = get(ackRemove, 'author');
        var comment = get(ackRemove, 'comment');

        var html = ['<center>',
            '<b>' + __('Ack removed') + '</b><br/>',
            '<i>' + __('Date') + '</i> : <br/>',
            datesUtils.timestamp2String(timestamp) +' <br/> ',
            __('By') +' : ' + author +' <br/><br/> ',
            '<i>'+__('Comment') +' </i> : <br/>' + comment,
            "</center>"].join('');

        set(settable, 'ack_remove_tooltip', html);

        return "";
    });

});
