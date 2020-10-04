var express = require('express');
var router = express.Router();

const mysql = require('mysql')
const connection = mysql.createConnection({
  host: process.env.RB_HOST,
  user: process.env.RB_USER,
  password: process.env.RB_PW,
  database: process.env.RB_DB,
  // debug: true,
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

// console.log(`JSON.stringify(geocoder)==> ${JSON.stringify(geocoder)}`)

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
    let latLongBlanksArr = []

    async function forwardGeoCode() {
      const gcdrResults = await geocoder.batchGeocode(
        frwdGeoAddrArr
      )
      // console.log(`gcdrResults[0]==> ${gcdrResults[0]}`)
      // console.log(`JSON.stringify(gcdrResults[0])==> ${JSON.stringify(gcdrResults[0])}`)
      // console.log(`frwdGeoAddrArr==> ${frwdGeoAddrArr}`)
      console.log(`frwdGeoAddrArr[0]==> ${frwdGeoAddrArr[0]}`)
      gcdrResultsArr.push(gcdrResults) //push gcdrResults into gcdrResultsArr for "global" use
      console.log(`gcdrResults.length==> ${gcdrResults.length}`)
      // console.log(`gcdrResults==> ${gcdrResults}`)
      // console.log(`JSON.stringify(gcdrResults)==> ${JSON.stringify(gcdrResults)}`)
      // console.log(`JSON.stringify(gcdrResults[0])==> ${JSON.stringify(gcdrResults[0])}`)
      // console.log(`JSON.stringify(gcdrResults[0]['value'])==> ${JSON.stringify(gcdrResults[0]['value'])}`)
      console.log(`JSON.stringify(gcdrResults[0]['value'][0]['latitude])==> ${JSON.stringify(gcdrResults[0]['value'][0]['latitude'])}`)
      console.log(`JSON.stringify(gcdrResults[0]['value'][0]['longitude'])==> ${JSON.stringify(gcdrResults[0]['value'][0]['longitude'])}`)
      for (let i = 0; i < gcdrResults.length; i++) {
        // console.log(`JSON.stringify(gcdrResults[${i}])==> ${JSON.stringify(gcdrResults[i])}`)
        let latLongObj = {}
        let latLongBlanksObj = {}
        if (gcdrResults[i]['value'][0] !== undefined) {
          if (gcdrResults[i]['value'][0]['latitude'] !== undefined && gcdrResults[i]['value'][0]['longitude'] !== undefined) {
            if (gcdrResults[i]['value'][0]['latitude'] !== '' && gcdrResults[i]['value'][0]['longitude'] !== '') {
              latLongObj['lat'] = `${gcdrResults[i]['value'][0]['latitude']}`
              latLongObj['long'] = `${gcdrResults[i]['value'][0]['longitude']}`
              latLongArr.push(latLongObj)
            } else {
              // console.log(`gcdrResults[${i}]['value'][0]['latitude']==> ${gcdrResults[i]['value'][0]['latitude']}`)
              // console.log(`gcdrResults[${i}]['value'][0]['longitude']==> ${gcdrResults[i]['value'][0]['longitude']}`)
              latLongBlanksObj['lat'] = `${gcdrResults[i]['value'][0]['latitude']}`
              latLongBlanksObj['long'] = `${gcdrResults[i]['value'][0]['longitude']}`
              latLongBlanksArr.push(latLongBlanksObj)
            }
          }

        }
      }
      console.log(`latLongArr.length==> ${latLongArr.length}`)
      console.log(`JSON.stringify(latLongArr[0])==> ${JSON.stringify(latLongArr[0])}`)

      console.log(`latLongBlanksArr.length==> ${latLongBlanksArr.length}`)
      console.log(`JSON.stringify(latLongBlanksArr[0])==> ${JSON.stringify(latLongBlanksArr[0])}`)

      const jsdomT0d = new JSDOM(`
      <html>
      <head>
         <title>JSDOMified Map</title>
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
         /**
          * Adds markers to the map highlighting the locations of the captials of
          * France, Italy, Germany, Spain and the United Kingdom.
          *
          * @param  {H.Map} map      A HERE Map instance within the application
          */
         function addMarkersToMap(map) {
         
         
           for (let i = 0; i < latLongArr.length; i++) {
             let markerT0d = new H.map.Marker({
               lat: latLongArr[i]['lat'],
               lng: latLongArr[i]['long']
             })
             map.addObject(markerT0d)
           }
         
         }
         
         //*************************************************************************************************************** */
         
         //v//HERE clustered marker placement//////////////////////////////////////////////////////////// 
         /**
          * Display clustered markers on a map
          *
          * Note that the maps clustering module https://js.api.here.com/v3/3.1/mapsjs-clustering.js
          * must be loaded to use the Clustering
         
          * @param {H.Map} map A HERE Map instance within the application
          * @param {Object[]} data Raw data that contains {locations to cluster} coordinates
         */
         function startClustering(map, data) {
           // First we need to create an array of DataPoint objects,
           // for the ClusterProvider
           var dataPoints = data.map(function (item) {
             return new H.clustering.DataPoint(item.lat, item.long);
           });
         
           // Create a clustering provider with custom options for clusterizing the input
           var clusteredDataProvider = new H.clustering.Provider(dataPoints, {
             clusteringOptions: {
               // Maximum radius of the neighbourhood
               eps: 256,
               // minimum weight of points required to form a cluster
               minWeight: 1
             }
           });
         
           // Create a layer tha will consume objects from our clustering provider
           var clusteringLayer = new H.map.layer.ObjectLayer(clusteredDataProvider);
         
           // To make objects from clustering provder visible,
           // we need to add our layer to the map
           map.addLayer(clusteringLayer);
         }
         
         /**
          * Boilerplate map initialization code starts below:
          */
         
         // Step 1: initialize communication with the platform
         // In your own code, replace variable window.apikey with your own apikey
         var platform = new H.service.Platform({
           // apikey: apiKey.value
           apikey: '${process.env.HERE_API_1}'
         });
         
         var defaultLayers = platform.createDefaultLayers();
         
         // Step 2: initialize a map
         var map = new H.Map(document.getElementById('map'), defaultLayers.vector.normal.map, {
           center: new H.geo.Point(38.252247, -85.659303),
           zoom: 8,
           pixelRatio: window.devicePixelRatio || 1
         });
         // add a resize listener to make sure that the map occupies the whole container
         window.addEventListener('resize', () => map.getViewPort().resize());
         
         // Step 3: make the map interactive
         // MapEvents enables the event system
         // Behavior implements default interactions for pan/zoom (also on mobile touch environments)
         var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
         
         
         // Step 4: create the default UI component, for displaying bubbles
         var ui = H.ui.UI.createDefault(map, defaultLayers);
         
         // Step 5: cluster data about latLongArr's coordinates
         startClustering(map, ${JSON.stringify(latLongArr)});
         //^//HERE clustered marker placement//////////////////////////////////////////////////////////// 
         </script>
      </body>
      </html>
      `, {
        runScripts: "dangerously",
        resources: "usable",
        url: "https://js.api.here.com/v3/3.1/mapsjs-core.js",
        // url: "http://localhost:3000",
        referrer: "http://localhost:3000/cstLstDtl/cstLstDtl",
        contentType: "text/html",
        includeNodeLocations: true,
        storageQuota: 10000000
      })

      var svgsrc = jsdomT0d.window.document.documentElement.innerHTML
      fs.writeFile(`${process.cwd()}/views/includes/cstLstDtlMap.html`, svgsrc, function (err) {
        if (err) {
          console.log('error saving document', err)
        } else {
          console.log('The file was saved!')
          res.render('vw-cstLstDtlMap', {
            title: `Map`,
            cstLstDtlResArr: cstLstDtlResArr,
            gcdrResults: gcdrResultsArr,
            latLongArr: latLongArr,
            apiKey: process.env.HERE_API_1
          })
        }
      })

      // res.render('vw-cstLstDtlMap', {
      //   title: `Map`,
      //   cstLstDtlResArr: cstLstDtlResArr,
      //   gcdrResults: gcdrResultsArr,
      //   latLongArr: latLongArr,
      //   apiKey: process.env.HERE_API_1
      // })

    }

    async function showCstLstDtlResults(rows) {
      for (let i = 0; i < rows.length; i++) {
        let cstLstDtlResObj = {}
        // let frwdGeoAddrObj = {}
        cstLstDtlResObj['ri_t0d'] = i + 1 //create sequential record id (ri_t0d) column for saving as csv; you will NOT
        //want to include INV_PK or INV_CPK in your save-to-csv gcdrResults - ONLY ri_t0d... adding 1 to 'i', so we don't
        //start our ri_t0d with 0, as that seems to confuse MySQL...

        cstLstDtlResObj['Customer_ID'] = rows[i]['Customer_ID']
        cstLstDtlResObj['First_Name'] = rows[i]['First_Name']
        cstLstDtlResObj['Last_Name'] = rows[i]['Last_Name']
        cstLstDtlResObj['Company'] = rows[i]['Company']
        cstLstDtlResObj['Birth_date'] = rows[i]['Birth_date']
        cstLstDtlResObj['Terms'] = rows[i]['Terms']
        cstLstDtlResObj['Bill_to_Address_1'] = rows[i]['Bill_to_Address_1']
        cstLstDtlResObj['Bill_to_Address_2'] = rows[i]['Bill_to_Address_2']
        cstLstDtlResObj['Bill_to_City'] = rows[i]['Bill_to_City']
        cstLstDtlResObj['Bill_to_State'] = rows[i]['Bill_to_State']
        cstLstDtlResObj['Bill_to_Zip'] = rows[i]['Bill_to_Zip']
        cstLstDtlResObj['Bill_to_Email'] = rows[i]['Bill_to_Email']
        cstLstDtlResObj['Bill_to_Phone'] = rows[i]['Bill_to_Phone']
        cstLstDtlResObj['Bill_to_Fax'] = rows[i]['Bill_to_Fax']
        cstLstDtlResObj['Ship_to_Address_1'] = rows[i]['Ship_to_Address_1']
        cstLstDtlResObj['Ship_to_Address_2'] = rows[i]['Ship_to_Address_2']
        cstLstDtlResObj['Ship_to_City'] = rows[i]['Ship_to_City']
        cstLstDtlResObj['Ship_to_State'] = rows[i]['Ship_to_State']
        cstLstDtlResObj['Ship_to_Zip'] = rows[i]['Ship_to_Zip']
        cstLstDtlResObj['Ship_to_Email'] = rows[i]['Ship_to_Email']
        cstLstDtlResObj['Ship_to_Phone'] = rows[i]['Ship_to_Phone']
        cstLstDtlResObj['Ship_to_Fax'] = rows[i]['Ship_to_Fax']
        cstLstDtlResObj['Store_of_Origin'] = rows[i]['Store_of_Origin']
        cstLstDtlResObj['Gender'] = rows[i]['Gender']
        cstLstDtlResObj['PowerField_3'] = rows[i]['PowerField_3']
        cstLstDtlResObj['RB_Gives_Back'] = rows[i]['RB_Gives_Back']
        cstLstDtlResObj['customer_note'] = rows[i]['customer_note']
        cstLstDtlResObj['loyalty_flag'] = rows[i]['loyalty_flag']
        cstLstDtlResObj['record_flag'] = rows[i]['record_flag']
        cstLstDtlResObj['customer_flag'] = rows[i]['customer_flag']


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
      // console.log(`cstLstDtlResArrCache['data']['cstLstDtlResArrCache_key']['v'].length==> ${cstLstDtlResArrCache['data']['cstLstDtlResArrCache_key']['v'].length}`)
      // console.log(`cstLstDtlResArrCache['data']['cstLstDtlResArrCache_key']['v'][0]==> ${cstLstDtlResArrCache['data']['cstLstDtlResArrCache_key']['v'][0]}`)
      // console.log(`JSON.stringify(cstLstDtlResArrCache['data']['cstLstDtlResArrCache_key']['v'][0])==> ${JSON.stringify(cstLstDtlResArrCache['data']['cstLstDtlResArrCache_key']['v'][0])}`)
      //^// CACHE QUERY gcdrResults IN BACKEND //////////////////////////////////////////////////////////////////////////////

      for (let i = 0; i < cstLstDtlResArr.length; i++) {
        if (cstLstDtlResArr[i]['Bill_to_State'].toLowerCase() == 'in' || //select only for IN & KY
          cstLstDtlResArr[i]['Bill_to_State'].toLowerCase() == 'ky') {
          frwdGeoAddrArr.push(`'${cstLstDtlResArr[i]['Bill_to_Address_1']} ${cstLstDtlResArr[i]['Bill_to_Address_2']}, ${cstLstDtlResArr[i]['Bill_to_City']}, ${cstLstDtlResArr[i]['Bill_to_State']} ${cstLstDtlResArr[i]['Bill_to_Zip']}'`)
        }

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


    // connection.query(cstLstDtlQuery, (error, response) => {
    //   console.log(error || response);
    // }).on('end', function () {
    //   showCstLstDtlResults(result)
    //     .then(forwardGeoCode())
    // })

    //v//connection.query()//////////////////////////////////////////////////////////////////////////////////////////////////////////////
    connection.query(cstLstDtlQuery, function (err, rows, fields) {
      if (err) throw err
      showCstLstDtlResults(rows)
        .then(forwardGeoCode())
    })
    //^//connection.query()////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  })
}