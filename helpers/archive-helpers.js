var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var readline = require('readline');
var scrape = require('website-scraper');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj) {
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(callback) {
  var urls = [];
  var sites = fs.createReadStream(exports.paths.list);
  var rl = readline.createInterface({
    input: sites,
    crlfDelay: 100
  });
  var siteArchived = false;
  rl.on('line', (line) => {
    urls.push(line);
  }).on('close', () => {
    callback(urls);
  });
};


exports.isUrlInList = function(url, callback) {
  exports.readListOfUrls((urls) => {
    callback(urls.includes(url));
  });
};

exports.addUrlToList = function(url, callback) {
  fs.appendFile(exports.paths.list, url + '\n', callback);
};

exports.isUrlArchived = function(url, callback) {
  fs.access(exports.paths.archivedSites + '/' + url, (err) => {
    callback(!err);
  });
};

exports.downloadUrls = function(urls) {
  urls.forEach((url) => {
    
    exports.isUrlArchived(url, (exists) => {
      if (!exists) {
        console.log(url);
        var opts = {
          urls: [url],
          directory: exports.paths.archivedSites + '/' + url
        };
        
        scrape(opts).then((res) => {
          console.log('complete');
        }).catch((err) => {
          console.log('fail', err);
        });
      }
    });
    
  }); 
};
