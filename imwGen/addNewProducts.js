const express = require('express')
const router = express.Router()

const mysql = require('mysql')
const querystring = require('querystring')

const sanitizerFuncs = require('../funcLibT0d/sanitizerFuncs')
const showSearchRes = require('../funcLibT0d/showSearchRes')
const remvItem = require('../funcLibT0d/removeItem')
const paginPost = require('../funcLibT0d/paginPost')

const connection = mysql.createConnection({ //for work use in RB DB
  host: process.env.RB_HOST,
  user: process.env.RB_USER,
  password: process.env.RB_PW,
  database: process.env.RB_DB,
  multipleStatements: true //MUST HAVE to make more than 1 sql statement in a single query
})

// const connection = mysql.createConnection({ //for home local testing
//   host: process.env.TEST_STUFF_T0D_HOST,
//   user: process.env.TEST_STUFF_T0D_USER,
//   password: process.env.TEST_STUFF_T0D_PW,
//   database: process.env.TEST_STUFF_T0D_DB,
//   multipleStatements: true //MUST HAVE to make more than 1 sql statement in a single query
// })

// const connection = mysql.createConnection({ //for work testing
//   host: process.env.NODEHUB_TEST1_HOST,
//   user: process.env.NODEHUB_TEST1_USER,
//   password: process.env.NODEHUB_TEST1_PW,
//   database: process.env.NODEHUB_TEST1_DB,
//   multipleStatements: true //MUST HAVE to make more than 1 sql statement in a single query
// })

const objKeyArr = [
  // "itemID", "deptID", "deptName", "recptAlias", "brand", "itemName", "size", "suggRtl", "lastCost", "basePrice", "autoDisco",
  // "discoMult", "idealMarg", "weightProf", "tax1", "tax2", "tax3", "specTndr1", "specTndr2", "posPrompt", "location", "altID",
  // "altRcptAlias", "pkgQty", "suppUnitID", "suppID", "unit", "numPkgs", "dsd", "csPkMlt", "ovr", "category", "subCtgry", "prodGroup",
  // "prodFlag", "rbNote", "ediDefault", "pwrfld7", "tmpGroup", "onhndQty", "reorderPt", "mcl", "reorderQty"
  "itemID", "deptID", "deptName", "recptAlias", "brand", "itemName", "size", "suggRtl", "lastCost", "basePrice", "autoDisco",
  "idealMarg", "weightProf", "tax1", "tax2", "tax3", "specTndr1", "specTndr2", "posPrompt", "location", "altID", "altRcptAlias",
  "pkgQty", "suppUnitID", "suppID", "unit", "numPkgs", "category", "subCtgry", "prodGroup", "prodFlag", "rbNote", "ediDefault",
  "pwrfld7", "tmpGroup", "onhndQty", "reorderPt", "mcl", "reorderQty", "memo", "flrRsn", "dsd", "discoMult", "csPkMlt", "ovr"
]

module.exports = {

  addNewProducts: router.post(`/addNewProducts`, (req, res, next) => {

    const postBody = req.body

    let itemID = postBody['itemIDPost']
    let deptID = postBody['deptIDPost']
    let deptName = postBody['deptNamePost']
    let recptAlias = postBody['recptAliasPost']
    let brand = postBody['brandPost']
    let itemName = postBody['itemNamePost']
    let size = postBody['sizePost']
    let suggRtl = postBody['suggRtlPost']
    let lastCost = postBody['lastCostPost']
    let basePrice = postBody['basePricePost']
    let autoDisco = postBody['autoDiscoPost']
    let idealMarg = postBody['idealMargPost']
    let weightProf = postBody['weightProfPost']
    let tax1 = postBody['tax1Post']
    let tax2 = postBody['tax2Post']
    let tax3 = postBody['tax3Post']
    let specTndr1 = postBody['specTndr1Post']
    let specTndr2 = postBody['specTndr2Post']
    let posPrompt = postBody['posPromptPost']
    let location = postBody['locationPost']
    let altID = postBody['altIDPost']
    let altRcptAlias = postBody['altRcptAliasPost']
    let pkgQty = postBody['pkgQtyPost']
    let suppUnitID = postBody['suppUnitIDPost']
    let suppID = postBody['suppIDPost']
    let unit = postBody['unitPost']
    let numPkgs = postBody['numPkgsPost']
    let category = postBody['categoryPost']
    let subCtgry = postBody['subCtgryPost']
    let prodGroup = postBody['prodGroupPost']
    let prodFlag = postBody['prodFlagPost']
    let rbNote = postBody['rbNotePost']
    let ediDefault = postBody['ediDefaultPost']
    let pwrfld7 = postBody['pwrfld7Post']
    let tmpGroup = postBody['tmpGroupPost']
    let onhndQty = postBody['onhndQtyPost']
    let reorderPt = postBody['reorderPtPost']
    let mcl = postBody['mclPost']
    let reorderQty = postBody['reorderQtyPost']

    let memo = postBody['memoPost']
    let flrRsn = postBody['flrRsnPost']

    let dsd = postBody['dsdPost']
    let discoMult = postBody['discoMultPost']
    let csPkMlt = postBody['csPkMltPost']
    let ovr = postBody['ovrPost']



    // let numQueryRes = parseInt(postBody['numQueryResPost'])
    // console.log(`numQueryRes==> ${numQueryRes}`)


    let itemListAccumulator = postBody['itemListAccumulatorPost']
    let imwProductValObj = {} //this holds product values (for one discrete product entry at a time) as an object;
    //it gets stringified & pushed to imwProductArr
    let imwProductArr = [] //this gets sent back to frontend input for itemListAccumulatorPost
    // var sanitizedThing
    let objectifiedImwProdArr = [] //we objectify imwProductArr so it can be easily displayed in the DOM template

    let tableName = postBody['tableNamePost']
    let srsObjArr = []

    let removeItem = postBody['removeItemPost']

    let pageLinkArray = []
    let numPagesPlaceholder = [] //holds the value for total number of pages; should only be one value

    // let currentPage = parseInt(postBody['currentPagePost'])
    // if (currentPage == undefined || isNaN(currentPage) == true) {
    //   currentPage = 0
    // }

    sanitizerFuncs.sanitizedItemListObjGenerator(itemListAccumulator, sanitizerFuncs.thingSanitizer,
      imwProductArr, imwProductValObj, itemID, deptID, deptName, recptAlias, brand, itemName, size, suggRtl, lastCost, basePrice, autoDisco,
      idealMarg, weightProf, tax1, tax2, tax3, specTndr1, specTndr2, posPrompt, location, altID, altRcptAlias, pkgQty, suppUnitID,
      suppID, unit, numPkgs, category, subCtgry, prodGroup, prodFlag, rbNote, ediDefault, pwrfld7, tmpGroup, onhndQty,
      reorderPt, mcl, reorderQty, memo, flrRsn, dsd, discoMult, csPkMlt, ovr)

    sanitizerFuncs.objectifyImwProductArr(imwProductArr, objectifiedImwProdArr)

    let removeItemSPLITsanArr = []
    let removeItemSPLITsanArrObject = {}

    if (removeItem !== undefined) {
      remvItem.removeItemPrepper(removeItem, removeItemSPLITsanArr)
      remvItem.removeItemSPLITsanArrObjectifier(objKeyArr, removeItemSPLITsanArrObject, removeItemSPLITsanArr)
    }

    remvItem.removeItemHandler(imwProductArr, removeItemSPLITsanArrObject, objectifiedImwProdArr)


    // console.log(`currentPage from POST==> ${currentPage}`)

    // let offsetPost = currentPage * numQueryRes
    // let paginPostObjArr = []
    let paginPostObj = {}
    paginPost.paginPost(postBody, paginPostObj)
    console.log(`JSON.stringify(paginPostObj)==> ${JSON.stringify(paginPostObj)}`)

    console.log(`imwProductValObj from addNewProducts.js POST==> ${imwProductValObj}`)
    console.log(`JSON.stringify(imwProductValObj) from addNewProducts.js POST==> ${JSON.stringify(imwProductValObj)}`)

    function queryEDI_Table() {
      //    SELECT * FROM someTable ORDER BY id DESC LIMIT 0,5
      connection.query(`SELECT COUNT(*) FROM ${tableName};
      SELECT * FROM ${tableName} ORDER BY item_name LIMIT ${paginPostObj['offsetPost']},${paginPostObj['numQueryRes']};`,
        function (err, rows, fields) {
          if (err) throw err
          showSearchRes.showSearchRes(rows, numQueryRes, pageLinkArray, srsObjArr, numPagesPlaceholder)

          res.render('vw-imwGenerator', {
            title: `vw-imwGenerator`,
            srsObjArr: srsObjArr,
            imwProductValObj: imwProductValObj,
            imwProductArr: imwProductArr, //this is stringified product key/value pairs in an array to populate itemListAccumulatorPost
            objectifiedImwProdArr: objectifiedImwProdArr, //this is for DOM template display
            tableName: tableName,
            numQueryRes: paginPostObj.numQueryRes,
            pageLinkArray: pageLinkArray,
            currentPage: paginPostObj.currentPage,
            numberOfPages: numPagesPlaceholder[0],
            lastPage: numPagesPlaceholder[0] - 1,
            firstPage: 0
          })
        })
    }

    if (tableName !== undefined && tableName !== '') {
      queryEDI_Table()
      console.log(`numPages from queryEDI_Table() POST==> ${showSearchRes.showSearchRes.numPages}`)
    } else {
      res.render('vw-imwGenerator', {
        title: `vw-imwGenerator`,
        imwProductValObj: imwProductValObj,
        imwProductArr: imwProductArr,
        objectifiedImwProdArr: objectifiedImwProdArr
      })
    }
  }),

  addNewProducts: router.get(`/addNewProducts`, (req, res, next) => {
    console.log(`req.query==> ${req.query}`)

    console.log(`decodeURIComponent(req.query)==> ${decodeURIComponent(req.query)}`)

    console.log(`JSON.stringify(req.query)==> ${JSON.stringify(req.query)}`)
    console.log(`req.query.page==> ${req.query.page}`)
    console.log(`req.query.tableName==> ${req.query.tableName}`)
    console.log(`req.query.numQueryRes==> ${req.query.numQueryRes}`)

    let page = parseInt(decodeURIComponent(req.query.page))
    let tableName = decodeURIComponent(req.query.tableName)
    let numQueryRes = decodeURIComponent(req.query.numQueryRes)

    let offset = page * numQueryRes

    let imwProductValObj = decodeURIComponent(req.query.imwProductValObj)
    console.log(`imwProductValObj from addNewProducts.js GET==> ${imwProductValObj}`)
    console.log(`JSON.stringify(imwProductValObj) from addNewProducts.js GET==> ${JSON.stringify(imwProductValObj)}`)
    console.log(`typeof imwProductValObj from addNewProducts.js GET==> ${typeof imwProductValObj}`)

    let imwProductArr = decodeURIComponent(req.query.imwProductArr)

    console.log(`imwProductArr from GET==> ${imwProductArr}`)
    console.log(`typeof imwProductArr from GET==> ${typeof imwProductArr}`)
    console.log(`JSON.stringify(imwProductArr) from GET==> ${JSON.stringify(imwProductArr)}`)

    // var objectifiedImwProdArr

    // if (imwProductArr !== '') {
    //   objectifiedImwProdArr = JSON.parse(imwProductArr) //try this to solve
    // }


    // console.log(`objectifiedImwProdArr from GET==> ${objectifiedImwProdArr}`)
    // console.log(`typeof objectifiedImwProdArr from GET==> ${typeof objectifiedImwProdArr}`)
    // console.log(`JSON.stringify(objectifiedImwProdArr) from GET==> ${JSON.stringify(objectifiedImwProdArr)}`)

    let pageLinkArray = []
    let numPagesPlaceholder = [] //holds the value for total number of pages; should only be one value
    let srsObjArr = []

    let currentPage = page
    console.log(`currentPage from GET==> ${currentPage}`)

    function queryEDI_Table_GET() {
      //The COUNT(*) function returns the number of rows in a result set returned by a SELECT statement.
      //The COUNT(*) returns the number of rows including duplicate, non-NULL and NULL rows.
      connection.query(`SELECT COUNT(*) FROM ${tableName};
      SELECT * FROM ${tableName} ORDER BY item_name LIMIT ${offset},${numQueryRes};`,
        function (err, rows, fields) {
          if (err) throw err
          showSearchRes.showSearchRes(rows, numQueryRes, pageLinkArray, srsObjArr, numPagesPlaceholder)

          res.render('vw-imwGenerator', {
            title: `vw-imwGenerator from GET`,
            srsObjArr: srsObjArr,
            imwProductValObj: imwProductValObj,
            imwProductArr: imwProductArr, //this is stringified product key/value pairs in an array to populate itemListAccumulatorPost
            // objectifiedImwProdArr: objectifiedImwProdArr, //this is for DOM template display
            tableName: tableName,
            numQueryRes: numQueryRes,
            pageLinkArray: pageLinkArray,
            currentPage: currentPage,
            numberOfPages: numPagesPlaceholder[0],
            lastPage: numPagesPlaceholder[0] - 1,
            firstPage: 0
          })
        })
    }

    queryEDI_Table_GET()

    // res.render('vw-imwGenerator', {
    //   title: `vw-imwGenerator (GET request)`,
    //   // srsObjArr: srsObjArr,
    //   // imwProductValObj: imwProductValObj,
    //   // imwProductArr: imwProductArr, //this is stringified product key/value pairs in an array to populate itemListAccumulatorPost
    //   // objectifiedImwProdArr: objectifiedImwProdArr, //this is for DOM template display
    //   // tableName: tableName,
    //   // numQueryRes: numQueryRes,
    // })

  })

}