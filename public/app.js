define(['angularAMD','uiRouter'], function(angularAMD) {
    var app = angular.module('app', ['ui.router'])
        .config(function($stateProvider, $urlRouterProvider) {
            $urlRouterProvider.otherwise("/");
            $stateProvider
                .state(
                    "home",
                    angularAMD.route({
                        url: '/',
                        templateUrl: 'home/index.html',
                        controller: 'homeCtrl',
                        controllerUrl: 'home/app.js'
                    })
            );
        }).factory('autorun', function() {
            // Notify Angular when Meteor data synchronization occurs
            return function(scope, fn) {
                var comp = Deps.autorun(function(c) {
                    fn(c);
                    if (!c.firstRun) setTimeout(function() {
                        scope.$apply();
                    }, 0);
                });
                scope.$on('$destroy', function() {
                    comp.stop();
                });
                return comp;
            };
        });
    
    angularAMD.bootstrap(app);
    return app;
});
