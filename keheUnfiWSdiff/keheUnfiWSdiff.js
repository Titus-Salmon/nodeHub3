const express = require('express')
const router = express.Router()

const mysql = require('mysql')

const connection = mysql.createConnection({ //for work use in RB DB
  host: process.env.RB_HOST,
  user: process.env.RB_USER,
  password: process.env.RB_PW,
  database: process.env.RB_DB,
  multipleStatements: true //MUST HAVE to make more than 1 sql statement in a single query
})

const keheUnfiObjArrCache = require('../nodeCacheStuff/cache1')

module.exports = {

  keheUnfiWSdiff: router.post(`/keheUnfiWSdiff`, (req, res, next) => {

    // let query = req.body['keheUnfiJoinPost']

    let nhcrtName = req.body['nhcrtNamePost']

    let srsObjArr = []

    function showSearchRes(rows) {

      let queryRes1 = rows[0]
      let queryRes2 = rows[1]
      console.log(`queryRes1.length==> ${queryRes1.length}`)
      console.log(`queryRes2.length==> ${queryRes2.length}`)
      console.log(`JSON.stringify(queryRes1[0])==> ${JSON.stringify(queryRes1[0])}`)
      console.log(`JSON.stringify(queryRes2[0])==> ${JSON.stringify(queryRes2[0])}`)

      for (let i = 0; i < queryRes2.length; i++) {

        let srsObj = {}

        for (let j = 0; j < queryRes1.length; j++) {
          if (queryRes2[i]['invScanCode'] == queryRes1[j]['kehe_upc']) {
            srsObj['ri_t0d'] = j + 1
            srsObj['kehe_upc'] = queryRes1[j]['kehe_upc']
            srsObj['unfi_upc'] = queryRes1[j]['unfi_upc']
            srsObj['kehe_unit_type'] = queryRes1[j]['kehe_unit_type']
            srsObj['unfi_unit_type'] = queryRes1[j]['unfi_unit_type']

            if (queryRes1[j]['kehe_unit_type'].toLowerCase().includes('ea')) {
              let unitIntSplit = queryRes1[j]['kehe_unit_type'].split('-')
              let unitInt = unitIntSplit[1]
              srsObj['kehe_unit_cost'] = (queryRes1[j]['kehe_tier3']) / (unitInt)
              srsObj['unfi_unit_cost'] = queryRes1[j]['unfi_unit_cost']
            } else {
              srsObj['kehe_unit_cost'] = 'NA'
              srsObj['unfi_unit_cost'] = 'NA'
            }

            if (srsObj['kehe_unit_cost'] < srsObj['unfi_unit_cost']) {
              srsObj['lower_cost'] = 'KEHE'
            } else {
              srsObj['lower_cost'] = 'UNFI'
            }

            srsObj['note'] = 'nullT0d'

            if (Math.abs((srsObj['kehe_unit_cost'] - srsObj['unfi_unit_cost']) / (srsObj['kehe_unit_cost'])) > .25) {
              srsObj['note'] = '25diff'
            }
            if (Math.abs((srsObj['kehe_unit_cost'] - srsObj['unfi_unit_cost']) / (srsObj['kehe_unit_cost'])) > .5) {
              srsObj['note'] = '50diff'
            }
            if (Math.abs((srsObj['kehe_unit_cost'] - srsObj['unfi_unit_cost']) / (srsObj['kehe_unit_cost'])) > .75) {
              srsObj['note'] = '75diff'
            }

            srsObj['kehe_name'] = queryRes1[j]['kehe_name']
            srsObj['unfi_name'] = queryRes1[j]['unfi_name']

            srsObj['invReceiptAlias'] = queryRes2[i]['invReceiptAlias']
            srsObj['venCompanyname'] = queryRes2[i]['venCompanyname']

            srsObjArr.push(srsObj)
          }
        }
      }
      //V// CACHE QUERY RESULTS IN BACKEND //////////////////////////////////////////////////////////////////////////////
      keheUnfiObjArrCache.set('keheUnfiObjArrCache_key', srsObjArr)
      console.log(`keheUnfiObjArrCache['data']['keheUnfiObjArrCache_key']['v'].length==> ${keheUnfiObjArrCache['data']['keheUnfiObjArrCache_key']['v'].length}`)
      console.log(`keheUnfiObjArrCache['data']['keheUnfiObjArrCache_key']['v'][0]==> ${keheUnfiObjArrCache['data']['keheUnfiObjArrCache_key']['v'][0]}`)
      console.log(`JSON.stringify(keheUnfiObjArrCache['data']['keheUnfiObjArrCache_key']['v'][0])==> ${JSON.stringify(keheUnfiObjArrCache['data']['keheUnfiObjArrCache_key']['v'][0])}`)
      //^// CACHE QUERY RESULTS IN BACKEND //////////////////////////////////////////////////////////////////////////////
    }

    function queryNejUnitType_Table() {
      connection.query(`
      SELECT kehe.kehe_upc, kehe.kehe_unit_type, kehe.kehe_tier3, kehe.kehe_name, 
      unfi.unfi_upc, unfi.unfi_unit_type, unfi.unfi_unit_cost, unfi.unfi_name 
      FROM edi_kehe_data kehe JOIN edi_unfi_data unfi ON kehe.kehe_upc WHERE kehe.kehe_upc = unfi.unfi_upc;

      SELECT DISTINCT invScanCode, venCompanyname, invReceiptAlias 
      FROM ${nhcrtName};
      `,
        function (err, rows, fields) {
          if (err) throw err
          showSearchRes(rows)

          res.render('vw-keheUnfiWSdiff', {
            title: `vw-keheUnfiWSdiff`,
            srsObjArr: srsObjArr,
          })
        })
    }

    queryNejUnitType_Table()

  })
}