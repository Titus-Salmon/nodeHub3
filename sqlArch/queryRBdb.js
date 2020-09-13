var express = require('express');
var router = express.Router();

const mysql = require('mysql');
const connection = mysql.createConnection({
    host: process.env.RB_HOST,
    user: process.env.RB_USER,
    password: process.env.RB_PW,
    database: process.env.RB_DB
})

module.exports = {
    queryRBdb: router.post('/queryRBdb', (req, res, next) => {
        const queryRbDBPostBody = req.body
        // console.log(`req.body==> ${req.body}`)
        let rbDbQuery = queryRbDBPostBody['dbQueryPost']
        console.log(`rbDbQuery==> ${rbDbQuery}`)

        let rbTableArr = []

        function showRbTables(rows) {
            for (let i = 0; i < rows.length; i++) {
                let rbTableListObj = {}
                rbTableListObj['tableName'] = rows[i]['Tables_in_rainbow']
                // rbTableListObj['tableOwner'] = rows[i]['table_owner']
                // rbTableListObj['tableName'] = rows[i]['table_name']
                // rbTableListObj['tableType'] = rows[i]['table_type']
                // rbTableListObj['tableRemarks'] = rows[i]['remarks']

                rbTableArr.push(rbTableListObj)
            }
            console.log('rows.length~~~>', rows.length)
        }


        let mySqlQuery = `${rbDbQuery}`

        connection.query(mySqlQuery, function (err, rows, fields) {
            if (err) throw err
            console.log('rows==>', rows)
            // res.send(rows)
            showRbTables(rows)

            res.render('vw-rbDbQuery', {
                title: 'Rainbow DB Query Results',
                rbTables: rbTableArr
            })
        })

    })
}