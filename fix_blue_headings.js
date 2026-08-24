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
        
        // Add the fix for a > strong color inheritance
        if (!content.includes('.policy-content a strong { color: inherit; }')) {
            content = content.replace(
                /.policy-content strong \{\s*font-weight: 700;\s*color: #333;\s*\}/,
                `.policy-content strong {
          font-weight: 700;
          color: #333;
        }
        .policy-content a strong {
          color: inherit;
        }`
            );
            
            fs.writeFileSync(file, content, 'utf8');
            console.log(`Updated CSS for ${slug}`);
        } else {
            console.log(`Already fixed CSS for ${slug}`);
        }
    }
});
