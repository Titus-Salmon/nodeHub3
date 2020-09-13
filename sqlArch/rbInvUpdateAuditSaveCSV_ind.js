var express = require('express');
var router = express.Router();

const fs = require('fs')

module.exports = {
  rbInvUpdateAuditSaveCSV_ind: router.post('/rbInvUpdateAuditSaveCSV_ind', (req, res, next) => {

    console.log(`req.body['csvDataPost'][0]==> ${req.body['csvDataPost'][0]}`)
    console.log(`JSON.stringify(req.body['csvDataPost'][0])==> ${JSON.stringify(req.body['csvDataPost'][0])}`)
    console.log(`JSON.parse(req.body['csvDataPost'])==> ${JSON.parse(req.body['csvDataPost'])}`)

    let csvDataPostparsed = JSON.parse(req.body['csvDataPost'])

    //begin csv generator //////////////////////////////////////////////////////////////////////////
    const {
      Parser
    } = require('json2csv')

    const fields = [
      'ri_t0d', 'new_inv_upc', 'new_inv_name', 'new_inv_ind_stock', 'old_inv_ind_stock'
    ]

    const opts = {
      fields
    }

    try {
      const parser = new Parser(opts);
      console.log(`req.body['csvDataPost'][0]==>${req.body['csvDataPost'][0]}`)
      const csv = parser.parse(csvDataPostparsed)
      console.log(`csv==> ${csv}`)
      console.log('csv.length=====>>', csv.length);
      fs.writeFile(process.cwd() + '/public/csv-to-insert/' + req.body['csvPost'] + '.csv', csv, function (err) {
        if (err) throw err;
        console.log('~~~~~>>' + req.body['csvPost'] + 'saved<<~~~~~')
      })
    } catch (err) {
      console.error(err);
    }
    //end csv generator //////////////////////////////////////////////////////////////////////////

    res.render('vw-rbInvUpdater', {
      title: `<<${process.cwd()}/public/csv-to-insert/${req.body['csvPost']} SAVED>>`
    })
  })
}