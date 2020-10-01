var express = require('express');
var router = express.Router();

const mysql = require('mysql')
const connection = mysql.createConnection({
  host: process.env.RB_HOST,
  user: process.env.RB_USER,
  password: process.env.RB_PW,
  database: process.env.RB_DB,
  debug: true,
  multipleStatements: true,
})

const fs = require('fs')

const cstLstDtlResArrCache = require('../../nodeCacheStuff/cache1')

const nodeFetch = require('node-fetch')

const NodeGeocoder = require('node-geocoder')

const geocoder = NodeGeocoder({
  provider: 'here',
  fetch: function fetch(url, options) {
    return nodeFetch(url, {
      ...options,
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
  cstLstDtl: router.post('/cstLstDtl', (req, res, next) => {

    let cstLstDtlQuery = req.body['tblQryPost']

    console.log(`cstLstDtlQuery==> ${cstLstDtlQuery}`)

    let cstLstDtlResArr = []
    srcRsXLS_tsql = []

    let frwdGeoAddrArr = []
    let gcdrResultsArr = []
    let latLongArr = []

    async function forwardGeoCode() {
      const gcdrResults = await geocoder.batchGeocode(
        frwdGeoAddrArr
      )
      console.log(`gcdrResults[0]==> ${gcdrResults[0]}`)
      console.log(`JSON.stringify(gcdrResults[0])==> ${JSON.stringify(gcdrResults[0])}`)
      console.log(`frwdGeoAddrArr==> ${frwdGeoAddrArr}`)
      console.log(`frwdGeoAddrArr[0]==> ${frwdGeoAddrArr[0]}`)
      gcdrResultsArr.push(gcdrResults) //push gcdrResults into gcdrResultsArr for "global" use
      console.log(`gcdrResults.length==> ${gcdrResults.length}`)
      console.log(`gcdrResults==> ${gcdrResults}`)
      console.log(`JSON.stringify(gcdrResults)==> ${JSON.stringify(gcdrResults)}`)
      console.log(`JSON.stringify(gcdrResults[0])==> ${JSON.stringify(gcdrResults[0])}`)
      console.log(`JSON.stringify(gcdrResults[0]['value'])==> ${JSON.stringify(gcdrResults[0]['value'])}`)
      console.log(`JSON.stringify(gcdrResults[0]['value'][0]['latitude])==> ${JSON.stringify(gcdrResults[0]['value'][0]['latitude'])}`)
      console.log(`JSON.stringify(gcdrResults[0]['value'][0]['longitude'])==> ${JSON.stringify(gcdrResults[0]['value'][0]['longitude'])}`)
      for (let i = 0; i < gcdrResults.length; i++) {
        console.log(`JSON.stringify(gcdrResults[${i}])==> ${JSON.stringify(gcdrResults[i])}`)
        let latLongObj = {}
        if (gcdrResults[i]['value'][0] !== undefined) {
          latLongObj['lat'] = `${gcdrResults[i]['value'][0]['latitude']}`
          latLongObj['long'] = `${gcdrResults[i]['value'][0]['longitude']}`
          latLongArr.push(latLongObj)
        }
      }
      console.log(`latLongArr.length==> ${latLongArr.length}`)
      console.log(`JSON.stringify(latLongArr[0])==> ${JSON.stringify(latLongArr[0])}`)

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
   <script src="https://js.api.here.com/v3/3.1/mapsjs-clustering.js"></script>
   <script>
        // Instantiate a map and platform object:
        var platform = new H.service.Platform({
            'apikey': '${process.env.HERE_API_1}'
        });
        
        // Get an instance of the geocoding service:
        var service = platform.getSearchService();

   </script>
</body>
</html>
`)

      var svgsrc = jsdomT0d.window.document.documentElement.innerHTML
      fs.writeFile(`${process.cwd()}/views/includes/cstLstDtlMap.html`, svgsrc, function (err) {
        if (err) {
          console.log('error saving document', err)
        } else {
          console.log('The file was saved!')
          res.render('vw-cstLstDtl', {
            title: `Map`,
            cstLstDtlResArr: cstLstDtlResArr,
            gcdrResults: gcdrResultsArr,
            latLongArr: latLongArr,
            apiKey: process.env.HERE_API_1
          })
        }
      })

    }

    async function showCstLstDtlResults(result) {
      for (let i = 0; i < result.length; i++) {
        let cstLstDtlResObj = {}
        // let frwdGeoAddrObj = {}
        cstLstDtlResObj['ri_t0d'] = i + 1 //create sequential record id (ri_t0d) column for saving as csv; you will NOT
        //want to include INV_PK or INV_CPK in your save-to-csv gcdrResults - ONLY ri_t0d... adding 1 to 'i', so we don't
        //start our ri_t0d with 0, as that seems to confuse MySQL...

        cstLstDtlResObj['Customer_ID'] = result[i]['Customer_ID']
        cstLstDtlResObj['First_Name'] = result[i]['First_Name']
        cstLstDtlResObj['Last_Name'] = result[i]['Last_Name']
        cstLstDtlResObj['Company'] = result[i]['Company']
        cstLstDtlResObj['Birth_date'] = result[i]['Birth_date']
        cstLstDtlResObj['Terms'] = result[i]['Terms']
        cstLstDtlResObj['Bill_to_Address_1'] = result[i]['Bill_to_Address_1']
        cstLstDtlResObj['Bill_to_Address_2'] = result[i]['Bill_to_Address_2']
        cstLstDtlResObj['Bill_to_City'] = result[i]['Bill_to_City']
        cstLstDtlResObj['Bill_to_State'] = result[i]['Bill_to_State']
        cstLstDtlResObj['Bill_to_Zip'] = result[i]['Bill_to_Zip']
        cstLstDtlResObj['Bill_to_Email'] = result[i]['Bill_to_Email']
        cstLstDtlResObj['Bill_to_Phone'] = result[i]['Bill_to_Phone']
        cstLstDtlResObj['Bill_to_Fax'] = result[i]['Bill_to_Fax']
        cstLstDtlResObj['Ship_to_Address_1'] = result[i]['Ship_to_Address_1']
        cstLstDtlResObj['Ship_to_Address_2'] = result[i]['Ship_to_Address_2']
        cstLstDtlResObj['Ship_to_City'] = result[i]['Ship_to_City']
        cstLstDtlResObj['Ship_to_State'] = result[i]['Ship_to_State']
        cstLstDtlResObj['Ship_to_Zip'] = result[i]['Ship_to_Zip']
        cstLstDtlResObj['Ship_to_Email'] = result[i]['Ship_to_Email']
        cstLstDtlResObj['Ship_to_Phone'] = result[i]['Ship_to_Phone']
        cstLstDtlResObj['Ship_to_Fax'] = result[i]['Ship_to_Fax']
        cstLstDtlResObj['Store_of_Origin'] = result[i]['Store_of_Origin']
        cstLstDtlResObj['Gender'] = result[i]['Gender']
        cstLstDtlResObj['PowerField_3'] = result[i]['PowerField_3']
        cstLstDtlResObj['RB_Gives_Back'] = result[i]['RB_Gives_Back']
        cstLstDtlResObj['customer_note'] = result[i]['customer_note']
        cstLstDtlResObj['loyalty_flag'] = result[i]['loyalty_flag']
        cstLstDtlResObj['record_flag'] = result[i]['record_flag']
        cstLstDtlResObj['customer_flag'] = result[i]['customer_flag']


        cstLstDtlResArr.push(cstLstDtlResObj)
        srcRsXLS_tsql.push(cstLstDtlResObj)

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
      cstLstDtlResArrCache.set('cstLstDtlResArrCache_key', cstLstDtlResArr)
      console.log(`cstLstDtlResArrCache['data']['cstLstDtlResArrCache_key']['v'].length==> ${cstLstDtlResArrCache['data']['cstLstDtlResArrCache_key']['v'].length}`)
      console.log(`cstLstDtlResArrCache['data']['cstLstDtlResArrCache_key']['v'][0]==> ${cstLstDtlResArrCache['data']['cstLstDtlResArrCache_key']['v'][0]}`)
      console.log(`JSON.stringify(cstLstDtlResArrCache['data']['cstLstDtlResArrCache_key']['v'][0])==> ${JSON.stringify(cstLstDtlResArrCache['data']['cstLstDtlResArrCache_key']['v'][0])}`)
      //^// CACHE QUERY gcdrResults IN BACKEND //////////////////////////////////////////////////////////////////////////////

      for (let i = 0; i < cstLstDtlResArr.length; i++) {
        frwdGeoAddrArr.push(`'${cstLstDtlResArr[i]['ADD_StreetAddressLine1']} ${cstLstDtlResArr[i]['ADD_StreetAddressLine2']}, ${cstLstDtlResArr[i]['ADD_City']}, ${cstLstDtlResArr[i]['ADD_StateProvince']} ${cstLstDtlResArr[i]['ADD_PostalCode']}'`)
      }

      // console.log(`frwdGeoAddrArr(2)==> ${frwdGeoAddrArr}`)

    }

    // //v//writeHTMLfileAndRenderPage()//////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // async function writeHTMLfileAndRenderPage() {
    //     var svgsrc = jsdomT0d.window.document.documentElement.innerHTML
    //     fs.writeFile(`${process.cwd()}/views/includes/cstLstDtl.html`, svgsrc, function (err) {
    //         if (err) {
    //             console.log('error saving document', err)
    //         } else {
    //             console.log('The file was saved!')
    //             res.render('vw-cstLstDtlMap', {
    //                 title: `Map`,
    //                 // venProfArrDisplay: venProfArr,
    //             })
    //         }
    //     })
    // }
    // //^//writeHTMLfileAndRenderPage()////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    connection.query(mySqlQuery, (error, response) => {
      console.log(error || response);
    }).on('end', function () {
      showCstLstDtlResults(result)
        .then(forwardGeoCode())
    })
  })
}