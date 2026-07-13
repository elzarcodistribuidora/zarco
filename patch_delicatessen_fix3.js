const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/webflow/delicatessen.json');
let data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

const newTrackComplementos = `'track-complementos': [
        { unit: "PIEZA", name: "Queso de Cabra con Arándano 200 g", brand: "ARTESANAL", image: "" },
        { unit: "PIEZA", name: "Almendra Entera 1 kg", brand: "PREMIUM", image: "" },
        { unit: "PIEZA", name: "Nuez de la India Kilo", brand: "PREMIUM", image: "" },
        { unit: "PIEZA", name: "Arándanos 1 kg", brand: "PREMIUM", image: "" },
        { unit: "PIEZA", name: "Higos Cristalizados Kilo", brand: "ARTESANAL", image: "" },
        { unit: "PIEZA", name: "Vino Tinto Santa Rita 750 ml", brand: "SANTA RITA", image: "" }
    ]`;

const regexJs = /'track-complementos':\s*\[[\s\S]*?\n\s*\]/;
for (let i = 0; i < data.js.length; i++) {
    if (regexJs.test(data.js[i])) {
        data.js[i] = data.js[i].replace(regexJs, newTrackComplementos);
    }
}

fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
console.log('Successfully patched delicatessen.json with premium delicatessen products');
