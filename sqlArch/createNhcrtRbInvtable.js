const express = require('express')
const router = express.Router()
const mysql = require('mysql')
const connection = mysql.createConnection({
  host: process.env.RB_HOST,
  user: process.env.RB_USER,
  password: process.env.RB_PW,
  database: process.env.RB_DB,
  multipleStatements: true,
  debug: true
})

module.exports = {
  createNhcrtRbInvTable: router.post('/createNhcrtRbInvTable', (req, res, next) => {
    const createTablePostBody = req.body
    let tableName = createTablePostBody['tblNamePost']
    let columnNames = []
    let tableHeaders = createTablePostBody['crtTblPost']
    let tableHeadersArray = tableHeaders.split(',')
    for (let i = 0; i < tableHeadersArray.length; i++) {
      let columnName = tableHeadersArray[i] + ' VARCHAR(255)'
      console.log(`columnName==> ${columnName}`)
      columnNames.push(columnName)
    }

    let mySqlQuery = `DROP TABLE IF EXISTS ${tableName};
    CREATE TABLE ${tableName} (ri_t0d int NOT NULL AUTO_INCREMENT, ${columnNames}, PRIMARY KEY (ri_t0d));`

    connection.query(mySqlQuery, (error, response) => {
      console.log(error || response);
    }).on('end', function () {
      // all rows have been received
      // connection.destroy()
      res.render('vw-rbInvUpdater', { //*****CRITICAL TO PUT THIS HERE; SOLVES [ERR_HTTP_HEADERS_SENT] error*****--t0d
        title: `vw-rbInvUpdater Table Created: <<${tableName}>>`,
        sqlTableCreated: {
          tableName: tableName,
          columnNames: columnNames,
          basicColumnNames: tableHeadersArray
        },
      });
    })
  })
}