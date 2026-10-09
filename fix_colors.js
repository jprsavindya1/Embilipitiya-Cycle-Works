const fs = require('fs');
const path = require('path');

const pages = [
  'src/app/delivery-policy/page.tsx',
  'src/app/privacy-policy/page.tsx',
  'src/app/return-and-exchange-policy/page.tsx',
  'src/app/terms-and-conditions/page.tsx'
];

for (const p of pages) {
  const filePath = path.join(process.cwd(), p);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf-8');
    
    // Replace text-white on h1
    content = content.replace(/text-white/g, 'text-zinc-900 dark:text-white');
    
    // Replace text-zinc-300 on p and li
    content = content.replace(/text-zinc-300/g, 'text-zinc-600 dark:text-zinc-300');
    
    // Replace prose-invert with dark:prose-invert
    content = content.replace(/prose-invert/g, 'dark:prose-invert');
    
    // Add text color to h2 if missing
    content = content.replace(/<h2 className="text-2xl font-bold mt-8 mb-4">/g, '<h2 className="text-2xl font-bold mt-8 mb-4 text-zinc-900 dark:text-white">');
    
    fs.writeFileSync(filePath, content);
    console.log('Fixed', p);
  }
}
