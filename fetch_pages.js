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
            const content = $('#content');
            if (!content.length) {
                console.log(`Content not found for ${page.slug}`);
                return;
            }
            
            let htmlParts = [];
            content.find('h1, h2, h3, h4, p, ul').each((i, el) => {
                const tag = el.tagName.toLowerCase();
                const text = $(el).text().trim().replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\{/g, '&#123;').replace(/\}/g, '&#125;');
                if (!text) return;
                
                if (['h1', 'h2', 'h3', 'h4'].includes(tag)) {
                    htmlParts.push(`<h2 className="text-2xl font-bold mt-8 mb-4">${text}</h2>`);
                } else if (tag === 'p') {
                    htmlParts.push(`<p className="mb-4 text-zinc-300 leading-relaxed">${text}</p>`);
                } else if (tag === 'ul') {
                    let liParts = [];
                    $(el).find('li').each((j, li) => {
                        const liText = $(li).text().trim().replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\{/g, '&#123;').replace(/\}/g, '&#125;');
                        liParts.push(`<li className="mb-2 text-zinc-300">${liText}</li>`);
                    });
                    if (liParts.length > 0) {
                        htmlParts.push(`<ul className="list-disc pl-6 mb-4">\n${liParts.join('\n')}\n</ul>`);
                    }
                }
            });
            
            const jsxContent = htmlParts.join('\n');
            const fileContent = `import React from 'react';

export const metadata = {
  title: '${page.title} - Embilipitiya Cycle Works',
};

export default function Page() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl pt-32">
      <h1 className="text-4xl font-bold mb-8 text-white">${page.title}</h1>
      <div className="prose prose-invert max-w-none">
        ${jsxContent}
      </div>
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
