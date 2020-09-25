var express = require('express');
var router = express.Router();

const odbc = require('odbc')
const DSN = process.env.ODBC_CONN_STRING

const fs = require('fs')

const catapultResArrCache = require('../nodeCacheStuff/cache1')

module.exports = {
    v_InventoryMasterQuery: router.post('/queryInvMasterTable', (req, res, next) => {
        const queryCatapultDBPostBody = req.body
        // console.log(`queryCatapultDBPostBody==> ${queryCatapultDBPostBody}`)
        // console.log(`JSON.stringify(queryCatapultDBPostBody)==> ${JSON.stringify(queryCatapultDBPostBody)}`)
        let catapultDbQuery = queryCatapultDBPostBody['tblQryPost']

        console.log(`catapultDbQuery==> ${catapultDbQuery}`)

        let catapultResArr = []
        srcRsXLS_tsql = []

        function showcatapultResults(result) {
            for (let i = 0; i < result.length; i++) {
                let catapultResObj = {}
                catapultResObj['ri_t0d'] = i + 1 //create sequential record id (ri_t0d) column for saving as csv; you will NOT
                //want to include INV_PK or INV_CPK in your save-to-csv results - ONLY ri_t0d... adding 1 to 'i', so we don't
                //start our ri_t0d with 0, as that seems to confuse MySQL...
                catapultResObj['invPK'] = result[i]['INV_PK']
                catapultResObj['invCPK'] = result[i]['INV_CPK']
                if (typeof result[i]['INV_ScanCode'] == 'string') {
                    catapultResObj['invScanCode'] = result[i]['INV_ScanCode'].trim()
                } else {
                    catapultResObj['invScanCode'] = result[i]['INV_ScanCode']
                }
                // if (typeof result[i]['asc_scancode'] == 'string') {
                //     catapultResObj['ascScancode'] = result[i]['asc_scancode'].trim()
                // } else {
                //     catapultResObj['ascScancode'] = result[i]['asc_scancode']
                // }
                if (typeof result[i]['ORD_SupplierStockNumber'] == 'string') {
                    catapultResObj['ordSupplierStockNumber'] = result[i]['ORD_SupplierStockNumber'].trim()
                } else {
                    catapultResObj['ordSupplierStockNumber'] = result[i]['ORD_SupplierStockNumber']
                }
                if (typeof result[i]['INV_Name'] == 'string') {
                    catapultResObj['invName'] = result[i]['INV_Name'].trim()
                    // catapultResObj['invName'].replace(',', '') //remove any commas in name so csv doesn't get horked
                } else {
                    catapultResObj['invName'] = result[i]['INV_Name']
                }
                if (typeof result[i]['INV_Size'] == 'string') {
                    catapultResObj['invSize'] = result[i]['INV_Size'].trim()
                } else {
                    catapultResObj['invSize'] = result[i]['INV_Size']
                }
                if (typeof result[i]['INV_ReceiptAlias'] == 'string') {
                    catapultResObj['invReceiptAlias'] = result[i]['INV_ReceiptAlias'].trim()
                } else {
                    catapultResObj['invReceiptAlias'] = result[i]['INV_ReceiptAlias']
                }
                if (typeof result[i]['inv_default'] == 'string') {
                    catapultResObj['invDefault'] = result[i]['inv_default'].trim()
                } else {
                    catapultResObj['invDefault'] = result[i]['inv_default']
                }
                catapultResObj['posTimeStamp'] = unescape(result[i]['POS_TimeStamp'])
                catapultResObj['invDateCreated'] = result[i]['INV_DateCreated']
                catapultResObj['invEmpFkCreatedBy'] = result[i]['INV_EMP_FK_CreatedBy']
                catapultResObj['ordQuantityInOrderUnit'] = result[i]['ord_quantityinorderunit']
                if (typeof result[i]['oup_name'] == 'string') {
                    catapultResObj['oupName'] = result[i]['oup_name'].trim()
                } else {
                    catapultResObj['oupName'] = result[i]['oup_name']
                }
                if (typeof result[i]['sto_number'] == 'string') {
                    catapultResObj['stoNumber'] = result[i]['sto_number'].trim()
                } else {
                    catapultResObj['stoNumber'] = result[i]['sto_number']
                }
                // if (typeof result[i]['sto_name'] == 'string') {
                //     catapultResObj['stoName'] = result[i]['sto_name'].trim()
                // } else {
                //     catapultResObj['stoName'] = result[i]['sto_name']
                // }
                if (typeof result[i]['brd_name'] == 'string') {
                    catapultResObj['brdName'] = result[i]['brd_name'].trim()
                } else {
                    catapultResObj['brdName'] = result[i]['brd_name']
                }
                if (typeof result[i]['dpt_name'] == 'string') {
                    catapultResObj['dptName'] = result[i]['dpt_name'].trim()
                } else {
                    catapultResObj['dptName'] = result[i]['dpt_name']
                }
                catapultResObj['dptNumber'] = result[i]['dpt_number']
                catapultResObj['sibIdealMargin'] = result[i]['SIB_IdealMargin']
                //calc actual margin --t0d/////////////////////////////////////////////////////
                catapultResObj['actualMargT0d'] = Math.round(((result[i]['SIB_BasePrice'] - result[i]['inv_lastcost']) / (result[i]['SIB_BasePrice'])) * 100)
                //calc actual margin --t0d/////////////////////////////////////////////////////
                if (typeof result[i]['ven_companyname'] == 'string') {
                    catapultResObj['venCompanyname'] = result[i]['ven_companyname'].trim()
                } else {
                    catapultResObj['venCompanyname'] = result[i]['ven_companyname']
                }
                catapultResObj['invLastreceived'] = result[i]['inv_lastreceived']
                catapultResObj['invLastsold'] = result[i]['inv_lastsold']
                catapultResObj['invLastcost'] = result[i]['inv_lastcost']
                catapultResObj['sibBasePrice'] = result[i]['SIB_BasePrice']
                catapultResObj['invOnhand'] = result[i]['inv_onhand']
                catapultResObj['invOnorder'] = result[i]['inv_onorder']
                catapultResObj['invIntransit'] = result[i]['inv_intransit']
                if (typeof result[i]['inv_memo'] == 'string') {
                    catapultResObj['invMemo'] = result[i]['inv_memo'].trim()
                } else {
                    catapultResObj['invMemo'] = result[i]['inv_memo']
                }
                if (typeof result[i]['PI1_Description'] == 'string') {
                    catapultResObj['pi1Description'] = result[i]['PI1_Description'].trim()
                } else {
                    catapultResObj['pi1Description'] = result[i]['PI1_Description']
                }
                if (typeof result[i]['PI2_Description'] == 'string') {
                    catapultResObj['pi2Description'] = result[i]['PI2_Description'].trim()
                } else {
                    catapultResObj['pi2Description'] = result[i]['PI2_Description']
                }
                if (typeof result[i]['PI3_Description'] == 'string') {
                    catapultResObj['pi3Description'] = result[i]['PI3_Description'].trim()
                } else {
                    catapultResObj['pi3Description'] = result[i]['PI3_Description']
                }
                if (typeof result[i]['PI4_Description'] == 'string') {
                    catapultResObj['pi4Description'] = result[i]['PI4_Description'].trim()
                } else {
                    catapultResObj['pi4Description'] = result[i]['PI4_Description']
                }
                if (typeof result[i]['INV_PowerField1'] == 'string') {
                    catapultResObj['invPowerField1'] = result[i]['INV_PowerField1'].trim()
                } else {
                    catapultResObj['invPowerField1'] = result[i]['INV_PowerField1']
                }
                if (typeof result[i]['INV_PowerField2'] == 'string') {
                    catapultResObj['invPowerField2'] = result[i]['INV_PowerField2'].trim()
                } else {
                    catapultResObj['invPowerField2'] = result[i]['INV_PowerField2']
                }
                if (typeof result[i]['INV_PowerField3'] == 'string') {
                    catapultResObj['invPowerField3'] = result[i]['INV_PowerField3'].trim()
                } else {
                    catapultResObj['invPowerField3'] = result[i]['INV_PowerField3']
                }
                if (typeof result[i]['INV_PowerField4'] == 'string') {
                    catapultResObj['invPowerField4'] = result[i]['INV_PowerField4'].trim()
                } else {
                    catapultResObj['invPowerField4'] = result[i]['INV_PowerField4']
                }

                catapultResArr.push(catapultResObj)
                srcRsXLS_tsql.push(catapultResObj)
            }
            //V// CACHE V_INVENTORYMASTER QUERY RESULTS IN BACKEND //////////////////////////////////////////////////////////////////////////////
            catapultResArrCache.set('catapultResArrCache_key', catapultResArr)
            console.log(`catapultResArrCache['data']['catapultResArrCache_key']['v'].length==> ${catapultResArrCache['data']['catapultResArrCache_key']['v'].length}`)
            console.log(`catapultResArrCache['data']['catapultResArrCache_key']['v'][0]==> ${catapultResArrCache['data']['catapultResArrCache_key']['v'][0]}`)
            console.log(`JSON.stringify(catapultResArrCache['data']['catapultResArrCache_key']['v'][0])==> ${JSON.stringify(catapultResArrCache['data']['catapultResArrCache_key']['v'][0])}`)
            //^// CACHE V_INVENTORYMASTER QUERY RESULTS IN BACKEND //////////////////////////////////////////////////////////////////////////////
        }

        odbc.connect(DSN, (error, connection) => {
            connection.query(`${catapultDbQuery}`, (error, result) => {
                if (error) {
                    console.error(error)
                }
                console.log(`result.length~~~> ${result.length}`)
                let queriedColumns_0 = Object.keys(result[0])
                console.log(`typeof queriedColumns_0==> ${typeof queriedColumns_0}`)
                console.log(`JSON.stringify(result[0])==> ${JSON.stringify(result[0])}`)
                console.log(`JSON.stringify(result['columns'][2])==> ${JSON.stringify(result['columns'][2])}`)
                showcatapultResults(result)

                res.render('vw-v_InventoryMaster_query2', { //render searchResults to vw-retailCalcPassport page
                    title: 'vw-v_InventoryMaster_query2',
                    catapultResults: catapultResArr,
                })
            })
        })
    })
}