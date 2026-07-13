const fs = require('fs');
const path = require('path');
const webflowDir = 'src/webflow';
const publicAssets = 'public/assets';

const badFiles = ['cremeria.json', 'abarrotes-basicos.json', 'embutidos.json'];

for (const file of badFiles) {
    if (!fs.existsSync(path.join(webflowDir, file))) continue;
    let content = fs.readFileSync(path.join(webflowDir, file), 'utf8');
    
    // Find all product names in this file
    const regex = /name:\s*\\"([^"]+)\\",[^}]+image:\s*\\"([^"]+)\\"/g;
    let match;
    let newContent = content;
    
    while ((match = regex.exec(content)) !== null) {
        const name = match[1];
        const cleanName = name.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
        
        // If image was downloaded in public/assets
        if (fs.existsSync(path.join(publicAssets, `${cleanName}.webp`))) {
            const destUrl = `/assets/${cleanName}.webp`;
            
            // Replace the image url for this specific product
            const oldStr = `name: \\"${name}\\",`;
            // Find the position of the name
            const namePos = newContent.indexOf(oldStr);
            if (namePos !== -1) {
                const imgRegex = /image:\s*\\"[^"]+\\"/;
                const substring = newContent.substring(namePos, namePos + 500);
                const replaced = substring.replace(imgRegex, `image: \\"${destUrl}\\"`);
                newContent = newContent.substring(0, namePos) + replaced + newContent.substring(namePos + 500);
            }
        }
    }
    fs.writeFileSync(path.join(webflowDir, file), newContent, 'utf8');
    console.log('Fixed', file);
}

// Patch legal pages to include the price disclaimer
const legalFiles = ['terminos-del-servicio.json', 'catalogo.json'];

const disclaimerInner = `
    <div style="color: #b78103; flex-shrink: 0; margin-top: 2px;">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" width="20" height="20"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
    </div>
    <div>
        <h3 style="color: #9d6b00; margin: 0 0 4px 0; font-size: 0.95rem; font-weight: 700; font-family: 'Inter', sans-serif;">Nota Importante de Precios</h3>
        <p style="color: #856404; margin: 0; font-size: 0.85rem; line-height: 1.4; font-family: 'Inter', sans-serif;"><strong>Los precios mostrados son exclusivamente de referencia.</strong> Debido a la constante actualización y volatilidad del mercado en tienda física, el total final de su pedido podría tener variaciones. El precio definitivo será confirmado por nuestros agentes al procesar su solicitud.</p>
    </div>
`;

const disclaimerHTML = `
<div class="price-disclaimer" style="background-color: rgba(255, 193, 7, 0.08); border: 1px solid rgba(255, 193, 7, 0.3); border-radius: 12px; padding: 12px 16px; margin: 20px auto 40px auto; max-width: 700px; display: flex; align-items: flex-start; gap: 12px; box-shadow: 0 4px 15px rgba(255, 193, 7, 0.05);">
${disclaimerInner}
</div>
`;

for (const file of legalFiles) {
    const filePath = path.join(webflowDir, file);
    if (!fs.existsSync(filePath)) continue;
    
    let content = fs.readFileSync(filePath, 'utf8');
    let data;
    try {
        data = JSON.parse(content);
    } catch(e) { continue; }
    
    // Clean up old stuff
    data.body = data.body.replace(/<div class="legal-card" style="background-color: #fff3cd[^>]*>[\s\S]*?<\/div>\s*<\/div>/g, '');
    data.body = data.body.replace(/<div class="legal-card" style="background-color: #fff3cd[^>]*>[\s\S]*?<\/div>\s*/g, '');
    data.body = data.body.replace(/<div class="price-disclaimer"[^>]*>[\s\S]*?<\/div>\s*<\/div>/g, '');
    data.body = data.body.replace(/<section class="disclaimer-section"[^>]*>[\s\S]*?<\/section>/g, '');
    data.body = data.body.replace(/\\n/g, '');

    if (data.body && !data.body.includes('Nota Importante de Precios')) {
        if (file === 'terminos-del-servicio.json') {
            let anchor = '<div class="legal-content">';
            if (data.body.includes(anchor)) {
                data.body = data.body.replace(anchor, anchor + disclaimerHTML);
                fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
                console.log('Fixed pricing notice in', file);
            }
        } else if (file === 'catalogo.json') {
            // Put it right after pagination bar!
            const paginationRegex = /(<div class="pagination-bar">[\s\S]*?<\/div>\s*<\/div>)/;
            if (paginationRegex.test(data.body)) {
                data.body = data.body.replace(paginationRegex, '$1\n' + disclaimerHTML);
                fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
                console.log('Fixed pricing notice in', file);
            }
        }
    }
}



