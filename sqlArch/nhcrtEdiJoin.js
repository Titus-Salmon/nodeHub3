var express = require('express');
var router = express.Router();

const mysql = require('mysql');
const connection = mysql.createConnection({
    host: process.env.RB_HOST,
    user: process.env.RB_USER,
    password: process.env.RB_PW,
    database: process.env.RB_DB
})

const nhcrtEdiJoinArrCache = require('../nodeCacheStuff/cache1')

module.exports = {
    nhcrtEdiJoin: router.post('/nhcrtEdiJoin', (req, res, next) => {
        const nhcrtEdiJoinPostBody = req.body
        // console.log(`req.body==> ${req.body}`)
        let nhcrtEdiJoin = nhcrtEdiJoinPostBody['nhcrtEdiJoinPost']
        console.log(`nhcrtEdiJoin==> ${nhcrtEdiJoin}`)

        let nhcrtEdiJoinArr = []

        function displayNhcrtEdi(rows) {
            for (let i = 0; i < rows.length; i++) {
                let nhcrtEdiJoinObj = {}
                nhcrtEdiJoinObj['ri_t0d'] = i + 1
                nhcrtEdiJoinObj['invPK'] = rows[i]['invPK']
                nhcrtEdiJoinObj['invCPK'] = rows[i]['invCPK']
                nhcrtEdiJoinObj['invScanCode'] = rows[i]['invScanCode']
                nhcrtEdiJoinObj['ordSupplierStockNumber'] = rows[i]['ordSupplierStockNumber']

                for (let j = 0; j < Object.keys(rows[i]).length; j++) {
                    if (Object.keys(rows[i])[j].includes('_sku')) {
                        nhcrtEdiJoinObj['ediSKU'] = rows[i][`${Object.keys(rows[i])[j]}`]
                    }
                }

                nhcrtEdiJoinObj['invName'] = rows[i]['invName']
                nhcrtEdiJoinObj['invSize'] = rows[i]['invSize']
                nhcrtEdiJoinObj['invReceiptAlias'] = rows[i]['invReceiptAlias']
                nhcrtEdiJoinObj['posTimeStamp'] = rows[i]['posTimeStamp']
                nhcrtEdiJoinObj['invDateCreated'] = rows[i]['invDateCreated']
                nhcrtEdiJoinObj['invEmpFkCreatedBy'] = rows[i]['invEmpFkCreatedBy']
                nhcrtEdiJoinObj['ordQuantityInOrderUnit'] = rows[i]['ordQuantityInOrderUnit']
                nhcrtEdiJoinObj['oupName'] = rows[i]['oupName']
                nhcrtEdiJoinObj['stoNumber'] = rows[i]['stoNumber']
                // nhcrtEdiJoinObj['stoName'] = rows[i]['stoName']
                nhcrtEdiJoinObj['brdName'] = rows[i]['brdName']
                nhcrtEdiJoinObj['dptName'] = rows[i]['dptName']
                nhcrtEdiJoinObj['dptNumber'] = rows[i]['dptNumber']
                nhcrtEdiJoinObj['sibIdealMargin'] = rows[i]['sibIdealMargin']
                nhcrtEdiJoinObj['actualMargT0d'] = rows[i]['actualMargT0d']
                nhcrtEdiJoinObj['venCompanyname'] = rows[i]['venCompanyname']
                nhcrtEdiJoinObj['invLastreceived'] = rows[i]['invLastreceived']
                nhcrtEdiJoinObj['invLastsold'] = rows[i]['invLastsold']
                nhcrtEdiJoinObj['invLastcost'] = rows[i]['invLastcost']

                for (let j = 0; j < Object.keys(rows[i]).length; j++) {
                    //extract cost from EDI catalog (all catalogs have some '_cost' column, except kehe, which has '_tier3')
                    //!Object.keys(rows[i])[j].includes('_case_cost') will EXCLUDE '_case_cost' columns (such as cw_case_cost for Charlotte's Web)
                    if (Object.keys(rows[i])[j].includes('_cost') && !Object.keys(rows[i])[j].includes('_case_cost') &&
                        !Object.keys(rows[i])[j].includes('_display_cost') || Object.keys(rows[i])[j].includes('_tier3')) { //exclude _display_cost columns
                        //from Jack N Jill
                        nhcrtEdiJoinObj['ediCost'] = rows[i][`${Object.keys(rows[i])[j]}`]
                        // console.log(`nhcrtEdiJoinObj['ediCost']==>${nhcrtEdiJoinObj['ediCost']}`)
                    }
                }

                nhcrtEdiJoinObj['sibBasePrice'] = rows[i]['sibBasePrice']

                for (let j = 0; j < Object.keys(rows[i]).length; j++) {
                    //extract msrp from EDI catalog (all catalogs have some '_msrp' column)
                    if (Object.keys(rows[i])[j].includes('_msrp') ||
                        Object.keys(rows[i])[j].includes('_srp')) { //catches infra_srp column for Kehe
                        nhcrtEdiJoinObj['ediPrice'] = rows[i][`${Object.keys(rows[i])[j]}`]
                        // console.log(`nhcrtEdiJoinObj['ediPrice']==>${nhcrtEdiJoinObj['ediPrice']}`)
                    }
                }

                nhcrtEdiJoinObj['invOnhand'] = rows[i]['invOnhand']
                nhcrtEdiJoinObj['invOnorder'] = rows[i]['invOnorder']
                nhcrtEdiJoinObj['invIntransit'] = rows[i]['invIntransit']
                nhcrtEdiJoinObj['pi1Description'] = rows[i]['pi1Description']
                nhcrtEdiJoinObj['pi2Description'] = rows[i]['pi2Description']
                nhcrtEdiJoinObj['pi3Description'] = rows[i]['pi3Description']
                nhcrtEdiJoinObj['invPowerField3'] = rows[i]['invPowerField3']
                nhcrtEdiJoinObj['invPowerField4'] = rows[i]['invPowerField4']

                nhcrtEdiJoinArr.push(nhcrtEdiJoinObj)
            }
            nhcrtEdiJoinArrCache.set('nhcrtEdiJoinArrCache_key', nhcrtEdiJoinArr)
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


        let mySqlQuery = `${nhcrtEdiJoin}`

        connection.query(mySqlQuery, function (err, rows, fields) {
            if (err) throw err
            console.log(`rows.length==>${rows.length}`)
            console.log('rows[0]==>', rows[0])
            // console.log(`rows[0]['invScanCode']==>${rows[0]['invScanCode']}`)
            // console.log(`rows[0]['invName']==>${rows[0]['invName']}`)
            // console.log('rows==>', rows)
            // res.send(rows)
            displayNhcrtEdi(rows)

            res.render('vw-nhcrtEdiJoin', {
                title: 'NodeHub CRT Joined on EDI Table Query Results',
                nhcrtEdiJoin: nhcrtEdiJoinArr
            })
        })

    })
}