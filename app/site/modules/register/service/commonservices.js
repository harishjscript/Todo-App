
var app = angular.module('todoApp');
app.factory('mainService', mainService);
function mainService($http, $q) {
  var mainService = {
    userregister: userregister,
    getTasks: getTasks,
    getoverdueTasks: getoverdueTasks,
    editTask: editTask,
    deleteTask: deleteTask,
    sortTask: sortTask
  };
  return mainService;
  function userregister(data) {
    var deferred = $q.defer();
    $http({
      method: 'POST',
      url: '/todo/save',
      data: data
    }).success(function (data) {
      deferred.resolve(data);
    }).error(function (err) {
      deferred.reject(err);
    });
    return deferred.promise;
  }

  function getTasks() {
    var deferred = $q.defer();
    $http({
      method: 'GET',
      url: '/todo/gettasks'
    }).success(function (data) {
      deferred.resolve(data);
    }).error(function (err) {
      deferred.reject(err);
    });
    return deferred.promise;
  }

  function getoverdueTasks() {
    var deferred = $q.defer();
    $http({
      method: 'GET',
      url: '/todo/getoverduetasks'
    }).success(function (data) {
      deferred.resolve(data);
    }).error(function (err) {
      deferred.reject(err);
    });
    return deferred.promise;
  }

  function sortTask(data) {
    var deferred = $q.defer();
    $http({
      method: 'POST',
      url: '/todo/sorttask',
      data: data
    }).success(function (data) {
      deferred.resolve(data);
    }).error(function (err) {
      deferred.reject(err);
    });
    return deferred.promise;
  }

  function editTask(id) {
    var deferred = $q.defer();
    $http({
      method: 'POST',
      url: '/todo/edittask',
      data:{'id':id}
    }).success(function (data) {
      deferred.resolve(data);
    }).error(function (err) {
      deferred.reject(err);
    });
    return deferred.promise;
  }

  function deleteTask(id) {
    var deferred = $q.defer();
    $http({
      method: 'POST',
      url: '/todo/deletetask',
      data:{'id':id}
    }).success(function (data) {
      deferred.resolve(data);
    }).error(function (err) {
      deferred.reject(err);
    });
    return deferred.promise;
  }
}
