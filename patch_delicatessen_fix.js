const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/webflow/delicatessen.json');
let data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

// Task 1: Replace track-complementos in JS
const newTrackComplementos = `'track-complementos': [
        { unit: "FRASCO", name: "Aceitunas Rellenas de Anchoa 300g", brand: "SERPIS", image: "" },
        { unit: "FRASCO", name: "Pimientos del Piquillo Enteros 390g", brand: "DANTZA", image: "" },
        { unit: "BOTELLA", name: "Vinagre Balsámico de Módena 500ml", brand: "BORGES", image: "" },
        { unit: "BOTELLA", name: "Aceite de Oliva Extra Virgen 1 L", brand: "CARBONELL", image: "" },
        { unit: "FRASCO", name: "Mermelada de Higo Artesanal 250g", brand: "LA VIEJA FÁBRICA", image: "" },
        { unit: "FRASCO", name: "Tapenade de Aceituna Negra 180g", brand: "IBÉRICA", image: "" }
    ]`;

const regexJs = /'track-complementos':\s*\[[\s\S]*?\n\s*\]/;
for (let i = 0; i < data.js.length; i++) {
    if (regexJs.test(data.js[i])) {
        data.js[i] = data.js[i].replace(regexJs, newTrackComplementos);
    }
}

// Task 2: Fix the white gap above the banner by removing the inline padding-top: 180px
const regexBody = /style="padding-top:\s*180px;\s*padding-bottom:\s*0;"/g;
if (regexBody.test(data.body)) {
    // 145px flush with navbar
    data.body = data.body.replace(regexBody, 'style="padding-top: 145px; padding-bottom: 0;"');
}

fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
console.log('Successfully patched delicatessen.json');
