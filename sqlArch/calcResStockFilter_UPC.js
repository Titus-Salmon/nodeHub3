const express = require('express')
const router = express.Router()
const mysql = require('mysql')

const cacheMainStockFilter = require('../nodeCacheStuff/cache1')

const connection = mysql.createConnection({
  host: process.env.RB_HOST,
  user: process.env.RB_USER,
  password: process.env.RB_PW,
  database: process.env.RB_DB,
  multipleStatements: true //MUST HAVE to make more than 1 sql statement in a single query
})

module.exports = {

  calcResStockFilter_UPC: router.post('/calcResStockFilter_UPC', (req, res, next) => {

    searchResultsCacheChecker = cacheMainStockFilter.get('searchResultsCache_key');
    if (searchResultsCacheChecker !== undefined) { //clear searchResultsCache_key if it exists
      cacheMainStockFilter.del('searchResultsCache_key')
    }

    srcRsINDstocked = []
    srcRsIND_NOTstocked = []
    srcRsSMstocked = []
    srcRsSM_NOTstocked = []
    srcRsMTstocked = []
    srcRsMT_NOTstocked = []
    srcRsSHstocked = []
    srcRsSH_NOTstocked = []
    srcRsGLstocked = []
    srcRsGL_NOTstocked = []

    searchResults = [] //clear searchResults from previous search
    // console.log('calcResStockFilter_UPC says: searchResults from router.post level===>', searchResults)

    searchResultsSplitParsedArr = []

    searchResultsForCSV = []
    searchResultsForCSVreview = [] //this is for holding data to generate your review excel sheet for Andrea & Brad
    // console.log('calcResStockFilter_UPC says: searchResultsForCSV from router.post level===>', searchResultsForCSV)
    csvContainer = []
    // console.log('calcResStockFilter_UPC says: csvContainer from router.post level===>', csvContainer)


    const postBody = req.body
    console.log('calcResStockFilter_UPC says: postBody==>', postBody)
    console.log('calcResStockFilter_UPC says: postBody[\'fldArrToPostPost\']==>', postBody['fldArrToPostPost'])
    console.log('calcResStockFilter_UPC says: postBody[\'fldArrToPostPost\'][0]==>', postBody['fldArrToPostPost'][0])

    let formInput0 = Object.values(postBody)[0] = loadedSqlTbl = postBody['tblNameToPostPost'] //tblNameToPostPost
    console.log('formInput0==>', formInput0)

    let todaysDateRaw = new Date()
    let todaysDateRaw_iso = todaysDateRaw.toISOString()
    let todaysDateRaw_split = todaysDateRaw_iso.split('T')
    let todaysDate = todaysDateRaw_split[0]
    console.log(`todaysDate==> ${todaysDate}`)

    let oneYearAgoRaw_pre = todaysDateRaw
    oneYearAgoRaw_pre.setFullYear(todaysDateRaw.getFullYear() - 1)

    let oneYearAgoRaw_iso = oneYearAgoRaw_pre.toISOString()
    let oneYearAgoRaw_split = oneYearAgoRaw_iso.split('T')
    let oneYearAgo = oneYearAgoRaw_split[0]
    console.log(`oneYearAgo==> ${oneYearAgo}`)

    // let storeNameArr = ['Indiana', 'Saint Matthews', 'Middletown', 'Springhurst', 'Gardiner Lane']
    let storeNumberArr = ['IN', 'SM', 'MT', 'SPR', 'GL']
    let storeAbbrevArr = ['IND', 'SM', 'MT', 'SH', 'GL']

    let saniRegex1 = /(\[)|(\])/g
    let saniRegex2 = /(?<=},),+(?={)/g //for some reason, we sometimes get the following format for searchResultsToStringPreSani:
    // {},,{} so we need to convert that to {},{}
    let saniRegex3 = /(,$)/g //for some reason, we sometimes get the following format for searchResultsToStringPreSani:
    // {}, so we need to convert that to {}; $ = end of string anchor (^ = beginning of string anchor)
    let saniRegex4 = /(^,)/g //if a store doesn't carry all items in set, we get the following format for searchResultsToStringPreSani:
    // ,{} so we need to convert that to {}; $ = end of string anchor (^ = beginning of string anchor)

    /* X(?=Y) 	Positive lookahead 	X if followed by Y
     * (?<=Y)X 	Positive lookbehind 	X if after Y
     * ==t0d==>you can combine the 2==> (?<=A)X(?=B) to yield: "X if after A and followed by B" <==t0d==*/
    let splitRegex1 = /(?<=}),(?={)/g
    let splitRegex2 = /(?<=}),,(?={)/g //for some reason, we sometimes get the following format for searchResultsToStringPreSani:
    // {},,{}, so we need to convert that to {},{}

    function showSearchResults(rows) {

      let nhcrtRows = rows

      for (let i = 0; i < nhcrtRows.length; i++) {
        for (let j = 0; j < storeNumberArr.length; j++) {

          storeNumber = storeNumberArr[j]
          storeAbbrev = storeAbbrevArr[j]

          function calcResStockFilter_UPC(storeNumber, storeAbbrev) {
            if (nhcrtRows[i]['stoNumber'] == storeNumber) {
              let rsltsObj = {}
              rsltsObj['ri_t0d'] = i
              rsltsObj[`${storeAbbrev}_UPCs`] = nhcrtRows[i]['invScanCode']
              if (nhcrtRows[i]['invLastreceived'] > oneYearAgo ||
                nhcrtRows[i]['invLastsold'] > oneYearAgo ||
                nhcrtRows[i]['invOnhand'] > 0) {
                rsltsObj[`${storeAbbrev}stocked`] = nhcrtRows[i]['invScanCode']
                if (nhcrtRows[i]['stoNumber'] == 'IN') {
                  srcRsINDstocked.push(rsltsObj)
                }
                if (nhcrtRows[i]['stoNumber'] == 'SM') {
                  srcRsSMstocked.push(rsltsObj)
                }
                if (nhcrtRows[i]['stoNumber'] == 'MT') {
                  srcRsMTstocked.push(rsltsObj)
                }
                if (nhcrtRows[i]['stoNumber'] == 'SPR') {
                  srcRsSHstocked.push(rsltsObj)
                }
                if (nhcrtRows[i]['stoNumber'] == 'GL') {
                  srcRsGLstocked.push(rsltsObj)
                }
              } else {
                rsltsObj[`${storeAbbrev}_NOTstocked`] = nhcrtRows[i]['invScanCode']
                if (nhcrtRows[i]['stoNumber'] == 'IN') {
                  srcRsIND_NOTstocked.push(rsltsObj)
                }
                if (nhcrtRows[i]['stoNumber'] == 'SM') {
                  srcRsSM_NOTstocked.push(rsltsObj)
                }
                if (nhcrtRows[i]['stoNumber'] == 'MT') {
                  srcRsMT_NOTstocked.push(rsltsObj)
                }
                if (nhcrtRows[i]['stoNumber'] == 'SPR') {
                  srcRsSH_NOTstocked.push(rsltsObj)
                }
                if (nhcrtRows[i]['stoNumber'] == 'GL') {
                  srcRsGL_NOTstocked.push(rsltsObj)
                }
              }
              // searchResults.push(rsltsObj)
            }
          }
          calcResStockFilter_UPC(storeNumber, storeAbbrev)
        }
      }

      console.log(`srcRsINDstocked==> ${srcRsINDstocked}`)
      console.log(`JSON.stringify(srcRsINDstocked)==> ${JSON.stringify(srcRsINDstocked)}`)
      console.log(`typeof JSON.stringify(srcRsINDstocked)==> ${typeof JSON.stringify(srcRsINDstocked)}`)
      let JSONstringifySrcRsINDstocked = JSON.stringify(srcRsINDstocked)
      console.log(`typeof JSONstringifySrcRsINDstocked==> ${typeof JSONstringifySrcRsINDstocked}`)

      srcRsINDstockedSani = JSON.stringify(srcRsINDstocked).replace(saniRegex1, "")
      srcRsIND_NOTstockedSani = JSON.stringify(srcRsIND_NOTstocked).replace(saniRegex1, "")
      srcRsSMstockedSani = JSON.stringify(srcRsSMstocked).replace(saniRegex1, "")
      srcRsSM_NOTstockedSani = JSON.stringify(srcRsSM_NOTstocked).replace(saniRegex1, "")
      srcRsMTstockedSani = JSON.stringify(srcRsMTstocked).replace(saniRegex1, "")
      srcRsMT_NOTstockedSani = JSON.stringify(srcRsMT_NOTstocked).replace(saniRegex1, "")
      srcRsSHstockedSani = JSON.stringify(srcRsSHstocked).replace(saniRegex1, "")
      srcRsSH_NOTstockedSani = JSON.stringify(srcRsSH_NOTstocked).replace(saniRegex1, "")
      srcRsGLstockedSani = JSON.stringify(srcRsGLstocked).replace(saniRegex1, "")
      srcRsGL_NOTstockedSani = JSON.stringify(srcRsGL_NOTstocked).replace(saniRegex1, "")


      searchResults.push(srcRsINDstockedSani, srcRsIND_NOTstockedSani, srcRsSMstockedSani, srcRsSM_NOTstockedSani,
        srcRsMTstockedSani, srcRsMT_NOTstockedSani, srcRsSHstockedSani, srcRsSH_NOTstockedSani,
        srcRsGLstockedSani, srcRsGL_NOTstockedSani)

      let searchResultsToStringPreSani = searchResults.toString()
      let searchResultsToString = searchResultsToStringPreSani.replace(saniRegex2, "").replace(saniRegex3, "").replace(saniRegex4, "")
      //for some reason, we sometimes get the following format for searchResultsToStringPreSani:
      // {},,{}, so we need to convert that to {},{}
      console.log(`searchResultsToString==> ${searchResultsToString}`)
      searchResultsSplit = searchResultsToString.split(splitRegex1)
      console.log(`searchResultsSplit.length==> ${searchResultsSplit.length}`)
      // console.log(`searchResultsSplit[0]==> ${searchResultsSplit[0]}`)
      console.log(`searchResultsSplit==> ${searchResultsSplit}`)
      console.log(`typeof searchResultsSplit[0]==> ${typeof searchResultsSplit[0]}`)
      console.log(`typeof JSON.parse(searchResultsSplit[0])==> ${typeof JSON.parse(searchResultsSplit[0])}`)

      for (let k = 0; k < searchResultsSplit.length; k++) {
        let searchResultsSplitParsed = JSON.parse(searchResultsSplit[k])
        searchResultsSplitParsedArr.push(searchResultsSplitParsed)
      }
      console.log(`searchResultsSplitParsedArr[0]['ri_t0d']==> ${searchResultsSplitParsedArr[0]['ri_t0d']}`)
    }


    function queryNhcrtTable() {
      connection.query(`SELECT * FROM ${formInput0}`, function (err, rows, fields) {
        if (err) throw err
        showSearchResults(rows)

        res.render('vw-stockFilter_UPC', { //render searchResults to vw-MySqlTableHub page
          title: 'stockFilter_UP (using nhcrt table)',
          searchResRows: searchResultsSplit,
          loadedSqlTbl: loadedSqlTbl,
          srcRsINDstocked: srcRsINDstocked,
          srcRsIND_NOTstocked: srcRsIND_NOTstocked,
          srcRsSMstocked: srcRsSMstocked,
          srcRsSM_NOTstocked: srcRsSM_NOTstocked,
          srcRsMTstocked: srcRsMTstocked,
          srcRsMT_NOTstocked: srcRsMT_NOTstocked,
          srcRsSHstocked: srcRsSHstocked,
          srcRsSH_NOTstocked: srcRsSH_NOTstocked,
          srcRsGLstocked: srcRsGLstocked,
          srcRsGL_NOTstocked: srcRsGL_NOTstocked,
          searchResultsSplitParsedArr: searchResultsSplitParsedArr
        })
      })
    }

    queryNhcrtTable()

  })
}