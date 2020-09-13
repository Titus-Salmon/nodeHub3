var express = require('express');
var router = express.Router();

const odbc = require('odbc')
const DSN = process.env.ODBC_CONN_STRING

const fs = require('fs')

module.exports = {
  OrderingInfoQuery: router.post('/queryOrderingInfoTable', (req, res, next) => {
    const queryCatapultDBPostBody = req.body
    // console.log(`queryCatapultDBPostBody==> ${queryCatapultDBPostBody}`)
    // console.log(`JSON.stringify(queryCatapultDBPostBody)==> ${JSON.stringify(queryCatapultDBPostBody)}`)
    let catapultDbQuery = queryCatapultDBPostBody['tblQryPost']

    console.log(`catapultDbQuery==> ${catapultDbQuery}`)

    let catapultResArr = []

    function showcatapultResults(result) {
      for (let i = 0; i < result.length; i++) {
        let catapultResObj = {}
        catapultResObj['ORD_VEN_FK'] = result[i]['ORD_VEN_FK']
        catapultResObj['ORD_PK'] = result[i]['ORD_PK']
        if (typeof result[i]['ORD_SupplierStockNumber'] == 'string') {
          catapultResObj['ORD_SupplierStockNumber'] = result[i]['ORD_SupplierStockNumber'].trim()
        } else {
          catapultResObj['ORD_SupplierStockNumber'] = result[i]['ORD_SupplierStockNumber']
        }
        if (typeof result[i]['ORD_INV_FK'] == 'string') {
          catapultResObj['ORD_INV_FK'] = result[i]['ORD_INV_FK'].trim()
        } else {
          catapultResObj['ORD_INV_FK'] = result[i]['ORD_INV_FK']
        }
        if (typeof result[i]['ORD_CPK'] == 'string') {
          catapultResObj['ORD_CPK'] = result[i]['ORD_CPK'].trim()
          // catapultResObj['invName'].replace(',', '') //remove any commas in name so csv doesn't get horked
        } else {
          catapultResObj['ORD_CPK'] = result[i]['ORD_CPK']
        }
        if (typeof result[i]['ORD_INV_CFK'] == 'string') {
          catapultResObj['ORD_INV_CFK'] = result[i]['ORD_INV_CFK'].trim()
        } else {
          catapultResObj['ORD_INV_CFK'] = result[i]['ORD_INV_CFK']
        }
        if (typeof result[i]['ORD_VEN_CFK'] == 'string') {
          catapultResObj['ORD_VEN_CFK'] = result[i]['ORD_VEN_CFK'].trim()
        } else {
          catapultResObj['ORD_VEN_CFK'] = result[i]['ORD_VEN_CFK']
        }
        if (typeof result[i]['ORD_Primary'] == 'string') {
          catapultResObj['ORD_Primary'] = result[i]['ORD_Primary'].trim()
        } else {
          catapultResObj['ORD_Primary'] = result[i]['ORD_Primary']
        }
        if (typeof result[i]['ORD_QuantityInOrderUnit'] == 'string') {
          catapultResObj['ORD_QuantityInOrderUnit'] = result[i]['ORD_QuantityInOrderUnit'].trim()
        } else {
          catapultResObj['ORD_QuantityInOrderUnit'] = result[i]['ORD_QuantityInOrderUnit']
        }
        if (typeof result[i]['ORD_ASC_FK'] == 'string') {
          catapultResObj['ORD_ASC_FK'] = result[i]['ORD_ASC_FK'].trim()
        } else {
          catapultResObj['ORD_ASC_FK'] = result[i]['ORD_ASC_FK']
        }
        if (typeof result[i]['ORD_ASC_CFK'] == 'string') {
          catapultResObj['ORD_ASC_CFK'] = result[i]['ORD_ASC_CFK'].trim()
        } else {
          catapultResObj['ORD_ASC_CFK'] = result[i]['ORD_ASC_CFK']
        }
        if (typeof result[i]['ORD_OUP_FK'] == 'string') {
          catapultResObj['ORD_OUP_FK'] = result[i]['ORD_OUP_FK'].trim()
        } else {
          catapultResObj['ORD_OUP_FK'] = result[i]['ORD_OUP_FK']
        }
        if (typeof result[i]['ORD_OUP_CFK'] == 'string') {
          catapultResObj['ORD_OUP_CFK'] = result[i]['ORD_OUP_CFK'].trim()
        } else {
          catapultResObj['ORD_OUP_CFK'] = result[i]['ORD_OUP_CFK']
        }

        catapultResObj['ORD_TimeStamp'] = unescape(result[i]['ORD_TimeStamp'])

        if (typeof result[i]['ORD_DSDItem'] == 'string') {
          catapultResObj['ORD_DSDItem'] = result[i]['ORD_DSDItem'].trim()
        } else {
          catapultResObj['ORD_DSDItem'] = result[i]['ORD_DSDItem']
        }
        if (typeof result[i]['ORD_DefaultSupplier'] == 'string') {
          catapultResObj['ORD_DefaultSupplier'] = result[i]['ORD_DefaultSupplier'].trim()
        } else {
          catapultResObj['ORD_DefaultSupplier'] = result[i]['ORD_DefaultSupplier']
        }
        if (typeof result[i]['ORD_Discontinued'] == 'string') {
          catapultResObj['ORD_Discontinued'] = result[i]['ORD_Discontinued'].trim()
        } else {
          catapultResObj['ORD_Discontinued'] = result[i]['ORD_Discontinued']
        }

        catapultResObj['ORD_DateDiscontinued'] = unescape(result[i]['ORD_DateDiscontinued'])

        if (typeof result[i]['ORD_MinimumOrder'] == 'string') {
          catapultResObj['ORD_MinimumOrder'] = result[i]['ORD_MinimumOrder'].trim()
        } else {
          catapultResObj['ORD_MinimumOrder'] = result[i]['ORD_MinimumOrder']
        }
        if (typeof result[i]['ORD_FirstOrdRecordDSDFlagSet'] == 'string') {
          catapultResObj['ORD_FirstOrdRecordDSDFlagSet'] = result[i]['ORD_FirstOrdRecordDSDFlagSet'].trim()
        } else {
          catapultResObj['ORD_FirstOrdRecordDSDFlagSet'] = result[i]['ORD_FirstOrdRecordDSDFlagSet']
        }
        if (typeof result[i]['ORD_SuggestedMultiple'] == 'string') {
          catapultResObj['ORD_SuggestedMultiple'] = result[i]['ORD_SuggestedMultiple'].trim()
        } else {
          catapultResObj['ORD_SuggestedMultiple'] = result[i]['ORD_SuggestedMultiple']
        }
        if (typeof result[i]['ORD_AllowOverrideOfMultiple'] == 'string') {
          catapultResObj['ORD_AllowOverrideOfMultiple'] = result[i]['ORD_AllowOverrideOfMultiple'].trim()
        } else {
          catapultResObj['ORD_AllowOverrideOfMultiple'] = result[i]['ORD_AllowOverrideOfMultiple']
        }

        catapultResArr.push(catapultResObj)
      }
      console.log('result.length~~~>', result.length)
    }

    odbc.connect(DSN, (error, connection) => {
      connection.query(`${catapultDbQuery}`, (error, result) => {
        if (error) {
          console.error(error)
        }
        console.log('result==>', result)
        // console.log('result[0]==>', result[0])
        // console.log('result[\'columns\'][2]==>', result['columns'][2])
        // console.log('result.length~~~>', result.length)
        showcatapultResults(result)

        res.render('vw-OrderingInfo', { //render searchResults to vw-retailCalcPassport page
          title: 'vw-OrderingInfo',
          catapultResults: catapultResArr
        })
      })
    })
  })
}