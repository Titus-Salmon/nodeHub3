const express = require('express')
const router = express.Router()
const mysql = require('mysql')

const connection = mysql.createConnection({
  host: process.env.RB_HOST,
  user: process.env.RB_USER,
  password: process.env.RB_PW,
  database: process.env.RB_DB,
  multipleStatements: true //MUST HAVE to make more than 1 sql statement in a single query
})

module.exports = {

  calcResultsSfAud3: router.post('/calcResultsSfAud3', (req, res, next) => {

    searchResults = [] //clear searchResults from previous search
    console.log('calcResultsSfAud3 says: searchResults from router.post level===>', searchResults)
    searchResultsForCSV = []
    searchResultsForCSVreview = [] //this is for holding data to generate your review excel sheet for Andrea & Brad
    console.log('calcResultsSfAud3 says: searchResultsForCSV from router.post level===>', searchResultsForCSV)
    csvContainer = []
    console.log('calcResultsSfAud3 says: csvContainer from router.post level===>', csvContainer)


    const postBody = req.body
    console.log('calcResultsSfAud3 says: postBody==>', postBody)
    console.log('calcResultsSfAud3 says: postBody[\'fldArrToPostPost\']==>', postBody['fldArrToPostPost'])
    console.log('calcResultsSfAud3 says: postBody[\'fldArrToPostPost\'][0]==>', postBody['fldArrToPostPost'][0])

    let formInput0 = Object.values(postBody)[0] = loadedSqlTbl = postBody['tblNameToPostPost'] //tblNameToPostPost
    console.log('formInput0==>', formInput0)


    function showSearchResults(rows) {

      let nisfRows = rows
      // let edlpRows = rows[1] //targets 2nd query on rb_edlp_data table

      console.log(`JSON.stringify(nisfRows[0])==> ${JSON.stringify(nisfRows[0])}`)
      console.log(`nisfRows.length==> ${nisfRows.length}`)

      for (let i = 0; i < nisfRows.length; i++) { //Add searched-for table entries from db to searchResults array, for
        //displaying in the dynamic DOM table. Also add margin data, & retail & charm calcs to display in DOM table

        function sfAud3(storeNumber, inStockCode) { //i.e. storeNumber = 'IN', inStockCode = 'IND'

          let parsedInvVal = parseInt(nisfRows[i]['invOnhand'])

          function sfAud3Results(shouldBeStockedOrNot) {
            if (nisfRows[i]['storeNumber'] == storeNumber) {
              let srcRsObj = {}
              srcRsObj['ri_t0d'] = i
              srcRsObj['invMismatchUPC'] = nisfRows[i]['invScanCode']
              srcRsObj['invMismatchSKU'] = nisfRows[i]['ordSupplierStockNumber']
              srcRsObj['invMismatchName'] = nisfRows[i]['invName']
              srcRsObj['invMismatchStore'] = nisfRows[i]['storeNumber']
              srcRsObj['invMismatchSFdata'] = nisfRows[i][inStockCode]
              srcRsObj['invMismatchCPLTdata'] = nisfRows[i]['invOnhand']
              srcRsObj['invMismatchLastRecd'] = nisfRows[i]['invLastreceived']
              srcRsObj['invMismatchLastSold'] = nisfRows[i]['invLastsold']

              srcRsObj['Comments2'] = shouldBeStockedOrNot

              if (('2020-03-05' > nisfRows[i]['invLastreceived'] && nisfRows[i]['invLastreceived'] > '2019-12-05') ||
                ('2020-03-05' > nisfRows[i]['invLastsold'] && nisfRows[i]['invLastsold'] > '2019-12-05')) {
                srcRsObj['LastRecd0_3'] = nisfRows[i]['invLastreceived']
                if (nisfRows[i][inStockCode] !== '-') {
                  srcRsObj['Comments1'] = 'SFsaysStockedBut0_3'
                }
                if (nisfRows[i][inStockCode] == '-') {
                  srcRsObj['Comments1'] = 'SFsaysNOTStockedBut0_3'
                  if (parsedInvVal > 0) {
                    srcRsObj['Comments1'] = 'SFsaysNOTStockedButInInv'
                  }
                }
              }
              if (('2019-12-05' > nisfRows[i]['invLastreceived'] && nisfRows[i]['invLastreceived'] > '2019-09-05') ||
                ('2019-12-05' > nisfRows[i]['invLastsold'] && nisfRows[i]['invLastsold'] > '2019-09-05')) {
                srcRsObj['LastRecd3_6'] = nisfRows[i]['invLastreceived']
                if (nisfRows[i][inStockCode] !== '-') {
                  srcRsObj['Comments1'] = 'SFsaysStockedBut3_6'
                }
                if (nisfRows[i][inStockCode] == '-') {
                  srcRsObj['Comments1'] = 'SFsaysNOTStockedBut3_6'
                  if (parsedInvVal > 0) {
                    srcRsObj['Comments1'] = 'SFsaysNOTStockedButInInv'
                  }
                }
              }
              if (('2019-09-05' > nisfRows[i]['invLastreceived'] && nisfRows[i]['invLastreceived'] > '2019-06-05') ||
                ('2019-09-05' > nisfRows[i]['invLastsold'] && nisfRows[i]['invLastsold'] > '2019-06-05')) {
                srcRsObj['LastRecd6_9'] = nisfRows[i]['invLastreceived']
                if (nisfRows[i][inStockCode] !== '-') {
                  srcRsObj['Comments1'] = 'SFsaysStockedBut6_9'
                }
                if (nisfRows[i][inStockCode] == '-') {
                  srcRsObj['Comments1'] = 'SFsaysNOTStockedBut6_9'
                  if (parsedInvVal > 0) {
                    srcRsObj['Comments1'] = 'SFsaysNOTStockedButInInv'
                  }
                }
              }
              if (('2019-06-05' > nisfRows[i]['invLastreceived'] && nisfRows[i]['invLastreceived'] > '2019-03-05') ||
                ('2019-06-05' > nisfRows[i]['invLastsold'] && nisfRows[i]['invLastsold'] > '2019-03-05')) {
                srcRsObj['LastRecd9_12'] = nisfRows[i]['invLastreceived']
                if (nisfRows[i][inStockCode] !== '-') {
                  srcRsObj['Comments1'] = 'SFsaysStockedBut9_12'
                }
                if (nisfRows[i][inStockCode] == '-') {
                  srcRsObj['Comments1'] = 'SFsaysNOTStockedBut9_12'
                  if (parsedInvVal > 0) {
                    srcRsObj['Comments1'] = 'SFsaysNOTStockedButInInv'
                  }
                }
              }
              if (('2019-03-05' > nisfRows[i]['invLastreceived']) &&
                ('2019-03-05' > nisfRows[i]['invLastsold'])) {
                srcRsObj['LastRecd12plus'] = nisfRows[i]['invLastreceived']
                if (nisfRows[i][inStockCode] !== '-') {
                  srcRsObj['Comments1'] = 'SFsaysStockedBut12plus'
                }
                if (nisfRows[i][inStockCode] == '-') {
                  srcRsObj['Comments1'] = 'SFsaysNOTStockedBut12plus'
                  if (parsedInvVal > 0) {
                    srcRsObj['Comments1'] = 'SFsaysNOTStockedButInInv'
                  }
                }
              }
              searchResults.push(srcRsObj)
            }
          }

          if (nisfRows[i][inStockCode] == '-') {
            if ((nisfRows[i]['invLastsold'] == '' || nisfRows[i]['invLastsold'] == undefined) &&
              (nisfRows[i]['invLastreceived'] == '' || nisfRows[i]['invLastreceived'] == undefined)) {
              sfAud3Results('NO LAST SOLD/RECD DATA')
            }
            if (nisfRows[i]['invLastsold'] > '2019-03-05') {
              sfAud3Results('SHOULD_be_stocked')
            }
            if (nisfRows[i]['invLastreceived'] > '2019-03-05') {
              sfAud3Results('SHOULD_be_stocked')
            }
            if (parsedInvVal > 0) {
              sfAud3Results('SHOULD_be_stocked')
            }
          }

          if (nisfRows[i][inStockCode] !== '-') {
            if ((nisfRows[i]['invLastsold'] == '' || nisfRows[i]['invLastsold'] == undefined) &&
              (nisfRows[i]['invLastreceived'] == '' || nisfRows[i]['invLastreceived'] == undefined)) {
              sfAud3Results('NO LAST SOLD/RECD DATA')
            } else {
              if (nisfRows[i]['invLastsold'] < '2019-03-05' && nisfRows[i]['invLastreceived'] < '2019-03-05' && parsedInvVal <= 0) {
                sfAud3Results('should_NOT_be_stocked')
              }
            }
          }
        }

        sfAud3('IN', 'IND')
        sfAud3('SM', 'SM')
        sfAud3('MT', 'MT')
        sfAud3('SPR', 'SH')
        sfAud3('GL', 'GL')

      }
      console.log(`JSON.stringify(searchResults)==> ${JSON.stringify(searchResults)}`)
    }


    function queryNisfJoinTable() {
      connection.query(`SELECT * FROM ${formInput0}`, function (err, rows, fields) {
        if (err) throw err
        showSearchResults(rows)

        res.render('vw-nisfResults3', { //render searchResults to vw-MySqlTableHub page
          title: 'sfAud3 (using nisf table)',
          searchResRows: searchResults,
          loadedSqlTbl: loadedSqlTbl
        })
      })

    }

    queryNisfJoinTable()

  })
}