module.exports = function () {
  var MongoClient = require('mongodb').MongoClient;
  var ObjectId = require('mongodb').ObjectID;
  var url = "mongodb://localhost:27017/";
  var controller = {};
  controller.create = function (req, res) {
    //dueDate should be 2014-06-09 in this format
    req.checkQuery('name', 'name is required and should be string').notEmpty();
    req.checkQuery('priority', 'priority is required and should be number').notEmpty();
    req.checkQuery('dueDate', 'date is required and should be date format').notEmpty();  //should be 2014-05-06 or 06-05-2014
    var errors = req.validationErrors();
    if (errors) {
        res.send({'status':500,'errors':[{"ValidationError":{'error':errors}}]});
        return;
    }
    MongoClient.connect(url, function (err, db) {
      if (err) {
        res.send({ status: 0, msg: 'failure' })
      } else {
        var dbo = db.db("todo");
        var currentdate = new Date();
        var duedate = new Date(req.query.dueDate);
        var datestring1 = currentdate.getDate()  + "-" + (currentdate.getMonth()+1) + "-" + currentdate.getFullYear();
        var datestring2 = '';
        if(duedate) {
           datestring2 = duedate.getDate()  + "-" + (duedate.getMonth()+1) + "-" + duedate.getFullYear();
        }
        var data = {};
        data.name = req.query.name;
        data.priority = req.query.priority;
        data.date = req.query.dueDate;
        if(datestring2<datestring1) {
          data.status = 2;
        } else {
          data.status = 1;
        }
        data.createdAt = new Date();
        data.updatedAt = new Date();
        dbo.collection("task").insert(data, function (err, result) {
          if (err) {
            res.send({ status: 0, msg: 'Task creation failed' })
          } else {
            res.send(result.ops);
          }
        });
      }
    });
  }

  controller.getTasks = function (req, res) {
    MongoClient.connect(url, function (err, db) {
      if (err) {
        res.send({ status: 0, msg: 'failure' })
      } else {
        var dbo = db.db("todo");
        dbo.collection("task").find({}).sort({ "priority": -1 }).toArray(function(err, result) {
          if (err) {
            res.send({ status: 0, 'result': [] });
          } else {
            db.close(function() {
              res.send(result);
            });
          }
        });
      }
    });
  }

  controller.destroy = function (req, res) {
    req.checkParams('id', "No id provided").notEmpty();
    var errors = req.validationErrors();
    if (errors) {
        res.send({'status':400,'errors':errors[0].msg});
        return;
    }
    var id = '';
    if(ObjectId.isValid(req.params.id)) {
      id = ObjectId(req.params.id);
    } else {
      res.send({'status':400,'ValidationError':"Invalid ObjectId"});
      return;
    }
    MongoClient.connect(url, function (err, db) {
      if (err) {
        res.send({ status: 0, msg: 'failure' });
      } else {
        var dbo = db.db("todo");
        var myobj = { '$set': { 'status':0 } };        //when destroy status turns to 0 fr respective id
        dbo.collection("task").update({ '_id': id },myobj, function (err, result) {
          if (err) {
            res.send({ status: 0, msg: 'failure' });
          } else {
            dbo.collection("task").findOne({ '_id': id }, function (err, task) {
              if (err || !task) {
                res.send({ status: 0, 'result': '' });
              } else {
                res.send(task);
              }
            });
          }
        });
      }
    });
  }

  controller.update = function (req, res) {

    req.checkBody('name', 'name is required and should be string').notEmpty();
    req.checkBody('priority', 'priority is required and should be number').notEmpty();
    req.checkBody('id', 'id is required and should be ObjectId').notEmpty();
    req.checkBody('dueDate', 'date is required and should be date format').notEmpty();     //should be 2014-05-06 or 06-05-2014
    var errors = req.validationErrors();
    if (errors) {
      res.send({'status':500,'errors':[{"ValidationError":{'error':errors}}]});
      return;
    }

    var id = '';
    if(ObjectId.isValid(req.body.id)) {
      id = ObjectId(req.body.id);
    } else {
      res.send({'status':400,'ValidationError':"Invalid ObjectId"});
      return;
    }
    var myobj = {};
    var currentdate = new Date();
    var duedate = new Date(req.body.dueDate);
    var datestring1 = currentdate.getDate()  + "-" + (currentdate.getMonth()+1) + "-" + currentdate.getFullYear();
    var datestring2 = '';
    if(duedate) {
       datestring2 = duedate.getDate()  + "-" + (duedate.getMonth()+1) + "-" + duedate.getFullYear();
    }
    if(datestring2<datestring1) {
      myobj = { '$set': { 'name': req.body.name, 'date': new Date(duedate), 'priority': req.body.priority, 'status':2 } };
    } else {
      myobj = { '$set': { 'name': req.body.name, 'date': new Date(duedate), 'priority': req.body.priority, 'status':1 } };
    }

    MongoClient.connect(url, function (err, db) {
      if (err) {
        res.send({ status: 0, msg: 'failure' });
      } else {
        var dbo = db.db("todo");
        dbo.collection("task").update({ '_id': id },myobj, function (err, result) {
          if (err) {
            res.send({ status: 0, msg: 'failure' });
          } else {
            dbo.collection("task").findOne({ '_id': id }, function (err, task) {
              if (err || !task) {
                res.send({ status: 0, 'result': '' });
              } else {
                res.send(task);
              }
            });
          }
        });
      }
    });
  }
  return controller;
}
