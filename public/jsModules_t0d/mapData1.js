let mapData = document.getElementById('mapData')
// console.log(`mapData.value==> ${mapData.value}`)

let latLongData = document.getElementById('latLongData')
// console.log(`latLongData==> ${latLongData}`)
// console.log(`typeof latLongData==> ${typeof latLongData}`)
// console.log(`latLongData.value==> ${latLongData.value}`)
// console.log(`typeof latLongData.value==> ${typeof latLongData.value}`)

let regex1 = /(\[|\])/g
let regex2 = /(\{|\})/g
let regex3 = /(\d+)\.(\d+)/g

let latLongDataArr = []

let latLongDataSani1 = latLongData.value.replace(regex1, '')
let latLongDataSplit = latLongDataSani1.split('},{')
for (let i = 0; i < latLongDataSplit.length; i++) {
  // let latLongDataObj = {}
  latLongDataSplit[i] = latLongDataSplit[i].replace('{', '').replace('}', '')
  latLongDataArr.push(latLongDataSplit[i])
}
// console.log(`latLongDataSplit==> ${latLongDataSplit}`)
for (let i = 0; i < latLongDataArr.length; i++) {
  latLongDataArr[i] = `{${latLongDataArr[i]}}` //add brackets back on for JSON.parse on frontend
}
// console.log(`latLongDataArr==> ${latLongDataArr}`)
console.log(`latLongDataArr.length==> ${latLongDataArr.length}`)
console.log(`latLongDataArr[0]==> ${latLongDataArr[0]}`)
console.log(`JSON.parse(latLongDataArr[0])==> ${JSON.parse(latLongDataArr[0])}`)
for (let i = 0; i < latLongDataArr.length; i++) {
  latLongDataArr[i] = JSON.parse(latLongDataArr[i])
}
console.log(`latLongDataArr[0]['lat']==> ${latLongDataArr[0]['lat']}`)
console.log(`latLongDataArr[0]['long']==> ${latLongDataArr[0]['long']}`)

// let mapData2 = [{
//   'lat': '38.19119',
//   'long': '-85.64789'
// }]

// let mapData2 = latLongDataArr



/**
 * Adds markers to the map highlighting the locations of the captials of
 * France, Italy, Germany, Spain and the United Kingdom.
 *
 * @param  {H.Map} map      A HERE Map instance within the application
 */
function addMarkersToMap(map) {


  for (let i = 0; i < latLongDataArr.length; i++) {
    let markerT0d = new H.map.Marker({
      lat: latLongDataArr[i]['lat'],
      lng: latLongDataArr[i]['long']
    })
    map.addObject(markerT0d)
    // console.log(`markerT0d==> ${markerT0d}`)
    // console.log(`Object.keys(markerT0d)==> ${Object.keys(markerT0d)}`)
    // console.log(`JSON.stringify(markerT0d)==> ${JSON.stringify(markerT0d)}`)
  }

}

// //v//HERE non-clustered marker placement//////////////////////////////////////////////////////////// 
// /**
//  * Boilerplate map initialization code starts below:
//  */

// //Step 1: initialize communication with the platform
// // In your own code, replace variable window.apikey with your own apikey
// var platform = new H.service.Platform({
//   apikey: apiKey.value
// });
// var defaultLayers = platform.createDefaultLayers();

// //Step 2: initialize a map - this map is centered over Europe
// var map = new H.Map(document.getElementById('map'),
//   defaultLayers.vector.normal.map, {
//     center: {
//       lat: 38.252247,
//       lng: -85.659303
//     },
//     zoom: 4,
//     pixelRatio: window.devicePixelRatio || 1
//   });
// // add a resize listener to make sure that the map occupies the whole container
// window.addEventListener('resize', () => map.getViewPort().resize());

// //Step 3: make the map interactive
// // MapEvents enables the event system
// // Behavior implements default interactions for pan/zoom (also on mobile touch environments)
// var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

// // Create the default UI components
// var ui = H.ui.UI.createDefault(map, defaultLayers);

// // Now use the map as required...
// window.onload = function () {
//   addMarkersToMap(map);
// }
// //^//HERE non-clustered marker placement////////////////////////////////////////////////////////////

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
      eps: 64,
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
  apikey: apiKey.value
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

// Step 5: cluster data about latLongDataArr's coordinates
startClustering(map, latLongDataArr);
//^//HERE clustered marker placement//////////////////////////////////////////////////////////// 