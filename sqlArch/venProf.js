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

    // jsdom.env({
    //   features: {
    //     QuerySelector: true
    //   },
    //   html: htmlStub,
    //   done: function (errors, window) {
    //     // this callback function pre-renders the dataviz inside the html document, then export result into a static file

    //     var el = window.document.querySelector('#dataviz-container'),
    //       body = window.document.querySelector('body'),
    //       circleId = 'a2324' // say, this value was dynamically retrieved from some database

    //     // generate the dataviz
    //     d3.select(el)
    //       .append('svg:svg')
    //       .attr('width', 600)
    //       .attr('height', 300)
    //       .append('circle')
    //       .attr('cx', 300)
    //       .attr('cy', 150)
    //       .attr('r', 30)
    //       .attr('fill', '#26963c')
    //       .attr('id', circleId) // say, this value was dynamically retrieved from some database

    //     // make the client-side script manipulate the circle at client side)
    //     var clientScript = "d3.select('#" + circleId + "').transition().delay(1000).attr('fill', '#f9af26')"

    //     d3.select(body)
    //       .append('script')
    //       .html(clientScript)

    //     // save result in an html file, we could also keep it in memory, or export the interesting fragment into a database for later use
    //     var svgsrc = window.document.innerHTML
    //     fs.writeFile(process.cwd() + '/views/inserts/venProfResults.html', svgsrc, function (err) {
    //       if (err) {
    //         console.log('error saving document', err)
    //       } else {
    //         console.log('The file was saved!')
    //         res.render('vw-venProf', {
    //           title: `Monthly profits by vendor: ${vendorName}`,
    //           venProfArrDisplay: venProfArr,
    //         })
    //       }
    //     })
    //   } // end jsDom done callback
    // })

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

    const jsdomT0d = new JSDOM(`<!DOCTYPE html><div id="dataviz-container"></div>`, {
      runScripts: "dangerously"
    })
    console.log(`jsdomT0d==> ${jsdomT0d}`)
    const myLibrary = fs.readFileSync(`${process.cwd()}/jsDomScriptsT0d/jsdomScript1.js`, {
      encoding: "utf-8"
    })
    const jsdomScriptElement = jsdomT0d.window.document.createElement("script")
    jsdomScriptElement.textContent = myLibrary
    jsdomT0d.document.body.appendChild(jsdomScriptElement)

    // //v////d3/jsdom stuff////////////////////////////////////////////////////////
    // const jsdomT0d = new JSDOM(``, { runScripts: "dangerously" })
    // jsdom.env({
    //   features: {
    //     QuerySelector: true
    //   },
    //   html: htmlStub,
    //   done: function (errors, window) {
    //     // this callback function pre-renders the dataviz inside the html document, then export result into a static file

    //     var el = window.document.querySelector('#dataviz-container'),
    //       body = window.document.querySelector('body'),
    //       circleId = 'a2324' // say, this value was dynamically retrieved from some database

    //     // generate the dataviz
    //     d3.select(el)
    //       .append('svg:svg')
    //       .attr('width', 600)
    //       .attr('height', 300)
    //       .append('circle')
    //       .attr('cx', 300)
    //       .attr('cy', 150)
    //       .attr('r', 30)
    //       .attr('fill', '#26963c')
    //       .attr('id', circleId) // say, this value was dynamically retrieved from some database

    //     // make the client-side script manipulate the circle at client side)
    //     var clientScript = "d3.select('#" + circleId + "').transition().delay(1000).attr('fill', '#f9af26')"

    //     d3.select(body)
    //       .append('script')
    //       .html(clientScript)

    //     // save result in an html file, we could also keep it in memory, or export the interesting fragment into a database for later use
    //     var svgsrc = window.document.innerHTML
    //     fs.writeFile(process.cwd() + '/views/inserts/venProfResults.html', svgsrc, function (err) {
    //       if (err) {
    //         console.log('error saving document', err)
    //       } else {
    //         console.log('The file was saved!')
    //         res.render('vw-venProf', {
    //           title: `Monthly profits by vendor: ${vendorName}`,
    //           venProfArrDisplay: venProfArr,
    //         })
    //       }
    //     })
    //   } // end jsDom done callback
    // })
    // //^////d3/jsdom stuff////////////////////////////////////////////////////////

  })
}