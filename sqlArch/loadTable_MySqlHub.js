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
  loadTable_MySqlHub: router.post('/loadTable_MySqlHub', (req, res, next) => {

    console.log('req.body from /loadTable_MySqlHub ==> ', req.body)
    console.log('req.body.length', req.body.length)
    console.log('Object.keys(req.body).length==>', Object.keys(req.body).length)
    let loadErrors = []
    let FieldArray = []

    const loadTablePostBody = req.body
    let tableNameToLoad = loadTablePostBody['ldTblNamePost']
    console.log(`loadTablePostBody['ldTblNamePost']==> ${loadTablePostBody['ldTblNamePost']}`)

    //here we are doing some js magic to extract the "catalog" name from the nej table name we're loading (nejTableNameYYYMMDD):
    let regex1 = /(\d+)/g
    let vendorNameSplit1 = tableNameToLoad.split('nej')
    let vendorNameSplit2 = vendorNameSplit1[1]
    let vendorNameSplit3 = vendorNameSplit2.split(regex1)
    let vendorName = vendorNameSplit3[0]
    let ediVendorName = `EDI-${vendorName.toUpperCase()}`
    console.log(`ediVendorName==> ${ediVendorName}`)

    // let discoToApplyCarryOver = loadTablePostBody['discountToApplyPost']

    connection.query(`
    SHOW COLUMNS FROM ${tableNameToLoad};
    SELECT * FROM rainbowcat WHERE ediName = '${ediVendorName}';
    `, (error, rows, fields) => {
      if (error) {
        console.log('error=====>>', error)
        loadErrors.push(error.code)
        console.log('loadErrors==>', loadErrors)
        res.render('vw-MySqlTableHub', {
          title: `**ERROR** vw-MySqlTableHub with table headers for <<${tableNameToLoad}>> loaded **ERROR**`,
          loadedTable: {
            tableNameToLoad: tableNameToLoad,
            tableLoadError: loadErrors,
            tableFields: FieldArray
          },
        })
      } else {
        let loadedTableRows = rows[0]
        let rainbowCatRows = rows[1]
        console.log(`JSON.stringify(loadedTableRows)==> ${JSON.stringify(loadedTableRows)}`)
        console.log(`JSON.stringify(rainbowCatRows[0])==> ${JSON.stringify(rainbowCatRows[0])}`)
        let discoToApplyCarryOver_WS = rainbowCatRows[0]['ongDscWS']
        console.log(`discoToApplyCarryOver_WS==> ${discoToApplyCarryOver_WS}`)
        let discoToApplyCarryOver_Rtl = rainbowCatRows[0]['ongDscRtl']
        console.log(`discoToApplyCarryOver_Rtl==> ${discoToApplyCarryOver_Rtl}`)

        for (let i = 0; i < loadedTableRows.length; i++) {
          FieldArray.push(loadedTableRows[i]['Field'])
        }
        res.render('vw-MySqlTableHub', {
          title: `vw-MySqlTableHub with table headers for <<${tableNameToLoad}>> loaded`,
          loadedTable: {
            tableNameToLoad: tableNameToLoad,
            tableLoadError: loadErrors,
            tableFields: FieldArray,
            ongDisco_WS: discoToApplyCarryOver_WS / 100,
            ongDisco_Rtl: discoToApplyCarryOver_Rtl / 100
          },
          // wsDiff: wsDiffResults
        });
      }
    })
    console.log('FieldArray from outside, AFTER connection.query===>', FieldArray)
  })
}