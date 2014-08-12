Messages
========
**NGeteor Style**
-----------------

Meteor
------
Recently, I discovered Meteor, a full-stack javascript framework (out of the box templating system, schema-less database to DOM synchronization, and not to mention websockets) with the ability to produce high quality applications in no time. The perfect tool for a beginner developer to pick up!  Meteor makes it simple to set up, and quickly get it up and running. There is no need to import your Javascript or CSS because it will do it automatically for you and plus most Javascript plugins can be found on Atmosphere, a place to explore Meteor packages. To prove how easy it is, I saw my apprentice, create a beautiful website in 2 - 3 days with zero web development skills and only a background in graphic design. (Check it out here - http://eddygzz9.meteor.com/)  Just create a new Meteor project, install needed packages, develop it, and run it. Whereas other frameworks require specific setup, and usually require tools like grunt to compile, auto-reload, and serve your application. There is no need for boilerplates, or Yeoman. With Meteor, life is simple. As I did more and more research on Meteor, I discovered the amazing and powerful potential it beholds. It is the perfect tool for prototyping. Meteor combines both frontend and backend in one place, with minimal effort. Currently, Meteor has not reached 1.0 but with its integrated accounts and security Meteor can be used to create a production application.

AngularJS
---------
When I discovered Meteor, I had been working with AngularJS, a very powerful web application framework that makes declarative templating and databinding seamless. So I thought, why not COMBINE them! Together, I can use all of Meteor’s backend framework, that has accounts, a schema-less database and websockets, with AngularJS templating and databinding to augment or even replace Meteor’s primitive templating system.  By using Meteor’s backend framework, there would be no need to worry about building a RESTful API, defining specific URLs or even an envelope structure, all I have to do is send a Javascript Object. Meteor’s templating system is based on Handlebars and does not support declaratives or automatic data-binding like AngularJS does. Combining them is the birth of a new monster.

I also noticed Meteor loads all javascripts and all templates at load time, which to me is not web application calibre. We need to be able to enable asynchronous (on-demand) loading. Therefore we need AMD (Asynchronous Module Definition) which is appropriate for modern browser environments to improve performance and load times.

Research
--------
I did my research first, of course. I found a github repo ngMeteor (https://github.com/loneleeandroo/ngMeteor/), who claims, and I quote, “The simplest no-conflict way to use AngularJS with Meteor, Meteorite and Atmosphere Smart Packages.” but as soon as I kept reading, I read the heading, “New Data-Binding to avoid conflict” with Handlebars, ngMeteor changed the default AngularJS data bindings from {{foo}} to [[foo]]. Wait a minute, does this mean that I cannot reuse any of my old AngularJS code?!? Sure enough, you have to use their “Module Injection” methods or make “ngMeteor module smart packages”.  This was not what I was looking for.

So I kept doing my research and I found a blog, “The Wonderful Duo” (https://medium.com/@zfxuan/the-wonderful-duo-using-meteor-and-angularjs-together-4d603a4651bf) by Zefei Xuan. In my opinion, this guy was up to something, but it wasn’t quite what I was looking for. A folly intricate template solution, and just too many “headaches and hiccups”. I had to come up with something easier and simpler. Something that did not require me to worry about template workarounds, loading orders or problems with bootstrapping AngularJS.

Then I found ng-meteor (https://github.com/olanod/ng-meteor/),  which integrates Meteor and AngularJS pretty well, but it uses blade and I’m not too familiar with it. It also means I can not drop my old AngularJS code. This is a no go.

The solutions I found work to an extent, but they just seem a little too complicated and conflicting.

Solution
--------
I was able to come up with a clean solution with the help of angularAMD, a “utility to facilitate the use of RequireJS in AngularJS applications supporting on-demand loading”, RequireJS (duh), and the AngularUI Router. In this solution AngularJS runs completely separate but on top of Meteor. It uses Meteor’s global variables to replace typical AngularJS RESTful clients (lower-level `$http`, and higher-level `$resource`), doing so, has an immediate bonus, websockets! Two birds with one stone.

Tutorial
--------
A simple messaging system, similar to a chat. 

Start by making a Meteor project, easy indeed.

    meteor create myapp

This created a folder named myapp, and inside this folder add a `client`, `public`, and `server` folder. Also delete `myapp.css` and `myapp.js`, as there is no need for them. 

    cd myapp
    mkdir client public server
    rm myapp.css myapp.js

Edit `myapp.html`, only needs a div with a ui-view directive to inject the AngularJS app.

    <head>
      <title>myapp</title>
    </head>

    <body>
      <div ui-view class="container-fluid"></div>
    </body>

The content inside both the `client` and `server` folders get loaded automatically by Meteor (anything inside the `server` folder is inaccessible by the client, of course) whereas the content inside the `public` (and `private`) folder does not get loaded. With this in mind, drop AngularJS in the `public` folder for the asynchronous loading to happen (by doing so it makes it easy to remove the app from Meteor or import an old app). To efficiently get AngularJS, angularAMD, and AngularUI Router inside the `public` folder, configure bower by creating a file `.bowerrc` inside the `public` folder.

    cd public
    nano .bowerrc

Note nano is a Terminal application used to edit text files in a simple and familiar manner. 

Use your favorite code editor to add the following content. Specifies the name of the directory to install bower components, in this case `lib`.

    {
        "directory" : "lib"
    }

Install angularAMD and AngularUI Router. This includes AngularJS.

    bower install angularAMD angular-ui-router

Create `app.js` in the `public` folder. Inside is the app router, an autorun factory by Zefei Xuan, and the angularAMD bootstrap. 

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

Make a `home` folder for the home page.
 
    mkdir home
    cd home

Make an `index.html`, in here notice the `ng-repeat`, `ng-submit`, `ng-model` and the `{{message.text}}`.

    <div class="page-header">
        <h1>Messages</h1>
    </div>
    <div id="scroller" class="well" style="height: 300px; overflow-y: scroll;">
        <div class="alert alert-info" ng-repeat="message in messages">{{message.text}}</div>
    </div>
    <form ng-submit="submit()">
        <div class="input-group">
            <input type="text" class="form-control" ng-model="message"/>
            <span class="input-group-btn">
                <button type="submit" class="btn btn-default">Send</button>
            </span>
        </div>
    </form>

Now, create another `app.js`. This is the home page controller where AngularJS and Meteor bind.

    define(['app'], function(app) {
        // Declare Meteor Collection client side
        var messages = new Meteor.Collection('messages');
        app.register.controller('homeCtrl', ['$scope', 'autorun',
            function($scope, autorun) {
                angular.extend($scope, {
                    messages: [],
                    message: '',
                    submit: function() {
                        // Insert into Meteor Collection
                        messages.insert({
                            text: $scope.message
                        });
                        // Clear Input
                        $scope.message = '';
                    }
                });
                // Binds Meteor Colletion to Angular scope every time Meteor updates 
                autorun($scope, function () {
                    // Populate messages
                    $scope.messages = messages.find().fetch();
                    // Scroll the Scroller
                    setTimeout(function() {
                        var scroller = document.getElementById("scroller");
                        scroller.scrollTop = scroller.scrollHeight;
                    }, 100);
                });
             }
        ]);
        return app;
    });
      

Remembering that Meteor automatically loads the content inside the `client` folder, move to the `client` folder and create a `compatibility` folder which is specifically used for 3rd party JS libraries that export a global symbol. Drop RequireJS in here.

    cd ../../../client
    mkdir compatibility
    cd compatibility
    curl -O http://requirejs.org/docs/release/2.1.14/minified/require.js
    cd ../

For the latest version of RequireJS, visit http://requirejs.org/docs/download.html.

Back in the `client` folder, create `main.js`, with the content below. This is the starting point for any RequireJS app. Used to define components and their dependencies.
The cool part is that Meteor loads this file automatically to kick off the AngularJS app. 

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

Inside `server` folder make an `app.js` to let the client write into the database.

    // Declare Meteor Collection server side
    Events = new Meteor.Collection('messages');

Run meteor from `myapp` folder.

    meteor

Make things pretty.

    mtr add bootstrap-3
    meteor

and Vuala!

Conclusion
----------
I thought about adding AngularJS, AngularAMD and AngularUI Router inside the `client` folder to get them loaded by Meteor automatically but then I realized I would have dependencies issues, since AngularAMD and AngularUI Router both depend on AngularJS to be loaded first. Sure there is a few Meteor Require plugins that can handle the dependencies but it might be too much work, and only to get rid of the `main.js` file, I’d rather keep my `main.js` and use it to asynchronously load AngularJS plugins, for explicit pages. 

On my next blog, I would like to show how to integrate more pages using the AngularUI Router as well as some Meteor account integration.

Feel free to checkout **NGeteor** my AngularJS and Meteor work in progress http://ngeteor.meteor.com/#/, with accounts and a working calendar.