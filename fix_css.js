const fs = require('fs');
const path = require('path');

const files = [
    'cremeria.json',
    'embutidos.json',
    'abarrotes-basicos.json',
    'tiendas.json',
    'restaurantes.json',
    'cafeterias.json'
];

for (const file of files) {
    const jsonPath = path.join(__dirname, 'src/webflow', file);
    if (!fs.existsSync(jsonPath)) continue;

    let data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    let css = data.css;

    // Desktop Page Wrapper
    css = css.replace(
        /\.sector-page-wrapper\s*\{\s*padding-top:\s*180px;\s*padding-bottom:\s*80px;\s*position:\s*relative;\s*\}/g,
        '.sector-page-wrapper { padding-top: 130px; padding-bottom: 80px; position: relative;}'
    );

    // Mobile Page Wrapper
    css = css.replace(
        /\.sector-page-wrapper\s*\{\s*padding-top:\s*133px;\s*padding-bottom:\s*50px;\s*\}\s*\/\*\s*Ajustado a 133px como lo tenías\s*\*\//g,
        '.sector-page-wrapper { padding-top: 90px; padding-bottom: 50px; } /* Ajustado a 133px como lo tenías */'
    );

    // Desktop Subnav
    const oldDesktopSubnav = `/* SUBNAV ESTÁTICO */
.sector-subnav { background: var(--white); border-bottom: 1px solid var(--border-soft); padding: 25px 0; margin-bottom: 50px; box-shadow: 0 4px 20px rgba(0,0,0,0.02); }
.subnav-links { display: flex; justify-content: center; gap: 50px; list-style: none; margin: 0; padding: 0; }
.subnav-links a { text-decoration: none; color: var(--text-muted); font-weight: 800; font-size: 1rem; text-transform: uppercase; letter-spacing: 1px; padding: 8px 4px; transition: all 0.3s ease; position: relative; }
.subnav-links a:hover { color: var(--zarco-blue); }
.subnav-links a::after { content: ''; position: absolute; bottom: -6px; left: 0; width: 100%; height: 3px; background: var(--zarco-red); transform: scaleX(0); transition: transform 0.3s ease; transform-origin: center; }
.subnav-links a:hover::after { transform: scaleX(1); }`;

    const newDesktopSubnav = `/* SUBNAV ESTÁTICO - PILL DESIGN */
.sector-subnav { background: transparent; border-bottom: none; padding: 10px 0; margin: 40px 0 50px 0; box-shadow: none; display: flex; justify-content: center; }
.subnav-links { display: flex; justify-content: center; gap: 12px; list-style: none; margin: 0; padding: 6px; background: var(--white); border: 1px solid var(--border-soft); border-radius: 50px; box-shadow: 0 10px 25px rgba(10,34,64,0.05); flex-wrap: wrap; }
.subnav-links a { text-decoration: none; color: var(--text-muted); font-weight: 800; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 1px; padding: 12px 24px; border-radius: 50px; transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); background: transparent; }
.subnav-links a:hover, .subnav-links a.active { color: var(--white); background: var(--zarco-blue); box-shadow: 0 4px 15px rgba(10,34,64,0.2); transform: translateY(-2px); }
.subnav-links a::after { display: none !important; }`;

    css = css.replace(oldDesktopSubnav, newDesktopSubnav);

    // Mobile Subnav
    const oldMobileSubnav = `.sector-subnav { padding: 15px 0; margin-bottom: 40px;}
    .subnav-links { justify-content: space-between; gap: 5px; padding: 0 2%; }
    .subnav-links a { font-size: 0.75rem; letter-spacing: 0.5px; padding: 6px 0; display: block; text-align: center;}`;

    const newMobileSubnav = `.sector-subnav { padding: 10px 0; margin: 30px 0 40px 0; }
    .subnav-links { justify-content: center; gap: 8px; padding: 8px 12px; border-radius: 20px; display: flex; flex-wrap: wrap; }
    .subnav-links a { font-size: 0.8rem; letter-spacing: 0.5px; padding: 8px 16px; display: inline-block; text-align: center; }`;

    css = css.replace(oldMobileSubnav, newMobileSubnav);

    data.css = css;
    fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`Fixed CSS for ${file}`);
}
