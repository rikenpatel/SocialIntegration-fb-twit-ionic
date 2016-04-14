
angular.module('starter.services', [])

  .factory('LoadingScreen', function ($ionicLoading, $rootScope, $timeout) {
    return {
      loading: null,
      show: function (msg) {
        $rootScope.message=msg;
        $ionicLoading.show({
          content: '',
          template: '<div class="row" style="color: white;"><div><ion-spinner icon="android"></ion-spinner></div><div style="padding-left: 10px;font-weight: 500;padding-top: 5px;font-size: 12px;">{{message}}</div></div>',
          animation: 'fade-in',
          noBackdrop: true,
          showBackdrop: false,
          maxWidth: 400,
          maxHeight: 100,
          showDelay: 200
        });
        $timeout(function () {
          $ionicLoading.hide();
        }, 3000);
      },
      hide: function () {
        $ionicLoading.hide();
      }
    }
  })

    .factory('HTTP', function ($http, $rootScope, $ionicLoading) {
        return {
            get: function (url) {

                return $http({
                    method: 'GET',
                    url: url
                });
            }
            /*post: function (url, params) {
                var promise = $http({
                    method: 'POST',
                    url: HOST+url,
                    headers: {'Content-type': 'application/json'},
                    data: params
                });
                return promise;
            },*/
           /* uploadUsingDevice : function(url,file,params, modal){
                // alert(JSON.stringify(params));
                var options = new FileUploadOptions();
                options.fileKey = "picture";
                options.chunkedMode = false;
                options.httpMethod = 'POST';
                options.params = params;
                options.headers = {'Content-Type': undefined};
                var ft = new FileTransfer();
                ft.upload(file, encodeURI(HOST + url) , function(success){
                    $ionicLoading.hide();
                  var str=JSON.stringify(success.response);

                    //alert(success.response);
                }, function(err){
                    $ionicLoading.hide();
                    $rootScope.popupMessage('Something went wrong');
                    // alert(JSON.stringify(err));
                }, options);
            }*/
        }
    })

;
