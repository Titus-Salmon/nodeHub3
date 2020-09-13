const express = require('express')
const router = express.Router()
// const fs = require('fs')
const xl = require('excel4node')

module.exports = {

  save2XLS_tsql_autoreorder: router.post('/save2XLS_tsql_autoreorder', (req, res, next) => {

    //NOTE++++++++>>> srcRsXLS_tsql is the original array that holds the collection of SearchResults objects {columnName: cellValue}
    //HOWEVER, since the inherent order (from showSearchResults()) of these key:value pairs is not the order we want to display them
    //in the excel file, and also since there are additional key:value pairs from srcRsXLS_tsql that we DON'T want to display (i.e.
    //invPK, invCPK), we selectively reorder and/or remove the key:value pairs from srcRsXLS_tsql to form the srcRsXLS_selectiveReordering array
    //(WITHOUT modifying the original srcRsXLS_tsql array).

    var srcRsXLS_selectiveReordering = []

    for (let a = 0; a < srcRsXLS_tsql.length; a++) {
      let reorderedResObj = {}
      // THE ORDER OF THE FOLLOWING OBJECT KEYS IS CRITICAL TO THE ORDER OF EXCEL COLUMNS
      reorderedResObj['invScanCode'] = srcRsXLS_tsql[a]['invScanCode']
      reorderedResObj['ordSupplierStockNumber'] = srcRsXLS_tsql[a]['ordSupplierStockNumber']
      reorderedResObj['invName'] = srcRsXLS_tsql[a]['invName']
      reorderedResObj['invSize'] = srcRsXLS_tsql[a]['invSize']
      // reorderedResObj['invReceiptAlias'] = srcRsXLS_tsql[a]['invReceiptAlias']
      // reorderedResObj['invDefault'] = srcRsXLS_tsql[a]['invDefault']
      // reorderedResObj['posTimeStamp'] = srcRsXLS_tsql[a]['posTimeStamp']
      // reorderedResObj['invDateCreated'] = srcRsXLS_tsql[a]['invDateCreated']
      // reorderedResObj['invEmpFkCreatedBy'] = srcRsXLS_tsql[a]['invEmpFkCreatedBy']
      reorderedResObj['oupName'] = srcRsXLS_tsql[a]['oupName']
      reorderedResObj['stoNumber'] = srcRsXLS_tsql[a]['stoNumber']
      // reorderedResObj['stoName'] = srcRsXLS_tsql[a]['stoName']
      // reorderedResObj['brdName'] = srcRsXLS_tsql[a]['brdName']
      reorderedResObj['dptName'] = srcRsXLS_tsql[a]['dptName']
      // reorderedResObj['dptNumber'] = srcRsXLS_tsql[a]['dptNumber']
      // reorderedResObj['sibIdealMargin'] = srcRsXLS_tsql[a]['sibIdealMargin']
      reorderedResObj['venCompanyname'] = srcRsXLS_tsql[a]['venCompanyname']
      reorderedResObj['invLastreceived'] = srcRsXLS_tsql[a]['invLastreceived']
      reorderedResObj['invLastsold'] = srcRsXLS_tsql[a]['invLastsold']
      // reorderedResObj['invLastcost'] = srcRsXLS_tsql[a]['invLastcost']
      // reorderedResObj['sibBasePrice'] = srcRsXLS_tsql[a]['sibBasePrice']
      reorderedResObj['invOnhand'] = srcRsXLS_tsql[a]['invOnhand']
      reorderedResObj['invOnorder'] = srcRsXLS_tsql[a]['invOnorder']
      reorderedResObj['invIntransit'] = srcRsXLS_tsql[a]['invIntransit']
      // reorderedResObj['invMemo'] = srcRsXLS_tsql[a]['invMemo']
      reorderedResObj['pi1Description'] = srcRsXLS_tsql[a]['pi1Description']
      reorderedResObj['pi2Description'] = srcRsXLS_tsql[a]['pi2Description']
      // reorderedResObj['pi3Description'] = srcRsXLS_tsql[a]['pi3Description']
      // reorderedResObj['pi4Description'] = srcRsXLS_tsql[a]['pi4Description']
      // reorderedResObj['invPowerField1'] = srcRsXLS_tsql[a]['invPowerField1']
      // reorderedResObj['invPowerField2'] = srcRsXLS_tsql[a]['invPowerField2']
      // reorderedResObj['invPowerField3'] = srcRsXLS_tsql[a]['invPowerField3']
      reorderedResObj['invPowerField4'] = srcRsXLS_tsql[a]['invPowerField4']

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

    var mainGroupHilite = wb.createStyle({
      fill: { // §18.8.20 fill (Fill)
        type: 'pattern', // Currently only 'pattern' is implemented. Non-implemented option is 'gradient'
        patternType: 'solid', //solid=t0d //§18.18.55 ST_PatternType (Pattern Type)
        bgColor: 'black', // HTML style hex value. defaults to black
        fgColor: '#92D050' // HTML style hex value. defaults to black.
      },
    })

    var msqHilite = wb.createStyle({
      fill: { // §18.8.20 fill (Fill)
        type: 'pattern', // Currently only 'pattern' is implemented. Non-implemented option is 'gradient'
        patternType: 'solid', //solid=t0d //§18.18.55 ST_PatternType (Pattern Type)
        bgColor: 'black', // HTML style hex value. defaults to black
        fgColor: '#93CDDD' // HTML style hex value. defaults to black.
      },
    })

    var invenHilite = wb.createStyle({
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
        if (Object.keys(srcRsXLS_selectiveReordering[0])[i] == 'invScanCode' ||
          Object.keys(srcRsXLS_selectiveReordering[0])[i] == 'ordSupplierStockNumber' ||
          Object.keys(srcRsXLS_selectiveReordering[0])[i] == 'invName') {
          ws.cell(j + 2, i + 1).style(mainGroupHilite)
        }
        if (Object.keys(srcRsXLS_selectiveReordering[0])[i] == 'invPowerField4') {
          ws.cell(j + 2, i + 1).style(msqHilite)
        }
        if (Object.keys(srcRsXLS_selectiveReordering[0])[i] == 'invLastreceived' ||
          Object.keys(srcRsXLS_selectiveReordering[0])[i] == 'invLastsold' ||
          Object.keys(srcRsXLS_selectiveReordering[0])[i] == 'invOnhand' ||
          Object.keys(srcRsXLS_selectiveReordering[0])[i] == 'invOnorder' ||
          Object.keys(srcRsXLS_selectiveReordering[0])[i] == 'invIntransit') {
          ws.cell(j + 2, i + 1).style(invenHilite)
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