const fs = require('fs');

const files = ['cremeria', 'embutidos', 'abarrotes-basicos', 'delicatessen', 'tiendas', 'restaurantes', 'cafeterias'];

for (const file of files) {
  try {
    const path = `./src/webflow/${file}.json`;
    let data = JSON.parse(fs.readFileSync(path, 'utf8'));
    let css = data.css;

    // We will find the `.sector-subnav` blocks that we injected earlier and update their margins.
    
    // Desktop:
    // original: .sector-subnav { background: transparent; border-bottom: none; padding: 10px 0; margin-bottom: 50px; box-shadow: none; display: flex; justify-content: center; }
    // new: .sector-subnav { background: transparent; border-bottom: none; padding: 10px 0; margin: 50px 0; box-shadow: none; display: flex; justify-content: center; }
    css = css.replace(
      /\.sector-subnav\s*{\s*background:\s*transparent;\s*border-bottom:\s*none;\s*padding:\s*10px 0;\s*margin-bottom:\s*50px;/g,
      '.sector-subnav { background: transparent; border-bottom: none; padding: 10px 0; margin: 40px 0 50px 0;'
    );

    // Mobile:
    // original: .sector-subnav { padding: 10px 0; margin-bottom: 40px; }
    // new: .sector-subnav { padding: 10px 0; margin: 30px 0 40px 0; }
    css = css.replace(
      /\.sector-subnav\s*{\s*padding:\s*10px 0;\s*margin-bottom:\s*40px;\s*}/g,
      '.sector-subnav { padding: 10px 0; margin: 30px 0 40px 0; }'
    );

    data.css = css;
    fs.writeFileSync(path, JSON.stringify(data));
    console.log(`Patched margins in ${file}.json`);
  } catch (e) {
    console.error(`Error processing ${file}:`, e);
  }
}
