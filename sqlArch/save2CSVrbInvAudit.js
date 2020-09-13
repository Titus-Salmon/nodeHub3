var express = require('express');
var router = express.Router();

const fs = require('fs')

const cacheMainRbInvAudit = require('../nodeCacheStuff/cache1')

module.exports = {
  save2CSVrbInvAudit: router.post('/save2CSVrbInvAudit', (req, res, next) => {

    console.log(`req.body['csvDataPost']==> ${req.body['csvDataPost']}`)
    console.log(`JSON.stringify(req.body['csvDataPost'])==> ${JSON.stringify(req.body['csvDataPost'])}`)
    console.log(`JSON.parse(req.body['csvDataPost'])==> ${JSON.parse(req.body['csvDataPost'])}`)

    let csvDataPostparsed = JSON.parse(req.body['csvDataPost'])
    // console.log(`csvDataPostparsed==> ${csvDataPostparsed}`)
    // console.log(`JSON.parse(csvDataPostparsed)==> ${JSON.parse(csvDataPostparsed)}`)
    // console.log(`csvDataPostparsed[0]==> ${csvDataPostparsed[0]}`)
    // console.log(`JSON.stringify(csvDataPostparsed[0])==> ${JSON.stringify(csvDataPostparsed[0])}`)
    // console.log(`csvDataPostparsed[0][0]==> ${csvDataPostparsed[0][0]}`)
    // console.log(`csvDataPostparsed[0][0]['ri_t0d']==> ${csvDataPostparsed[0][0]['ri_t0d']}`)
    // console.log(`JSON.stringify(csvDataPostparsed[0][0])==> ${JSON.stringify(csvDataPostparsed[0][0])}`)

    // console.log(`JSON.stringify(req.body['csvDataPost'])==>${JSON.stringify(req.body['csvDataPost'])}`)

    // let searchResultsCache = cacheMainRbInvAudit['data']['searchResultsCache_key']['v']

    //begin csv generator //////////////////////////////////////////////////////////////////////////
    const {
      Parser
    } = require('json2csv')

    const fields = [
      // 'INDstocked', 'IND_NOTstocked', 'SMstocked', 'SM_NOTstocked', 'MTstocked',
      // 'MT_NOTstocked', 'SHstocked', 'SH_NOTstocked', 'GLstocked', 'GL_NOTstocked'
      'ri_t0dIND', 'new_inv_upcIND', 'new_inv_nameIND', 'new_inv_in_stockIND', 'old_inv_in_stockIND',
      'ri_t0dSM', 'new_inv_upcSM', 'new_inv_nameSM', 'new_inv_sm_stockSM', 'old_inv_sm_stockSM',
      'ri_t0dMT', 'new_inv_upcMT', 'new_inv_nameMT', 'new_inv_mt_stockMT', 'old_inv_mt_stockMT',
      'ri_t0dSH', 'new_inv_upcSH', 'new_inv_nameSH', 'new_inv_sh_stockSH', 'old_inv_sh_stockSH',
      'ri_t0dGL', 'new_inv_upcGL', 'new_inv_nameGL', 'new_inv_gl_stockGL', 'old_inv_gl_stockGL',
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

    res.render('vw-rbInvUpdater', {
      title: `<<${process.cwd()}/public/csv-to-insert/${req.body['csvPost']} SAVED>>`
    })
  })
}