const express = require('express')
const router = express.Router()

//v//destructuring////////////////////////////////
const {
  keheSelectWSdiff
} = require('../keheSelectWSdiff/keheSelectWSdiff')
const {
  save2XLS_keheSelectWSdiff
} = require('../keheSelectWSdiff/save2XLS_keheSelectWSdiff')



router.get('/', function (req, res, next) {
  res.render('vw-keheSelectWSdiff', {
    title: 'vw-keheSelectWSdiff',
    // username: req.user.name,
    // userEmail: req.user.email,
    // userEmail_stringified: JSON.stringify(req.user.email),
  });
});

router.post('/keheSelectWSdiff', keheSelectWSdiff)
router.post('/save2XLS_keheSelectWSdiff', save2XLS_keheSelectWSdiff)

module.exports = router;