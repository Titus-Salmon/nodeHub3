var express = require('express');
var router = express.Router();

const mysql = require('mysql');
const connection = mysql.createConnection({
  host: process.env.RB_HOST,
  user: process.env.RB_USER,
  password: process.env.RB_PW,
  database: process.env.RB_DB,
  multipleStatements: true
})

// const venProfArrCache = require('../nodeCacheStuff/cache1')

const d3 = require('d3')
const jsdom = require('jsdom')
const {
  JSDOM
} = jsdom
const fs = require('fs')

const jsdomT0d = new JSDOM(`<!DOCTYPE html><body><div id="dataviz-container"></div></body>`)
var el = jsdomT0d.window.document.querySelector('#dataviz-container')


module.exports = {
  venProf: router.post('/venProf', (req, res, next) => {

    let vendorName = req.body['vendorNamePost']
    console.log(`vendorName==> ${vendorName}`)

    let venProfArr = [] // holds venProfObj data from ois_venprof_mnth_copy2 table
    let updateDemarcatorArr = [] // holds updateDemarcatorObj instances (for placing secondary y-axis) data from rainbowcat_update_tracker table
    let WsUpdateArr = [] // holds updateDemarcatorObj instances where dates are only for WS updates
    let WsDateOnlyArr = [] // holds updateDemarcatorObj['date] instances where dates are only for WS updates
    let RtlUpdateArr = [] // holds updateDemarcatorObj instances where dates are only for Rtl updates

    let wsPlusRtlItemsArr = [] //holds updateDemarcatorObj['date] instances where dates are for WS & Rtl updates
    let wsValsArr = [] // holds updateDemarcatorObj['items_updtd_ws'] instances where dates are for WS updates
    let rtlValsArr = [] // holds updateDemarcatorObj['items_updtd_rtl'] instances where dates are for Rtl updates


    //v//displayvenProf(rows)//////////////////////////////////////////////////////////////////////////////////////////////////////////////
    async function displayvenProf(rows) {

      let ois_venprof_mnth_rows = rows[0]

      for (let i = 0; i < ois_venprof_mnth_rows.length; i++) {
        let venProfObj = {}
        venProfObj['ri_t0d'] = i + 1
        venProfObj['date'] = ois_venprof_mnth_rows[i]['date']
        venProfObj['kehe'] = ois_venprof_mnth_rows[i]['kehe']

        venProfArr.push(venProfObj)
      }
      // venProfArrCache.set('venProfArrCache_key', venProfArr)
      console.log('ois_venprof_mnth_rows.length~~~>', ois_venprof_mnth_rows.length)
      console.log(`Object.keys(ois_venprof_mnth_rows)==>${Object.keys(ois_venprof_mnth_rows)}`)
      console.log(`JSON.stringify(venProfArr) from displayvenProf()==> ${JSON.stringify(venProfArr)}`)
    }
    //^//displayvenProf(rows)////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    //v//updateDemarcator(rows)//////////////////////////////////////////////////////////////////////////////////////////////////////////////
    async function updateDemarcator(rows) {

      let rainbowcat_update_tracker_rows = rows[1]

      for (let i = 0; i < rainbowcat_update_tracker_rows.length; i++) {
        let updateDemarcatorObj = {}
        updateDemarcatorObj['ri_t0d'] = i + 1
        // updateDemarcatorObj['date'] = rainbowcat_update_tracker_rows[i]['date'].split('T', 1)[0]
        updateDemarcatorObj['date'] = rainbowcat_update_tracker_rows[i]['date']
        updateDemarcatorObj['edi_vendor_name'] = rainbowcat_update_tracker_rows[i]['edi_vendor_name']
        updateDemarcatorObj['wsImw'] = rainbowcat_update_tracker_rows[i]['wsImw']
        updateDemarcatorObj['rtlImw'] = rainbowcat_update_tracker_rows[i]['rtlImw']
        updateDemarcatorObj['items_updtd_ws'] = rainbowcat_update_tracker_rows[i]['items_updtd_ws']
        updateDemarcatorObj['items_updtd_rtl'] = rainbowcat_update_tracker_rows[i]['items_updtd_rtl']

        updateDemarcatorArr.push(updateDemarcatorObj)

        //fill wsPlusRtlItemsArr with both WS & Rtl total items updated (to get range for yAxisUpdateDemarcator)
        wsPlusRtlItemsArr.push(rainbowcat_update_tracker_rows[i]['items_updtd_ws'])
        wsPlusRtlItemsArr.push(rainbowcat_update_tracker_rows[i]['items_updtd_rtl'])

        console.log(`rainbowcat_update_tracker_rows[i]['edi_vendor_name'].toLowerCase()==> ${rainbowcat_update_tracker_rows[i]['edi_vendor_name'].toLowerCase()}`)

        ///v///......................................................................................................
        if (rainbowcat_update_tracker_rows[i]['wsImw'] !== null &&
          rainbowcat_update_tracker_rows[i]['edi_vendor_name'].toLowerCase() == `edi-${vendorName.toLowerCase()}`) {
          WsUpdateArr.push(updateDemarcatorObj)

          //v//add # of WS items updated to it's own array (for creating WS update y-axis)<==this actually isn't being used for now;
          //would make graph too complex
          wsValsArr.push(rainbowcat_update_tracker_rows[i]['items_updtd_ws'])
        }

        if (rainbowcat_update_tracker_rows[i]['rtlImw'] !== null &&
          rainbowcat_update_tracker_rows[i]['edi_vendor_name'].toLowerCase() == `edi-${vendorName.toLowerCase()}`) {
          RtlUpdateArr.push(updateDemarcatorObj)

          //v//add # of Rtl items updated to it's own array (for scaling yAxisUpdateDemarcator; we don't use the WS numbers in the scale)
          rtlValsArr.push(rainbowcat_update_tracker_rows[i]['items_updtd_rtl'])
        }
        //^//......................................................................................................
      }
      // venProfArrCache.set('venProfArrCache_key', venProfArr)
      console.log('rainbowcat_update_tracker_rows.length~~~>', rainbowcat_update_tracker_rows.length)
      console.log(`Object.keys(rainbowcat_update_tracker_rows)==>${Object.keys(rainbowcat_update_tracker_rows)}`)

      console.log(`JSON.stringify(WsUpdateArr)==> ${JSON.stringify(WsUpdateArr)}`)
      console.log(`JSON.stringify(RtlUpdateArr)==> ${JSON.stringify(RtlUpdateArr)}`)
    }
    //^//updateDemarcator(rows)////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    //v//writeHTMLfileAndRenderPage()//////////////////////////////////////////////////////////////////////////////////////////////////////////////
    async function writeHTMLfileAndRenderPage() {
      var svgsrc = jsdomT0d.window.document.documentElement.innerHTML
      fs.writeFile(`${process.cwd()}/views/includes/venProfResults.html`, svgsrc, function (err) {
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
    }
    //^//writeHTMLfileAndRenderPage()////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    //v//createLineChartT0d()//////////////////////////////////////////////////////////////////////////////////////////////////////////////
    async function createLineChartT0d() {

      //v//........................................................................................
      var width = 1000
      var height = 500

      var margin = ({
        top: 20,
        right: 30,
        bottom: 150,
        left: 50
      })

      let xAxis_yValue = height - margin.bottom

      var x = d3.scaleUtc()
        .domain(d3.extent(venProfArr, d => d.date))
        .range([margin.left, width - margin.right])

      var y = d3.scaleLinear()
        .domain([0, d3.max(venProfArr, d => d.kehe)]).nice()
        .range([xAxis_yValue, margin.top])

      var line = d3.line()
        .defined(d => !isNaN(d.kehe))
        .x(d => x(d.date))
        .y(d => y(d.kehe))

      var xAxis = g => g
        .attr("transform", `translate(0,${xAxis_yValue})`)
        .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0))

      var yAxis = g => g
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y))
        .call(g => g.select(".domain").remove())
        .call(g => g.select(".tick:last-of-type text").clone()
          .attr("x", 3)
          .attr("text-anchor", "start")
          .attr("font-weight", "bold")
          .text(venProfArr.y))

      const svg = d3.select(el)
        .append('svg')
        .attr("viewBox", [0, 0, width, height])
      //^//........................................................................................

      svg.append("g")
        .call(xAxis)

      svg.append("g")
        .call(yAxis)

      svg.append("path")
        .datum(venProfArr)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("d", line)

      timeScaleUpdateDemarcator = d3.scaleUtc()
        .domain(d3.extent(venProfArr, d => d.date))
        .range([margin.left, width - margin.right])

      if (WsUpdateArr.length > 0) {
        for (let i = 0; i < WsUpdateArr.length; i++) {
          WsDateOnlyArr.push(WsUpdateArr[i]['date'])
        }
      }

      console.log(`WsDateOnlyArr==> ${WsDateOnlyArr}`)
      console.log(`typeof WsDateOnlyArr[0]==> ${typeof WsDateOnlyArr[0]}`)

      var ws_dates_as_int = WsDateOnlyArr.map(Date.parse)
      console.log(`ws_dates_as_int==> ${ws_dates_as_int}`)

      var minWSdate = Math.min(...WsDateOnlyArr)
      console.log(`minWSdate==> ${minWSdate}`)
      // var maxWSdate = Math.max(...WsDateOnlyArr)
      // console.log(`maxWSdate==> ${maxWSdate}`)

      var minYaxisUpdtDmrctrWSandRtl = Math.min(...wsPlusRtlItemsArr)
      console.log(`minYaxisUpdtDmrctrWSandRtl==> ${minYaxisUpdtDmrctrWSandRtl}`)

      var maxYaxisUpdtDmrctrWSandRtl = Math.max(...wsPlusRtlItemsArr)
      console.log(`maxYaxisUpdtDmrctrWSandRtl==> ${maxYaxisUpdtDmrctrWSandRtl}`)

      //v//Min & Max values for # of WS & Rtl items updated
      var minYvalWS = Math.min(...wsValsArr)
      console.log(`minYvalWS==> ${minYvalWS}`)

      var maxYvalWS = Math.max(...wsValsArr)
      console.log(`maxYvalWS==> ${maxYvalWS}`)

      var minYvalRtl = Math.min(...rtlValsArr)
      console.log(`minYvalRtl==> ${minYvalRtl}`)

      var maxYvalRtl = Math.max(...rtlValsArr)
      console.log(`maxYvalRtl==> ${maxYvalRtl}`)
      //^//Min & Max values for # of WS & Rtl items updated

      // var yWS = d3.scaleLinear()
      //   .domain([0, maxYaxisUpdtDmrctrWSandRtl]).nice()
      //   .range([xAxis_yValue, margin.top])

      var yRtl = d3.scaleLinear()
        .domain([0, maxYvalRtl]).nice()
        .range([xAxis_yValue, margin.top])

      var yAxisUpdateDemarcator = g => g
        .attr("transform", `translate(${timeScaleUpdateDemarcator(minWSdate)-10},0)`)
        .call(d3.axisLeft(yRtl))
        .call(g => g.select(".domain").remove())
        .call(g => g.select(".tick:last-of-type text").clone()
          .attr("x", 3)
          .attr("text-anchor", "start")
          .attr("font-weight", "bold")
          .text(rtlValsArr.yRtl))

      svg.append("g")
        .call(yAxisUpdateDemarcator)

      if (WsUpdateArr.length > 0) {
        for (let i = 0; i < WsUpdateArr.length; i++) {
          svg.append('line')
            .style("stroke", "lightgreen")
            .style("stroke-width", 1)
            .style("stroke-dasharray", ("3, 3"))
            .attr("x1", timeScaleUpdateDemarcator(WsUpdateArr[i]['date']))
            .attr("y1", xAxis_yValue)
            .attr("x2", timeScaleUpdateDemarcator(WsUpdateArr[i]['date']))
            .attr("y2", (xAxis_yValue) - maxYaxisUpdtDmrctrWSandRtl)

          svg.append('line')
            .style("stroke", "red")
            .style("stroke-width", 1)
            .style("stroke-dasharray", ("3, 3"))
            .attr("x1", timeScaleUpdateDemarcator(WsUpdateArr[i]['date']))
            .attr("y1", xAxis_yValue)
            .attr("x2", timeScaleUpdateDemarcator(WsUpdateArr[i]['date']))
            .attr("y2", (xAxis_yValue) - (WsUpdateArr[i]['items_updtd_ws'] * ((xAxis_yValue) / maxYaxisUpdtDmrctrWSandRtl)))
        }
      }


      if (RtlUpdateArr.length > 0) {
        for (let i = 0; i < RtlUpdateArr.length; i++) {
          svg.append('line')
            .style("stroke", "lightgreen")
            .style("stroke-width", 1)
            .attr("x1", timeScaleUpdateDemarcator(RtlUpdateArr[i]['date']))
            .attr("y1", xAxis_yValue)
            .attr("x2", timeScaleUpdateDemarcator(RtlUpdateArr[i]['date']))
            .attr("y2", (xAxis_yValue) - maxYvalRtl)

          svg.append('line')
            .style("stroke", "red")
            .style("stroke-width", 1)
            .attr("x1", timeScaleUpdateDemarcator(RtlUpdateArr[i]['date']))
            .attr("y1", 350)
            .attr("x2", timeScaleUpdateDemarcator(RtlUpdateArr[i]['date']))
            .attr("y2", (xAxis_yValue) - (RtlUpdateArr[i]['items_updtd_rtl'] * ((xAxis_yValue) / (xAxis_yValue + maxYvalRtl))))
        }
      }

    }
    //^//createLineChartT0d()////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    //v//connection.query()//////////////////////////////////////////////////////////////////////////////////////////////////////////////
    connection.query(`
    SELECT date, ${vendorName} FROM ois_venprof_mnth_copy2;
    SELECT * FROM rainbowcat_update_tracker;
    `, function (err, rows, fields) {
      if (err) throw err
      displayvenProf(rows)
        .then(updateDemarcator(rows))
        .then(createLineChartT0d())
        .then(writeHTMLfileAndRenderPage())
    })
    //^//connection.query()////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  })
}