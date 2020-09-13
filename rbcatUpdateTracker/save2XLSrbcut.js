const express = require('express')
const router = express.Router()
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

  save2XLSrbcut: router.post('/save2XLSrbcut', (req, res, next) => {

    //NOTE++++++++>>> rbCatUpdtTrkrDisplayArr4xls is the original array that holds the collection of SearchResults objects {columnName: cellValue}
    //HOWEVER, since the inherent order (from showSearchResults()) of these key:value pairs is NOT NECESSARILY the order we want to display them
    //in the excel file, and also since there are additional key:value pairs from rbCatUpdtTrkrDisplayArr4xls that we DON'T want to display, we
    //selectively reorder and/or remove the key:value pairs from rbCatUpdtTrkrDisplayArr4xls to form the rbCUTdisplArr_selectiveReordering array
    //(WITHOUT modifying the original rbCatUpdtTrkrDisplayArr4xls array).

    var rbCUTdisplArr_selectiveReordering = []

    function dateFixer(dateToFix) {
      if (dateToFix.includes('T')) {
        console.log(`dateToFix that includes T==> ${dateToFix}`)
        let dateToFixSplit_T = dateToFix.split('T')
        dateToFix = dateToFixSplit_T[0] // can't use let dateToFix here, because that would reinstantiate rbCatUpdtTrkrDisplayArr4xls[a]['date']
        //from below, as though it were a new variable
      }
      // let dateToFixSplit = dateToFix.split('-')
      // let dateToFixYear = dateToFixSplit[0]
      // let dateToFixDay = dateToFixSplit[1]
      // let dateToFixMonth = dateToFixSplit[2]
      // fixedDate = `${dateToFixDay}/${dateToFixMonth}/${dateToFixYear}`
      // console.log(`fixedDate from dateFixer()==> ${fixedDate}`)
      fixedDate = dateToFix
    }

    for (let a = 0; a < rbCatUpdtTrkrDisplayArr4xls.length; a++) {
      let reorderedResObj = {}
      dateFixer(rbCatUpdtTrkrDisplayArr4xls[a]['date'])
      // THE ORDER OF THE FOLLOWING OBJECT KEYS IS CRITICAL TO THE ORDER OF EXCEL COLUMNS
      reorderedResObj['date'] = fixedDate
      // reorderedResObj['date'] = rbCatUpdtTrkrDisplayArr4xls[a]['date']
      reorderedResObj['edi_vendor_name'] = rbCatUpdtTrkrDisplayArr4xls[a]['edi_vendor_name']
      reorderedResObj['wsImw'] = rbCatUpdtTrkrDisplayArr4xls[a]['wsImw']
      reorderedResObj['rtlImw'] = rbCatUpdtTrkrDisplayArr4xls[a]['rtlImw']
      reorderedResObj['items_updtd_ws'] = rbCatUpdtTrkrDisplayArr4xls[a]['items_updtd_ws']
      reorderedResObj['items_updtd_rtl'] = rbCatUpdtTrkrDisplayArr4xls[a]['items_updtd_rtl']
      reorderedResObj['note1'] = rbCatUpdtTrkrDisplayArr4xls[a]['note1']

      rbCUTdisplArr_selectiveReordering.push(reorderedResObj)
    }

    console.log(`JSON.stringify(rbCUTdisplArr_selectiveReordering[0])==> ${JSON.stringify(rbCUTdisplArr_selectiveReordering[0])}`)


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

    for (let i = 0; i < Object.keys(rbCUTdisplArr_selectiveReordering[0]).length; i++) {

      ws.cell(1, i + 1) //this targets "header" cells
        .string(`${Object.keys(rbCUTdisplArr_selectiveReordering[0])[i]}`)
        .style(headerStyle)

      for (let j = 0; j < rbCUTdisplArr_selectiveReordering.length; j++) {
        ws.cell(j + 2, i + 1)
          .string(`${Object.values(rbCUTdisplArr_selectiveReordering[j])[i]}`)
          .style(bodyStyle)
        if (Object.keys(rbCUTdisplArr_selectiveReordering[0])[i] == 'charm') {
          ws.cell(j + 2, i + 1).style(charmHilite)
        }
        if (Object.keys(rbCUTdisplArr_selectiveReordering[0])[i] == 'ediPrice') {
          ws.cell(j + 2, i + 1).style(ediPriceHilite)
        }
        if (Object.keys(rbCUTdisplArr_selectiveReordering[0])[i] == 'sibBasePrice') {
          ws.cell(j + 2, i + 1).style(sibBasePriceHilite)
        }
        if (Object.values(rbCUTdisplArr_selectiveReordering[j])[i] == 'invalid oupName') {
          ws.cell(j + 2, i + 1).style(invalidOupName)
        }
      }
    }


    wb.write(`${process.cwd()}/public/csv/${req.body['xlsPost']}.xlxs`)

    // ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // //v//Automatically add note to rainbowcat table that Retail Review has been generated//////////////////////////////////////
    // let rtlRvwFilename = req.body['xlsPost']
    // //here we are doing some js magic to extract the "ediName" from the Rtl Rvw name we're saving (nejTableNameRtlRvwYYYMMDD):
    // // let regex1 = /(\d+)/g
    // let vendorNameSplit1 = rtlRvwFilename.split('nej')
    // let vendorNameSplit2 = vendorNameSplit1[1]
    // let vendorNameSplit3 = vendorNameSplit2.toLowerCase().split('rtlrvw')
    // let vendorName = vendorNameSplit3[0]
    // let ediVendorName = `EDI-${vendorName.toUpperCase()}`
    // console.log(`ediVendorName==> ${ediVendorName}`)

    // function updateRbCat() {
    //   connection.query(
    //     `UPDATE rainbowcat SET RtlRvw = '${req.body['xlsPost']}.xlxs' WHERE ediName = '${ediVendorName}'`,
    //     function (err, rows, fields) {
    //       if (err) throw err
    //       res.render('vw-MySqlTableHub', {
    //         title: `<<${process.cwd()}/public/csv/${req.body['xlsPost']}.xlxs SAVED, and rainbowcat updated>>`
    //       })
    //     })
    // }

    // updateRbCat()
    // //^//Automatically add note to rainbowcat table that Retail Review has been generated//////////////////////////////////////
    // ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    res.render('vw-rbCatUpdtTrkr', {
      title: `<<${process.cwd()}/public/csv/${req.body['xlsPost']}.xlxs SAVED>>`
    });

  })
}