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

var htmlStub = `<div id="dataviz-container"></div>` // html file skull with a container div for the d3 dataviz


module.exports = {
  venProf: router.post('/venProf', (req, res, next) => {

    let vendorName = req.body['vendorNamePost']
    console.log(`vendorName==> ${vendorName}`)

    let venProfArr = []

    function displayvenProf(rows) {
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
    }


    connection.query(`
    SELECT date, ${vendorName} FROM ois_venprof_mnth
    `, function (err, rows, fields) {
      if (err) throw err
      console.log(`rows.length==>${rows.length}`)
      console.log('rows[0]==>', rows[0])
      // console.log(`rows[0]['invScanCode']==>${rows[0]['invScanCode']}`)
      // console.log(`rows[0]['invName']==>${rows[0]['invName']}`)
      // console.log('rows==>', rows)
      // res.send(rows)
      displayvenProf(rows)

      // res.render('vw-venProf', {
      //   title: `Monthly profits by vendor: ${vendorName}`,
      //   venProfArr: venProfArr,
      // })
    })


    const jsdomT0d = new JSDOM(`<!DOCTYPE html><body><div id="dataviz-container"></div></body>`)

    var el = jsdomT0d.window.document.querySelector('#dataviz-container'),
      // body = jsdomT0d.window.document.querySelector('body'),
      circleId = 'a2324' // say, this value was dynamically retrieved from some database

    let width = 1000
    let height = 500

    let margin = ({
      top: 20,
      right: 30,
      bottom: 30,
      left: 40
    })

    let x = d3.scaleUtc()
      .domain(d3.extent(venProfArr, d => d.date))
      .range([margin.left, width - margin.right])

    let y = d3.scaleLinear()
      .domain([0, d3.max(venProfArr, d => d.value)]).nice()
      .range([height - margin.bottom, margin.top])

    let line = d3.line()
      .defined(d => !isNaN(d.value))
      .x(d => x(d.date))
      .y(d => y(d.value))

    let xAxis = g => g
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0))

    let yAxis = g => g
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y))
      .call(g => g.select(".domain").remove())
      .call(g => g.select(".tick:last-of-type text").clone()
        .attr("x", 3)
        .attr("text-anchor", "start")
        .attr("font-weight", "bold")
        .text(venProfArr.y))

    d3.select(el)
      .append('svg:svg')
      .attr("viewBox", [0, 0, width, height])
      .append("g")
      .call(xAxis)
      .append("g")
      .call(yAxis)
      .append("path")
      .datum(venProfArr)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("d", line)

    // let height = 500

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

    var svgsrc = jsdomT0d.window.document.documentElement.innerHTML
    fs.writeFile(`${process.cwd()}/views/includes/venProfResults.html`, svgsrc, function (err) {
      if (err) {
        console.log('error saving document', err)
      } else {
        console.log('The file was saved!')
        console.log(`jsdomT0d==> ${jsdomT0d}`)
        console.log(`JSON.stringify(jsdomT0d)==> ${JSON.stringify(jsdomT0d)}`)
        res.render('vw-venProf', {
          title: `Monthly profits by vendor: ${vendorName}`,
          venProfArrDisplay: venProfArr,
        })
      }
    })

  })
}