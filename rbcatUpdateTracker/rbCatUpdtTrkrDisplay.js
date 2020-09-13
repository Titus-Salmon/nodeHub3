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
  rbCatUpdtTrkrDisplay: router.post('/rbCatUpdtTrkrDisplay', (req, res, next) => {
    const rbCatUpdtTrkrDisplayPostBody = req.body
    // console.log(`req.body==> ${req.body}`)
    let rbCUTquery = rbCatUpdtTrkrDisplayPostBody['rbCatUpdtTrkrDisplayPost']
    console.log(`rbCUTquery==> ${rbCUTquery}`)

    let rbCatUpdtTrkrDisplayArr = []
    rbCatUpdtTrkrDisplayArr4xls = []

    // function dateFixer(dateToFix) {
    //   if (dateToFix.includes('T')) {
    //     console.log(`dateToFix that includes T==> ${dateToFix}`)
    //     let dateToFixSplit_T = dateToFix.split('T')
    //     let dateToFix = dateToFixSplit_T[0]
    //   }
    //   let dateToFixSplit = dateToFix.split('-')
    //   let dateToFixYear = dateToFixSplit[0]
    //   let dateToFixDay = dateToFixSplit[1]
    //   let dateToFixMonth = dateToFixSplit[2]
    //   fixedDate = `${dateToFixDay}/${dateToFixMonth}/${dateToFixYear}`
    //   console.log(`fixedDate from dateFixer()==> ${fixedDate}`)
    // }

    function displayRBcut(rows) {
      for (let i = 0; i < rows.length; i++) {
        let rbCUTobj = {}
        // dateFixer(rows[i]['date'])
        rbCUTobj['ri_t0d'] = i + 1
        rbCUTobj['date'] = rows[i]['date']
        rbCUTobj['edi_vendor_name'] = rows[i]['edi_vendor_name']
        rbCUTobj['wsImw'] = rows[i]['wsImw']
        rbCUTobj['rtlImw'] = rows[i]['rtlImw']
        rbCUTobj['items_updtd_ws'] = rows[i]['items_updtd_ws']
        rbCUTobj['items_updtd_rtl'] = rows[i]['items_updtd_rtl']
        rbCUTobj['note1'] = rows[i]['note1']

        rbCatUpdtTrkrDisplayArr.push(rbCUTobj)
        rbCatUpdtTrkrDisplayArr4xls.push(rbCUTobj)
      }
      console.log('rows.length~~~>', rows.length)
    }


    let mySqlQuery = `${rbCUTquery}`

    connection.query(mySqlQuery, function (err, rows, fields) {
      if (err) throw err
      console.log('rows==>', rows)
      // res.send(rows)
      displayRBcut(rows)

      res.render('vw-rbCatUpdtTrkr', {
        title: 'rainbowcat_update_tracker table Query Results',
        rbCatUpdtTrkrDisplay: rbCatUpdtTrkrDisplayArr
      })
    })

  })
}