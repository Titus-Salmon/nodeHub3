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
//   nhcrtEdiJoin
// } = require('../sqlArch/nhcrtEdiJoin')
const {
  nhcrtInfraSF_Join
} = require('../sqlArch/nhcrtInfraSF_Join')
const {
  save2CSVreviewSfAud
} = require('../sqlArch/save2CSVreviewSfAud')
const {
  calcResultsSfAud3
} = require('../sqlArch/calcResultsSfAud3')
const {
  loadTable_signFilterChecker
} = require('../sqlArch/loadTable_signFilterChecker')




router.get('/', function (req, res, next) {
  res.render('vw-signFilterChecker', {
    title: 'vw-signFilterChecker',
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
router.post('/nhcrtInfraSF_Join', nhcrtInfraSF_Join)
router.post('/save2CSVreviewSfAud', save2CSVreviewSfAud)
router.post('/calcResultsSfAud3', calcResultsSfAud3)
router.post('/loadTable_signFilterChecker', loadTable_signFilterChecker)


module.exports = router;