const fs = require('fs');
const path = './src/webflow/delicatessen.json';
let data = JSON.parse(fs.readFileSync(path, 'utf8'));

let newSlides = '';
let newDots = '<span class="dot active"></span>\n';
for (let i = 1; i <= 8; i++) {
  newSlides += `
            <div class="slide">
                <picture>
                    <img src="/assets/deli-slider/${i}.png" loading="${i === 1 ? 'eager' : 'lazy'}" alt="Banner ${i}" style="width:100%; display:block; object-fit: cover;">
                </picture>
            </div>`;
  if (i > 1) {
    newDots += '            <span class="dot"></span>\n';
  }
}

data.body = data.body.replace(
  /(<div class="slider-wrapper" id="slider-wrapper-deli">)[\s\S]*?(<\/div>\s*<button class="slider-arrow prev")/g,
  `$1${newSlides}\n        $2`
);

data.body = data.body.replace(
  /(<div class="slider-dots" id="slider-dots-deli">)[\s\S]*?(<\/div>)/g,
  `$1\n            ${newDots.trim()}\n        $2`
);

fs.writeFileSync(path, JSON.stringify(data, null, 2));
console.log('Slider updated successfully.');
