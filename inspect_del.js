const fs = require('fs');

const data = fs.readFileSync('src/app/delivery-policy/page.tsx', 'utf8');
const lines = data.split('\n');

for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('DELIVERY OPTIONS') || lines[i].includes('SHIPPING COSTS')) {
        console.log(lines[i]);
    }
}
