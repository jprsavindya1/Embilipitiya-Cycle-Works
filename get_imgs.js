const cheerio = require('cheerio');
const https = require('https');

https.get('https://ecw.sprintcodelabs.com/', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        const $ = cheerio.load(data);
        $('img').each((i, el) => {
            const src = $(el).attr('src');
            if (src && (src.includes('pay') || src.includes('footer') || src.includes('logo'))) {
                console.log(src);
            }
        });
    });
});
