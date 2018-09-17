'use strict';
var routerApp = angular.module('todoApp', ['ui.router',
 'ngAnimate',
 'ngSanitize',
 'ui.bootstrap',
 'toaster'
 ])
.run(['$rootScope', '$state', '$location', '$http', '$stateParams', '$window', function ($rootScope, $state, $location, $http, $stateParams, $window) {
  $rootScope.$state = $state;
}])
  .controller('rootCtrl', function ($window, $scope, $rootScope, $state, $uibModal, mainService) {
    var mc = this;
  })
.config(function ($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/todo');
  $stateProvider
    .state('todo', {
      url: '/todo',
      title: 'Add Task',
      controller: 'todoController',
      controllerAs: 'USR',
      templateUrl: 'modules/register/views/todo.html'
    })
    .state('edit', {
      url: '/edit-task/:id',
      title: 'Edit Task',
      controller: 'mainController',
      controllerAs: 'USR',
      templateUrl: 'modules/register/views/todo.html',
      resolve: {
            editTaskResolve : function(mainService,$stateParams) {
              if($stateParams.id) {
                var taskid = $stateParams.id;
                return mainService.editTask(taskid);
           }
        }
      }
    })
    .state('pending', {
      url: '/pending',
      title: 'Pending Task',
      controller: 'pendingController',
      controllerAs: 'HUSR',
      templateUrl: 'modules/register/views/pendingtask.html'
    })
    .state('overdue', {
      url: '/overdue',
      title: 'Overdue Task',
      controller: 'overdueController',
      controllerAs: 'PUSR',
      templateUrl: 'modules/register/views/overduetask.html'
    })
})

.controller('dateController', ['$scope', function($scope) {

  $scope.today = function() {
    $scope.dt = new Date();
  };
  $scope.today();

  $scope.clear = function () {
    $scope.dt = null;
  };

  // Disable weekend selection
  $scope.disabled = function(date, mode) {
    return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
  };

  $scope.toggleMin = function() {
    $scope.minDate = $scope.minDate ? null : new Date();
  };
  $scope.toggleMin();

  // Open pop-up
  $scope.open = function($event) {
    $event.preventDefault();
    $event.stopPropagation();
    $scope.opened = true;
  };

  $scope.dateOptions = {
    formatYear: 'yy',
    startingDay: 1
  };

  $scope.formats = [
    'dd-MMMM-yyyy',
    'yyyy/MM/dd',
    'dd.MM.yyyy',
    'shortDate'
  ];
  $scope.format = $scope.formats[0];
}])
