angular.module('Shortly', ['ngRoute'])
.config(function($routeProvider){
  $routeProvider.when('/', {templateUrl: 'links.html'});
  $routeProvider.when('/create', {templateUrl: 'create.html'});
})
.service('LinkService', function($http){
  this.getLinks = function(){
    return $http({
      method: 'GET',
      url: '/links'
    }).then(function(links){
      return links.data;
    });
  };

  this.postLink = function(url){
    return $http({
      method: 'POST',
      data: {url: url},
      url: '/links'
    }).then(function(link){
      return link;
    });
  };
})

.controller('Links', function($scope, LinkService){
  $scope.refresh = function(){
    LinkService.getLinks().then(function(links){
      console.log(links);
      $scope.links = links;
    });
  };

  $scope.refresh();
})

.controller('Create', function($scope, LinkService){
  var rValidUrl = /^(?!mailto:)(?:(?:https?|ftp):\/\/)?(?:\S+(?::\S*)?@)?(?:(?:(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[0-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))|localhost)(?::\d{2,5})?(?:\/[^\s]*)?$/i;

  $scope.urlIsValid = false;
  $scope.isValidUrl = function() {
    $scope.urlIsValid = !! $scope.url.match(rValidUrl);
  };

  $scope.spinnerDisplay = false;
  $scope.linkDisplay = false;
  $scope.submit = function(){
    if($scope.urlIsValid === false) {
      return;
    } else {
      $scope.spinnerDisplay = true;
      LinkService.postLink($scope.url).then(function(link){
        console.log('Link submitted', link);
        $scope.link = link.data;
        $scope.spinnerDisplay = false;
        $scope.linkDisplay = true;
      });
    }
  };
});