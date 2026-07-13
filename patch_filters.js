const fs = require('fs');

const files = ['cremeria', 'embutidos', 'abarrotes-basicos', 'delicatessen', 'tiendas', 'restaurantes', 'cafeterias'];

const pillCSSDesktop = `/* SUBNAV ESTÁTICO - PILL DESIGN */
.sector-subnav { background: transparent; border-bottom: none; padding: 10px 0; margin-bottom: 50px; box-shadow: none; display: flex; justify-content: center; }
.subnav-links { display: flex; justify-content: center; gap: 12px; list-style: none; margin: 0; padding: 6px; background: var(--white); border: 1px solid var(--border-soft); border-radius: 50px; box-shadow: 0 10px 25px rgba(10,34,64,0.05); flex-wrap: wrap; }
.subnav-links a { text-decoration: none; color: var(--text-muted); font-weight: 800; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 1px; padding: 12px 24px; border-radius: 50px; transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); background: transparent; }
.subnav-links a:hover, .subnav-links a.active { color: var(--white); background: var(--zarco-blue); box-shadow: 0 4px 15px rgba(10,34,64,0.2); transform: translateY(-2px); }
.subnav-links a::after { display: none !important; }`;

const pillCSSMobile = `.sector-subnav { padding: 10px 0; margin-bottom: 40px; }
    .subnav-links { justify-content: center; gap: 8px; padding: 8px 12px; border-radius: 20px; display: flex; flex-wrap: wrap; }
    .subnav-links a { font-size: 0.8rem; letter-spacing: 0.5px; padding: 8px 16px; display: inline-block; text-align: center; }`;

for (const file of files) {
  try {
    const path = `./src/webflow/${file}.json`;
    let data = JSON.parse(fs.readFileSync(path, 'utf8'));
    let css = data.css;
    let body = data.body;

    const mediaIdx = css.indexOf('@media (max-width: 1024px)');
    if (mediaIdx === -1) {
      console.log(`Could not find media query in ${file}`);
      continue;
    }

    let cssBefore = css.substring(0, mediaIdx);
    let cssAfter = css.substring(mediaIdx);

    // Replace desktop CSS
    cssBefore = cssBefore.replace(/\/\* SUBNAV ESTÁTICO \*\/[\s\S]*?\.subnav-links a:hover::after\s*{[^}]*}/, pillCSSDesktop);

    // Replace mobile CSS
    cssAfter = cssAfter.replace(/\.sector-subnav\s*{[^}]*}\s*\.subnav-links\s*{[^}]*}\s*\.subnav-links a\s*{[^}]*}/, pillCSSMobile);

    // Also adjust padding for sector-page-wrapper (Desktop)
    cssBefore = cssBefore.replace(/\.sector-page-wrapper\s*{\s*padding-top:\s*180px;/g, '.sector-page-wrapper { padding-top: 130px;');
    // Mobile sector-page-wrapper padding
    cssAfter = cssAfter.replace(/\.sector-page-wrapper\s*{\s*padding-top:\s*(140px|133px);/g, '.sector-page-wrapper { padding-top: 90px;');

    css = cssBefore + cssAfter;

    // Add Delicatessen to Footer
    if (body.includes('Abarrotes Básicos</a></li>') && !body.includes('/delicatessen">Delicatessen</a>')) {
      body = body.replace(
        /(<li><a href="\/abarrotes-basicos">Abarrotes Básicos<\/a><\/li>)/ig,
        '$1\n<li><a href="/delicatessen">Delicatessen</a></li>'
      );
    } else if (body.includes('Abarrotes</a></li>') && !body.includes('/delicatessen">Delicatessen</a>')) {
      body = body.replace(
        /(<li><a href="\/abarrotes-basicos">Abarrotes<\/a><\/li>)/ig,
        '$1\n<li><a href="/delicatessen">Delicatessen</a></li>'
      );
    }

    // Add it to nav menus as well
    if (body.includes('<li><a href="/abarrotes-basicos" class="dropdown-link">Abarrotes</a></li>') && !body.includes('<li><a href="/delicatessen" class="dropdown-link">Delicatessen</a></li>')) {
        body = body.replace(
            /(<li><a href="\/abarrotes-basicos" class="dropdown-link">Abarrotes<\/a><\/li>)/ig,
            '$1\n<li><a href="/delicatessen" class="dropdown-link">Delicatessen</a></li>'
        );
    }
    
    if (body.includes('<li><a href="/abarrotes-basicos" class="mobile-dropdown-link" onclick="closeDrawer()">Abarrotes Básicos</a></li>') && !body.includes('<li><a href="/delicatessen" class="mobile-dropdown-link"')) {
        body = body.replace(
            /(<li><a href="\/abarrotes-basicos" class="mobile-dropdown-link"[^>]*>Abarrotes Básicos<\/a><\/li>)/ig,
            '$1\n<li><a href="/delicatessen" class="mobile-dropdown-link" onclick="closeDrawer()">Delicatessen</a></li>'
        );
    }

    data.css = css;
    data.body = body;
    fs.writeFileSync(path, JSON.stringify(data));
    console.log(`Patched ${file}.json`);
  } catch (e) {
    console.error(`Error processing ${file}:`, e);
  }
}
