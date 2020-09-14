var el = window.document.querySelector('#dataviz-container'),
  body = window.document.querySelector('body'),
  circleId = 'a2324' // say, this value was dynamically retrieved from some database

// // generate the dataviz
// d3.select(el)
//   .append('svg:svg')
//   .attr('width', 600)
//   .attr('height', 300)
//   .append('circle')
//   .attr('cx', 300)
//   .attr('cy', 150)
//   .attr('r', 30)
//   .attr('fill', '#26963c')
//   .attr('id', circleId) // say, this value was dynamically retrieved from some database

// // make the client-side script manipulate the circle at client side)
// var clientScript = "d3.select('#" + circleId + "').transition().delay(1000).attr('fill', '#f9af26')"

// d3.select(body)
//   .append('script')
//   .html(clientScript)

// save result in an html file, we could also keep it in memory, or export the interesting fragment into a database for later use
var svgsrc = window.document.innerHTML
console.log(`process.cwd()==> ${process.cwd()}`)
fs.writeFile(`${process.cwd()}/views/inserts/venProfResults.html`, svgsrc, function (err) {
  if (err) {
    console.log('error saving document', err)
  } else {
    console.log('The file was saved!')
    res.render('vw-venProf', {
      title: `Monthly profits by vendor: ${vendorName}`,
      venProfArrDisplay: venProfArr,
    })
  }
})