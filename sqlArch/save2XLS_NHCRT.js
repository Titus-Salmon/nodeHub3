const express = require('express')
const router = express.Router()
// const fs = require('fs')
const xl = require('excel4node')
const nhcrtDisplayArrCache = require('../nodeCacheStuff/cache1')

module.exports = {

  save2XLS_NHCRT: router.post('/save2XLS_NHCRT', (req, res, next) => {

    nhcrtDisplayArrCacheValue = nhcrtDisplayArrCache.take('nhcrtDisplayArrCache_key') // this also deletes the key
    console.log(`JSON.stringify(nhcrtDisplayArrCacheValue[0])==> ${JSON.stringify(nhcrtDisplayArrCacheValue[0])}`)

    //NOTE++++++++>>> srcRsXLS_tsql is the original array that holds the collection of SearchResults objects {columnName: cellValue}
    //HOWEVER, since the inherent order (from showSearchResults()) of these key:value pairs is not the order we want to display them
    //in the excel file, and also since there are additional key:value pairs from srcRsXLS_tsql that we DON'T want to display (i.e.
    //invPK, invCPK), we selectively reorder and/or remove the key:value pairs from srcRsXLS_tsql to form the srcRsXLS_selectiveReordering array
    //(WITHOUT modifying the original srcRsXLS_tsql array).

    var srcRsXLS_selectiveReordering = []

    for (let a = 0; a < nhcrtDisplayArrCacheValue.length; a++) {
      let nhcrtObj = {}
      // THE ORDER OF THE FOLLOWING OBJECT KEYS IS CRITICAL TO THE ORDER OF EXCEL COLUMNS
      nhcrtObj['invPK'] = nhcrtDisplayArrCacheValue[a]['invPK']
      nhcrtObj['invCPK'] = nhcrtDisplayArrCacheValue[a]['invCPK']
      nhcrtObj['invScanCode'] = nhcrtDisplayArrCacheValue[a]['invScanCode']
      nhcrtObj['ordSupplierStockNumber'] = nhcrtDisplayArrCacheValue[a]['ordSupplierStockNumber']
      nhcrtObj['invName'] = nhcrtDisplayArrCacheValue[a]['invName']
      nhcrtObj['invSize'] = nhcrtDisplayArrCacheValue[a]['invSize']
      nhcrtObj['invReceiptAlias'] = nhcrtDisplayArrCacheValue[a]['invReceiptAlias']
      nhcrtObj['invDefault'] = nhcrtDisplayArrCacheValue[a]['invDefault']
      nhcrtObj['posTimeStamp'] = nhcrtDisplayArrCacheValue[a]['posTimeStamp']
      nhcrtObj['invDateCreated'] = nhcrtDisplayArrCacheValue[a]['invDateCreated']
      nhcrtObj['invEmpFkCreatedBy'] = nhcrtDisplayArrCacheValue[a]['invEmpFkCreatedBy']
      nhcrtObj['oupName'] = nhcrtDisplayArrCacheValue[a]['oupName']
      nhcrtObj['stoNumber'] = nhcrtDisplayArrCacheValue[a]['stoNumber']
      nhcrtObj['stoName'] = nhcrtDisplayArrCacheValue[a]['stoName']
      nhcrtObj['brdName'] = nhcrtDisplayArrCacheValue[a]['brdName']
      nhcrtObj['dptName'] = nhcrtDisplayArrCacheValue[a]['dptName']
      nhcrtObj['dptNumber'] = nhcrtDisplayArrCacheValue[a]['dptNumber']
      nhcrtObj['sibIdealMargin'] = nhcrtDisplayArrCacheValue[a]['sibIdealMargin']
      nhcrtObj['actualMargT0d'] = nhcrtDisplayArrCacheValue[a]['actualMargT0d']
      nhcrtObj['venCompanyname'] = nhcrtDisplayArrCacheValue[a]['venCompanyname']
      nhcrtObj['invLastreceived'] = nhcrtDisplayArrCacheValue[a]['invLastreceived']
      nhcrtObj['invLastsold'] = nhcrtDisplayArrCacheValue[a]['invLastsold']
      nhcrtObj['invLastcost'] = nhcrtDisplayArrCacheValue[a]['invLastcost']
      nhcrtObj['sibBasePrice'] = nhcrtDisplayArrCacheValue[a]['sibBasePrice']
      nhcrtObj['invOnhand'] = nhcrtDisplayArrCacheValue[a]['invOnhand']
      nhcrtObj['invOnorder'] = nhcrtDisplayArrCacheValue[a]['invOnorder']
      nhcrtObj['invIntransit'] = nhcrtDisplayArrCacheValue[a]['invIntransit']
      nhcrtObj['invMemo'] = nhcrtDisplayArrCacheValue[a]['invMemo']
      nhcrtObj['pi1Description'] = nhcrtDisplayArrCacheValue[a]['pi1Description']
      nhcrtObj['pi2Description'] = nhcrtDisplayArrCacheValue[a]['pi2Description']
      nhcrtObj['pi3Description'] = nhcrtDisplayArrCacheValue[a]['pi3Description']
      nhcrtObj['pi4Description'] = nhcrtDisplayArrCacheValue[a]['pi4Description']
      nhcrtObj['invPowerField1'] = nhcrtDisplayArrCacheValue[a]['invPowerField1']
      nhcrtObj['invPowerField2'] = nhcrtDisplayArrCacheValue[a]['invPowerField2']
      nhcrtObj['invPowerField3'] = nhcrtDisplayArrCacheValue[a]['invPowerField3']
      nhcrtObj['invPowerField4'] = nhcrtDisplayArrCacheValue[a]['invPowerField4']

      srcRsXLS_selectiveReordering.push(nhcrtObj)
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