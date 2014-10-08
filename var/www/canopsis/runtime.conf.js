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
    'canopsis/commit',
    'app/application',
    'utils',
    'app/lib/wrappersmanager',
    'app/lib/formsregistry',
    'app/lib/widgetsregistry',
    'app/lib/indexesregistry',
    'app/lib/actionsregistry',
    'app/lib/inflections',
    'app/lib/loaders/factories',
    'app/lib/loaders/helpers',
    'app/lib/loaders/templates',
    'app/lib/loaders/components',
    'canopsis/canopsisConfiguration',
], function(commit,
        Application,
        utils,
        wrappersManager,
        formsManager,
        widgetsRegistry,
        indexesManager,
        actionsRegistry,
        inflectionsManager,
        factories,
        helpers,
        templates,
        components,
        canopsisConfiguration) {

    var Canopsis = {};

    Canopsis.tooltips = {};
    Canopsis.utils = utils;
    Canopsis.wrappers = wrappersManager;
    Canopsis.widgets = widgetsRegistry;
    Canopsis.actions = actionsRegistry;
    Canopsis.indexes = indexesManager;
    Canopsis.inflections = inflectionsManager;
    Canopsis.forms = formsManager;
    Canopsis.manifest = Application.manifest;
    Canopsis.factories = factories;
    Canopsis.helpers = helpers;
    Canopsis.templates = templates;
    Canopsis.components = components;
    Canopsis.Application = Application;
    Canopsis.commit = commit;
    Canopsis.conf = canopsisConfiguration;

    console.log('Canopsis configuration', Canopsis.conf);

    return Canopsis;
});