var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const helmet = require('helmet')

const dotenv = require('dotenv') //t0d
dotenv.config() //t0d

// var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

const indexRouter = require('./routes/rt-index'); //t0d
const tsqlTableHubRouter = require('./routes/rt-tsqlTableHub') //t0d
const MySqlTableHubRouter = require('./routes/rt-MySqlTableHub') //t0d
const rainbowCatTableHubRouter = require('./routes/rt-rainbowCatTableHub') //t0d
// const v_InventoryMaster_queryRouter = require('./routes/rt-v_InventoryMaster_query') //t0d
const imwGeneratorRouter = require('./routes/rt-imwGenerator') //t0d
const signFilterCheckerRouter = require('./routes/rt-signFilterChecker') //t0d
const stockFilter_UPCRouter = require('./routes/rt-stockFilter_UPC') //t0d
const sfUPC_w_RBinvUpdaterRouter = require('./routes/rt-sfUPC_w_RBinvUpdater') //t0d
const pcwGenRouter = require('./routes/rt-pcwGen') //t0d
const pcwGenINFRARouter = require('./routes/rt-pcwGenINFRA') //t0d
const compareUnequalListsRouter = require('./routes/rt-compareUnequalLists') //t0d
const rbInvUpdaterRouter = require('./routes/rt-rbInvUpdater') //t0d
const imwUnitTypeRouter = require('./routes/rt-imwUnitType') //t0d
const minShelfQtyRouter = require('./routes/rt-minShelfQty') //t0d
const rbCatUpdtTrkrRouter = require('./routes/rt-rbCatUpdtTrkr') //t0d
const keheUnfiWSdiffRouter = require('./routes/rt-keheUnfiWSdiff') //t0d
const keheSelectWSdiffRouter = require('./routes/rt-keheSelectWSdiff') //t0d
const optItemSalesRouter = require('./routes/rt-optItemSales') //t0d
const venProfRouter = require('./routes/rt-venProf') //t0d
const cstLstDtlRouter = require('./routes/rt-cstLstDtl') //t0d

var app = express();

app.use(helmet()) //t0d

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));

app.use(express.json({
  limit: '500000mb' //MUST SET THIS HIGH, OTHERWISE LARGE CATALOGS (KEHE) WILL THROW error-request entity too large
  //originally had it set at 50mb, but even that wasn't high enough for KEKE
  //then set it to 500mb, and that worked for large catalogs. However, when bringing HERE geolocation into play for 15,000+
  //geodata points on a map, frontend hangs, so trying setting to absurdly high 500000mb... but that didn't work...
}));
app.use(express.urlencoded({
  limit: '500000mb', //MUST SET THIS HIGH, OTHERWISE LARGE CATALOGS (KEHE) WILL THROW error-request entity too large
  extended: true
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use('/tsqlTableHub', tsqlTableHubRouter) //t0d
app.use('/MySqlTableHub', MySqlTableHubRouter) //t0d
app.use('/rainbowCatTableHub', rainbowCatTableHubRouter) //t0d
// app.use('/v_InventoryMaster_query', v_InventoryMaster_queryRouter) //t0d
app.use('/imwGenerator', imwGeneratorRouter) //t0d
app.use('/signFilterChecker', signFilterCheckerRouter) //t0d
app.use('/stockFilter_UPC', stockFilter_UPCRouter) //t0d
app.use('/sfUPC_w_RBinvUpdater', sfUPC_w_RBinvUpdaterRouter) //t0d
app.use('/pcwGen', pcwGenRouter) //t0d
app.use('/pcwGenINFRA', pcwGenINFRARouter) //t0d
app.use('/compareUnequalLists', compareUnequalListsRouter) //t0d
app.use('/rbInvUpdater', rbInvUpdaterRouter) //t0d
app.use('/imwUnitType', imwUnitTypeRouter) //t0d
app.use('/minShelfQty', minShelfQtyRouter) //t0d
app.use('/rbCatUpdtTrkr', rbCatUpdtTrkrRouter) //t0d
app.use('/keheUnfiWSdiff', keheUnfiWSdiffRouter) //t0d
app.use('/keheSelectWSdiff', keheSelectWSdiffRouter) //t0d
app.use('/optItemSales', optItemSalesRouter) //t0d
app.use('/venProf', venProfRouter) //t0d
app.use('/cstLstDtl', cstLstDtlRouter) //t0d

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;