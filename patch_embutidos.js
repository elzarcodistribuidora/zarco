const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/webflow/delicatessen.json');
let data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

const newTrackEmbutidos = `'track-embutidos': [
        { unit: "KILO", name: "Chorizo Español Maestro Choricero", brand: "MAESTRO CHORICERO", image: "/assets/delicatessen/embutidos/1.png" },
        { unit: "PIEZA", name: "Chorizo Español El Mexicano", brand: "EL MEXICANO", image: "/assets/delicatessen/embutidos/2.png" },
        { unit: "KILO", name: "Salami Calabrese Kilo", brand: "ARTESANAL", image: "/assets/delicatessen/embutidos/3.png" },
        { unit: "PIEZA", name: "Salami Ungaro 2.5 kg", brand: "PREMIUM", image: "/assets/delicatessen/embutidos/4.png" },
        { unit: "KILO", name: "Jamón de Pierna Fud Rebanado 1 kg", brand: "FUD", image: "/assets/delicatessen/embutidos/5.png" },
        { unit: "PIEZA", name: "Jamón Holandés de Pierna Fud", brand: "FUD", image: "/assets/delicatessen/embutidos/6.png" },
        { unit: "KILO", name: "Jamón Serrano Tangamanga", brand: "TANGAMANGA", image: "/assets/delicatessen/embutidos/7.png" },
        { unit: "KILO", name: "Pepperoni Peñaranda", brand: "PEÑARANDA", image: "/assets/delicatessen/embutidos/8.png" }
    ],`;

const regex = /'track-embutidos':\s*\[[\s\S]*?\],/;

let patched = false;
for (let i = 0; i < data.js.length; i++) {
    if (regex.test(data.js[i])) {
        data.js[i] = data.js[i].replace(regex, newTrackEmbutidos);
        patched = true;
    }
}

if (patched) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    console.log('Successfully patched delicatessen.json');
} else {
    console.log('Failed to find track-embutidos in delicatessen.json');
}
