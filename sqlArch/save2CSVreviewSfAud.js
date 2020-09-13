var express = require('express');
var router = express.Router();

const fs = require('fs')

module.exports = {
  save2CSVreviewSfAud: router.post('/save2CSVreviewSfAud', (req, res, next) => {

    console.log(`req.body['csvDataPost'][0]==>${req.body['csvDataPost'][0]}`)
    console.log(`JSON.parse(req.body['csvDataPost'])==>${JSON.parse(req.body['csvDataPost'])}`)

    //begin csv generator //////////////////////////////////////////////////////////////////////////
    const {
      Parser
    } = require('json2csv')

    const fields = [
      'ri_t0d', 'invMismatchUPC', 'invMismatchSKU', 'invMismatchName', 'invMismatchStore', 'invMismatchSFdata', 'invMismatchCPLTdata',
      'invMismatchLastRecd', 'invMismatchLastSold', 'LastRecd0_3', 'LastRecd3_6', 'LastRecd6_9', 'LastRecd9_12', 'LastRecd12plus', 'Comments1',
      'Comments2'
    ]

    const opts = {
      fields
    }

    try {
      // console.log('catapultTableArr[0] from json2csv======>>', catapultTableArr[0])
      const parser = new Parser(opts);
      // const csv = parser.parse(catapultTableArr);
      // const csv = parser.parse(catapultTables)
      // const csv = parser.parse(JSON.stringify(req.body['csvDataPost']))
      console.log(`req.body['csvDataPost'][0]==>${req.body['csvDataPost'][0]}`)
      const csv = parser.parse(JSON.parse(req.body['csvDataPost']))
      // csvContainer.push(csv);
      // console.log(`req.body-->${req.body}`)
      // console.log(`JSON.stringify(req.body)-->${JSON.stringify(req.body)}`)
      console.log(`JSON.stringify(req.body['csvDataPost'][0])-->${JSON.stringify(req.body['csvDataPost'][0])}`)
      console.log(`req.body['csvPost']-->${req.body['csvPost']}`)
      console.log('csv.length=====>>', csv.length);
      fs.writeFile(process.cwd() + '/public/csv-to-insert/' + req.body['csvPost'] + '.csv', csv, function (err) {
        if (err) throw err;
        console.log('~~~~~>>' + req.body['csvPost'] + 'saved<<~~~~~')
      })
    } catch (err) {
      console.error(err);
    }
    //end csv generator //////////////////////////////////////////////////////////////////////////

    res.render('vw-signFilterChecker', {
      title: `<<${process.cwd()}/public/csv-to-insert/${req.body['csvPost']} SAVED>>`
    })
  })
}