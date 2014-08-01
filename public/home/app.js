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
