var express = require('express');
var router = express.Router();
// const {
//   ensureAuthenticated
// } = require('../config/auth-t0dt1tz1');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('vw-index', {
    // title: 'vw-index'
    title: 'vw-index'
  });
});

/* GET dashboard page. */
// router.get('/dashboard', ensureAuthenticated, function (req, res, next) {
//   res.render('vw-dashboard', {
//     title: 'vw-dashboard',
//     username: req.user.name,
//     userEmail: req.user.email,
//     userEmail_stringified: JSON.stringify(req.user.email),
//   });
// });

router.get('/dashboard', function (req, res, next) {
  res.render('vw-dashboard', {
    title: 'vw-dashboard',
    // username: req.user.name,
    // userEmail: req.user.email,
    // userEmail_stringified: JSON.stringify(req.user.email),
  });
});

module.exports = router;