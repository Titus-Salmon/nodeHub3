const express = require('express')
const router = express.Router()
const mysql = require('mysql')

// const cacheMainStockFilter = require('../nodeCacheStuff/cache1')

const connection = mysql.createConnection({
  host: process.env.RB_HOST,
  user: process.env.RB_USER,
  password: process.env.RB_PW,
  database: process.env.RB_DB,
  multipleStatements: true //MUST HAVE to make more than 1 sql statement in a single query
})

module.exports = {

  calcResRbInvUpdater: router.post('/calcResRbInvUpdater', (req, res, next) => {

    // searchResultsCacheChecker = cacheMainStockFilter.get('searchResultsCache_key');
    // if (searchResultsCacheChecker !== undefined) { //clear searchResultsCache_key if it exists
    //   cacheMainStockFilter.del('searchResultsCache_key')
    // }

    wishlistIgnore = []
    wishlistUpdate = []

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
    // console.log('calcResRbInvUpdater says: searchResults from router.post level===>', searchResults)

    searchResultsSplitParsedArr = []

    searchResultsForCSV = []
    searchResultsForCSVreview = [] //this is for holding data to generate your review excel sheet for Andrea & Brad
    // console.log('calcResRbInvUpdater says: searchResultsForCSV from router.post level===>', searchResultsForCSV)
    csvContainer = []
    // console.log('calcResRbInvUpdater says: csvContainer from router.post level===>', csvContainer)


    const postBody = req.body
    console.log('calcResRbInvUpdater says: postBody==>', postBody)
    // console.log('calcResRbInvUpdater says: postBody[\'fldArrToPostPost\']==>', postBody['fldArrToPostPost'])
    // console.log('calcResRbInvUpdater says: postBody[\'fldArrToPostPost\'][0]==>', postBody['fldArrToPostPost'][0])

    let nhcrtRbInvTable = postBody['nhcrtRbInvTablePost'] //nhcrtRbInvTablePost
    console.log('nhcrtRbInvTable==>', nhcrtRbInvTable)

    let rb_inventoryTable = postBody['rb_inventoryTablePost']

    let todaysDateRaw1 = new Date()
    let todaysDateRaw1_iso = todaysDateRaw1.toISOString()
    let todaysDateRaw1_split = todaysDateRaw1_iso.split('T')
    let todaysDate1 = todaysDateRaw1_split[0]
    console.log(`todaysDate1==> ${todaysDate1}`)

    //v//////////one year ago///////////////////////////////////////
    let oneYearAgoRaw_pre = todaysDateRaw1
    oneYearAgoRaw_pre.setFullYear(todaysDateRaw1.getFullYear() - 1)

    let oneYearAgoRaw_iso = oneYearAgoRaw_pre.toISOString()
    let oneYearAgoRaw_split = oneYearAgoRaw_iso.split('T')
    let oneYearAgo = oneYearAgoRaw_split[0]
    console.log(`oneYearAgo==> ${oneYearAgo}`)
    //^//////////one year ago///////////////////////////////////////

    //v//////////one month ago///////////////////////////////////////
    let today = new Date()
    let todayInMilliseconds = today.getTime()
    let oneMonthAgoInMilliseconds = todayInMilliseconds - 2592000000
    let todayISO = new Date(today).toISOString()
    console.log(`todayISO==> ${todayISO}`)
    let oneMonthAgoISO = new Date(oneMonthAgoInMilliseconds).toISOString()
    console.log(`oneMonthAgoISO==> ${oneMonthAgoISO}`)
    let oneMonthAgoISO_split = oneMonthAgoISO.split('T')
    let oneMonthAgo = oneMonthAgoISO_split[0]
    console.log(`oneMontghAgo==> ${oneMonthAgo}`)
    //^//////////one month ago///////////////////////////////////////

    // let storeNameArr = ['Indiana', 'Saint Matthews', 'Middletown', 'Springhurst', 'Gardiner Lane']
    let storeNumberArr = ['IN', 'SM', 'MT', 'SPR', 'GL']
    let storeAbbrevArr = ['IND', 'SM', 'MT', 'SH', 'GL']

    let saniRegex1 = /(\[)|(\])/g
    let saniRegex2 = /"/g
    let saniRegex3 = /\s/g

    // /* X(?=Y) 	Positive lookahead 	X if followed by Y
    //  * (?<=Y)X 	Positive lookbehind 	X if after Y
    //  * ==t0d==>you can combine the 2==> (?<=A)X(?=B) to yield: "X if after A and followed by B" <==t0d==*/
    // let splitRegex1 = /(?<=}),(?={)/g

    function showSearchResults(rows) {

      console.log(`rows.length from showSearchResults==> ${rows.length}`)

      let nhcrtRows = rows[0]
      let wishlistRows = rows[1]

      console.log(`nhcrtRows[0]==> ${nhcrtRows[0]}`)
      console.log(`JSON.stringify(nhcrtRows[0])==> ${JSON.stringify(nhcrtRows[0])}`)
      console.log(`wishlistRows[0]==> ${wishlistRows[0]}`)
      console.log(`JSON.stringify(wishlistRows[0])==> ${JSON.stringify(wishlistRows[0])}`)

      // let wishlistCheckerObj = {}

      for (let k = 0; k < wishlistRows.length; k++) {
        let wishlistCheckerObj = {}
        if (wishlistRows[k]['rb_approved'] < oneMonthAgo) { //if the Date value for rb_approved is less than the Date value for one month ago
          //(i.e., if an item has been approved longer than one month ago), WE WILL UPDATE THAT ITEM using the new sign filter, since we've
          //presumably had enough time for that item to have a lastSold or lastReceived date.
          wishlistCheckerObj['upc'] = wishlistRows[k]['upc_code']
          wishlistCheckerObj['dateApproved'] = wishlistRows[k]['rb_approved']
          wishlistUpdate.push(wishlistCheckerObj)
        } else { //otherwise, we'll ignore it
          wishlistCheckerObj['upc'] = wishlistRows[k]['upc_code']
          wishlistCheckerObj['dateApproved'] = wishlistRows[k]['rb_approved']
          wishlistIgnore.push(wishlistCheckerObj)
        }
      }

      for (let m = 0; m < wishlistIgnore.length; m++) { //just a check to make sure the right items (approved within the last month) are ignored
        if (wishlistIgnore[m]['dateApproved'] !== null)
          console.log(`JSON.stringify(wishlistIgnore[${m})]==> ${JSON.stringify(wishlistIgnore[m])}`)
      }

      for (let i = 0; i < nhcrtRows.length; i++) {
        for (let j = 0; j < storeNumberArr.length; j++) {

          storeNumber = storeNumberArr[j]
          storeAbbrev = storeAbbrevArr[j]

          function calcResRbInvUpdater(storeNumber, storeAbbrev) {
            if (nhcrtRows[i]['stoNumber'] == storeNumber) {
              if (nhcrtRows[i]['invLastreceived'] > oneYearAgo ||
                nhcrtRows[i]['invLastsold'] > oneYearAgo ||
                nhcrtRows[i]['invOnhand'] > 0) {
                if (nhcrtRows[i]['stoNumber'] == 'IN') {
                  srcRsINDstocked.push(`${nhcrtRows[i]['invScanCode']}`)
                }
                if (nhcrtRows[i]['stoNumber'] == 'SM') {
                  srcRsSMstocked.push(`${nhcrtRows[i]['invScanCode']}`)
                }
                if (nhcrtRows[i]['stoNumber'] == 'MT') {
                  srcRsMTstocked.push(`${nhcrtRows[i]['invScanCode']}`)
                }
                if (nhcrtRows[i]['stoNumber'] == 'SPR') {
                  srcRsSHstocked.push(`${nhcrtRows[i]['invScanCode']}`)
                }
                if (nhcrtRows[i]['stoNumber'] == 'GL') {
                  srcRsGLstocked.push(`${nhcrtRows[i]['invScanCode']}`)
                }
              } else {
                if (nhcrtRows[i]['stoNumber'] == 'IN') {
                  srcRsIND_NOTstocked.push(`${nhcrtRows[i]['invScanCode']}`)
                }
                if (nhcrtRows[i]['stoNumber'] == 'SM') {
                  srcRsSM_NOTstocked.push(`${nhcrtRows[i]['invScanCode']}`)
                }
                if (nhcrtRows[i]['stoNumber'] == 'MT') {
                  srcRsMT_NOTstocked.push(`${nhcrtRows[i]['invScanCode']}`)
                }
                if (nhcrtRows[i]['stoNumber'] == 'SPR') {
                  srcRsSH_NOTstocked.push(`${nhcrtRows[i]['invScanCode']}`)
                }
                if (nhcrtRows[i]['stoNumber'] == 'GL') {
                  srcRsGL_NOTstocked.push(`${nhcrtRows[i]['invScanCode']}`)
                }
              }
            }
          }
          calcResRbInvUpdater(storeNumber, storeAbbrev)
        }
      }

      console.log(`srcRsINDstocked.length before wishlist filtering==> ${srcRsINDstocked.length}`)
      console.log(`srcRsIND_NOTstocked.length before wishlist filtering==> ${srcRsIND_NOTstocked.length}`)
      console.log(`srcRsSMstocked.length before wishlist filtering==> ${srcRsSMstocked.length}`)
      console.log(`srcRsSM_NOTstocked.length before wishlist filtering==> ${srcRsSM_NOTstocked.length}`)
      console.log(`srcRsMTstocked.length before wishlist filtering==> ${srcRsMTstocked.length}`)
      console.log(`srcRsMT_NOTstocked.length before wishlist filtering==> ${srcRsMT_NOTstocked.length}`)
      console.log(`srcRsSHstocked.length before wishlist filtering==> ${srcRsSHstocked.length}`)
      console.log(`srcRsSH_NOTstocked.length before wishlist filtering==> ${srcRsSH_NOTstocked.length}`)
      console.log(`srcRsGLstocked.length before wishlist filtering==> ${srcRsGLstocked.length}`)
      console.log(`srcRsGL_NOTstocked.length before wishlist filtering==> ${srcRsGL_NOTstocked.length}`)

      for (let m = 0; m < wishlistIgnore.length; m++) { //remove recent wishlist items from "stocked" and "not stocked" arrays for each store
        //(removing anything approved within the last month)
        for (let a = 0; a < srcRsINDstocked.length; a++) {
          if (wishlistIgnore[m]['upc'] == srcRsINDstocked[a]) {
            console.log(`${srcRsINDstocked[a]} removed from update, since its wishlist approved date is ${wishlistIgnore[m]['dateApproved']}`)
            srcRsINDstocked.splice(a, 1)
          }
        }
        for (let b = 0; b < srcRsIND_NOTstocked.length; b++) {
          if (wishlistIgnore[m]['upc'] == srcRsIND_NOTstocked[b]) {
            srcRsIND_NOTstocked.splice(b, 1)
          }
        }
        for (let c = 0; c < srcRsSMstocked.length; c++) {
          if (wishlistIgnore[m]['upc'] == srcRsSMstocked[c]) {
            srcRsSMstocked.splice(c, 1)
          }
        }
        for (let d = 0; d < srcRsSM_NOTstocked.length; d++) {
          if (wishlistIgnore[m]['upc'] == srcRsSM_NOTstocked[d]) {
            srcRsSM_NOTstocked.splice(d, 1)
          }
        }
        for (let e = 0; e < srcRsMTstocked.length; e++) {
          if (wishlistIgnore[m]['upc'] == srcRsMTstocked[e]) {
            srcRsMTstocked.splice(e, 1)
          }
        }
        for (let f = 0; f < srcRsMT_NOTstocked.length; f++) {
          if (wishlistIgnore[m]['upc'] == srcRsMT_NOTstocked[f]) {
            srcRsMT_NOTstocked.splice(f, 1)
          }
        }
        for (let g = 0; g < srcRsSHstocked.length; g++) {
          if (wishlistIgnore[m]['upc'] == srcRsSHstocked[g]) {
            srcRsSHstocked.splice(g, 1)
          }
        }
        for (let h = 0; h < srcRsSH_NOTstocked.length; h++) {
          if (wishlistIgnore[m]['upc'] == srcRsSH_NOTstocked[h]) {
            srcRsSH_NOTstocked.splice(h, 1)
          }
        }
        for (let p = 0; p < srcRsGLstocked.length; p++) {
          if (wishlistIgnore[m]['upc'] == srcRsGLstocked[p]) {
            srcRsGLstocked.splice(p, 1)
          }
        }
        for (let q = 0; q < srcRsGL_NOTstocked.length; q++) {
          if (wishlistIgnore[m]['upc'] == srcRsGL_NOTstocked[q]) {
            srcRsGL_NOTstocked.splice(q, 1)
          }
        }
      }

      console.log(`srcRsINDstocked.length after wishlist filtering==> ${srcRsINDstocked.length}`)
      console.log(`srcRsIND_NOTstocked.length after wishlist filtering==> ${srcRsIND_NOTstocked.length}`)
      console.log(`srcRsSMstocked.length after wishlist filtering==> ${srcRsSMstocked.length}`)
      console.log(`srcRsSM_NOTstocked.length after wishlist filtering==> ${srcRsSM_NOTstocked.length}`)
      console.log(`srcRsMTstocked.length after wishlist filtering==> ${srcRsMTstocked.length}`)
      console.log(`srcRsMT_NOTstocked.length after wishlist filtering==> ${srcRsMT_NOTstocked.length}`)
      console.log(`srcRsSHstocked.length after wishlist filtering==> ${srcRsSHstocked.length}`)
      console.log(`srcRsSH_NOTstocked.length after wishlist filtering==> ${srcRsSH_NOTstocked.length}`)
      console.log(`srcRsGLstocked.length after wishlist filtering==> ${srcRsGLstocked.length}`)
      console.log(`srcRsGL_NOTstocked.length after wishlist filtering==> ${srcRsGL_NOTstocked.length}`)


      console.log(`srcRsINDstocked[0]==> ${srcRsINDstocked[0]}`)
      console.log(`typeof srcRsINDstocked[0]==> ${typeof srcRsINDstocked[0]}`)

      srcRsINDstockedSani = JSON.stringify(srcRsINDstocked).replace(saniRegex1, "").replace(saniRegex2, "'").replace(saniRegex3, "")
      console.log(`typeof srcRsINDstockedSani==> ${typeof srcRsINDstockedSani}`)
      // console.log(`srcRsINDstockedSani==> ${srcRsINDstockedSani}`)
      srcRsIND_NOTstockedSani = JSON.stringify(srcRsIND_NOTstocked).replace(saniRegex1, "").replace(saniRegex2, "'").replace(saniRegex3, "")
      srcRsSMstockedSani = JSON.stringify(srcRsSMstocked).replace(saniRegex1, "").replace(saniRegex2, "'").replace(saniRegex3, "")
      srcRsSM_NOTstockedSani = JSON.stringify(srcRsSM_NOTstocked).replace(saniRegex1, "").replace(saniRegex2, "'").replace(saniRegex3, "")
      srcRsMTstockedSani = JSON.stringify(srcRsMTstocked).replace(saniRegex1, "").replace(saniRegex2, "'").replace(saniRegex3, "")
      srcRsMT_NOTstockedSani = JSON.stringify(srcRsMT_NOTstocked).replace(saniRegex1, "").replace(saniRegex2, "'").replace(saniRegex3, "")
      // console.log(`srcRsMT_NOTstockedSani==> ${srcRsMT_NOTstockedSani}`)
      srcRsSHstockedSani = JSON.stringify(srcRsSHstocked).replace(saniRegex1, "").replace(saniRegex2, "'").replace(saniRegex3, "")
      srcRsSH_NOTstockedSani = JSON.stringify(srcRsSH_NOTstocked).replace(saniRegex1, "").replace(saniRegex2, "'").replace(saniRegex3, "")
      srcRsGLstockedSani = JSON.stringify(srcRsGLstocked).replace(saniRegex1, "").replace(saniRegex2, "'").replace(saniRegex3, "")
      srcRsGL_NOTstockedSani = JSON.stringify(srcRsGL_NOTstocked).replace(saniRegex1, "").replace(saniRegex2, "'").replace(saniRegex3, "")

    }


    function queryNhcrtTable() {
      connection.query(`
      SELECT * FROM ${nhcrtRbInvTable};
      SELECT * FROM rb_wishlist;`, function (err, rows, fields) {
        if (err) throw err
        showSearchResults(rows)

        console.log(`srcRsINDstocked[0] called from queryNhcrtTable==> ${srcRsINDstocked[0]}`)

        connection.query(`
        UPDATE ${rb_inventoryTable}
        SET inv_in_stock = '1'
        WHERE trim(inv_upc)
        IN (${srcRsINDstockedSani});
        
        UPDATE ${rb_inventoryTable}
        SET inv_in_stock = '0'
        WHERE trim(inv_upc)
        IN (${srcRsIND_NOTstockedSani});
        
        UPDATE ${rb_inventoryTable}
        SET inv_sm_stock = '1'
        WHERE trim(inv_upc)
        IN (${srcRsSMstockedSani});
        
        UPDATE ${rb_inventoryTable}
        SET inv_sm_stock = '0'
        WHERE trim(inv_upc)
        IN (${srcRsSM_NOTstockedSani});
        
        UPDATE ${rb_inventoryTable}
        SET inv_mt_stock = '1'
        WHERE trim(inv_upc)
        IN (${srcRsMTstockedSani});
        
        UPDATE ${rb_inventoryTable}
        SET inv_mt_stock = '0'
        WHERE trim(inv_upc)
        IN (${srcRsMT_NOTstockedSani});
        
        UPDATE ${rb_inventoryTable}
        SET inv_sh_stock = '1'
        WHERE trim(inv_upc)
        IN (${srcRsSHstockedSani});
        
        UPDATE ${rb_inventoryTable}
        SET inv_sh_stock = '0'
        WHERE trim(inv_upc)
        IN (${srcRsSH_NOTstockedSani});
        
        UPDATE ${rb_inventoryTable}
        SET inv_gl_stock = '1'
        WHERE trim(inv_upc)
        IN (${srcRsGLstockedSani});
        
        UPDATE ${rb_inventoryTable}
        SET inv_gl_stock = '0'
        WHERE trim(inv_upc)
        IN (${srcRsGL_NOTstockedSani});`, function (err, rows, fields) {
          if (err) throw err

          console.log(`rows.length from nested connection.query==> ${rows.length}`)
          console.log(`JSON.stringify(rows[0]) from nested connection.query==> ${JSON.stringify(rows[0])}`)
          console.log(`JSON.stringify(rows[1]) from nested connection.query==> ${JSON.stringify(rows[1])}`)
          console.log(`JSON.stringify(rows[2]) from nested connection.query==> ${JSON.stringify(rows[2])}`)
          console.log(`JSON.stringify(rows[3]) from nested connection.query==> ${JSON.stringify(rows[3])}`)
          console.log(`JSON.stringify(rows[4]) from nested connection.query==> ${JSON.stringify(rows[4])}`)
          console.log(`JSON.stringify(rows[5]) from nested connection.query==> ${JSON.stringify(rows[5])}`)
          console.log(`JSON.stringify(rows[6]) from nested connection.query==> ${JSON.stringify(rows[6])}`)
          console.log(`JSON.stringify(rows[7]) from nested connection.query==> ${JSON.stringify(rows[7])}`)
          console.log(`JSON.stringify(rows[8]) from nested connection.query==> ${JSON.stringify(rows[8])}`)
          console.log(`JSON.stringify(rows[9]) from nested connection.query==> ${JSON.stringify(rows[9])}`)

          res.render('vw-rbInvUpdater', { //render searchResults to vw-MySqlTableHub page
            title: `vw-rbInvUpdater ==>> ${rb_inventoryTable} updated`,
            // searchResRows: searchResultsSplit,
            // srcRsINDstocked: srcRsINDstocked,
            // srcRsIND_NOTstocked: srcRsIND_NOTstocked,
            // srcRsSMstocked: srcRsSMstocked,
            // srcRsSM_NOTstocked: srcRsSM_NOTstocked,
            // srcRsMTstocked: srcRsMTstocked,
            // srcRsMT_NOTstocked: srcRsMT_NOTstocked,
            // srcRsSHstocked: srcRsSHstocked,
            // srcRsSH_NOTstocked: srcRsSH_NOTstocked,
            // srcRsGLstocked: srcRsGLstocked,
            // srcRsGL_NOTstocked: srcRsGL_NOTstocked,
            // searchResultsSplitParsedArr: searchResultsSplitParsedArr
          })
        })

      })
    }
    queryNhcrtTable()
  })
}