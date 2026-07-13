const fs = require('fs');

const files = ['cremeria', 'embutidos', 'abarrotes-basicos', 'delicatessen', 'tiendas', 'restaurantes', 'cafeterias'];

for (const file of files) {
  try {
    const data = JSON.parse(fs.readFileSync(`./src/webflow/${file}.json`, 'utf8'));
    const match = data.body.match(/<div class="[^"]*subnav[^"]*"/i) || data.body.match(/<nav class="[^"]*subnav[^"]*"/i) || data.body.match(/<div[^>]*class="[^"]*sector-subnav[^"]*"[^>]*>/i);
    console.log(`${file} subnav match:`, match ? match[0] : 'Not found');
    
    // Also let's find the full HTML block for the subnav to see its structure
    const fullSubnavMatch = data.body.match(/<div class="sector-subnav">[\s\S]*?<\/div>\s*<\/div>/i);
    if (fullSubnavMatch) {
      console.log(`\n${file} full subnav:\n`, fullSubnavMatch[0].substring(0, 300) + '...');
    }
  } catch (e) {
    console.log(`Could not read ${file}.json`);
  }
}
