const fs = require('fs');
const data = JSON.parse(fs.readFileSync('./src/webflow/cremeria.json', 'utf8'));

for (let key in data) {
    if (typeof data[key] === 'string' && data[key].includes('Queso Fresco Empacado 400g')) {
        console.log(`Found in string key: ${key}`);
    } else if (Array.isArray(data[key])) {
        for (let i = 0; i < data[key].length; i++) {
            if (typeof data[key][i] === 'string' && data[key][i].includes('Queso Fresco Empacado 400g')) {
                console.log(`Found in array key: ${key}[${i}]`);
            }
        }
    }
}
