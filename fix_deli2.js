const fs = require('fs');

const deli = JSON.parse(fs.readFileSync('./src/webflow/delicatessen.json', 'utf8'));
const embu = JSON.parse(fs.readFileSync('./src/webflow/embutidos.json', 'utf8'));

// find filter bar in embu
const embuBody = embu.body;
const deliBody = deli.body;

console.log("Embutidos filter bar class:");
const embuFilterMatch = embuBody.match(/<div class="[^"]*filter[^"]*"/i);
console.log(embuFilterMatch ? embuFilterMatch[0] : "Not found");

console.log("Delicatessen filter bar class:");
const deliFilterMatch = deliBody.match(/<div class="[^"]*filter[^"]*"/i);
console.log(deliFilterMatch ? deliFilterMatch[0] : "Not found");

// Check spacing between banners and navbar
// Normally this is padding-top on the first section.
console.log("Delicatessen first section:");
const deliFirstSectionMatch = deliBody.match(/<section[^>]*>/i);
console.log(deliFirstSectionMatch ? deliFirstSectionMatch[0] : "Not found");
