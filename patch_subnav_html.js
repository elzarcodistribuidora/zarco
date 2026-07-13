const fs = require('fs');
const path = require('path');

const files = [
    'cremeria.json',
    'embutidos.json',
    'abarrotes-basicos.json',
    'tiendas.json',
    'restaurantes.json',
    'cafeterias.json'
];

for (const file of files) {
    const filePath = path.join(__dirname, 'src/webflow', file);
    if (!fs.existsSync(filePath)) continue;

    let data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    let body = data.body;

    // We need to find the sector-subnav block.
    // It usually starts with <div class="sector-subnav reveal"> or similar
    // and ends after the </ul></div></div>
    
    // Let's use a regex that captures everything from sector-subnav up to the closing </ul>
    // and then the closing divs.
    const subnavRegex = /<div\s+class="[^"]*sector-subnav[^"]*"[\s\S]*?<ul\s+class="subnav-links">([\s\S]*?)<\/ul>\s*<\/div>\s*<\/div>/;
    
    const match = body.match(subnavRegex);
    if (match) {
        let linksHtml = match[1];
        
        // Remove <li> and </li> tags
        linksHtml = linksHtml.replace(/<li[^>]*>/g, '').replace(/<\/li>/g, '');
        
        // Clean up empty lines
        linksHtml = linksHtml.split('\n').filter(line => line.trim() !== '').join('\n');

        const newNavHtml = `<nav class="sector-subnav reveal">
    <ul class="subnav-links">
${linksHtml}
    </ul>
</nav>`;

        body = body.replace(subnavRegex, newNavHtml);
        data.body = body;
        
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
        console.log(`Successfully patched subnav HTML in ${file}`);
    } else {
        console.log(`Could not find subnav block in ${file}`);
    }
}
