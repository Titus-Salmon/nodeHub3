const express = require('express')
const router = express.Router()
const mysql = require('mysql')
const fileUpload = require('express-fileupload')

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
//   debug: true,
//   multipleStatements: true, //MUST HAVE to make more than 1 sql statement in a single query
//   insecureAuth: true
// })

// const connection = mysql.createConnection({ //for work testing
//   host: process.env.NODEHUB_TEST1_HOST,
//   user: process.env.NODEHUB_TEST1_USER,
//   password: process.env.NODEHUB_TEST1_PW,
//   database: process.env.NODEHUB_TEST1_DB,
//   debug: true,
//   multipleStatements: true //MUST HAVE to make more than 1 sql statement in a single query
// })

router.use(fileUpload({
  debug: true, //set debug mode to try and figure out [ERR_HTTP_HEADERS_SENT]
}))

module.exports = {

  populateImwCatTable: router.post('/populateImwCatTable', (req, res, next) => {
    // let columnHeaderArray = []
    if (Object.keys(req.files).length == 0) {
      return res.status(400).send('No files were uploaded.');
    }

    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    let fileToUpload = req.files.popTblPost;
    console.log(`fileToUpload==> ${fileToUpload}`)

    // Use the mv() method to place the file somewhere on your server
    fileToUpload.mv(process.cwd() + '/public/csv-to-insert/' + fileToUpload.name, function (err) {
      //might want to try and use the actual UNC path here (\\WEBSERVER...)
      if (err)
        return res.status(500).send(err);
    })

    let tableToPopulate = req.body['popTblNamePost']
    console.log(`req.body['popTblNamePost']==> ${req.body['popTblNamePost']}`)

    let query2 = `LOAD DATA LOCAL INFILE './public/csv-to-insert/${fileToUpload.name}' INTO TABLE ${tableToPopulate} FIELDS TERMINATED BY ','
     ENCLOSED BY '"' LINES TERMINATED BY '\r\n' IGNORE 1 LINES;` //"IGNORE 1 LINES" skips the 1st row of the csv (which is the column name line)

    connection.query(query2, (error, response) => {
      if (error) {
        console.log('error===>', error)
      } else {
        console.log('response==>', response);
        // res.render('vw-MySqlTableHub', {
        //   title: `vw-MySqlTableHub **Populated Table <<${tableToPopulate}>>**`,
        //   // tableColNames: tableColumnNames,
        //   sqlTablePopulated: {
        //     tablePopulated: tableToPopulate,
        //   },
        // }); DO NOT res.render here; this will throw a "headers already sent error"; NEED TO USE .on('end') TO HANDLE ANSYNC SITUATION
      }
    }).on('end', function () {
      // all rows have been received
      // connection.destroy()
      res.render('vw-imwGenerator', {
        title: `vw-imwGenerator **Populated Table <<${tableToPopulate}>>**`,
        // tableColNames: tableColumnNames,
        sqlTablePopulated: {
          tablePopulated: tableToPopulate,
        },
      })
    })
  })
}