const fs = require('fs');

const jsonPath = './src/webflow/abarrotes-basicos.json';
const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

for (let i = 0; i < data.js.length; i++) {
    if (typeof data.js[i] === 'string') {
        // Replace Chipotle image
        data.js[i] = data.js[i].replace(
            `image: "/assets/chiles_chipotles_la_coste_a_380_g.webp"`, 
            `image: "/assets/abarrotes/11.webp"`
        );
        data.js[i] = data.js[i].replace(
            `image: \\"/assets/chiles_chipotles_la_coste_a_380_g.webp\\"`, 
            `image: \\"/assets/abarrotes/11.webp\\"`
        );

        // Replace Tostadas image and text
        data.js[i] = data.js[i].replace(
            `image: "/assets/tostada_ajonjol__la_casa_de_ma_z__caja_.webp"`, 
            `image: "/assets/abarrotes/8.webp"`
        );
        data.js[i] = data.js[i].replace(
            `image: \\"/assets/tostada_ajonjol__la_casa_de_ma_z__caja_.webp\\"`, 
            `image: \\"/assets/abarrotes/8.webp\\"`
        );

        // Update text for Tostadas
        data.js[i] = data.js[i].replace(
            'name: \\"Tostada Ajonjolí La Casa de Maíz (Caja)\\"', 
            'name: \\"Tostadas Charras (Caja)\\"'
        );
        data.js[i] = data.js[i].replace(
            'brand: \\"LA CASA DE MAÍZ\\"', 
            'brand: \\"CHARRAS\\"'
        );
        
        data.js[i] = data.js[i].replace(
            'name: "Tostada Ajonjolí La Casa de Maíz (Caja)"', 
            'name: "Tostadas Charras (Caja)"'
        );
        data.js[i] = data.js[i].replace(
            'brand: "LA CASA DE MAÍZ"', 
            'brand: "CHARRAS"'
        );
    }
}

fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2), 'utf8');
console.log("JSON updated for Chipotle and Tostadas Charras.");
