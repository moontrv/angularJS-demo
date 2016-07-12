var app = angular.module('bookListApp', ["ngRoute"])
.controller("HomeController", ["$scope", "BookService", function($scope, BookService){
  $scope.appTitle = "Book List";
  $scope.bookItems = BookService.bookItems;
  $scope.removeItem = function(entry){
    BookService.removeItem(entry);
  };
  $scope.markCompleted = function(entry){
    BookService.markCompleted(entry);
  };
  $scope.$watch(function(){
    return BookService.bookItems;}, function(bookItems){
      $scope.bookItems = bookItems;
    })
}])
.controller("BookListItemsController", ["$scope", "$routeParams", "$location", "BookService", function($scope, $routeParams, $location, BookService){
  $scope.appTitle = "Book List";
  $scope.bookItems = BookService.bookItems;
  //$scope.bookItem = {id:7, completed:true, itemName: "cheese", date:new Date()};
  //$scope.rp = "Route Parameter Value: " + $routeParams.id

  if(!$routeParams.id){
    $scope.bookItem = {id: 0, completed:false, itemName:"", date:new Date()};
  }else{
    $scope.bookItem = _.clone(BookService.findById(parseInt($routeParams.id)));
  }

  $scope.save = function(){
    BookService.save($scope.bookItem);
    $location.path("/");
  }
  console.log($scope.bookItems);
}]);

app.config(function($routeProvider){
  $routeProvider
    .when("/", {
      templateUrl: "views/bookList.html",
      controller: "HomeController"
    })
    .when("/addItem", {
      templateUrl: "views/addItem.html",
      controller: "BookListItemsController"
    })
    .when("/addItem/edit/:id", {
      templateUrl: "views/addItem.html",
      controller: "BookListItemsController"
    })
    .otherwise({
      redirectTo: "/"
    });
});
// using service BookService
app.service("BookService", function($http){
  var bookService = {};
  bookService.bookItems = [];

  $http.get("data/server_data.json")
    .success(function(data){
      bookService.bookItems = data;
      for(var item in bookService.bookItems){
        bookService.bookItems[item].date = new Date(bookService.bookItems[item].date);
      }
    })
    .error(function(data, status){
      alert("Something is wrong");
    });

  bookService.findById = function(id){
    for(var item in bookService.bookItems){
      if(bookService.bookItems[item].id === id){
        return bookService.bookItems[item];
      }
    }
  }
  bookService.getNewId = function(){
    if(bookService.newId){
      bookService.newId++;
      return bookService.newId;
    }else{
      var maxId = _.max(bookService.bookItems, function(entry){ return entry.id;})
      bookService.newId = maxId.id + 1;
      return bookServicen.newId;
    }
  };
  bookService.removeItem = function(entry){

    $http.post("data/delete_item.json", {id:entry.id})
      .success(function(data){
        if(data.status){
          var index = bookService.bookItems.indexOf(entry);
          bookService.bookItems.splice(index,1);
        }
      })
      .error(function(data, status){

      })
  };
  bookService.save = function(entry){
    var updatedItem = bookService.findById(entry.id);
    if(updatedItem){
      $http.post("data/updated_item.json", entry)
        .success(function(data){
          if(data.status == 1){
            updatedItem.completed = entry.completed;
            updatedItem.itemName = entry.itemName;
            updatedItem.date = entry.date;
          }
        })
        .error(function(data, status){

        })
    }else{

      $http.post("data/added_item.json", entry)
        .success(function(data){
          entry.id = data.newId;
        })
        .error(function(data, status){

        })
      //entry.id = bookService.getNewId();
      bookService.bookItems.push(entry);
    }
  };
  bookService.markCompleted = function(entry){
    entry.completed = !entry.completed;
  };
  return bookService;
});

app.directive("drBookItem", function(){
  return{
    restrict: "E",
    templateUrl: "views/bookItem.html"
  }
});
