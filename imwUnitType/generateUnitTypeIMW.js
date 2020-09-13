const express = require('express')
const router = express.Router()

const mysql = require('mysql')

const connection = mysql.createConnection({ //for work use in RB DB
  host: process.env.RB_HOST,
  user: process.env.RB_USER,
  password: process.env.RB_PW,
  database: process.env.RB_DB,
  multipleStatements: true //MUST HAVE to make more than 1 sql statement in a single query
})

module.exports = {

  generateUnitTypeIMW: router.post(`/generateUnitTypeIMW`, (req, res, next) => {

    const postBody = req.body

    let nhcrtTableName = postBody['nhcrtTablePost']
    console.log(`nhcrtTableName==> ${nhcrtTableName}`)
    let ediTableName = postBody['ediTablePost']
    console.log(`ediTableName==> ${ediTableName}`)
    let ediPrefix = postBody['ediPrefixPost']
    console.log(`ediPrefix==> ${ediPrefix}`)
    let bulkTypeOverride = postBody['bulkTypeOverridePost']

    let srsObjArr = []

    // let queryArray = []
    var chosenQuery

    let query1 = `
    SELECT DISTINCT nhcrt.invPK AS nhcrtInvPK, nhcrt.invCPK AS nhcrtInvCPK, nhcrt.invScanCode AS nhcrtInvScanCode,
    nhcrt.ordSupplierStockNumber AS nhcrtOrdSupplierStockNumber, nhcrt.invName AS nhcrtInvName,
    REPLACE (nhcrt.invReceiptAlias, ',', '') AS nhcrtInvReceiptAlias,
    nhcrt.venCompanyname AS nhcrtVenCompanyName, nhcrt.pi1Description AS nhcrtPi1Description, nhcrt.pi2Description AS nhcrtPi2Description,
    edi_table.${ediPrefix}_upc AS edi_tableEDIprefixUPC, edi_table.${ediPrefix}_unit_type AS edi_tableEDIprefixUnitType FROM ${nhcrtTableName}
    nhcrt JOIN ${ediTableName} edi_table ON nhcrt.invScanCode
    WHERE nhcrt.invScanCode = edi_table.${ediPrefix}_upc
    ORDER BY nhcrt.pi1Description, nhcrt.pi2Description;`

    let query2 = `
    SELECT DISTINCT nhcrt.invPK AS nhcrtInvPK, nhcrt.invCPK AS nhcrtInvCPK, nhcrt.invScanCode AS nhcrtInvScanCode,
    nhcrt.ordSupplierStockNumber AS nhcrtOrdSupplierStockNumber, nhcrt.invName AS nhcrtInvName,
    REPLACE (nhcrt.invReceiptAlias, ',', '') AS nhcrtInvReceiptAlias,
    nhcrt.venCompanyname AS nhcrtVenCompanyName, nhcrt.pi1Description AS nhcrtPi1Description, nhcrt.pi2Description AS nhcrtPi2Description,
    edi_table.${ediPrefix}_upc AS edi_tableEDIprefixUPC, edi_table.${ediPrefix}_bulk_type AS edi_tableEDIprefixBulkType, 
    edi_table.${ediPrefix}_unit_type AS edi_tableEDIprefixUnitType FROM ${nhcrtTableName}
    nhcrt JOIN ${ediTableName} edi_table ON nhcrt.invScanCode
    WHERE nhcrt.invScanCode = edi_table.${ediPrefix}_upc
    ORDER BY nhcrt.pi1Description, nhcrt.pi2Description;`

    function checkForBulkTypeColumn() {
      connection.query(`
      SELECT * FROM ${ediTableName};`,
        function (err, rows, fields) {
          if (err) throw err
          console.log(`Object.keys(rows[0])==> ${Object.keys(rows[0])}`)
          let ediColNames = Object.keys(rows[0])
          console.log(`typeof ediColNames==> ${typeof ediColNames}`)
          console.log(`ediColNames.length==> ${ediColNames.length}`)
          let ediColNamesToString = ediColNames.toString()
          if (ediColNamesToString.includes('_bulk_type')) {
            // queryArray.push(query2
            chosenQuery = query2
          } else {
            // queryArray.push(query1)
            chosenQuery = query1
          }
          console.log(`chosenQuery==> ${chosenQuery}`)
        }).on('end', () => {
        queryNejUnitType_Table()
      })
    }

    checkForBulkTypeColumn()

    function showSearchRes(rows) {

      let displayRows = rows
      console.log(`displayRows[0]==> ${displayRows[0]}`)
      console.log(`Object.keys(displayRows[0])==> ${Object.keys(displayRows[0])}`)

      for (let i = 0; i < displayRows.length; i++) {

        let srsObj = {}

        let oupNameVar = displayRows[i]['edi_tableEDIprefixUnitType'] //define variable for oupName
        oupNameSplit = oupNameVar.split(/([0-9]+)/) //should split oupName into array with the digit as the 2nd array element

        if (displayRows[i]['edi_tableEDIprefixBulkType']) {
          let bulkTypeVar = displayRows[i]['edi_tableEDIprefixBulkType']
          bulkTypeSplit = bulkTypeVar.split(/([0-9]+)/)
        }

        srsObj['ri_t0d'] = i + 1
        srsObj['item_id'] = displayRows[i]['nhcrtInvScanCode']
        srsObj['dept_id'] = ''
        srsObj['dept_name'] = ''
        // //v//replace any commas in receipt alias, so columns in IMW don't get shifted
        // let nhcrtInvReceiptAlias = displayRows[i]['nhcrtInvReceiptAlias']
        // let saniReceiptAlias = nhcrtInvReceiptAlias.replace(",", "")
        // srsObj['recpt_alias'] = saniReceiptAlias
        // //^//replace any commas in receipt alias, so columns in IMW don't get shifted
        srsObj['recpt_alias'] = displayRows[i]['nhcrtInvReceiptAlias'] // here we use the receipt alias from Catapult, NOT the item name from EDI catalog
        srsObj['brand'] = ''
        srsObj['item_name'] = ''
        srsObj['size'] = ''
        srsObj['sugg_retail'] = ''
        srsObj['last_cost'] = ''
        srsObj['base_price'] = ''
        srsObj['auto_discount'] = ''
        srsObj['ideal_margin'] = ''
        srsObj['weight_profile'] = ''
        srsObj['tax1'] = ''
        srsObj['tax2'] = ''
        srsObj['tax3'] = ''
        srsObj['spec_tndr1'] = ''
        srsObj['spec_tndr2'] = ''
        srsObj['pos_prompt'] = ''
        srsObj['location'] = ''
        srsObj['alternate_id'] = ''
        srsObj['alt_rcpt_alias'] = ''
        srsObj['pkg_qty'] = ''
        srsObj['supp_unit_id'] = displayRows[i]['nhcrtOrdSupplierStockNumber'] //here we use SKU from Catapult (ordSupplierStockNumber), NOT from EDI table (ediSKU)
        srsObj['supplier_id'] = displayRows[i]['nhcrtVenCompanyName']
        srsObj['unit'] = displayRows[i]['edi_tableEDIprefixUnitType'] // here we use ${ediPrefix}_unit_type from EDI table, NOT from Catapult (nhcrt.oupName)

        if (bulkTypeOverride == 'yes') {
          if (displayRows[i]['edi_tableEDIprefixBulkType'] &&
            displayRows[i]['edi_tableEDIprefixBulkType'] !== null) {
            if (bulkTypeSplit[0].toLowerCase().includes('lb')) {
              srsObj['unit'] = displayRows[i]['edi_tableEDIprefixBulkType']
            }
          }
        }

        if (oupNameSplit[0].toLowerCase().includes('cs') || oupNameSplit[0].toLowerCase().includes('case')) {
          if (oupNameSplit[1]) {
            srsObj['num_pkgs'] = oupNameSplit[1]
          } else {
            srsObj['num_pkgs'] = 'badValCS'
          }
        } else {
          if (oupNameSplit[0].toLowerCase().includes('ea') ||
            oupNameSplit[0].toLowerCase().includes('each') ||
            oupNameSplit[0].toLowerCase().includes('lb')) {
            srsObj['num_pkgs'] = ''
          } else {
            srsObj['num_pkgs'] = 'badVal'
          }
        }

        if (bulkTypeOverride == 'yes') {
          if (displayRows[i]['edi_tableEDIprefixBulkType'] &&
            displayRows[i]['edi_tableEDIprefixBulkType'] !== null) {
            console.log(`bulkTypeSplit==> ${bulkTypeSplit}`)
            if (bulkTypeSplit[0].toLowerCase().includes('lb')) {
              srsObj['num_pkgs'] = bulkTypeSplit[1]
              console.log(`displayRows[i]['edi_tableEDIprefixBulkType']==> ${displayRows[i]['edi_tableEDIprefixBulkType']}`)
            }
          }
        }

        // srsObj['num_pkgs'] = displayRows[i]['num_pkgs'] //NEED LOGIC FOR THIS; this should be whatever the ## is for CS-##, otherwise, just ''
        srsObj['category'] = ''
        srsObj['sub_category'] = ''
        srsObj['product_group'] = ''
        srsObj['product_flag'] = ''
        srsObj['rb_note'] = ''
        srsObj['edi_default'] = ''
        srsObj['powerfield_7'] = ''
        srsObj['temp_group'] = ''
        srsObj['onhand_qty'] = ''
        srsObj['reorder_point'] = ''
        srsObj['mcl'] = ''
        srsObj['reorder_qty'] = ''
        srsObj['memo'] = ''
        srsObj['flrRsn'] = ''
        srsObj['dsd'] = ''
        srsObj['disc_mult'] = ''
        // srsObj['case_pk_mult'] = ''
        if (oupNameSplit[0].toLowerCase().includes('cs') || oupNameSplit[0].toLowerCase().includes('case')) {
          if (oupNameSplit[1]) {
            srsObj['case_pk_mult'] = ''
          } else {
            srsObj['case_pk_mult'] = 'badValCS'
          }
        } else {
          if (oupNameSplit[0].toLowerCase().includes('ea') || oupNameSplit[0].toLowerCase().includes('each')) {
            if (oupNameSplit[1]) {
              srsObj['case_pk_mult'] = oupNameSplit[1]
            } else {
              srsObj['case_pk_mult'] = 'badValEA'
            }
          } else {
            if (oupNameSplit[0].toLowerCase().includes('cs') ||
              oupNameSplit[0].toLowerCase().includes('case') ||
              oupNameSplit[0].toLowerCase().includes('lb')) {
              srsObj['case_pk_mult'] = ''
            } else {
              srsObj['case_pk_mult'] = 'badVal'
            }
          }
        }

        if (bulkTypeOverride == 'yes') {
          if (displayRows[i]['edi_tableEDIprefixBulkType'] &&
            displayRows[i]['edi_tableEDIprefixBulkType'] !== null) {
            if (bulkTypeSplit[0].toLowerCase().includes('lb')) {
              srsObj['case_pk_mult'] = ''
            }
          }
        }

        srsObj['ovr'] = '1'

        if (displayRows[i]['nhcrtOrdSupplierStockNumber'] !== '') {
          srsObjArr.push(srsObj)
        }
      }
    }

    function queryNejUnitType_Table() {
      console.log(`chosenQuery from within queryNejUnitType_Table()==> ${chosenQuery}`)
      connection.query(chosenQuery,
        function (err, rows, fields) {
          if (err) throw err
          showSearchRes(rows)

          res.render('vw-imwUnitType', {
            title: `vw-imwUnitType`,
            srsObjArr: srsObjArr,
          })
        })
    }
  })
}