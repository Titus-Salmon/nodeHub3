const express = require('express')
const router = express.Router()
const mysql = require('mysql')

const cacheMainStockFilter = require('../nodeCacheStuff/cache1')

const charmAndPowerCalc = require('../funcLibT0d/charmAndPowerCalc')

const connection = mysql.createConnection({
  host: process.env.RB_HOST,
  user: process.env.RB_USER,
  password: process.env.RB_PW,
  database: process.env.RB_DB,
  multipleStatements: true //MUST HAVE to make more than 1 sql statement in a single query
})

module.exports = {

  calcResPcwGen: router.post('/calcResPcwGen', (req, res, next) => {

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
    console.log('calcResPcwGen says: postBody==>', postBody)
    console.log('calcResPcwGen says: postBody[\'fldArrToPostPost\']==>', postBody['fldArrToPostPost'])
    console.log('calcResPcwGen says: postBody[\'fldArrToPostPost\'][0]==>', postBody['fldArrToPostPost'][0])

    let formInput0 = Object.values(postBody)[0] = loadedSqlTbl = postBody['tblNameToPostPost'] //tblNameToPostPost
    console.log('formInput0==>', formInput0)

    let salePct = postBody['salePctPost']

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

      let nhcrtRows = rows
      var powerVsCharm

      for (let i = 0; i < nhcrtRows.length; i++) {
        for (let j = 0; j < storeNameArr.length; j++) {

          storeName = storeNameArr[j]

          function calcResPcwGen(storeName) {
            if (nhcrtRows[i]['stoName'] == storeName) {
              let rsltsObj = {}
              if (nhcrtRows[i]['invLastreceived'] > oneYearAgo ||
                nhcrtRows[i]['invLastsold'] > oneYearAgo ||
                nhcrtRows[i]['invOnhand'] > 0) {
                rsltsObj['ItemID'] = nhcrtRows[i]['invScanCode']
                rsltsObj['ReceiptAlias'] = nhcrtRows[i]['invReceiptAlias']
                rsltsObj['ItemTagsQty'] = "0"
                rsltsObj['ShelfLabelsQty'] = "0"
                rsltsObj['SignsQty'] = "1"
                rsltsObj['PL1PromptForPrice'] = "0"
                let reqdRtl = nhcrtRows[i]['sibBasePrice'] - (nhcrtRows[i]['sibBasePrice'] * salePct)
                let dptNumber = nhcrtRows[i]['dptNumber']
                console.log(`dptNumber==> ${dptNumber}`)

                charmAndPowerCalc.charmAndPowerCalc(dptNumber, rsltsObj, reqdRtl)

                // if (dptNumber == '152' || dptNumber == '9' || dptNumber == '176' || dptNumber == '177' || dptNumber == '13' ||
                //   dptNumber == '12' || dptNumber == '158' || dptNumber == '151' || dptNumber == '157') {
                //   powerVsCharm = 'charm'
                // } else {
                //   powerVsCharm = 'power'
                // }
                // console.log(`powerVsCharm==> ${powerVsCharm}`)
                // if (powerVsCharm == 'charm') {
                //   if (reqdRtl % 1 < .10 && reqdRtl % 1 > 0) { //change charm price to (#-1).99 if req'd rtl is #.00 -> #.10
                //     dbl0Or10CharmResult = reqdRtl - reqdRtl % 1 - .01
                //     rsltsObj['PL1AdjustedPrice'] = `${dbl0Or10CharmResult}`
                //     // return rsltsObj['PL1AdjustedPrice']
                //   } else {
                //     if (reqdRtl > 0) {
                //       if (reqdRtl < 10) { //if reqdRtl < 10, charm at .29, .49, .79 & .99
                //         if (reqdRtl % 1 < .20) {
                //           let adjPrice = reqdRtl - (reqdRtl % 1) + .29
                //           rsltsObj['PL1AdjustedPrice'] = `${adjPrice}`
                //           console.log(`rsltsObj['PL1AdjustedPrice']==> ${rsltsObj['PL1AdjustedPrice']}`)
                //         } else {
                //           if (reqdRtl % 1 < .30) {
                //             let adjPrice = reqdRtl - (reqdRtl % 1) + .29
                //             rsltsObj['PL1AdjustedPrice'] = `${adjPrice}`
                //             console.log(`rsltsObj['PL1AdjustedPrice']==> ${rsltsObj['PL1AdjustedPrice']}`)
                //           } else {
                //             if (reqdRtl % 1 < .40) {
                //               let adjPrice = reqdRtl - (reqdRtl % 1) + .49
                //               rsltsObj['PL1AdjustedPrice'] = `${adjPrice}`
                //               console.log(`rsltsObj['PL1AdjustedPrice']==> ${rsltsObj['PL1AdjustedPrice']}`)
                //             } else {
                //               if (reqdRtl % 1 < .50) {
                //                 let adjPrice = reqdRtl - (reqdRtl % 1) + .49
                //                 rsltsObj['PL1AdjustedPrice'] = `${adjPrice}`
                //                 console.log(`rsltsObj['PL1AdjustedPrice']==> ${rsltsObj['PL1AdjustedPrice']}`)
                //               } else {
                //                 if (reqdRtl % 1 < .60) {
                //                   let adjPrice = reqdRtl - (reqdRtl % 1) + .79
                //                   rsltsObj['PL1AdjustedPrice'] = `${adjPrice}`
                //                   console.log(`rsltsObj['PL1AdjustedPrice']==> ${rsltsObj['PL1AdjustedPrice']}`)
                //                 } else {
                //                   if (reqdRtl % 1 < .70) {
                //                     let adjPrice = reqdRtl - (reqdRtl % 1) + .79
                //                     rsltsObj['PL1AdjustedPrice'] = `${adjPrice}`
                //                     console.log(`rsltsObj['PL1AdjustedPrice']==> ${rsltsObj['PL1AdjustedPrice']}`)
                //                   } else {
                //                     if (reqdRtl % 1 < .80) {
                //                       let adjPrice = reqdRtl - (reqdRtl % 1) + .79
                //                       rsltsObj['PL1AdjustedPrice'] = `${adjPrice}`
                //                       console.log(`rsltsObj['PL1AdjustedPrice']==> ${rsltsObj['PL1AdjustedPrice']}`)
                //                     } else {
                //                       if (reqdRtl % 1 > .80) {
                //                         let adjPrice = reqdRtl - (reqdRtl % 1) + .99
                //                         rsltsObj['PL1AdjustedPrice'] = `${adjPrice}`
                //                         console.log(`rsltsObj['PL1AdjustedPrice']==> ${rsltsObj['PL1AdjustedPrice']}`)
                //                       }
                //                     }
                //                   }
                //                 }
                //               }
                //             }
                //           }
                //         }

                //       } else { //if reqdRtl > 10, charm at .29, .49, & .99
                //         if (reqdRtl % 1 <= .35) { //bump anything from #.10 to #.35 ==> #.29
                //           let adjPrice = reqdRtl - (reqdRtl % 1) + .29
                //           rsltsObj['PL1AdjustedPrice'] = `${adjPrice}`
                //           console.log(`rsltsObj['PL1AdjustedPrice']==> ${rsltsObj['PL1AdjustedPrice']}`)
                //         } else {
                //           if (reqdRtl % 1 <= .55) { //bump anything from #.36 to #.55 ==> #.49
                //             let adjPrice = reqdRtl - (reqdRtl % 1) + .49
                //             rsltsObj['PL1AdjustedPrice'] = `${adjPrice}`
                //             console.log(`rsltsObj['PL1AdjustedPrice']==> ${rsltsObj['PL1AdjustedPrice']}`)
                //           } else {
                //             if (reqdRtl % 1 <= .855) { //bump anything from #.56 to #.85 ==> #.99
                //               let adjPrice = reqdRtl - (reqdRtl % 1) + .99
                //               rsltsObj['PL1AdjustedPrice'] = `${adjPrice}`
                //               console.log(`rsltsObj['PL1AdjustedPrice']==> ${rsltsObj['PL1AdjustedPrice']}`)
                //             } else {
                //               if (reqdRtl % 1 > .856) { //bump anything from #.85+ and higher ==> #.99
                //                 let adjPrice = reqdRtl - (reqdRtl % 1) + .99
                //                 rsltsObj['PL1AdjustedPrice'] = `${adjPrice}`
                //                 console.log(`rsltsObj['PL1AdjustedPrice']==> ${rsltsObj['PL1AdjustedPrice']}`)
                //               }
                //             }
                //           }
                //         }
                //       }
                //     }
                //   }
                // } else { // if powerVsCharm == 'power'
                //   if (reqdRtl % 1 < .10 && reqdRtl % 1 > 0) { //change charm price to (#-1).99 if req'd rtl is #.00 -> #.10
                //     dbl0Or10CharmResult = reqdRtl - reqdRtl % 1 - .01
                //     rsltsObj['PL1AdjustedPrice'] = `${dbl0Or10CharmResult}`
                //     console.log(`rsltsObj['PL1AdjustedPrice']==> ${rsltsObj['PL1AdjustedPrice']}`)
                //   } else {
                //     if (reqdRtl > 0) {
                //       if (reqdRtl < 2) { //if reqdRtl < 2, power at .19, .29, .39, .49, .59, .79, .99
                //         if (reqdRtl % 1 < .20) {
                //           let adjPrice = reqdRtl - (reqdRtl % 1) + .19
                //           rsltsObj['PL1AdjustedPrice'] = `${adjPrice}`
                //           console.log(`rsltsObj['PL1AdjustedPrice']==> ${rsltsObj['PL1AdjustedPrice']}`)
                //         } else {
                //           if (reqdRtl % 1 < .30) {
                //             let adjPrice = reqdRtl - (reqdRtl % 1) + .29
                //             rsltsObj['PL1AdjustedPrice'] = `${adjPrice}`
                //             console.log(`rsltsObj['PL1AdjustedPrice']==> ${rsltsObj['PL1AdjustedPrice']}`)
                //           } else {
                //             if (reqdRtl % 1 < .40) {
                //               let adjPrice = reqdRtl - (reqdRtl % 1) + .39
                //               rsltsObj['PL1AdjustedPrice'] = `${adjPrice}`
                //               console.log(`rsltsObj['PL1AdjustedPrice']==> ${rsltsObj['PL1AdjustedPrice']}`)
                //             } else {
                //               if (reqdRtl % 1 < .50) {
                //                 let adjPrice = reqdRtl - (reqdRtl % 1) + .49
                //                 rsltsObj['PL1AdjustedPrice'] = `${adjPrice}`
                //                 console.log(`rsltsObj['PL1AdjustedPrice']==> ${rsltsObj['PL1AdjustedPrice']}`)
                //               } else {
                //                 if (reqdRtl % 1 < .60) {
                //                   let adjPrice = reqdRtl - (reqdRtl % 1) + .59
                //                   rsltsObj['PL1AdjustedPrice'] = `${adjPrice}`
                //                   console.log(`rsltsObj['PL1AdjustedPrice']==> ${rsltsObj['PL1AdjustedPrice']}`)
                //                 } else {
                //                   if (reqdRtl % 1 < .70) {
                //                     let adjPrice = reqdRtl - (reqdRtl % 1) + .79
                //                     rsltsObj['PL1AdjustedPrice'] = `${adjPrice}`
                //                     console.log(`rsltsObj['PL1AdjustedPrice']==> ${rsltsObj['PL1AdjustedPrice']}`)
                //                   } else {
                //                     if (reqdRtl % 1 < .80) {
                //                       let adjPrice = reqdRtl - (reqdRtl % 1) + .79
                //                       rsltsObj['PL1AdjustedPrice'] = `${adjPrice}`
                //                       console.log(`rsltsObj['PL1AdjustedPrice']==> ${rsltsObj['PL1AdjustedPrice']}`)
                //                     } else {
                //                       if (reqdRtl % 1 > .80) {
                //                         let adjPrice = reqdRtl - (reqdRtl % 1) + .99
                //                         rsltsObj['PL1AdjustedPrice'] = `${adjPrice}`
                //                         console.log(`rsltsObj['PL1AdjustedPrice']==> ${rsltsObj['PL1AdjustedPrice']}`)
                //                       }
                //                     }
                //                   }
                //                 }
                //               }
                //             }
                //           }
                //         }

                //       } else { //if reqdRtl > 2, power at .29, .49, .79, .99
                //         if (reqdRtl % 1 <= .35) { //bump anything from #.10 to #.35 ==> #.29
                //           let adjPrice = reqdRtl - (reqdRtl % 1) + .29
                //           rsltsObj['PL1AdjustedPrice'] = `${adjPrice}`
                //           console.log(`rsltsObj['PL1AdjustedPrice']==> ${rsltsObj['PL1AdjustedPrice']}`)
                //         } else {
                //           if (reqdRtl % 1 <= .55) { //bump anything from #.36 to #.55 ==> #.49
                //             let adjPrice = reqdRtl - (reqdRtl % 1) + .49
                //             rsltsObj['PL1AdjustedPrice'] = `${adjPrice}`
                //             console.log(`rsltsObj['PL1AdjustedPrice']==> ${rsltsObj['PL1AdjustedPrice']}`)
                //           } else {
                //             if (reqdRtl % 1 <= .855) { //bump anything from #.56 to #.85 ==> #.99
                //               let adjPrice = reqdRtl - (reqdRtl % 1) + .79
                //               rsltsObj['PL1AdjustedPrice'] = `${adjPrice}`
                //               console.log(`rsltsObj['PL1AdjustedPrice']==> ${rsltsObj['PL1AdjustedPrice']}`)
                //             } else {
                //               if (reqdRtl % 1 > .856) { //bump anything from #.85+ and higher ==> #.99
                //                 let adjPrice = reqdRtl - (reqdRtl % 1) + .99
                //                 rsltsObj['PL1AdjustedPrice'] = `${adjPrice}`
                //                 console.log(`rsltsObj['PL1AdjustedPrice']==> ${rsltsObj['PL1AdjustedPrice']}`)
                //               }
                //             }
                //           }
                //         }

                //       }
                //     }
                //   }
                // }
                rsltsObj['PL1AutoDiscount'] = "Rainbow Blossom sale Price"
                rsltsObj['PL1CountTowardsQtyOnly'] = "0"
                rsltsObj['PL1NoManualDiscounts'] = "0"
                rsltsObj['PL2PromptForPrice'] = "0"
                rsltsObj['PL2AdjustedPrice'] = "0"
                rsltsObj['PL2AutoDiscount'] = "Rainbow Blossom sale Price"
                rsltsObj['PL2CountTowardsQtyOnly'] = "0"
                rsltsObj['PL2NoManualDiscounts'] = "0"
                rsltsObj['PL3PromptForPrice'] = "0"
                rsltsObj['PL3AdjustedPrice'] = "0"
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
                if (nhcrtRows[i]['stoName'] == 'Indiana') {
                  srcRsINDstocked.push(rsltsObj)
                }
                if (nhcrtRows[i]['stoName'] == 'Saint Matthews') {
                  srcRsSMstocked.push(rsltsObj)
                }
                if (nhcrtRows[i]['stoName'] == 'Middletown') {
                  srcRsMTstocked.push(rsltsObj)
                }
                if (nhcrtRows[i]['stoName'] == 'Springhurst') {
                  srcRsSHstocked.push(rsltsObj)
                }
                if (nhcrtRows[i]['stoName'] == 'Gardiner Lane') {
                  srcRsGLstocked.push(rsltsObj)
                }
              }
            }
          }
          calcResPcwGen(storeName)
        }
      }

      console.log(`srcRsINDstocked==> ${srcRsINDstocked}`)
      console.log(`JSON.stringify(srcRsINDstocked)==> ${JSON.stringify(srcRsINDstocked)}`)
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
      searchResultsSM.push(srcRsSMstockedSani)
      searchResultsMT.push(srcRsMTstockedSani)
      searchResultsSH.push(srcRsSHstockedSani)
      searchResultsGL.push(srcRsGLstockedSani)

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

        res.render('vw-pcwGen', { //render searchResults to vw-MySqlTableHub page
          title: 'pcwGen (using nhcrt table)',
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