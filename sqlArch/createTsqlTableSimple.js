var express = require('express');
var router = express.Router();

const odbc = require('odbc')
const DSN = process.env.ODBC_CONN_STRING

module.exports = {
  createTsqlTableSimple: router.post('/createEmptyTsqlTable', (req, res, next) => {
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

    console.log('process.env==>', process.env)
    console.log('DSN==>', DSN)

    odbc.connect(DSN, (error, connection) => {
      connection.query(`CREATE TABLE ${tableName} (tsqlPrimKey INT NOT NULL IDENTITY PRIMARY KEY, ${columnNames});`, (error, result) => {
        if (error) { console.error(error) }
        console.log('result==>', result)

        res.render('vw-tsqlTableHub', {
          title: 'Cr34t3 T-SQL Tabl3',
          sqlTableCreated: {
            tableName: tableName,
            columnNames: columnNames,
            basicColumnNames: tableHeadersArray
          },
        })
      })
    })
  })
}