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
    'jquery',
    'ember',
    'ember-data',
    'app/application',
    'app/controller/partialslotablecontroller',
    'canopsis/canopsisConfiguration',
    'app/lib/utils/widgets',
    'app/lib/utils/routes',
    'app/lib/utils/forms',
    'app/lib/utils/debug'
], function($, Ember, DS, Application, PartialslotAbleController, canopsisConfiguration, widgetUtils, routesUtils, formsUtils, debugUtils) {

    var get = Ember.get,
        set = Ember.set,
        isNone = Ember.isNone;


    var controller = PartialslotAbleController.extend({
        needs: ['application', 'login'],

        /**
         * This is useful mostly for debug, to know that a printend object is a widget
         */
        abstractType: 'widget',

        canopsisConfiguration: canopsisConfiguration,
        debug: Ember.computed.alias('canopsisConfiguration.DEBUG'),

        userParams: {},

        editMode : Ember.computed.alias('controllers.application.editMode'),

        init: function () {
            console.log('widget init');

            set(this, 'model.controllerInstance', this);

            console.log('viewController', widgetUtils.getParentViewForWidget(this));
            console.log('viewController', get(widgetUtils.getParentViewForWidget(this), 'isMainView'));

            //Each widget knows what is it s view.

            var viewId = get(widgetUtils.getParentViewForWidget(this), 'content.id');
            console.debug('View id for current widget is ', viewId);
            set(this, 'viewId', viewId);

            set(this, 'viewController', widgetUtils.getParentViewForWidget(this));
            set(this, 'isOnMainView', get(widgetUtils.getParentViewForWidget(this), 'isMainView'));

            set(this, 'container', routesUtils.getCurrentRouteController().container);

            var store = DS.Store.create({
                container: get(this, 'container')
            });

            set(this, 'widgetDataStore', store);

            //User preference are called just before the refresh to ensure
            //refresh takes care of user information and widget general preference is overriden
            //All widget may not have this mixin, so it's existance is tested
            if (!isNone(this.loadUserConfiguration)) {
                this.loadUserConfiguration();
            }
            console.debug('user configuration loaded for widget ' + get(this, 'title'));

            this.startRefresh();

            //setting default/minimal reload delay for current widget
            if (get(this, 'refreshInterval') <= 10 || isNone(get(this, 'refreshInterval'))) {
                set(this, 'refreshInterval', 10);
            }

            this.refreshContent();

        },

        updateInterval: function (interval){
            console.warn('This method should be overriden for current widget', get(this, 'id'), interval);
        },

        getSchema: function() {
            return Application[get(this, 'xtype').capitalize()].proto().categories;
        },

        onReload: function () {
            console.debug('Reload widget:', get(this, 'id'));

            if (get(this, 'widgetData.content') !== undefined) {
                //Allows widget to know how many times they have been repainted
                if (get(this, 'domReadyCount') === undefined) {
                    set(this, 'domReadyCount', 1);
                } else {
                    set(this, 'domReadyCount', get(this, 'domReadyCount') + 1);
                }
            }
        },

        stopRefresh: function () {
            set(this, 'isRefreshable', false);
        },

        startRefresh: function () {
            set(this, 'isRefreshable', true);
            set(this, 'lastRefresh', null);
        },

        isRollbackable: function() {
            if(get(this, 'isDirty') && get(this, 'dirtyType') === 'updated' && get(this, 'rollbackable') === true) {
                return true;
            }

            return false;

        }.property('isDirty', 'dirtyType', 'rollbackable'),


        actions: {
            /**
             * Show debug info in console and put widget var in window.$E
             */
            inspect: function (widget) {
                debugUtils.inspectObject(this);
            },

            do: function(action) {
                var params = [];
                for (var i = 1, l = arguments.length; i < l; i++) {
                    params.push(arguments[i]);
                }

                this.send(action, params);
            },

            creationForm: function(itemType) {
                formsUtils.addRecord(itemType);
            },

            rollback: function(widget){
                console.log('rollback changes', arguments);
                widget.rollback();
                set(this, 'rollbackable', false);
            },

            editWidget: function (widget) {
                console.info('edit widget', widget);

                var widgetWizard = formsUtils.showNew('modelform', widget, { title: __('Edit widget') });
                console.log('widgetWizard', widgetWizard);

                var widgetController = this;

                widgetWizard.submit.done(function() {
                    console.log('record going to be saved', widget);

                    var userview = get(widgetController, 'viewController').get('content');
                    userview.save();
                    console.log('triggering refresh');
                    widgetController.trigger('refresh');
                });
            },

            removeWidget: function (widget) {
                console.group('remove widget', widget);
                console.log('parent container', this);

                var itemsContent = get(this, 'content.items.content');

                for (var i = 0, l = itemsContent.length; i < l; i++) {
                    console.log(get(this, 'content.items.content')[i]);
                    if (get(itemsContent[i], 'widget') === widget) {
                        itemsContent.removeAt(i);
                        console.log('deleteRecord ok');
                        break;
                    }
                }

                var userview = get(this, 'viewController.content');
                userview.save();

                console.groupEnd();
            },

            editWidgetPreferences: function (widget) {

                var widgetController = this;

                var label = 'Edit your widget preferences';
                console.info(label, widget);

                var widgetWizard = formsUtils.showNew('modelform', widget, {
                    title: __(label),
                    userPreferencesOnly: true
                });
                console.log('widgetWizard', widgetWizard);

                widgetWizard.submit.then(function(form) {

                    var record = get(form, 'formContext');
                    console.log('user param record', record);
                    //widgetController.set('userParams.filters', widgetController.get('filters'));
                    //widgetController.saveUserConfiguration();

                    widgetController.trigger('refresh');
                });
            },

            movedown: function(widgetwrapper) {
                console.group('movedown', widgetwrapper);
                try{
                    console.log('context', this);

                    var foundElementIndex,
                        nextElementIndex;


                    var itemsContent = get(this, 'content.items.content');

                    for (var i = 0, l = itemsContent.length; i < l; i++) {

                        console.log('loop', i, itemsContent[i], widgetwrapper);
                        console.log(itemsContent[i] === widgetwrapper);
                        if (foundElementIndex !== undefined && nextElementIndex === undefined) {
                            nextElementIndex = i;
                            console.log('next element found');
                        }

                        if (itemsContent[i] === widgetwrapper) {
                            foundElementIndex = i;
                            console.log('searched element found');
                        }
                    }

                    if (foundElementIndex !== undefined && nextElementIndex !== undefined) {
                        //swap objects
                        var array = itemsContent;
                        console.log('swap objects', array);

                        var tempObject = array.objectAt(foundElementIndex);

                        array.insertAt(foundElementIndex, array.objectAt(nextElementIndex));
                        array.insertAt(nextElementIndex, tempObject);
                        array.replace(foundElementIndex + 2, 2);

                        console.log('new array', array);
                        set(this, 'content.items.content', array);

                        var userview = get(this, 'viewController.content');
                        userview.save();
                    }
                } catch (e) {
                    console.error(e.stack, e.message);
                }
                console.groupEnd();
            },

            moveup: function(widgetwrapper) {
                console.group('moveup', widgetwrapper);

                try{
                    console.log('context', this);

                    var foundElementIndex,
                        nextElementIndex;

                    var itemsContent = get(this, 'content.items.content');

                    for (var i = itemsContent.length; i >= 0 ; i--) {
                        console.log('loop', i, itemsContent[i], widgetwrapper);
                        console.log(itemsContent[i] === widgetwrapper);

                        if (foundElementIndex !== undefined && nextElementIndex === undefined) {
                            nextElementIndex = i;
                            console.log('next element found');
                        }

                        if (itemsContent[i] === widgetwrapper) {
                            foundElementIndex = i;
                            console.log('searched element found');
                        }
                    }

                    console.log('indexes to swap', foundElementIndex, nextElementIndex);

                    if (foundElementIndex !== undefined && nextElementIndex !== undefined) {
                        //swap objects
                        var array = get(this, 'content.items.content');
                        console.log('swap objects', array);

                        var tempObject = array.objectAt(foundElementIndex);

                        array.insertAt(foundElementIndex, array.objectAt(nextElementIndex));
                        array.insertAt(nextElementIndex, tempObject);
                        array.replace(nextElementIndex + 2, 2);

                        console.log('new array', array);
                        set(this, 'content.items.content', array);

                        var userview = get(widgetUtils.getParentViewForWidget(this), 'content');
                        userview.save();
                    }
                } catch (e) {
                    console.error(e.stack, e.message);
                }
                console.groupEnd();
            },

        },

        config: Ember.computed.alias('content'),

        itemController: function() {
            if(get(this, 'itemType')) {
                return get(this, 'itemType').capitalize();
            }
        }.property('itemType'),

        refreshContent: function() {
            this._super();

            this.findItems();

            set(this, 'lastRefresh', new Date().getTime());
        },

        findItems: function() {
            console.warn('findItems not implemented');
        },

        extractItems: function(queryResult) {
            console.log('extractItems', queryResult);

            this._super(queryResult);

            set(this, 'widgetData', queryResult);
        },

        availableTitlebarButtons: function(){
            var buttons = get(this, 'partials.titlebarsbuttons');
            console.log('availableTitlebarPartialButtons CP');

            if(buttons === undefined) {
                return Ember.A();
            }

            var res = Ember.A();

            for (var i = 0, l = buttons.length; i < l; i++) {
                var currentButton = buttons[i];

                if(Ember.TEMPLATES[currentButton] !== undefined) {
                    res.pushObject(currentButton);
                } else {
                    //TODO manage this with utils.problems
                    console.warn('template not found', currentButton);
                }
            }

            return res;
        }.property()
    });

    loader.register('controller:widget', controller);

    return controller;
});
