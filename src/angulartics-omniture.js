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
                $analyticsProvider.registerEventTrack(function (action, properties, event) {
                    //_kmq.push(['record', action, properties]);
                    console.log('OMMNITURE TRACK EVENT ' + action + properties);
                    console.log(properties);
                    console.log(event);
                    console.log('---------------------------------------------');

                    if (angular.isDefined(properties) && angular.isDefined(properties.type)) {
                        console.log('------ OMNITURE - track via properties -----------');
                        if (properties.type == 'contextData') {
                            console.log('------ OMNITURE - track context data -----------');
                            console.log(properties);
                            if(angular.isDefined(properties.subKey)){
                                if(angular.isUndefined(s.contextData[properties.key])){
                                    s.contextData[properties.key] = {};
                                }
                                s.contextData[properties.key][properties.subKey] = properties.value;
                            }else{
                                s.contextData[properties.key] = properties.value;
                            }
                            if(angular.isUndefined(properties.wait)){
                                s.t();
                            }
                        }
                    } else {
                        if(action == "formEvent"){
                            if(angular.isDefined(event.currentTarget.form.name) && angular.isDefined(event.currentTarget.name)){
                                var o = event.currentTarget.form.name + ":"+event.currentTarget.name;
                                console.log("OMNITURE LOG FORM CHANGE to : "  + o);
                                s.prop19 = o;
                                s.t();
                            }
                        }else{
                            s.events = action;
                            s.t();
                        }
                    }

                });
            });
        }]);
})(angular);
