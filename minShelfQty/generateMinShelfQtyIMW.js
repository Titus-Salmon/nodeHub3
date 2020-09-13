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

  generateMinShelfQtyIMW: router.post(`/generateMinShelfQtyIMW`, (req, res, next) => {

    const postBody = req.body

    let movementTableName = postBody['movementTablePost']
    console.log(`movementTableName==> ${movementTableName}`)

    let nhcrtTableName = postBody['nhcrtTablePost']
    console.log(`nhcrtTableName==> ${nhcrtTableName}`)

    let storeAbbrev = postBody['storeAbbrevPost']
    console.log(`storeAbbrev==> ${storeAbbrev}`)

    // let storeName = postBody['storeNamePost']
    // console.log(`storeName==> ${storeName}`)

    let storeNumber = postBody['storeNumberPost']
    console.log(`storeNumber==> ${storeNumber}`)

    let totalDays = postBody['totalDaysPost']
    console.log(`totalDays==> ${totalDays}`)

    let arFreq = postBody['arFreqPost']
    console.log(`arFreq==> ${arFreq}`)

    let srsObjArr = []

    function showSearchRes(rows) {

      // let movementTableRows = rows[0]
      // console.log(`movementTableRows[0]==> ${movementTableRows[0]}`)

      // let nhcrtTableRows = rows[1]
      // console.log(`nhcrtTableRows[0]==> ${nhcrtTableRows[0]}`)

      let tableJoinRows = rows
      console.log(`tableJoinRows[0]==> ${tableJoinRows[0]}`)

      for (let i = 0; i < tableJoinRows.length; i++) {

        let srsObj = {}

        let soldPerTimeframeRaw = tableJoinRows[i]['woMvTblQtySold'] * arFreq / totalDays
        let soldPerTimeframe = Math.round(soldPerTimeframeRaw)
        console.log(`${tableJoinRows[i]['nhcrtInvScanCode']} soldPerTimeFrame==> ${soldPerTimeframe}`)

        srsObj['ri_t0d'] = i + 1
        srsObj['item_id'] = tableJoinRows[i]['nhcrtInvScanCode']
        srsObj['dept_id'] = ''
        srsObj['dept_name'] = ''
        srsObj['recpt_alias'] = tableJoinRows[i]['nhcrtInvReceiptAlias']
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
        srsObj['supp_unit_id'] = tableJoinRows[i]['nhcrtOrdSupplierStockNumber']
        srsObj['supplier_id'] = tableJoinRows[i]['nhcrtVenCompanyName']
        srsObj['unit'] = ''
        srsObj['num_pkgs'] = ''
        srsObj['category'] = ''
        srsObj['sub_category'] = ''
        srsObj['product_group'] = ''
        srsObj['product_flag'] = ''
        srsObj['rb_note'] = ''
        srsObj['edi_default'] = ''
        srsObj['powerfield_7'] = ''

        console.log(`${tableJoinRows[i]['nhcrtInvScanCode']} soldPerTimeframe==> ${soldPerTimeframe}`)
        // console.log(`${tableJoinRows[i]['nhcrtInvScanCode']} soldPerTimeframe+6==> ${soldPerTimeframe+6}`)
        console.log(`${tableJoinRows[i]['nhcrtInvScanCode']} soldPerTimeframe+3==> ${soldPerTimeframe+3}`)

        // srsObj['temp_group'] = `${storeAbbrev}_${soldPerTimeframe+6}`
        srsObj['temp_group'] = `${storeAbbrev}_${soldPerTimeframe+3}`

        // if (soldPerTimeframe > 0 && soldPerTimeframe < 5.9) {
        //   srsObj['temp_group'] = `${storeAbbrev}_${soldPerTimeframe}`
        // }
        // if (soldPerTimeframe > 5.9 && soldPerTimeframe < 10.9) {
        //   srsObj['temp_group'] = `${storeAbbrev}_5`
        // }
        // if (soldPerTimeframe > 10.9 && soldPerTimeframe < 15.9) {
        //   srsObj['temp_group'] = `${storeAbbrev}_5`
        // }
        // if (soldPerTimeframe > 15.9 && soldPerTimeframe < 20.9) {
        //   srsObj['temp_group'] = `${storeAbbrev}_10`
        // }
        // if (soldPerTimeframe > 20.9 && soldPerTimeframe < 25.9) {
        //   srsObj['temp_group'] = `${storeAbbrev}_10`
        // }
        // if (soldPerTimeframe > 25.9 && soldPerTimeframe < 30.9) {
        //   srsObj['temp_group'] = `${storeAbbrev}_10`
        // }
        // if (soldPerTimeframe > 30.9 && soldPerTimeframe < 35.9) {
        //   srsObj['temp_group'] = `${storeAbbrev}_15`
        // }
        // if (soldPerTimeframe > 35.9 && soldPerTimeframe < 40.9) {
        //   srsObj['temp_group'] = `${storeAbbrev}_15`
        // }
        // if (soldPerTimeframe > 40.9 && soldPerTimeframe < 45.9) {
        //   srsObj['temp_group'] = `${storeAbbrev}_15`
        // }
        // if (soldPerTimeframe > 45.9 && soldPerTimeframe < 50.9) {
        //   srsObj['temp_group'] = `${storeAbbrev}_20`
        // }
        // if (soldPerTimeframe > 50.9) {
        //   srsObj['temp_group'] = `${storeAbbrev}_20`
        // }
        // srsObj['temp_group'] = ''
        srsObj['onhand_qty'] = ''
        srsObj['reorder_point'] = ''
        srsObj['mcl'] = ''
        srsObj['reorder_qty'] = ''
        srsObj['memo'] = ''
        srsObj['flrRsn'] = ''
        srsObj['dsd'] = ''
        srsObj['disc_mult'] = ''
        srsObj['case_pk_mult'] = ''
        srsObj['ovr'] = ''

        // if (soldPerTimeframe > 0) { //only push resukts where soldPerTimeFrame > 0; otherwise, don't include for auto-reorder
        srsObjArr.push(srsObj)
        //}
      }
    }

    function queryMovementTable() {
      connection.query(`
      SELECT DISTINCT nhcrt.invPK AS nhcrtInvPK, nhcrt.invCPK AS nhcrtInvCPK, nhcrt.invScanCode AS nhcrtInvScanCode,
      nhcrt.ordSupplierStockNumber AS nhcrtOrdSupplierStockNumber, nhcrt.invName AS nhcrtInvName,
      REPLACE (nhcrt.invReceiptAlias, ',', '') AS nhcrtInvReceiptAlias,
      nhcrt.stoNumber AS nhcrtstoNumber, nhcrt.venCompanyname AS nhcrtVenCompanyName, nhcrt.pi1Description AS nhcrtPi1Description,
      nhcrt.pi2Description AS nhcrtPi2Description,
      wo_mv_table.item_id AS woMvTblItemId, wo_mv_table.quantity_sold AS woMvTblQtySold
      FROM ${nhcrtTableName}
      nhcrt JOIN ${movementTableName} wo_mv_table ON nhcrt.invScanCode
      WHERE nhcrt.invScanCode = wo_mv_table.item_id
      AND nhcrt.stoNumber = '${storeNumber}'
      ORDER BY nhcrt.pi1Description, nhcrt.pi2Description;`,
        function (err, rows, fields) {
          if (err) throw err
          showSearchRes(rows)

          res.render('vw-imwUnitType', {
            title: `vw-imwUnitType`,
            srsObjArr: srsObjArr,
          })
        })
    }

    queryMovementTable()
  })
}