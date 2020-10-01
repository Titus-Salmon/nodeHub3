const express = require('express')
const router = express.Router()

//v//destructuring////////////////////////////////
// const {
//   ensureAuthenticated
// } = require('../config/auth-t0dt1tz1')

const {
  cstLstDtl
} = require('../sqlArch/cstLstDtl/cstLstDtl')




router.get('/', function (req, res, next) {
  res.render('vw-cstLstDtl', {
    title: 'vw-cstLstDtl',
    // username: req.user.name,
    // userEmail: req.user.email,
    // userEmail_stringified: JSON.stringify(req.user.email),
  });
});

router.post('/cstLstDtl', cstLstDtl)


module.exports = router;