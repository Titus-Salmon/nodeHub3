var express = require('express');
var router = express.Router();

const fs = require('fs')

const cacheMainStockFilter = require('../nodeCacheStuff/cache1')

module.exports = {
  save2CSVstockfilter: router.post('/save2CSVstockfilter', (req, res, next) => {

    console.log(`req.body['csvDataPost']==> ${req.body['csvDataPost']}`)
    console.log(`JSON.stringify(req.body['csvDataPost'])==> ${JSON.stringify(req.body['csvDataPost'])}`)
    console.log(`JSON.parse(req.body['csvDataPost'])==> ${JSON.parse(req.body['csvDataPost'])}`)

    let csvDataPostparsed = JSON.parse(req.body['csvDataPost'])

    //begin csv generator //////////////////////////////////////////////////////////////////////////
    const {
      Parser
    } = require('json2csv')

    const fields = [
      'INDstocked', 'IND_NOTstocked', 'SMstocked', 'SM_NOTstocked', 'MTstocked',
      'MT_NOTstocked', 'SHstocked', 'SH_NOTstocked', 'GLstocked', 'GL_NOTstocked'
    ]

    const opts = {
      fields
    }

    try {
      const parser = new Parser(opts);
      console.log(`req.body['csvDataPost'][0]==>${req.body['csvDataPost'][0]}`)
      // const csv = parser.parse(JSON.parse(req.body['csvDataPost']))
      // const csv = parser.parse(csvDataPostparsed[0])
      const csv = parser.parse(csvDataPostparsed)
      console.log(`csv==> ${csv}`)

      // console.log(`JSON.stringify(req.body['csvDataPost'][0])-->${JSON.stringify(req.body['csvDataPost'][0])}`)
      // console.log(`req.body['csvPost']-->${req.body['csvPost']}`)
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