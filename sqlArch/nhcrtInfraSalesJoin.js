var express = require('express');
var router = express.Router();

const mysql = require('mysql');
const connection = mysql.createConnection({
  host: process.env.RB_HOST,
  user: process.env.RB_USER,
  password: process.env.RB_PW,
  database: process.env.RB_DB
})

module.exports = {
  nhcrtInfraSalesJoin: router.post('/nhcrtInfraSalesJoin', (req, res, next) => {
    const nhcrtInfraSalesJoinPostBody = req.body
    // console.log(`req.body==> ${req.body}`)
    let nhcrtInfraSalesJoin = nhcrtInfraSalesJoinPostBody['nhcrtInfraSalesJoinPost']
    console.log(`nhcrtInfraSalesJoin==> ${nhcrtInfraSalesJoin}`)

    let nhcrtInfraSalesJoinArr = []

    function displayNhcrtInfraSales(rows) {
      for (let i = 0; i < rows.length; i++) {
        let nhcrtInfraSalesJoinObj = {}
        nhcrtInfraSalesJoinObj['ri_t0d'] = i + 1
        nhcrtInfraSalesJoinObj['invPK'] = rows[i]['invPK']
        nhcrtInfraSalesJoinObj['invCPK'] = rows[i]['invCPK']
        nhcrtInfraSalesJoinObj['invScanCode'] = rows[i]['invScanCode']
        nhcrtInfraSalesJoinObj['ordSupplierStockNumber'] = rows[i]['ordSupplierStockNumber']

        // for (let j = 0; j < Object.keys(rows[i]).length; j++) {
        //     if (Object.keys(rows[i])[j].includes('_sku')) {
        //         nhcrtInfraSalesJoinObj['ediSKU'] = rows[i][`${Object.keys(rows[i])[j]}`]
        //     }
        // }

        nhcrtInfraSalesJoinObj['invName'] = rows[i]['invName']
        nhcrtInfraSalesJoinObj['invSize'] = rows[i]['invSize']
        nhcrtInfraSalesJoinObj['invReceiptAlias'] = rows[i]['invReceiptAlias']
        nhcrtInfraSalesJoinObj['posTimeStamp'] = rows[i]['posTimeStamp']
        nhcrtInfraSalesJoinObj['invDateCreated'] = rows[i]['invDateCreated']
        nhcrtInfraSalesJoinObj['invEmpFkCreatedBy'] = rows[i]['invEmpFkCreatedBy']
        nhcrtInfraSalesJoinObj['ordQuantityInOrderUnit'] = rows[i]['ordQuantityInOrderUnit']
        nhcrtInfraSalesJoinObj['oupName'] = rows[i]['oupName']
        nhcrtInfraSalesJoinObj['stoNumber'] = rows[i]['stoNumber']
        nhcrtInfraSalesJoinObj['stoName'] = rows[i]['stoName']
        nhcrtInfraSalesJoinObj['brdName'] = rows[i]['brdName']
        nhcrtInfraSalesJoinObj['dptName'] = rows[i]['dptName']
        nhcrtInfraSalesJoinObj['dptNumber'] = rows[i]['dptNumber']
        nhcrtInfraSalesJoinObj['sibIdealMargin'] = rows[i]['sibIdealMargin']
        nhcrtInfraSalesJoinObj['venCompanyname'] = rows[i]['venCompanyname']
        nhcrtInfraSalesJoinObj['invLastreceived'] = rows[i]['invLastreceived']
        nhcrtInfraSalesJoinObj['invLastsold'] = rows[i]['invLastsold']
        nhcrtInfraSalesJoinObj['invLastcost'] = rows[i]['invLastcost']

        // for (let j = 0; j < Object.keys(rows[i]).length; j++) {
        //     //extract cost from EDI catalog (all catalogs have some '_cost' column, except kehe, which has '_tier3')
        //     //!Object.keys(rows[i])[j].includes('_case_cost') will EXCLUDE '_case_cost' columns (such as cw_case_cost for Charlotte's Web)
        //     if (Object.keys(rows[i])[j].includes('_cost') && !Object.keys(rows[i])[j].includes('_case_cost') &&
        //         !Object.keys(rows[i])[j].includes('_display_cost') || Object.keys(rows[i])[j].includes('_tier3')) { //exclude _display_cost columns
        //         //from Jack N Jill
        //         nhcrtInfraSalesJoinObj['ediCost'] = rows[i][`${Object.keys(rows[i])[j]}`]
        //         // console.log(`nhcrtInfraSalesJoinObj['ediCost']==>${nhcrtInfraSalesJoinObj['ediCost']}`)
        //     }
        // }

        nhcrtInfraSalesJoinObj['sibBasePrice'] = rows[i]['sibBasePrice']

        // for (let j = 0; j < Object.keys(rows[i]).length; j++) {
        //     //extract msrp from EDI catalog (all catalogs have some '_msrp' column)
        //     if (Object.keys(rows[i])[j].includes('_msrp')) {
        //         nhcrtInfraSalesJoinObj['ediPrice'] = rows[i][`${Object.keys(rows[i])[j]}`]
        //         // console.log(`nhcrtInfraSalesJoinObj['ediPrice']==>${nhcrtInfraSalesJoinObj['ediPrice']}`)
        //     }
        // }

        nhcrtInfraSalesJoinObj['invOnhand'] = rows[i]['invOnhand']
        nhcrtInfraSalesJoinObj['invOnorder'] = rows[i]['invOnorder']
        nhcrtInfraSalesJoinObj['invIntransit'] = rows[i]['invIntransit']
        nhcrtInfraSalesJoinObj['pi1Description'] = rows[i]['pi1Description']
        nhcrtInfraSalesJoinObj['pi2Description'] = rows[i]['pi2Description']
        nhcrtInfraSalesJoinObj['pi3Description'] = rows[i]['pi3Description']
        nhcrtInfraSalesJoinObj['invPowerField3'] = rows[i]['invPowerField3']
        nhcrtInfraSalesJoinObj['invPowerField4'] = rows[i]['invPowerField4']

        nhcrtInfraSalesJoinObj['infra_sale'] = rows[i]['infra_sale']

        nhcrtInfraSalesJoinArr.push(nhcrtInfraSalesJoinObj)
      }
      console.log('rows.length~~~>', rows.length)
      // console.log(`Object.keys(rows)==>${Object.keys(rows)}`)
      console.log(`Object.keys(rows[0])==>${Object.keys(rows[0])}`)
      // console.log(`Object.keys(rows[0]).length==>${Object.keys(rows[0]).length}`)
      // console.log(`typeof Object.keys(rows[0])==>${typeof Object.keys(rows[0])}`)
      // console.log(`Object.keys(rows[0]['invScanCode'])==>${Object.keys(rows[0]['invScanCode'])}`)
      // // console.log('rows~~~>', rows)
      // console.log(`rows[0]['RowDataPacket']~~~>${rows[0]['RowDataPacket']}`)
      // // console.log('rows~~~>', rows)
      // console.log('rows[0]~~~>', rows[0])


      // for (let j=0; j<Object.keys(rows[0]).length; j++) {
      //     console.log(`Object.keys(rows[0])[j]==>${Object.keys(rows[0])[j]}`)
      // }


    }


    let mySqlQuery = `${nhcrtInfraSalesJoin}`

    connection.query(mySqlQuery, function (err, rows, fields) {
      if (err) throw err
      console.log(`rows.length==>${rows.length}`)
      console.log('rows[0]==>', rows[0])
      // console.log(`rows[0]['invScanCode']==>${rows[0]['invScanCode']}`)
      // console.log(`rows[0]['invName']==>${rows[0]['invName']}`)
      // console.log('rows==>', rows)
      // res.send(rows)
      displayNhcrtInfraSales(rows)

      res.render('vw-nhcrtInfraSalesJoin', {
        title: 'NodeHub CRT Joined on infraSales Table Query Results',
        nhcrtInfraSalesJoin: nhcrtInfraSalesJoinArr
      })
    })

  })
}