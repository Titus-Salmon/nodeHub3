var express = require('express');
var router = express.Router();

const mysql = require('mysql');

const connection = mysql.createConnection(process.env.RAINBOWCAT_CONNECTION_STRING);
// connection.connect();


module.exports = {
  rainbowCatDisplay: router.post('/rainbowCatDisplay', (req, res, next) => {
    const rainbowCatDisplayPostBody = req.body
    // console.log(`req.body==> ${req.body}`)
    let rainbowCatQuery = rainbowCatDisplayPostBody['rainbowCatDisplayPost']
    console.log(`rainbowCatQuery==> ${rainbowCatQuery}`)

    let rainbowCatDisplayArr = []

    function displayrainbowCat(rows) {
      for (let i = 0; i < rows.length; i++) {
        let rainbowCatObj = {}
        rainbowCatObj['ri_t0d'] = i + 1 //need to add 1 so mysql doesnt get confused by index 0
        rainbowCatObj['prim_key'] = rows[i]['prim_key']
        rainbowCatObj['vendorName'] = rows[i]['vendorName']
        rainbowCatObj['ediName'] = rows[i]['ediName']
        rainbowCatObj['issueDate'] = rows[i]['issueDate']
        rainbowCatObj['needNewCat'] = rows[i]['needNewCat']
        rainbowCatObj['updatedWLatest'] = rows[i]['updatedWLatest']
        rainbowCatObj['reporter'] = rows[i]['reporter']
        rainbowCatObj['comments'] = rows[i]['comments']
        rainbowCatObj['andrea'] = rows[i]['andrea']
        rainbowCatObj['vendorEmail'] = rows[i]['vendorEmail']
        rainbowCatObj['ongDisco'] = rows[i]['ongDisco']

        rainbowCatDisplayArr.push(rainbowCatObj)
      }
      console.log('rows.length~~~>', rows.length)
    }


    let mySqlQuery = `${rainbowCatQuery}`

    connection.query(mySqlQuery, function (err, rows, fields) {
      if (err) throw err
      console.log('rows==>', rows)
      // res.send(rows)
      displayrainbowCat(rows)

      res.render('vw-rainbowCatTableHub', {
        title: 'NodeHub rainbow--cat Query Results',
        rainbowCatDisplay: rainbowCatDisplayArr
      })
    })

  })
}