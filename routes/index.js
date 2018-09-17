
'use strict';
module.exports = function (app) {
  try {
    var todo = require('../controller/todo.js')(app);
    var mobile = require('../controller/mobile.js')(app);

    //site
    app.post('/todo/save', todo.save);
    app.get('/todo/gettasks', todo.getTasks);
    app.get('/todo/getoverduetasks', todo.getoverdueTasks);
    app.post('/todo/edittask', todo.editTask);
    app.post('/todo/deletetask', todo.deleteTask);
    app.post('/todo/sorttask', todo.sorttask);
    //


    //mobile
    app.post('/task/create', mobile.create);
    app.get('/task/gettasks', mobile.getTasks);
    app.get('/task/destroy/:id', mobile.destroy);
    app.post('/task/update', mobile.update);
    //

  } catch (e) {
    console.log("index error", e);
  }
}
