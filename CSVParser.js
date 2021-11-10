/*import fetch from 'node-fetch';

const resp = await fetch('file:///users/Connor/GMProject/SampleCodingData.csv')
.then(response => response.text())
.then(text => console.log(text))*/

/*const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World');
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
*/

const fs = require('fs');
const readline = require('readline');
const sqlite3 = require('sqlite3').verbose();

async function parseFileLineByLine(filename) {
  const fileStream = fs.createReadStream(filename);

  const rl = readline.createInterface({
    input: fileStream,
    ctrlfDelay: Infinity
  });

  var headers = [];
  var body = [];

  for await(const line of rl) {
    if (headers.length == 0) {
      headers = line.split(',');
    }
    else {
      body.push(line.split(','));
    }
    //console.log(line.split(','));
  }

  //console.log(headers);
  //console.log(body);
  return [headers, body];
}

function insertData(fileData) {
  var insertString  = "INSERT INTO ClientData (";
  var valuesString = " VALUES ";

  fileData[0].forEach((item, i) => {
    //Need to replace Date with
    if (item === 'Date') {
      insertString += "ProjectDate,";
    }
    else {
      insertString += item.replace(" ", "").replace("?", "") + ",";
    }
  });
  insertString = insertString.slice(0, insertString.length - 1) + ")";
  //console.log(insertString);

  var counter = 0;
  fileData[1].forEach((item, i) => {
    valString = "(";
    item.forEach((subItem, j) => {
      valString += "'" + subItem + "',";
    });
    valString = valString.slice(0, valString.length - 1) + "),";
    valuesString += valString;
    counter ++;
  });
  valuesString = valuesString.slice(0, valuesString.length - 1);
  //console.log(valuesString);

  let db = new sqlite3.Database("./ClientData.db");
  db.run((insertString + valuesString), function(err) {
    if (err) {
      console.log("Error Inserting Data:");
      console.log(err.message);
    }
    else {
      console.log(`Inserted ${counter} Records`);
    }
  });
}

function setupDB() {
  let userDB = new sqlite3.Database("./ClientData.db",
    sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
    (err) => {
        console.log("Database Creation Successful");
    });

  let db = new sqlite3.Database("./ClientData.db");
  const createScript = `CREATE TABLE ClientData (
    Id             INTEGER  PRIMARY KEY AUTOINCREMENT
                            NOT NULL
                            UNIQUE,
    ProjectDate DATETIME,
    Client VARCHAR,
    Project VARCHAR,
    ProjectCode VARCHAR,
    Hours DECIMAL,
    Billable BIT,
    FirstName VARCHAR,
    LastName VARCHAR,
    BillableRate DECIMAL
    );`;
  db.run((createScript), function(err) {
    if (err) {
      console.log("Error Creating Table:");
      console.log(err.message);
    }
    else {
      console.log(`Created Table`);
    }
  });
}

setupDB();
parseFileLineByLine("./ClientData/SampleCodingData.csv").then(
  function(value) {insertData(value);}
);
//console.log(parsedData);
