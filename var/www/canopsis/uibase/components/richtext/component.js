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
    'app/lib/wrappers/summernote',
    'app/lib/wrappers/codemirror'
], function(Ember, Application) {

    var get = Ember.get,
        set = Ember.set;


    var editor = Ember.Component.extend({
        classNames: ['wysiwyg-editor'],
        btnSize: 'btn-xs',
        height: 120,

        willDestroyElement: function() {
            this.$('textarea').destroy();
        },

        didInsertElement: function() {
            var btnSize = get(this, 'btnSize');
            var height = get(this, 'height');

            this.$('textarea').summernote({
                height: height,
                toolbar: [
                    ['style', ['bold', 'italic', 'underline', 'clear']],
                    ['fontsize', ['fontsize']],
                    ['color', ['color']],
                    ['para', ['ul', 'ol', 'paragraph']],
                    ['height', ['height']],
                    ['insert', ['link']],
                    ['table', ['table']],
                    ['help', ['help']],
                    ['misc', ['codeview']]
                ],
                codemirror: { // codemirror options
                    theme: 'ambiance',
                    mode: 'htmlmixed'
                }
            });

            var content = get(this, 'content');
            this.$('textarea').code(content);
            this.$('.btn').addClass(btnSize);
        },

        keyUp: function() {
            this.doUpdate();
        },

        click: function() {
            this.doUpdate();
        },

        doUpdate: function() {
            var content = this.$('.note-editable').html();
            console.log("doUpdate", content);
            console.log("doUpdate val", get(this, 'templateData.keywords.attr.value'));
            set(this, 'content', content);
        }
    });

    Application.ComponentRichtextComponent = editor;

    return editor;
});