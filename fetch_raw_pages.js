const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const https = require('https');

const pages = [
    { slug: 'delivery-policy', title: 'Delivery Policy' },
    { slug: 'terms-and-conditions', title: 'Terms and Conditions' },
    { slug: 'return-and-exchange-policy', title: 'Return and Exchange Policy' },
    { slug: 'privacy-policy', title: 'Privacy Policy' }
];

const baseUrl = 'https://ecw.sprintcodelabs.com/';

pages.forEach(page => {
    const url = baseUrl + page.slug + '/';
    https.get(url, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
            const $ = cheerio.load(data);
            
            // The main content is typically in .col-inner inside .page-wrapper
            let contentHtml = $('.page-wrapper .col-inner').html();
            
            if (!contentHtml) {
                console.log(`Content not found for ${page.slug}`);
                return;
            }
            
            // Clean up the HTML a bit if needed (remove empty elements, etc.)
            // But we'll keep it mostly raw to preserve tables and structure.
            
            // We need to escape backticks and $ for template literals if we put it in a string
            const escapedHtml = contentHtml
                .replace(/\\/g, '\\\\')
                .replace(/`/g, '\\`')
                .replace(/\$/g, '\\$');

            const fileContent = `import React from 'react';

export const metadata = {
  title: '${page.title} - Embilipitiya Cycle Works',
};

export default function Page() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl pt-32">
      <div 
        className="policy-content text-zinc-800 dark:text-zinc-200"
        dangerouslySetInnerHTML={{ __html: \`${escapedHtml}\` }} 
      />
      
      <style>{\`
        .policy-content h1 {
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 2rem;
          text-transform: uppercase;
        }
        .policy-content h2, .policy-content h3, .policy-content h4, .policy-content h5 {
          color: #2196F3; /* Adjust to match the exact blue */
          font-weight: 700;
          margin-top: 1.5rem;
          margin-bottom: 1rem;
        }
        .policy-content h2, .policy-content h3 {
          font-size: 1.1rem;
          text-transform: uppercase;
        }
        .policy-content p {
          margin-bottom: 1rem;
          line-height: 1.6;
        }
        .policy-content ul {
          list-style-type: disc;
          padding-left: 1.5rem;
          margin-bottom: 1rem;
        }
        .policy-content li {
          margin-bottom: 0.5rem;
        }
        .policy-content table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 1.5rem;
          font-size: 0.9rem;
        }
        .policy-content th, .policy-content td {
          border: 1px solid #e5e7eb;
          padding: 0.75rem;
          text-align: left;
        }
        .dark .policy-content th, .dark .policy-content td {
          border-color: #374151;
        }
        .policy-content th {
          font-weight: 600;
        }
        .policy-content a {
          color: #2196F3;
          text-decoration: underline;
        }
        .policy-content strong {
          font-weight: 700;
          color: inherit;
        }
      \`}</style>
    </div>
  );
}
`;
            const dir = path.join(__dirname, 'src', 'app', page.slug);
            fs.mkdirSync(dir, { recursive: true });
            fs.writeFileSync(path.join(dir, 'page.tsx'), fileContent, 'utf8');
            console.log(`Generated ${page.slug}`);
        });
    }).on('error', err => console.log(`Error for ${page.slug}:`, err));
});
