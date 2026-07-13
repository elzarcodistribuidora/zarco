const fs = require('fs');
const path = require('path');

const dir = './public/assets/cremeria/';
const jsonPath = './src/webflow/cremeria.json';
const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

function cleanName(name) {
    // Remove diacritics and convert spaces to underscores
    return name
        .normalize('NFD').replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/\s+/g, '_');
}

const files = [
    'Queso Manchego Nochebuena Barra.png',
    'crema enetra alpura 1l.png',
    'crema lala 200ml caja 24 pz.png',
    'danonino pack bebible.png',
    'queso asadero la villita.png',
    'queso cotija añejo excelsior.png',
    'queso doble crema chilchota.png',
    'queso fresco la villita.png',
    'queso gouda edam barra.png',
    'queso mozarella rayado lala.png',
    'yoplait fresa 1l.png',
    'yougurt a granel.png',
    'yougurt alpura 125g caja 24pz.png'
];

files.forEach(file => {
    const oldPath = path.join(dir, file);
    const newFile = cleanName(file);
    const newPath = path.join(dir, newFile);
    
    if (fs.existsSync(oldPath) && oldPath !== newPath) {
        fs.renameSync(oldPath, newPath);
        console.log(`Renamed: ${file} -> ${newFile}`);
    } else if (!fs.existsSync(oldPath) && fs.existsSync(newPath)) {
        console.log(`Already renamed: ${newFile}`);
    } else {
        console.log(`Could not find: ${oldPath}`);
    }

    // Now update the JSON string references
    // We previously encoded the URI:
    const encodedOld = encodeURI(file);
    const badPath = `/assets/cremeria/${encodedOld}`;
    const goodPath = `/assets/cremeria/${newFile}`;
    
    for (let i = 0; i < data.js.length; i++) {
        if (typeof data.js[i] === 'string') {
            data.js[i] = data.js[i].replace(`image: "${badPath}"`, `image: "${goodPath}"`);
            data.js[i] = data.js[i].replace(`image: \\"${badPath}\\"`, `image: \\"${goodPath}\\"`);
        }
    }
});

fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2), 'utf8');
console.log("JSON updated with clean paths.");
