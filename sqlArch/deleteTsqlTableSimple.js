var express = require('express');
var router = express.Router();

const odbc = require('odbc')
const DSN = process.env.ODBC_CONN_STRING

module.exports = {
	deleteTsqlTableSimple: router.post('/deleteTsqlTable', (req, res, next) => {
		const createTablePostBody = req.body
		let tableName = createTablePostBody['delTblNamePost']
		// let columnNames = []
		// let tableHeaders = createTablePostBody['crtTblPost']
		// let tableHeadersArray = tableHeaders.split(',')
		// for (let i = 0; i < tableHeadersArray.length; i++) {
		//   let columnName = tableHeadersArray[i] + ' VARCHAR(255)'
		//   console.log(`columnName==> ${columnName}`)
		//   columnNames.push(columnName)
		// }

		odbc.connect(DSN, (error, connection) => {
			connection.query(`DROP TABLE ${tableName};`, (error, result) => {
				if (error) { console.error(error) }
				console.log('result==>', result)

				res.render('vw-tsqlTableHub', {
					title: 'T-SQL T4bl3 Hub',
					//   sqlTableCreated: {
					//     tableName: tableName,
					//     columnNames: columnNames,
					//     basicColumnNames: tableHeadersArray
					//   },
					sqlTableDeleted: tableName
				})
			})
		})
	})
}