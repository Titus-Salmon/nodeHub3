const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const connection = mysql.createConnection({
  host: process.env.RB_HOST,
  user: process.env.RB_USER,
  password: process.env.RB_PW,
  database: process.env.RB_DB,
  multipleStatements: true
})

module.exports = {
  loadTable_signFilterChecker: router.post('/loadTable_signFilterChecker', (req, res, next) => {

    console.log('req.body from /loadTable_signFilterChecker ==> ', req.body)
    console.log('req.body.length', req.body.length)
    console.log('Object.keys(req.body).length==>', Object.keys(req.body).length)
    let loadErrors = []
    let FieldArray = []

    const loadTablePostBody = req.body
    let tableNameToLoad = loadTablePostBody['ldTblNamePost']
    console.log(`loadTablePostBody['ldTblNamePost']==> ${loadTablePostBody['ldTblNamePost']}`)
    // let wsDiffResults = loadTablePostBody['wsDiffResultsLoadTblPost']

    // let discoToApplyCarryOver = loadTablePostBody['discountToApplyPost']

    // let sqlQuery = `SELECT * FROM ${tableNameToLoad}; SHOW COLUMNS FROM ${tableNameToLoad};`
    let sqlQuery = `SHOW COLUMNS FROM ${tableNameToLoad};`
    connection.query(sqlQuery, (error, response, rows) => {
      if (error) {
        console.log('error=====>>', error)
        loadErrors.push(error.code)
        console.log('loadErrors==>', loadErrors)
        res.render('vw-signFilterChecker', {
          title: `**ERROR** vw-signFilterChecker with table headers for <<${tableNameToLoad}>> loaded **ERROR**`,
          loadedTable: {
            tableNameToLoad: tableNameToLoad,
            tableLoadError: loadErrors,
            tableFields: FieldArray
          },
        })
      } else {
        console.log(`the following querie(s) have been successfully performed from loadTable_signFilterChecker.js:
        (1) SHOW COLUMNS FROM ${tableNameToLoad};
        This gives a response.length of ==> ${response.length}
        >>Here is that entire response:
        JSON.stringify(response)==> ${JSON.stringify(response)}`)

        for (let i = 0; i < response.length; i++) {
          FieldArray.push(response[i]['Field'])
        }
        res.render('vw-signFilterChecker', {
          title: `vw-signFilterChecker with table headers for <<${tableNameToLoad}>> loaded`,
          loadedTable: {
            tableNameToLoad: tableNameToLoad,
            tableLoadError: loadErrors,
            tableFields: FieldArray,
            // ongDisco: discoToApplyCarryOver
          },
          // wsDiff: wsDiffResults
        });
      }
    })
    console.log('FieldArray from outside, AFTER connection.query===>', FieldArray)
  })
}