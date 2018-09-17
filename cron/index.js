'use strict';
module.exports = function (app) {
var CronJob = require('cron').CronJob;
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
var url = "mongodb://localhost:27017/";

var job = new CronJob({
  cronTime: '0 0 0 * * *',    //cron runs every midnight 12 AM
  onTick: function() {
    MongoClient.connect(url, function (err, db) {
      if (err) {
        console.log('DB connection failed');
      } else {
        var dbo = db.db("todo");
        dbo.collection("task").update({ 'status':1,'date':{'$lt': new Date()} },{'$set':{ 'status':2 } },{multi:true}, function (err, result) {
          if (err) {
            console.log('No Tasks Available');
          } else {
            // console.log('Task Updated Successfully');
          }
        });
      }
    });
    /*
     * Runs every weekday (Monday through Friday)
     * at 11:30:00 AM. It does not run on Saturday
     * or Sunday.
     */
  },
  start: false,
  runOnInit: true,
  timeZone: 'America/Los_Angeles'
});
job.start();
}
