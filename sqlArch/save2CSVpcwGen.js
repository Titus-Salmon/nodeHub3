var express = require('express');
var router = express.Router();

const fs = require('fs')

const cacheMainStockFilter = require('../nodeCacheStuff/cache1')

module.exports = {
  save2CSVpcwGen: router.post('/save2CSVpcwGen', (req, res, next) => {

    console.log(`req.body['csvDataPost']==> ${req.body['csvDataPost']}`)
    console.log(`JSON.stringify(req.body['csvDataPost'])==> ${JSON.stringify(req.body['csvDataPost'])}`)
    console.log(`JSON.parse(req.body['csvDataPost'])==> ${JSON.parse(req.body['csvDataPost'])}`)

    let csvDataPostparsed = JSON.parse(req.body['csvDataPost'])

    //begin csv generator //////////////////////////////////////////////////////////////////////////
    const {
      Parser
    } = require('json2csv')

    const fields = [
      'ItemID', 'ReceiptAlias', 'ItemTagsQty', 'ShelfLabelsQty', 'SignsQty', 'PL1PromptForPrice', 'PL1AdjustedPrice', 'PL1AutoDiscount',
      'PL1CountTowardsQtyOnly', 'PL1NoManualDiscounts', 'PL2PromptForPrice', 'PL2AdjustedPrice', 'PL2AutoDiscount', 'PL2CountTowardsQtyOnly',
      'PL2NoManualDiscounts', 'PL3PromptForPrice', 'PL3AdjustedPrice', 'PL3AutoDiscount', 'PL3CountTowardsQtyOnly', 'PL3NoManualDiscounts',
      'PL4PromptForPrice', 'PL4AdjustedPrice', 'PL4AutoDiscount', 'PL4CountTowardsQtyOnly', 'PL4NoManualDiscounts', 'PL1PricingDivider',
      'PL2PricingDivider', 'PL3PricingDivider', 'PL4PricingDivider'
      // 'ItemID', 'ReceiptAlias', 'ItemTagsQty', 'ShelfLabelsQty', 'SignsQty', 'PL1PromptForPrice', 'PL1AdjustedPrice', 'PL1AutoDiscount',
      // 'PL1CountTowardsQtyOnly', 'PL1NoManualDiscounts', 'PL2PromptForPrice', 'PL2AdjustedPrice', 'PL2AutoDiscount', 'PL2CountTowardsQtyOnly',
      // 'PL2NoManualDiscounts', 'PL3PromptForPrice', 'PL3AdjustedPrice', 'PL3AutoDiscount', 'PL3CountTowardsQtyOnly', 'PL3NoManualDiscounts',
      // 'PL4PromptForPrice', 'PL4AdjustedPrice', 'PL4AutoDiscount', 'PL4CountTowardsQtyOnly', 'PL4NoManualDiscounts'
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

    res.render('vw-signFilterChecker', {
      title: `<<${process.cwd()}/public/csv-to-insert/${req.body['csvPost']} SAVED>>`
    })
  })
}