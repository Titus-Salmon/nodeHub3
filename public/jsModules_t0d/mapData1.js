let mapData = document.getElementById('mapData')
console.log(`mapData.value==> ${mapData.value}`)

let latLongData = document.getElementById('latLongData')
console.log(`latLongData==> ${latLongData}`)
console.log(`typeof latLongData==> ${typeof latLongData}`)
console.log(`latLongData.value==> ${latLongData.value}`)
console.log(`typeof latLongData.value==> ${typeof latLongData.value}`)

let regex1 = /(\[|\])/g
let regex2 = /(\{|\})/g

let latLongDataArr = []

let latLongDataSani1 = latLongData.value.replace(regex1, '')
let latLongDataSplit = latLongDataSani1.split('},{')
for (let i = 0; i < latLongDataSplit.length; i++) {
  // let latLongDataObj = {}
  latLongDataSplit[i] = latLongDataSplit[i].replace('{', '').replace('}', '')
  latLongDataArr.push(latLongDataSplit[i])
}
console.log(`latLongDataSplit==> ${latLongDataSplit}`)
console.log(`latLongDataArr==> ${latLongDataArr}`)
console.log(`latLongDataArr.length==> ${latLongDataArr.length}`)
console.log(`latLongDataArr[0]==> ${latLongDataArr[0]}`)
console.log(`JSON.parse(latLongDataArr[0])==> ${JSON.parse(latLongDataArr[0])}`)

let mapData2 = [{
  'lat': '38.19119',
  'long': '-85.64789'
}]



/**
 * Adds markers to the map highlighting the locations of the captials of
 * France, Italy, Germany, Spain and the United Kingdom.
 *
 * @param  {H.Map} map      A HERE Map instance within the application
 */
function addMarkersToMap(map) {


  for (let i = 0; i < mapData2.length; i++) {
    let markerT0d = new H.map.Marker({
      lat: mapData2[i]['lat'],
      lng: mapData2[i]['long']
    })
    map.addObject(markerT0d)
    console.log(`markerT0d==> ${markerT0d}`)
    console.log(`Object.keys(markerT0d)==> ${Object.keys(markerT0d)}`)
    console.log(`JSON.stringify(markerT0d)==> ${JSON.stringify(markerT0d)}`)
  }

}

/**
 * Boilerplate map initialization code starts below:
 */

//Step 1: initialize communication with the platform
// In your own code, replace variable window.apikey with your own apikey
var platform = new H.service.Platform({
  apikey: apiKey.value
});
var defaultLayers = platform.createDefaultLayers();

//Step 2: initialize a map - this map is centered over Europe
var map = new H.Map(document.getElementById('map'),
  defaultLayers.vector.normal.map, {
    center: {
      lat: 38.252247,
      lng: -85.659303
    },
    zoom: 4,
    pixelRatio: window.devicePixelRatio || 1
  });
// add a resize listener to make sure that the map occupies the whole container
window.addEventListener('resize', () => map.getViewPort().resize());

//Step 3: make the map interactive
// MapEvents enables the event system
// Behavior implements default interactions for pan/zoom (also on mobile touch environments)
var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

// Create the default UI components
var ui = H.ui.UI.createDefault(map, defaultLayers);

// Now use the map as required...
window.onload = function () {
  addMarkersToMap(map);
}