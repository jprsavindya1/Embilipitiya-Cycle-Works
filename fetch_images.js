const https = require('https');
https.get('https://ecw.sprintcodelabs.com/', (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
        const matches = data.match(/https?:\/\/[^\s"'()]+(?:png|jpe?g|svg|webp|gif)/ig);
        if (matches) {
            matches.forEach(m => console.log(m));
        }
    });
});
