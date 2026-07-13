const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/webflow/delicatessen.json');
let data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

const newTrackComplementos = `'track-complementos': [
        { unit: "PIEZA", name: "Aceite Oliva Carbonell 500 ml", brand: "CARBONELL", image: "" },
        { unit: "PIEZA", name: "Mostaza Antigua 210 g", brand: "IMPORTADO", image: "" },
        { unit: "PIEZA", name: "Mostaza Dijon 215 g", brand: "IMPORTADO", image: "" },
        { unit: "KILO", name: "Aceituna 1 kg", brand: "ABARROTES", image: "" },
        { unit: "PIEZA", name: "Salsa BBQ Love & Kitchen 4 kg", brand: "LOVE & KITCHEN", image: "" },
        { unit: "PIEZA", name: "Mermelada Rica Frut Kilo", brand: "RICA FRUT", image: "" }
    ]`;

const regexJs = /'track-complementos':\s*\[[\s\S]*?\n\s*\]/;
for (let i = 0; i < data.js.length; i++) {
    if (regexJs.test(data.js[i])) {
        data.js[i] = data.js[i].replace(regexJs, newTrackComplementos);
    }
}

fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
console.log('Successfully patched delicatessen.json with real products');
