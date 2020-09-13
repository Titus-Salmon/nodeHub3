const express = require('express')
const router = express.Router()

//v//destructuring////////////////////////////////
const {
  keheUnfiWSdiff
} = require('../keheUnfiWSdiff/keheUnfiWSdiff')
const {
  save2XLS_keheUnfiWSdiff
} = require('../keheUnfiWSdiff/save2XLS_keheUnfiWSdiff')



router.get('/', function (req, res, next) {
  res.render('vw-keheUnfiWSdiff', {
    title: 'vw-keheUnfiWSdiff',
    // username: req.user.name,
    // userEmail: req.user.email,
    // userEmail_stringified: JSON.stringify(req.user.email),
  });
});

router.post('/keheUnfiWSdiff', keheUnfiWSdiff)
router.post('/save2XLS_keheUnfiWSdiff', save2XLS_keheUnfiWSdiff)

module.exports = router;