const express = require('express')
const router = express.Router()
const mysql = require('mysql')

// const cacheMainStockFilter = require('../nodeCacheStuff/cache1')

// const charmAndPowerCalc = require('../funcLibT0d/charmAndPowerCalc')

const connection = mysql.createConnection({
  host: process.env.RB_HOST,
  user: process.env.RB_USER,
  password: process.env.RB_PW,
  database: process.env.RB_DB,
  multipleStatements: true //MUST HAVE to make more than 1 sql statement in a single query
})

module.exports = {

  calcResPcwGenINFRA: router.post('/calcResPcwGenINFRA', (req, res, next) => {

    srcRsINDstocked = []
    // srcRsIND_NOTstocked = []
    srcRsSMstocked = []
    // srcRsSM_NOTstocked = []
    srcRsMTstocked = []
    // srcRsMT_NOTstocked = []
    srcRsSHstocked = []
    // srcRsSH_NOTstocked = []
    srcRsGLstocked = []
    // srcRsGL_NOTstocked = []

    searchResultsIND = []
    searchResultsSM = []
    searchResultsMT = []
    searchResultsSH = []
    searchResultsGL = []

    searchResultsIND_SplitParsedArr = []
    searchResultsSM_SplitParsedArr = []
    searchResultsMT_SplitParsedArr = []
    searchResultsSH_SplitParsedArr = []
    searchResultsGL_SplitParsedArr = []

    const postBody = req.body
    console.log('calcResPcwGenINFRA says: postBody==>', postBody)
    console.log('calcResPcwGenINFRA says: postBody[\'fldArrToPostPost\']==>', postBody['fldArrToPostPost'])
    console.log('calcResPcwGenINFRA says: postBody[\'fldArrToPostPost\'][0]==>', postBody['fldArrToPostPost'][0])

    let formInput0 = Object.values(postBody)[0] = loadedSqlTbl = postBody['tblNameToPostPost'] //tblNameToPostPost
    console.log('formInput0==>', formInput0)

    // let salePct = postBody['salePctPost']

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

    let storeNameArr = ['Indiana', 'Saint Matthews', 'Middletown', 'Springhurst', 'Gardiner Lane']

    let saniRegex1 = /(\[)|(\])/g

    /* X(?=Y) 	Positive lookahead 	X if followed by Y
     * (?<=Y)X 	Positive lookbehind 	X if after Y
     * ==t0d==>you can combine the 2==> (?<=A)X(?=B) to yield: "X if after A and followed by B" <==t0d==*/
    let splitRegex1 = /(?<=}),(?={)/g

    function showSearchResults(rows) {

      let nhcrtInfraSalesRows = rows
      console.log(`rows.length==> ${rows.length}`)

      for (let i = 0; i < nhcrtInfraSalesRows.length; i++) {
        function calcResPcwGenINFRA_mod() {
          // if (nhcrtInfraSalesRows[i]['stoName'] == storeName) {
          let rsltsObj = {}
          rsltsObj['ItemID'] = nhcrtInfraSalesRows[i]['invScanCode']
          rsltsObj['ReceiptAlias'] = nhcrtInfraSalesRows[i]['invReceiptAlias']
          rsltsObj['ItemTagsQty'] = "0"
          rsltsObj['ShelfLabelsQty'] = "0"
          if (nhcrtInfraSalesRows[i]['invLastreceived'] > oneYearAgo ||
            nhcrtInfraSalesRows[i]['invLastsold'] > oneYearAgo ||
            nhcrtInfraSalesRows[i]['invOnhand'] > 0) {
            rsltsObj['SignsQty'] = "1"
          } else {
            rsltsObj['SignsQty'] = "0"
          }
          rsltsObj['PL1AdjustedPrice'] = `${nhcrtInfraSalesRows[i]['infra_sale']}`
          rsltsObj['PL1AutoDiscount'] = "Rainbow Blossom sale Price"
          rsltsObj['PL1CountTowardsQtyOnly'] = "0"
          rsltsObj['PL1NoManualDiscounts'] = "0"
          rsltsObj['PL2PromptForPrice'] = "0"
          rsltsObj['PL2AdjustedPrice'] = `${nhcrtInfraSalesRows[i]['infra_sale']}`
          rsltsObj['PL2AutoDiscount'] = "Rainbow Blossom sale Price"
          rsltsObj['PL2CountTowardsQtyOnly'] = "0"
          rsltsObj['PL2NoManualDiscounts'] = "0"
          rsltsObj['PL3PromptForPrice'] = "0"
          rsltsObj['PL3AdjustedPrice'] = `${nhcrtInfraSalesRows[i]['infra_sale']}`
          rsltsObj['PL3AutoDiscount'] = "Rainbow Blossom sale Price"
          rsltsObj['PL3CountTowardsQtyOnly'] = "0"
          rsltsObj['PL3NoManualDiscounts'] = "0"
          rsltsObj['PL4PromptForPrice'] = "0"
          rsltsObj['PL4AdjustedPrice'] = "0"
          rsltsObj['PL4AutoDiscount'] = ""
          rsltsObj['PL4CountTowardsQtyOnly'] = "0"
          rsltsObj['PL4NoManualDiscounts'] = "0"
          rsltsObj['PL1PricingDivider'] = ""
          rsltsObj['PL2PricingDivider'] = ""
          rsltsObj['PL3PricingDivider'] = ""
          rsltsObj['PL4PricingDivider'] = ""

          if (nhcrtInfraSalesRows[i]['stoName'] == 'Indiana') {
            srcRsINDstocked.push(rsltsObj)
          }
          if (nhcrtInfraSalesRows[i]['stoName'] == 'Saint Matthews') {
            srcRsSMstocked.push(rsltsObj)
          }
          if (nhcrtInfraSalesRows[i]['stoName'] == 'Middletown') {
            srcRsMTstocked.push(rsltsObj)
          }
          if (nhcrtInfraSalesRows[i]['stoName'] == 'Springhurst') {
            srcRsSHstocked.push(rsltsObj)
          }
          if (nhcrtInfraSalesRows[i]['stoName'] == 'Gardiner Lane') {
            srcRsGLstocked.push(rsltsObj)
          }

          //}
        }
        // calcResPcwGenINFRA_mod('Indiana')
        // calcResPcwGenINFRA_mod('Saint Matthews')
        // calcResPcwGenINFRA_mod('Middletown')
        // calcResPcwGenINFRA_mod('Springhurst')
        // calcResPcwGenINFRA_mod('Gardiner Lane')
        calcResPcwGenINFRA_mod()
      }

      console.log(`srcRsINDstocked.length==> ${srcRsINDstocked.length}`)
      console.log(`srcRsSMstocked.length==> ${srcRsSMstocked.length}`)
      console.log(`srcRsMTstocked.length==> ${srcRsMTstocked.length}`)
      console.log(`srcRsSHstocked.length==> ${srcRsSHstocked.length}`)
      console.log(`srcRsGLstocked.length==> ${srcRsGLstocked.length}`)

      // for (let i = 0; i < nhcrtInfraSalesRows.length; i++) {
      //   for (let j = 0; j < storeNameArr.length; j++) {

      //     storeName = storeNameArr[j]

      //     function calcResPcwGenINFRA(storeName) {
      //       if (nhcrtInfraSalesRows[i]['stoName'] == storeName) {
      //         let rsltsObj = {}
      //         // if (nhcrtInfraSalesRows[i]['invLastreceived'] > oneYearAgo ||
      //         //   nhcrtInfraSalesRows[i]['invLastsold'] > oneYearAgo ||
      //         //   nhcrtInfraSalesRows[i]['invOnhand'] > 0) {
      //         rsltsObj['ItemID'] = nhcrtInfraSalesRows[i]['invScanCode']
      //         rsltsObj['ReceiptAlias'] = nhcrtInfraSalesRows[i]['invReceiptAlias']
      //         rsltsObj['ItemTagsQty'] = "0"
      //         rsltsObj['ShelfLabelsQty'] = "0"
      //         if (nhcrtInfraSalesRows[i]['invLastreceived'] > oneYearAgo ||
      //           nhcrtInfraSalesRows[i]['invLastsold'] > oneYearAgo ||
      //           nhcrtInfraSalesRows[i]['invOnhand'] > 0) {
      //           rsltsObj['SignsQty'] = "1"
      //         } else {
      //           rsltsObj['SignsQty'] = "0"
      //         }
      //         // rsltsObj['SignsQty'] = "1"
      //         rsltsObj['PL1PromptForPrice'] = "0"
      //         // let reqdRtl = nhcrtInfraSalesRows[i]['sibBasePrice'] - (nhcrtInfraSalesRows[i]['sibBasePrice'] * salePct)
      //         // let dptNumber = nhcrtInfraSalesRows[i]['dptNumber']
      //         // console.log(`dptNumber==> ${dptNumber}`)

      //         // charmAndPowerCalc.charmAndPowerCalc(dptNumber, rsltsObj, reqdRtl)

      //         rsltsObj['PL1AdjustedPrice'] = `${nhcrtInfraSalesRows[i]['infra_sale']}`

      //         rsltsObj['PL1AutoDiscount'] = "Rainbow Blossom sale Price"
      //         rsltsObj['PL1CountTowardsQtyOnly'] = "0"
      //         rsltsObj['PL1NoManualDiscounts'] = "0"
      //         rsltsObj['PL2PromptForPrice'] = "0"
      //         // rsltsObj['PL2AdjustedPrice'] = "0"
      //         rsltsObj['PL2AdjustedPrice'] = `${nhcrtInfraSalesRows[i]['infra_sale']}`
      //         rsltsObj['PL2AutoDiscount'] = "Rainbow Blossom sale Price"
      //         rsltsObj['PL2CountTowardsQtyOnly'] = "0"
      //         rsltsObj['PL2NoManualDiscounts'] = "0"
      //         rsltsObj['PL3PromptForPrice'] = "0"
      //         // rsltsObj['PL3AdjustedPrice'] = "0"
      //         rsltsObj['PL3AdjustedPrice'] = `${nhcrtInfraSalesRows[i]['infra_sale']}`
      //         rsltsObj['PL3AutoDiscount'] = "Rainbow Blossom sale Price"
      //         rsltsObj['PL3CountTowardsQtyOnly'] = "0"
      //         rsltsObj['PL3NoManualDiscounts'] = "0"
      //         rsltsObj['PL4PromptForPrice'] = "0"
      //         rsltsObj['PL4AdjustedPrice'] = "0"
      //         rsltsObj['PL4AutoDiscount'] = ""
      //         rsltsObj['PL4CountTowardsQtyOnly'] = "0"
      //         rsltsObj['PL4NoManualDiscounts'] = "0"
      //         rsltsObj['PL1PricingDivider'] = ""
      //         rsltsObj['PL2PricingDivider'] = ""
      //         rsltsObj['PL3PricingDivider'] = ""
      //         rsltsObj['PL4PricingDivider'] = ""
      //         if (nhcrtInfraSalesRows[i]['stoName'] == 'Indiana') {
      //           srcRsINDstocked.push(rsltsObj)
      //         }
      //         if (nhcrtInfraSalesRows[i]['stoName'] == 'Saint Matthews') {
      //           srcRsSMstocked.push(rsltsObj)
      //         }
      //         if (nhcrtInfraSalesRows[i]['stoName'] == 'Middletown') {
      //           srcRsMTstocked.push(rsltsObj)
      //         }
      //         if (nhcrtInfraSalesRows[i]['stoName'] == 'Springhurst') {
      //           srcRsSHstocked.push(rsltsObj)
      //         }
      //         if (nhcrtInfraSalesRows[i]['stoName'] == 'Gardiner Lane') {
      //           srcRsGLstocked.push(rsltsObj)
      //         }
      //         //}
      //       }
      //     }
      //     calcResPcwGenINFRA(storeName)
      //   }
      // }

      // console.log(`srcRsINDstocked==> ${srcRsINDstocked}`)
      // console.log(`JSON.stringify(srcRsINDstocked)==> ${JSON.stringify(srcRsINDstocked)}`)
      console.log(`typeof JSON.stringify(srcRsINDstocked)==> ${typeof JSON.stringify(srcRsINDstocked)}`)
      let JSONstringifySrcRsINDstocked = JSON.stringify(srcRsINDstocked)
      console.log(`typeof JSONstringifySrcRsINDstocked==> ${typeof JSONstringifySrcRsINDstocked}`)

      srcRsINDstockedSani = JSON.stringify(srcRsINDstocked).replace(saniRegex1, "")
      // srcRsIND_NOTstockedSani = JSON.stringify(srcRsIND_NOTstocked).replace(saniRegex1, "")
      srcRsSMstockedSani = JSON.stringify(srcRsSMstocked).replace(saniRegex1, "")
      // srcRsSM_NOTstockedSani = JSON.stringify(srcRsSM_NOTstocked).replace(saniRegex1, "")
      srcRsMTstockedSani = JSON.stringify(srcRsMTstocked).replace(saniRegex1, "")
      // srcRsMT_NOTstockedSani = JSON.stringify(srcRsMT_NOTstocked).replace(saniRegex1, "")
      srcRsSHstockedSani = JSON.stringify(srcRsSHstocked).replace(saniRegex1, "")
      // srcRsSH_NOTstockedSani = JSON.stringify(srcRsSH_NOTstocked).replace(saniRegex1, "")
      srcRsGLstockedSani = JSON.stringify(srcRsGLstocked).replace(saniRegex1, "")
      // srcRsGL_NOTstockedSani = JSON.stringify(srcRsGL_NOTstocked).replace(saniRegex1, "")

      searchResultsIND.push(srcRsINDstockedSani)
      console.log(`searchResultsIND.length==> ${searchResultsIND.length}`)
      // console.log(`searchResultsIND==> ${searchResultsIND}`)
      searchResultsSM.push(srcRsSMstockedSani)
      console.log(`searchResultsSM.length==> ${searchResultsSM.length}`)
      // console.log(`searchResultsSM==> ${searchResultsSM}`)
      searchResultsMT.push(srcRsMTstockedSani)
      console.log(`searchResultsMT.length==> ${searchResultsMT.length}`)
      // console.log(`searchResultsMT==> ${searchResultsMT}`)
      searchResultsSH.push(srcRsSHstockedSani)
      console.log(`searchResultsSH.length==> ${searchResultsSH.length}`)
      // console.log(`searchResultsSH==> ${searchResultsSH}`)
      searchResultsGL.push(srcRsGLstockedSani)
      console.log(`searchResultsGL.length==> ${searchResultsGL.length}`)
      // console.log(`searchResultsGL==> ${searchResultsGL}`)

      let searchResultsIND_ToString = searchResultsIND.toString()
      searchResultsIND_Split = searchResultsIND_ToString.split(splitRegex1)
      console.log(`searchResultsIND_Split.length==> ${searchResultsIND_Split.length}`)
      console.log(`searchResultsIND_Split[0]==> ${searchResultsIND_Split[0]}`)
      console.log(`typeof searchResultsIND_Split[0]==> ${typeof searchResultsIND_Split[0]}`)
      console.log(`typeof JSON.parse(searchResultsIND_Split[0])==> ${typeof JSON.parse(searchResultsIND_Split[0])}`)

      for (let k = 0; k < searchResultsIND_Split.length; k++) {
        let searchResultsIND_SplitParsed = JSON.parse(searchResultsIND_Split[k])
        searchResultsIND_SplitParsedArr.push(searchResultsIND_SplitParsed)
      }
      console.log(`searchResultsIND_SplitParsedArr[0]['ItemID']==> ${searchResultsIND_SplitParsedArr[0]['ItemID']}`)

      let searchResultsSM_ToString = searchResultsSM.toString()
      searchResultsSM_Split = searchResultsSM_ToString.split(splitRegex1)
      for (let k = 0; k < searchResultsSM_Split.length; k++) {
        let searchResultsSM_SplitParsed = JSON.parse(searchResultsSM_Split[k])
        searchResultsSM_SplitParsedArr.push(searchResultsSM_SplitParsed)
      }

      let searchResultsMT_ToString = searchResultsMT.toString()
      searchResultsMT_Split = searchResultsMT_ToString.split(splitRegex1)
      for (let k = 0; k < searchResultsMT_Split.length; k++) {
        let searchResultsMT_SplitParsed = JSON.parse(searchResultsMT_Split[k])
        searchResultsMT_SplitParsedArr.push(searchResultsMT_SplitParsed)
      }

      let searchResultsSH_ToString = searchResultsSH.toString()
      searchResultsSH_Split = searchResultsSH_ToString.split(splitRegex1)
      for (let k = 0; k < searchResultsSH_Split.length; k++) {
        let searchResultsSH_SplitParsed = JSON.parse(searchResultsSH_Split[k])
        searchResultsSH_SplitParsedArr.push(searchResultsSH_SplitParsed)
      }

      let searchResultsGL_ToString = searchResultsGL.toString()
      searchResultsGL_Split = searchResultsGL_ToString.split(splitRegex1)
      for (let k = 0; k < searchResultsGL_Split.length; k++) {
        let searchResultsGL_SplitParsed = JSON.parse(searchResultsGL_Split[k])
        searchResultsGL_SplitParsedArr.push(searchResultsGL_SplitParsed)
      }


    }




    function queryNhcrtTable() {
      connection.query(`SELECT * FROM ${formInput0}`, function (err, rows, fields) {
        if (err) throw err
        showSearchResults(rows)

        res.render('vw-pcwGenINFRA', { //render searchResults to vw-MySqlTableHub page
          title: 'pcwGenINFRA (using nhcrtInfraSales table)',
          searchResRowsIND: searchResultsIND_Split,
          searchResRowsSM: searchResultsSM_Split,
          searchResRowsMT: searchResultsMT_Split,
          searchResRowsSH: searchResultsSH_Split,
          searchResRowsGL: searchResultsGL_Split,
          loadedSqlTbl: loadedSqlTbl,
          srcRsINDstocked: srcRsINDstocked,
          // srcRsIND_NOTstocked: srcRsIND_NOTstocked,
          srcRsSMstocked: srcRsSMstocked,
          // srcRsSM_NOTstocked: srcRsSM_NOTstocked,
          srcRsMTstocked: srcRsMTstocked,
          // srcRsMT_NOTstocked: srcRsMT_NOTstocked,
          srcRsSHstocked: srcRsSHstocked,
          // srcRsSH_NOTstocked: srcRsSH_NOTstocked,
          srcRsGLstocked: srcRsGLstocked,
          // srcRsGL_NOTstocked: srcRsGL_NOTstocked,
          searchResultsIND_SplitParsedArr: searchResultsIND_SplitParsedArr,
          searchResultsSM_SplitParsedArr: searchResultsSM_SplitParsedArr,
          searchResultsMT_SplitParsedArr: searchResultsMT_SplitParsedArr,
          searchResultsSH_SplitParsedArr: searchResultsSH_SplitParsedArr,
          searchResultsGL_SplitParsedArr: searchResultsGL_SplitParsedArr,
        })
      })
    }

    queryNhcrtTable()

  })
}