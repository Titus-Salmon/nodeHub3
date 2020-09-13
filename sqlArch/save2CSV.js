var express = require('express');
var router = express.Router();

const odbc = require('odbc')
const DSN = process.env.ODBC_CONN_STRING

const fs = require('fs')

const catapultResArrCache = require('../nodeCacheStuff/cache1')

module.exports = {
    save2CSV: router.post('/save2CSV', (req, res, next) => {

        catapultResArrCacheValue = catapultResArrCache.take('catapultResArrCache_key') // this also deletes the key

        // console.log(`req.body['save2CSVArrPost'][0]==>${req.body['save2CSVArrPost'][0]}`)


        //begin csv generator //////////////////////////////////////////////////////////////////////////
        const {
            Parser
        } = require('json2csv')

        const fields = [
            // "ri_t0d", "invPK", "invCPK", "invScanCode", "invName", "ordSupplierStockNumber", "invSize", "invReceiptAlias", "posTimeStamp", "invDateCreated",
            // "invEmpFkCreatedBy", "ordQuantityInOrderUnit", "oupName", "stoNumber", "stoName", "brdName", "dptName", "dptNumber", "sibIdealMargin", "venCompanyname",
            // "invLastreceived", "invLastsold", "invLastcost", "sibBasePrice", "invOnhand", "invOnorder", "invIntransit", "invMemo", "pi1Description",
            // "pi2Description", "pi3Description", "pi4Description", "invPowerField3", "invPowerField4"
            "ri_t0d", "invPK", "invCPK", "invScanCode", "invName", "ordSupplierStockNumber", "invSize", "invReceiptAlias", "posTimeStamp", "invDateCreated",
            "invEmpFkCreatedBy", "ordQuantityInOrderUnit", "oupName", "stoNumber", "brdName", "dptName", "dptNumber", "sibIdealMargin", "actualMargT0d",
            "venCompanyname", "invLastreceived", "invLastsold", "invLastcost", "sibBasePrice", "invOnhand", "invOnorder", "invIntransit", "invMemo",
            "pi1Description", "pi2Description", "pi3Description", "pi4Description", "invPowerField3", "invPowerField4"
        ]

        const opts = {
            fields
        }

        try {
            const parser = new Parser(opts);
            // console.log(`req.body['save2CSVArrPost'][0]==>${req.body['save2CSVArrPost'][0]}`)
            // const csv = parser.parse(JSON.parse(req.body['save2CSVArrPost']))
            const csv = parser.parse(catapultResArrCacheValue)
            // console.log(`JSON.stringify(req.body['save2CSVArrPost'][0])-->${JSON.stringify(req.body['save2CSVArrPost'][0])}`)
            console.log(`req.body['csvPost']-->${req.body['csvPost']}`)
            console.log('csv.length=====>>', csv.length);
            fs.writeFile(process.cwd() + '/public/csv-to-insert/' + req.body['csvPost'] + '.csv', csv, function (err) {
                if (err) throw err;
                console.log('~~~~~>>' + req.body['csvPost'] + 'saved<<~~~~~')
            })
        } catch (err) {
            console.error(err);
        }
        //end csv generator //////////////////////////////////////////////////////////////////////////

        res.render('vw-tsqlTableHub', { //render searchResults to vw-dbEditPassport page
            title: 'CSV Saved'
        })
    })
}