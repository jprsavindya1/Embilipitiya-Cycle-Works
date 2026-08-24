const fs = require('fs');
const path = require('path');

const pages = [
    'delivery-policy',
    'terms-and-conditions',
    'return-and-exchange-policy',
    'privacy-policy'
];

const newStyle = `<style>{\`
        .policy-content {
          font-size: 14px;
          line-height: 1.6;
          color: #666;
        }
        .dark .policy-content {
          color: #d1d5db;
        }
        .policy-content h1 {
          font-size: 24px;
          font-weight: 700;
          margin-bottom: 24px;
          text-transform: uppercase;
          color: #444;
        }
        .dark .policy-content h1 {
          color: #fff;
        }
        .policy-content h2, .policy-content h3, .policy-content h4, .policy-content h5 {
          color: #2196F3;
          font-weight: 700;
          margin-top: 24px;
          margin-bottom: 16px;
        }
        .policy-content h2, .policy-content h3 {
          font-size: 16px;
          text-transform: uppercase;
        }
        .policy-content p {
          margin-bottom: 16px;
        }
        .policy-content ul {
          list-style-type: disc;
          padding-left: 20px;
          margin-bottom: 16px;
        }
        .policy-content li {
          margin-bottom: 10px;
        }
        .policy-content table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 24px;
          font-size: 13px;
        }
        .policy-content th, .policy-content td {
          border: 1px solid #e5e7eb;
          padding: 10px 14px;
          text-align: left;
          color: #555;
        }
        .dark .policy-content th, .dark .policy-content td {
          border-color: #374151;
          color: #d1d5db;
        }
        .policy-content th {
          font-weight: 600;
          background-color: #f9fafb;
          color: #333;
        }
        .dark .policy-content th {
          background-color: #1f2937;
          color: #f3f4f6;
        }
        .policy-content a {
          color: #2196F3;
          text-decoration: none;
        }
        .policy-content a:hover {
          text-decoration: underline;
        }
        .policy-content strong {
          font-weight: 700;
          color: #333;
        }
        .dark .policy-content strong {
          color: #f3f4f6;
        }
      \`}</style>`;

pages.forEach(slug => {
    const file = path.join(__dirname, 'src', 'app', slug, 'page.tsx');
    if (fs.existsSync(file)) {
        let content = fs.readFileSync(file, 'utf8');
        
        // Remove existing <style>...</style>
        content = content.replace(/<style>\{`[\s\S]*?`\}<\/style>/, newStyle);
        
        // Also remove the wrapper classes that conflict with the style block
        content = content.replace(/className="policy-content text-zinc-800 dark:text-zinc-200"/g, 'className="policy-content"');
        
        fs.writeFileSync(file, content, 'utf8');
        console.log(`Updated CSS for ${slug}`);
    }
});
