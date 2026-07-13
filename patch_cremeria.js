const fs = require('fs');

const path = './src/webflow/cremeria.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));

// Helper to encode filenames but keep /assets/cremeria/ intact
const replaceImg = (oldPath, newFilename) => {
    const encoded = encodeURI(newFilename);
    const newPath = `/assets/cremeria/${encoded}`;
    
    // Replace exact image paths in js array
    for (let i = 0; i < data.js.length; i++) {
        if (typeof data.js[i] === 'string') {
            data.js[i] = data.js[i].replace(`image: "${oldPath}"`, `image: "${newPath}"`);
        }
    }
};

// track-frescos
replaceImg('/assets/queso_fresco_empacado_400g.webp', 'queso fresco la villita.png');
replaceImg('/assets/queso_cotija_a_ejo.webp', 'queso cotija añejo excelsior.png');
replaceImg('/assets/queso_doble_crema.webp', 'queso doble crema chilchota.png');

// track-madurados
replaceImg('/assets/queso_manchego_nochebuena_barra.webp', 'Queso Manchego Nochebuena Barra.png');
replaceImg('/assets/queso_gouda_edam_barra.webp', 'queso gouda edam barra.png');
replaceImg('/assets/queso_asadero_fundido.webp', 'queso asadero la villita.png');
replaceImg('/assets/queso_mozzarella_barra.webp', 'queso mozarella rayado lala.png');

// track-cremas
replaceImg('/assets/cremeria/13.webp', 'yougurt alpura 125g caja 24pz.png');
replaceImg('/assets/cremeria/14.webp', 'crema lala 200ml caja 24 pz.png');
replaceImg('/assets/cremeria/15.webp', 'danonino pack bebible.png');
replaceImg('/assets/crema_entera_alpura_1_litro.webp', 'crema enetra alpura 1l.png');
replaceImg('/assets/yogurt_yoplait_fresa_1_litro__pack_.webp', 'yoplait fresa 1l.png');
replaceImg('/assets/crema_premium_a_granel.webp', 'yougurt a granel.png');

fs.writeFileSync(path, JSON.stringify(data, null, 2), 'utf8');

const verification = [
    'queso fresco la villita.png',
    'Queso Manchego Nochebuena Barra.png',
    'yougurt alpura 125g caja 24pz.png'
];
verification.forEach(v => {
    const encoded = encodeURI(v);
    const found = data.js.some(s => typeof s === 'string' && s.includes(encoded));
    if (found) {
        console.log("Success replacing", v);
    } else {
        console.log("Failed replacing", v);
    }
});
