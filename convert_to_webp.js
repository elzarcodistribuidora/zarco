const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const dir = './public/assets/cremeria/';
const jsonPath = './src/webflow/cremeria.json';

const files = [
    'queso_manchego_nochebuena_barra',
    'crema_enetra_alpura_1l',
    'crema_lala_200ml_caja_24_pz',
    'danonino_pack_bebible',
    'queso_asadero_la_villita',
    'queso_cotija_anejo_excelsior',
    'queso_doble_crema_chilchota',
    'queso_fresco_la_villita',
    'queso_gouda_edam_barra',
    'queso_mozarella_rayado_lala',
    'yoplait_fresa_1l',
    'yougurt_a_granel',
    'yougurt_alpura_125g_caja_24pz'
];

async function convertAndPatch() {
    for (const name of files) {
        const pngPath = path.join(dir, `${name}.png`);
        const webpPath = path.join(dir, `${name}.webp`);

        if (fs.existsSync(pngPath)) {
            try {
                await sharp(pngPath)
                    .webp({ quality: 80 })
                    .toFile(webpPath);
                
                // Delete the original PNG to save space
                fs.unlinkSync(pngPath);
                console.log(`Converted ${name}.png to ${name}.webp`);
            } catch (err) {
                console.error(`Failed converting ${name}.png:`, err);
            }
        }
    }

    // Now update cremeria.json
    const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

    for (let i = 0; i < data.js.length; i++) {
        if (typeof data.js[i] === 'string') {
            for (const name of files) {
                const oldPath = `/assets/cremeria/${name}.png`;
                const newPath = `/assets/cremeria/${name}.webp`;
                data.js[i] = data.js[i].replace(`image: "${oldPath}"`, `image: "${newPath}"`);
                data.js[i] = data.js[i].replace(`image: \\"${oldPath}\\"`, `image: \\"${newPath}\\"`);
            }
        }
    }

    fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2), 'utf8');
    console.log("JSON updated with .webp extensions.");
}

convertAndPatch();
