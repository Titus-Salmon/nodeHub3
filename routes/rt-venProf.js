const express = require('express')
const router = express.Router()

//v//destructuring////////////////////////////////
// const {
//   ensureAuthenticated
// } = require('../config/auth-t0dt1tz1')


const {
  venProf
} = require('../sqlArch/venProf')





router.get('/', function (req, res, next) {
  res.render('vw-venProf', {
    title: 'vw-venProf',
    // username: req.user.name,
    // userEmail: req.user.email,
    // userEmail_stringified: JSON.stringify(req.user.email),
  });
});

router.post('/venProf', venProf)


module.exports = router;