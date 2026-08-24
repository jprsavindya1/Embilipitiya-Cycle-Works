import urllib.request
from bs4 import BeautifulSoup
import os
import re

pages = [
    ("delivery-policy", "Delivery Policy"),
    ("terms-and-conditions", "Terms and Conditions"),
    ("return-and-exchange-policy", "Return and Exchange Policy"),
    ("privacy-policy", "Privacy Policy")
]

base_url = "https://ecw.sprintcodelabs.com/"

for slug, title in pages:
    url = base_url + slug + "/"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        html = urllib.request.urlopen(req).read()
        soup = BeautifulSoup(html, 'html.parser')
        
        content = soup.find('div', id='content')
        if not content:
            print(f"Content not found for {slug}")
            continue
            
        # extract all elements inside content
        # we will convert it to a simple React component structure
        
        page_dir = f"src/app/{slug}"
        os.makedirs(page_dir, exist_ok=True)
        
        # for simplicity, let's just get the text and convert paragraphs
        texts = []
        for element in content.descendants:
            if element.name in ['h1', 'h2', 'h3', 'h4']:
                texts.append(f"<h2 className='text-2xl font-bold mt-8 mb-4'>{element.get_text(strip=True)}</h2>")
            elif element.name == 'p':
                text = element.get_text(strip=True)
                if text:
                    texts.append(f"<p className='mb-4 text-zinc-300'>{text}</p>")
            elif element.name == 'ul':
                items = []
                for li in element.find_all('li'):
                    items.append(f"<li className='mb-2 text-zinc-300'>{li.get_text(strip=True)}</li>")
                if items:
                    items_str = "".join(items)
                    texts.append(f"<ul className='list-disc pl-6 mb-4'>{items_str}</ul>")
        
        # deduplicate consecutive identical tags (naive)
        final_texts = []
        for t in texts:
            if not final_texts or final_texts[-1] != t:
                final_texts.append(t)
                
        content_jsx = "\n".join(final_texts)
        
        tsx = f"""export const metadata = {{
  title: '{title} - Embilipitiya Cycle Works',
}};

export default function Page() {{
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl pt-32">
      <h1 className="text-4xl font-bold mb-8 text-white">{title}</h1>
      <div className="prose prose-invert max-w-none">
        {content_jsx}
      </div>
    </div>
  );
}}
"""
        with open(f"{page_dir}/page.tsx", "w", encoding='utf-8') as f:
            f.write(tsx)
        print(f"Generated {slug}")
    except Exception as e:
        print(f"Error for {slug}: {e}")
