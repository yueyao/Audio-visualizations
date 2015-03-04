var express = require('express');
var router = express.Router();

var path = require("path")
var media = path.join(__dirname,"../public/media")

/* GET home page. */
router.get('/', function(req, res) {
  var fs = require("fs")
  fs.readdir(media,function(err,names){
    if(err){
        res.render('index', { title: 'error~' ,musics:[]});
    }else{
        res.render('index', { title: 'webAudio音乐可视化~' ,musics:names});
    }
  })

});

module.exports = router;
