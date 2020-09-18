var express = require('express');
var router = express.Router();

const mysql = require('mysql');
const connection = mysql.createConnection({
  host: process.env.RB_HOST,
  user: process.env.RB_USER,
  password: process.env.RB_PW,
  database: process.env.RB_DB
})

const venProfArrCache = require('../nodeCacheStuff/cache1')

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

    async function displayvenProf(rows) {
      for (let i = 0; i < rows.length; i++) {
        let venProfObj = {}
        venProfObj['ri_t0d'] = i + 1
        venProfObj['date'] = rows[i]['date']
        venProfObj['kehe'] = rows[i]['kehe']

        venProfArr.push(venProfObj)
      }
      venProfArrCache.set('venProfArrCache_key', venProfArr)
      console.log('rows.length~~~>', rows.length)
      // console.log(`Object.keys(rows)==>${Object.keys(rows)}`)
      console.log(`Object.keys(rows[0])==>${Object.keys(rows[0])}`)
      console.log(`JSON.stringify(venProfArr) from displayvenProf()==> ${JSON.stringify(venProfArr)}`)
    }


    connection.query(`
    SELECT date, ${vendorName} FROM ois_venprof_mnth_copy2
    `, function (err, rows, fields) {
      if (err) throw err
      console.log(`rows.length==>${rows.length}`)
      console.log('rows[0]==>', rows[0])
      displayvenProf(rows).then(createLineChartT0d()).then(writeHTMLfileAndRenderPage())

      // res.render('vw-venProf', {
      //   title: `Monthly profits by vendor: ${vendorName}`,
      //   venProfArr: venProfArr,
      // })
    })

    console.log(`JSON.stringify(venProfArr)==> ${JSON.stringify(venProfArr)}`)

    const jsdomT0d = new JSDOM(`<!DOCTYPE html><body><div id="dataviz-container" style="margin: 20px 20px 150px 20px"></div></body>`)

    var el = jsdomT0d.window.document.querySelector('#dataviz-container')

    async function writeHTMLfileAndRenderPage() {
      var svgsrc = jsdomT0d.window.document.documentElement.innerHTML
      console.log(`jsdomT0d.window.document.documentElement.innerHTML==> ${JSON.stringify(jsdomT0d.window.document.documentElement.innerHTML)}`)
      console.log(`svgsrc==> ${svgsrc}`)
      fs.writeFile(`${process.cwd()}/views/includes/venProfResults.html`, svgsrc, function (err) {
        if (err) {
          console.log('error saving document', err)
        } else {
          console.log('The file was saved!')
          console.log(`JSON.stringify(venProfArr) from writeHTMLfileAndRenderPage()==> ${JSON.stringify(venProfArr)}`)
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

      // var data = venProfArr
      console.log(`JSON.stringify(venProfArr) from createLineChartT0d()==> ${JSON.stringify(venProfArr)}`)

      // var x = d3.scaleLinear()
      //   .domain(d3.extent(venProfArr, d => d.date)).nice()
      //   .range([margin.left, width - margin.right])
      // console.log(`x==> ${x}`)

      var x = d3.scaleUtc()
        .domain(d3.extent(venProfArr, d => d.date))
        .range([margin.left, width - margin.right])
      console.log(`x==> ${x}`)

      var y = d3.scaleLinear()
        .domain([0, d3.max(venProfArr, d => d.kehe)]).nice()
        .range([height - margin.bottom, margin.top])
      console.log(`y==> ${y}`)

      var line = d3.line()
        .defined(d => !isNaN(d.kehe))
        .x(d => x(d.date))
        .y(d => y(d.kehe))
      console.log(`line==> ${line}`)

      var xAxis = g => g
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0))
      console.log(`xAxis==> ${xAxis}`)

      var yAxis = g => g
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y))
        .call(g => g.select(".domain").remove())
        .call(g => g.select(".tick:last-of-type text").clone()
          .attr("x", 3)
          .attr("text-anchor", "start")
          .attr("font-weight", "bold")
          .text(venProfArr.y))
      console.log(`yAxis==> ${yAxis}`)

      const svg = d3.select(el)
        .append('svg')
        .attr("viewBox", [0, 0, width, height]);

      svg.append("g")
        .call(xAxis);

      svg.append("g")
        .call(yAxis);

      svg.append("path")
        .datum(venProfArr)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("d", line);

      console.log(`JSON.stringify(venProfArr) from createLineChartT0d()==> ${JSON.stringify(venProfArr)}`)
    }
  })
}