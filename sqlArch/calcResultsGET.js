const express = require('express')
const router = express.Router()
const mysql = require('mysql')

const formInputsObjCache = require('../nodeCacheStuff/cache1')
const genericHeaderObjCache = require('../nodeCacheStuff/cache1')
const totalRowsCache = require('../nodeCacheStuff/cache1')
const cacheMain = require('../nodeCacheStuff/cache1')

const showSearchResults = require('../funcLibT0d/showSearchResults')

const connection = mysql.createConnection({
  host: process.env.RB_HOST,
  user: process.env.RB_USER,
  password: process.env.RB_PW,
  database: process.env.RB_DB,
  multipleStatements: true //MUST HAVE to make more than 1 sql statement in a single query
})

module.exports = {
  calcResultsGET: router.get('/calcResults', (req, res, next) => {

    //console.log(`formInputsObjCache['data']['formInputsObjCache_key']['v'] from GET==> ${formInputsObjCache['data']['formInputsObjCache_key']['v']}`)
    //console.log(`JSON.stringify(formInputsObjCache['data']['formInputsObjCache_key']['v']) from GET==> ${JSON.stringify(formInputsObjCache['data']['formInputsObjCache_key']['v'])}`)

    let frmInptsObjCche = formInputsObjCache['data']['formInputsObjCache_key']['v']
    let gnrcHdrObjCche = genericHeaderObjCache['data']['genericHeaderObjCache_key']['v']
    let totlRwsCche = totalRowsCache['data']['totalRowsCache_key']['v']
    //console.log(`totlRwsCche==> ${totlRwsCche}`)

    let allSearchResultsFromCache = cacheMain['data']['searchResultsNonPagCache_key']['v']
    console.log(`allSearchResultsFromCache.length from GET==> ${allSearchResultsFromCache.length}`)
    console.log(`allSearchResultsFromCache from GET==> ${allSearchResultsFromCache}`)

    searchResultsPagGETarr = [] //clear searchResultsPag from previous search
    srcRsCSV_PagGETarr = []
    srcRsCSVrvwPagGETarr = []

    console.log(`req.query==> ${req.query}`)

    console.log(`encodeURIComponent(req.query)==> ${decodeURIComponent(req.query)}`)

    console.log(`JSON.stringify(req.query)==> ${JSON.stringify(req.query)}`)
    console.log(`req.query.page==> ${req.query.page}`)
    console.log(`req.query.tableName==> ${req.query.tableName}`)
    console.log(`req.query.numQueryRes==> ${req.query.numQueryRes}`)

    let page = parseInt(decodeURIComponent(req.query.page))
    let tableName = decodeURIComponent(req.query.tableName)
    let numQueryRes = decodeURIComponent(req.query.numQueryRes)

    let offset = page * numQueryRes

    let pageLinkArray = []
    let numPagesPlaceholder = [] //holds the value for total number of pages; should only be one value

    let currentPage = page
    console.log(`currentPage from GET==> ${currentPage}`)

    function nonQueryPagResults() {
      let totalRows = totlRwsCche
      let numPages = Math.ceil(totalRows / numQueryRes) //round up to account for fractions of pages (i.e. 22.3 pages ==> 23 pages)
      console.log(`numPages==> ${numPages}`)
      numPagesPlaceholder.push(numPages)

      for (let j = 0; j < numPages; j++) {
        let pageLinkObj = {}
        pageLinkObj[`page${j}`] = j
        pageLinkArray.push(pageLinkObj)
      }
      console.log(`pageLinkArray.length from GET==> ${pageLinkArray.length}`)
      for (let i = 0; i < pageLinkArray.length; i++) {
        console.log(`JSON.stringify(pageLinkArray[${i}])==> ${JSON.stringify(pageLinkArray[i])}`)
      }

      for (let i = 0; i < numQueryRes; i++) {
        if (allSearchResultsFromCache[i + offset] !== undefined) {
          searchResultsPagGETarr.push(allSearchResultsFromCache[i + offset])
        }
      }

      console.log(`searchResultsPagGETarr.length from GET==> ${searchResultsPagGETarr.length}`)
      console.log(`searchResultsPagGETarr from GET==> ${searchResultsPagGETarr}`)

      // for (let i = 0; i < searchResultsPagGETarr.length; i++) {
      //   console.log(`JSON.stringify(searchResultsPagGETarr[${i}]) from GET++> ${JSON.stringify(searchResultsPagGETarr[i])}`)
      // }

      res.render('vw-MySqlTableHub', {
        title: `vw-MySqlTableHub from GET`,
        // srsObjArr: srsObjArr,
        // imwProductValObj: imwProductValObj,
        // imwProductArr: imwProductArr, //this is stringified product key/value pairs in an array to populate itemListAccumulatorPost
        // objectifiedImwProdArr: objectifiedImwProdArr, //this is for DOM template display
        searchResRows: searchResultsPagGETarr,
        tableName: tableName,
        numQueryRes: numQueryRes,
        pageLinkArray: pageLinkArray,
        currentPage: currentPage,
        numberOfPages: numPagesPlaceholder[0],
        lastPage: numPagesPlaceholder[0] - 1,
        firstPage: 0
      })

    }
    nonQueryPagResults()

    // function queryEDI_Table_GET() {
    //   console.log(`1st query from GET==> SELECT * FROM ${tableName} GROUP BY ${gnrcHdrObjCche.upcHeader},
    //   ${gnrcHdrObjCche.invLastcostHeader} ORDER BY ${gnrcHdrObjCche.upcHeader} 
    //   LIMIT ${offset},${numQueryRes};`) //this seems to be working fine
    //   //The COUNT(*) function returns the number of rows in a result set returned by a SELECT statement.
    //   //The COUNT(*) returns the number of rows including duplicate, non-NULL and NULL rows.
    //   connection.query( //1st query is pagination query; 2nd query is getting EDLP data; 3rd query is non-paginated query;
    //     //4th query is for getting COUNT (# of total rows)
    //     `SELECT * FROM ${tableName} GROUP BY ${gnrcHdrObjCche.upcHeader},
    //   ${gnrcHdrObjCche.invLastcostHeader} ORDER BY ${gnrcHdrObjCche.upcHeader} 
    //   LIMIT ${offset},${numQueryRes};

    //   SELECT * FROM rb_edlp_data;

    //   SELECT * FROM ${tableName} GROUP BY ${gnrcHdrObjCche.upcHeader},
    //   ${gnrcHdrObjCche.invLastcostHeader} ORDER BY ${gnrcHdrObjCche.upcHeader};

    //   SELECT COUNT(*) FROM ${tableName} GROUP BY ${gnrcHdrObjCche.upcHeader};`,
    //     function (err, rows, fields) {
    //       if (err) throw err

    //       let nejRowsPagin = rows[0] //targets 1st query on NEJ table
    //       let edlpRows = rows[1] //targets 2nd query on rb_edlp_data table
    //       let nejRowsNonPagin = rows[2] //targets 3rd query on NEJ table

    //       let countRows = rows[3]

    //       console.log(`JSON.stringify(countRows) from calaResultsGET.js==> ${JSON.stringify(countRows)}`)
    //       let totalRows = totlRwsCche

    //       console.log(`totalRows from calcResultsGET.js==> ${totalRows}`)

    //       let numPages = Math.ceil(totalRows / numQueryRes) //round up to account for fractions of pages (i.e. 22.3 pages ==> 23 pages)
    //       console.log(`numPages==> ${numPages}`)
    //       numPagesPlaceholder.push(numPages)

    //       // let pageLinkObj = {}
    //       for (let j = 0; j < numPages; j++) {
    //         let pageLinkObj = {}
    //         pageLinkObj[`page${j}`] = j
    //         pageLinkArray.push(pageLinkObj)
    //       }

    //       console.log(`pageLinkArray.length from GET==> ${pageLinkArray.length}`)

    //       for (let i = 0; i < pageLinkArray.length; i++) {
    //         console.log(`JSON.stringify(pageLinkArray[${i}])==> ${JSON.stringify(pageLinkArray[i])}`)
    //       }

    //       // showSearchRes.showSearchRes(rows, numQueryRes, pageLinkArray, srsObjArr, numPagesPlaceholder)

    //       // showSearchResults.showSearchResults(rows, genericHeaderObjGET, formInputsObjGET, searchResultsNonPag, srcRsCSV_nonPag, srcRsCSVrvw_nonPag,
    //       //   edlpRows, nejRowsNonPagin)

    //       showSearchResults.showSearchResults(rows, gnrcHdrObjCche, frmInptsObjCche, searchResultsPagGETarr, srcRsCSV_PagGETarr,
    //         srcRsCSVrvwPagGETarr, edlpRows, nejRowsPagin)

    //       console.log(`searchResultsPagGETarr from GET--> ${searchResultsPagGETarr}`)
    //       for (let i = 0; i < searchResultsPagGETarr.length; i++) {
    //         console.log(`JSON.stringify(searchResultsPagGETarr[${i}]) from GET++> ${JSON.stringify(searchResultsPagGETarr[i])}`)
    //       }

    //       console.log(`nejRowsPagin.length==> ${nejRowsPagin.length}`)
    //       console.log(`JSON.stringify(nejRowsPagin) from GET~~> ${JSON.stringify(nejRowsPagin)}`)

    //       res.render('vw-MySqlTableHub', {
    //         title: `vw-MySqlTableHub from GET`,
    //         // srsObjArr: srsObjArr,
    //         // imwProductValObj: imwProductValObj,
    //         // imwProductArr: imwProductArr, //this is stringified product key/value pairs in an array to populate itemListAccumulatorPost
    //         // objectifiedImwProdArr: objectifiedImwProdArr, //this is for DOM template display
    //         searchResRows: searchResultsPagGETarr,
    //         tableName: tableName,
    //         numQueryRes: numQueryRes,
    //         pageLinkArray: pageLinkArray,
    //         currentPage: currentPage,
    //         numberOfPages: numPagesPlaceholder[0],
    //         lastPage: numPagesPlaceholder[0] - 1,
    //         firstPage: 0
    //       })
    //     })
    // }

    // queryEDI_Table_GET()
  })
}