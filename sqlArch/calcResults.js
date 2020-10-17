const express = require('express')
const router = express.Router()
const mysql = require('mysql')

const gEnericHdrObj = require('../funcLibT0d/genericHdrObj')
const cAlcRsFrmInputs = require('../funcLibT0d/calcResFormInputs')
const paginPost = require('../funcLibT0d/paginPost')
const showSearchResults = require('../funcLibT0d/showSearchResults')

const cacheMain = require('../nodeCacheStuff/cache1')
const formInputsObjCache = require('../nodeCacheStuff/cache1')
const genericHeaderObjCache = require('../nodeCacheStuff/cache1')
const totalRowsCache = require('../nodeCacheStuff/cache1')

const connection = mysql.createConnection({
  host: process.env.RB_HOST,
  user: process.env.RB_USER,
  password: process.env.RB_PW,
  database: process.env.RB_DB,
  multipleStatements: true //MUST HAVE to make more than 1 sql statement in a single query
})

module.exports = {

  calcResults: router.post('/calcResults', (req, res, next) => {

    let searchResultsNonPag = [] //clear searchResultsNonPag from previous search
    let searchResultsPag = [] //clear searchResultsPag from previous search
    let firstResultSet = [] // holds results for the 1st POST result set (will be paginated, if specified)
    srcRsCSV_Pag = [] //why does this break if instantiated with "let"? A question for another time...
    srcRsCSV_nonPag = [] //why does this break if instantiated with "let"? A question for another time...
    srcRsCSVrvwPag = [] //why does this break if instantiated with "let"? A question for another time...
    srcRsCSVrvw_nonPag = [] //why does this break if instantiated with "let"? A question for another time...
    srcRsXLS_nonPag = []
    csvContainer = [] //why does this break if instantiated with "let"? A question for another time...
    const postBody = req.body

    searchResultsNonPagCacheChecker = cacheMain.get('searchResultsNonPagCache_key')
    if (searchResultsNonPagCacheChecker !== undefined) { //clear srcRsObjCache_key if it exists
      cacheMain.del('searchResultsNonPagCache_key')
    }

    formInputsObjCacheChecker = formInputsObjCache.get('formInputsObjCache_key');
    if (formInputsObjCacheChecker !== undefined) { //clear formInputsObjCache_key if it exists
      formInputsObjCache.del('formInputsObjCache_key')
    }
    genericHeaderObjCacheChecker = genericHeaderObjCache.get('genericHeaderObjCache_key');
    if (genericHeaderObjCacheChecker !== undefined) { //clear genericHeaderObjCache_key if it exists
      genericHeaderObjCache.del('genericHeaderObjCache_key')
    }
    totalRowsCacheChecker = totalRowsCache.get('totalRowsCache_key');
    if (totalRowsCacheChecker !== undefined) { //clear totalRowsCache_key if it exists
      totalRowsCache.del('totalRowsCache_key')
    }

    let frmInptsObj = {} //provide empty object to populate with form inputs & values generated from calcResFormInputs.js module
    cAlcRsFrmInputs.clcRsFrmInpts(postBody, frmInptsObj)
    // const formInputsObjCache = new NodeCache()
    formInputsObjCache.set('formInputsObjCache_key', frmInptsObj)

    let genericHeaderObj = {} //provide empty object to populate with generic headers generated from genericHdrObj.js module
    gEnericHdrObj.gnrcHdrObj(postBody, genericHeaderObj)
    // const genericHeaderObjCache = new NodeCache()
    genericHeaderObjCache.set('genericHeaderObjCache_key', genericHeaderObj)

    let pageLinkArray = []
    let numPagesPlaceholder = []

    let paginPostObj = {}
    paginPost.paginPost(postBody, paginPostObj)

    function queryNejTablePaginated() {
      //v//retrieve info from database table to display in DOM table/////////////////////////////////////////////////////////
      //filters by UPC & catapult cost (want to grab any differing cost items & make decision on what to do in showSearchResults())
      connection.query( //1st query is pagination query; 2nd query is getting EDLP data; 3rd query is non-paginated query;
        //4th query is for getting COUNT (# of total rows)
        `SELECT * FROM ${frmInptsObj.formInput0}
        WHERE dptName != 'RB_CLEANUP' GROUP BY ${genericHeaderObj.upcHeader},
      ${genericHeaderObj.invLastcostHeader} ORDER BY
      ${genericHeaderObj.rbDeptHeader} ASC, ${genericHeaderObj.pi1Description} ASC, ${genericHeaderObj.pi2Description} ASC
      LIMIT ${paginPostObj['offsetPost']},${paginPostObj['numQueryRes']};

      SELECT * FROM rb_edlp_data;
      
      SELECT * FROM ${frmInptsObj.formInput0}
      WHERE dptName != 'RB_CLEANUP' GROUP BY ${genericHeaderObj.upcHeader},
      ${genericHeaderObj.invLastcostHeader} ORDER BY
      ${genericHeaderObj.rbDeptHeader} ASC, ${genericHeaderObj.pi1Description} ASC, ${genericHeaderObj.pi2Description} ASC;
      
      SELECT COUNT(*) FROM ${frmInptsObj.formInput0};
      
      SELECT * FROM gpet_groc;
      SELECT * FROM gpet_ref;
      SELECT * FROM gpet_frz;
      SELECT * FROM gpet_gen_merch;
      SELECT * FROM gpet_infra;
      SELECT * FROM gpet_case_stack;
      SELECT * FROM gpet_nego_edlp;
      SELECT * FROM gpet_cadia;`,

        function (err, rows, fields) {
          if (err) throw err

          let nejRowsPagin = rows[0] //targets 1st query on NEJ table
          // console.log(`nejRowsPagin[0]==> ${nejRowsPagin[0]}`)
          console.log(`nejRowsPagin.length (BEFORE gpet handling)==> ${nejRowsPagin.length}`)
          // console.log(`JSON.stringify(nejRowsPagin[0])==> ${JSON.stringify(nejRowsPagin[0])}`)
          let edlpRows = rows[1] //targets 2nd query on rb_edlp_data table
          console.log(`JSON.stringify(edlpRows[0])==> ${JSON.stringify(edlpRows[0])}`)
          let nejRowsNonPagin = rows[2] //targets 3rd query on NEJ table
          console.log(`nejRowsNonPagin.length (BEFORE gpet handling)==> ${nejRowsNonPagin.length}`)
          let countRows = rows[3]
          console.log(`JSON.stringify(countRows) from calcResults.js==> ${JSON.stringify(countRows)}`)
          let gpetGrocRows = rows[4]
          // console.log(`JSON.stringify(gpetGrocRows[0])==> ${JSON.stringify(gpetGrocRows[0])}`)
          let gpetRefRows = rows[5]
          let gpetFrzRows = rows[6]
          let gpetGenMerchRows = rows[7]
          let gpetINFRArows = rows[8]
          let gpetCaseStackRows = rows[9]
          let gpetNegoEDLProws = rows[10]
          let gpetCadiaRows = rows[11]

          //v////////handle gpet tables ==> if UPC is in gpet table, ignore it in showSearchResults calcs
          function gpetUPCremover(gpetTableRows) {
            for (let x = 0; x < gpetTableRows.length; x++) {
              for (let y = 0; y < nejRowsPagin.length; y++) {
                if (gpetTableRows[x]['upc'] == nejRowsPagin[y]['invScanCode']) {
                  nejRowsPagin.splice(y, 1)
                }
              }
            }
            for (let x = 0; x < gpetTableRows.length; x++) {
              for (let y = 0; y < nejRowsNonPagin.length; y++) {
                if (gpetTableRows[x]['upc'] == nejRowsNonPagin[y]['invScanCode']) {
                  nejRowsNonPagin.splice(y, 1)
                }
              }
            }
          }
          gpetUPCremover(gpetGrocRows)
          gpetUPCremover(gpetRefRows)
          gpetUPCremover(gpetFrzRows)
          gpetUPCremover(gpetGenMerchRows)
          gpetUPCremover(gpetINFRArows)
          gpetUPCremover(gpetCaseStackRows)
          gpetUPCremover(gpetNegoEDLProws)
          gpetUPCremover(gpetCadiaRows)

          console.log(`nejRowsPagin.length (AFTER gpet handling)==> ${nejRowsPagin.length}`)
          console.log(`nejRowsNonPagin.length (AFTER gpet handling)==> ${nejRowsNonPagin.length}`)
          //^////////handle gpet tables ==> if UPC is in gpet table, ignore it in showSearchResults calcs

          function edlpHandler() {
            //v//EDLP HANDLER///////////////////////////////////////////////////////////////////////////////////////
            // console.log(`edlpRows.length==> ${edlpRows.length}`)
            // console.log(`JSON.stringify(searchResults[0] from edlpHandler()==> ${JSON.stringify(searchResults[0])}`)
            console.log(`JSON.stringify(searchResultsNonPag[0])==> ${JSON.stringify(searchResultsNonPag[0])}`)
            for (let j = 0; j < edlpRows.length; j++) {
              for (let k = 0; k < searchResultsNonPag.length; k++) {
                if (searchResultsNonPag[k]['UPC'] == edlpRows[j]['edlp_upc']) {
                  searchResultsNonPag[k]['edlpVar'] = 'EDLP'
                  console.log(`JSON.stringify(searchResultsNonPag[${k}]['edlpVar'])==> ${JSON.stringify(searchResultsNonPag[k]['edlpVar'])}`)
                } else {
                  searchResultsNonPag[k]['edlpVar'] = 'EDLP'
                }
              }
              // srcRsObj['edlpUPC'] = edlpRows[j]['edlp_upc']
              // reviewObj['edlpUPC'] = edlpRows[j]['edlp_upc'] //INCLUDE in save2CSVreview export data

              // if (srcRsObj['upc'] == srcRsObj['edlpUPC']) {
              //   // srcRsObj['edlpVar'] = "EDLP"
              //   // edlpHandlerArr.push(srcRsObj)
              //   searchResults[i]['edlpVar'] = "EDLP"
              //   searchResultsForCSV[i]['edlpVar'] = "EDLP"
              //   searchResultsForCSVreview[i]['edlpVar'] = "EDLP"
              //   searchResultsForXLS[i]['edlpVar'] = "EDLP"
              //   console.log(`JSON.stringify(searchResults[${i}]['edlpVar'])==> ${JSON.stringify(searchResults[i]['edlpVar'])}`)
              // } else {
              //   // srcRsObj['edlpVar'] = ""
              //   // edlpHandlerArr.push(srcRsObj)
              //   searchResults[i]['edlpVar'] = ""
              //   searchResultsForCSV[i]['edlpVar'] = ""
              //   searchResultsForCSVreview[i]['edlpVar'] = ""
              //   searchResultsForXLS[i]['edlpVar'] = ""
              // }
            }
            //^//EDLP HANDLER///////////////////////////////////////////////////////////////////////////////////////
          }
          // edlpHandler()

          showSearchResults.showSearchResults(rows, genericHeaderObj, frmInptsObj, searchResultsNonPag, srcRsCSV_nonPag, srcRsCSVrvw_nonPag,
            srcRsXLS_nonPag, edlpRows, nejRowsNonPagin)
          edlpHandler()
          cacheMain.set('searchResultsNonPagCache_key', searchResultsNonPag)

          function paginFirstResultSet() {
            //push the 1st n elements of searchResultsNonPag into firstResultSet array
            for (let n = 0; n < paginPostObj['numQueryRes']; n++) {
              firstResultSet.push(searchResultsNonPag[n])
            }
          }

          paginFirstResultSet()

          console.log(`calcResults says firstResultSet.length from paginFirstResultSet==> ${firstResultSet.length}`)

          // showSearchResults.showSearchResults(rows, genericHeaderObj, frmInptsObj, searchResultsPag, srcRsCSV_Pag, srcRsCSVrvwPag,
          //   edlpRows, nejRowsPagin)

          let totalRows = searchResultsNonPag.length //use length of non-paginated results from showSearchResults for total # of rows,
          console.log(`totalRows==> ${totalRows}`)
          //since countRows[0]['COUNT(*)'] gives 7x the actual number of rows (7 stores)
          totalRowsCache.set('totalRowsCache_key', totalRows)

          let numPages = Math.ceil(totalRows / numQueryRes) //round up to account for fractions of pages (i.e. 22.3 pages ==> 23 pages)
          console.log(`numPages==> ${numPages}`)
          numPagesPlaceholder.push(numPages)

          // let pageLinkObj = {}
          for (let j = 0; j < numPages; j++) {
            let pageLinkObj = {}
            pageLinkObj[`page${j}`] = j
            pageLinkArray.push(pageLinkObj)
          }

          res.render('vw-MySqlTableHub', { //render searchResults to vw-MySqlTableHub page
            title: `Retail Price Calculator (using nhcrtEdiJoin table: <<${frmInptsObj.loadedSqlTbl}>>)`,
            searchResRows: firstResultSet,
            loadedSqlTbl: frmInptsObj.loadedSqlTbl,
            numQueryRes: paginPostObj.numQueryRes,
            currentPage: paginPostObj.currentPage,
            pageLinkArray: pageLinkArray,
            numberOfPages: numPagesPlaceholder[0],
            lastPage: numPagesPlaceholder[0] - 1,
            firstPage: 0,
            tableName: frmInptsObj.formInput0,
            formInputsObj: frmInptsObj,
            upcHeader: genericHeaderObj.upcHeader,
            invLastcostHeader: genericHeaderObj.invLastcostHeader,
            searchResultsPag: searchResultsPag,
            searchResultsPag_stringified: JSON.stringify(searchResultsPag),
            offsetPost: paginPostObj.offsetPost,
            offsetPost: paginPostObj.offsetPost,
            genericHeaderObj_stringified: JSON.stringify(genericHeaderObj),
            formInputsObj_stringified: JSON.stringify(frmInptsObj)
            // ongDsc: ongDsc //use to populate value for "%Discount to Apply" field
          })
        })
    }
    queryNejTablePaginated()
  }),
}