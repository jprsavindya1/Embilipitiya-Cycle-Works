const fs = require('fs');
const path = require('path');

const pages = [
    'delivery-policy',
    'terms-and-conditions',
    'return-and-exchange-policy',
    'privacy-policy'
];

pages.forEach(slug => {
    const file = path.join(__dirname, 'src', 'app', slug, 'page.tsx');
    if (fs.existsSync(file)) {
        let content = fs.readFileSync(file, 'utf8');
        
        // fix h1
        content = content.replace(/text-4xl font-bold mb-8 text-white/g, 'text-4xl font-bold mb-8 text-zinc-900 dark:text-white');
        
        // fix h2
        content = content.replace(/className="text-2xl font-bold mt-8 mb-4"/g, 'className="text-2xl font-bold mt-8 mb-4 text-zinc-900 dark:text-white"');
        
        // fix p
        content = content.replace(/text-zinc-300/g, 'text-zinc-700 dark:text-zinc-300');
        
        fs.writeFileSync(file, content, 'utf8');
        console.log(`Updated ${slug}`);
    }
});
