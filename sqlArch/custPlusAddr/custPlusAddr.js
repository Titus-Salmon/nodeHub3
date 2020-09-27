var express = require('express');
var router = express.Router();

const odbc = require('odbc')
const DSN = process.env.ODBC_CONN_STRING

// const fs = require('fs')

const catapultResArrCache = require('../../nodeCacheStuff/cache1')

const nodeFetch = require('node-fetch')

const NodeGeocoder = require('node-geocoder')

const geocoder = NodeGeocoder({
    provider: 'here',
    fetch: function fetch(url, options) {
        return nodeFetch(url, {
            ...options,
            // headers: {
            //   'user-agent': 'My application <email@domain.com>',
            //   'X-Specific-Header': 'Specific value'
            // }
        })
    },
    apiKey: process.env.HERE_API_1,
    country: 'USA'
})

console.log(`JSON.stringify(geocoder)==> ${JSON.stringify(geocoder)}`)

module.exports = {
    custPlusAddr: router.post('/custPlusAddr', (req, res, next) => {

        let catapultDbQuery = req.body['tblQryPost']

        console.log(`catapultDbQuery==> ${catapultDbQuery}`)

        let catapultResArr = []
        srcRsXLS_tsql = []

        let frwdGeoAddrArr = []

        // const url = `https://geocode.search.hereapi.com/v1/geocode`

        // async function forwardGeoCode() {
        //     const gcdrResults = await geocoder.batchGeocode([
        //         '254 El Conquistador Place, Louisville, KY 40220',
        //         '1285 Willow Ave, Louisville, KY 40204'
        //     ])
        //     console.log(`gcdrResults[0]==> ${gcdrResults[0]}`)
        //     console.log(`JSON.stringify(gcdrResults[0])==> ${JSON.stringify(gcdrResults[0])}`)
        // }

        async function forwardGeoCode() {
            const gcdrResults = await geocoder.batchGeocode([
                // '254 El Conquistador Place, Louisville, KY 40220',
                // '1285 Willow Ave, Louisville, KY 40204'
                frwdGeoAddrArr
            ])
            console.log(`gcdrResults[0]==> ${gcdrResults[0]}`)
            console.log(`JSON.stringify(gcdrResults[0])==> ${JSON.stringify(gcdrResults[0])}`)
            console.log(`frwdGeoAddrArr(1)==> ${frwdGeoAddrArr}`)
        }

        async function showcatapultResults(result) {
            for (let i = 0; i < result.length; i++) {
                let catapultResObj = {}
                let frwdGeoAddrObj = {}
                catapultResObj['ri_t0d'] = i + 1 //create sequential record id (ri_t0d) column for saving as csv; you will NOT
                //want to include INV_PK or INV_CPK in your save-to-csv gcdrResults - ONLY ri_t0d... adding 1 to 'i', so we don't
                //start our ri_t0d with 0, as that seems to confuse MySQL...
                catapultResObj['ADD_PK'] = result[i]['ADD_PK']
                if (typeof result[i]['ADD_StreetAddressLine1'] == 'string') {
                    catapultResObj['ADD_StreetAddressLine1'] = result[i]['ADD_StreetAddressLine1'].trim()
                } else {
                    catapultResObj['ADD_StreetAddressLine1'] = result[i]['ADD_StreetAddressLine1']
                }
                if (typeof result[i]['ADD_StreetAddressLine2'] == 'string') {
                    catapultResObj['ADD_StreetAddressLine2'] = result[i]['ADD_StreetAddressLine2'].trim()
                } else {
                    catapultResObj['ADD_StreetAddressLine2'] = result[i]['ADD_StreetAddressLine2']
                }
                if (typeof result[i]['ADD_City'] == 'string') {
                    catapultResObj['ADD_City'] = result[i]['ADD_City'].trim()
                } else {
                    catapultResObj['ADD_City'] = result[i]['ADD_City']
                }
                if (typeof result[i]['ADD_StateProvince'] == 'string') {
                    catapultResObj['ADD_StateProvince'] = result[i]['ADD_StateProvince'].trim()
                } else {
                    catapultResObj['ADD_StateProvince'] = result[i]['ADD_StateProvince']
                }
                if (typeof result[i]['ADD_Country'] == 'string') {
                    catapultResObj['ADD_Country'] = result[i]['ADD_Country'].trim()
                } else {
                    catapultResObj['ADD_Country'] = result[i]['ADD_Country']
                }
                if (typeof result[i]['ADD_PostalCode'] == 'string') {
                    catapultResObj['ADD_PostalCode'] = result[i]['ADD_PostalCode'].trim()
                } else {
                    catapultResObj['ADD_PostalCode'] = result[i]['ADD_PostalCode']
                }
                // catapultResObj['posTimeStamp'] = unescape(result[i]['POS_TimeStamp'])
                catapultResObj['ADD_CUS_FK'] = result[i]['ADD_CUS_FK']
                catapultResObj['CUS_PK'] = result[i]['CUS_PK']

                if (typeof result[i]['CUS_FirstName'] == 'string') {
                    catapultResObj['CUS_FirstName'] = result[i]['CUS_FirstName'].trim()
                } else {
                    catapultResObj['CUS_FirstName'] = result[i]['CUS_FirstName']
                }
                if (typeof result[i]['CUS_MiddleName'] == 'string') {
                    catapultResObj['CUS_MiddleName'] = result[i]['CUS_MiddleName'].trim()
                } else {
                    catapultResObj['CUS_MiddleName'] = result[i]['CUS_MiddleName']
                }
                if (typeof result[i]['CUS_LastName'] == 'string') {
                    catapultResObj['CUS_LastName'] = result[i]['CUS_LastName'].trim()
                } else {
                    catapultResObj['CUS_LastName'] = result[i]['CUS_LastName']
                }
                if (typeof result[i]['CUS_NickName'] == 'string') {
                    catapultResObj['CUS_NickName'] = result[i]['CUS_NickName'].trim()
                } else {
                    catapultResObj['CUS_NickName'] = result[i]['CUS_NickName']
                }
                if (typeof result[i]['CUS_AccountNum'] == 'string') {
                    catapultResObj['CUS_AccountNum'] = result[i]['CUS_AccountNum'].trim()
                } else {
                    catapultResObj['CUS_AccountNum'] = result[i]['CUS_AccountNum']
                }

                catapultResArr.push(catapultResObj)
                srcRsXLS_tsql.push(catapultResObj)

                // function forwardGeoCode() {
                //     const gcdrResults = await geocoder.batchGeocode([
                //         `${addr1} ${addr2}, ${city}, ${state} ${zip}`,
                //         // '254 El Conquistador Place, Louisville, KY 40220',
                //         // '1285 Willow Ave, Louisville, KY 40204'
                //     ])
                //     console.log(`gcdrResults[0]==> ${gcdrResults[0]}`)
                //     console.log(`JSON.stringify(gcdrResults[0])==> ${JSON.stringify(gcdrResults[0])}`)
                // }
                // forwardGeoCode()
            }
            //V// CACHE QUERY gcdrResults IN BACKEND ///////////IS THIS BEING USED, AND SHOULD IT???///////////////////////////////////////////////////////////////////
            catapultResArrCache.set('catapultResArrCache_key', catapultResArr)
            console.log(`catapultResArrCache['data']['catapultResArrCache_key']['v'].length==> ${catapultResArrCache['data']['catapultResArrCache_key']['v'].length}`)
            console.log(`catapultResArrCache['data']['catapultResArrCache_key']['v'][0]==> ${catapultResArrCache['data']['catapultResArrCache_key']['v'][0]}`)
            console.log(`JSON.stringify(catapultResArrCache['data']['catapultResArrCache_key']['v'][0])==> ${JSON.stringify(catapultResArrCache['data']['catapultResArrCache_key']['v'][0])}`)
            //^// CACHE QUERY gcdrResults IN BACKEND //////////////////////////////////////////////////////////////////////////////

            for (let i = 0; i < catapultResArr.length; i++) {
                frwdGeoAddrArr.push(`'${catapultResArr[i]['ADD_StreetAddressLine1']} ${catapultResArr[i]['ADD_StreetAddressLine2']}, ${catapultResArr[i]['ADD_City']}, ${catapultResArr[i]['ADD_StateProvince']} ${catapultResArr[i]['ADD_PostalCode']}'`)
            }

            console.log(`frwdGeoAddrArr(2)==> ${frwdGeoAddrArr}`)

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
                    .then(forwardGeoCode())

                res.render('vw-custPlusAddr', { //render searchResults to vw-retailCalcPassport page
                    title: 'vw-custPlusAddr',
                    catapultResults: catapultResArr,
                })
            })
        })
    })
}