const express = require('express')
const router = express.Router()

//v//destructuring////////////////////////////////
// const {
//   ensureAuthenticated
// } = require('../config/auth-t0dt1tz1')

const {
  rainbowCatDisplay
} = require('../rainbowCat/rainbowCatDisplay')
const {
  save2CSVrbCatTbl
} = require('../rainbowCat/save2CSVrbCatTbl')
const {
  createRainbowCatTbl
} = require('../rainbowCat/createRainbowCatTbl')
const {
  populateRainbowCatTable
} = require('../rainbowCat/populateRainbowCatTable')
const {
  rbCatExtractor
} = require('../rainbowCat/rbCatExtractor')





router.get('/', function (req, res, next) {
  res.render('vw-rainbowCatTableHub', {
    title: 'vw-rainbowCatTableHub',
    // username: req.user.name,
    // userEmail: req.user.email,
    // userEmail_stringified: JSON.stringify(req.user.email),
  });
});

router.post('/rainbowCatDisplay', rainbowCatDisplay)
router.post('/save2CSVrbCatTbl', save2CSVrbCatTbl)
router.post('/createRainbowCatTbl', createRainbowCatTbl)
router.post('/populateRainbowCatTable', populateRainbowCatTable)
router.post('/rbCatExtractor', rbCatExtractor)


module.exports = router;