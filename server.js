const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const sqlite3 = require('sqlite3').verbose();
const Promise = require('bluebird');
app.use(bodyParser.json());

app.get('/getAllTimesheets', function (req, res) {
   let db = new sqlite3.Database("./ClientData.db");
      db.all("SELECT * FROM ClientData", (err, row) => {
        if (err) {
          reject(err)
        } else {
          const myJSON = JSON.stringify(row);
          res.end(myJSON);
        }
      })
})

app.get('/getTimesheets/:clientid', function (req, res) {
  let clientId = req.params.clientid;

   let db = new sqlite3.Database("./ClientData.db");
      db.all("SELECT * FROM ClientData WHERE Client = ?", [clientId], (err, row) => {
        if (err) {
          reject(err)
        } else {
          const myJSON = JSON.stringify(row);
          res.end(myJSON);
        }
      })
})

app.post('/createTimesheet/', function (req, res) {
  const projectDate = req.body.projectdate;
  const client = req.body.client;
  const project = req.body.project;
  const projectCode = req.body.projectcode;
  const hours = req.body.hours;
  const billable = req.body.billable;
  const firstName = req.body.firstname;
  const lastName = req.body.lastname;
  const billableRate = req.body.billablerate;

  var createString = "INSERT INTO ClientData (ProjectDate, Client, Project, ProjectCode, Hours, Billable, FirstName, LastName, BillableRate)"
  createString += ` VALUES ('${projectDate}', '${client}', '${project}', '${projectCode}', '${hours}', '${billable}', '${firstName}', '${lastName}', '${billableRate}')`

  let db = new sqlite3.Database("./ClientData.db");
  db.run((createString), function(err) {
    if (err) {
      console.log("Error Inserting Data:");
      console.log(err.message);
      res.sendStatus(500);
    }
    else {
      console.log(`Inserted Record`);
      res.sendStatus(200);
    }
  });
})

var server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port
   console.log("Example app listening at http://%s:%s", host, port)
})
