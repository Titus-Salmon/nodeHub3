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

  calcResultsSfAud2: router.post('/calcResultsSfAud2', (req, res, next) => {

    searchResults = [] //clear searchResults from previous search
    console.log('calcResultsSfAud2 says: searchResults from router.post level===>', searchResults)
    searchResultsForCSV = []
    searchResultsForCSVreview = [] //this is for holding data to generate your review excel sheet for Andrea & Brad
    console.log('calcResultsSfAud2 says: searchResultsForCSV from router.post level===>', searchResultsForCSV)
    csvContainer = []
    console.log('calcResultsSfAud2 says: csvContainer from router.post level===>', csvContainer)


    const postBody = req.body
    console.log('calcResultsSfAud2 says: postBody==>', postBody)
    console.log('calcResultsSfAud2 says: postBody[\'fldArrToPostPost\']==>', postBody['fldArrToPostPost'])
    console.log('calcResultsSfAud2 says: postBody[\'fldArrToPostPost\'][0]==>', postBody['fldArrToPostPost'][0])

    let formInput0 = Object.values(postBody)[0] = loadedSqlTbl = postBody['tblNameToPostPost'] //tblNameToPostPost
    console.log('formInput0==>', formInput0)


    function showSearchResults(rows) {

      let nisfRows = rows
      // let edlpRows = rows[1] //targets 2nd query on rb_edlp_data table

      console.log(`JSON.stringify(nisfRows[0])==> ${JSON.stringify(nisfRows[0])}`)
      console.log(`nisfRows.length==> ${nisfRows.length}`)

      for (let i = 0; i < nisfRows.length; i++) { //Add searched-for table entries from db to searchResults array, for
        //displaying in the dynamic DOM table. Also add margin data, & retail & charm calcs to display in DOM table

        let parsedInvVal = parseInt(nisfRows[i]['invOnhand'])


        if (nisfRows[i]['stoName'] == 'Indiana') {
          // if ((parsedInvVal > 0 && nisfRows[i]['IND'] == '-') ||
          //   (parsedInvVal <= 0 && nisfRows[i]['IND'] == 'IN')) {
          let srcRsObj = {}
          console.log(`nisfRows[${i}]['invOnhand'] (IND)==> ${nisfRows[i]['invOnhand']}`)
          srcRsObj['ri_t0d'] = i
          srcRsObj['invMismatchUPC'] = nisfRows[i]['invScanCode']
          srcRsObj['invMismatchSKU'] = nisfRows[i]['ordSupplierStockNumber']
          srcRsObj['invMismatchName'] = nisfRows[i]['invName']
          srcRsObj['invMismatchStore'] = nisfRows[i]['stoName']
          srcRsObj['invMismatchSFdata'] = nisfRows[i]['IND']
          srcRsObj['invMismatchCPLTdata'] = nisfRows[i]['invOnhand']
          srcRsObj['invMismatchLastRecd'] = nisfRows[i]['invLastreceived']
          srcRsObj['invMismatchLastSold'] = nisfRows[i]['invLastsold']

          if (('2020-03-07' > nisfRows[i]['invLastreceived'] && nisfRows[i]['invLastreceived'] > '2019-12-07') ||
            ('2020-03-07' > nisfRows[i]['invLastsold'] && nisfRows[i]['invLastsold'] > '2019-12-07')) {
            srcRsObj['LastRecd0_3'] = nisfRows[i]['invLastreceived']
            if (nisfRows[i]['IND'] == 'IN') {
              srcRsObj['Comments1'] = 'SFsaysStockedBut0_3'
            }
            if (nisfRows[i]['IND'] == '-') {
              srcRsObj['Comments1'] = 'SFsaysNOTStockedBut0_3'
              if (parsedInvVal > 0) {
                srcRsObj['Comments1'] = 'SFsaysNOTStockedButInInv'
              }
            }
          }
          if (('2019-12-07' > nisfRows[i]['invLastreceived'] && nisfRows[i]['invLastreceived'] > '2019-09-07') ||
            ('2019-12-07' > nisfRows[i]['invLastsold'] && nisfRows[i]['invLastsold'] > '2019-09-07')) {
            srcRsObj['LastRecd3_6'] = nisfRows[i]['invLastreceived']
            if (nisfRows[i]['IND'] == 'IN') {
              srcRsObj['Comments1'] = 'SFsaysStockedBut3_6'
            }
            if (nisfRows[i]['IND'] == '-') {
              srcRsObj['Comments1'] = 'SFsaysNOTStockedBut3_6'
              if (parsedInvVal > 0) {
                srcRsObj['Comments1'] = 'SFsaysNOTStockedButInInv'
              }
            }
          }
          if (('2019-09-07' > nisfRows[i]['invLastreceived'] && nisfRows[i]['invLastreceived'] > '2019-06-07') ||
            ('2019-09-07' > nisfRows[i]['invLastsold'] && nisfRows[i]['invLastsold'] > '2019-06-07')) {
            srcRsObj['LastRecd6_9'] = nisfRows[i]['invLastreceived']
            if (nisfRows[i]['IND'] == 'IN') {
              srcRsObj['Comments1'] = 'SFsaysStockedBut6_9'
            }
            if (nisfRows[i]['IND'] == '-') {
              srcRsObj['Comments1'] = 'SFsaysNOTStockedBut6_9'
              if (parsedInvVal > 0) {
                srcRsObj['Comments1'] = 'SFsaysNOTStockedButInInv'
              }
            }
          }
          if (('2019-06-07' > nisfRows[i]['invLastreceived'] && nisfRows[i]['invLastreceived'] > '2019-03-07') ||
            ('2019-06-07' > nisfRows[i]['invLastsold'] && nisfRows[i]['invLastsold'] > '2019-03-07')) {
            srcRsObj['LastRecd9_12'] = nisfRows[i]['invLastreceived']
            if (nisfRows[i]['IND'] == 'IN') {
              srcRsObj['Comments1'] = 'SFsaysStockedBut9_12'
            }
            if (nisfRows[i]['IND'] == '-') {
              srcRsObj['Comments1'] = 'SFsaysNOTStockedBut9_12'
              if (parsedInvVal > 0) {
                srcRsObj['Comments1'] = 'SFsaysNOTStockedButInInv'
              }
            }
          }
          if (('2019-03-07' > nisfRows[i]['invLastreceived']) ||
            ('2019-03-07' > nisfRows[i]['invLastsold'])) {
            srcRsObj['LastRecd12plus'] = nisfRows[i]['invLastreceived']
            if (nisfRows[i]['IND'] == 'IN') {
              srcRsObj['Comments1'] = 'SFsaysStockedBut12plus'
            }
            if (nisfRows[i]['IND'] == '-') {
              srcRsObj['Comments1'] = 'SFsaysNOTStockedBut12plus'
              if (parsedInvVal > 0) {
                srcRsObj['Comments1'] = 'SFsaysNOTStockedButInInv'
              }
            }
          }

          searchResults.push(srcRsObj)
          //}
        }

        if (nisfRows[i]['stoName'] == 'Saint Matthews') {
          // if ((parsedInvVal > 0 && nisfRows[i]['SM'] == '-') ||
          //   (parsedInvVal <= 0 && nisfRows[i]['SM'] == 'SM')) {
          let srcRsObj = {}
          srcRsObj['ri_t0d'] = i
          srcRsObj['invMismatchUPC'] = nisfRows[i]['invScanCode']
          srcRsObj['invMismatchSKU'] = nisfRows[i]['ordSupplierStockNumber']
          srcRsObj['invMismatchName'] = nisfRows[i]['invName']
          srcRsObj['invMismatchStore'] = nisfRows[i]['stoName']
          srcRsObj['invMismatchSFdata'] = nisfRows[i]['SM']
          srcRsObj['invMismatchCPLTdata'] = nisfRows[i]['invOnhand']
          srcRsObj['invMismatchLastRecd'] = nisfRows[i]['invLastreceived']

          if (('2020-03-07' > nisfRows[i]['invLastreceived'] && nisfRows[i]['invLastreceived'] > '2019-12-07') ||
            ('2020-03-07' > nisfRows[i]['invLastsold'] && nisfRows[i]['invLastsold'] > '2019-12-07')) {
            srcRsObj['LastRecd0_3'] = nisfRows[i]['invLastreceived']
            if (nisfRows[i]['SM'] == 'SM') {
              srcRsObj['Comments1'] = 'SFsaysStockedBut0_3'
            }
            if (nisfRows[i]['SM'] == '-') {
              srcRsObj['Comments1'] = 'SFsaysNOTStockedBut0_3'
              if (parsedInvVal > 0) {
                srcRsObj['Comments1'] = 'SFsaysNOTStockedButInInv'
              }
            }
          }
          if (('2019-12-07' > nisfRows[i]['invLastreceived'] && nisfRows[i]['invLastreceived'] > '2019-09-07') ||
            ('2019-12-07' > nisfRows[i]['invLastsold'] && nisfRows[i]['invLastsold'] > '2019-09-07')) {
            srcRsObj['LastRecd3_6'] = nisfRows[i]['invLastreceived']
            if (nisfRows[i]['SM'] == 'SM') {
              srcRsObj['Comments1'] = 'SFsaysStockedBut3_6'
            }
            if (nisfRows[i]['SM'] == '-') {
              srcRsObj['Comments1'] = 'SFsaysNOTStockedBut3_6'
              if (parsedInvVal > 0) {
                srcRsObj['Comments1'] = 'SFsaysNOTStockedButInInv'
              }
            }
          }
          if (('2019-09-07' > nisfRows[i]['invLastreceived'] && nisfRows[i]['invLastreceived'] > '2019-06-07') ||
            ('2019-09-07' > nisfRows[i]['invLastsold'] && nisfRows[i]['invLastsold'] > '2019-06-07')) {
            srcRsObj['LastRecd6_9'] = nisfRows[i]['invLastreceived']
            if (nisfRows[i]['SM'] == 'SM') {
              srcRsObj['Comments1'] = 'SFsaysStockedBut6_9'
            }
            if (nisfRows[i]['SM'] == '-') {
              srcRsObj['Comments1'] = 'SFsaysNOTStockedBut6_9'
              if (parsedInvVal > 0) {
                srcRsObj['Comments1'] = 'SFsaysNOTStockedButInInv'
              }
            }
          }
          if (('2019-06-07' > nisfRows[i]['invLastreceived'] && nisfRows[i]['invLastreceived'] > '2019-03-07') ||
            ('2019-06-07' > nisfRows[i]['invLastsold'] && nisfRows[i]['invLastsold'] > '2019-03-07')) {
            srcRsObj['LastRecd9_12'] = nisfRows[i]['invLastreceived']
            if (nisfRows[i]['SM'] == 'SM') {
              srcRsObj['Comments1'] = 'SFsaysStockedBut9_12'
            }
            if (nisfRows[i]['SM'] == '-') {
              srcRsObj['Comments1'] = 'SFsaysNOTStockedBut9_12'
              if (parsedInvVal > 0) {
                srcRsObj['Comments1'] = 'SFsaysNOTStockedButInInv'
              }
            }
          }
          if (('2019-03-07' > nisfRows[i]['invLastreceived']) ||
            ('2019-03-07' > nisfRows[i]['invLastsold'])) {
            srcRsObj['LastRecd12plus'] = nisfRows[i]['invLastreceived']
            if (nisfRows[i]['SM'] == 'SM') {
              srcRsObj['Comments1'] = 'SFsaysStockedBut12plus'
            }
            if (nisfRows[i]['SM'] == '-') {
              srcRsObj['Comments1'] = 'SFsaysNOTStockedBut12plus'
              if (parsedInvVal > 0) {
                srcRsObj['Comments1'] = 'SFsaysNOTStockedButInInv'
              }
            }
          }

          searchResults.push(srcRsObj)
          //}
        }

        if (nisfRows[i]['stoName'] == 'Middletown') {
          // if ((parsedInvVal > 0 && nisfRows[i]['MT'] == '-') ||
          //   (parsedInvVal <= 0 && nisfRows[i]['MT'] == 'MT')) {
          let srcRsObj = {}
          srcRsObj['ri_t0d'] = i
          srcRsObj['invMismatchUPC'] = nisfRows[i]['invScanCode']
          srcRsObj['invMismatchSKU'] = nisfRows[i]['ordSupplierStockNumber']
          srcRsObj['invMismatchName'] = nisfRows[i]['invName']
          srcRsObj['invMismatchStore'] = nisfRows[i]['stoName']
          srcRsObj['invMismatchSFdata'] = nisfRows[i]['MT']
          srcRsObj['invMismatchCPLTdata'] = nisfRows[i]['invOnhand']
          srcRsObj['invMismatchLastRecd'] = nisfRows[i]['invLastreceived']

          if (('2020-03-07' > nisfRows[i]['invLastreceived'] && nisfRows[i]['invLastreceived'] > '2019-12-07') ||
            ('2020-03-07' > nisfRows[i]['invLastsold'] && nisfRows[i]['invLastsold'] > '2019-12-07')) {
            srcRsObj['LastRecd0_3'] = nisfRows[i]['invLastreceived']
            if (nisfRows[i]['MT'] == 'MT') {
              srcRsObj['Comments1'] = 'SFsaysStockedBut0_3'
            }
            if (nisfRows[i]['MT'] == '-') {
              srcRsObj['Comments1'] = 'SFsaysNOTStockedBut0_3'
              if (parsedInvVal > 0) {
                srcRsObj['Comments1'] = 'SFsaysNOTStockedButInInv'
              }
            }
          }
          if (('2019-12-07' > nisfRows[i]['invLastreceived'] && nisfRows[i]['invLastreceived'] > '2019-09-07') ||
            ('2019-12-07' > nisfRows[i]['invLastsold'] && nisfRows[i]['invLastsold'] > '2019-09-07')) {
            srcRsObj['LastRecd3_6'] = nisfRows[i]['invLastreceived']
            if (nisfRows[i]['MT'] == 'MT') {
              srcRsObj['Comments1'] = 'SFsaysStockedBut3_6'
            }
            if (nisfRows[i]['MT'] == '-') {
              srcRsObj['Comments1'] = 'SFsaysNOTStockedBut3_6'
              if (parsedInvVal > 0) {
                srcRsObj['Comments1'] = 'SFsaysNOTStockedButInInv'
              }
            }
          }
          if (('2019-09-07' > nisfRows[i]['invLastreceived'] && nisfRows[i]['invLastreceived'] > '2019-06-07') ||
            ('2019-09-07' > nisfRows[i]['invLastsold'] && nisfRows[i]['invLastsold'] > '2019-06-07')) {
            srcRsObj['LastRecd6_9'] = nisfRows[i]['invLastreceived']
            if (nisfRows[i]['MT'] == 'MT') {
              srcRsObj['Comments1'] = 'SFsaysStockedBut6_9'
            }
            if (nisfRows[i]['MT'] == '-') {
              srcRsObj['Comments1'] = 'SFsaysNOTStockedBut6_9'
              if (parsedInvVal > 0) {
                srcRsObj['Comments1'] = 'SFsaysNOTStockedButInInv'
              }
            }
          }
          if (('2019-06-07' > nisfRows[i]['invLastreceived'] && nisfRows[i]['invLastreceived'] > '2019-03-07') ||
            ('2019-06-07' > nisfRows[i]['invLastsold'] && nisfRows[i]['invLastsold'] > '2019-03-07')) {
            srcRsObj['LastRecd9_12'] = nisfRows[i]['invLastreceived']
            if (nisfRows[i]['MT'] == 'MT') {
              srcRsObj['Comments1'] = 'SFsaysStockedBut9_12'
            }
            if (nisfRows[i]['MT'] == '-') {
              srcRsObj['Comments1'] = 'SFsaysNOTStockedBut9_12'
              if (parsedInvVal > 0) {
                srcRsObj['Comments1'] = 'SFsaysNOTStockedButInInv'
              }
            }
          }
          if (('2019-03-07' > nisfRows[i]['invLastreceived']) ||
            ('2019-03-07' > nisfRows[i]['invLastsold'])) {
            srcRsObj['LastRecd12plus'] = nisfRows[i]['invLastreceived']
            if (nisfRows[i]['MT'] == 'MT') {
              srcRsObj['Comments1'] = 'SFsaysStockedBut12plus'
            }
            if (nisfRows[i]['MT'] == '-') {
              srcRsObj['Comments1'] = 'SFsaysNOTStockedBut12plus'
              if (parsedInvVal > 0) {
                srcRsObj['Comments1'] = 'SFsaysNOTStockedButInInv'
              }
            }
          }

          searchResults.push(srcRsObj)
          //}
        }

        if (nisfRows[i]['stoName'] == 'Springhurst') {
          // if ((parsedInvVal > 0 && nisfRows[i]['SH'] == '-') ||
          //   (parsedInvVal <= 0 && nisfRows[i]['SH'] == 'SH')) {
          let srcRsObj = {}
          srcRsObj['ri_t0d'] = i
          srcRsObj['invMismatchUPC'] = nisfRows[i]['invScanCode']
          srcRsObj['invMismatchSKU'] = nisfRows[i]['ordSupplierStockNumber']
          srcRsObj['invMismatchName'] = nisfRows[i]['invName']
          srcRsObj['invMismatchStore'] = nisfRows[i]['stoName']
          srcRsObj['invMismatchSFdata'] = nisfRows[i]['SH']
          srcRsObj['invMismatchCPLTdata'] = nisfRows[i]['invOnhand']
          srcRsObj['invMismatchLastRecd'] = nisfRows[i]['invLastreceived']

          if (('2020-03-07' > nisfRows[i]['invLastreceived'] && nisfRows[i]['invLastreceived'] > '2019-12-07') ||
            ('2020-03-07' > nisfRows[i]['invLastsold'] && nisfRows[i]['invLastsold'] > '2019-12-07')) {
            srcRsObj['LastRecd0_3'] = nisfRows[i]['invLastreceived']
            if (nisfRows[i]['SH'] == 'SH') {
              srcRsObj['Comments1'] = 'SFsaysStockedBut0_3'
            }
            if (nisfRows[i]['SH'] == '-') {
              srcRsObj['Comments1'] = 'SFsaysNOTStockedBut0_3'
              if (parsedInvVal > 0) {
                srcRsObj['Comments1'] = 'SFsaysNOTStockedButInInv'
              }
            }
          }
          if (('2019-12-07' > nisfRows[i]['invLastreceived'] && nisfRows[i]['invLastreceived'] > '2019-09-07') ||
            ('2019-12-07' > nisfRows[i]['invLastsold'] && nisfRows[i]['invLastsold'] > '2019-09-07')) {
            srcRsObj['LastRecd3_6'] = nisfRows[i]['invLastreceived']
            if (nisfRows[i]['SH'] == 'SH') {
              srcRsObj['Comments1'] = 'SFsaysStockedBut3_6'
            }
            if (nisfRows[i]['SH'] == '-') {
              srcRsObj['Comments1'] = 'SFsaysNOTStockedBut3_6'
              if (parsedInvVal > 0) {
                srcRsObj['Comments1'] = 'SFsaysNOTStockedButInInv'
              }
            }
          }
          if (('2019-09-07' > nisfRows[i]['invLastreceived'] && nisfRows[i]['invLastreceived'] > '2019-06-07') ||
            ('2019-09-07' > nisfRows[i]['invLastsold'] && nisfRows[i]['invLastsold'] > '2019-06-07')) {
            srcRsObj['LastRecd6_9'] = nisfRows[i]['invLastreceived']
            if (nisfRows[i]['SH'] == 'SH') {
              srcRsObj['Comments1'] = 'SFsaysStockedBut6_9'
            }
            if (nisfRows[i]['SH'] == '-') {
              srcRsObj['Comments1'] = 'SFsaysNOTStockedBut6_9'
              if (parsedInvVal > 0) {
                srcRsObj['Comments1'] = 'SFsaysNOTStockedButInInv'
              }
            }
          }
          if (('2019-06-07' > nisfRows[i]['invLastreceived'] && nisfRows[i]['invLastreceived'] > '2019-03-07') ||
            ('2019-06-07' > nisfRows[i]['invLastsold'] && nisfRows[i]['invLastsold'] > '2019-03-07')) {
            srcRsObj['LastRecd9_12'] = nisfRows[i]['invLastreceived']
            if (nisfRows[i]['SH'] == 'SH') {
              srcRsObj['Comments1'] = 'SFsaysStockedBut9_12'
            }
            if (nisfRows[i]['SH'] == '-') {
              srcRsObj['Comments1'] = 'SFsaysNOTStockedBut9_12'
              if (parsedInvVal > 0) {
                srcRsObj['Comments1'] = 'SFsaysNOTStockedButInInv'
              }
            }
          }
          if (('2019-03-07' > nisfRows[i]['invLastreceived']) ||
            ('2019-03-07' > nisfRows[i]['invLastsold'])) {
            srcRsObj['LastRecd12plus'] = nisfRows[i]['invLastreceived']
            if (nisfRows[i]['SH'] == 'SH') {
              srcRsObj['Comments1'] = 'SFsaysStockedBut12plus'
            }
            if (nisfRows[i]['SH'] == '-') {
              srcRsObj['Comments1'] = 'SFsaysNOTStockedBut12plus'
              if (parsedInvVal > 0) {
                srcRsObj['Comments1'] = 'SFsaysNOTStockedButInInv'
              }
            }
          }

          searchResults.push(srcRsObj)
          //}
        }

        if (nisfRows[i]['stoName'] == 'Gardiner Lane') {
          // if ((parsedInvVal > 0 && nisfRows[i]['GL'] == '-') ||
          //   (parsedInvVal <= 0 && nisfRows[i]['GL'] == 'GL')) {
          let srcRsObj = {}
          srcRsObj['ri_t0d'] = i
          srcRsObj['invMismatchUPC'] = nisfRows[i]['invScanCode']
          srcRsObj['invMismatchSKU'] = nisfRows[i]['ordSupplierStockNumber']
          srcRsObj['invMismatchName'] = nisfRows[i]['invName']
          srcRsObj['invMismatchStore'] = nisfRows[i]['stoName']
          srcRsObj['invMismatchSFdata'] = nisfRows[i]['GL']
          srcRsObj['invMismatchCPLTdata'] = nisfRows[i]['invOnhand']
          srcRsObj['invMismatchLastRecd'] = nisfRows[i]['invLastreceived']

          if (('2020-03-07' > nisfRows[i]['invLastreceived'] && nisfRows[i]['invLastreceived'] > '2019-12-07') ||
            ('2020-03-07' > nisfRows[i]['invLastsold'] && nisfRows[i]['invLastsold'] > '2019-12-07')) {
            srcRsObj['LastRecd0_3'] = nisfRows[i]['invLastreceived']
            if (nisfRows[i]['GL'] == 'GL') {
              srcRsObj['Comments1'] = 'SFsaysStockedBut0_3'
            }
            if (nisfRows[i]['GL'] == '-') {
              srcRsObj['Comments1'] = 'SFsaysNOTStockedBut0_3'
              if (parsedInvVal > 0) {
                srcRsObj['Comments1'] = 'SFsaysNOTStockedButInInv'
              }
            }
          }
          if (('2019-12-07' > nisfRows[i]['invLastreceived'] && nisfRows[i]['invLastreceived'] > '2019-09-07') ||
            ('2019-12-07' > nisfRows[i]['invLastsold'] && nisfRows[i]['invLastsold'] > '2019-09-07')) {
            srcRsObj['LastRecd3_6'] = nisfRows[i]['invLastreceived']
            if (nisfRows[i]['GL'] == 'GL') {
              srcRsObj['Comments1'] = 'SFsaysStockedBut3_6'
            }
            if (nisfRows[i]['GL'] == '-') {
              srcRsObj['Comments1'] = 'SFsaysNOTStockedBut3_6'
              if (parsedInvVal > 0) {
                srcRsObj['Comments1'] = 'SFsaysNOTStockedButInInv'
              }
            }
          }
          if (('2019-09-07' > nisfRows[i]['invLastreceived'] && nisfRows[i]['invLastreceived'] > '2019-06-07') ||
            ('2019-09-07' > nisfRows[i]['invLastsold'] && nisfRows[i]['invLastsold'] > '2019-06-07')) {
            srcRsObj['LastRecd6_9'] = nisfRows[i]['invLastreceived']
            if (nisfRows[i]['GL'] == 'GL') {
              srcRsObj['Comments1'] = 'SFsaysStockedBut6_9'
            }
            if (nisfRows[i]['GL'] == '-') {
              srcRsObj['Comments1'] = 'SFsaysNOTStockedBut6_9'
              if (parsedInvVal > 0) {
                srcRsObj['Comments1'] = 'SFsaysNOTStockedButInInv'
              }
            }
          }
          if (('2019-06-07' > nisfRows[i]['invLastreceived'] && nisfRows[i]['invLastreceived'] > '2019-03-07') ||
            ('2019-06-07' > nisfRows[i]['invLastsold'] && nisfRows[i]['invLastsold'] > '2019-03-07')) {
            srcRsObj['LastRecd9_12'] = nisfRows[i]['invLastreceived']
            if (nisfRows[i]['GL'] == 'GL') {
              srcRsObj['Comments1'] = 'SFsaysStockedBut9_12'
            }
            if (nisfRows[i]['GL'] == '-') {
              srcRsObj['Comments1'] = 'SFsaysNOTStockedBut9_12'
              if (parsedInvVal > 0) {
                srcRsObj['Comments1'] = 'SFsaysNOTStockedButInInv'
              }
            }
          }
          if (('2019-03-07' > nisfRows[i]['invLastreceived']) ||
            ('2019-03-07' > nisfRows[i]['invLastsold'])) {
            srcRsObj['LastRecd12plus'] = nisfRows[i]['invLastreceived']
            if (nisfRows[i]['GL'] == 'GL') {
              srcRsObj['Comments1'] = 'SFsaysStockedBut12plus'
            }
            if (nisfRows[i]['GL'] == '-') {
              srcRsObj['Comments1'] = 'SFsaysNOTStockedBut12plus'
              if (parsedInvVal > 0) {
                srcRsObj['Comments1'] = 'SFsaysNOTStockedButInInv'
              }
            }
          }

          searchResults.push(srcRsObj)
          //}
        }

        // searchResults.push(srcRsObj)

      }
      console.log(`JSON.stringify(searchResults)==> ${JSON.stringify(searchResults)}`)
    }



    function queryNisfJoinTable() {
      //v//retrieve info from database table to display in DOM table/////////////////////////////////////////////////////////
      connection.query(`SELECT * FROM ${formInput0} ORDER BY invLastreceived;`, function (err, rows, fields) {
        if (err) throw err
        showSearchResults(rows)

        res.render('vw-nisfResults2', { //render searchResults to vw-MySqlTableHub page
          title: 'sfAud2 (using nisf table)',
          searchResRows: searchResults,
          loadedSqlTbl: loadedSqlTbl
        })
      })

    }

    queryNisfJoinTable()

  })
}