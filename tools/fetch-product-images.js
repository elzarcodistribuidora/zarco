const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const google = require('/private/tmp/node_modules/googlethis');

const webflowDir = 'src/webflow';
const publicAssets = 'public/assets';

const files = fs.readdirSync(webflowDir).filter(f => f.endsWith('.json'));

let nameToImage = {};
let allProducts = [];

const goodFiles = files.filter(f => !['cremeria.json', 'abarrotes-basicos.json', 'embutidos.json'].includes(f));
for (const file of goodFiles) {
    const content = fs.readFileSync(path.join(webflowDir, file), 'utf8');
    const regex = /name:\s*\\"([^"]+)\\",[^}]+image:\s*\\"([^"]+)\\"/g;
    let match;
    while ((match = regex.exec(content)) !== null) {
        nameToImage[match[1]] = match[2];
    }
}

const badFiles = ['cremeria.json', 'abarrotes-basicos.json', 'embutidos.json'];

async function downloadAndConvert(url, destPath) {
    const tempPath = `/tmp/dl_${Date.now()}`;
    try {
        console.log(`Downloading ${url}...`);
        execSync(`curl -sL -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36" -H "Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8" --max-time 10 "${url}" -o "${tempPath}"`);
        execSync(`sips -s format webp "${tempPath}" --out "${destPath}" > /dev/null 2>&1`);
        fs.unlinkSync(tempPath);
        return true;
    } catch (e) {
        console.log(`sips failed, checking if file is valid...`);
        if (fs.existsSync(tempPath) && fs.statSync(tempPath).size > 1024) {
             fs.renameSync(tempPath, destPath);
             console.log(`Used original file format as fallback`);
             return true;
        }
        console.log(`Failed to download or convert: ${url}`);
        if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
        return false;
    }
}

async function run() {
    let toSearch = [];
    let toReuse = [];

    for (const file of badFiles) {
        if (!fs.existsSync(path.join(webflowDir, file))) continue;
        let content = fs.readFileSync(path.join(webflowDir, file), 'utf8');
        const regex = /name:\s*\\"([^"]+)\\",[^}]+image:\s*\\"([^"]+)\\"/g;
        let match;
        
        while ((match = regex.exec(content)) !== null) {
            const name = match[1];
            const currentImg = match[2];
            
            if (nameToImage[name]) {
                if (currentImg !== nameToImage[name]) {
                    toReuse.push({ name, old: currentImg, new: nameToImage[name] });
                }
            } else {
                if (currentImg.includes('/assets/cremeria/') || currentImg.includes('/assets/abarrotes/') || currentImg.includes('/assets/embutidos/')) {
                    if (!toSearch.find(x => x.name === name)) {
                        toSearch.push({ name, currentImg });
                    }
                }
            }
        }
    }

    console.log(`Need to reuse ${toReuse.length} images...`);
    console.log(`Need to search ${toSearch.length} new images...`);

    let newlyFound = {};
    const options = { page: 0, safe: false, additional_params: { hl: 'es' } };

    for (const item of toSearch) {
        console.log(`Searching for: ${item.name}`);
        try {
            const results = await google.image(item.name, options);
            if (results && results.length > 0) {
                let success = false;
                for (const res of results.slice(0, 3)) {
                    const cleanName = item.name.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
                    const destPath = path.join(publicAssets, `${cleanName}.webp`);
                    const destUrl = `/assets/${cleanName}.webp`;
                    
                    if (fs.existsSync(destPath)) {
                        newlyFound[item.name] = destUrl;
                        success = true;
                        break;
                    }
                    
                    const downloaded = await downloadAndConvert(res.url, destPath);
                    if (downloaded) {
                        newlyFound[item.name] = destUrl;
                        success = true;
                        break;
                    }
                }
                if (!success) {
                    console.log(`All top 3 images failed for ${item.name}`);
                }
            } else {
                console.log(`No results for ${item.name}`);
            }
        } catch (e) {
            console.error(`Error searching ${item.name}:`, e.message);
        }
    }

    for (const file of badFiles) {
        if (!fs.existsSync(path.join(webflowDir, file))) continue;
        let content = fs.readFileSync(path.join(webflowDir, file), 'utf8');
        
        let modifications = 0;
        
        for (const reuse of toReuse) {
            const re = new RegExp(`name: \\\\"${reuse.name}\\\\",([^}]+)image: \\\\"[^"]+\\\\"`, 'g');
            content = content.replace(re, `name: \\"${reuse.name}\\",$1image: \\"${reuse.new}\\"`);
            modifications++;
        }
        
        for (const item of toSearch) {
            if (newlyFound[item.name]) {
                const re = new RegExp(`name: \\\\"${item.name}\\\\",([^}]+)image: \\\\"[^"]+\\\\"`, 'g');
                content = content.replace(re, `name: \\"${item.name}\\",$1image: \\"${newlyFound[item.name]}\\"`);
                modifications++;
            }
        }
        
        fs.writeFileSync(path.join(webflowDir, file), content, 'utf8');
        console.log(`Updated ${file} with ${modifications} changes.`);
    }
}

run();
