const express = require('express')
const router = express.Router()

//v//destructuring////////////////////////////////
const {
  generateMinShelfQtyIMW
} = require('../minShelfQty/generateMinShelfQtyIMW')
const {
  saveCSVminShelfQty
} = require('../minShelfQty/saveCSVminShelfQty')




router.get('/', function (req, res, next) {
  res.render('vw-minShelfQty', {
    title: 'vw-minShelfQty',
    // username: req.user.name,
    // userEmail: req.user.email,
    // userEmail_stringified: JSON.stringify(req.user.email),
  });
});

router.post('/generateMinShelfQtyIMW', generateMinShelfQtyIMW)
router.post('/saveCSVminShelfQty', saveCSVminShelfQty)

module.exports = router;