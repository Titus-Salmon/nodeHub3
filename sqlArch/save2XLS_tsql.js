const express = require('express')
const router = express.Router()
// const fs = require('fs')
const xl = require('excel4node')
const catapultResArrCache = require('../nodeCacheStuff/cache1')

module.exports = {

  save2XLS_tsql: router.post('/save2XLS_tsql', (req, res, next) => {

    catapultResArrCacheValue = catapultResArrCache.take('catapultResArrCache_key') // this also deletes the key
    console.log(`JSON.stringify(catapultResArrCacheValue[0])==> ${JSON.stringify(catapultResArrCacheValue[0])}`)

    //NOTE++++++++>>> srcRsXLS_tsql is the original array that holds the collection of SearchResults objects {columnName: cellValue}
    //HOWEVER, since the inherent order (from showSearchResults()) of these key:value pairs is not the order we want to display them
    //in the excel file, and also since there are additional key:value pairs from srcRsXLS_tsql that we DON'T want to display (i.e.
    //invPK, invCPK), we selectively reorder and/or remove the key:value pairs from srcRsXLS_tsql to form the srcRsXLS_selectiveReordering array
    //(WITHOUT modifying the original srcRsXLS_tsql array).

    var srcRsXLS_selectiveReordering = []

    for (let a = 0; a < catapultResArrCacheValue.length; a++) {
      let reorderedResObj = {}
      // THE ORDER OF THE FOLLOWING OBJECT KEYS IS CRITICAL TO THE ORDER OF EXCEL COLUMNS
      reorderedResObj['invScanCode'] = catapultResArrCacheValue[a]['invScanCode']
      reorderedResObj['ordSupplierStockNumber'] = catapultResArrCacheValue[a]['ordSupplierStockNumber']
      reorderedResObj['invName'] = catapultResArrCacheValue[a]['invName']
      reorderedResObj['invSize'] = catapultResArrCacheValue[a]['invSize']
      reorderedResObj['invReceiptAlias'] = catapultResArrCacheValue[a]['invReceiptAlias']
      reorderedResObj['invDefault'] = catapultResArrCacheValue[a]['invDefault']
      reorderedResObj['posTimeStamp'] = catapultResArrCacheValue[a]['posTimeStamp']
      reorderedResObj['invDateCreated'] = catapultResArrCacheValue[a]['invDateCreated']
      reorderedResObj['invEmpFkCreatedBy'] = catapultResArrCacheValue[a]['invEmpFkCreatedBy']
      reorderedResObj['oupName'] = catapultResArrCacheValue[a]['oupName']
      reorderedResObj['stoNumber'] = catapultResArrCacheValue[a]['stoNumber']
      reorderedResObj['stoName'] = catapultResArrCacheValue[a]['stoName']
      reorderedResObj['brdName'] = catapultResArrCacheValue[a]['brdName']
      reorderedResObj['dptName'] = catapultResArrCacheValue[a]['dptName']
      reorderedResObj['dptNumber'] = catapultResArrCacheValue[a]['dptNumber']
      reorderedResObj['sibIdealMargin'] = catapultResArrCacheValue[a]['sibIdealMargin']
      reorderedResObj['actualMargT0d'] = catapultResArrCacheValue[a]['actualMargT0d']
      reorderedResObj['venCompanyname'] = catapultResArrCacheValue[a]['venCompanyname']
      reorderedResObj['invLastreceived'] = catapultResArrCacheValue[a]['invLastreceived']
      reorderedResObj['invLastsold'] = catapultResArrCacheValue[a]['invLastsold']
      reorderedResObj['invLastcost'] = catapultResArrCacheValue[a]['invLastcost']
      reorderedResObj['sibBasePrice'] = catapultResArrCacheValue[a]['sibBasePrice']
      reorderedResObj['invOnhand'] = catapultResArrCacheValue[a]['invOnhand']
      reorderedResObj['invOnorder'] = catapultResArrCacheValue[a]['invOnorder']
      reorderedResObj['invIntransit'] = catapultResArrCacheValue[a]['invIntransit']
      reorderedResObj['invMemo'] = catapultResArrCacheValue[a]['invMemo']
      reorderedResObj['pi1Description'] = catapultResArrCacheValue[a]['pi1Description']
      reorderedResObj['pi2Description'] = catapultResArrCacheValue[a]['pi2Description']
      reorderedResObj['pi3Description'] = catapultResArrCacheValue[a]['pi3Description']
      reorderedResObj['pi4Description'] = catapultResArrCacheValue[a]['pi4Description']
      reorderedResObj['invPowerField1'] = catapultResArrCacheValue[a]['invPowerField1']
      reorderedResObj['invPowerField2'] = catapultResArrCacheValue[a]['invPowerField2']
      reorderedResObj['invPowerField3'] = catapultResArrCacheValue[a]['invPowerField3']
      reorderedResObj['invPowerField4'] = catapultResArrCacheValue[a]['invPowerField4']

      srcRsXLS_selectiveReordering.push(reorderedResObj)
    }

    console.log(`JSON.stringify(srcRsXLS_selectiveReordering[0])==> ${JSON.stringify(srcRsXLS_selectiveReordering[0])}`)


    // Create a new instance of a Workbook class
    var wb = new xl.Workbook()

    // Add Worksheets to the workbook
    var ws = wb.addWorksheet('Sheet 1')

    var bodyStyle = wb.createStyle({
      alignment: {
        wrapText: false,
        horizontal: 'center',
      },
      font: {
        color: 'black',
        size: 12,
      },
      // numberFormat: '$#,##0.00; ($#,##0.00); -',
    })

    var headerStyle = wb.createStyle({
      alignment: {
        wrapText: false,
        horizontal: 'center',
      },
      font: {
        color: 'black',
        size: 14,
        bold: true,

      },
      fill: { // §18.8.20 fill (Fill)
        type: 'pattern', // Currently only 'pattern' is implemented. Non-implemented option is 'gradient'
        patternType: 'solid', //solid=t0d //§18.18.55 ST_PatternType (Pattern Type)
        bgColor: 'black', // HTML style hex value. defaults to black
        fgColor: 'bright green' // HTML style hex value. defaults to black.
      },
    })

    var charmHilite = wb.createStyle({
      fill: { // §18.8.20 fill (Fill)
        type: 'pattern', // Currently only 'pattern' is implemented. Non-implemented option is 'gradient'
        patternType: 'solid', //solid=t0d //§18.18.55 ST_PatternType (Pattern Type)
        bgColor: 'black', // HTML style hex value. defaults to black
        fgColor: '#92D050' // HTML style hex value. defaults to black.
      },
    })

    var ediPriceHilite = wb.createStyle({
      fill: { // §18.8.20 fill (Fill)
        type: 'pattern', // Currently only 'pattern' is implemented. Non-implemented option is 'gradient'
        patternType: 'solid', //solid=t0d //§18.18.55 ST_PatternType (Pattern Type)
        bgColor: 'black', // HTML style hex value. defaults to black
        fgColor: '#93CDDD' // HTML style hex value. defaults to black.
      },
    })

    var sibBasePriceHilite = wb.createStyle({
      fill: { // §18.8.20 fill (Fill)
        type: 'pattern', // Currently only 'pattern' is implemented. Non-implemented option is 'gradient'
        patternType: 'solid', //solid=t0d //§18.18.55 ST_PatternType (Pattern Type)
        bgColor: 'black', // HTML style hex value. defaults to black
        fgColor: 'yellow' // HTML style hex value. defaults to black.
      },
    })

    var invalidOupName = wb.createStyle({
      fill: { // §18.8.20 fill (Fill)
        type: 'pattern', // Currently only 'pattern' is implemented. Non-implemented option is 'gradient'
        patternType: 'solid', //solid=t0d //§18.18.55 ST_PatternType (Pattern Type)
        bgColor: 'black', // HTML style hex value. defaults to black
        fgColor: 'red' // HTML style hex value. defaults to black.
      },
    })

    for (let i = 0; i < Object.keys(srcRsXLS_selectiveReordering[0]).length; i++) {

      ws.cell(1, i + 1) //this targets "header" cells
        .string(`${Object.keys(srcRsXLS_selectiveReordering[0])[i]}`)
        .style(headerStyle)

      for (let j = 0; j < srcRsXLS_selectiveReordering.length; j++) {
        ws.cell(j + 2, i + 1)
          .string(`${Object.values(srcRsXLS_selectiveReordering[j])[i]}`)
          .style(bodyStyle)
        if (Object.keys(srcRsXLS_selectiveReordering[0])[i] == 'charm') {
          ws.cell(j + 2, i + 1).style(charmHilite)
        }
        if (Object.keys(srcRsXLS_selectiveReordering[0])[i] == 'ediPrice') {
          ws.cell(j + 2, i + 1).style(ediPriceHilite)
        }
        if (Object.keys(srcRsXLS_selectiveReordering[0])[i] == 'sibBasePrice') {
          ws.cell(j + 2, i + 1).style(sibBasePriceHilite)
        }
        if (Object.values(srcRsXLS_selectiveReordering[j])[i] == 'invalid oupName') {
          ws.cell(j + 2, i + 1).style(invalidOupName)
        }
      }
    }


    wb.write(`${process.cwd()}/public/csv/${req.body['xlsPost']}.xlxs`)


    res.render('vw-TSqlTableHub', {
      title: `<<${process.cwd()}/public/csv/${req.body['xlsPost']}.xlxs SAVED>>`
    });

  })
}