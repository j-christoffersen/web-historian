var path = require('path');
var archive = require('../helpers/archive-helpers');

var http = require('./http-helpers.js');
var fs = require('fs');
var readline = require('readline');
var qs = require('querystring');
// require more modules/folders here!

// action at router[path][base][method]


// serve up static files
// var getPublic = function(res, asset) {
//   var filePath = archive.paths.siteAssets + '/' + asset;
//   if (fs.existsSync(filePath)) {
//     res.writeHead(200, helpers.headers);
//     var stream = fs.createReadStream(filePath).pipe(res);
//   } else {
//     res.writeHead(404, headers);
//     res.end();
//   }
// };


var router = {
  '/': {
    
    default: {
      GET: function(req, res, asset) {
        http.serveAssets(res, asset);
      }
    },
    
    '': {  
      GET: function(req, res) {
        http.serveAssets(res, 'index.html');
      },
      
  
      POST: function(req, res) {
        
        var data = '';
        req.on('data', function(chunk) {
          data += chunk;
        });
        
        req.on('end', function() {
          var url = qs.parse(data).url;
          archive.isUrlInList(url, (isArchived) => {
            if (isArchived) {
              http.redirect(req, res, url);
            } else {
              http.redirect(req, res, 'loading.html');
              archive.addUrlToList(url, () => {});
            }
          });
        });
        
      }
    }
  }
};

exports.handleRequest = function (req, res) {
  
  console.log('Serving request type ' + req.method + ' for url ' + req.url);
  
  //TODO handle 404s
  var parseObj = path.parse(req.url);
  
  
  var dir = router[parseObj.dir];
  if (dir) {
    var route = dir[parseObj.base] || dir.default;
    var action = route[req.method] || http.methodNotAllowed;
  } else {
    var action = http.notFound;
  }
  
  action(req, res, parseObj.base);
  
};
