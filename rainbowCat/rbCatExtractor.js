var express = require('express');
var router = express.Router();

const mysql = require('mysql');

const connection = mysql.createConnection(process.env.RAINBOWCAT_CONNECTION_STRING);
// connection.connect();


module.exports = {
  rbCatExtractor: router.post('/rbCatExtractor', (req, res, next) => {
    const rbCatExtractorPostBody = req.body
    // console.log(`req.body==> ${req.body}`)
    let rainbowCatQuery = rbCatExtractorPostBody['rbCatExtractorPost']
    console.log(`rainbowCatQuery==> ${rainbowCatQuery}`)

    var ongDisco

    function ongDiscoExtractor(rows) {
      if (rows[0]) {
        ongDisco = rows[0]['ongDisco'] / 100
      }
    }

    let mySqlQuery = `${rainbowCatQuery}`

    connection.query(mySqlQuery, function (err, rows, fields) {
      if (rows !== undefined) {
        console.log('rows==>', rows)
        ongDiscoExtractor(rows)
      }
      if (err) {
        throw err
      }
    }).on('end', function () {

      if (ongDisco == undefined) {
        console.log(`rainbowCatQuery==> ${rainbowCatQuery}`)
        console.log(`ongDisco==> ${ongDisco}`)
        res.render('vw-rainbowCatTableHub', {
          title: `THERE WAS LIKELY AN ECONNRESET ERROR TRY EXTRACTING DATA AGAIN`
        })
      } else {
        res.render('vw-MysqlTableHub', {
          title: `Extracted data from Heroku rainbow--cat <<${ongDisco}>>`,
          ongDisco: ongDisco
        })
      }
    })
  })
}