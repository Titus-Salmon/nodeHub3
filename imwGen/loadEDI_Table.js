const express = require('express')
const router = express.Router()

const mysql = require('mysql')

const connection = mysql.createConnection({ //for work use in RB DB
  host: process.env.RB_HOST,
  user: process.env.RB_USER,
  password: process.env.RB_PW,
  database: process.env.RB_DB,
  multipleStatements: true //MUST HAVE to make more than 1 sql statement in a single query
})

// const connection = mysql.createConnection({ //for home testing
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

module.exports = {

  loadEDI_Table: router.post('/loadEDI_Table', (req, res, next) => {

    const postBody = req.body
    let tableName = postBody['tableNamePost']

    let srsObjArr = []

    function showSearchResults(rows) {
      // let srsObj = {}
      console.log(`rows.length==>${rows.length}`)
      console.log(`rows==>${rows}`)
      console.log(`JSON.stringify(rows)==>${JSON.stringify(rows)}`)
      for (let i = 0; i < rows.length; i++) {
        let srsObj = {}
        srsObj['pk_t0d'] = rows[i]['pk_t0d']
        srsObj['item_id'] = rows[i]['item_id']
        srsObj['supp_unit_id'] = rows[i]['supp_unit_id']
        srsObjArr.push(srsObj)
      }
      // console.log(`srsObj==> ${srsObj}`)
      // console.log(`JSON.stringify(srsObj)==> ${JSON.stringify(srsObj)}`)
    }

    function queryEDI_Table() {
      //v//retrieve info from database table to display in DOM table/////////////////////////////////////////////////////////
      //filters by UPC & catapult cost (want to grab any differing cost items & make decision on what to do in showSearchResults())
      connection.query(`SELECT * FROM ${tableName};`,
        function (err, rows, fields) {
          if (err) throw err
          showSearchResults(rows)

          // res.render('vw-MySqlTableHub', { //render searchResults to vw-MySqlTableHub page
          //   title: `Retail Price Calculator (using nhcrtEdiJoin table: <<${frmInptsObj.loadedSqlTbl}>>)`,
          //   searchResRows: searchResults,
          //   loadedSqlTbl: frmInptsObj.loadedSqlTbl,
          //   // ongDsc: ongDsc //use to populate value for "%Discount to Apply" field
          // })

          res.render('vw-imwGenerator', {
            title: `vw-imwGenerator`,
            srsObjArr: srsObjArr,
            // imwProductValObj: imwProductValObj,
            // imwProductArr: imwProductArr,
            // objectifiedImwProdArr: objectifiedImwProdArr
          })
        })

    }

    queryEDI_Table()

    // function itemListAccSanitizer() {
    //   if (itemListAccumulator !== undefined) {
    //     let sanitizerRegex1 = /(\\)|(\[)|(\])/g
    //     let sanitizerRegex2 = /("")/g
    //     let sanitizerRegex3 = /("{)/g
    //     let sanitizerRegex4 = /(}")/g
    //     sanitizedItemListAcc = itemListAccumulator.replace(sanitizerRegex1, "")
    //       .replace(sanitizerRegex2, `"`).replace(sanitizerRegex3, `{`).replace(sanitizerRegex4, `}`)
    //     console.log(`sanitizedItemListAcc==> ${sanitizedItemListAcc}`)
    //   }
    // }

    // function sanitizedItemListObjGenerator() {
    //   if (itemListAccumulator !== undefined) {
    //     itemListAccSanitizer()
    //     /* X(?=Y) 	Positive lookahead 	X if followed by Y
    //      * (?<=Y)X 	Positive lookbehind 	X if after Y
    //      * ==t0d==>you can combine the 2==> (?<=A)X(?=B) to yield: "X if after A and followed by B" <==t0d==*/
    //     let splitRegex1 = /(?<=}),(?={)/g
    //     let sanitizedItemListAccSPLIT = sanitizedItemListAcc.split(splitRegex1)
    //     for (let i = 0; i < sanitizedItemListAccSPLIT.length; i++) {
    //       imwProductArr.push(sanitizedItemListAccSPLIT[i])
    //     }
    //   }
    //   imwProductValObj['itemID'] = itemID
    //   imwProductValObj['suppUnitID'] = suppUnitID
    //   let stringifiedImwProductValObj = JSON.stringify(imwProductValObj)
    //   imwProductArr.push(stringifiedImwProductValObj)
    // }

    // sanitizedItemListObjGenerator()

    // function objectifyImwProductArr() {
    //   for (let i = 0; i < imwProductArr.length; i++) {
    //     let objectifiedImwProd = JSON.parse(imwProductArr[i])
    //     objectifiedImwProdArr.push(objectifiedImwProd)
    //   }
    // }

    // objectifyImwProductArr()

    // console.log(`typeof imwProductArr==> ${typeof imwProductArr}`)
    // console.log(`imwProductArr==> ${imwProductArr}`)
    // console.log(`typeof imwProductArr[0]==> ${typeof imwProductArr[0]}`)

    // res.render('vw-imwGenerator', {
    //   title: `vw-imwGenerator`,
    //   imwProductValObj: imwProductValObj,
    //   imwProductArr: imwProductArr,
    //   objectifiedImwProdArr: objectifiedImwProdArr
    // })

  })
}