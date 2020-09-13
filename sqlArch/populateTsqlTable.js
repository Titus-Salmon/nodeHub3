const express = require('express');
const router = express.Router();
// const mysql = require('mysql');
const fileUpload = require('express-fileupload');
// const fs = require('fs');
// const csv = require('fast-csv');
// const connection = mysql.createConnection({
//   host: process.env.RETAILCALC_HOST,
//   user: process.env.RETAILCALC_USER,
//   password: process.env.RETAILCALC_PW,
//   database: process.env.RETAILCALC_DB
// });

const odbc = require('odbc')
const DSN = process.env.ODBC_CONN_STRING

router.use(fileUpload({
  debug: true
}))

module.exports = {

  populateTsqlTable: router.post('/populateTsqlTable', (req, res, next) => {
    // let columnHeaderArray = []
    if (Object.keys(req.files).length == 0) {
      return res.status(400).send('No files were uploaded.');
    }

    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    let fileToUpload = req.files.popTblPost;
    console.log('fileToUpload==>', fileToUpload)

    console.log('process.cwd()==>', process.cwd())

    // Use the mv() method to place the file somewhere on your server
    fileToUpload.mv(process.cwd() + '/public/csv-to-insert/' + fileToUpload.name, function (err) {
      if (err)
        return res.status(500).send(err);
    });

    let tableToPopulate = req.body['popTblNamePost']
    console.log(`req.body['popTblNamePost']==> ${req.body['popTblNamePost']}`)

    // let tableColumnNames = []

    // function loadTableColumnNames(result) {
    //   for (let i=0; i<result['columns'].length; i++) {
    //     tableColumnNames.push(result['columns'][i]['name'])
    //   }
    //   console.log('tableColumnNames==>', tableColumnNames)
    // }




    // let query1 = 'SHOW COLUMNS FROM ' + tableToPopulate + ';'
    // connection.query(query1, (error, response) => {
    //   console.log(error || response);
    //   console.log(`response.length==> ${response.length}`)
    //   for (let i = 0; i < response.length; i++) {
    //     console.log(`response[i]['Field']==> ${response[i]['Field']}`)
    //     columnHeaderArray.push(response[i]['Field'])
    //   }
    // });



    // //LOAD DATA LOCAL INFILE '/path/to/products.csv' INTO TABLE products;
    // let query2 = 'LOAD DATA LOCAL INFILE' + "'" + './public/csv-to-insert/' + fileToUpload.name + "'" + ' INTO TABLE ' +
    //   tableToPopulate + ' FIELDS TERMINATED BY ' + "','" + ' ENCLOSED BY ' + `'"'` +
    //   ' LINES TERMINATED BY ' + "'\r\n'" + 'IGNORE 1 LINES;'
    // connection.query(query2, (error, response) => {
    //   if (error) {
    //     console.log('error===>', error)
    //   } else {
    //     console.log('response==>', response);
    //   }

    // });

    odbc.pool(DSN, (error1, pool) => {
      if (error1) { return; } // handle
      console.log(`process.cwd()==> ${process.cwd()}`)
      pool.query(`LOAD TABLE nodehub_cat_edi_unfi_20191115 
      (unfi_sku,unfi_upc,unfi_brand,unfi_brand_name,unfi_name,unfi_case,unfi_size,unfi_pkg,unfi_list_ws,unfi_case_price,unfi_list_cost,unfi_cost,unfi_msrp,unfi_category_id,
        unfi_category,unfi_artificial,unfi_sugar,unfi_low_carb,unfi_low_salt,unfi_no_dairy,unfi_food_svc,unfi_no_gluten,unfi_vegan,unfi_no_wheat,unfi_no_yeast,unfi_kosher,
        unfi_fairtrade,unfi_no_gmo,unfi_organic,unfi_specialty,unfi_natural) FROM '${process.cwd()}/public/csv-to-insert/${fileToUpload.name}'`, (error2, result) => {
        if (error2) { return; } // handle
        
        // console.log(result);
        // loadTableColumnNames(result)

        res.render('vw-tsqlTableHub', {
          title: 'vw-tsqlTableHub',
          //   tableColNames: tableColumnNames
          // sqlTablePopulated: {
          //   tablePopulated: tableToPopulate,
          // },
        });

      });
    });


    // res.render('vw-tsqlTableHub', {
    //   title: 'vw-tsqlTableHub',
    //   tableColNames: tableColumnNames
    //   // sqlTablePopulated: {
    //   //   tablePopulated: tableToPopulate,
    //   // },
    // });
  })
}