// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'ngCordova', 'ngCordovaOauth'])

  .constant('APP_ID', '1207340725985451')/*FB APP ID*/
  .constant('REDIRECT_URI', "http://localhost:8100/oauthcallback.html")/* facebook redirect uri for ajjenda app */

.run(function($ionicPlatform, $state, $rootScope, $cordovaPush) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

    /*Notification Code*/
    document.addEventListener("deviceready", function () {
      var device = ionic.Platform.device();
      var pushConfig = null;
      if (device.platform.toLowerCase() === 'android') {
        pushConfig = {
          "senderID": "738757235779"
        };
      } else { /*IOS*/
        pushConfig = {
          "badge": true,
          "sound": true,
          "alert": true
        };
      }

      $cordovaPush.register(pushConfig).then(function (deviceToken) {
        // Success -- send deviceToken to server, and store for future use
        console.log("deviceToken: " + deviceToken);
        $rootScope.deviceId=deviceToken;
      }, function (err) {
        // window.plugins.toast.showShortBottom("Registration error  " + err);
      });


      $rootScope.$on('$cordovaPush:notificationReceived', function (event, notification) {
        $rootScope.notificationObject=notification;
        $rootScope.regid=notification.regid;
        if (notification.alert) {
          navigator.notification.alert(notification.alert);
        }

        if (notification.sound) {
          var snd = new Media(event.sound);
          snd.play();
        }

        if (notification.badge) {
          $cordovaPush.setBadgeNumber(notification.badge).then(function (result) {
            // Success!
          }, function (err) {
            // An error occurred. Show a message to the user
          });
        }


        switch (notification.event) {
          case 'registered':
            if (notification.regid.length > 0) {
              $rootScope.deviceId=notification.regid;
              console.log("id ", notification.regid);
            }
            break;

          case 'message':
            //alert("Your message: "+notification.message);
            window.plugins.toast.showShortBottom("Message: "+notification.message);
            break;

          case 'error':
            // alert('GCM error = ' + notification.msg);
            break;

          default:
            // alert('An unknown GCM event has occurred');
            break;
        }


      });

    }, false);

  });

    $rootScope.name =  "";


})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
    $ionicConfigProvider.navBar.alignTitle("center");
    $ionicConfigProvider.backButton.text('').icon('ion-arrow-left-c').previousTitleText(false);
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })
    .state('app.login', {
      cache:false,
      url: '/login',
      views: {
        'menuContent': {
          templateUrl: 'templates/login.html',
          controller: 'LoginCtrl'
        }
      }
    })

    .state('app.home', {
      url: '/home',
      views: {
        'menuContent': {
          templateUrl: 'templates/home.html',
          controller: 'HomeCtrl'
        }
      }
    })


  ;
  // if none of the above states are matched, use this as the fallback
    var flag  = window.localStorage.getItem('login_flag');
    console.log('Flag', flag);
    if(flag ==  'true'){
      $urlRouterProvider.otherwise('/app/home');
    }
    else{
      $urlRouterProvider.otherwise('/app/login');
    }

});
