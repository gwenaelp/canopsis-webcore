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
	'ember-data',
	'app/application',
	'app/routes/application',
	'utils',
	'app/lib/utils/forms',
	'app/components/flotchart/component'
], function(Ember, DS, Application, ApplicationRoute, utils, formUtils) {
	var get = Ember.get,
		set = Ember.set;

	Application.ApplicationController = Ember.ObjectController.extend({
		needs: ['login'],

		test_flotchart_options: {
			series: {
				lines: { show: true },
				points: { show: true }
			},
			xaxis: {
				show: true,
				ticks: [
					0, [ Math.PI/2, "PI/2" ], [ Math.PI, "PI" ],
					[ Math.PI * 3/2, "3 PI/2" ], [ Math.PI * 2, "2 PI" ]
				]
			},
			yaxis: {
				show: true,
				ticks: 10,
				min: -2,
				max: 2,
				tickDecimals: 3
			},
			grid: {
				backgroundColor: { colors: [ "#fff", "#eee" ] },
				borderWidth: {
					top: 1,
					right: 1,
					bottom: 2,
					left: 2
				}
			}
		},

		test_flotchart_series: [],

		plugins:function(){
			var all_plugins = [];
			var plugins = Application.plugins ;
			for ( var pluginName in plugins ){
				if( plugins.hasOwnProperty(pluginName)){
					all_plugins.push(plugins[pluginName] );
				}
			}
			return all_plugins;
		}.property(),

		init: function() {
			console.group('app init');
			var appController = this;

			console.log('TEST FLOTCHART SERIES');

			var d1 = [];
			for (var i = 0; i < Math.PI * 2; i += 0.25) {
				d1.push([i, Math.sin(i)]);
			}

			var d2 = [];
			for (var i = 0; i < Math.PI * 2; i += 0.25) {
				d2.push([i, Math.cos(i)]);
			}

			var d3 = [];
			for (var i = 0; i < Math.PI * 2; i += 0.1) {
				d3.push([i, Math.tan(i)]);
			}

			this.test_flotchart_series.push({label: 'sin(x)', data: d1});
			this.test_flotchart_series.push({label: 'cos(x)', data: d2});
			this.test_flotchart_series.push({label: 'tan(x)', data: d3});

			var headerStore = DS.Store.create({
				container: get(this, "container")
			});

			set(this, "headerViewStore", headerStore);

			headerStore.find('userview', 'view.app_header').then(function(queryResults) {
				set(appController, 'headerUserview', queryResults);
			});

			console.log('finding fconfig');
			headerStore.find('cservice', 'cservice.frontend').then(function(queryResults) {
				console.log('fconfig found');
				set(appController, 'frontendConfig', queryResults);
				set(Canopsis, 'conf.frontendConfig', queryResults);
			});

			console.log('finding authentication backends config')

			headerStore.find('ldapconfig', 'ldap.config').then(function(queryResults) {
				console.log('ldap config found');
				set(appController, 'ldapConfig', queryResults);
				set(Canopsis, 'conf.ldapConfig', queryResults);
			}, function() {
				console.log('create base ldap config');

				var record = headerStore.createRecord('ldapconfig', {
					crecord_type: 'ldapconfig'
				});

				record.id = 'ldap.config';

				set(appController, 'ldapConfig', record);
				set(Canopsis, 'conf.ldapConfig', record);
			});

			headerStore.find('casconfig', 'cas.config').then(function(queryResults) {
				console.log('cas config found');
				set(appController, 'casConfig', queryResults);
				set(Canopsis, 'conf.casConfig', queryResults);
			}, function() {
				console.log('create base cas config');

				var record = headerStore.createRecord('casconfig', {
					crecord_type: 'casconfig'
				});

				record.id = 'cas.config';

				set(appController, 'casConfig', record);
				set(Canopsis, 'conf.casConfig', record);
			});

			var footerStore = DS.Store.create({
				container: get(this, "container")
			});

			set(this, "footerViewStore", footerStore);
			footerStore.find('userview', 'view.app_footer').then(function(queryResults) {
				set(appController, 'footerUserview', queryResults);
			});

			console.groupEnd();
			this._super.apply(this, arguments);
		},

		username: function () {
			return this.get('controllers.login').get('username');
		}.property('controllers.login.username'),

		actions: {

			showUserProfile: function (){

				var login = this.get('controllers.login');

				var applicationController = this;

				var dataStore = DS.Store.create({
					container: this.get("container")
				});

				var record = dataStore.findQuery('useraccount', {
					filter: JSON.stringify({
						user: login.get('username')
					})
				}).then(function(queryResults) {
					console.log('query result');
					var record = queryResults.get('content')[0];

					//generating form from record model
					var recordWizard = utils.forms.showNew('modelform', record, {
						title: applicationController.get('username') +' '+__('profile'),
					});

					//submit form and it s callback
					recordWizard.submit.then(function(form) {
						console.log('record going to be saved', record, form);

						//generated data by user form fill
						record = form.get('formContext');

						record.save();
						utils.notification.info(__('profile') + ' ' +__('updated'));
					})
				});


			},

			editConfig: function() {
				console.log('editConfig', formUtils);
				var frontendConfig = get(this, 'frontendConfig');
				var editForm = formUtils.showNew('modelform', frontendConfig, { title: "Edit settings" });
				editForm.submit.done(function() {
					frontendConfig.save();
				});
			},

			editLdapConfig: function() {
				console.log('editLdapConfig');

				var ldapConfig = get(this, 'ldapConfig');
				var editForm = formUtils.showNew('modelform', ldapConfig, { title: 'Edit LDAP configuration' });
				editForm.submit.done(function() {
					ldapConfig.save();
				});
			},

			editCasConfig: function() {
				console.log('editCasConfig');

				var casConfig = get(this, 'casConfig');
				var editForm = formUtils.showNew('modelform', casConfig, { title: 'Edit CAS configuration' });
				editForm.submit.done(function() {
					casConfig.save();
				});
			},

			toggleEditMode: function() {
				if (Canopsis.editMode === true) {
					console.info('Entering edit mode');
					set(Canopsis, 'editMode', false);
				} else {
					console.info('Leaving edit mode');
					set(Canopsis, 'editMode', true);
				}
			},

			addNewView: function () {
				var type = "userview";
				var applicationController = this;
				console.log("add", type);

				var containerwidgetId = utils.hash.generateId('container');

				var containerwidget = Canopsis.utils.data.getStore().createRecord('vbox', {
					xtype: 'vbox',
					id: containerwidgetId
				});

				var userview = Canopsis.utils.data.getStore().push(type, {
					id: utils.hash.generateId('userview'),
					crecord_type: 'view',
					containerwidget: containerwidgetId,
					containerwidgetType: 'vbox'
				});

				console.log('temp record', userview);

				var recordWizard = Canopsis.utils.forms.showNew('modelform', userview, { title: "Add " + type });

				function transitionToView(userview) {
					console.log('userview saved, switch to the newly created view');
					applicationController.send('showView', userview.get('id'));
				}

				recordWizard.submit.done(function() {
					console.log("userview.save()");
					console.log(userview.save());
				});
			},

			openTab: function(url) {
				this.transitionToRoute(url);
			},

			addModelInstance: function(type) {
				console.log("add", type);

				var record = Canopsis.utils.data.getStore().createRecord(type, {
					crecord_type: type.underscore()
				});
				console.log('temp record', record);

				var recordWizard = Canopsis.utils.forms.showNew('modelform', record, { title: "Add " + type });

				recordWizard.submit.done(function() {
					record.save();
				});
			},

			logout: function() {
				get(this, 'controllers.login').setProperties({
					'authkey': null,
					'errors': []
				});

				window.location = '/logout';
			}
		}

	});

	void (utils);
	return Application.ApplicationController;
});