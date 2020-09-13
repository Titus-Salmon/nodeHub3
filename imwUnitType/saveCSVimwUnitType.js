const express = require('express')
const router = express.Router()
const fs = require('fs')

const sanitizerFuncs = require('../funcLibT0d/sanitizerFuncs')

module.exports = {

  saveCSVimwUnitType: router.post('/saveCSVimwUnitType', (req, res, next) => {

    const postBody = req.body
    let itemsToAdd = postBody['productArrayPost']
    console.log(`typeof itemsToAdd==> ${typeof itemsToAdd}`)
    console.log(`itemsToAdd.length==> ${itemsToAdd.length}`)
    // console.log(`itemsToAdd[0]==> ${itemsToAdd[0]}`)
    // console.log(`JSON.parse(itemsToAdd)==> ${JSON.parse(itemsToAdd)}`)
    let itemsToAddParsed = JSON.parse(itemsToAdd)

    // let saniRegex1 = /(\[)|(\])/g

    // let itemsToAddSani = itemsToAdd.replace(saniRegex1, "")
    // console.log(`JSON.parse(itemsToAdd)[0]==> ${JSON.parse(itemsToAdd)[0]}`)

    // let itemsToAddSaniParsed = JSON.parse(itemsToAddSani)
    // console.log(`JSON.stringify(itemsToAddSaniParsed)==> ${JSON.stringify(itemsToAddSaniParsed)}`)

    // let itemsToAddArr = []
    // let objectifiedItemsToAddArr = []

    // console.log(`typeof itemsToAdd==> ${typeof itemsToAdd}`)

    // function objectifyProductArr() {
    //   sanitizerFuncs.itemsToAddArrayGenerator(itemsToAdd, sanitizerFuncs.thingSanitizer, itemsToAddArr)
    //   sanitizerFuncs.objectifyImwProductArr(itemsToAddArr, objectifiedItemsToAddArr)
    // }

    //begin csv generator //////////////////////////////////////////////////////////////////////////
    const {
      Parser
    } = require('json2csv');

    const fields = [
      // "itemID", "deptID", "deptName", "recptAlias", "brand", "itemName", "size", "suggRtl", "lastCost", "basePrice", "autoDisco",
      // "idealMarg", "weightProf", "tax1", "tax2", "tax3", "specTndr1", "specTndr2", "posPrompt", "location", "altID", "altRcptAlias",
      // "pkgQty", "suppUnitID", "suppID", "unit", "numPkgs", "category", "subCtgry", "prodGroup", "prodFlag", "rbNote", "ediDefault",
      // "pwrfld7", "tmpGroup", "onhndQty", "reorderPt", "mcl", "reorderQty", "memo", "flrRsn", "dsd", "discoMult", "csPkMlt", "ovr"
      "item_id", "dept_id", "dept_name", "recpt_alias", "brand", "item_name", "size", "sugg_retail", "last_cost", "base_price", "auto_discount",
      "ideal_margin", "weight_profile", "tax1", "tax2", "tax3", "spec_tndr1", "spec_tndr2", "pos_prompt", "location", "alternate_id", "alt_rcpt_alias",
      "pkg_qty", "supp_unit_id", "supplier_id", "unit", "num_pkgs", "category", "sub_category", "product_group", "product_flag", "rb_note", "edi_default",
      "powerfield_7", "temp_group", "onhand_qty", "reorder_point", "mcl", "reorder_qty", "memo", "flrRsn", "dsd", "disc_mult", "case_pk_mult", "ovr"
    ];
    const opts = {
      fields,
      // excelStrings: true,
      // header: false
      quote: '', //whatever is inside the '' will be use as your quote character, so this removes all quotes from CSV
      // quote: '"'
    };

    try {
      // objectifyProductArr()
      // console.log('objectifiedItemsToAddArr from json2csv======>>', objectifiedItemsToAddArr)
      const parser = new Parser(opts);
      // const csv = parser.parse(objectifiedItemsToAddArr);
      const csv = parser.parse(itemsToAddParsed);
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