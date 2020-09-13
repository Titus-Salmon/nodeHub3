var express = require('express');
var router = express.Router();

const odbc = require('odbc')
const DSN = process.env.ODBC_CONN_STRING

const mysql = require('mysql')

const connection = mysql.createConnection({
  host: process.env.RB_HOST,
  user: process.env.RB_USER,
  password: process.env.RB_PW,
  database: process.env.RB_DB,
  debug: true,
  multipleStatements: true
})

const fs = require('fs')

const catapultResArrCache = require('../nodeCacheStuff/cache1')

module.exports = {
  save2CSVcreatePop: router.post('/save2CSVcreatePop', (req, res, next) => {

    catapultResArrCacheValue = catapultResArrCache.take('catapultResArrCache_key') // this also deletes the key

    //begin csv generator //////////////////////////////////////////////////////////////////////////
    const {
      Parser
    } = require('json2csv')

    const fields = [
      // "ri_t0d", "invPK", "invCPK", "invScanCode", "invName", "ordSupplierStockNumber", "invSize", "invReceiptAlias", "posTimeStamp", "invDateCreated",
      // "invEmpFkCreatedBy", "ordQuantityInOrderUnit", "oupName", "stoNumber", "stoName", "brdName", "dptName", "dptNumber", "sibIdealMargin", "venCompanyname",
      // "invLastreceived", "invLastsold", "invLastcost", "sibBasePrice", "invOnhand", "invOnorder", "invIntransit", "invMemo", "pi1Description",
      // "pi2Description", "pi3Description", "pi4Description", "invPowerField3", "invPowerField4"
      "ri_t0d", "invPK", "invCPK", "invScanCode", "invName", "ordSupplierStockNumber", "invSize", "invReceiptAlias", "posTimeStamp", "invDateCreated",
      "invEmpFkCreatedBy", "ordQuantityInOrderUnit", "oupName", "stoNumber", "brdName", "dptName", "dptNumber", "sibIdealMargin", "actualMargT0d", "venCompanyname",
      "invLastreceived", "invLastsold", "invLastcost", "sibBasePrice", "invOnhand", "invOnorder", "invIntransit", "invMemo", "pi1Description",
      "pi2Description", "pi3Description", "pi4Description", "invPowerField3", "invPowerField4"
    ]

    const opts = {
      fields
    }

    let tableName = req.body['tablenamePost']
    let columnNames = []
    // let tableHeaders = createTablePostBody['crtTblPost']
    // let tableHeadersArray = tableHeaders.split(',')
    for (let i = 1; i < fields.length; i++) { //start count at 1, not 0, in order to skip the ri_t0d, which will be added as auto_increment
      //in the query below
      let columnName = fields[i] + ' VARCHAR(255)'
      console.log(`columnName==> ${columnName}`)
      columnNames.push(columnName)
    }

    function createPopTable() {
      connection.query(`
      CREATE TABLE ${tableName} (ri_t0d int NOT NULL AUTO_INCREMENT, ${columnNames}, PRIMARY KEY (ri_t0d));
      
      LOAD DATA LOCAL INFILE './public/csv-to-insert/${req.body['csvPost']}.csv' INTO TABLE ${tableName} FIELDS TERMINATED BY ','
       ENCLOSED BY '"' LINES TERMINATED BY '\r\n' IGNORE 1 LINES;
      `, (error, response) => {
        console.log(error || response);
      }).on('end', function () {
        res.render('vw-MySqlTableHub', {
          title: `vw-MySqlTableHub **Populated Table <<${tableName}>>**`,
          // tableColNames: tableColumnNames,
          sqlTablePopulated: {
            tablePopulated: tableName,
          },
        })
      })
    }

    try {
      const parser = new Parser(opts);
      const csv = parser.parse(catapultResArrCacheValue)
      console.log(`req.body['csvPost']-->${req.body['csvPost']}`)
      console.log('csv.length=====>>', csv.length);
      fs.writeFile(process.cwd() + '/public/csv-to-insert/' + req.body['csvPost'] + '.csv', csv, function (err) {
        if (err) throw err;
        console.log('~~~~~>>' + req.body['csvPost'] + 'saved<<~~~~~')
        createPopTable()
      })
    } catch (err) {
      console.error(err);
    }
    //end csv generator //////////////////////////////////////////////////////////////////////////

    // res.render('vw-tsqlTableHub', { //render searchResults to vw-dbEditPassport page
    //   title: 'CSV Saved'
    // })
  })
}