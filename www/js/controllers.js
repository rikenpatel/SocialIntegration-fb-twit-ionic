angular.module('starter.controllers', [])

  .controller('AppCtrl', function ($scope, $state) {

      $scope.logout = function(){
        window.localStorage.setItem('login_flag', false);
        $state.go('app.login');
      }

  })

  .controller('LoginCtrl', function ($scope, HTTP, $ionicSideMenuDelegate, $state, $http, $cordovaOauth, APP_ID, REDIRECT_URI, $rootScope, $ionicLoading) {
    $ionicSideMenuDelegate.canDragContent(false);

    $scope.goHome = function(url){
      $state.go(url);
    };


    $scope.twitterlogin = function(){
      var api_key = "7UTs***********"; //Enter your Consumer Key (API Key)
      var api_secret = "npphq************************"; // Enter your Consumer Secret (API Secret)
      console.log("twitterlogin function got called");
      $ionicLoading.show({template: 'Loading...'});
      $cordovaOauth.twitter('iFXyn525u2OHDSjATd1C1jgMZ', 'nPiUn43u9VCOaFbjeJuPpCEKIWVrTL5KO7xCdNEbI3aYNAfIhz').then(function(result) {
        console.log(result.screen_name);
        //$rootScope.name = result.screen_name;
        window.localStorage.setItem('name', result.screen_name);
        var url = 'http://cordialcode.com/app/api/bigmaps/api/device_register?name='+result.screen_name+'&device_id='+$rootScope.deviceId;
        if($rootScope.deviceId != null){
          $ionicLoading.show();
          HTTP.get(url).success(function (responce) {
            window.localStorage.setItem('login_flag', true);
            console.log("success", responce);
            $ionicLoading.hide();
            $state.go('app.home');

          }).error(function (err) {
            $ionicLoading.hide();
          })
        }
        else{
          window.plugins.toast.showShortBottom("Please check device id");
        }

        $ionicLoading.hide();
      })
    }

    /* send fb profile info to fb social ajjenda api */
    $scope.loginFacebook = function () {

      /* only valid for device */
      if (window.cordova) {
        facebookConnectPlugin.login(["email,user_likes,public_profile,publish_actions"], function (res) {
          facebookConnectPlugin.getAccessToken(function (token) {
            //$window.localStorage.setItem('FB_ACCESS_TOKEN', token);
           // $window.localStorage.setItem('CONNECT_AS_GUEST', "false");
            $scope.GetFBProfileData(token);
          }, function (err) {
           // window.plugins.toast.showShortBottom("couldn't get access token from facebook");
          });
        }, function (err) {
         // window.plugins.toast.showShortBottom("something went go wrong with facebook");
        });
      } else {
        $scope.facebookBrowserLogin();
        /* browser login with facebook */
      }

    };

    $scope.facebookBrowserLogin = function () {
      openFB.init({appId: APP_ID, oauthRedirectURL: REDIRECT_URI});
      openFB.login(
        function (response) {
          if (response.status === 'connected') {
            var token = response.authResponse.accessToken;
            //$window.localStorage.setItem('FB_ACCESS_TOKEN', token);
            //$window.localStorage.setItem('CONNECT_AS_GUEST', "false");
            $scope.GetFBProfileData(token);
          } else {
            alert('Facebook login failed: ' + response.error);
          }
        }, {scope: 'email,user_likes,public_profile,publish_actions'}
      );
    };



    /* get fb profile information */
    $scope.GetFBProfileData = function (token) {
      $ionicLoading.show();
      $http.get("https://graph.facebook.com/v2.5/me",
        {
          params: {
            access_token: token,
            fields: "email,name,gender,first_name",
            format: "json"
          }
        })
        .then(function (result) {
          console.log("fb_data", result);
          $scope.FB_DATA = {
            accessToken: token,
            accountName: result.data.name
            /*image: result.data.picture.data.url*/
          };
          console.log("access token", token);
          console.log("fb object ", result);
          if(result!=null){
            //$rootScope.name = result.data.name;
            window.localStorage.setItem('name', result.data.name);
            var url = 'http://cordialcode.com/app/api/bigmaps/api/device_register?name='+result.data.name+'&device_id='+$rootScope.deviceId;
            if($rootScope.deviceId != null){
              $ionicLoading.show();
              HTTP.get(url).success(function (responce) {
                window.localStorage.setItem('login_flag', true);
                console.log("success", responce);
                $ionicLoading.hide();
                $state.go('app.home');

              }).error(function (err) {
                $ionicLoading.hide();
              })
            }
            else{
              window.plugins.toast.showShortBottom("Please check device id");
            }
            //$state.go('app.home');
          }


          //$window.localStorage.setItem('FB_USER_DATA', angular.toJson(result.data));
          $ionicLoading.hide();
         // $rootScope.InitProfileData();
          //$scope.AttachFBData($scope.FB_DATA);

        }).error(function (err) {
          $ionicLoading.hide();
          alert("Error while getting fb info");
        });


    };




  })


  .controller('HomeCtrl', function ($scope, $ionicSideMenuDelegate, HTTP, $ionicLoading, $rootScope) {
    $ionicSideMenuDelegate.canDragContent(true);

    $scope.message = {};

    $rootScope.name = window.localStorage.getItem('name');


    /*$scope.goHome = function(url){
      $state.go(url);
    };*/

    $scope.sendMessage  = function(){

      //alert($scope.message.text);

      var url = ' http://cordialcode.com/app/api/bigmaps/api/send_notification?name='+$rootScope.name+'&message='+$scope.message.text+'&device_id='+$rootScope.deviceId;
      if($rootScope.deviceId != null){
        $ionicLoading.show();
        HTTP.get(url).success(function (responce) {

          console.log("Message Response", responce);
          $ionicLoading.hide();

        }).error(function (err) {
          $ionicLoading.hide();
        })
      }
      else{
        window.plugins.toast.showShortBottom("Please check device id");
      }


    };

  })



;
