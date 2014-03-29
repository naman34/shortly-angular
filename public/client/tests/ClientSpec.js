describe('Shortly', function(){
  var scope; //we'll use this scope in our tests

  //mock Shortly to allow us to inject our own dependencies
  beforeEach(angular.mock.module('Shortly'));

  //mock the controller for the same reason and include $rootScope and $controller
  beforeEach(angular.mock.inject(function($controller, $rootScope){
    console.log('--');
    //create an empty scope
    linksScope = $rootScope.$new();
    createScope = $rootScope.$new();

    //declare the controller and inject our empty scope
    $controller('Links', {$scope: linksScope});
    $controller('Create', {$scope: createScope});

  }));

  it('should ensure addition is correct', function() {
    expect(1+1).toEqual(2);
  });

  it("Links Controller should have method refresh", function() {
    expect(typeof linksScope.refresh === 'function').toEqual(true);
  });

  it("Links Controller should fetch links", function() {
    linksScope.refresh().then(function(){
      expect(!!linksScope.links).toEqual(true);
      expect( typeof linksScope.links === 'object').toEqual(true);
      expect( Array.isArray(linksScope.links)).toEqual(true);
    });
  });

  it("url should be empty by default and it should not be valid", function(){
    expect(!createScope.url).toEqual(true);
  });

  it("should correctly validate urls", function(){
    expect(!createScope.url).toEqual(true);
    createScope.url = "adjchadcb";
    createScope.isValidUrl();
    expect(createScope.urlIsValid).toEqual(false);

    createScope.url = "http://www.google.com";
    createScope.isValidUrl();
    expect(createScope.urlIsValid).toEqual(true);
  });

  it("should not submit invalid URLs", function(){

    createScope.url = "adjchadcb";
    createScope.isValidUrl();
    expect(createScope.urlIsValid).toEqual(false);

    expect(createScope.submit()).toEqual(undefined);
  });

  it("should submit valid URLs", function(){

    var returnedLink;
    var fetchDone = false;

    createScope.url = "http://www.google.com";
    createScope.isValidUrl();
    expect(createScope.urlIsValid).toEqual(true);

    expect(typeof createScope.submit === 'function').toEqual(true);

    var promise = createScope.submit();

    expect(typeof promise.then === 'function').toEqual(true);

    promise.then(function(link){
      console.log("got it back", link);
      returnedLink = link.data.url;
      fetchDone = true;
    })
    .catch(function(err){
      returnedLink = err;
      fetchDone = true;
    });

    waitsFor(function(){
      return fetchDone;
    }, 10000);

    runs(function(){
      expect(returnedLink).toEqual("http://www.google.com");
    });
  });

  // it("should get back same link as submitted", function(){

  //   createScope.url = "http://www.google.com";
  //   createScope.isValidUrl();
  //   expect(createScope.urlIsValid).toEqual(true);

  // });

  // it('should have service named LinkService that performs get links', ['LinkService', function(LinkService){
  //   console.log('LinkService GET');
  // }]);
});