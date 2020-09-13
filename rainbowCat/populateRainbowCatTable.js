var express = require('express');
var router = express.Router();

const mysql = require('mysql');
const fileUpload = require('express-fileupload');

const connection = mysql.createConnection({
  host: process.env.RB_HOST,
  user: process.env.RB_USER,
  password: process.env.RB_PW,
  database: process.env.RB_DB,
  debug: true
  // multipleStatements: true //MUST HAVE to make more than 1 sql statement in a single query
})


router.use(fileUpload({
  debug: true, //set debug mode to try and figure out [ERR_HTTP_HEADERS_SENT]
}))

module.exports = {

  populateRainbowCatTable: router.post('/populateRainbowCatTable', (req, res, next) => {
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
    });

    let tableToPopulate = req.body['popTblNamePost']
    console.log(`req.body['popTblNamePost']==> ${req.body['popTblNamePost']}`)


    let query2 = `LOAD DATA LOCAL INFILE './public/csv-to-insert/${fileToUpload.name}' INTO TABLE ${tableToPopulate} FIELDS TERMINATED BY ','
     ENCLOSED BY '"' LINES TERMINATED BY '\r\n' IGNORE 1 LINES;` //"IGNORE 1 LINES" skips the 1st row of the csv (which is the column name line)


    connection.query(query2, (error, response) => {
      if (error) {
        console.log('error===>', error)
      } else {
        console.log('response==>', response);
      }
    }).on('end', function () {
      // all rows have been received
      res.render('vw-rainbowCatTableHub', {
        title: `vw-rainbowCatTableHub **Populated Table <<${tableToPopulate}>>**`,
        // tableColNames: tableColumnNames,
        sqlTablePopulated: {
          tablePopulated: tableToPopulate,
        },
      });
    })
  })
}