const fs = require('fs');

const jsonPath = './src/webflow/abarrotes-basicos.json';
const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

for (let i = 0; i < data.js.length; i++) {
    if (typeof data.js[i] === 'string') {
        // We temporarily replace 11.webp with a placeholder, 
        // then 8.webp to 11.webp, 
        // then the placeholder to 8.webp.
        data.js[i] = data.js[i].replace(/11\.webp/g, 'TEMP_IMAGE.webp');
        data.js[i] = data.js[i].replace(/8\.webp/g, '11.webp');
        data.js[i] = data.js[i].replace(/TEMP_IMAGE\.webp/g, '8.webp');
    }
}

fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2), 'utf8');
console.log("Images swapped successfully.");
