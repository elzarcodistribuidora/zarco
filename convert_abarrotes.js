const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const dir = './public/assets/abarrotes/';
const jsonPath = './src/webflow/abarrotes-basicos.json';

function cleanName(name) {
    return name
        .normalize('NFD').replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/\s+/g, '_');
}

const mappings = [
    { oldPath: '/assets/aceite_comestible_maravilla__caja_12_pz_.webp', file: 'aceita 123 en vez de maravilla.png' },
    { oldPath: '/assets/arroz_s_per_extra_bulto_25_kg.webp', file: 'arroz valle verde 1k.png' },
    { oldPath: '/assets/az_car_est_ndar_bulto_50_kg.webp', file: 'azucar 25k.png' },
    { oldPath: '/assets/caldo_de_pollo_knorr_suiza_1_5_kg.webp', file: 'caldo de polo knopr.png' },
    { oldPath: '/assets/salsa_c_tsup_bachi_3_8_kg.webp', file: 'catsup bachi.png' },
    { oldPath: '/assets/aderezo_tipo_mayonesa_bachi_3_8_kg.webp', file: 'mayonesa bachi.png' },
    { oldPath: '/assets/mayonesa_cl_sica_mccormick_390g__caja_.webp', file: 'mayonesa mckormick.png' },
    { oldPath: '/assets/frijoles_bayos_refritos_la_coste_a_3_kg.webp', file: 'frijoles la costeña.png' },
    { oldPath: '/assets/chiles_jalape_os_enteros_la_coste_a_2_8_kg.webp', file: 'jalapeños la costeña.png' },
    { oldPath: '/assets/at_n_en_aceite_dolores__caja_24_pz_.webp', file: 'atun dolores.png' },
    { oldPath: '/assets/aceituna_sin_hueso_13_kg.webp', file: 'aceituna sin hueso.png' },
    { oldPath: '', file: '11.png', keepOnly: true },
    { oldPath: '', file: '8.png', keepOnly: true }
];

async function convertAndPatch() {
    for (const item of mappings) {
        const pngPath = path.join(dir, item.file);
        const newFileBase = cleanName(item.file).replace('.png', '');
        const webpPath = path.join(dir, `${newFileBase}.webp`);
        item.newPath = `/assets/abarrotes/${newFileBase}.webp`;

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
                if (item.keepOnly) continue;
                data.js[i] = data.js[i].replace(`image: "${item.oldPath}"`, `image: "${item.newPath}"`);
                data.js[i] = data.js[i].replace(`image: \\"${item.oldPath}\\"`, `image: \\"${item.newPath}\\"`);
            }
            
            // Reemplazo especial por aceite 123
            data.js[i] = data.js[i].replace('name: \\"Aceite Comestible Maravilla (Caja 12 Pz)\\"', 'name: \\"Aceite Comestible 123 (Caja 12 Pz)\\"');
            data.js[i] = data.js[i].replace('brand: \\"MARAVILLA\\"', 'brand: \\"123\\"');
            data.js[i] = data.js[i].replace('name: "Aceite Comestible Maravilla (Caja 12 Pz)"', 'name: "Aceite Comestible 123 (Caja 12 Pz)"');
            data.js[i] = data.js[i].replace('brand: "MARAVILLA"', 'brand: "123"');

            // Reemplazo especial por arroz valle verde
            data.js[i] = data.js[i].replace('name: \\"Arroz Súper Extra Bulto 25 Kg\\"', 'name: \\"Arroz Súper Extra Valle Verde 1 Kg\\"');
            data.js[i] = data.js[i].replace('brand: \\"POR ASIGNAR\\"', 'brand: \\"VALLE VERDE\\"');
            data.js[i] = data.js[i].replace('unit: \\"BULTO\\", name: \\"Arroz Súper Extra Valle Verde 1 Kg\\"', 'unit: \\"KILO\\", name: \\"Arroz Súper Extra Valle Verde 1 Kg\\"');

            data.js[i] = data.js[i].replace('name: "Arroz Súper Extra Bulto 25 Kg"', 'name: "Arroz Súper Extra Valle Verde 1 Kg"');
            data.js[i] = data.js[i].replace('brand: "POR ASIGNAR"', 'brand: "VALLE VERDE"');
            data.js[i] = data.js[i].replace('unit: "BULTO", name: "Arroz Súper Extra Valle Verde 1 Kg"', 'unit: "KILO", name: "Arroz Súper Extra Valle Verde 1 Kg"');

            // Reemplazo especial por azucar 25k
            data.js[i] = data.js[i].replace('name: \\"Azúcar Estándar Bulto 50 Kg\\"', 'name: \\"Azúcar Estándar Bulto 25 Kg\\"');
            data.js[i] = data.js[i].replace('name: "Azúcar Estándar Bulto 50 Kg"', 'name: "Azúcar Estándar Bulto 25 Kg"');
        }
    }

    fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2), 'utf8');
    console.log("JSON updated with Abarrotes.");
}

convertAndPatch();
