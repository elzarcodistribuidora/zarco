const fs = require('fs');
const dirs = fs.readdirSync('/Users/andrevalleortega/Desktop');
const zarco = dirs.find(d => d.includes('imgs'));
console.log(`Found: "${zarco}"`);
