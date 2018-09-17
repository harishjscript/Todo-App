angular.module('todoApp')
  .controller('mainController', mainController)
  .controller('pendingController', pendingController)
  .controller('overdueController', overdueController)
  .controller('todoController', todoController);

  todoController.$inject = ['$scope', '$uibModal', 'mainService', 'toaster', '$state','$stateParams'];
  function todoController($scope, $uibModal, mainService, toaster, $state,$stateParams) {
    var usr = this;
    usr.addtask = 1;
    usr.saveTask = function (data) {
      if(data.priority>0 && data.priority<=5) {
        mainService.userregister(data).then(function (response) {
          if (response.status == 0) {
            toaster.error('Cannot add task');
          } else {
            toaster.success('Task added successfully');
            $state.go('pending');
          }
        });
      } else {
        toaster.error('Priority should be greater than 0 and less than 6');
      }
    }
  }

mainController.$inject = ['$scope', '$uibModal', 'mainService', 'toaster', '$state','editTaskResolve','$stateParams'];
function mainController($scope, $uibModal, mainService, toaster, $state,editTaskResolve,$stateParams) {
  var usr = this;
  if(editTaskResolve) {
    usr.task = {};
    usr.task.name = editTaskResolve.result.name;
    usr.task.priority = editTaskResolve.result.priority;
    usr.task.date = new Date(editTaskResolve.result.date);
  }
  usr.saveTask = function (data) {
    if($stateParams.id) {
      data.id = $stateParams.id;
    }
      mainService.userregister(data).then(function (response) {
        if (response.status == 0) {
          toaster.error('Cannot add task')
        } else {
          toaster.success('Task updated successfully')
          $state.go('pending');
        }
      })
  }
}

pendingController.$inject = ['$window', '$scope', '$uibModal', 'mainService', 'toaster', '$state', '$rootScope'];
function pendingController($window, $scope, $uibModal, mainService, toaster, $state, $rootScope) {
  var husr = this;
  mainService.getTasks().then(function (response) {
    if (response.status == 0) {
      toaster.error('Tasks not available!')
    } else {
      husr.tasklist = response.tasks;
    }
  });

  husr.sort = function(data) {
    mainService.sortTask(data).then(function (response) {
      if (response.status == 0) {
        toaster.error('Tasks not available!');
      } else {
        husr.tasklist = response.tasks;
        $state.go('pending');
      }
  });
}

  husr.deleteTask = function(id) {
    mainService.deleteTask(id).then(function (response) {
      if (response.status == 0) {
        toaster.error('Tasks not deleted!');
      } else {
        toaster.success('Tasks deleted successfully');
        mainService.getTasks().then(function (response) {
          if (response.status == 0) {
            toaster.error('Tasks not available!');
          } else {
            husr.tasklist = response.tasks;
            $state.go('pending');
          }
        });
      }
    });
  }
}

overdueController.$inject = ['$window', '$scope', '$uibModal', 'mainService', 'toaster', '$state', '$rootScope'];
function overdueController($window, $scope, $uibModal, mainService, toaster, $state, $rootScope) {
  var pusr = this;

  mainService.getoverdueTasks().then(function (response) {
    if (response.status == 0) {
      toaster.error('Tasks not available!')
    } else {
      pusr.tasklist = response.tasks;
    }
  });

  pusr.sort = function(data) {
    data.overdue = 1;
    mainService.sortTask(data).then(function (response) {
      if (response.status == 0) {
        toaster.error('Tasks not available!');
      } else {
        pusr.tasklist = response.tasks;
      }
  });
}

}
