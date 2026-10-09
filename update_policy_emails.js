const fs = require('fs');
const path = require('path');

const pages = [
  'src/app/terms-and-conditions/page.tsx',
  'src/app/privacy-policy/page.tsx',
  'src/app/return-and-exchange-policy/page.tsx',
  'src/app/delivery-policy/page.tsx'
];

for (const p of pages) {
  const fullPath = path.join(__dirname, p);
  let content = fs.readFileSync(fullPath, 'utf8');

  // Skip if already processed
  if (content.includes('getContactEmail')) continue;

  // Add import
  content = content.replace("import React from 'react';", "import React from 'react';\nimport { getContactEmail } from '@/lib/settings';");
  
  // Make component async and fetch email
  content = content.replace("export default function Page() {", "export default async function Page() {\n  const storeEmail = await getContactEmail();");

  // Replace hardcoded emails
  content = content.replace(/info@cycleworks\.lk/g, "{storeEmail}");
  content = content.replace(/info@ebilipitiyacycleworks\.com/g, "{storeEmail}");
  content = content.replace(/embilipitiyacycleworks911@gmail\.com/g, "{storeEmail}");

  // Fix interpolation inside strings if any (though in JSX text, `{storeEmail}` works as an expression if it's within tags)
  // Example: <p>Email: {storeEmail}</p> works perfectly in JSX.

  fs.writeFileSync(fullPath, content);
  console.log(`Updated ${p}`);
}
