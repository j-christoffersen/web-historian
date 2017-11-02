// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.

var archive = require('../helpers/archive-helpers');
var cron = require('cron');
 
new cron.CronJob('00 * * * * *', function() {
  console.log('You will see this message every minute');
  archive.readListOfUrls(archive.downloadUrls);
}, null, true, 'America/Los_Angeles');
