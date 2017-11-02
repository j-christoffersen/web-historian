var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');

exports.headers = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10, // Seconds.
  'Content-Type': 'text/html'
};

exports.serveAssets = function(res, asset) {
  var siteFilePath = archive.paths.siteAssets + '/' + asset;
  var archiveFilePath = archive.paths.archivedSites + '/' + asset + '/index.html';
  if (fs.existsSync(siteFilePath)) {
    res.writeHead(200, exports.headers);
    var stream = fs.createReadStream(siteFilePath).pipe(res);
  } else if (fs.existsSync(archiveFilePath)) {
    res.writeHead(200, exports.headers);
    var stream = fs.createReadStream(archiveFilePath).pipe(res);
  } else {
    exports.notFound(null, res);
  }
};

//Serve it of Fetch it
exports.redirect = function(req, res, asset) {
  res.writeHead(302, {Location: '/' + asset});
  res.end();
};

exports.methodNotAllowed = function(req, res) {
  res.writeHead(405, exports.headers);
  res.end();
};

exports.notFound = function(req, res) {
  res.writeHead(404, exports.headers);
  res.end();
};




// As you progress, keep thinking about what helper functions you can put here!
