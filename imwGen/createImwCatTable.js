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

module.exports = {
  createImwCatTable: router.post('/createImwCatTable', (req, res, next) => {
    const createTablePostBody = req.body
    let tableName = createTablePostBody['tblNamePost']
    let columnNames = []
    let tableHeaders = createTablePostBody['crtTblPost']
    let tableHeadersArray = tableHeaders.split(',')
    for (let i = 0; i < tableHeadersArray.length; i++) {
      let columnName = tableHeadersArray[i] + ' VARCHAR(255)'
      console.log(`columnName==> ${columnName}`)
      columnNames.push(columnName)
    }

    let mySqlQuery = `CREATE TABLE ${tableName} (ri_t0d int NOT NULL AUTO_INCREMENT, ${columnNames}, PRIMARY KEY (ri_t0d));`

    connection.query(mySqlQuery, (error, response) => {
      console.log(error || response);
    }).on('end', function () {
      // all rows have been received
      // connection.destroy()
      res.render('vw-imwGenerator', { //*****CRITICAL TO PUT THIS HERE; SOLVES [ERR_HTTP_HEADERS_SENT] error*****--t0d
        title: `vw-imwGenerator IMWcat Table Created: <<${tableName}>>`,
        sqlTableCreated: {
          tableName: tableName,
          columnNames: columnNames,
          basicColumnNames: tableHeadersArray
        },
      });
    })

    //do you need to end this connection before res.render, or put res.render inside of connection.query?? (to fix [ERR_HTTP_HEADERS_SENT])
    // connection.end()
    // connection.destroy()

    // res.render('vw-MySqlTableHub', {
    //   title: `vw-MySqlTableHub Table Created: <<${tableName}>>`,
    //   sqlTableCreated: {
    //     tableName: tableName,
    //     columnNames: columnNames,
    //     basicColumnNames: tableHeadersArray
    //   },
    // });
  })
}