const express = require('express')
const router = express.Router()
const fs = require('fs')

const sanitizerFuncs = require('../funcLibT0d/sanitizerFuncs')

module.exports = {

  saveProdArrAsCSV: router.post('/saveProdArrAsCSV', (req, res, next) => {

    const postBody = req.body
    let itemsToAdd = postBody['productArrayPost']
    let itemsToAddArr = []
    let objectifiedItemsToAddArr = []

    console.log(`typeof itemsToAdd==> ${typeof itemsToAdd}`)

    function objectifyProductArr() {
      sanitizerFuncs.itemsToAddArrayGenerator(itemsToAdd, sanitizerFuncs.thingSanitizer, itemsToAddArr)
      sanitizerFuncs.objectifyImwProductArr(itemsToAddArr, objectifiedItemsToAddArr)
    }

    //begin csv generator //////////////////////////////////////////////////////////////////////////
    const {
      Parser
    } = require('json2csv');

    const fields = [
      // "itemID", "deptID", "deptName", "recptAlias", "brand", "itemName", "size", "suggRtl", "lastCost", "basePrice", "autoDisco",
      // "discoMult", "idealMarg", "weightProf", "tax1", "tax2", "tax3", "specTndr1", "specTndr2", "posPrompt", "location", "altID",
      // "altRcptAlias", "pkgQty", "suppUnitID", "suppID", "unit", "numPkgs", "dsd", "csPkMlt", "ovr", "category", "subCtgry", "prodGroup",
      // "prodFlag", "rbNote", "ediDefault", "pwrfld7", "tmpGroup", "onhndQty", "reorderPt", "mcl", "reorderQty"
      "itemID", "deptID", "deptName", "recptAlias", "brand", "itemName", "size", "suggRtl", "lastCost", "basePrice", "autoDisco",
      "idealMarg", "weightProf", "tax1", "tax2", "tax3", "specTndr1", "specTndr2", "posPrompt", "location", "altID", "altRcptAlias",
      "pkgQty", "suppUnitID", "suppID", "unit", "numPkgs", "category", "subCtgry", "prodGroup", "prodFlag", "rbNote", "ediDefault",
      "pwrfld7", "tmpGroup", "onhndQty", "reorderPt", "mcl", "reorderQty", "memo", "flrRsn", "dsd", "discoMult", "csPkMlt", "ovr"
    ];
    const opts = {
      fields,
      // excelStrings: true,
      // header: false
      quote: '', //whatever is inside the '' will be use as your quote character, so this removes all quotes from CSV
      // quote: '"'
    };

    try {
      objectifyProductArr()
      console.log('objectifiedItemsToAddArr from json2csv======>>', objectifiedItemsToAddArr)
      const parser = new Parser(opts);
      const csv = parser.parse(objectifiedItemsToAddArr);
      // csvContainer.push(csv);
      console.log('csv_T0d=====>>', csv);
      fs.writeFile(process.cwd() + '/public/csv/' + req.body['csvPost'] + '.csv', csv, function (err) {
        if (err) throw err;
        console.log('~~~~~>>' + req.body['csvPost'] + 'saved<<~~~~~')
      })
    } catch (err) {
      console.error(err);
    }
    //end csv generator //////////////////////////////////////////////////////////////////////////

    // res.render('vw-imwGenerator', {
    //   title: `vw-imwGenerator`,
    //   imwProductValObj: imwProductValObj,
    //   imwProductArr: imwProductArr,
    //   objectifiedImwProdArr: objectifiedImwProdArr
    // })

    res.render('vw-MySqlTableHub', {
      title: `<<${process.cwd()}/public/csv/${req.body['csvPost']} SAVED>>`
    })

  })
}