var express = require('express');
var router = express.Router();

const mysql = require('mysql');
const connection = mysql.createConnection({
  host: process.env.RB_HOST,
  user: process.env.RB_USER,
  password: process.env.RB_PW,
  database: process.env.RB_DB
})

module.exports = {
  query_rb_inventory: router.post('/query_rb_inventory', (req, res, next) => {
    const query_rb_inventoryPostBody = req.body
    // console.log(`req.body==> ${req.body}`)
    let rb_inventoryQuery = query_rb_inventoryPostBody['query_rb_inventoryPost']
    console.log(`rb_inventoryQuery==> ${rb_inventoryQuery}`)

    let rb_inv_UPCs = []

    function show_rb_inv_UPCs(rows) {
      for (let i = 0; i < rows.length; i++) {
        rb_inv_UPCs.push(`${rows[i]['inv_upc']}`)
      }
      console.log('rows.length~~~>', rows.length)
    }


    let mySqlQuery = `${rb_inventoryQuery}`

    connection.query(mySqlQuery, function (err, rows, fields) {
      if (err) throw err
      console.log('rows==>', rows)
      // res.send(rows)
      show_rb_inv_UPCs(rows)

      res.render('vw-tsqlTableHub', {
        title: 'test to switch from mysql to tsql',
        rb_inv_UPCs: rb_inv_UPCs
      })
    })

  })
}