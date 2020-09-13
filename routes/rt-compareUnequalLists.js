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
// const {
//   save2CSVpcwGen
// } = require('../sqlArch/save2CSVpcwGen')
// const {
//   loadTable_calcResPcwGen
// } = require('../sqlArch/loadTable_calcResPcwGen')
// const {
//   loadTable_compareUnequalLists
// } = require('../sqlArch/loadTable_compareUnequalLists')
// const {
//   calcResPcwGen
// } = require('../sqlArch/calcResPcwGen')
const {
  calcResCompareUnequalLists
} = require('../sqlArch/calcResCompareUnequalLists')




router.get('/', function (req, res, next) {
  res.render('vw-compareUnequalLists', {
    title: 'vw-compareUnequalLists',
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
// router.post('/save2CSVpcwGen', save2CSVpcwGen)
// router.post('/loadTable_calcResPcwGen', loadTable_calcResPcwGen)
// router.post('/loadTable_compareUnequalLists', loadTable_compareUnequalLists)
// router.post('/calcResPcwGen', calcResPcwGen)
router.post('/calcResCompareUnequalLists', calcResCompareUnequalLists)


module.exports = router;