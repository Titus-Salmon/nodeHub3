var express = require('express');
var router = express.Router();

const mysql = require('mysql');
const connection = mysql.createConnection({
    host: process.env.RB_HOST,
    user: process.env.RB_USER,
    password: process.env.RB_PW,
    database: process.env.RB_DB,
    multipleStatements: true
})

const nhcrtDisplayArrCache = require('../nodeCacheStuff/cache1')

module.exports = {
    nhcrtDisplay: router.post('/nhcrtDisplay', (req, res, next) => {
        const nhcrtDisplayPostBody = req.body
        // console.log(`req.body==> ${req.body}`)
        let nhcrtQuery = nhcrtDisplayPostBody['nhcrtDisplayPost']
        console.log(`nhcrtQuery==> ${nhcrtQuery}`)

        let nhcrtDisplayArr = []

        // catapultResArrCacheValue = catapultResArrCache.take('catapultResArrCache_key') // this also deletes the key
        // console.log(`JSON.stringify(catapultResArrCacheValue[0])==> ${JSON.stringify(catapultResArrCacheValue[0])}`)

        function displayNhcrt(rows) {
            for (let a = 0; a < rows.length; a++) {
                let nhcrtObj = {}
                nhcrtObj['ri_t0d'] = a + 1
                nhcrtObj['invPK'] = rows[a]['invPK']
                nhcrtObj['invCPK'] = rows[a]['invCPK']
                nhcrtObj['invScanCode'] = rows[a]['invScanCode']
                nhcrtObj['ordSupplierStockNumber'] = rows[a]['ordSupplierStockNumber']
                nhcrtObj['invName'] = rows[a]['invName']
                nhcrtObj['invSize'] = rows[a]['invSize']
                nhcrtObj['invReceiptAlias'] = rows[a]['invReceiptAlias']
                nhcrtObj['invDefault'] = rows[a]['invDefault']
                nhcrtObj['posTimeStamp'] = rows[a]['posTimeStamp']
                nhcrtObj['invDateCreated'] = rows[a]['invDateCreated']
                nhcrtObj['invEmpFkCreatedBy'] = rows[a]['invEmpFkCreatedBy']
                nhcrtObj['oupName'] = rows[a]['oupName']
                nhcrtObj['stoNumber'] = rows[a]['stoNumber']
                nhcrtObj['stoName'] = rows[a]['stoName']
                nhcrtObj['brdName'] = rows[a]['brdName']
                nhcrtObj['dptName'] = rows[a]['dptName']
                nhcrtObj['dptNumber'] = rows[a]['dptNumber']
                nhcrtObj['sibIdealMargin'] = rows[a]['sibIdealMargin']
                nhcrtObj['actualMargT0d'] = rows[a]['actualMargT0d']
                nhcrtObj['venCompanyname'] = rows[a]['venCompanyname']
                nhcrtObj['invLastreceived'] = rows[a]['invLastreceived']
                nhcrtObj['invLastsold'] = rows[a]['invLastsold']
                nhcrtObj['invLastcost'] = rows[a]['invLastcost']
                nhcrtObj['sibBasePrice'] = rows[a]['sibBasePrice']
                nhcrtObj['invOnhand'] = rows[a]['invOnhand']
                nhcrtObj['invOnorder'] = rows[a]['invOnorder']
                nhcrtObj['invIntransit'] = rows[a]['invIntransit']
                nhcrtObj['invMemo'] = rows[a]['invMemo']
                nhcrtObj['pi1Description'] = rows[a]['pi1Description']
                nhcrtObj['pi2Description'] = rows[a]['pi2Description']
                nhcrtObj['pi3Description'] = rows[a]['pi3Description']
                nhcrtObj['pi4Description'] = rows[a]['pi4Description']
                nhcrtObj['invPowerField1'] = rows[a]['invPowerField1']
                nhcrtObj['invPowerField2'] = rows[a]['invPowerField2']
                nhcrtObj['invPowerField3'] = rows[a]['invPowerField3']
                nhcrtObj['invPowerField4'] = rows[a]['invPowerField4']

                nhcrtDisplayArr.push(nhcrtObj)
            }
            console.log('rows.length~~~>', rows.length)

            //V// CACHE NHCRT QUERY RESULTS IN BACKEND //////////////////////////////////////////////////////////////////////////////
            nhcrtDisplayArrCache.set('nhcrtDisplayArrCache_key', nhcrtDisplayArr)
            console.log(`nhcrtDisplayArrCache['data']['nhcrtDisplayArrCache_key']['v'].length==> ${nhcrtDisplayArrCache['data']['nhcrtDisplayArrCache_key']['v'].length}`)
            console.log(`nhcrtDisplayArrCache['data']['nhcrtDisplayArrCache_key']['v'][0]==> ${nhcrtDisplayArrCache['data']['nhcrtDisplayArrCache_key']['v'][0]}`)
            console.log(`JSON.stringify(nhcrtDisplayArrCache['data']['nhcrtDisplayArrCache_key']['v'][0])==> ${JSON.stringify(nhcrtDisplayArrCache['data']['nhcrtDisplayArrCache_key']['v'][0])}`)
            //^// CACHE NHCRT QUERY RESULTS IN BACKEND //////////////////////////////////////////////////////////////////////////////
        }


        let mySqlQuery = `${nhcrtQuery}`

        connection.query(mySqlQuery, function (err, rows, fields) {
            if (err) throw err
            displayNhcrt(rows)

            res.render('vw-nhcrtQuery', {
                title: 'NodeHub Catapult Results Table Query Results',
                nhcrtDisplay: nhcrtDisplayArr
            })
        })

    })
}