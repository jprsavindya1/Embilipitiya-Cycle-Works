const fs = require('fs');

const data = fs.readFileSync('src/app/return-and-exchange-policy/page.tsx', 'utf8');
const lines = data.split('\n');

for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('RETURN ELIGIBILITY') || lines[i].includes('PRODUCT CATEGORIES')) {
        console.log(lines[i]);
    }
}
