const express = require('express')
const router = express.Router()

//v//destructuring////////////////////////////////
// const {
//   ensureAuthenticated
// } = require('../config/auth-t0dt1tz1')

const {
  createTsqlTableSimple
} = require('../sqlArch/createTsqlTableSimple')
const {
  deleteTsqlTableSimple
} = require('../sqlArch/deleteTsqlTableSimple')
const {
  queryCatapultDB
} = require('../sqlArch/queryCatapultDB')
const {
  populateTsqlTable
} = require('../sqlArch/populateTsqlTable')
const {
  v_InventoryMasterQuery
} = require('../sqlArch/v_InventoryMasterQuery')
const {
  custPlusAddr
} = require('../sqlArch/custPlusAddr/custPlusAddr')

const {
  rbInvUpdaterTsql
} = require('../sqlArch/rbInvUpdaterTsql')

const {
  OrderingInfoQuery
} = require('../sqlArch/OrderingInfoQuery')
const {
  save2CSV
} = require('../sqlArch/save2CSV')
const {
  save2CSVcreatePop
} = require('../sqlArch/save2CSVcreatePop')
const {
  save2XLS_tsql
} = require('../sqlArch/save2XLS_tsql')
const {
  save2XLS_tsql_autoreorder
} = require('../sqlArch/save2XLS_tsql_autoreorder')


router.get('/', function (req, res, next) {
  res.render('vw-tsqlTableHub', {
    title: 'T-SQL Table Hub',
    // username: req.user.name,
    // userEmail: req.user.email,
    // userEmail_stringified: JSON.stringify(req.user.email),
  });
});

router.post('/createEmptyTsqlTable', createTsqlTableSimple)
router.post('/deleteTsqlTable', deleteTsqlTableSimple)
router.post('/queryCatapultDB', queryCatapultDB)
router.post('/populateTsqlTable', populateTsqlTable)
router.post('/queryInvMasterTable', v_InventoryMasterQuery)
router.post('/custPlusAddr', custPlusAddr)

router.post('/rbInvUpdaterTsql', rbInvUpdaterTsql)

router.post('/queryOrderingInfoTable', OrderingInfoQuery)
router.post('/save2CSV', save2CSV)
router.post('/save2CSVcreatePop', save2CSVcreatePop)
router.post('/save2XLS_tsql', save2XLS_tsql)
router.post('/save2XLS_tsql_autoreorder', save2XLS_tsql_autoreorder)

module.exports = router;