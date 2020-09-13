var express = require('express');
var router = express.Router();

const odbc = require('odbc')
const DSN = process.env.ODBC_CONN_STRING

const fs = require('fs')

module.exports = {
  rbInvUpdaterTsql: router.post('/rbInvUpdaterTsql', (req, res, next) => {
    const queryCatapultDBPostBody = req.body
    // let catapultDbQuery = queryCatapultDBPostBody['rbInvUpdtrPost']

    // console.log(`queryCatapultDBPostBody['rbInvUpdtrPost']==> ${queryCatapultDBPostBody['rbInvUpdtrPost']}`)
    console.log(`typeof queryCatapultDBPostBody['rbInvUpdtrPost']==> ${typeof queryCatapultDBPostBody['rbInvUpdtrPost']}`)

    let saniRegex1 = /(\[)|(\])/g
    let saniRegex2 = /\"/g
    rb_inv_UPCsani = queryCatapultDBPostBody['rbInvUpdtrPost'].replace(saniRegex1, "").replace(saniRegex2, "'")
    // console.log(`rb_inv_UPCsani==> ${rb_inv_UPCsani} <==rb_inv_UPCsani`)
    console.log(`typeof rb_inv_UPCsani==> ${typeof rb_inv_UPCsani}`)

    let catapultDbQuery = `SELECT INV_PK, INV_CPK, INV_ScanCode, ORD_SupplierStockNumber, INV_Name, INV_Size, INV_ReceiptAlias, inv_default,
    convert(varchar(10), POS_TimeStamp, 120), INV_DateCreated, INV_EMP_FK_CreatedBy, ord_quantityinorderunit, oup_name, sto_number, sto_name, brd_name,
    dpt_name, dpt_number, SIB_IdealMargin, ven_companyname, convert(varchar(10), inv_lastreceived, 120), convert(varchar(10), inv_lastsold, 120),
    inv_lastcost, SIB_BasePrice, inv_onhand, inv_onorder, inv_intransit, PI1_Description, PI2_Description, PI3_Description, PI4_Description,
    INV_PowerField1, INV_PowerField2, INV_PowerField3, INV_PowerField4 FROM catapult.ecrs.v_InventoryMaster WHERE trim(INV_ScanCode)
    IN (${rb_inv_UPCsani}) AND trim(dpt_number) != '999999' ORDER BY PI1_Description, PI2_Description`

    // console.log(`catapultDbQuery==> ${catapultDbQuery}`)

    let catapultResArr = []

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
        if (typeof result[i]['ORD_SupplierStockNumber'] == 'string') {
          catapultResObj['ordSupplierStockNumber'] = result[i]['ORD_SupplierStockNumber'].trim()
        } else {
          catapultResObj['invScanCode'] = result[i]['INV_ScanCode']
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
        if (typeof result[i]['sto_name'] == 'string') {
          catapultResObj['stoName'] = result[i]['sto_name'].trim()
        } else {
          catapultResObj['stoName'] = result[i]['sto_name']
        }
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
      }
    }

    odbc.connect(DSN, (error, connection) => {
      connection.query(`${catapultDbQuery}`, (error, result) => {
        if (error) {
          console.error(error)
        }
        console.log(`result.length~~~> ${result.length}`)
        showcatapultResults(result)

        //begin csv generator //////////////////////////////////////////////////////////////////////////
        const {
          Parser
        } = require('json2csv')

        const fields = [
          "ri_t0d", "invPK", "invCPK", "invScanCode", "invName", "ordSupplierStockNumber", "invSize", "invReceiptAlias", "posTimeStamp", "invDateCreated",
          "invEmpFkCreatedBy", "ordQuantityInOrderUnit", "oupName", "stoNumber", "stoName", "brdName", "dptName", "dptNumber", "sibIdealMargin", "venCompanyname",
          "invLastreceived", "invLastsold", "invLastcost", "sibBasePrice", "invOnhand", "invOnorder", "invIntransit", "pi1Description",
          "pi2Description", "pi3Description", "invPowerField3", "invPowerField4"
        ]

        const opts = {
          fields
        }

        try {
          console.log('catapultResArr[0] from json2csv======>>', catapultResArr[0])
          const parser = new Parser(opts);
          const csv = parser.parse(catapultResArr);
          // console.log(`JSON.stringify(req.body)-->${JSON.stringify(req.body)}`)
          // console.log(`req.body['csvPost']-->${req.body['csvPost']}`)
          console.log('csv.length=====>>', csv.length);
          fs.writeFile(process.cwd() + '/public/csv-to-insert/' + 'rb_inv_nhcrt.csv', csv, function (err) {
            if (err) throw err;
            console.log('~~~~~>>rb_inv_nhcrt.csvsaved<<~~~~~')
          })
        } catch (err) {
          console.error(err);
        }
        //end csv generator //////////////////////////////////////////////////////////////////////////

        res.render('vw-rbInvUpdater', { //render searchResults to vw-dbEditPassport page
          title: 'vw-rbInvUpdater ==>CSV Saved'
        })

      })




    })
  })
}