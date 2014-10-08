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
    'app/lib/factories/widget',
    'app/components/flotchart/component',
    'app/controller/serie'
], function($, Ember, DS, Application, WidgetFactory) {
    var get = Ember.get,
        set = Ember.set;

    var widgetOptions = {};

    var widget = WidgetFactory('timegraph', {
        needs: ['serie'],
        chartOptions: undefined,
        flotSeries: {},

        dataSeries: function() {
            var flotSeries = get(this, 'flotSeries');
            var series = [];

            var serieIds = Object.keys(flotSeries);

            for(var i = 0, l = serieIds.length; i < l; i++) {
                var serieId = serieIds[i];

                series.push(flotSeries[serieId]);
            }

            return series;
        }.property('flotSeries'),

        timenav: false,

        init: function() {
            /* needed to be declared here, because findItems() is called
             * in parent constructor.
             */
            var store = DS.Store.create({
                container: get(this, 'container')
            });

            set(this, 'widgetDataStore', store);

            this._super();

            var now = +new Date();
            var config = get(this, 'config');

            console.group('timegraph init');

            // fill chart options
            set(this, 'timenav', get(config, 'timenav'));

            chartOptions = get(this, 'chartOptions') || {};

            $.extend(chartOptions, {
                zoom: {
                    interactive: false
                },

                selection: {
                    mode: 'x'
                },

                crosshair: {
                    mode: 'x'
                },

                grid: {
                    hoverable: true,
                    clickable: true
                },

                xaxis: {
                    min: now - (get(config, 'time_window_offset') + get(config, 'time_window')) * 1000,
                    max: now - get(config, 'time_window') * 1000
                },

                yaxis: {
                },

                xaxes: [{
                    position: 'bottom',
                    mode: 'time',
                    timezone: 'browser'
                }],

                yaxes: [],

                legend: {
                    hideable: true,
                    legend: get(config, 'legend')
                },

                tooltip: get(config, 'tooltip')
            });

            console.log('Configure chart:', chartOptions);
            set(this, 'chartOptions', chartOptions);

            console.groupEnd();
        },

        findItems: function() {
            console.group('Fetch series:');

            var me = this;

            var replace = false;
            var from = get(this, 'lastRefresh');
            var to = +new Date() - get(this, 'config.time_window_offset');

            if(from === null) {
                replace = true;
                from = to - get(this, 'config.time_window') * 1000;
            }

            console.log('refresh:', from, to, replace);

            var store = get(this, 'widgetDataStore');

            /* fetch stylized series */
            var stylizedseries = get(this, 'config.series');
            var series = {};
            var curveIds = [];

            for(var i = 0, l = stylizedseries.length; i < l; i++) {
                var serieId = stylizedseries[i].serie;

                series[serieId] = stylizedseries[i];
                curveIds.push(stylizedseries[i].curve);
            }

            var serieIds = JSON.stringify(Object.keys(series));
            curveIds = JSON.stringify(curveIds);

            console.log('series:', serieIds);
            console.log('curves:', curveIds);

            console.groupEnd();

            /* load series configuration */
            $.when(
                store.findQuery('serie', {ids: serieIds}),
                store.findQuery('curve', {ids: curveIds})
            ).then(function(p1args, p2args) {
                console.group('Generate FlotChart series');

                var serieResult = p1args[0]; // arguments of first promise
                var curveResult = p2args[1]; // arguments of second promise

                var i, l;

                console.log('Fetch curves');
                for(i = 0, l = curveResult.length; i < l; i++) {
                    var curve = curveResult.content[i];

                    for(var j = 0, l2 = serieResult.length; j < l2; j++) {
                        var serieconf = serieResult.content[j];

                        var serieId = serieconf.id;

                        if(series[serieId] !== undefined) {
                            var stylizedserie = series[serieId];

                            if(stylizedserie.curve === curve.id) {
                                stylizedserie.curve = curve;
                                break;
                            }
                        }
                    }
                }

                console.log('Fetch series');
                for(i = 0, l = serieResult.meta.total; i < l; i++) {
                    var serieconf = serieResult.content[i];

                    var serieId = serieconf.id;

                    if(series[serieId] !== undefined) {
                        var stylizedserie = series[serieId];
                        stylizedserie.serie = serieconf;

                        me.genFlotSerie(stylizedserie, from, to);
                    }
                }

                console.groupEnd();
            });
        },

        genFlotSerie: function(stylizedserie, from, to, replace) {
            console.group('Generating FlotChart serie:', stylizedserie);

            var flotSerie = {
                label: stylizedserie.serie.crecord_name,
                color: stylizedserie.color,
                lines: {
                    show: stylizedserie.curve.lines,
                    lineWidth: stylizedserie.curve.line_width,
                    fill: (stylizedserie.curve.areas ? stylizedserie.curve.area_opacity : false)
                },
                bars: {
                    show: stylizedserie.curve.bars,
                    barWidth: stylizedserie.curve.bar_width
                },
                points: {
                    show: stylizedserie.curve.points,
                    symbol: stylizedserie.curve.point_shape
                },
                xaxis: stylizedserie.xaxis,
                yaxis: stylizedserie.yaxis,
                clickable: true,
                hoverable: true
            };

            var oldSerie = get(this, 'flotSeries.' + stylizedserie.serie.id);

            if(oldSerie !== undefined && !replace) {
                flotSerie.data = oldSerie.data;
            }
            else {
                flotSerie.data = [];
            }

            console.log('flotserie:', flotSerie);
            console.log('Fetch perfdata and compute serie');

            var ctrl = get(this, 'controllers.serie');
            ctrl.getDataSerie(serieconf, from, to).then(function(data) {
                flotSerie.data = flotSerie.concat(data);

                set(me, 'flotSeries.' + stylizedserie.serie.id, flotSerie);
            });

            console.groupEnd();
        }
    }, widgetOptions);

    return widget;
});
