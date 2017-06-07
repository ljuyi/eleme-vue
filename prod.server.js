var express = require('express');
var config = require('./config/index');

var port = process.env.PORT || config.build.port;

var app = express();

var router = express.Router();
router.get('/', function(req, res, next) {
    req.url = '/index.html';
    next();
})

app.use(router);

var appData = require('./static/data.json');
var seller = appData.seller;
var goods = appData.goods;
var ratings = appData.ratings;

var apiRoutes = express.Router();

// 卖家信息
apiRoutes.get('/seller', function (req, res) {
  res.json({
    errno: 0,       // 0标识请求字段是正常的,比如权限限制,根据业务定的错误码
    data: seller
  })
})
// 商品
apiRoutes.get('/goods', function (req, res) {
  res.json({
    errno: 0,
    data: goods
  })
})
// 评论
apiRoutes.get('/rating', function (req, res) {
  res.json({
    errno: 0,
    data: ratings
  })
})

app.use('/api',apiRoutes);

app.use(express.static('./dist'));

module.exports = app.listen(port, function(err) {
    if (err) {
        console.log(err);
        return;
    }
    console.log('Listening at http://localhost:9000');
});
