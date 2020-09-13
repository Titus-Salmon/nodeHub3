const express = require('express')
const router = express.Router()

//v//destructuring////////////////////////////////
// const {
//   ensureAuthenticated
// } = require('../config/auth-t0dt1tz1')

const {
  rbCatUpdtTrkrDisplay
} = require('../rbcatUpdateTracker/rbCatUpdtTrkrDisplay')
const {
  save2XLSrbcut
} = require('../rbcatUpdateTracker/save2XLSrbcut')


router.get('/', function (req, res, next) {
  res.render('vw-rbCatUpdtTrkr', {
    title: 'vw-rbCatUpdtTrkr',
    // username: req.user.name,
    // userEmail: req.user.email,
    // userEmail_stringified: JSON.stringify(req.user.email),
  });
});

router.post('/rbCatUpdtTrkrDisplay', rbCatUpdtTrkrDisplay)
router.post('/save2XLSrbcut', save2XLSrbcut)


module.exports = router;