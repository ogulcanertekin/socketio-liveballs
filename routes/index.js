var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Live Balls' });
});

router.get('/getEnv', function(req, res, next) {        //configFactoryde buraya yapılan istek hangi ortamdaysam product-develop ona göre dogru datayı dönecek.
  const envData = require('../config/env.json')[process.env.NODE_ENV || 'development'];
  res.json(envData);
});

module.exports = router;
