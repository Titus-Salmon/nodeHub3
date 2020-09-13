const express = require('express')
const router = express.Router()

//v//destructuring////////////////////////////////
const {
  createNhcrtRbInvTable
} = require('../sqlArch/createNhcrtRbInvTable')
const {
  populateNhcrtRbInvTable
} = require('../sqlArch/populateNhcrtRbInvTable')
const {
  query_rb_inventory
} = require('../sqlArch/query_rb_inventory')
const {
  calcResRbInvUpdater
} = require('../sqlArch/calcResRbInvUpdater')
const {
  rbInvUpdateAudit
} = require('../sqlArch/rbInvUpdateAudit')
// const {
//   rbInvUpdateAuditSaveCSV_ind
// } = require('../sqlArch/rbInvUpdateAuditSaveCSV_ind')
const {
  save2CSVrbInvAudit
} = require('../sqlArch/save2CSVrbInvAudit')




router.get('/', function (req, res, next) {
  res.render('vw-rbInvUpdater', {
    title: 'vw-rbInvUpdater',
    // username: req.user.name,
    // userEmail: req.user.email,
    // userEmail_stringified: JSON.stringify(req.user.email),
  });
});

router.post('/createNhcrtRbInvTable', createNhcrtRbInvTable)
router.post('/populateNhcrtRbInvTable', populateNhcrtRbInvTable)
router.post('/query_rb_inventory', query_rb_inventory)
router.post('/calcResRbInvUpdater', calcResRbInvUpdater)
router.post('/rbInvUpdateAudit', rbInvUpdateAudit)
// router.post('/rbInvUpdateAuditSaveCSV_ind', rbInvUpdateAuditSaveCSV_ind)
router.post('/save2CSVrbInvAudit', save2CSVrbInvAudit)

module.exports = router;