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

const replacementFunction = `function renderCarousel(trackId, items) {
    const track = document.getElementById(trackId);
    if (!track) return;

    let html = '';
    items.forEach(p => {
        const hasImage = p.image && p.image !== "PÉGALE_EL_LINK_AQUI";
        const imageHtml = hasImage 
            ? \`<img src="\${p.image}" alt="\${p.name}" style="width:100%; height:100%; object-fit:contain; padding:10px; background:white; border-radius:12px; position:absolute; top:0; left:0; z-index:1;" />\` 
            : \`<div style="width:100%; height:100%; display:flex; align-items:center; justify-content:center; background: radial-gradient(circle, #f8f8f8 0%, #e8e8e8 100%); position:absolute; top:0; left:0; z-index:1; border-radius:12px;">
                    <svg viewBox="0 0 24 24" fill="none" stroke="#ccc" stroke-width="1" style="width:60px; height:60px; opacity:0.5;"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
                </div>\`;

        html += \`
        <div class="product-card" onclick="window.location.href='/catalogo'">
            <div class="product-image-box" style="position:relative; overflow:hidden;">
                \${imageHtml}
                <span class="product-unit" style="position:relative; z-index:2;">\${p.unit}</span>
            </div>
            <div class="product-info">
                <h3 class="product-name">\${p.name}</h3>
                <p class="product-brand">\${p.brand}</p>
                <div class="product-price-row">
                    <span class="price-label"><span class="cov-dot"></span> MATRIZ</span>
                    <span class="status-available">DISPONIBLE</span>
                </div>
                <div class="view-all-container">
                    <span class="btn-view-catalog">Ver precio en catálogo &rarr;</span>
                </div>
            </div>
        </div>\`;
    });
    
    track.innerHTML = html;
}`;

for (const file of files) {
    const jsonPath = path.join(__dirname, 'src/webflow', file);
    if (!fs.existsSync(jsonPath)) continue;

    const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    if (data.js && data.js.length > 0) {
        let found = false;
        for (let i = 0; i < data.js.length; i++) {
            let jsCode = data.js[i];
            
            const startMarker = 'function renderCarousel(trackId, items) {';
            let startIdx = jsCode.indexOf(startMarker);
            
            if (startIdx !== -1) {
                let endIdx = jsCode.indexOf('track.innerHTML = html;', startIdx);
                if (endIdx !== -1) {
                    const closingBraceIdx = jsCode.indexOf('}', endIdx);
                    if (closingBraceIdx !== -1) {
                        const before = jsCode.substring(0, startIdx);
                        const after = jsCode.substring(closingBraceIdx + 1);
                        
                        data.js[i] = before + replacementFunction + after;
                        found = true;
                    }
                }
            }
        }
        
        if (found) {
            fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2), 'utf8');
            console.log(`Patched ${file} successfully.`);
        } else {
            console.log(`renderCarousel not found in any JS block of ${file}`);
        }
    }
}
