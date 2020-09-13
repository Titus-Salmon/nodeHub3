const express = require('express')
const router = express.Router()

//v//destructuring////////////////////////////////
// const {
//   ensureAuthenticated
// } = require('../config/auth-t0dt1tz1')

const {
  createRBtable
} = require('../sqlArch/createRBtable')
const {
  deleteRBtable
} = require('../sqlArch/deleteRBtable')
const {
  populateRBtable
} = require('../sqlArch/populateRBtable')
const {
  queryRBdb
} = require('../sqlArch/queryRBdb')
const {
  nhcrtDisplay
} = require('../sqlArch/nhcrtDisplay')
const {
  save2CSVstockfilter
} = require('../sqlArch/save2CSVstockfilter')
const {
  loadTable_MySqlHub
} = require('../sqlArch/loadTable_MySqlHub')
const {
  loadTable_calcResStockFilter_UPC
} = require('../sqlArch/loadTable_calcResStockFilter_UPC')
const {
  calcResStockFilter_UPC
} = require('../sqlArch/calcResStockFilter_UPC')




router.get('/', function (req, res, next) {
  res.render('vw-stockFilter_UPC', {
    title: 'vw-stockFilter_UPC',
    // username: req.user.name,
    // userEmail: req.user.email,
    // userEmail_stringified: JSON.stringify(req.user.email),
  });
});

router.post('/createRBtable', createRBtable)
router.post('/deleteRBtable', deleteRBtable)
router.post('/populateRBtable', populateRBtable)
router.post('/queryRBdb', queryRBdb)
router.post('/nhcrtDisplay', nhcrtDisplay)
router.post('/save2CSVstockfilter', save2CSVstockfilter)

router.post('/loadTable_calcResStockFilter_UPC', loadTable_calcResStockFilter_UPC)
router.post('/calcResStockFilter_UPC', calcResStockFilter_UPC)


module.exports = router;