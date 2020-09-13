const express = require('express')
const router = express.Router()
// const fs = require('fs')
const xl = require('excel4node')
const mysql = require('mysql')

const connection = mysql.createConnection({
  host: process.env.RB_HOST,
  user: process.env.RB_USER,
  password: process.env.RB_PW,
  database: process.env.RB_DB,
  multipleStatements: true //MUST HAVE to make more than 1 sql statement in a single query
})

module.exports = {

  save2XLSreviewNEJ: router.post('/save2XLSreviewNEJ', (req, res, next) => {

    //NOTE++++++++>>> srcRsXLS_nonPag is the original array that holds the collection of SearchResults objects {columnName: cellValue}
    //HOWEVER, since the inherent order (from showSearchResults()) of these key:value pairs is not the order we want to display them
    //in the excel file, and also since there are additional key:value pairs from srcRsXLS_nonPag that we DON'T want to display (i.e.
    //invPK, invCPK), we selectively reorder and/or remove the key:value pairs from srcRsXLS_nonPag to form the srcRsXLS_selectiveReordering array
    //(WITHOUT modifying the original srcRsXLS_nonPag array).

    var srcRsXLS_selectiveReordering = []

    for (let a = 0; a < srcRsXLS_nonPag.length; a++) {
      let reorderedResObj = {}
      // reorderedResObj['invPK'] = srcRsXLS_nonPag[a]['invPK']
      // reorderedResObj['invCPK'] = srcRsXLS_nonPag[a]['invCPK']
      // THE ORDER OF THE FOLLOWING OBJECT KEYS IS CRITICAL TO THE ORDER OF EXCEL COLUMNS
      reorderedResObj['upc'] = srcRsXLS_nonPag[a]['upc']
      reorderedResObj['cpltSKU'] = srcRsXLS_nonPag[a]['cpltSKU']
      reorderedResObj['ediSKU'] = srcRsXLS_nonPag[a]['ediSKU']
      reorderedResObj['skuMismatch'] = srcRsXLS_nonPag[a]['skuMismatch']
      reorderedResObj['name'] = srcRsXLS_nonPag[a]['name']
      reorderedResObj['oupName'] = srcRsXLS_nonPag[a]['oupName']
      reorderedResObj['numPkgs'] = srcRsXLS_nonPag[a]['numPkgs']
      reorderedResObj['csPkgMltpl'] = srcRsXLS_nonPag[a]['csPkgMltpl']
      reorderedResObj['ovr'] = srcRsXLS_nonPag[a]['ovr']
      reorderedResObj['cpltCost'] = srcRsXLS_nonPag[a]['cpltCost']
      reorderedResObj['ediCost'] = srcRsXLS_nonPag[a]['ediCost']
      reorderedResObj['ediCostMod'] = srcRsXLS_nonPag[a]['ediCostMod']
      reorderedResObj['reqdRetail'] = srcRsXLS_nonPag[a]['reqdRetail']
      reorderedResObj['charm'] = srcRsXLS_nonPag[a]['charm']
      reorderedResObj['ediPrice'] = srcRsXLS_nonPag[a]['ediPrice']
      reorderedResObj['sibBasePrice'] = srcRsXLS_nonPag[a]['sibBasePrice']
      reorderedResObj['dptName'] = srcRsXLS_nonPag[a]['dptName']
      reorderedResObj['dptNumber'] = srcRsXLS_nonPag[a]['dptNumber']
      reorderedResObj['sibIdealMargin'] = srcRsXLS_nonPag[a]['sibIdealMargin']
      reorderedResObj['actualMargT0d'] = srcRsXLS_nonPag[a]['actualMargT0d']
      reorderedResObj['defaultMarg'] = srcRsXLS_nonPag[a]['defaultMarg']
      reorderedResObj['appldMrgn'] = srcRsXLS_nonPag[a]['appldMrgn']
      // reorderedResObj['discountToApply'] = srcRsXLS_nonPag[a]['discountToApply']
      reorderedResObj['discountToApply_WS'] = srcRsXLS_nonPag[a]['discountToApply_WS']
      reorderedResObj['discountToApply_Rtl'] = srcRsXLS_nonPag[a]['discountToApply_Rtl']
      reorderedResObj['edlpVar'] = srcRsXLS_nonPag[a]['edlpVar']
      reorderedResObj['pf1'] = srcRsXLS_nonPag[a]['pf1']
      reorderedResObj['pf2'] = srcRsXLS_nonPag[a]['pf2']
      // reorderedResObj['edlpUPC'] = srcRsXLS_nonPag[a]['edlpUPC']
      // reorderedResObj['imwSKU'] = srcRsXLS_nonPag[a]['imwSKU']
      // reorderedResObj['stoNumber'] = srcRsXLS_nonPag[a]['stoNumber']
      // reorderedResObj['stoName'] = srcRsXLS_nonPag[a]['stoName']
      // reorderedResObj['pf6'] = srcRsXLS_nonPag[a]['pf6']
      // reorderedResObj['sale_flag'] = srcRsXLS_nonPag[a]['sale_flag']
      // reorderedResObj['lastCost'] = srcRsXLS_nonPag[a]['lastCost']

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

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //v//Automatically add note to rainbowcat table that Retail Review has been generated//////////////////////////////////////
    let rtlRvwFilename = req.body['xlsPost']
    //here we are doing some js magic to extract the "ediName" from the Rtl Rvw name we're saving (nejTableNameRtlRvwYYYMMDD):
    // let regex1 = /(\d+)/g
    let vendorNameSplit1 = rtlRvwFilename.split('nej')
    let vendorNameSplit2 = vendorNameSplit1[1]
    let vendorNameSplit3 = vendorNameSplit2.toLowerCase().split('rtlrvw')
    let vendorName = vendorNameSplit3[0]
    let ediVendorName = `EDI-${vendorName.toUpperCase()}`
    console.log(`ediVendorName==> ${ediVendorName}`)

    function updateRbCat() {
      connection.query(
        `UPDATE rainbowcat SET RtlRvw = '${req.body['xlsPost']}.xlxs' WHERE ediName = '${ediVendorName}'`,
        function (err, rows, fields) {
          if (err) throw err
          res.render('vw-MySqlTableHub', {
            title: `<<${process.cwd()}/public/csv/${req.body['xlsPost']}.xlxs SAVED, and rainbowcat updated>>`
          })
        })
    }

    updateRbCat()
    //^//Automatically add note to rainbowcat table that Retail Review has been generated//////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    // res.render('vw-MySqlTableHub', {
    //   title: `<<${process.cwd()}/public/csv/${req.body['xlsPost']}.xlxs SAVED>>`
    // });

  })
}