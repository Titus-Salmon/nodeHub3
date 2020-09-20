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


module.exports = {
  venProf: router.post('/venProf', (req, res, next) => {

    let vendorName = req.body['vendorNamePost']
    console.log(`vendorName==> ${vendorName}`)

    let venProfArr = []
    let updateDemarcatorArr = []
    let WsUpdateArr = []
    let WsDateOnlyArr = []
    let RtlUpdateArr = []

    let wsPlusRtlItemsArr = []

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
        // let edi_vend_name = rainbowcat_update_tracker_rows[i]['edi_vendor_name']
        if (rainbowcat_update_tracker_rows[i]['wsImw'] !== null &&
          rainbowcat_update_tracker_rows[i]['edi_vendor_name'].toLowerCase() == `edi-${vendorName.toLowerCase()}`) {
          WsUpdateArr.push(updateDemarcatorObj)
        }

        if (rainbowcat_update_tracker_rows[i]['rtlImw'] !== null &&
          rainbowcat_update_tracker_rows[i]['edi_vendor_name'].toLowerCase() == `edi-${vendorName.toLowerCase()}`) {
          RtlUpdateArr.push(updateDemarcatorObj)
        }
      }
      // venProfArrCache.set('venProfArrCache_key', venProfArr)
      console.log('rainbowcat_update_tracker_rows.length~~~>', rainbowcat_update_tracker_rows.length)
      console.log(`Object.keys(rainbowcat_update_tracker_rows)==>${Object.keys(rainbowcat_update_tracker_rows)}`)
      // console.log(`JSON.stringify(updateDemarcatorArr) from updateDemarcator()==> ${JSON.stringify(updateDemarcatorArr)}`)

      console.log(`JSON.stringify(WsUpdateArr)==> ${JSON.stringify(WsUpdateArr)}`)
      console.log(`JSON.stringify(RtlUpdateArr)==> ${JSON.stringify(RtlUpdateArr)}`)
    }


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

    const jsdomT0d = new JSDOM(`<!DOCTYPE html><body><div id="dataviz-container"></div></body>`)

    var el = jsdomT0d.window.document.querySelector('#dataviz-container')

    async function writeHTMLfileAndRenderPage() {
      var svgsrc = jsdomT0d.window.document.documentElement.innerHTML
      // console.log(`jsdomT0d.window.document.documentElement.innerHTML==> ${JSON.stringify(jsdomT0d.window.document.documentElement.innerHTML)}`)
      // console.log(`svgsrc==> ${svgsrc}`)
      fs.writeFile(`${process.cwd()}/views/includes/venProfResults.html`, svgsrc, function (err) {
        if (err) {
          console.log('error saving document', err)
        } else {
          console.log('The file was saved!')
          // console.log(`JSON.stringify(venProfArr) from writeHTMLfileAndRenderPage()==> ${JSON.stringify(venProfArr)}`)
          res.render('vw-venProf', {
            title: `Monthly profits by vendor: ${vendorName}`,
            venProfArrDisplay: venProfArr,
          })
        }
      })
    }


    async function createLineChartT0d() {

      var width = 1000
      var height = 500

      var margin = ({
        top: 20,
        right: 30,
        bottom: 150,
        left: 50
      })

      // console.log(`JSON.stringify(venProfArr) from createLineChartT0d()==> ${JSON.stringify(venProfArr)}`)

      // var x = d3.scaleLinear()
      //   .domain(d3.extent(venProfArr, d => d.date)).nice()
      //   .range([margin.left, width - margin.right])
      // console.log(`x==> ${x}`)

      var x = d3.scaleUtc()
        .domain(d3.extent(venProfArr, d => d.date))
        .range([margin.left, width - margin.right])
      // console.log(`x==> ${x}`)

      // var xWS = d3.scaleUtc()
      //   .domain(d3.extent(updateDemarcatorArr, d => d.date))
      //   .range([margin.left, width - margin.right])
      // console.log(`xWS==> ${xWS}`)

      var y = d3.scaleLinear()
        .domain([0, d3.max(venProfArr, d => d.kehe)]).nice()
        .range([height - margin.bottom, margin.top])
      // console.log(`y==> ${y}`)

      var yWS = d3.scaleLinear()
        .domain([0, d3.max(WsUpdateArr, d => d.items_updtd_ws)]).nice()
        .range([height - margin.bottom, margin.top])
      // console.log(`yWS==> ${yWS}`)

      var line = d3.line()
        .defined(d => !isNaN(d.kehe))
        .x(d => x(d.date))
        .y(d => y(d.kehe))
      // console.log(`line==> ${line}`)

      // var lineWSupdate = d3.line()
      //   .defined(d => !isNaN(d.height))
      //   .x(d => xWS(d.date))
      //   .y(d => yWS(d.height))
      // console.log(`lineWSupdate==> ${lineWSupdate}`)

      var xAxis = g => g
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0))
      // console.log(`xAxis==> ${xAxis}`)

      var yAxis = g => g
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y))
        .call(g => g.select(".domain").remove())
        .call(g => g.select(".tick:last-of-type text").clone()
          .attr("x", 3)
          .attr("text-anchor", "start")
          .attr("font-weight", "bold")
          .text(venProfArr.y))
      // console.log(`yAxis==> ${yAxis}`)

      const svg = d3.select(el)
        .append('svg')
        .attr("viewBox", [0, 0, width, height]);

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

      console.log(`timeScaleUpdateDemarcator(updateDemarcatorArr[40]['date'])==> ${timeScaleUpdateDemarcator(updateDemarcatorArr[40]['date'])}`)

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

      var minYaxisUpdtDmrctr = Math.min(...wsPlusRtlItemsArr)
      console.log(`minYaxisUpdtDmrctr==> ${minYaxisUpdtDmrctr}`)

      var mmaxYaxisUpdtDmrctr = Math.max(...wsPlusRtlItemsArr)
      console.log(`mmaxYaxisUpdtDmrctr==> ${mmaxYaxisUpdtDmrctr}`)


      var yAxisUpdateDemarcator = g => g
        .attr("transform", `translate(${timeScaleUpdateDemarcator(minWSdate)-10},0)`)
        .call(d3.axisLeft(y))
        .call(g => g.select(".domain").remove())
        .call(g => g.select(".tick:last-of-type text").clone()
          .attr("x", 3)
          .attr("text-anchor", "start")
          .attr("font-weight", "bold")
          .text(WsUpdateArr.yWS))

      svg.append("g")
        .call(yAxisUpdateDemarcator)

      if (WsUpdateArr.length > 0) {
        for (let i = 0; i < WsUpdateArr.length; i++) {
          svg.append('line')
            .style("stroke", "lightgreen")
            .style("stroke-width", 1)
            .style("stroke-dasharray", ("3, 3"))
            .attr("x1", timeScaleUpdateDemarcator(WsUpdateArr[i]['date']))
            .attr("y1", 10)
            .attr("x2", timeScaleUpdateDemarcator(WsUpdateArr[i]['date']))
            .attr("y2", 350)
        }
      }


      if (RtlUpdateArr.length > 0) {
        for (let i = 0; i < RtlUpdateArr.length; i++) {
          svg.append('line')
            .style("stroke", "lightgreen")
            .style("stroke-width", 1)
            .attr("x1", timeScaleUpdateDemarcator(RtlUpdateArr[i]['date']))
            .attr("y1", 10)
            .attr("x2", timeScaleUpdateDemarcator(RtlUpdateArr[i]['date']))
            .attr("y2", 350)
        }
      }

      // console.log(`JSON.stringify(venProfArr) from createLineChartT0d()==> ${JSON.stringify(venProfArr)}`)
    }
  })
}