const express = require('express')
const router = express.Router()
// const fs = require('fs')
const xl = require('excel4node')
const keheSelectObjArrCache = require('../nodeCacheStuff/cache1')

module.exports = {

  save2XLS_keheSelectWSdiff: router.post('/save2XLS_keheSelectWSdiff', (req, res, next) => {

    keheSelectWSdiffArrCacheValue = keheSelectObjArrCache.take('keheSelectObjArrCache_key') // this also deletes the key
    console.log(`JSON.stringify(keheSelectWSdiffArrCacheValue[0])==> ${JSON.stringify(keheSelectWSdiffArrCacheValue[0])}`)

    //NOTE++++++++>>> srcRsXLS_tsql is the original array that holds the collection of SearchResults objects {columnName: cellValue}
    //HOWEVER, since the inherent order (from showSearchResults()) of these key:value pairs is not the order we want to display them
    //in the excel file, and also since there are additional key:value pairs from srcRsXLS_tsql that we DON'T want to display (i.e.
    //invPK, invCPK), we selectively reorder and/or remove the key:value pairs from srcRsXLS_tsql to form the srcRsXLS_selectiveReordering array
    //(WITHOUT modifying the original srcRsXLS_tsql array).

    var srcRsXLS_selectiveReordering = []

    for (let a = 0; a < keheSelectWSdiffArrCacheValue.length; a++) {
      let keheSelectWSdiffObj = {}
      // THE ORDER OF THE FOLLOWING OBJECT KEYS IS CRITICAL TO THE ORDER OF EXCEL COLUMNS
      keheSelectWSdiffObj['kehe_upc'] = keheSelectWSdiffArrCacheValue[a]['kehe_upc']
      keheSelectWSdiffObj['s_upc'] = keheSelectWSdiffArrCacheValue[a]['s_upc']
      keheSelectWSdiffObj['kehe_unit_type'] = keheSelectWSdiffArrCacheValue[a]['kehe_unit_type']
      keheSelectWSdiffObj['s_unit_type'] = keheSelectWSdiffArrCacheValue[a]['s_unit_type']
      keheSelectWSdiffObj['kehe_unit_cost'] = keheSelectWSdiffArrCacheValue[a]['kehe_unit_cost']
      keheSelectWSdiffObj['s_unit_cost'] = keheSelectWSdiffArrCacheValue[a]['s_unit_cost']
      keheSelectWSdiffObj['lower_cost'] = keheSelectWSdiffArrCacheValue[a]['lower_cost']
      keheSelectWSdiffObj['note'] = keheSelectWSdiffArrCacheValue[a]['note']
      keheSelectWSdiffObj['kehe_name'] = keheSelectWSdiffArrCacheValue[a]['kehe_name']
      keheSelectWSdiffObj['s_name'] = keheSelectWSdiffArrCacheValue[a]['s_name']
      keheSelectWSdiffObj['invReceiptAlias'] = keheSelectWSdiffArrCacheValue[a]['invReceiptAlias']
      keheSelectWSdiffObj['venCompanyname'] = keheSelectWSdiffArrCacheValue[a]['venCompanyname']

      srcRsXLS_selectiveReordering.push(keheSelectWSdiffObj)
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

    var diff25 = wb.createStyle({
      fill: { // §18.8.20 fill (Fill)
        type: 'pattern', // Currently only 'pattern' is implemented. Non-implemented option is 'gradient'
        patternType: 'solid', //solid=t0d //§18.18.55 ST_PatternType (Pattern Type)
        bgColor: 'black', // HTML style hex value. defaults to black
        fgColor: '#ffdb4b' // HTML style hex value. defaults to black.
      },
    })

    var diff50 = wb.createStyle({
      fill: { // §18.8.20 fill (Fill)
        type: 'pattern', // Currently only 'pattern' is implemented. Non-implemented option is 'gradient'
        patternType: 'solid', //solid=t0d //§18.18.55 ST_PatternType (Pattern Type)
        bgColor: 'black', // HTML style hex value. defaults to black
        fgColor: '#ff8533' // HTML style hex value. defaults to black.
      },
    })

    var diff75 = wb.createStyle({
      fill: { // §18.8.20 fill (Fill)
        type: 'pattern', // Currently only 'pattern' is implemented. Non-implemented option is 'gradient'
        patternType: 'solid', //solid=t0d //§18.18.55 ST_PatternType (Pattern Type)
        bgColor: 'black', // HTML style hex value. defaults to black
        fgColor: '#ff0000' // HTML style hex value. defaults to black.
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
        // if (Object.keys(srcRsXLS_selectiveReordering[0])[i] == 'charm') {
        //   ws.cell(j + 2, i + 1).style(charmHilite)
        // }
        // if (Object.keys(srcRsXLS_selectiveReordering[0])[i] == 'ediPrice') {
        //   ws.cell(j + 2, i + 1).style(ediPriceHilite)
        // }
        // if (Object.keys(srcRsXLS_selectiveReordering[0])[i] == 'sibBasePrice') {
        //   ws.cell(j + 2, i + 1).style(sibBasePriceHilite)
        // }
        if (Object.values(srcRsXLS_selectiveReordering[j])[i] == '25diff') {
          ws.cell(j + 2, i + 1).style(diff25)
        }
        if (Object.values(srcRsXLS_selectiveReordering[j])[i] == '50diff') {
          ws.cell(j + 2, i + 1).style(diff50)
        }
        if (Object.values(srcRsXLS_selectiveReordering[j])[i] == '75diff') {
          ws.cell(j + 2, i + 1).style(diff75)
        }
      }
    }


    wb.write(`${process.cwd()}/public/csv/${req.body['xlsPost']}.xlxs`)


    res.render('vw-keheSelectWSdiff', {
      title: `<<${process.cwd()}/public/csv/${req.body['xlsPost']}.xlxs SAVED>>`
    });

  })
}