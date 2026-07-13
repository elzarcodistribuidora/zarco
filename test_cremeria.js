const fs = require('fs');
const data = JSON.parse(fs.readFileSync('./src/webflow/cremeria.json', 'utf8'));
console.log(Object.keys(data));
if (data.body) {
  console.log("data.body length:", data.body.length);
}
// check if it's an array
console.log("Is array?", Array.isArray(data));
