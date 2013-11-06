/**
 * @license Angulartics v0.8.5
 * (c) 2013 Luis Farzati http://luisfarzati.github.io/angulartics
 * License: MIT
 */
(function (angular) {
    'use strict';

    /**
     * @ngdoc overview
     * @name angulartics.kissmetrics
     * Enables analytics support for Omniture aka Adobe analytics
     */
    angular.module('angulartics.omniture', ['angulartics'])
        .config(['$analyticsProvider', function ($analyticsProvider) {

            angulartics.waitForVendorApi('s', 500, function (s) {
                console.log('Omniture READY!');
                console.log(s);
                $analyticsProvider.registerPageTrack(function (path) {
                    console.log('OMMNITURE TRACK PAGE ' + path);
                    if (typeof s !== 'undefined') {

                        // todo this needs to be implemented on the omniture side..
                        //s.clearVars();

                        var stripAccountNo = path.replace(/\/[0-9]{12}/, '');
                        var o = "my:my account" + stripAccountNo.replace(/\//g, ':');
                        console.log(o);
                        s.pageName = o;
                        s.t();
                    }
                });
            });

            angulartics.waitForVendorApi('s', 500, function (s) {
                $analyticsProvider.registerEventTrack(function (action, properties) {
                    //_kmq.push(['record', action, properties]);
                    console.log('OMMNITURE TRACK EVENT ' + action + properties);
                    console.log(properties);
                    console.log('---------------------------------------------');

                    if (angular.isDefined(properties)) {
                        if (properties.type == 'contextData') {
                            s.contextData[properties.key] = properties.value;
                            s.t();
                        } else if (properties.type == "formEvent") {
                            // todo add form event tracking

                        }
                    } else {
                        s.events = action;
                        s.t();
                    }

                });
            });
        }]);
})(angular);