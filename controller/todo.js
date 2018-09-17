
module.exports = function () {
  var MongoClient = require('mongodb').MongoClient;
  var ObjectId = require('mongodb').ObjectID;
  var url = "mongodb://localhost:27017/";
  var controller = {};
  controller.save = function (req, res) {
    MongoClient.connect(url, function (err, db) {
      if (err) {
        res.send({ status: 0, msg: 'failure' })
      } else {
        var dbo = db.db("todo");
        var myobj = {};
        var currentdate = new Date();
        var duedate = new Date(req.body.date);
        var datestring1 = currentdate.getDate()  + "-" + (currentdate.getMonth()+1) + "-" + currentdate.getFullYear();
        var datestring2 = duedate.getDate()  + "-" + (duedate.getMonth()+1) + "-" + duedate.getFullYear();
        if(datestring2<datestring1) {
            myobj = { name: req.body.name, date: new Date(req.body.date), priority: req.body.priority, status:2 };
        } else {
            myobj = { name: req.body.name, date: new Date(req.body.date), priority: req.body.priority, status:1 };
        }
        //Insert
        if(req.body.id) {
          dbo.collection("task").update({ '_id': ObjectId(req.body.id) },myobj, function (err, result) {
            if (err) {
              res.send({ status: 0, msg: 'failure' })
            } else {
              res.send({ status: 1, msg: 'success' })
            }
          });
        } else {
          dbo.collection("task").insertOne(myobj, function (err, result) {
            if (err) {
              res.send({ status: 0, msg: 'failure' })
            } else {
              res.send({ status: 1, msg: 'success' })
            }
          });
        }
      }
    });
  }



  controller.editTask = function (req, res) {
    MongoClient.connect(url, function (err, db) {
      if (err) {
        res.send({ status: 0, msg: 'failure' })
      } else {
        var dbo = db.db("todo");
        var myobj = { '_id': ObjectId(req.body.id) };
        dbo.collection("task").findOne(myobj, function (err, task) {
          if (err || !task) {
            res.send({ status: 0, 'result': '' })
          } else {
            res.send({ status: 1, 'result': task })
          }
        });
      }
    });
  }

  controller.deleteTask = function (req, res) {
    MongoClient.connect(url, function (err, db) {
      if (err) {
        res.send({ status: 0, msg: 'failure' })
      } else {
        var dbo = db.db("todo");
        var myobj = { '_id': ObjectId(req.body.id) };
        dbo.collection("task").remove(myobj, function (err, task) {
          if (err || !task) {
            res.send({ status: 0, 'result': 'failed' })
          } else {
            res.send({ status: 1, 'result': 'success' })
          }
        });
      }
    });
  }

  controller.sorttask = function (req, res) {
    MongoClient.connect(url, function (err, db) {
      if (err) {
        res.send({ status: 0, msg: 'failure' })
      } else {
        var dbo = db.db("todo");
        var sortQuery = {};
        var getQuery = {};
        if(req.body.overdue) {
          getQuery = { 'status': 2 }
        } else {
          getQuery = { 'status': 1 }
        }
        if(req.body.sorttask=='name') {
          dbo.collection("task").find(getQuery).sort({ "name": 1 }).toArray(function(err, result) {
            if (err) {
              res.send({ status: 0, 'result': [] });
            } else {
              db.close(function() {
                res.send({ status: 1, 'tasks': result });
              });
            }
          });
        } else if(req.body.sorttask=='duedate') {
          dbo.collection("task").find(getQuery).sort({ "date": 1 }).toArray(function(err, result) {
            if (err) {
              res.send({ status: 0, 'result': [] });
            } else {
              db.close(function() {
                res.send({ status: 1, 'tasks': result });
              });
            }
          });
        } else if(req.body.sorttask=='priority') {
          dbo.collection("task").find(getQuery).sort({ "priority": 1 }).toArray(function(err, result) {
            if (err) {
              res.send({ status: 0, 'result': [] });
            } else {
              db.close(function() {
                res.send({ status: 1, 'tasks': result });
              });
            }
          });
        }
      }
    });
  }

  controller.getTasks = function (req, res) {
    MongoClient.connect(url, function (err, db) {
      if (err) {
        res.send({ status: 0, msg: 'failure' })
      } else {
        var dbo = db.db("todo");
        dbo.collection("task").find({'status':1}).sort({ "priority": -1 }).toArray(function(err, result) {
          if (err) {
            res.send({ status: 0, 'result': [] });
          } else {
            db.close(function() {
              res.send({ status: 1, 'tasks': result });
            });
          }
        });
      }
    });
  }

  controller.getoverdueTasks = function (req, res) {
    MongoClient.connect(url, function (err, db) {
      if (err) {
        res.send({ status: 0, msg: 'failure' })
      } else {
        var dbo = db.db("todo");
        dbo.collection("task").find({'status':2}).toArray(function(err, result) {
          if (err) {
            res.send({ status: 0, 'result': [] });
          } else {
            db.close(function() {
              res.send({ status: 1, 'tasks': result });
            });
          }
        });
      }
    });
  }

  return controller;
}
