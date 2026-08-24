const cheerio = require('cheerio');
const https = require('https');

https.get('https://ecw.sprintcodelabs.com/terms-and-conditions/', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        const $ = cheerio.load(data);
        const contentHtml = $('.page-wrapper .col-inner').html();
        if (contentHtml) {
            console.log(contentHtml.substring(0, 1000));
        }
    });
});
