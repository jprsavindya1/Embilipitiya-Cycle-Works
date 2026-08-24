const cheerio = require('cheerio');
const https = require('https');

https.get('https://ecw.sprintcodelabs.com/delivery-policy/', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        const $ = cheerio.load(data);
        const content = $('.page-wrapper').html() || $('#content').html() || $('main').html();
        console.log("Found content length:", content ? content.length : 0);
        if (content) {
            console.log(content.substring(0, 500));
        }
    });
});
