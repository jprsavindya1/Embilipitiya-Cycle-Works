const cheerio = require('cheerio');
const https = require('https');

https.get('https://ecw.sprintcodelabs.com/', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        const $ = cheerio.load(data);
        console.log($('footer').html());
    });
});
