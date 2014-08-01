require.config({
    paths: {
        'angular': 'lib/angular/angular',
        'angularAMD': 'lib/angularAMD/angularAMD',
        'uiRouter': 'lib/angular-ui-router/release/angular-ui-router'
    },
    shim: {
        'angularAMD': ['angular'],
        'uiRouter': ['angular']
    },
    deps: ['app']
});
