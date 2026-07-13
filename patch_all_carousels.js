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
    const jsonPath = path.join(__dirname, 'src/webflow', file);
    if (!fs.existsSync(jsonPath)) {
        console.log(`File not found: ${file}`);
        continue;
    }
    const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

    if (data.js && data.js.length > 0) {
        let jsCode = data.js[0];

        let parts = jsCode.split('<div class="product-image-box">');
        if (parts.length > 1) {
             let innerParts = parts[1].split('<span class="product-unit">');
             if (innerParts.length > 1) {
                 parts[1] = `
                \${p.image ? \`<img src="\${p.image}" alt="\${p.name}" style="width:100%; height:100%; object-fit:contain; padding:10px; background:white; border-radius:12px;" />\` : \`<div style="width:100%; height:100%; display:flex; align-items:center; justify-content:center; background: radial-gradient(circle, #f8f8f8 0%, #e8e8e8 100%);">
                    <svg viewBox="0 0 24 24" fill="none" stroke="#ccc" stroke-width="1" style="width:60px; height:60px; opacity:0.5;"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
                </div>\`}\n                <span class="product-unit">` + innerParts.slice(1).join('<span class="product-unit">');
                 jsCode = parts.join('<div class="product-image-box">');
                 
                 data.js[0] = jsCode;
                 fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2), 'utf8');
                 console.log(`Successfully patched ${file}`);
             } else {
                 console.log(`Could not find span.product-unit in ${file}`);
             }
        } else {
             console.log(`Could not find div.product-image-box in ${file}`);
        }
    } else {
        console.log(`No JS block in ${file}`);
    }
}
