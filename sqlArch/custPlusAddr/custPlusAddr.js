var express = require('express');
var router = express.Router();

const odbc = require('odbc')
const DSN = process.env.ODBC_CONN_STRING

const fs = require('fs')

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

const jsdom = require('jsdom')
const {
    JSDOM
} = jsdom

module.exports = {
    custPlusAddr: router.post('/custPlusAddr', (req, res, next) => {

        let catapultDbQuery = req.body['tblQryPost']

        console.log(`catapultDbQuery==> ${catapultDbQuery}`)

        let catapultResArr = []
        srcRsXLS_tsql = []

        let frwdGeoAddrArr = []
        let gcdrResultsArr = []
        // let latLongArr = []

        async function forwardGeoCode() {
            const gcdrResults = await geocoder.batchGeocode([
                // '254 El Conquistador Place, Louisville, KY 40220',
                // '1285 Willow Ave, Louisville, KY 40204'
                frwdGeoAddrArr.toString()
            ])
            console.log(`gcdrResults[0]==> ${gcdrResults[0]}`)
            console.log(`JSON.stringify(gcdrResults[0])==> ${JSON.stringify(gcdrResults[0])}`)
            console.log(`frwdGeoAddrArr==> ${frwdGeoAddrArr}`)
            console.log(`frwdGeoAddrArr[0]==> ${frwdGeoAddrArr[0]}`)
            gcdrResultsArr.push(gcdrResults) //push gcdrResults into gcdrResultsArr for "global" use
            console.log(`gcdrResults.length==> ${gcdrResults.length}`)
            console.log(`gcdrResults==> ${gcdrResults}`)
            console.log(`JSON.stringify(gcdrResults)==> ${JSON.stringify(gcdrResults)}`)
            for (let i = 0; i < gcdrResults.length; i++) {
                var latLongArr = gcdrResults.map(function (thingy_t0d) {
                    return [thingy_t0d[i]['value'], thingy_t0d[i]['value']]
                })
                console.log(`latLongArr==> ${latLongArr}`)
            }

            const jsdomT0d = new JSDOM(`
<html>
<head>
   <title>Simple HERE Map</title>
   <link rel="stylesheet" type="text/css" href="https://js.api.here.com/v3/3.1/mapsjs-ui.css" />
   <style>
      html, body { border: 0; margin: 0; padding: 0; }
      #map { height: 100vh; width: 100vw; }
   </style>
</head>
<body>
   <div id="map"></div>
   <script src="https://js.api.here.com/v3/3.1/mapsjs-core.js"></script>
   <script src="https://js.api.here.com/v3/3.1/mapsjs-service.js"></script>
   <script src="https://js.api.here.com/v3/3.1/mapsjs-ui.js"></script>
   <script src="https://js.api.here.com/v3/3.1/mapsjs-mapevents.js"></script>
   <script>
        // Instantiate a map and platform object:
        var platform = new H.service.Platform({
            'apikey': '${process.env.HERE_API_1}'
        });
        
        // Get an instance of the geocoding service:
        var service = platform.getSearchService();
        
        // Call the geocode method with the geocoding parameters,
        // the callback and an error callback function (called if a
        // communication error occurs):
        //service.geocode({
          //  q: '200 S Mathilda Ave, Sunnyvale, CA'
        //}, (result) => {
            // Add a marker for each location found
          //  result.items.forEach((item) => {
            //map.addObject(new H.map.Marker(item.position));
            //});
        //}, alert);

        // mapData.forEach((mapData) => {
        //     map.addObject(new H.map.Marker(mapData.position))
        // })

        // for (let i=0; i<mapDataArr.length; i++) {
        //     map.addObject(new H.map.Marker(mapDataArr[i].position))
        // }

   </script>
</body>
</html>
`)

            var svgsrc = jsdomT0d.window.document.documentElement.innerHTML
            fs.writeFile(`${process.cwd()}/views/includes/custPlusAddrMap.html`, svgsrc, function (err) {
                if (err) {
                    console.log('error saving document', err)
                } else {
                    console.log('The file was saved!')
                    res.render('vw-custPlusAddrMap', {
                        title: `Map`,
                        catapultResults: catapultResArr,
                        gcdrResults: gcdrResultsArr,
                        apiKey: process.env.HERE_API_1
                    })
                }
            })

        }

        async function showcatapultResults(result) {
            for (let i = 0; i < result.length; i++) {
                let catapultResObj = {}
                // let frwdGeoAddrObj = {}
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

            // console.log(`frwdGeoAddrArr(2)==> ${frwdGeoAddrArr}`)

        }

        // //v//writeHTMLfileAndRenderPage()//////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // async function writeHTMLfileAndRenderPage() {
        //     var svgsrc = jsdomT0d.window.document.documentElement.innerHTML
        //     fs.writeFile(`${process.cwd()}/views/includes/custPlusAddr.html`, svgsrc, function (err) {
        //         if (err) {
        //             console.log('error saving document', err)
        //         } else {
        //             console.log('The file was saved!')
        //             res.render('vw-custPlusAddrMap', {
        //                 title: `Map`,
        //                 // venProfArrDisplay: venProfArr,
        //             })
        //         }
        //     })
        // }
        // //^//writeHTMLfileAndRenderPage()////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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
                // .then(writeHTMLfileAndRenderPage())

                // res.render('vw-custPlusAddr', { //render searchResults to vw-retailCalcPassport page
                //     title: 'vw-custPlusAddr',
                //     catapultResults: catapultResArr,
                // })
            })
        })
    })
}