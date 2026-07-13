const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const dir = './public/assets/embutidos/';
const jsonPath = './src/webflow/embutidos.json';

function cleanName(name) {
    return name
        .normalize('NFD').replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/\s+/g, '_');
}

const mappings = [
    { oldPath: '/assets/pechuga_de_pavo_virginia_zwan.webp', file: 'pechuga de pavo virginia zwan.png' },
    { oldPath: '/assets/jam_n_york_bernina_rebanado.webp', file: 'jamon york bernina rebanado.png' },
    { oldPath: '/assets/jam_n_virginia_de_pavo_alpino_barra.webp', file: 'jamon virginia de pavo alpino barra.png' },
    { oldPath: '/assets/jam_n_sabroso_loyval_5_3_kg.webp', file: 'jamon americano el mexicano en vez de loyval de 5.3kg.png' },
    { oldPath: '/assets/salchicha_para_asar_campestre.webp', file: 'salchicha para asar campestre bafar.png' },
    { oldPath: '/assets/chorizo_argentino_330_g.webp', file: 'chorizo argentino zwan.png' },
    { oldPath: '/assets/mortadela_fud_barra.webp', file: 'mortadela fud barra.png' },
    { oldPath: '/assets/chilorio_de_cerdo_empacado.webp', file: 'chilorio de cerdo chata.png' },
    { oldPath: '/assets/salami_madurado_para_panini.webp', file: 'salami madurado tangamanga.png' }
];

async function convertAndPatch() {
    for (const item of mappings) {
        const pngPath = path.join(dir, item.file);
        const newFileBase = cleanName(item.file).replace('.png', '');
        const webpPath = path.join(dir, `${newFileBase}.webp`);
        item.newPath = `/assets/embutidos/${newFileBase}.webp`;

        if (fs.existsSync(pngPath)) {
            try {
                await sharp(pngPath)
                    .webp({ quality: 80 })
                    .toFile(webpPath);
                
                fs.unlinkSync(pngPath);
                console.log(`Converted ${item.file} to ${newFileBase}.webp`);
            } catch (err) {
                console.error(`Failed converting ${item.file}:`, err);
            }
        } else {
            console.log(`Could not find ${item.file}`);
        }
    }

    const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

    for (let i = 0; i < data.js.length; i++) {
        if (typeof data.js[i] === 'string') {
            for (const item of mappings) {
                data.js[i] = data.js[i].replace(`image: "${item.oldPath}"`, `image: "${item.newPath}"`);
                data.js[i] = data.js[i].replace(`image: \\"${item.oldPath}\\"`, `image: \\"${item.newPath}\\"`);
            }
            
            // Reemplazo especial por el cambio de Loyval a El Mexicano
            data.js[i] = data.js[i].replace('name: \\"Jamón Sabroso Loyval 5.3 Kg\\"', 'name: \\"Jamón Americano El Mexicano 5.3 Kg\\"');
            data.js[i] = data.js[i].replace('brand: \\"LOYVAL\\"', 'brand: \\"EL MEXICANO\\"');
            data.js[i] = data.js[i].replace('name: "Jamón Sabroso Loyval 5.3 Kg"', 'name: "Jamón Americano El Mexicano 5.3 Kg"');
            data.js[i] = data.js[i].replace('brand: "LOYVAL"', 'brand: "EL MEXICANO"');
        }
    }

    fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2), 'utf8');
    console.log("JSON updated with Embutidos.");
}

convertAndPatch();
