const cheerio = require('cheerio');
const request = require('request');
var fs = require('file-system');

request({
    method: 'GET',
    url: 'http://www.eurestonsite.com/mckesson/Pages/Home.aspx',
    headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X)'}
}, (err, res, body) => {

    if (err) return console.error(err);

    var $ = cheerio.load(body);

    $('a').each(function() {
   var text = $(this).text();
   var link = $(this).attr('href');

   if(link && link.match(/Menus/)){
     console.log(text + ' --> ' + link);
     request({url: link, encoding: null},  function(error, response, body){
        fs.writeFileSync('menu.pdf',body);
    })
   };
 });

});