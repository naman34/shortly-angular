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
  $scope.spinnerDisplay = false;
  $scope.linkDisplay = false;
  $scope.submit = function(){
    $scope.spinnerDisplay = true;
    LinkService.postLink($scope.url).then(function(link){
      console.log('Link submitted', link);
      $scope.link = link.data;
      $scope.spinnerDisplay = false;
      $scope.linkDisplay = true;
    });
  };
});