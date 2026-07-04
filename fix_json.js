const fs = require('fs');
const path = require('path');
const webflowDir = 'src/webflow';
const publicAssets = 'public/assets';

const badFiles = ['cremeria.json', 'abarrotes-basicos.json', 'embutidos.json'];

for (const file of badFiles) {
    if (!fs.existsSync(path.join(webflowDir, file))) continue;
    let content = fs.readFileSync(path.join(webflowDir, file), 'utf8');
    
    // Find all product names in this file
    const regex = /name:\s*\\"([^"]+)\\",[^}]+image:\s*\\"([^"]+)\\"/g;
    let match;
    let newContent = content;
    
    while ((match = regex.exec(content)) !== null) {
        const name = match[1];
        const cleanName = name.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
        
        // If image was downloaded in public/assets
        if (fs.existsSync(path.join(publicAssets, `${cleanName}.webp`))) {
            const destUrl = `/assets/${cleanName}.webp`;
            
            // Replace the image url for this specific product
            const oldStr = `name: \\"${name}\\",`;
            // Find the position of the name
            const namePos = newContent.indexOf(oldStr);
            if (namePos !== -1) {
                const imgRegex = /image:\s*\\"[^"]+\\"/;
                const substring = newContent.substring(namePos, namePos + 500);
                const replaced = substring.replace(imgRegex, `image: \\"${destUrl}\\"`);
                newContent = newContent.substring(0, namePos) + replaced + newContent.substring(namePos + 500);
            }
        }
    }
    fs.writeFileSync(path.join(webflowDir, file), newContent, 'utf8');
    console.log('Fixed', file);
}
