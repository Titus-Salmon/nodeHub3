const express = require('express')
const router = express.Router()

//v//destructuring////////////////////////////////
const {
  addNewProducts
} = require('../imwGen/addNewProducts')
const {
  saveProdArrAsCSV
} = require('../imwGen/saveProdArrAsCSV')
const {
  loadEDI_Table
} = require('../imwGen/loadEDI_Table')
const {
  createImwCatTable
} = require('../imwGen/createImwCatTable')
const {
  populateImwCatTable
} = require('../imwGen/populateImwCatTable')




router.get('/', function (req, res, next) {
  res.render('vw-imwGenerator', {
    title: 'vw-imwGenerator',
    // username: req.user.name,
    // userEmail: req.user.email,
    // userEmail_stringified: JSON.stringify(req.user.email),
  });
});

router.post('/addNewProducts', addNewProducts)
router.get('/addNewProducts', addNewProducts) //trying this for GET request when clicking anchor tags for pagination
router.post('/saveProdArrAsCSV', saveProdArrAsCSV)
router.post('/loadEDI_Table', loadEDI_Table)
router.post('/createImwCatTable', createImwCatTable)
router.post('/populateImwCatTable', populateImwCatTable)

module.exports = router;