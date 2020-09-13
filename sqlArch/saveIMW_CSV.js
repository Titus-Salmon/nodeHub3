const express = require('express')
const router = express.Router()
const fs = require('fs')

const mysql = require('mysql')

const connection = mysql.createConnection({
  host: process.env.RB_HOST,
  user: process.env.RB_USER,
  password: process.env.RB_PW,
  database: process.env.RB_DB,
  multipleStatements: true //MUST HAVE to make more than 1 sql statement in a single query
})

module.exports = {

  saveIMW_CSV: router.post('/saveIMW_CSV', (req, res, next) => {

    console.log(`srcRsCSV_nonPag.length==> ${srcRsCSV_nonPag.length}`)
    console.log('srcRsCSV_nonPag[0][\'P_K\']', srcRsCSV_nonPag[0]['P_K'])
    console.log('Object.keys(srcRsCSV_nonPag[0])', Object.keys(srcRsCSV_nonPag[0]))

    //begin csv generator //////////////////////////////////////////////////////////////////////////
    const {
      Parser
    } = require('json2csv');

    const fields = [
      "upc", "deptID", "deptName", "rcptAlias", "brand", "itemName", "size", "sugstdRtl", "lastCost", "charm", "autoDiscount", "idealMarg", "wtPrfl", "tax1",
      "tax2", "tax3", "spclTndr1", "spclTndr2", "posPrmpt", "lctn", "altID", "altRcptAlias", "pkgQnt", "imwSKU", "splrID", "unit", "numPkgs", "pf1", "pf2", "pf3",
      "pf4", "pf5", "pf6", "pf7", "pf8", "onhndQnt", "rdrPnt", "mcl", "rdrQnt", "memo", "flrRsn", "dsd", "dscMltplr", "csPkgMltpl", "ovr"
    ];
    const opts = {
      fields,
      // excelStrings: true,
      // header: false
      quote: '', //whatever is inside the '' will be use as your quote character, so this removes all quotes from CSV
      // quote: '"'
    };

    try {
      console.log('srcRsCSV_nonPag from json2csv======>>', srcRsCSV_nonPag)
      const parser = new Parser(opts);
      const csv = parser.parse(srcRsCSV_nonPag);
      csvContainer.push(csv);
      console.log('csv_T0d=====>>', csv);
      fs.writeFile(process.cwd() + '/public/csv/' + req.body['csvPost'] + '.csv', csv, function (err) {
        if (err) throw err;
        console.log('~~~~~>>' + req.body['csvPost'] + 'saved<<~~~~~')
      })
    } catch (err) {
      console.error(err);
    }
    //end csv generator //////////////////////////////////////////////////////////////////////////

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //v//Automatically add note to rainbowcat table that Retail IMW has been generated//////////////////////////////////////
    let fileName = req.body['csvPost']

    // if (fileName.toLowerCase().includes('rtlimw')) {
    //   imwTypeColumn = 'rtlImw'
    //   vendorNameSplit3 = vendorNameSplit2.toLowerCase().split('rtlimw')
    // }
    // if (fileName.toLowerCase().includes('wsimw')) {
    //   imwTypeColumn = 'wsImw'
    //   vendorNameSplit3 = vendorNameSplit2.toLowerCase().split('wsImw')
    // }


    // console.log(`imwTypeColumn==> ${imwTypeColumn}`)
    // let vendorNameSplit3 = vendorNameSplit2.toLowerCase().split('rtlimw')


    var today = new Date()
    var todayIso = today.toISOString()

    function updateRbCat() {
      var imwTypeColumn

      //here we are doing some js magic to extract the "ediName" from the Rtl IMW name we're saving (nejTableNameRtlIMWYYYMMDD):
      let vendorNameSplit1 = fileName.split('nej')
      let vendorNameSplit2 = vendorNameSplit1[1]
      if (fileName.toLowerCase().includes('rtlimw')) {
        imwTypeColumn = 'rtlImw'
        itemsUpdtdTypeColumn = 'items_updtd_rtl'
        vendorNameSplit3 = vendorNameSplit2.toLowerCase().split('rtlimw')
        updateTypeTotal = 'tot_updtd_rtl'
        console.log(`imwTypeColumn==> ${imwTypeColumn}`)
      }
      if (fileName.toLowerCase().includes('wsimw')) {
        imwTypeColumn = 'wsImw'
        itemsUpdtdTypeColumn = 'items_updtd_ws'
        vendorNameSplit3 = vendorNameSplit2.toLowerCase().split('wsimw')
        updateTypeTotal = 'tot_updtd_ws'
        console.log(`imwTypeColumn==> ${imwTypeColumn}`)
      }
      let vendorName = vendorNameSplit3[0]
      let ediVendorName = `EDI-${vendorName.toUpperCase()}`
      console.log(`ediVendorName==> ${ediVendorName}`)

      connection.query(
        `UPDATE rainbowcat SET ${imwTypeColumn} = '${req.body['csvPost']}.csv (${srcRsCSV_nonPag.length} items)' WHERE ediName = '${ediVendorName}';

        INSERT INTO rainbowcat_update_tracker (date, edi_vendor_name, ${imwTypeColumn}, ${itemsUpdtdTypeColumn})
        VALUES('${todayIso}', 'EDI-${vendorName.toUpperCase()}', '${req.body['csvPost']}.csv', '${srcRsCSV_nonPag.length}')
        ON DUPLICATE KEY UPDATE ${imwTypeColumn} = ${imwTypeColumn};

        UPDATE rainbowcat rbc
        INNER JOIN (
          SELECT edi_vendor_name,
          SUM(${itemsUpdtdTypeColumn}) as total_updated
          FROM rainbowcat_update_tracker
          GROUP BY edi_vendor_name
        )
        rbcut ON rbc.ediName = rbcut.edi_vendor_name
        SET rbc.${updateTypeTotal} = rbcut.total_updated;`,

        function (err, rows, fields) {
          if (err) throw err
          res.render('vw-MySqlTableHub', {
            title: `<<${process.cwd()}/public/csv/${req.body['csvPost']}.csv SAVED, and rainbowcat updated>>`
          })
        })
    }

    updateRbCat()
    //v//Automatically add note to rainbowcat table that Retail IMW has been generated//////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // res.render('vw-MySqlTableHub', {
    //   title: `<<${process.cwd()}/public/csv/${req.body['csvPost']} SAVED>>`
    // });

  })
}